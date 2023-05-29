/*
	This file is part of solidity.

	solidity is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	solidity is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with solidity.  If not, see <http://www.gnu.org/licenses/>.
*/
// SPDX-License-Identifier: GPL-3.0

#include <liblangutil/Common.h>
#include <libsolidity/ast/ASTJsonExporter.h>
#include <libsolidity/interface/CompilerStack.h>
#include <libsolutil/JSON.h>

#include <test/Common.h>
#include <test/libsolidity/ASTPropertyTest.h>

#include <boost/algorithm/string.hpp>
#include <boost/throw_exception.hpp>

#include <queue>

using namespace solidity::langutil;
using namespace solidity::frontend;
using namespace solidity::frontend::test;
using namespace solidity;
using namespace std;

namespace
{
    using StringPair = std::pair<std::string, std::string>;
    struct KeyValueParser
    {
    public:
        explicit KeyValueParser(string _input) : m_input(_input) {}
        vector<StringPair> parse();

    private:
        void skipWhitespace() { while(!isPastEnd() && isspace(m_currentChar)) advance(); }
        bool isPastEnd() { return m_position >= m_input.size(); }
        bool isValidValue(char c) { return isprint(c) && !isPastEnd(); }
        void reset();
        void advance();

        string m_input;
        char m_currentChar = 0;
        size_t m_position = 0;
    };

    void KeyValueParser::reset()
    {
        m_currentChar = 0;
        m_position = 0;
        if (!m_input.empty())
            m_currentChar = m_input[0];
    }

    void KeyValueParser::advance()
    {
        ++m_position;
        if (isPastEnd())
            m_currentChar = 0;
        else
            m_currentChar = m_input[m_position];
    }

    vector<StringPair> KeyValueParser::parse()
    {
        reset();
        vector<StringPair> parsedPairs;
        string testId;
        string testValue;
        while (!isPastEnd())
        {
            skipWhitespace();
            if (isIdentifierStart(m_currentChar))
            {
                testId.clear();
                while(isIdentifierPart(m_currentChar))
                {
                    testId += m_currentChar;
                    advance();
                }

                skipWhitespace();
                soltestAssert(m_currentChar == ':');
                advance();
                skipWhitespace();

                testValue.clear();
                while(isValidValue(m_currentChar))
                {
                    testValue += m_currentChar;
                    advance();
                }
                parsedPairs.emplace_back(testId, testValue);
            }
        }
        return parsedPairs;
    }
}

ASTPropertyTest::ASTPropertyTest(string const& _filename):
	TestCase(_filename)
{
	if (!boost::algorithm::ends_with(_filename, ".sol"))
		BOOST_THROW_EXCEPTION(runtime_error("Invalid test contract file name: \"" + _filename + "\"."));

    m_source = m_reader.source();
    readExpectations();
}

void ASTPropertyTest::generateTestCaseValues(string& _values, bool _obtained)
{
    _values.clear();
    for (auto testId: m_expectationsSequence)
    {
        soltestAssert(m_testCases.count(testId) > 0);
        _values +=
            testId +
            ": " +
            (_obtained ? m_testCases[testId].obtainedValue : m_testCases[testId].expectedValue)
            + "\n";
    }
}

void ASTPropertyTest::readExpectations()
{
    KeyValueParser parser{m_reader.simpleExpectations()};
    for (auto [testId, testExpectation] : parser.parse())
    {
        m_testCases.emplace(testId, ASTPropertyTestCase{testId, "", testExpectation, ""});
        m_expectationsSequence.push_back(testId);
    }
    generateTestCaseValues(m_expectation, false);
}

optional<Json::Value> ASTPropertyTest::findNode(Json::Value const& _root, string_view const& _property)
{
    if (!_property.empty())
    {
        string subNode = string(_property.substr(0, _property.find_first_of('.')));
        if (subNode != _property)
            return findNode(_root[subNode], _property.substr(_property.find_first_of('.') + 1));
        else if (_root.isMember(subNode))
            return make_optional(_root[subNode]);
    }
    return {};
}

void ASTPropertyTest::readTestedProperties(Json::Value const& _astJson)
{
    queue<Json::Value> nodesToVisit;
    nodesToVisit.push(_astJson);
    string documentation = "documentation";
    string testCaseLine;

    while(!nodesToVisit.empty())
    {
        auto& node = nodesToVisit.front();
        if (node.isObject())
        {
            for (auto memberName: node.getMemberNames())
                if (memberName == documentation)
                {
                    auto docNode = node[documentation];
                    testCaseLine = docNode.isObject() ?
                        docNode["text"].asString() :
                        docNode.asString();

                    soltestAssert(!testCaseLine.empty());
                    KeyValueParser parser{testCaseLine};
                    auto [testId, testedProperty] = parser.parse()[0];
                    m_testCases[testId].property = testedProperty;
                    auto propertyNode = findNode(node, testedProperty);
                    soltestAssert(propertyNode.has_value(), "Could not find "s + testedProperty);
                    soltestAssert(!propertyNode->isObject());
                    m_testCases[testId].obtainedValue = propertyNode->asString();
                }
                else
                    nodesToVisit.push(node[memberName]);
        }
        else if (node.isArray())
            for (
                Json::Value::const_iterator member = node.begin();
                member != node.end();
                ++member
            )
                nodesToVisit.push(*member);

        nodesToVisit.pop();
    }
    generateTestCaseValues(m_obtainedResult, true);
}

TestCase::TestResult ASTPropertyTest::run(ostream& _stream, string const& _linePrefix, bool const _formatted)
{
    CompilerStack compiler;

	compiler.setSources({{
		"A",
		"pragma solidity >=0.0;\n// SPDX-License-Identifier: GPL-3.0\n" + m_source
	}});
	compiler.setEVMVersion(solidity::test::CommonOptions::get().evmVersion());
	compiler.setOptimiserSettings(solidity::test::CommonOptions::get().optimize);
	if (!compiler.parseAndAnalyze())
		BOOST_THROW_EXCEPTION(runtime_error("Parsing contract failed"));

    Json::Value astJson = ASTJsonExporter(compiler.state()).toJson(compiler.ast("A"));
    soltestAssert(astJson);

    readTestedProperties(astJson);

    return checkResult(_stream, _linePrefix, _formatted);
}
