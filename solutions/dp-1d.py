def rob(nums):
    prev, curr = 0, 0
    for num in nums:
        prev, curr = curr, max(curr, prev + num)
    return curr


# ---- tests ----
assert rob([1, 2, 3, 1]) == 4
assert rob([2, 7, 9, 3, 1]) == 12
assert rob([2, 1, 1, 2]) == 4
assert rob([5]) == 5
assert rob([]) == 0
print("All tests passed!")
