import { FIG } from "./figures.js";

export const PATTERNS_A = [
  {
    id: "hashing",
    title: "Hash Maps & Counting",
    minutes: 4,
    tagline: "One probe instead of one scan: count, group, and remember what you have seen.",
    body: `<h3>What a hash map buys you</h3>
<p>A <a href="https://docs.python.org/3/library/stdtypes.html#mapping-types-dict"><code>dict</code></a> maps keys to values with O(1) average lookup and insert. Two questions come up constantly: have I seen this, and how many times. A dict answers both in one probe; a <a href="https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset"><code>set</code></a> is the same trick with no values, membership only. The price is memory: O(n) extra space to stop re-reading the data.</p>
${FIG.probe}
<h3>Seen set, counts, buckets</h3>
<ul>
<li><strong>Seen set:</strong> add each item as you walk and test membership before you act. Use it for duplicates, repeated visits, and complements such as target minus the current value.</li>
<li><strong>Counting:</strong> <a href="https://docs.python.org/3/library/collections.html#collections.Counter"><code>Counter</code></a> builds a frequency map in one call. Equal frequencies mean anagrams, and a frequency signature can itself be the key of a bigger map.</li>
<li><strong>Buckets:</strong> a <a href="https://docs.python.org/3/library/collections.html#collections.defaultdict"><code>defaultdict(list)</code></a> maps one key to every item that shares it. Python preserves insertion order, so the output is deterministic.</li>
</ul>
<p>The shapes compose: a seen set inside a loop is a sliding window, two counters compared is an anagram check, and a bucket keyed by a signature is how most grouping problems end.</p>
<h3>Group anagrams: what makes two words equal</h3>
<p>Two words are anagrams when they match after sorting, so sort the letters of each word and group by the result.</p>
<pre><code>from collections import defaultdict

words = ["eat", "tea", "tan", "ate", "nat", "bat"]

groups = defaultdict(list)
for word in words:
    key = tuple(sorted(word))    # "eat" and "tea" share the key
    groups[key].append(word)

print(dict(groups))
</code></pre>
<p>When a problem keeps reaching for the same lookups, ask what makes two items equivalent, then lift that equivalence into a hashable key. A <a href="https://docs.python.org/3/library/functions.html#sorted"><code>sorted</code></a> tuple of characters is one answer; a frequency signature is another. Keys must be immutable, so lists cannot be keys, but tuples can.</p>
<p class="callout complexity"><strong>Complexity:</strong> O(n * k log k) time for n words of length up to k, since every word is sorted; O(n * k) space for the groups. Dict and set operations are O(1) average, O(n) worst case.</p>
`,
    exercise: {
      title: "Group Anagrams",
      prompt: `Given <code>words</code>, group the strings that are anagrams of one another. Two words are anagrams when one is a rearrangement of the other; return the groups in any order.`,
      leetcode: "https://leetcode.com/problems/group-anagrams/",
      docs: [
        { text: "Counter", url: "https://docs.python.org/3/library/collections.html#collections.Counter" },
        { text: "defaultdict", url: "https://docs.python.org/3/library/collections.html#collections.defaultdict" },
        { text: "dict: mapping types", url: "https://docs.python.org/3/library/stdtypes.html#mapping-types-dict" },
        { text: "set and frozenset", url: "https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset" },
        { text: "sorted()", url: "https://docs.python.org/3/library/functions.html#sorted" }
      ],
      starter: `from collections import defaultdict


# Group anagrams by their sorted-letter key.
def group_anagrams(words):
    pass  # TODO: your turn
`,
      tasks: [
        { text: "<strong>Bucket exact copies first.</strong> A dict keyed by the word itself already groups repeated spellings, before any letter gets rearranged.",
          moves: [
            "Make a defaultdict(list) for the buckets",
            "Append each word under itself as the key",
            "Sort each bucket, then sort the outer list"
          ],
          checks: [{ input: "[\"bat\", \"bat\", \"cat\"]", output: "[[bat, bat], [cat]]" }, { input: "[\"a\", \"a\", \"a\"]", output: "[[a, a, a]]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-hash-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="6" y="6" width="42" height="18" rx="6" class="st f2"/><text x="27" y="15" text-anchor="middle" dominant-baseline="central">bat</text><rect x="56" y="6" width="42" height="18" rx="6" class="st f2"/><text x="77" y="15" text-anchor="middle" dominant-baseline="central">bat</text><rect x="106" y="6" width="42" height="18" rx="6" class="st f2"/><text x="127" y="15" text-anchor="middle" dominant-baseline="central">cat</text><line x1="27" y1="26" x2="27" y2="36" class="st-k" marker-end="url(#ar-hash-1)"/><line x1="77" y1="26" x2="77" y2="36" class="st-k" marker-end="url(#ar-hash-1)"/><line x1="127" y1="26" x2="127" y2="36" class="st-k" marker-end="url(#ar-hash-1)"/><rect x="6" y="40" width="92" height="18" rx="6" class="st f5"/><text x="52" y="49" text-anchor="middle" dominant-baseline="central">bat bat</text><rect x="106" y="40" width="42" height="18" rx="6" class="st f5"/><text x="127" y="49" text-anchor="middle" dominant-baseline="central">cat</text><text x="196" y="49" text-anchor="middle" dominant-baseline="central" class="txd txs">same word</text></g></svg>`,
          tests: [
            "assert sorted(sorted(g) for g in group_anagrams([\"bat\", \"bat\", \"cat\"])) == [[\"bat\", \"bat\"], [\"cat\"]]",
            "assert sorted(sorted(g) for g in group_anagrams([\"a\", \"a\", \"a\"])) == [[\"a\", \"a\", \"a\"]]"
          ],
          hint: "Anagrams with different letter order still land in separate buckets here; that is the gap the next task closes." },
        { text: "<strong>Match rearrangements of the same letters.</strong> A frozenset drops order, so eat, tea, and ate share one key; append the original word, never the key.",
          moves: [
            "Swap the word key for frozenset(word)",
            "Append the original word into the bucket",
            "Test a two-pair input and a three-word group"
          ],
          checks: [{ input: "[\"ab\", \"ba\", \"abc\", \"cba\"]", output: "[[ab, ba], [abc, cba]]" }, { input: "[\"eat\", \"tea\", \"ate\"]", output: "[[ate, eat, tea]]" }, { input: "eat tea tan ate nat bat", output: "[[ate, eat, tea], [bat], [nat, tan]]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-hash-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="16" y="6" width="80" height="18" rx="6" class="st f5"/><text x="56" y="15" text-anchor="middle" dominant-baseline="central">{a, b}</text><rect x="126" y="6" width="96" height="18" rx="6" class="st f5"/><text x="174" y="15" text-anchor="middle" dominant-baseline="central">{a, b, c}</text><line x1="36" y1="26" x2="36" y2="36" class="st-k" marker-end="url(#ar-hash-2)"/><line x1="76" y1="26" x2="76" y2="36" class="st-k" marker-end="url(#ar-hash-2)"/><line x1="148" y1="26" x2="148" y2="36" class="st-k" marker-end="url(#ar-hash-2)"/><line x1="200" y1="26" x2="200" y2="36" class="st-k" marker-end="url(#ar-hash-2)"/><rect x="16" y="40" width="38" height="18" rx="6" class="st f2"/><text x="35" y="49" text-anchor="middle" dominant-baseline="central">ab</text><rect x="58" y="40" width="38" height="18" rx="6" class="st f2"/><text x="77" y="49" text-anchor="middle" dominant-baseline="central">ba</text><rect x="126" y="40" width="42" height="18" rx="6" class="st f2"/><text x="147" y="49" text-anchor="middle" dominant-baseline="central">abc</text><rect x="176" y="40" width="42" height="18" rx="6" class="st f2"/><text x="197" y="49" text-anchor="middle" dominant-baseline="central">cba</text></g></svg>`,
          tests: [
            "assert sorted(sorted(g) for g in group_anagrams([\"ab\", \"ba\", \"abc\", \"cba\"])) == [[\"ab\", \"ba\"], [\"abc\", \"cba\"]]",
            "assert sorted(sorted(g) for g in group_anagrams([\"eat\", \"tea\", \"ate\"])) == [[\"ate\", \"eat\", \"tea\"]]",
            "assert sorted(sorted(g) for g in group_anagrams([\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"])) == [[\"ate\", \"eat\", \"tea\"], [\"bat\"], [\"nat\", \"tan\"]]"
          ],
          hint: "A set ignores how many copies of a letter you have; that gap only shows up when letter counts differ." },
        { text: "<strong>Key by the full multiset.</strong> The key must remember counts, so use tuple(sorted(word)); aba and ab no longer collide.",
          moves: [
            "Key each word by tuple(sorted(word))",
            "Keep every occurrence, including repeated letters",
            "Mix lengths in one call to see aba apart from ab"
          ],
          checks: [{ input: "[\"aba\", \"baa\", \"aab\", \"ab\", \"ba\", \"abc\"]", output: "[[aab, aba, baa], [ab, ba], [abc]]" }, { input: "[\"aab\", \"abb\", \"baa\", \"bba\"]", output: "[[aab, baa], [abb, bba]]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-hash-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="8" y="6" width="40" height="18" rx="6" class="st f2"/><text x="28" y="15" text-anchor="middle" dominant-baseline="central">aba</text><line x1="50" y1="15" x2="72" y2="15" class="st-k" marker-end="url(#ar-hash-3)"/><rect x="76" y="6" width="24" height="18" rx="6" class="st f5"/><text x="88" y="15" text-anchor="middle" dominant-baseline="central">a</text><rect x="104" y="6" width="24" height="18" rx="6" class="st f5"/><text x="116" y="15" text-anchor="middle" dominant-baseline="central">a</text><rect x="132" y="6" width="24" height="18" rx="6" class="st f5"/><text x="144" y="15" text-anchor="middle" dominant-baseline="central">b</text><text x="170" y="15" text-anchor="middle" dominant-baseline="central" class="txd txs">counts kept</text><rect x="8" y="38" width="40" height="18" rx="6" class="st f2"/><text x="28" y="47" text-anchor="middle" dominant-baseline="central">ab</text><line x1="50" y1="47" x2="72" y2="47" class="st-k" marker-end="url(#ar-hash-3)"/><rect x="76" y="38" width="24" height="18" rx="6" class="st f5"/><text x="88" y="47" text-anchor="middle" dominant-baseline="central">a</text><rect x="104" y="38" width="24" height="18" rx="6" class="st f5"/><text x="116" y="47" text-anchor="middle" dominant-baseline="central">b</text><rect x="132" y="38" width="24" height="18" rx="6" class="st dsh"/><text x="144" y="47" text-anchor="middle" dominant-baseline="central" class="txd txs">-</text></g></svg>`,
          tests: [
            "assert sorted(sorted(g) for g in group_anagrams([\"aba\", \"baa\", \"aab\", \"ab\", \"ba\", \"abc\"])) == [[\"aab\", \"aba\", \"baa\"], [\"ab\", \"ba\"], [\"abc\"]]",
            "assert sorted(sorted(g) for g in group_anagrams([\"aab\", \"abb\", \"baa\", \"bba\"])) == [[\"aab\", \"baa\"], [\"abb\", \"bba\"]]"
          ],
          hint: "frozenset of aba equals frozenset of ab; sorted tuples do not, because one keeps the extra a." },
        { text: "<strong>Let empty words keep a group.</strong> The empty string keys to an empty tuple and stands on its own; no guard should skip it.",
          moves: [
            "Delete any check that skips an empty word",
            "The empty string keys to the empty tuple like any other word",
            "Return it in its own group when it is the only input"
          ],
          checks: [{ input: "[\"\", \"\", \"ab\", \"ba\", \"aba\"]", output: "[[\"\", \"\"], [ab, ba], [aba]]" }, { input: "[\"\"]", output: "[[\"\"]]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-hash-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="8" y="8" width="44" height="20" rx="6" class="st dsh"/><text x="30" y="18" text-anchor="middle" dominant-baseline="central" class="txs">empty</text><line x1="56" y1="18" x2="82" y2="18" class="st-k" marker-end="url(#ar-hash-4)"/><rect x="86" y="8" width="52" height="20" rx="6" class="st f5"/><text x="112" y="18" text-anchor="middle" dominant-baseline="central">( )</text><text x="152" y="18" text-anchor="start" dominant-baseline="central" class="txd txs">still a key</text><rect x="8" y="38" width="44" height="20" rx="6" class="st f2"/><text x="30" y="48" text-anchor="middle" dominant-baseline="central">a</text><line x1="56" y1="48" x2="82" y2="48" class="st-k" marker-end="url(#ar-hash-4)"/><rect x="86" y="38" width="52" height="20" rx="6" class="st f5"/><text x="112" y="48" text-anchor="middle" dominant-baseline="central">(a)</text><text x="152" y="48" text-anchor="start" dominant-baseline="central" class="txd txs">one group</text></g></svg>`,
          tests: [
            "assert sorted(sorted(g) for g in group_anagrams([\"\", \"\", \"ab\", \"ba\", \"aba\"])) == [[\"\", \"\"], [\"ab\", \"ba\"], [\"aba\"]]",
            "assert group_anagrams([\"\"]) == [[\"\"]]"
          ],
          hint: "A guard that skips empty strings silently drops a real group, and a single empty string still returns one group." }
      ],
      steps: [
        `from collections import defaultdict


# Step 1: bucket exact copies of the same word.
def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        groups[word].append(word)      # exact copies only
    return sorted(sorted(group) for group in groups.values())
`,
        `from collections import defaultdict


# Step 2: key each word by the set of its letters.
def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        groups[frozenset(word)].append(word)   # order gone, counts ignored
    return sorted(sorted(group) for group in groups.values())
`,
        `from collections import defaultdict


# Step 3: key each word by its sorted letters, but skip empty words.
def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        if not word:
            continue                    # no letters, no key
        groups[tuple(sorted(word))].append(word)
    return sorted(sorted(group) for group in groups.values())
`,
        `from collections import defaultdict


# Step 4: every word counts, including the empty one.
def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        groups[tuple(sorted(word))].append(word)
    return sorted(sorted(group) for group in groups.values())
`
      ],
      solution: `from collections import defaultdict


# Group anagrams by their sorted-letter key.
def group_anagrams(words):
    groups = defaultdict(list)              # sorted letters -> bucket of words
    for word in words:
        groups[tuple(sorted(word))].append(word)
    return sorted(sorted(group) for group in groups.values())
`
    }
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    minutes: 3,
    tagline: "Sort first, then walk both ends toward the middle; every step discards a candidate.",
    body: `<h3>Converging pointers</h3>
<p>Put one pointer at each end of a sorted list and move them toward each other. Every step tests one pair and discards one candidate, so the full scan stays linear. If the pair is too small, only a larger left value can help, so advance left. Too big, and only a smaller right value helps, so retreat right.</p>
${FIG.converge}
<p>Sorting is what makes the walk safe: it tells you which pointer may be abandoned. Keep that invariant in mind and the loop cannot walk past the answer. On unsorted data a converging walk has no direction to move in; the right tool there is a <a href="https://docs.python.org/3/library/stdtypes.html#mapping-types-dict"><code>dict</code></a> keyed by the values you have seen.</p>
<h3>Fix one, then two-point the rest</h3>
<ol>
<li>Sort the list.</li>
<li>Fix one index i; the pair you now hunt sums to the negation of nums[i].</li>
<li>Run converging pointers over the slice right of i, skipping equal values at both levels.</li>
</ol>
<p>An O(n) pass inside an O(n) loop is O(n^2), far under the O(n^3) brute force. Skip the duplicates or the same triple comes out more than once.</p>
<p>Partition-style walks use the same two cursors moving in opposite directions, with a different decision: swap elements that belong on the other side, or compact the survivors in place. Same circuit, different rule.</p>
<h3>Skeleton</h3>
<pre><code>nums = [2, 7, 11, 15]
target = 9

left, right = 0, len(nums) - 1
while left &lt; right:
    total = nums[left] + nums[right]
    if total == target:
        print("found at", left + 1, right + 1)
        break
    if total &lt; target:
        left += 1         # sum too low: need a bigger number
    else:
        right -= 1        # sum too high: need a smaller number
</code></pre>
<p>Sort unsorted input first with <a href="https://docs.python.org/3/library/functions.html#sorted"><code>sorted</code></a> and pay O(n log n); the pass itself stays O(n) time and O(1) space, and inside a 3Sum outer loop the sort is paid only once.</p>
<p class="callout complexity"><strong>Complexity:</strong> O(n) time and O(1) space after sorting, with each pointer moving at most n steps. 3Sum adds an outer loop for O(n^2) total.</p>
`,
    exercise: {
      title: "Two Sum II - Input Array Is Sorted",
      prompt: `The list <code>numbers</code> is sorted in non-decreasing order. Return the 1-based indices of the two entries that add up to <code>target</code>, smaller index first; exactly one solution exists and no element may be used twice.`,
      leetcode: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      docs: [
        { text: "common sequence operations", url: "https://docs.python.org/3/library/stdtypes.html#common-sequence-operations" },
        { text: "sorted()", url: "https://docs.python.org/3/library/functions.html#sorted" },
        { text: "Sorting HOW TO", url: "https://docs.python.org/3/howto/sorting.html" },
        { text: "Time complexity of Python types", url: "https://wiki.python.org/moin/TimeComplexity" }
      ],
      starter: `# numbers is sorted; return 1-indexed [left, right] of the pair that hits target.
def two_sum(numbers, target):
    pass  # TODO: your turn
`,
      tasks: [
        { text: "<strong>Walk in from both ends.</strong> Put left at the first cell and right at the last, test the pair, and stop as soon as it matches the target.",
          moves: [
            "Set left to 0 and right to len(numbers) - 1",
            "Loop while left is smaller than right",
            "Return [left + 1, right + 1] when the sum matches",
            "Advance left after a miss; the next task adds the right move"
          ],
          checks: [{ input: "[1, 2, 3, 4], target 5", output: "[1, 4]" }, { input: "[2, 3, 4], target 6", output: "[1, 3]" }, { input: "[1, 2], target 3", output: "[1, 2]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-tp-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="44" y="8" width="28" height="22" rx="6" class="st f5"/><text x="58" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="80" y="8" width="28" height="22" rx="6" class="st f2"/><text x="94" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="116" y="8" width="28" height="22" rx="6" class="st f2"/><text x="130" y="19" text-anchor="middle" dominant-baseline="central">3</text><rect x="152" y="8" width="28" height="22" rx="6" class="st f5"/><text x="166" y="19" text-anchor="middle" dominant-baseline="central">4</text><line x1="58" y1="50" x2="58" y2="34" class="st-k" marker-end="url(#ar-tp-1)"/><line x1="166" y1="50" x2="166" y2="34" class="st-k" marker-end="url(#ar-tp-1)"/><text x="58" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">left</text><text x="166" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">right</text><text x="112" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">1 + 4 = 5</text></g></svg>`,
          tests: [
            "assert two_sum([1, 2, 3, 4], 5) == [1, 4]",
            "assert two_sum([2, 3, 4], 6) == [1, 3]",
            "assert two_sum([1, 2], 3) == [1, 2]"
          ],
          hint: "A pair can include the first and last cells; test before moving either pointer." },
        { text: "<strong>Move the pointer that can help.</strong> When the sum is too small, only a larger left value helps; when it is too big, only a smaller right value helps.",
          moves: [
            "Compare the pair sum with target",
            "Advance left when the sum is too small",
            "Retreat right when the sum is too big, then test again"
          ],
          checks: [{ input: "[2, 7, 11, 15], target 9", output: "[1, 2]" }, { input: "[2, 3, 5, 8, 10], target 11", output: "[2, 4]" }, { input: "[-5, -3, 0, 4, 8], target 1", output: "[2, 4]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-tp-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="20" y="8" width="32" height="22" rx="6" class="st f5"/><text x="36" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="58" y="8" width="32" height="22" rx="6" class="st f2"/><text x="74" y="19" text-anchor="middle" dominant-baseline="central">7</text><rect x="96" y="8" width="32" height="22" rx="6" class="st f5"/><text x="112" y="19" text-anchor="middle" dominant-baseline="central">11</text><rect x="134" y="8" width="32" height="22" rx="6" class="st dsh"/><text x="150" y="19" text-anchor="middle" dominant-baseline="central">15</text><path d="M150 44 C150 32 124 30 116 34" class="st-k" marker-end="url(#ar-tp-2)"/><text x="150" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">too big: right - 1</text><text x="36" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">left</text></g></svg>`,
          tests: [
            "assert two_sum([2, 7, 11, 15], 9) == [1, 2]",
            "assert two_sum([2, 3, 5, 8, 10], 11) == [2, 4]",
            "assert two_sum([-5, -3, 0, 4, 8], 1) == [2, 4]"
          ],
          hint: "Advancing only left skips pairs whose right end must retreat, so each comparison decides exactly one move." },
        { text: "<strong>Keep both indices when values repeat.</strong> A value-to-index dict keeps one slot per value, so two equal numbers collapse; a converging walk never does.",
          moves: [
            "After a match, return both 1-based positions",
            "Duplicates must be allowed as two separate entries",
            "Walk left up and right down over the equal pair"
          ],
          checks: [{ input: "[1, 1, 2, 7], target 2", output: "[1, 2]" }, { input: "[-2, -2, 0, 1], target -4", output: "[1, 2]" }, { input: "[3, 3, 4, 5], target 6", output: "[1, 2]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-tp-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="44" y="8" width="30" height="22" rx="6" class="st f5"/><text x="59" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="80" y="8" width="30" height="22" rx="6" class="st f5"/><text x="95" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="116" y="8" width="30" height="22" rx="6" class="st f2"/><text x="131" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="152" y="8" width="30" height="22" rx="6" class="st f2"/><text x="167" y="19" text-anchor="middle" dominant-baseline="central">7</text><line x1="59" y1="50" x2="59" y2="34" class="st-k" marker-end="url(#ar-tp-3)"/><line x1="167" y1="50" x2="167" y2="34" class="st-d" marker-end="url(#ar-tp-3)"/><path d="M167 44 C150 32 118 32 98 40" class="st-k" marker-end="url(#ar-tp-3)"/><text x="112" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">two entries, both index 1</text></g></svg>`,
          tests: [
            "assert two_sum([1, 1, 2, 7], 2) == [1, 2]",
            "assert two_sum([-2, -2, 0, 1], -4) == [1, 2]",
            "assert two_sum([3, 3, 4, 5], 6) == [1, 2]"
          ],
          hint: "index[value] can point at the same entry twice; a pair needs two distinct positions." }
      ],
      steps: [
        `# numbers is sorted; return 1-indexed [left, right] of the pair that hits target.
def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        left += 1              # only the left pointer moves
    return []
`,
        `# numbers is sorted; return 1-indexed [left, right] of the pair that hits target.
def two_sum(numbers, target):
    index = {value: i for i, value in enumerate(numbers)}
    for value in numbers:
        other = target - value
        if other in index:
            return [index[value] + 1, index[other] + 1]
    return []
`,
        `# numbers is sorted; return 1-indexed [left, right] of the pair that hits target.
def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        if total < target:
            left += 1            # sum too low: need a bigger number
        else:
            right -= 1           # sum too high: need a smaller number
    return []
`
      ],
      solution: `# numbers is sorted; return 1-indexed [left, right] of the pair that hits target.
def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        if total < target:
            left += 1            # sum too low: need a bigger number
        else:
            right -= 1           # sum too high: need a smaller number
    return []
`
    }
  },
  {
    id: "sliding-window",
    title: "Sliding Window",
    minutes: 4,
    tagline: "Expand right, contract left; no element is ever rescanned.",
    body: `<h3>Fixed or variable window</h3>
<p>A window is a contiguous range [left, right] held by two pointers that only move forward. A fixed-size window of k elements adds one value on the right and drops one on the left, keeping a running state: a sum, a count, a small map. A variable window expands right freely, then contracts left until the window is valid again.</p>
<p>A window fits when the answer is a contiguous run and each step can update the state in O(1). Brute force rescans every window, O(n^2) or worse; sliding touches each element twice, once when right passes it and once when left does, for O(n). If the shape of the loop is unclear, write the brute force first; the inner re-scan you delete is the window.</p>
<h3>The loop shape</h3>
<ol>
<li>Advance right by one and fold the new element into the state.</li>
<li>While the state is invalid, remove the element at left and advance left.</li>
<li>Record the best answer now that the window is valid.</li>
</ol>
${FIG.window}
<p>Fixed windows skip the second step: they shrink once per advance, never in a while loop.</p>
<h3>Worked example: longest unique substring</h3>
<pre><code>s = "abcabcbb"
last = {}                    # char -&gt; most recent index
left = 0
best = 0
for right, ch in enumerate(s):
    if ch in last and last[ch] &gt;= left:
        left = last[ch] + 1  # contract past the duplicate
    last[ch] = right
    best = max(best, right - left + 1)
print(best)
</code></pre>
<p>Store the last index of each character rather than a plain flag, so left can jump straight past the previous copy instead of crawling one step at a time. An <a href="https://docs.python.org/3/library/functions.html#enumerate"><code>enumerate</code></a> pass and a <a href="https://docs.python.org/3/library/stdtypes.html#mapping-types-dict"><code>dict</code></a> are all the state this needs.</p>
<p class="callout complexity"><strong>Complexity:</strong> O(n) time, since right advances every iteration and left advances at most n times in total. Space is O(min(n, alphabet)) for the last-seen map.</p>
`,
    exercise: {
      title: "Longest Substring Without Repeating Characters",
      prompt: `Given a string <code>s</code>, return the length of the longest substring that contains no repeated characters. A substring is contiguous, and the window should expand on the right then contract on the left.`,
      leetcode: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      docs: [
        { text: "enumerate()", url: "https://docs.python.org/3/library/functions.html#enumerate" },
        { text: "max()", url: "https://docs.python.org/3/library/functions.html#max" },
        { text: "dict: mapping types", url: "https://docs.python.org/3/library/stdtypes.html#mapping-types-dict" },
        { text: "Time complexity of Python types", url: "https://wiki.python.org/moin/TimeComplexity" }
      ],
      starter: `# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    pass  # TODO: your turn
`,
      tasks: [
        { text: "<strong>Measure a run of distinct letters.</strong> When no letter repeats, every character belongs to the window, so its length is the whole string.",
          moves: [
            "Count how many distinct letters the string has",
            "Return that count as the best window",
            "Try two strings whose letters never repeat"
          ],
          checks: [{ input: "\"abc\"", output: "3" }, { input: "\"abcd\"", output: "4" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-sw-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="64" y="8" width="30" height="22" rx="6" class="st f2"/><text x="79" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="100" y="8" width="30" height="22" rx="6" class="st f2"/><text x="115" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="136" y="8" width="30" height="22" rx="6" class="st f2"/><text x="151" y="19" text-anchor="middle" dominant-baseline="central">c</text><line x1="64" y1="38" x2="64" y2="46" class="st-k"/><line x1="64" y1="46" x2="166" y2="46" class="st-k"/><line x1="166" y1="38" x2="166" y2="46" class="st-k"/><text x="115" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">three distinct letters, length 3</text></g></svg>`,
          tests: [
            "assert length_of_longest_substring(\"abc\") == 3",
            "assert length_of_longest_substring(\"abcd\") == 4"
          ],
          hint: "Distinct letters and longest run are the same thing only while no repeat has appeared." },
        { text: "<strong>Restart when a letter repeats.</strong> A repeat breaks the run, so begin a fresh window at the new letter and keep the best length seen so far.",
          moves: [
            "Track the current window in a set",
            "On a repeat, empty the set and add the current letter",
            "Update best with the window length every step"
          ],
          checks: [{ input: "\"pwwkew\"", output: "3 (wke)" }, { input: "\"abcabcbb\"", output: "3 (abc)" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-sw-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="18" y="8" width="24" height="22" rx="6" class="st dsh"/><text x="30" y="19" text-anchor="middle" dominant-baseline="central">p</text><rect x="48" y="8" width="24" height="22" rx="6" class="st dsh"/><text x="60" y="19" text-anchor="middle" dominant-baseline="central">w</text><rect x="78" y="8" width="24" height="22" rx="6" class="st f5"/><text x="90" y="19" text-anchor="middle" dominant-baseline="central">w</text><rect x="108" y="8" width="24" height="22" rx="6" class="st f5"/><text x="120" y="19" text-anchor="middle" dominant-baseline="central">k</text><rect x="138" y="8" width="24" height="22" rx="6" class="st f5"/><text x="150" y="19" text-anchor="middle" dominant-baseline="central">e</text><rect x="168" y="8" width="24" height="22" rx="6" class="st dsh"/><text x="180" y="19" text-anchor="middle" dominant-baseline="central">w</text><line x1="78" y1="38" x2="78" y2="46" class="st-k"/><line x1="78" y1="46" x2="162" y2="46" class="st-k"/><line x1="162" y1="38" x2="162" y2="46" class="st-k"/><text x="115" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">restart at the second w, then wke</text></g></svg>`,
          tests: [
            "assert length_of_longest_substring(\"pwwkew\") == 3",
            "assert length_of_longest_substring(\"abcabcbb\") == 3"
          ],
          hint: "Clearing to the current letter loses earlier letters that could still belong to the best run." },
        { text: "<strong>Jump past the last copy instead of clearing.</strong> Keep the index of every letter and move left to one past the previous copy, so letters after it survive.",
          moves: [
            "Store each letter and its most recent index",
            "On a repeat, set left to that index plus one",
            "Measure the window from left to right every step"
          ],
          checks: [{ input: "\"dvdf\"", output: "3 (vdf)" }, { input: "\"abbc\"", output: "2 (ab or bc)" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-sw-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="50" y="8" width="30" height="22" rx="6" class="st dsh"/><text x="65" y="19" text-anchor="middle" dominant-baseline="central">d</text><rect x="86" y="8" width="30" height="22" rx="6" class="st f5"/><text x="101" y="19" text-anchor="middle" dominant-baseline="central">v</text><rect x="122" y="8" width="30" height="22" rx="6" class="st f5"/><text x="137" y="19" text-anchor="middle" dominant-baseline="central">d</text><rect x="158" y="8" width="30" height="22" rx="6" class="st f5"/><text x="173" y="19" text-anchor="middle" dominant-baseline="central">f</text><path d="M137 38 C137 52 112 52 101 42" class="st-k" marker-end="url(#ar-sw-3)"/><text x="101" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">left = last[d] + 1, vdf survives</text></g></svg>`,
          tests: [
            "assert length_of_longest_substring(\"dvdf\") == 3",
            "assert length_of_longest_substring(\"abbc\") == 2"
          ],
          hint: "Clearing the window at the duplicate drops the v; jumping to one past the old d keeps it." },
        { text: "<strong>Only jump forward, never backward.</strong> A copy that already sits before left is stale, so ignore it; the empty string then needs no special case.",
          moves: [
            "Jump only when last[ch] is at or after left",
            "Let stale copies keep their old index",
            "Check the empty string, which has no windows at all"
          ],
          checks: [{ input: "\"abba\"", output: "2 (ab or ba)" }, { input: "\"abcbde\"", output: "4 (cbde)" }, { input: "\"\"", output: "0" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-sw-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="48" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="62" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="82" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="96" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="116" y="8" width="28" height="22" rx="6" class="st f5"/><text x="130" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="150" y="8" width="28" height="22" rx="6" class="st f5"/><text x="164" y="19" text-anchor="middle" dominant-baseline="central">a</text><path d="M62 38 C62 50 120 54 116 34" class="st-d dsh"/><line x1="116" y1="38" x2="116" y2="46" class="st-k"/><line x1="116" y1="46" x2="178" y2="46" class="st-k"/><line x1="178" y1="38" x2="178" y2="46" class="st-k"/><text x="147" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">left stops at the second b, window ba</text></g></svg>`,
          tests: [
            "assert length_of_longest_substring(\"abba\") == 2",
            "assert length_of_longest_substring(\"abcbde\") == 4",
            "assert length_of_longest_substring(\"\") == 0"
          ],
          hint: "Jumping to last[a] + 1 when a is behind left moves the window backward and overcounts." }
      ],
      steps: [
        `# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    return len(set(s))
`,
        `# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    window = set()
    best = 0
    for ch in s:
        if ch in window:
            window = set()          # drop the whole window
        window.add(ch)
        best = max(best, len(window))
    return best
`,
        `# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    last = {}                       # char -> most recent index
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last:
            left = last[ch] + 1     # no check that left moves forward
        last[ch] = right
        best = max(best, right - left + 1)
    return best
`,
        `# Length of the longest substring of s with no repeated character.
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
`
      ],
      solution: `# Length of the longest substring of s with no repeated character.
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
`
    }
  },
  {
    id: "binary-search",
    title: "Binary Search",
    minutes: 4,
    tagline: "When the answer is a number, binary search the answer space, not the array.",
    body: `<h3>One idea, two loop shapes</h3>
<p>Binary search halves a candidate range on every probe, so it settles in O(log n) steps. Two loop shapes keep coming back:</p>
<ul>
<li><strong>Exact search:</strong> <code>lo</code> and <code>hi</code> stay inclusive, the loop runs while <code>lo &lt;= hi</code>, and <code>mid</code> returns on equality.</li>
<li><strong>Boundary search:</strong> the loop runs while <code>lo &lt; hi</code>, moves <code>hi</code> to <code>mid</code> when the predicate holds and <code>lo</code> to <code>mid + 1</code> when it does not, then returns <code>lo</code>. This is the shape answer-space problems want.</li>
</ul>
<p>Python integers are arbitrary precision, so mid = (lo + hi) // 2 never overflows; skip the overflow guard you may remember from other languages. For a position inside a sorted list, the <a href="https://docs.python.org/3/library/bisect.html"><code>bisect</code></a> module already finds insertion points in O(log n); hand-write the loop only when the predicate is yours. Take the lower bound as 1 and the upper bound as the largest pile, since no speed beyond that range can ever be needed.</p>
<h3>Search the answer, not the array</h3>
<p>Koko Eating Bananas asks for the smallest speed that clears every pile within h hours. Speeds are too numerous to test one by one, but the predicate is monotone: if a speed finishes in time, every faster speed does too. Binary search the range of possible speeds instead, and test each midpoint by simulating the hours it needs; <a href="https://docs.python.org/3/library/functions.html#max"><code>max</code></a> of the piles is the safest upper bound.</p>
${FIG.halving}
<h3>Skeleton</h3>
<pre><code>piles = [3, 6, 7, 11]
h = 8

def can_finish(speed):
    hours = 0
    for pile in piles:
        hours += -(-pile // speed)   # ceil, without imports
    return hours &lt;= h

lo, hi = 1, max(piles)               # smallest feasible speed
while lo &lt; hi:
    mid = (lo + hi) // 2
    if can_finish(mid):
        hi = mid                     # feasible: try slower
    else:
        lo = mid + 1                 # too slow: eat faster
print(lo)
</code></pre>
<p>The pile array is only ever scanned; what halves is the range of speeds. That swap is what turns an O(n * m) scan into O(n log m).</p>
<p class="callout complexity"><strong>Complexity:</strong> O(n log m) time for n piles and the largest pile m: about log m guesses, each checked in one O(n) pass. O(1) extra space.</p>
`,
    exercise: {
      title: "Koko Eating Bananas",
      prompt: `Pile i holds <code>piles[i]</code> bananas and only <code>h</code> hours remain. Each hour Koko picks one pile and eats up to <code>k</code> bananas from it; a partially eaten pile keeps the rest for later hours. Return the smallest integer <code>k</code> that clears every pile in time.`,
      leetcode: "https://leetcode.com/problems/koko-eating-bananas/",
      docs: [
        { text: "bisect", url: "https://docs.python.org/3/library/bisect.html" },
        { text: "max()", url: "https://docs.python.org/3/library/functions.html#max" },
        { text: "min()", url: "https://docs.python.org/3/library/functions.html#min" },
        { text: "Time complexity of Python types", url: "https://wiki.python.org/moin/TimeComplexity" }
      ],
      starter: `# Total hours needed to finish every pile at speed k, one pile per hour.
def hours_at(piles, k):
    return sum(-(-p // k) for p in piles)   # ceil(p / k), no imports


# Smallest speed k that clears every pile within h hours.
def min_eating_speed(piles, h):
    pass  # TODO: your turn
`,
      tasks: [
        { text: "<strong>Start from the biggest pile.</strong> Eating one banana per hour is too slow, but eating a whole pile in one hour always fits, so the largest pile is a safe first answer.",
          moves: [
            "Read the largest pile with max(piles)",
            "Return it as a speed that always clears every pile",
            "Notice how much slack the hour budget has"
          ],
          checks: [{ input: "[2, 2, 2], h = 4", output: "2" }, { input: "[1, 2, 2], h = 4", output: "2" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-bs-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="26" y="8" width="30" height="22" rx="6" class="st f2"/><text x="41" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="62" y="8" width="30" height="22" rx="6" class="st f2"/><text x="77" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="98" y="8" width="30" height="22" rx="6" class="st f5"/><text x="113" y="19" text-anchor="middle" dominant-baseline="central">2</text><text x="146" y="19" text-anchor="start" dominant-baseline="central" class="txd txs">max pile = 2</text><text x="26" y="48" text-anchor="start" dominant-baseline="central" class="txd txs">speed 2: 1 + 1 + 1 = 3 hours, fits in 4</text></g></svg>`,
          tests: [
            "assert min_eating_speed([2, 2, 2], 4) == 2",
            "assert min_eating_speed([1, 2, 2], 4) == 2"
          ],
          hint: "The biggest pile is always feasible, but it is rarely the smallest feasible speed once hours are tight." },
        { text: "<strong>Search below the biggest pile.</strong> Set lo to 1 and hi to max(piles), test the midpoint with hours_at, and keep the half that can still hold the answer.",
          moves: [
            "Set lo to 1 and hi to max(piles)",
            "While lo is below hi, test mid",
            "If mid fits, move hi to mid; otherwise move lo past mid"
          ],
          checks: [{ input: "[1, 4], h = 4", output: "2" }, { input: "[2, 5], h = 5", output: "2" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-bs-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="26" y="8" width="30" height="22" rx="6" class="st f2"/><text x="41" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="62" y="8" width="30" height="22" rx="6" class="st f5"/><text x="77" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="98" y="8" width="30" height="22" rx="6" class="st f2"/><text x="113" y="19" text-anchor="middle" dominant-baseline="central">3</text><rect x="134" y="8" width="30" height="22" rx="6" class="st f2"/><text x="149" y="19" text-anchor="middle" dominant-baseline="central">4</text><rect x="170" y="8" width="30" height="22" rx="6" class="st f2"/><text x="185" y="19" text-anchor="middle" dominant-baseline="central">5</text><line x1="41" y1="38" x2="41" y2="46" class="st-k"/><line x1="41" y1="46" x2="185" y2="46" class="st-k"/><line x1="185" y1="38" x2="185" y2="46" class="st-k"/><text x="41" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">lo</text><text x="185" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">hi</text><text x="113" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">mid = 3 fits</text></g></svg>`,
          tests: [
            "assert min_eating_speed([1, 4], 4) == 2",
            "assert min_eating_speed([2, 5], 5) == 2"
          ],
          hint: "hi starts at max(piles) because no larger speed can beat it, and lo moves to mid + 1 only when mid fails." },
        { text: "<strong>Round every pile up.</strong> A pile smaller than the speed still costs a full hour, so floor division undercounts: [1, 9] at speed 3 needs 4 hours, not 3.",
          moves: [
            "Call hours_at(piles, mid) for the probe",
            "Let a partial pile cost a full hour",
            "Compare the rounded total with h"
          ],
          checks: [{ input: "[1, 9], h = 5", output: "3" }, { input: "[2, 9], h = 5", output: "3" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-bs-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="24" y="8" width="30" height="22" rx="6" class="st f2"/><text x="39" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="60" y="8" width="30" height="22" rx="6" class="st f5"/><text x="75" y="19" text-anchor="middle" dominant-baseline="central">9</text><text x="108" y="19" text-anchor="start" dominant-baseline="central" class="txd txs">speed 3: 1 + 3 = 4 hours</text><text x="24" y="46" text-anchor="start" dominant-baseline="central" class="txd txs">floor: 0 + 3 = 3, too low</text></g></svg>`,
          tests: [
            "assert min_eating_speed([1, 9], 5) == 3",
            "assert min_eating_speed([2, 9], 5) == 3"
          ],
          hint: "Floor division undercounts every partial pile, so the search settles on a speed that cannot finish in time." },
        { text: "<strong>Treat a full budget as success.</strong> A total exactly equal to h is feasible, so use at most h; the loop ends when lo meets hi, and that speed is the answer.",
          moves: [
            "Accept hours_at(mid) at most h, equality included",
            "Move hi to mid when it fits, lo to mid + 1 otherwise",
            "Return lo once the range collapses, even for one huge pile"
          ],
          checks: [{ input: "[3, 6, 7, 11], h = 8", output: "4" }, { input: "[30, 11, 23, 4, 20], h = 5", output: "30" }, { input: "[1000000000], h = 2", output: "500000000" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-bs-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="22" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="36" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="56" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="70" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="90" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="104" y="19" text-anchor="middle" dominant-baseline="central">3</text><rect x="124" y="8" width="28" height="22" rx="6" class="st f5"/><text x="138" y="19" text-anchor="middle" dominant-baseline="central">4</text><text x="162" y="19" text-anchor="start" dominant-baseline="central" class="txd txs">8 hours fits</text><text x="22" y="46" text-anchor="start" dominant-baseline="central" class="txd txs">lo = hi = 4, return 4</text></g></svg>`,
          tests: [
            "assert min_eating_speed([3, 6, 7, 11], 8) == 4",
            "assert min_eating_speed([30, 11, 23, 4, 20], 5) == 30",
            "assert min_eating_speed([1000000000], 2) == 500000000"
          ],
          hint: "Using hours strictly below h rejects the exact boundary and pushes the answer one speed too high." }
      ],
      steps: [
        `# Total hours needed to finish every pile at speed k, one pile per hour.
def hours_at(piles, k):
    return sum(-(-p // k) for p in piles)   # ceil(p / k), no imports


# Smallest speed k that clears every pile within h hours.
def min_eating_speed(piles, h):
    return max(piles)
`,
        `# Total hours needed to finish every pile at speed k, one pile per hour.
def hours_at(piles, k):
    return sum(-(-p // k) for p in piles)   # ceil(p / k), no imports


# Smallest speed k that clears every pile within h hours.
def min_eating_speed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        hours = sum(p // mid for p in piles)   # floors every pile
        if hours <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo
`,
        `# Total hours needed to finish every pile at speed k, one pile per hour.
def hours_at(piles, k):
    return sum(-(-p // k) for p in piles)   # ceil(p / k), no imports


# Smallest speed k that clears every pile within h hours.
def min_eating_speed(piles, h):
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours_at(piles, mid) < h:       # equality treated as a failure
            hi = mid
        else:
            lo = mid + 1
    return lo
`,
        `# Total hours needed to finish every pile at speed k, one pile per hour.
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
`
      ],
      solution: `# Total hours needed to finish every pile at speed k, one pile per hour.
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
`
    }
  },
  {
    id: "linked-lists",
    title: "Linked Lists",
    minutes: 3,
    tagline: "Walk, stash, rewire. Every operation is a handful of pointers.",
    body: `<h3>One reference, no shortcuts</h3>
<p>A linked list hands you the head and nothing else: no index to jump to, no length to read. You reach node k by walking k nodes, and you change the list by reassigning next pointers, never by rebuilding it. Two habits carry most problems: a dummy node in front so the first element needs no special case, and always saving the next node before you overwrite it. Indexing a list is O(1); indexing a list node is a walk.</p>
<p>Recursion is legal but usually the wrong shape: the call stack costs O(n) memory that the iterative version does not spend. Iterate, and keep the state in a handful of pointers.</p>
<h3>Three moves that solve most of it</h3>
<ul>
<li><strong>Slow and fast:</strong> advance one pointer a node at a time and the other by two. When fast falls off the end, slow sits at the middle; if the two ever meet, the list has a cycle.</li>
<li><strong>Reverse in place:</strong> walk with prev and curr, stash the next node, then flip one pointer per step.</li>
<li><strong>Weave:</strong> walk two lists at once and reassign next pointers, one node from each side per iteration.</li>
</ul>
${FIG.reorder}
<h3>Reorder List: split, reverse, weave</h3>
<p>Reorder List runs those moves in sequence, and the split is what keeps the weave cheap: reversing from the head would fight the tail. If extra memory is allowed, a <a href="https://docs.python.org/3/library/collections.html#collections.deque"><code>deque</code></a> gives a lazier route: load the nodes once, then pop alternately from the front and back.</p>
<pre><code>if not head or not head.next:      # nothing to reorder
    return head

slow, fast = head, head.next       # slow stops before the middle
while fast and fast.next:
    slow, fast = slow.next, fast.next.next

second, slow.next = slow.next, None
prev = None                        # reverse the back half
while second:
    second.next, prev, second = prev, second, second.next

first, second = head, prev         # weave, one node from each half
while second:
    nxt1, nxt2 = first.next, second.next
    first.next, second.next = second, nxt1
    first, second = nxt1, nxt2
</code></pre>
<p>Every pointer is saved in a temporary before it is overwritten, and that one discipline prevents nearly every linked-list bug. Tests get easy when a helper flattens the result into Python values with a loop and <a href="https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types"><code>append</code></a>.</p>
<p class="callout complexity"><strong>Complexity:</strong> O(n) time over three linear passes and O(1) extra space; the nodes are rewired, never copied.</p>
`,
    exercise: {
      title: "Reorder List",
      prompt: `Reorder the chain so it reads first, last, second, second-to-last, and so on: L0, L1, ..., Ln becomes L0, Ln, L1, Ln-1, .... Do it in place, and return the head.`,
      leetcode: "https://leetcode.com/problems/reorder-list/",
      docs: [
        { text: "deque", url: "https://docs.python.org/3/library/collections.html#collections.deque" },
        { text: "mutable sequence types", url: "https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types" },
        { text: "common sequence operations", url: "https://docs.python.org/3/library/stdtypes.html#common-sequence-operations" },
        { text: "Time complexity of Python types", url: "https://wiki.python.org/moin/TimeComplexity" }
      ],
      starter: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build_list(values):
    head = None
    for value in reversed(values):
        head = ListNode(value, head)
    return head


def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


# Reorder L0, L1, ..., Ln into L0, Ln, L1, Ln-1, ... in place; return the head.
def reorder_list(head):
    pass  # TODO: your turn
`,
      tasks: [
        { text: "<strong>One stitch: move the last node up, right after the head.</strong> The predecessor of the last node is the pointer you rewrite to cut it free.",
          moves: [
            "Walk a prev/cur pair down until cur is the last node",
            "Cut the tail: point prev.next at None",
            "Splice: last.next takes head.next, then head.next takes last"
          ],
          checks: [{ input: "1 2 3", output: "1 3 2" }, { input: "1 2", output: "1 2" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="art1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="10" y="26" width="26" height="22" rx="7" class="st f2"/><text x="23" y="37.5" text-anchor="middle" dominant-baseline="central">1</text><rect x="68" y="26" width="26" height="22" rx="7" class="st f2"/><text x="81" y="37.5" text-anchor="middle" dominant-baseline="central">2</text><rect x="160" y="26" width="26" height="22" rx="7" class="st dsh"/><text x="173" y="37.5" text-anchor="middle" dominant-baseline="central">3</text><line x1="38" y1="37" x2="64" y2="37" class="st-k" marker-end="url(#art1)"/><line x1="96" y1="37" x2="156" y2="37" class="st-d dsh"/><path d="M173 24 C150 6 122 6 102 22" class="st-k" marker-end="url(#art1)"/></g></svg>`,
          tests: [
            "assert to_list(reorder_list(build_list([1, 2, 3]))) == [1, 3, 2]",
            "assert to_list(reorder_list(build_list([1, 2]))) == [1, 2]"
          ],
          hint: "A single walking pointer cannot detach the tail; you always need the node before the one you remove." },
        { text: "<strong>Repeat the stitch down the chain.</strong> After a stitch, the same job remains on the chain that starts two nodes past the head.",
          moves: [
            "After one stitch, restart the same walk at head.next.next",
            "Stop when fewer than three nodes remain",
            "Odd lengths strand a middle node at the end; even lengths meet exactly"
          ],
          checks: [{ input: "1 2 3 4", output: "1 4 2 3" }, { input: "1 2 3 4 5", output: "1 5 2 4 3" }, { input: "1 2 3 4 5 6 7", output: "1 7 2 6 3 5 4" }],
          diagram: `<svg viewBox="0 0 260 74" aria-hidden="true" focusable="false"><defs><marker id="art2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="8" y="16" width="26" height="22" rx="7" class="st f5"/><text x="21" y="27.5" text-anchor="middle" dominant-baseline="central">1</text><rect x="64" y="16" width="26" height="22" rx="7" class="st f5"/><text x="77" y="27.5" text-anchor="middle" dominant-baseline="central">5</text><rect x="120" y="16" width="26" height="22" rx="7" class="st f2"/><text x="133" y="27.5" text-anchor="middle" dominant-baseline="central">2</text><rect x="176" y="16" width="26" height="22" rx="7" class="st f2"/><text x="189" y="27.5" text-anchor="middle" dominant-baseline="central">3</text><rect x="232" y="16" width="26" height="22" rx="7" class="st f2"/><text x="245" y="27.5" text-anchor="middle" dominant-baseline="central">4</text><line x1="36" y1="27" x2="60" y2="27" class="st-k" marker-end="url(#art2)"/><line x1="92" y1="27" x2="116" y2="27" class="st-d" marker-end="url(#art2)"/><line x1="148" y1="27" x2="172" y2="27" class="st-d"/><line x1="204" y1="27" x2="228" y2="27" class="st-d"/><path d="M120 46 L120 54 L232 54 L232 46" class="st-d"/><text x="176" y="66" text-anchor="middle" dominant-baseline="central" class="txs">the same stitch, on the rest</text></g></svg>`,
          tests: [
            "assert to_list(reorder_list(build_list([1, 2, 3, 4]))) == [1, 4, 2, 3]",
            "assert to_list(reorder_list(build_list([1, 2, 3, 4, 5]))) == [1, 5, 2, 4, 3]",
            "assert to_list(reorder_list(build_list([1, 2, 3, 4, 5, 6, 7]))) == [1, 7, 2, 6, 3, 5, 4]"
          ],
          hint: "Fewer than three nodes left means nothing to stitch: one node is done, and two nodes already read first, last." },
        { text: "<strong>Guard the degenerate chains.</strong> A walk that assumes a head exists will crash on the empty one.",
          moves: [
            "Return early when head is None",
            "Return early when head.next is None"
          ],
          checks: [{ input: "1", output: "1" }, { input: "empty", output: "empty" }],
          diagram: `<svg viewBox="0 0 232 56" aria-hidden="true" focusable="false"><defs><marker id="art3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="28" y="17" width="26" height="22" rx="7" class="st f2"/><text x="41" y="28.5" text-anchor="middle" dominant-baseline="central">1</text><path d="M41 15 C33 2 58 2 50 15" class="st-k" marker-end="url(#art3)"/><rect x="150" y="17" width="44" height="22" rx="7" class="st dsh"/><text x="172" y="28.5" text-anchor="middle" dominant-baseline="central" class="txs">empty</text></g></svg>`,
          tests: [
            "assert to_list(reorder_list(build_list([1]))) == [1] and to_list(reorder_list(build_list([]))) == []"
          ],
          hint: "The empty chain must give back a null head, not an error." }
      ],
      steps: [
        `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build_list(values):
    head = None
    for value in reversed(values):
        head = ListNode(value, head)
    return head


def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


# Step 1: one stitch, the last node moves up right after the head.
def reorder_list(head):
    prev, cur = None, head
    while cur.next:
        prev, cur = cur, cur.next
    prev.next = None
    cur.next = head.next
    head.next = cur
    return head
`,
        `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build_list(values):
    head = None
    for value in reversed(values):
        head = ListNode(value, head)
    return head


def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


# Step 2: repeat the stitch until fewer than three nodes remain.
def reorder_list(head):
    if not head.next:
        return head
    prev, cur = None, head
    while cur.next:
        prev, cur = cur, cur.next
    prev.next = None
    cur.next = head.next
    head.next = cur
    rest = head.next.next
    if rest and rest.next:
        reorder_list(rest)
    return head
`,
        `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build_list(values):
    head = None
    for value in reversed(values):
        head = ListNode(value, head)
    return head


def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


# Step 3: guard the degenerate chains, then split, reverse, and weave.
def reorder_list(head):
    if not head or not head.next:      # nothing to reorder
        return head

    slow, fast = head, head.next       # slow stops before the middle
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next

    second, slow.next = slow.next, None
    prev = None                        # reverse the back half
    while second:
        second.next, prev, second = prev, second, second.next

    first, second = head, prev         # weave, one node from each half
    while second:
        nxt1, nxt2 = first.next, second.next
        first.next, second.next = second, nxt1
        first, second = nxt1, nxt2
    return head
`
      ],
      solution: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build_list(values):
    head = None
    for value in reversed(values):
        head = ListNode(value, head)
    return head


def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


# Reorder L0, L1, ..., Ln into L0, Ln, L1, Ln-1, ... in place; return the head.
def reorder_list(head):
    if not head or not head.next:      # nothing to reorder
        return head

    slow, fast = head, head.next       # slow stops before the middle
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next

    second, slow.next = slow.next, None
    prev = None                        # reverse the back half
    while second:
        second.next, prev, second = prev, second, second.next

    first, second = head, prev         # weave, one node from each half
    while second:
        nxt1, nxt2 = first.next, second.next
        first.next, second.next = second, nxt1
        first, second = nxt1, nxt2
    return head
`
    }
  },
  {
    id: "stacks",
    title: "Stacks & Monotonic Stacks",
    minutes: 3,
    tagline: "Push what is unresolved, pop when the comparison flips.",
    body: `<h3>Plain stack: match what you opened</h3>
<p>A stack is last in, first out. A Python list is the default tool: <a href="https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types"><code>append</code></a> pushes and <a href="https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types"><code>pop</code></a> removes the most recent item, both amortized O(1). Use it whenever the most recent unresolved thing is the one you need. Bracket validation is the canonical case: push every opener, pop on every closer and check that the pair matches, and the string is valid exactly when nothing is left over. When you can describe a problem as nesting, matching, or most recent, reach for a stack instead of a search.</p>
<h3>Monotonic stack: keep it ordered</h3>
<p>For next-greater questions, keep a stack of indices whose values decrease from bottom to top. Walk left to right; before pushing the current index, pop every index whose value is smaller, because today is the first warmer day each of them has seen. Peek before you push and the stack tells you which earlier element still has a say. Every index is pushed once and popped at most once, so the pass is O(n). The same stack answers previous-greater without a second walk: the index now below the top is the closest earlier value that beats it.</p>
${FIG.temps}
<h3>Worked example: daily temperatures</h3>
<pre><code>temps = [73, 74, 75, 71, 69, 72, 76, 73]
answer = [0] * len(temps)
stack = []                    # indices, decreasing temperatures

for i, t in enumerate(temps):
    while stack and temps[stack[-1]] &lt; t:
        j = stack.pop()       # j finally sees a warmer day
        answer[j] = i - j
    stack.append(i)

print(answer)
</code></pre>
<p>Store indices, not temperatures: the distance between the two indices is the answer, and the temperature is one lookup away in the input. This is the decreasing-stack template; the increasing variant is the same code with the comparison flipped.</p>
<p class="callout complexity"><strong>Complexity:</strong> O(n) time; each index is pushed once and popped at most once, so the inner while loop amortizes to O(1) per step. O(n) space for the stack and the answer.</p>
`,
    exercise: {
      title: "Daily Temperatures",
      prompt: `Given a list of daily temperatures, return a list where <code>answer[i]</code> is the number of days to wait after day i for a strictly warmer temperature, or 0 when none comes. Keep a decreasing stack of indices and fill each answer at pop time.`,
      leetcode: "https://leetcode.com/problems/daily-temperatures/",
      docs: [
        { text: "enumerate()", url: "https://docs.python.org/3/library/functions.html#enumerate" },
        { text: "mutable sequence types (append / pop)", url: "https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types" },
        { text: "deque", url: "https://docs.python.org/3/library/collections.html#collections.deque" },
        { text: "Time complexity of Python types", url: "https://wiki.python.org/moin/TimeComplexity" }
      ],
      starter: `# answer[i] = days until a strictly warmer day, or 0 if none comes.
def daily_temperatures(temps):
    pass  # TODO: your turn
`,
      tasks: [
        { text: "<strong>Nothing warms up.</strong> A strictly falling run never sees a warmer day ahead, so every slot stays zero; this is the answer shape before any comparison happens.",
          moves: [
            "Start the answer as a list of zeros the length of temps",
            "Walk the days without changing anything",
            "Return the zeros untouched"
          ],
          checks: [{ input: "[90, 80, 70]", output: "[0, 0, 0]" }, { input: "[55]", output: "[0]"}],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">temps</text><rect x="52" y="6" width="28" height="20" rx="7" class="st f2"/><text x="66" y="16" text-anchor="middle" dominant-baseline="central">90</text><rect x="84" y="6" width="28" height="20" rx="7" class="st f2"/><text x="98" y="16" text-anchor="middle" dominant-baseline="central">80</text><rect x="116" y="6" width="28" height="20" rx="7" class="st f2"/><text x="130" y="16" text-anchor="middle" dominant-baseline="central">70</text><line x1="66" y1="28" x2="66" y2="33" class="st-d"/><line x1="98" y1="28" x2="98" y2="33" class="st-d"/><line x1="130" y1="28" x2="130" y2="33" class="st-d"/><text x="6" y="44" class="txd txs" text-anchor="start" dominant-baseline="central">answer</text><rect x="52" y="34" width="28" height="20" rx="7" class="st dsh"/><text x="66" y="44" text-anchor="middle" dominant-baseline="central">0</text><rect x="84" y="34" width="28" height="20" rx="7" class="st dsh"/><text x="98" y="44" text-anchor="middle" dominant-baseline="central">0</text><rect x="116" y="34" width="28" height="20" rx="7" class="st dsh"/><text x="130" y="44" text-anchor="middle" dominant-baseline="central">0</text><text x="152" y="30" class="txd txs" text-anchor="start" dominant-baseline="central">no warmer day</text></g></svg>`,
          tests: [
            "assert daily_temperatures([90, 80, 70]) == [0, 0, 0]",
            "assert daily_temperatures([55]) == [0]"
          ],
          hint: "With no warmer day ahead, every wait is zero; there is nothing to fill in yet." },
        { text: "<strong>Tomorrow is enough.</strong> When the very next day is warmer the wait is one, so compare each day with the day after it and fill those slots.",
          moves: [
            "Compare each day with the day after it",
            "Fill 1 for every pair that climbs",
            "Leave the last day at zero"
          ],
          checks: [{ input: "[30, 40, 50, 60]", output: "[1, 1, 1, 0]" }, { input: "[50, 60, 55]", output: "[1, 0, 0]"}],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-stk-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">temps</text><rect x="52" y="6" width="28" height="20" rx="7" class="st f2"/><text x="66" y="16" text-anchor="middle" dominant-baseline="central">30</text><rect x="84" y="6" width="28" height="20" rx="7" class="st f2"/><text x="98" y="16" text-anchor="middle" dominant-baseline="central">40</text><rect x="116" y="6" width="28" height="20" rx="7" class="st f2"/><text x="130" y="16" text-anchor="middle" dominant-baseline="central">50</text><rect x="148" y="6" width="28" height="20" rx="7" class="st f2"/><text x="162" y="16" text-anchor="middle" dominant-baseline="central">60</text><line x1="66" y1="28" x2="66" y2="33" class="st-k" marker-end="url(#ar-stk-2)"/><line x1="98" y1="28" x2="98" y2="33" class="st-k" marker-end="url(#ar-stk-2)"/><line x1="130" y1="28" x2="130" y2="33" class="st-k" marker-end="url(#ar-stk-2)"/><line x1="162" y1="28" x2="162" y2="33" class="st-d"/><text x="6" y="44" class="txd txs" text-anchor="start" dominant-baseline="central">answer</text><rect x="52" y="34" width="28" height="20" rx="7" class="st f5"/><text x="66" y="44" text-anchor="middle" dominant-baseline="central">1</text><rect x="84" y="34" width="28" height="20" rx="7" class="st f5"/><text x="98" y="44" text-anchor="middle" dominant-baseline="central">1</text><rect x="116" y="34" width="28" height="20" rx="7" class="st f5"/><text x="130" y="44" text-anchor="middle" dominant-baseline="central">1</text><rect x="148" y="34" width="28" height="20" rx="7" class="st dsh"/><text x="162" y="44" text-anchor="middle" dominant-baseline="central">0</text><text x="184" y="30" class="txd txs" text-anchor="start" dominant-baseline="central">one step each</text></g></svg>`,
          tests: [
            "assert daily_temperatures([30, 40, 50, 60]) == [1, 1, 1, 0]",
            "assert daily_temperatures([50, 60, 55]) == [1, 0, 0]"
          ],
          hint: "A one-step comparison only sees pairs that climb immediately; the last day has no tomorrow." },
        { text: "<strong>Gaps and equal days need the stack.</strong> When a warmer day sits several days away, keep the unresolved days on a decreasing stack of indices and fill each wait when its day finally pops.",
          moves: [
            "Push the current index on a stack",
            "Before pushing, pop every index whose day is colder",
            "Set answer[j] to i - j at pop time"
          ],
          checks: [{ input: "[30, 30, 40]", output: "[2, 1, 0]" }, { input: "[73, 74, 75, 71, 69, 72, 76, 73]", output: "[1, 1, 4, 2, 1, 1, 0, 0]" }, { input: "[20, 15, 10, 25]", output: "[3, 2, 1, 0]"}],
          diagram: `<svg viewBox="0 0 232 74" aria-hidden="true" focusable="false"><defs><marker id="ar-stk-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="14" class="txd txs" text-anchor="start" dominant-baseline="central">temps</text><rect x="52" y="4" width="28" height="20" rx="7" class="st f5"/><text x="66" y="14" text-anchor="middle" dominant-baseline="central">30</text><rect x="84" y="4" width="28" height="20" rx="7" class="st f5"/><text x="98" y="14" text-anchor="middle" dominant-baseline="central">30</text><rect x="116" y="4" width="28" height="20" rx="7" class="st f2"/><text x="130" y="14" text-anchor="middle" dominant-baseline="central">40</text><path d="M66 26 C64 40 118 40 130 26" class="st-k" marker-end="url(#ar-stk-3)"/><text x="6" y="46" class="txd txs" text-anchor="start" dominant-baseline="central">answer</text><rect x="52" y="36" width="28" height="20" rx="7" class="st f2"/><text x="66" y="46" text-anchor="middle" dominant-baseline="central">2</text><rect x="84" y="36" width="28" height="20" rx="7" class="st f2"/><text x="98" y="46" text-anchor="middle" dominant-baseline="central">1</text><rect x="116" y="36" width="28" height="20" rx="7" class="st dsh"/><text x="130" y="46" text-anchor="middle" dominant-baseline="central">0</text><text x="52" y="64" class="txd txs" text-anchor="start" dominant-baseline="central">equal days wait, they do not count</text></g></svg>`,
          tests: [
            "assert daily_temperatures([30, 30, 40]) == [2, 1, 0]",
            "assert daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]",
            "assert daily_temperatures([20, 15, 10, 25]) == [3, 2, 1, 0]"
          ],
          hint: "Equal days never warm each other, so a plateau waits together for the first strictly warmer day." }
      ],
      steps: [
        `# Step 1: with no warm day anywhere, the whole answer is zeros.
def daily_temperatures(temps):
    return [0] * len(temps)
`,
        `# Step 2: compare each day with the day after it and mark the climbs.
def daily_temperatures(temps):
    answer = [0] * len(temps)
    for i in range(len(temps) - 1):
        if temps[i + 1] > temps[i]:
            answer[i] = 1
    return answer
`,
        `# Step 3: keep unresolved days on a decreasing stack; fill waits at pop time.
def daily_temperatures(temps):
    answer = [0] * len(temps)
    stack = []
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer
`
      ],
      solution: `# answer[i] = days until a strictly warmer day, or 0 if none comes.
def daily_temperatures(temps):
    answer = [0] * len(temps)
    stack = []                    # indices, decreasing temperatures
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()       # j finally sees a warmer day
            answer[j] = i - j
        stack.append(i)
    return answer
`
    }
  }
];
