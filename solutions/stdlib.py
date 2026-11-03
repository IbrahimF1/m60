from collections import Counter


def is_anagram(s, t):
    return Counter(s) == Counter(t)


# ---- tests ----
assert is_anagram('abc', 'abc') is True
assert is_anagram('ab', 'ab') is True
assert is_anagram('anagram', 'nagaram') is True
assert is_anagram('ab', 'ba') is True
assert is_anagram('abcd', 'abcc') is False
assert is_anagram('aab', 'abb') is False
assert is_anagram('aabbcc', 'abcabc') is True
assert is_anagram('', '') is True and is_anagram('', 'a') is False
assert is_anagram('aabb', 'bbaa') is True and is_anagram('aabb', 'abbb') is False
print("All tests passed!")
