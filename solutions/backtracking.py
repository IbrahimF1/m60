# Return every permutation of nums, as a list of lists
def permute(nums):
    result = []
    path = []

    def backtrack(remaining):
        if not remaining:              # path is one full arrangement
            result.append(path[:])     # snapshot: copy, never alias
            return
        for i, num in enumerate(remaining):
            path.append(num)           # choose
            backtrack(remaining[:i] + remaining[i + 1:])  # explore rest
            path.pop()                 # un-choose: restore the state

    backtrack(nums)
    return result

# ---- tests ----
assert permute([]) == [[]]
assert permute([1]) == [[1]]
assert sorted(permute([1, 2])) == [[1, 2], [2, 1]]
assert sorted(permute([1, 2, 3])) == [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
print("All tests passed!")
