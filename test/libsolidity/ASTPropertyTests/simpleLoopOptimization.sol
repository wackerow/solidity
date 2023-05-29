contract C {
  function f() public pure {
     /// TestCase1: isSimpleCounterLoop
     for(uint i = 0; i < 42; ++i) {
     }
     /// TestCase2: isSimpleCounterLoop
     for(uint i = 1; i < 42; i = i * 2) {
     }
  }
}
// ----
// TestCase1: true
// TestCase2: false
