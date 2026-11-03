def rob(nums):
    prev, curr = 0, 0
    for num in nums:
        prev, curr = curr, max(curr, prev + num)
    return curr


# ---- tests ----
assert rob([5]) == 5
assert rob([5, 1]) == 5
assert rob([4]) == 4
assert rob([2, 1, 1, 2]) == 4
assert rob([3, 2, 2, 3]) == 6
assert rob([1, 2, 3, 1]) == 4
assert rob([4, 10, 3, 1, 5]) == 15
assert rob([5, 1, 1, 5, 1]) == 10
assert rob([]) == 0
print("All tests passed!")
