# Merge overlapping intervals; return disjoint [start, end] pairs in order
def merge(intervals):
    merged = []
    for start, end in sorted(intervals):        # by start, then end
        if merged and start <= merged[-1][1]:   # touches the last block
            merged[-1][1] = max(merged[-1][1], end)   # extend it
        else:
            merged.append([start, end])         # start a new block
    return merged

# ---- tests ----
assert merge([[5, 6], [1, 2], [3, 4]]) == [[1, 2], [3, 4], [5, 6]]
assert merge([[10, 12], [1, 2]]) == [[1, 2], [10, 12]]
assert merge([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]
assert merge([[2, 6], [1, 3]]) == [[1, 6]]
assert merge([[1, 4], [2, 3]]) == [[1, 4]]
assert merge([[1, 4], [4, 5]]) == [[1, 5]]
assert merge([[1, 2], [2, 3], [3, 4]]) == [[1, 4]]
assert merge([[1, 2], [2, 3], [5, 6]]) == [[1, 3], [5, 6]]
assert merge([[2, 5]]) == [[2, 5]]
assert merge([]) == []
print("All tests passed!")
