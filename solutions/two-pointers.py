# numbers is sorted; return 1-indexed [left, right] of the pair that hits target.
def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        if total < target:
            left += 1            # sum too low: need a bigger number
        else:
            right -= 1           # sum too high: need a smaller number
    return []

# ---- tests ----
assert two_sum([2, 7, 11, 15], 9) == [1, 2]
assert two_sum([2, 3, 4], 6) == [1, 3]
assert two_sum([-1, 0], -1) == [1, 2]
assert two_sum([1, 2, 3, 4, 4, 9, 56, 90], 8) == [4, 5]
print("All tests passed!")
