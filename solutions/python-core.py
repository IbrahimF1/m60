def running_sum(nums):
    out = []
    total = 0
    for n in nums:
        total += n
        out.append(total)
    return out


# ---- tests ----
assert running_sum([1, 2, 3]) == [1, 3, 6]
assert running_sum([2, 2, 2]) == [2, 4, 6]
assert running_sum([1, 2, 3, 4]) == [1, 3, 6, 10]
assert running_sum([2, 2, 2, 2]) == [2, 4, 6, 8]
assert running_sum([]) == []
assert running_sum([5]) == [5]
print("All tests passed!")
