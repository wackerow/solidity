contract C {
    uint[] storageArray;
    function test_indices(uint256 len) public
    {
        while (storageArray.length < len)
            storageArray.push();
        while (storageArray.length > len)
            storageArray.pop();
        for (uint i = 0; i < len; i++)
            storageArray[i] = i + 1;

        for (uint i = 0; i < len; i++)
            require(storageArray[i] == i + 1);
    }
}
// ----
// test_indices(uint256): 1 ->
// test_indices(uint256): 129 ->
// gas irOptimized: 3006391
// gas legacy: 3069098
// gas legacyOptimized: 2995964
// test_indices(uint256): 5 ->
// gas irOptimized: 577369
// gas legacy: 574754
// gas legacyOptimized: 571847
// test_indices(uint256): 10 ->
// gas irOptimized: 157241
// gas legacy: 162468
// gas legacyOptimized: 156996
// test_indices(uint256): 15 ->
// gas irOptimized: 171721
// gas legacy: 179513
// gas legacyOptimized: 171596
// test_indices(uint256): 0xFF ->
// gas irOptimized: 5651831
// gas legacy: 5775928
// gas legacyOptimized: 5632556
// test_indices(uint256): 1000 ->
// gas irOptimized: 18092173
// gas legacy: 18583810
// gas legacyOptimized: 18037248
// test_indices(uint256): 129 ->
// gas irOptimized: 4145476
// gas legacy: 4164468
// gas legacyOptimized: 4108272
// test_indices(uint256): 128 ->
// gas irOptimized: 397849
// gas legacy: 463706
// gas legacyOptimized: 400909
// test_indices(uint256): 1 ->
// gas irOptimized: 581278
// gas legacy: 576904
// gas legacyOptimized: 575542
