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
        { text: "<strong>Every word starts alone.</strong> If no two words are rearrangements of each other, every word is its own group. Give each word its own one-word group and return them all.",
          moves: [
            "Return one group per word: a list of one-word lists",
            "Check bat and cat: two groups come back",
            "It breaks the moment two words share their letters"
          ],
          checks: [{ input: "\"bat\", \"cat\"", output: "bat / cat" }, { input: "\"a\", \"b\", \"c\"", output: "a / b / c" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="34" y="8" width="64" height="22" rx="6" class="st f2"/><text x="66" y="19" text-anchor="middle" dominant-baseline="central">bat</text><rect x="134" y="8" width="64" height="22" rx="6" class="st f2"/><text x="166" y="19" text-anchor="middle" dominant-baseline="central">cat</text><line x1="66" y1="32" x2="66" y2="40" class="st-k"/><line x1="166" y1="32" x2="166" y2="40" class="st-k"/><text x="116" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">no shared letters: one group each</text></g></svg>`,
          tests: [
            "assert group_anagrams([\"bat\", \"cat\"]) == [[\"bat\"], [\"cat\"]]",
            "assert group_anagrams([\"a\", \"b\", \"c\"]) == [[\"a\"], [\"b\"], [\"c\"]]"
          ],
          hint: "A comprehension like [[word] for word in words] gives every word its own group, so no two words ever share one." },
        { text: "<strong>Exact copies share a group.</strong> When the same spelling shows up twice, both copies belong together. Collect them with a dict: the word itself is the key, and the list under it holds every copy.",
          moves: [
            "Make an empty dict called groups",
            "Append each word to the list stored under itself",
            "Create that list the first time the word appears"
          ],
          checks: [{ input: "\"bat\", \"bat\", \"cat\"", output: "bat bat / cat" }, { input: "\"a\", \"a\", \"a\"", output: "a a a" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-hash-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="6" y="6" width="42" height="18" rx="6" class="st f2"/><text x="27" y="15" text-anchor="middle" dominant-baseline="central">bat</text><rect x="56" y="6" width="42" height="18" rx="6" class="st f2"/><text x="77" y="15" text-anchor="middle" dominant-baseline="central">bat</text><rect x="106" y="6" width="42" height="18" rx="6" class="st f2"/><text x="127" y="15" text-anchor="middle" dominant-baseline="central">cat</text><line x1="27" y1="26" x2="27" y2="36" class="st-k" marker-end="url(#ar-hash-2)"/><line x1="77" y1="26" x2="77" y2="36" class="st-k" marker-end="url(#ar-hash-2)"/><line x1="127" y1="26" x2="127" y2="36" class="st-k" marker-end="url(#ar-hash-2)"/><rect x="6" y="40" width="92" height="18" rx="6" class="st f5"/><text x="52" y="49" text-anchor="middle" dominant-baseline="central">bat bat</text><rect x="106" y="40" width="42" height="18" rx="6" class="st f5"/><text x="127" y="49" text-anchor="middle" dominant-baseline="central">cat</text><text x="196" y="49" text-anchor="middle" dominant-baseline="central" class="txd txs">same word</text></g></svg>`,
          tests: [
            "assert group_anagrams([\"bat\", \"bat\", \"cat\"]) == [[\"bat\", \"bat\"], [\"cat\"]]",
            "assert group_anagrams([\"a\", \"a\", \"a\"]) == [[\"a\", \"a\", \"a\"]]"
          ],
          hint: "An if can create the list on first use: if word not in groups, set groups[word] to an empty list, then append." },
        { text: "<strong>Same letters, any order.</strong> Real anagrams are rearrangements: eat, tea, and ate all use the letters a, e, t. Build the key as frozenset(word), which forgets the order, so every rearrangement of the same letters lands in one group.",
          moves: [
            "Swap the word key for frozenset(word)",
            "Append the original word, never the key",
            "Try eat, tea, ate: all three share one group"
          ],
          checks: [{ input: "\"eat\", \"tea\", \"ate\"", output: "one group: ate eat tea" }, { input: "eat tea tan ate nat bat", output: "[ate, eat, tea] [bat] [nat, tan]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-hash-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="16" y="6" width="80" height="18" rx="6" class="st f5"/><text x="56" y="15" text-anchor="middle" dominant-baseline="central">{a, b}</text><rect x="126" y="6" width="96" height="18" rx="6" class="st f5"/><text x="174" y="15" text-anchor="middle" dominant-baseline="central">{a, b, c}</text><line x1="36" y1="26" x2="36" y2="36" class="st-k" marker-end="url(#ar-hash-3)"/><line x1="76" y1="26" x2="76" y2="36" class="st-k" marker-end="url(#ar-hash-3)"/><line x1="148" y1="26" x2="148" y2="36" class="st-k" marker-end="url(#ar-hash-3)"/><line x1="200" y1="26" x2="200" y2="36" class="st-k" marker-end="url(#ar-hash-3)"/><rect x="16" y="40" width="38" height="18" rx="6" class="st f2"/><text x="35" y="49" text-anchor="middle" dominant-baseline="central">ab</text><rect x="58" y="40" width="38" height="18" rx="6" class="st f2"/><text x="77" y="49" text-anchor="middle" dominant-baseline="central">ba</text><rect x="126" y="40" width="42" height="18" rx="6" class="st f2"/><text x="147" y="49" text-anchor="middle" dominant-baseline="central">abc</text><rect x="176" y="40" width="42" height="18" rx="6" class="st f2"/><text x="197" y="49" text-anchor="middle" dominant-baseline="central">cba</text></g></svg>`,
          tests: [
            "assert group_anagrams([\"eat\", \"tea\", \"ate\"]) == [[\"ate\", \"eat\", \"tea\"]]",
            "assert group_anagrams([\"ab\", \"ba\", \"abc\", \"cba\"]) == [[\"ab\", \"ba\"], [\"abc\", \"cba\"]]",
            "assert group_anagrams([\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]) == [[\"ate\", \"eat\", \"tea\"], [\"bat\"], [\"nat\", \"tan\"]]"
          ],
          hint: "A frozenset can be a dict key, and it remembers which letters appear but not how many times each one appears." },
        { text: "<strong>Same letters is not enough: the counts must match.</strong> aab has the same letters as ab but one a too many, so they are not anagrams. Sort the letters of each word and keep them in a tuple: it holds every copy of every letter.",
          moves: [
            "Build the key as tuple(sorted(word))",
            "The sorted letters remember counts, not just order",
            "Check aab and ab land in different groups now"
          ],
          checks: [{ input: "\"aab\", \"abb\", \"baa\", \"bba\"", output: "[aab, baa] [abb, bba]" }, { input: "\"ab\", \"ba\", \"aba\", \"aab\"", output: "[aab, aba] [ab, ba]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-hash-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="8" y="6" width="40" height="18" rx="6" class="st f2"/><text x="28" y="15" text-anchor="middle" dominant-baseline="central">aab</text><line x1="50" y1="15" x2="72" y2="15" class="st-k" marker-end="url(#ar-hash-4)"/><rect x="76" y="6" width="24" height="18" rx="6" class="st f5"/><text x="88" y="15" text-anchor="middle" dominant-baseline="central">a</text><rect x="104" y="6" width="24" height="18" rx="6" class="st f5"/><text x="116" y="15" text-anchor="middle" dominant-baseline="central">a</text><rect x="132" y="6" width="24" height="18" rx="6" class="st f5"/><text x="144" y="15" text-anchor="middle" dominant-baseline="central">b</text><text x="180" y="15" text-anchor="start" dominant-baseline="central" class="txd txs">both a's kept</text><rect x="8" y="38" width="40" height="18" rx="6" class="st f2"/><text x="28" y="47" text-anchor="middle" dominant-baseline="central">ab</text><line x1="50" y1="47" x2="72" y2="47" class="st-k" marker-end="url(#ar-hash-4)"/><rect x="76" y="38" width="24" height="18" rx="6" class="st f5"/><text x="88" y="47" text-anchor="middle" dominant-baseline="central">a</text><rect x="104" y="38" width="24" height="18" rx="6" class="st f5"/><text x="116" y="47" text-anchor="middle" dominant-baseline="central">b</text><text x="180" y="47" text-anchor="start" dominant-baseline="central" class="txd txs">one a only</text></g></svg>`,
          tests: [
            "assert group_anagrams([\"aab\", \"abb\", \"baa\", \"bba\"]) == [[\"aab\", \"baa\"], [\"abb\", \"bba\"]]",
            "assert group_anagrams([\"ab\", \"ba\", \"aba\", \"aab\"]) == [[\"aab\", \"aba\"], [\"ab\", \"ba\"]]"
          ],
          hint: "sorted(word) gives a list, and a list cannot be a dict key; tuple(sorted(word)) can, and it counts every letter." }
      ],
      steps: [
        `# Group anagrams, step 1: every word in its own group.
def group_anagrams(words):
    return [[word] for word in words]
`,
        `# Group anagrams, step 2: exact copies of a word share one group.
def group_anagrams(words):
    groups = {}
    for word in words:
        if word not in groups:        # first copy: make its list
            groups[word] = []
        groups[word].append(word)
    return sorted(sorted(group) for group in groups.values())
`,
        `from collections import defaultdict

# Group anagrams, step 3: same letters in any order share one group.
def group_anagrams(words):
    groups = defaultdict(list)
    for word in words:
        groups[frozenset(word)].append(word)   # order gone, counts gone too
    return sorted(sorted(group) for group in groups.values())
`,
        `from collections import defaultdict

# Group anagrams by their sorted-letter key.
def group_anagrams(words):
    groups = defaultdict(list)              # sorted letters -> group of words
    for word in words:
        groups[tuple(sorted(word))].append(word)
    return sorted(sorted(group) for group in groups.values())
`
      ],
      solution: `from collections import defaultdict

# Group anagrams by their sorted-letter key.
def group_anagrams(words):
    groups = defaultdict(list)              # sorted letters -> group of words
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
        { text: "<strong>Test the two end numbers first.</strong> The smallest and the largest number form one easy pair. If they add up to the target, you are done; return their 1-based spots.",
          moves: [
            "Put left at the first number and right at the last",
            "If the two ends hit the target, return both spots, 1-based",
            "Anything else: return an empty list for now"
          ],
          checks: [{ input: "[1, 2, 3, 4], target 5", output: "[1, 4]" }, { input: "[2, 3, 4], target 6", output: "[1, 3]" }, { input: "[1, 2], target 3", output: "[1, 2]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-tp-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="44" y="8" width="28" height="22" rx="6" class="st f5"/><text x="58" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="80" y="8" width="28" height="22" rx="6" class="st f2"/><text x="94" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="116" y="8" width="28" height="22" rx="6" class="st f2"/><text x="130" y="19" text-anchor="middle" dominant-baseline="central">3</text><rect x="152" y="8" width="28" height="22" rx="6" class="st f5"/><text x="166" y="19" text-anchor="middle" dominant-baseline="central">4</text><line x1="58" y1="50" x2="58" y2="34" class="st-k" marker-end="url(#ar-tp-1)"/><line x1="166" y1="50" x2="166" y2="34" class="st-k" marker-end="url(#ar-tp-1)"/><text x="58" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">left</text><text x="166" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">right</text><text x="112" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">1 + 4 = 5</text></g></svg>`,
          tests: [
            "assert two_sum([1, 2, 3, 4], 5) == [1, 4]",
            "assert two_sum([2, 3, 4], 6) == [1, 3]",
            "assert two_sum([1, 2], 3) == [1, 2]"
          ],
          hint: "The two ends are just one of many pairs; the answer often sits deeper inside the list." },
        { text: "<strong>Slide the left side up while the pair is too small.</strong> The number after left is bigger, so stepping left toward the middle grows the sum. Keep right parked on the last number and walk left forward until the pair hits the target.",
          moves: [
            "Loop while left is before right",
            "Pair too small: move left one step toward the middle",
            "Pair matches: return both spots, 1-based"
          ],
          checks: [{ input: "[1, 3, 4, 5], target 9", output: "[3, 4]" }, { input: "[2, 5, 9], target 14", output: "[2, 3]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-tp-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="20" y="8" width="32" height="22" rx="6" class="st f5"/><text x="36" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="58" y="8" width="32" height="22" rx="6" class="st f5"/><text x="74" y="19" text-anchor="middle" dominant-baseline="central">3</text><rect x="96" y="8" width="32" height="22" rx="6" class="st f2"/><text x="112" y="19" text-anchor="middle" dominant-baseline="central">4</text><rect x="134" y="8" width="32" height="22" rx="6" class="st dsh"/><text x="150" y="19" text-anchor="middle" dominant-baseline="central">5</text><path d="M36 44 C36 52 70 52 74 44" class="st-k" marker-end="url(#ar-tp-2)"/><path d="M74 44 C74 54 106 54 112 44" class="st-k" marker-end="url(#ar-tp-2)"/><text x="116" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">left climbs, right stays on 5</text></g></svg>`,
          tests: [
            "assert two_sum([1, 3, 4, 5], 9) == [3, 4]",
            "assert two_sum([2, 5, 9], 14) == [2, 3]",
            "assert two_sum([1, 2, 3, 4], 5) == [1, 4]"
          ],
          hint: "This finds pairs that use the last number. When the answer needs a smaller right number, this walk cannot see it." },
        { text: "<strong>Drop the right side when the pair is too big.</strong> If the pair overshoots the target, the last number is too big for every remaining partner: no answer can use it. Move right one step toward the middle and try again, and now both ends walk toward each other.",
          moves: [
            "Pair too small: move left toward the middle",
            "Pair too big: move right toward the middle",
            "Every step crosses one number off; return on the match"
          ],
          checks: [{ input: "[2, 7, 11, 15], target 9", output: "[1, 2]" }, { input: "[2, 3, 5, 8, 10], target 11", output: "[2, 4]" }, { input: "[1, 1, 2, 7], target 2", output: "[1, 2]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-tp-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="20" y="8" width="32" height="22" rx="6" class="st f5"/><text x="36" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="58" y="8" width="32" height="22" rx="6" class="st f5"/><text x="74" y="19" text-anchor="middle" dominant-baseline="central">7</text><rect x="96" y="8" width="32" height="22" rx="6" class="st dsh"/><text x="112" y="19" text-anchor="middle" dominant-baseline="central">11</text><rect x="134" y="8" width="32" height="22" rx="6" class="st dsh"/><text x="150" y="19" text-anchor="middle" dominant-baseline="central">15</text><path d="M150 44 C150 32 124 30 116 34" class="st-k" marker-end="url(#ar-tp-3)"/><text x="150" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">too big: right steps down</text><text x="36" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">left</text></g></svg>`,
          tests: [
            "assert two_sum([2, 7, 11, 15], 9) == [1, 2]",
            "assert two_sum([2, 3, 5, 8, 10], 11) == [2, 4]",
            "assert two_sum([1, 1, 2, 7], 2) == [1, 2]"
          ],
          hint: "The last number was too big even for the second-largest partner, so no pair anywhere can use it." }
      ],
      steps: [
        `# numbers is sorted; return 1-indexed [left, right] of the pair that hits target.
def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    if numbers[left] + numbers[right] == target:
        return [left + 1, right + 1]   # the end pair already works
    return []
`,
        `# numbers is sorted; return 1-indexed [left, right] of the pair that hits target.
def two_sum(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        left += 1              # pair too small: try a bigger left number
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
      prompt: `Given a string <code>s</code>, return the length of the longest run of consecutive letters in which no letter appears twice. Grow the run on the right; when a letter repeats, drop letters from the left until the repeat is gone.`,
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
        { text: "<strong>Start with the easiest case: no letter repeats.</strong> If every letter in the string is different, the longest run of non-repeating letters is the whole string. Return its length and see how far that gets you.",
          moves: [
            "Return len(s), the length of the whole string",
            "Try it on abc and abcdef, where nothing repeats",
            "Notice it is wrong the moment a letter repeats"
          ],
          checks: [{ input: "\"abc\"", output: "3" }, { input: "\"abcdef\"", output: "6" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="64" y="8" width="30" height="22" rx="6" class="st f2"/><text x="79" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="100" y="8" width="30" height="22" rx="6" class="st f2"/><text x="115" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="136" y="8" width="30" height="22" rx="6" class="st f2"/><text x="151" y="19" text-anchor="middle" dominant-baseline="central">c</text><line x1="64" y1="38" x2="64" y2="46" class="st-k"/><line x1="64" y1="46" x2="166" y2="46" class="st-k"/><line x1="166" y1="38" x2="166" y2="46" class="st-k"/><text x="115" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">no repeats: whole string, length 3</text></g></svg>`,
          tests: [
            "assert length_of_longest_substring(\"abc\") == 3",
            "assert length_of_longest_substring(\"abcdef\") == 6"
          ],
          hint: "len(s) counts every letter, repeats included. It is only right while nothing repeats." },
        { text: "<strong>Stop at the first repeated letter.</strong> Walk the string one letter at a time and collect each letter into a set, which never holds the same letter twice. The moment the current letter is already in the set, the run is broken: return how many letters you walked past. If the walk ends with no repeat, the whole string was fine.",
          moves: [
            "Walk the letters with a for loop",
            "Keep every letter you pass in a set called seen",
            "If the letter is already in seen, return its index i",
            "If the walk ends with no repeat, return len(s)"
          ],
          checks: [{ input: "\"abcb\"", output: "3" }, { input: "\"abcabc\"", output: "3" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="18" y="8" width="24" height="22" rx="6" class="st f5"/><text x="30" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="48" y="8" width="24" height="22" rx="6" class="st f5"/><text x="60" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="78" y="8" width="24" height="22" rx="6" class="st f5"/><text x="90" y="19" text-anchor="middle" dominant-baseline="central">c</text><rect x="108" y="8" width="24" height="22" rx="6" class="st dsh"/><text x="120" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="138" y="8" width="24" height="22" rx="6" class="st dsh"/><text x="150" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="168" y="8" width="24" height="22" rx="6" class="st dsh"/><text x="180" y="19" text-anchor="middle" dominant-baseline="central">c</text><line x1="18" y1="38" x2="18" y2="46" class="st-k"/><line x1="18" y1="46" x2="102" y2="46" class="st-k"/><line x1="102" y1="38" x2="102" y2="46" class="st-k"/><text x="115" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">the second a breaks it: 3 letters</text></g></svg>`,
          tests: [
            "assert length_of_longest_substring(\"abcb\") == 3",
            "assert length_of_longest_substring(\"abcabc\") == 3"
          ],
          hint: "Use enumerate(s) to get each letter with its index, and return the index of the first repeat." },
        { text: "<strong>Start a new run after every repeat, and keep the best one.</strong> The longest run may begin after the first repeat, so never return early. When a letter is already in the set, empty the set and begin a fresh run from that letter. Track the longest run so far in a variable called best.",
          moves: [
            "Keep a variable best that starts at 0",
            "On a repeat, empty the set, then add the new letter to it",
            "After each letter, update best with the size of the set",
            "Return best when the walk ends"
          ],
          checks: [{ input: "\"pwwkew\"", output: "3 (wke)" }, { input: "\"aabb\"", output: "2 (ab)" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="18" y="8" width="24" height="22" rx="6" class="st dsh"/><text x="30" y="19" text-anchor="middle" dominant-baseline="central">p</text><rect x="48" y="8" width="24" height="22" rx="6" class="st dsh"/><text x="60" y="19" text-anchor="middle" dominant-baseline="central">w</text><rect x="78" y="8" width="24" height="22" rx="6" class="st f5"/><text x="90" y="19" text-anchor="middle" dominant-baseline="central">w</text><rect x="108" y="8" width="24" height="22" rx="6" class="st f5"/><text x="120" y="19" text-anchor="middle" dominant-baseline="central">k</text><rect x="138" y="8" width="24" height="22" rx="6" class="st f5"/><text x="150" y="19" text-anchor="middle" dominant-baseline="central">e</text><rect x="168" y="8" width="24" height="22" rx="6" class="st dsh"/><text x="180" y="19" text-anchor="middle" dominant-baseline="central">w</text><line x1="78" y1="38" x2="78" y2="46" class="st-k"/><line x1="78" y1="46" x2="162" y2="46" class="st-k"/><line x1="162" y1="38" x2="162" y2="46" class="st-k"/><text x="115" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">a fresh run, wke reaches 3</text></g></svg>`,
          tests: [
            "assert length_of_longest_substring(\"pwwkew\") == 3",
            "assert length_of_longest_substring(\"aabb\") == 2"
          ],
          hint: "After adding a letter, best = max(best, len(seen)). Emptying the set loses good letters, though." },
        { text: "<strong>Drop letters from the front instead of starting over.</strong> Emptying the set throws away letters that never repeated. Keep two positions, left and right. Move right forward one letter at a time. When the new letter is already in the set, remove letters from the front, one at a time, until the repeat is gone. Then measure the run from left to right.",
          moves: [
            "Start left at 0 and walk right through the string",
            "While the new letter is in the set, remove s[left] and move left up",
            "Add the new letter and measure right - left + 1",
            "Keep the longest measurement in best"
          ],
          checks: [{ input: "\"dvdf\"", output: "3 (vdf)" }, { input: "\"tmmzuxt\"", output: "5 (mzuxt)" }, { input: "\"\"", output: "0" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-sw-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="50" y="8" width="30" height="22" rx="6" class="st dsh"/><text x="65" y="19" text-anchor="middle" dominant-baseline="central">d</text><rect x="86" y="8" width="30" height="22" rx="6" class="st f5"/><text x="101" y="19" text-anchor="middle" dominant-baseline="central">v</text><rect x="122" y="8" width="30" height="22" rx="6" class="st f5"/><text x="137" y="19" text-anchor="middle" dominant-baseline="central">d</text><rect x="158" y="8" width="30" height="22" rx="6" class="st f5"/><text x="173" y="19" text-anchor="middle" dominant-baseline="central">f</text><path d="M137 38 C137 52 112 52 101 42" class="st-k" marker-end="url(#ar-sw-4)"/><text x="115" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">only the first d leaves, vdf stays</text></g></svg>`,
          tests: [
            "assert length_of_longest_substring(\"dvdf\") == 3",
            "assert length_of_longest_substring(\"tmmzuxt\") == 5",
            "assert length_of_longest_substring(\"\") == 0"
          ],
          hint: "Shrink from the front only until the repeated letter is gone, then measure the run." }
      ],
      steps: [
        `# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    return len(s)
`,
        `# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    seen = set()
    for i, ch in enumerate(s):
        if ch in seen:
            return i          # the good run is the i letters before this one
        seen.add(ch)
    return len(s)
`,
        `# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    seen = set()
    best = 0
    for ch in s:
        if ch in seen:
            seen = set()      # start a fresh run at this letter
        seen.add(ch)
        best = max(best, len(seen))
    return best
`,
        `# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    letters = set()           # the letters from left to right
    left = 0
    best = 0
    for right in range(len(s)):
        while s[right] in letters:   # a repeat: drop letters from the front
            letters.remove(s[left])
            left += 1
        letters.add(s[right])
        best = max(best, right - left + 1)
    return best
`
      ],
      solution: `# Length of the longest substring of s with no repeated character.
def length_of_longest_substring(s):
    letters = set()           # the letters from left to right
    left = 0
    best = 0
    for right in range(len(s)):
        while s[right] in letters:   # a repeat: drop letters from the front
            letters.remove(s[left])
            left += 1
        letters.add(s[right])
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
        { text: "<strong>A whole pile per hour always finishes.</strong> Eating as fast as the biggest pile clears one pile each hour, which always fits the budget. Return max(piles): a legal speed, just usually faster than needed.",
          moves: [
            "Return max(piles), the size of the biggest pile",
            "At that speed every pile takes a single hour",
            "It always finishes, but the task wants the slowest speed that does"
          ],
          checks: [{ input: "[2, 2, 2], h = 4", output: "2" }, { input: "[1, 2, 2], h = 4", output: "2" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-bs-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="26" y="8" width="30" height="22" rx="6" class="st f2"/><text x="41" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="62" y="8" width="30" height="22" rx="6" class="st f2"/><text x="77" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="98" y="8" width="30" height="22" rx="6" class="st f5"/><text x="113" y="19" text-anchor="middle" dominant-baseline="central">2</text><text x="146" y="19" text-anchor="start" dominant-baseline="central" class="txd txs">max pile = 2</text><text x="26" y="48" text-anchor="start" dominant-baseline="central" class="txd txs">speed 2: 1 + 1 + 1 = 3 hours, fits in 4</text></g></svg>`,
          tests: [
            "assert min_eating_speed([2, 2, 2], 4) == 2",
            "assert min_eating_speed([1, 2, 2], 4) == 2"
          ],
          hint: "max(piles) is a safe speed because no pile can take longer than one hour, but slower speeds can also fit." },
        { text: "<strong>Cut the speed range in half.</strong> Line up every speed from 1 to max(piles) and test the middle one. If the middle is too slow, every slower speed is too slow, so search the faster half; otherwise the middle might be the answer, so keep it and search slower. Count hours by dividing each pile by the speed and dropping the remainders for now.",
          moves: [
            "Set lo to 1 and hi to max(piles)",
            "Count hours at the middle speed: add up pile // speed",
            "Too slow: lo moves past the middle; fits: hi moves to it",
            "When lo meets hi, that speed is the answer"
          ],
          checks: [{ input: "[2, 2], h = 5", output: "1" }, { input: "[1, 4], h = 4", output: "2" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-bs-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="26" y="8" width="30" height="22" rx="6" class="st f2"/><text x="41" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="62" y="8" width="30" height="22" rx="6" class="st f5"/><text x="77" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="98" y="8" width="30" height="22" rx="6" class="st f2"/><text x="113" y="19" text-anchor="middle" dominant-baseline="central">3</text><rect x="134" y="8" width="30" height="22" rx="6" class="st f2"/><text x="149" y="19" text-anchor="middle" dominant-baseline="central">4</text><rect x="170" y="8" width="30" height="22" rx="6" class="st f2"/><text x="185" y="19" text-anchor="middle" dominant-baseline="central">5</text><line x1="41" y1="38" x2="41" y2="46" class="st-k"/><line x1="41" y1="46" x2="185" y2="46" class="st-k"/><line x1="185" y1="38" x2="185" y2="46" class="st-k"/><text x="41" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">lo</text><text x="185" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">hi</text><text x="113" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">mid = 3 fits</text></g></svg>`,
          tests: [
            "assert min_eating_speed([2, 2], 5) == 1",
            "assert min_eating_speed([1, 4], 4) == 2"
          ],
          hint: "Dropping remainders can only make the hours look smaller. These piles divide evenly enough that the verdicts still come out right." },
        { text: "<strong>A leftover pile still eats a whole hour.</strong> Six bananas at speed 4 take two hours, not one and a half: every pile counts rounded up. The starter already hands you hours_at, which does the rounding, so call it instead of dividing flat.",
          moves: [
            "Swap the flat division for hours_at(piles, mid)",
            "A pile with a remainder costs one extra hour",
            "The halving loop stays the same"
          ],
          checks: [{ input: "[1, 9], h = 5", output: "3" }, { input: "[2, 9], h = 5", output: "3" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-bs-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="24" y="8" width="30" height="22" rx="6" class="st f2"/><text x="39" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="60" y="8" width="30" height="22" rx="6" class="st f5"/><text x="75" y="19" text-anchor="middle" dominant-baseline="central">9</text><text x="108" y="19" text-anchor="start" dominant-baseline="central" class="txd txs">speed 3: 1 + 3 = 4 hours</text><text x="24" y="46" text-anchor="start" dominant-baseline="central" class="txd txs">floor: 0 + 3 = 3, too low</text></g></svg>`,
          tests: [
            "assert min_eating_speed([1, 9], 5) == 3",
            "assert min_eating_speed([2, 9], 5) == 3"
          ],
          hint: "Rounding up finally counts the part-eaten hour. One question is left: is finishing in exactly h hours on time, or one too many?" },
        { text: "<strong>Finishing in exactly h hours is on time.</strong> The slowest workable speed lands the hour count exactly on h, not below it. Accept hours that are at most h, and the loop settles on the true slowest speed.",
          moves: [
            "Test hours_at(piles, mid) at most h, equality included",
            "Equality keeps the middle speed in play",
            "Return lo once the range shrinks to one speed"
          ],
          checks: [{ input: "[3, 6, 7, 11], h = 8", output: "4" }, { input: "[30, 11, 23, 4, 20], h = 6", output: "23" }, { input: "[1000000000], h = 2", output: "500000000" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-bs-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="22" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="36" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="56" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="70" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="90" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="104" y="19" text-anchor="middle" dominant-baseline="central">3</text><rect x="124" y="8" width="28" height="22" rx="6" class="st f5"/><text x="138" y="19" text-anchor="middle" dominant-baseline="central">4</text><text x="162" y="19" text-anchor="start" dominant-baseline="central" class="txd txs">8 hours fits</text><text x="22" y="46" text-anchor="start" dominant-baseline="central" class="txd txs">lo = hi = 4, return 4</text></g></svg>`,
          tests: [
            "assert min_eating_speed([3, 6, 7, 11], 8) == 4",
            "assert min_eating_speed([30, 11, 23, 4, 20], 6) == 23",
            "assert min_eating_speed([1000000000], 2) == 500000000"
          ],
          hint: "At the slowest workable speed the hours land exactly on h; demanding strictly fewer rejects it and overshoots." }
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
    lo, hi = 1, max(piles)            # speeds worth testing
    while lo < hi:
        mid = (lo + hi) // 2
        hours = sum(p // mid for p in piles)   # remainders dropped
        if hours <= h:
            hi = mid                  # mid fits: answer is mid or slower
        else:
            lo = mid + 1              # mid too slow: slower is worse
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
        if hours_at(piles, mid) < h:  # rounded up, but strictly under h
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
        { text: "<strong>Short lists are already in order.</strong> With two nodes, first, last is just first, second, and a single node is only itself. Return the head exactly as it came in.",
          moves: [
            "Return the head untouched",
            "One node or two: nothing needs to move",
            "Three nodes is the first list that changes"
          ],
          checks: [{ input: "1 2", output: "1 2" }, { input: "7", output: "7" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-ll-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="76" y="8" width="30" height="22" rx="6" class="st f5"/><text x="91" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="126" y="8" width="30" height="22" rx="6" class="st f5"/><text x="141" y="19" text-anchor="middle" dominant-baseline="central">2</text><line x1="106" y1="19" x2="122" y2="19" class="st-k" marker-end="url(#ar-ll-1)"/><text x="116" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">first, last is just 1, 2</text></g></svg>`,
          tests: [
            "assert to_list(reorder_list(build_list([1, 2]))) == [1, 2]",
            "assert to_list(reorder_list(build_list([7]))) == [7]"
          ],
          hint: "Returning the head as is cannot survive three nodes: 1, 2, 3 must become 1, 3, 2." },
        { text: "<strong>One stitch: lift the last node up beside the head.</strong> Walk to the end of the chain, detach the last node, and link it right after the head. That single move turns 1, 2, 3 into 1, 3, 2.",
          moves: [
            "Walk down with prev and cur until cur is the last node",
            "Cut the tail loose: prev.next = None",
            "Relink: last.next takes head.next, then head.next takes last"
          ],
          checks: [{ input: "1 2 3", output: "1 3 2" }, { input: "1 2 3 4", output: "1 4 2 3" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-ll-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="10" y="26" width="26" height="22" rx="7" class="st f2"/><text x="23" y="37.5" text-anchor="middle" dominant-baseline="central">1</text><rect x="68" y="26" width="26" height="22" rx="7" class="st f2"/><text x="81" y="37.5" text-anchor="middle" dominant-baseline="central">2</text><rect x="160" y="26" width="26" height="22" rx="7" class="st dsh"/><text x="173" y="37.5" text-anchor="middle" dominant-baseline="central">3</text><line x1="38" y1="37" x2="64" y2="37" class="st-k" marker-end="url(#ar-ll-2)"/><line x1="96" y1="37" x2="156" y2="37" class="st-d dsh"/><path d="M173 24 C150 6 122 6 102 22" class="st-k" marker-end="url(#ar-ll-2)"/></g></svg>`,
          tests: [
            "assert to_list(reorder_list(build_list([1, 2, 3]))) == [1, 3, 2]",
            "assert to_list(reorder_list(build_list([1, 2, 3, 4]))) == [1, 4, 2, 3]"
          ],
          hint: "You need the node before the last one to detach the tail, so walk down with two hands." },
        { text: "<strong>Repeat the stitch on what is left.</strong> After one stitch the first two spots are settled: the head, then the lifted tail. The same job remains on the chain that starts two nodes later, so run the stitch there too, and again, until fewer than three nodes remain.",
          moves: [
            "After a stitch, the unsettled part starts at head.next.next",
            "Run the same stitch on that chain",
            "Stop when two nodes or fewer are left"
          ],
          checks: [{ input: "1 2 3 4 5", output: "1 5 2 4 3" }, { input: "1 2 3 4 5 6 7", output: "1 7 2 6 3 5 4" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="8" y="8" width="26" height="22" rx="7" class="st f5"/><text x="21" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="52" y="8" width="26" height="22" rx="7" class="st f5"/><text x="65" y="19" text-anchor="middle" dominant-baseline="central">5</text><rect x="96" y="8" width="26" height="22" rx="7" class="st f2"/><text x="109" y="19" text-anchor="middle" dominant-baseline="central">2</text><rect x="140" y="8" width="26" height="22" rx="7" class="st f2"/><text x="153" y="19" text-anchor="middle" dominant-baseline="central">3</text><rect x="184" y="8" width="26" height="22" rx="7" class="st f2"/><text x="197" y="19" text-anchor="middle" dominant-baseline="central">4</text><line x1="96" y1="32" x2="96" y2="46" class="st-k"/><line x1="96" y1="46" x2="210" y2="46" class="st-k"/><line x1="210" y1="32" x2="210" y2="46" class="st-k"/><text x="153" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">the same stitch, on the rest</text></g></svg>`,
          tests: [
            "assert to_list(reorder_list(build_list([1, 2, 3, 4, 5]))) == [1, 5, 2, 4, 3]",
            "assert to_list(reorder_list(build_list([1, 2, 3, 4, 5, 6, 7]))) == [1, 7, 2, 6, 3, 5, 4]"
          ],
          hint: "Each stitch settles exactly two nodes, so the unsettled chain always starts two nodes past the head." },
        { text: "<strong>Split, reverse, weave: touch every node once.</strong> The repeated stitch walks to the tail again and again, and every repeat leaves one more call stacked up, so a 3000-node list runs past Python's limit of about 1000. One pass does it: find the middle, reverse the back half, then weave the two halves together.",
          moves: [
            "Find the middle: slow walks one node, fast walks two",
            "Reverse the back half by flipping each next link",
            "Weave: link one node from the front half, then one from the back"
          ],
          checks: [{ input: "3000 nodes, 0 to 2999", output: "0, 2999, 1, 2998, ..." }, { input: "empty list", output: "empty" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-ll-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="14" y="6" width="26" height="18" rx="6" class="st f2"/><text x="27" y="15" text-anchor="middle" dominant-baseline="central">1</text><rect x="48" y="6" width="26" height="18" rx="6" class="st f2"/><text x="61" y="15" text-anchor="middle" dominant-baseline="central">2</text><rect x="14" y="36" width="26" height="18" rx="6" class="st f5"/><text x="27" y="45" text-anchor="middle" dominant-baseline="central">5</text><rect x="48" y="36" width="26" height="18" rx="6" class="st f5"/><text x="61" y="45" text-anchor="middle" dominant-baseline="central">4</text><rect x="82" y="36" width="26" height="18" rx="6" class="st f5"/><text x="95" y="45" text-anchor="middle" dominant-baseline="central">3</text><line x1="27" y1="26" x2="27" y2="34" class="st-k" marker-end="url(#ar-ll-4)"/><line x1="61" y1="26" x2="61" y2="34" class="st-k" marker-end="url(#ar-ll-4)"/><text x="160" y="15" text-anchor="middle" dominant-baseline="central" class="txd txs">front half</text><text x="170" y="45" text-anchor="middle" dominant-baseline="central" class="txd txs">back half reversed</text></g></svg>`,
          tests: [
            "assert to_list(reorder_list(build_list(range(3000)))) == [v for pair in zip(range(3000), range(2999, -1, -1)) for v in pair][:3000]",
            "assert to_list(reorder_list(build_list([]))) == []"
          ],
          hint: "Each repeat of the stitch leaves one more call open, and Python gives up near 1000 stacked calls." }
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


# Step 1: one or two nodes are already in the right order.
def reorder_list(head):
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


# Step 2: one stitch, the last node moves up right after the head.
def reorder_list(head):
    if not head or not head.next:      # one or two nodes: done already
        return head
    prev, cur = None, head
    while cur.next:                    # walk to the last node
        prev, cur = cur, cur.next
    prev.next = None                   # detach the tail
    cur.next = head.next               # park it right after the head
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


# Step 3: stitch, then repeat on the chain two nodes past the head.
def reorder_list(head):
    if not head or not head.next:
        return head
    prev, cur = None, head
    while cur.next:
        prev, cur = cur, cur.next
    prev.next = None                   # one stitch
    cur.next = head.next
    head.next = cur
    rest = head.next.next              # the unsettled middle
    if rest and rest.next:
        reorder_list(rest)             # same job, a shorter chain
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
      prompt: `Given a list of daily temperatures, return a list where <code>answer[i]</code> is the number of days to wait after day i for a strictly warmer temperature, or 0 when none comes.`,
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
        { text: "<strong>No warmer day: every wait is zero.</strong> When the temperature only falls, no day ever sees a warmer one, so every wait is 0. Start with exactly that answer: one zero per day.",
          moves: [
            "Build the answer as one zero per day",
            "Falling temperatures never see a warmer day",
            "Any day that climbs will need more than this"
          ],
          checks: [{ input: "[90, 80, 70]", output: "[0, 0, 0]" }, { input: "[55]", output: "[0]"}],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">temps</text><rect x="52" y="6" width="28" height="20" rx="7" class="st f2"/><text x="66" y="16" text-anchor="middle" dominant-baseline="central">90</text><rect x="84" y="6" width="28" height="20" rx="7" class="st f2"/><text x="98" y="16" text-anchor="middle" dominant-baseline="central">80</text><rect x="116" y="6" width="28" height="20" rx="7" class="st f2"/><text x="130" y="16" text-anchor="middle" dominant-baseline="central">70</text><line x1="66" y1="28" x2="66" y2="33" class="st-d"/><line x1="98" y1="28" x2="98" y2="33" class="st-d"/><line x1="130" y1="28" x2="130" y2="33" class="st-d"/><text x="6" y="44" class="txd txs" text-anchor="start" dominant-baseline="central">answer</text><rect x="52" y="34" width="28" height="20" rx="7" class="st dsh"/><text x="66" y="44" text-anchor="middle" dominant-baseline="central">0</text><rect x="84" y="34" width="28" height="20" rx="7" class="st dsh"/><text x="98" y="44" text-anchor="middle" dominant-baseline="central">0</text><rect x="116" y="34" width="28" height="20" rx="7" class="st dsh"/><text x="130" y="44" text-anchor="middle" dominant-baseline="central">0</text><text x="152" y="30" class="txd txs" text-anchor="start" dominant-baseline="central">no warmer day</text></g></svg>`,
          tests: [
            "assert daily_temperatures([90, 80, 70]) == [0, 0, 0]",
            "assert daily_temperatures([55]) == [0]"
          ],
          hint: "A list of zeros, one per day, is already the whole answer whenever the temperature never rises." },
        { text: "<strong>A climb tomorrow waits exactly one day.</strong> Compare each day with the day right after it. Warmer tomorrow means the wait is 1; anything that does not climb right away stays 0 for now.",
          moves: [
            "Compare temps[i] with temps[i + 1]",
            "Warmer tomorrow: the wait is 1",
            "The last day has no tomorrow: stays 0"
          ],
          checks: [{ input: "[30, 40, 50, 60]", output: "[1, 1, 1, 0]" }, { input: "[50, 60, 55]", output: "[1, 0, 0]"}],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-stk-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">temps</text><rect x="52" y="6" width="28" height="20" rx="7" class="st f2"/><text x="66" y="16" text-anchor="middle" dominant-baseline="central">30</text><rect x="84" y="6" width="28" height="20" rx="7" class="st f2"/><text x="98" y="16" text-anchor="middle" dominant-baseline="central">40</text><rect x="116" y="6" width="28" height="20" rx="7" class="st f2"/><text x="130" y="16" text-anchor="middle" dominant-baseline="central">50</text><rect x="148" y="6" width="28" height="20" rx="7" class="st f2"/><text x="162" y="16" text-anchor="middle" dominant-baseline="central">60</text><line x1="66" y1="28" x2="66" y2="33" class="st-k" marker-end="url(#ar-stk-2)"/><line x1="98" y1="28" x2="98" y2="33" class="st-k" marker-end="url(#ar-stk-2)"/><line x1="130" y1="28" x2="130" y2="33" class="st-k" marker-end="url(#ar-stk-2)"/><line x1="162" y1="28" x2="162" y2="33" class="st-d"/><text x="6" y="44" class="txd txs" text-anchor="start" dominant-baseline="central">answer</text><rect x="52" y="34" width="28" height="20" rx="7" class="st f5"/><text x="66" y="44" text-anchor="middle" dominant-baseline="central">1</text><rect x="84" y="34" width="28" height="20" rx="7" class="st f5"/><text x="98" y="44" text-anchor="middle" dominant-baseline="central">1</text><rect x="116" y="34" width="28" height="20" rx="7" class="st f5"/><text x="130" y="44" text-anchor="middle" dominant-baseline="central">1</text><rect x="148" y="34" width="28" height="20" rx="7" class="st dsh"/><text x="162" y="44" text-anchor="middle" dominant-baseline="central">0</text><text x="184" y="30" class="txd txs" text-anchor="start" dominant-baseline="central">one step each</text></g></svg>`,
          tests: [
            "assert daily_temperatures([30, 40, 50, 60]) == [1, 1, 1, 0]",
            "assert daily_temperatures([50, 60, 55]) == [1, 0, 0]"
          ],
          hint: "This only sees the very next day; a wait of two or more days stays hidden." },
        { text: "<strong>Wait longer: park cold days on a stack.</strong> Keep a stack of indexes for days still waiting for warmth. When a warmer day arrives, the waiting days it settles sit on top of the stack: pop each colder day and record how far it waited.",
          moves: [
            "Push every day's index on the stack",
            "While the day on top is colder than today, pop it",
            "A popped index j waited i - j days",
            "Whatever never pops stays 0"
          ],
          checks: [{ input: "[30, 30, 40]", output: "[2, 1, 0]" }, { input: "[73, 74, 75, 71, 69, 72, 76, 73]", output: "[1, 1, 4, 2, 1, 1, 0, 0]" }, { input: "[20, 15, 10, 25]", output: "[3, 2, 1, 0]"}],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">temps</text><rect x="52" y="6" width="28" height="20" rx="7" class="st f5"/><text x="66" y="16" text-anchor="middle" dominant-baseline="central">30</text><rect x="84" y="6" width="28" height="20" rx="7" class="st f5"/><text x="98" y="16" text-anchor="middle" dominant-baseline="central">30</text><rect x="116" y="6" width="28" height="20" rx="7" class="st f2"/><text x="130" y="16" text-anchor="middle" dominant-baseline="central">40</text><text x="6" y="44" class="txd txs" text-anchor="start" dominant-baseline="central">answer</text><rect x="52" y="34" width="28" height="20" rx="7" class="st f5"/><text x="66" y="44" text-anchor="middle" dominant-baseline="central">2</text><rect x="84" y="34" width="28" height="20" rx="7" class="st f5"/><text x="98" y="44" text-anchor="middle" dominant-baseline="central">1</text><rect x="116" y="34" width="28" height="20" rx="7" class="st dsh"/><text x="130" y="44" text-anchor="middle" dominant-baseline="central">0</text><text x="116" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">the 40 warms both 30s</text></g></svg>`,
          tests: [
            "assert daily_temperatures([30, 30, 40]) == [2, 1, 0]",
            "assert daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]",
            "assert daily_temperatures([20, 15, 10, 25]) == [3, 2, 1, 0]"
          ],
          hint: "Equal days do not warm each other, so both 30s stay stacked until the 40 arrives to pop them." }
      ],
      steps: [
        `# answer[i] = days until a strictly warmer day, or 0 if none comes.
def daily_temperatures(temps):
    return [0] * len(temps)        # no warmer day anywhere
`,
        `# answer[i] = days until a strictly warmer day, or 0 if none comes.
def daily_temperatures(temps):
    answer = [0] * len(temps)
    for i in range(len(temps) - 1):
        if temps[i + 1] > temps[i]:
            answer[i] = 1          # warmer tomorrow: wait one day
    return answer
`,
        `# answer[i] = days until a strictly warmer day, or 0 if none comes.
def daily_temperatures(temps):
    answer = [0] * len(temps)
    stack = []                    # indexes of days still waiting
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()       # j finally sees a warmer day
            answer[j] = i - j
        stack.append(i)
    return answer
`
      ],
      solution: `# answer[i] = days until a strictly warmer day, or 0 if none comes.
def daily_temperatures(temps):
    answer = [0] * len(temps)
    stack = []                    # indexes of days still waiting
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
