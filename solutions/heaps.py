from collections import Counter
import heapq


# Return the k most frequent values, most frequent first.
def top_k_frequent(nums, k):
    counts = Counter(nums)                 # value -> frequency
    heap = []                              # min-heap on count, size <= k
    for value, count in counts.items():
        heapq.heappush(heap, (count, value))
        if len(heap) > k:
            heapq.heappop(heap)            # drop the least frequent
    return [value for count, value in sorted(heap, reverse=True)]

# ---- tests ----
assert top_k_frequent([5, 5, 5, 9, 9, 2], 3) == [5, 9, 2]
assert top_k_frequent([6, 6, 6, 6, 2, 2, 2, 7], 3) == [6, 2, 7]
assert top_k_frequent([1, 1, 1, 2, 2, 3], 2) == [1, 2]
assert top_k_frequent([2, 5, 5, 5, 9, 9], 2) == [5, 9]
assert top_k_frequent([7, 1, 1, 3, 3, 3], 1) == [3]
assert top_k_frequent([4, 4, 6, 6, 8, 8], 3) == [8, 6, 4]
assert top_k_frequent([1, 1, 2, 2], 2) == [2, 1]
print("All tests passed!")
