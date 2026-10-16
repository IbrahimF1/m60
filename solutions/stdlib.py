from collections import Counter


def is_anagram(s, t):
    return Counter(s) == Counter(t)


# ---- tests ----
assert is_anagram('anagram', 'nagaram') is True
assert is_anagram('rat', 'car') is False
assert is_anagram('', '') is True
assert is_anagram('a', 'ab') is False
assert is_anagram('aab', 'aba') is True
print("All tests passed!")
