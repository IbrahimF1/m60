def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return s[left + 1:right]


def longest_palindrome(s):
    best = ""
    for i in range(len(s)):
        for cand in (expand(s, i, i), expand(s, i, i + 1)):
            if len(cand) > len(best):
                best = cand
    return best


# ---- tests ----
assert longest_palindrome("babad") in ("bab", "aba")
assert longest_palindrome("cbbd") == "bb"
assert longest_palindrome("bananas") == "anana"
assert longest_palindrome("a") == "a"
assert longest_palindrome("") == ""
print("All tests passed!")
