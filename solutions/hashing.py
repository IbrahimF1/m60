from collections import defaultdict


# Group anagrams by their sorted-letter key.
def group_anagrams(words):
    groups = defaultdict(list)              # sorted letters -> bucket of words
    for word in words:
        groups[tuple(sorted(word))].append(word)
    return sorted(sorted(group) for group in groups.values())

# ---- tests ----
assert sorted(sorted(g) for g in group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])) == [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]
assert sorted(sorted(g) for g in group_anagrams(["ab", "ba", "abc", "cba"])) == [["ab", "ba"], ["abc", "cba"]]
assert group_anagrams([""]) == [[""]]
assert group_anagrams(["a"]) == [["a"]]
print("All tests passed!")
