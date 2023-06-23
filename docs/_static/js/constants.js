const [DARK, LIGHT] = ["dark", "light"];
const LIGHT_LOGO_PATH = "_static/img/logo.svg";
const DARK_LOGO_PATH = "_static/img/logo-dark.svg";

// SOLIDITY NAVIGATION LINKS
const SOLIDITY_HOME_URL = "https://solidity-website.vercel.app"; // TODO: Revert back to primary domain when ready
const BLOG_URL = `${SOLIDITY_HOME_URL}/blog`;
const DOCS_URL = "/";
const USE_CASES_PATH = `${SOLIDITY_HOME_URL}/use-cases`;
const CONTRIBUTE_PATH = `/en/latest/contributing.html`;
const ABOUT_PATH = `${SOLIDITY_HOME_URL}/about`;
const FORUM_URL = "https://forum.soliditylang.org/";

const NAV_LINKS = [
  { name: "Blog", href: BLOG_URL },
  { name: "Documentation", href: DOCS_URL },
  { name: "Use cases", href: USE_CASES_PATH },
  { name: "Contribute", href: CONTRIBUTE_PATH },
  { name: "About", href: ABOUT_PATH },
  { name: "Forum", href: FORUM_URL },
];
