def unique_paths(m, n):
    row = [1] * n
    for _ in range(m - 1):
        for j in range(1, n):
            row[j] += row[j - 1]
    return row[-1]


# ---- tests ----
assert unique_paths(3, 7) == 28
assert unique_paths(3, 2) == 3
assert unique_paths(3, 3) == 6
assert unique_paths(1, 1) == 1
assert unique_paths(2, 2) == 2
print("All tests passed!")
