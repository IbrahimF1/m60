from collections import defaultdict


# Group anagrams by their sorted-letter key.
def group_anagrams(words):
    groups = defaultdict(list)              # sorted letters -> bucket of words
    for word in words:
        groups[tuple(sorted(word))].append(word)
    return sorted(sorted(group) for group in groups.values())

# ---- tests ----
assert sorted(sorted(g) for g in group_anagrams(["bat", "bat", "cat"])) == [["bat", "bat"], ["cat"]]
assert sorted(sorted(g) for g in group_anagrams(["a", "a", "a"])) == [["a", "a", "a"]]
assert sorted(sorted(g) for g in group_anagrams(["ab", "ba", "abc", "cba"])) == [["ab", "ba"], ["abc", "cba"]]
assert sorted(sorted(g) for g in group_anagrams(["eat", "tea", "ate"])) == [["ate", "eat", "tea"]]
assert sorted(sorted(g) for g in group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])) == [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]
assert sorted(sorted(g) for g in group_anagrams(["aba", "baa", "aab", "ab", "ba", "abc"])) == [["aab", "aba", "baa"], ["ab", "ba"], ["abc"]]
assert sorted(sorted(g) for g in group_anagrams(["aab", "abb", "baa", "bba"])) == [["aab", "baa"], ["abb", "bba"]]
assert sorted(sorted(g) for g in group_anagrams(["", "", "ab", "ba", "aba"])) == [["", ""], ["ab", "ba"], ["aba"]]
assert group_anagrams([""]) == [[""]]
print("All tests passed!")
