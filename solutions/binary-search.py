# Total hours needed to finish every pile at speed k, one pile per hour.
def hours_at(piles, k):
    return sum(-(-p // k) for p in piles)   # ceil(p / k), no imports


# Smallest speed k that clears every pile within h hours.
def min_eating_speed(piles, h):
    lo, hi = 1, max(piles)               # smallest feasible speed
    while lo < hi:
        mid = (lo + hi) // 2
        if hours_at(piles, mid) <= h:
            hi = mid                     # feasible: try slower
        else:
            lo = mid + 1                 # too slow: eat faster
    return lo

# ---- tests ----
assert min_eating_speed([3, 6, 7, 11], 8) == 4
assert min_eating_speed([30, 11, 23, 4, 20], 5) == 30
assert min_eating_speed([30, 11, 23, 4, 20], 6) == 23
assert min_eating_speed([5], 3) == 2
print("All tests passed!")
