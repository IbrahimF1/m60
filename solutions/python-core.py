def running_sum(nums):
    out = []
    total = 0
    for n in nums:
        total += n
        out.append(total)
    return out


# ---- tests ----
assert running_sum([1, 2, 3, 4]) == [1, 3, 6, 10]
assert running_sum([1, 1, 1, 1, 1]) == [1, 2, 3, 4, 5]
assert running_sum([3, 1, 2, 10, 1]) == [3, 4, 6, 16, 17]
assert running_sum([]) == []
assert running_sum([5]) == [5]
print("All tests passed!")
