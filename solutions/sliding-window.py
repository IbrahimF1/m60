# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    last = {}                     # char -> most recent index seen
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1   # jump past the previous copy
        last[ch] = right
        best = max(best, right - left + 1)
    return best

# ---- tests ----
assert length_of_longest_substring("abcabcbb") == 3
assert length_of_longest_substring("bbbbb") == 1
assert length_of_longest_substring("pwwkew") == 3
assert length_of_longest_substring("dvdf") == 3
assert length_of_longest_substring("") == 0
print("All tests passed!")
