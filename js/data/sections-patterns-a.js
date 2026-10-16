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

# ---- tests ----
assert sorted(sorted(g) for g in group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])) == [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]
assert sorted(sorted(g) for g in group_anagrams(["ab", "ba", "abc", "cba"])) == [["ab", "ba"], ["abc", "cba"]]
assert group_anagrams([""]) == [[""]]
assert group_anagrams(["a"]) == [["a"]]
print("All tests passed!")
`,
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

# ---- tests ----
assert two_sum([2, 7, 11, 15], 9) == [1, 2]
assert two_sum([2, 3, 4], 6) == [1, 3]
assert two_sum([-1, 0], -1) == [1, 2]
assert two_sum([1, 2, 3, 4, 4, 9, 56, 90], 8) == [4, 5]
print("All tests passed!")
`,
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

# ---- tests ----
assert length_of_longest_substring("abcabcbb") == 3
assert length_of_longest_substring("bbbbb") == 1
assert length_of_longest_substring("pwwkew") == 3
assert length_of_longest_substring("dvdf") == 3
assert length_of_longest_substring("") == 0
print("All tests passed!")
`,
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

# ---- tests ----
assert min_eating_speed([3, 6, 7, 11], 8) == 4
assert min_eating_speed([30, 11, 23, 4, 20], 5) == 30
assert min_eating_speed([30, 11, 23, 4, 20], 6) == 23
assert min_eating_speed([5], 3) == 2
print("All tests passed!")
`,
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

# ---- tests ----
assert to_list(reorder_list(build_list([1, 2, 3, 4]))) == [1, 4, 2, 3]
assert to_list(reorder_list(build_list([1, 2, 3, 4, 5]))) == [1, 5, 2, 4, 3]
assert to_list(reorder_list(build_list([1, 2]))) == [1, 2]
assert to_list(reorder_list(build_list([1]))) == [1]
assert to_list(reorder_list(build_list([]))) == []
print("All tests passed!")
`,
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

# ---- tests ----
assert daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]
assert daily_temperatures([30, 40, 50, 60]) == [1, 1, 1, 0]
assert daily_temperatures([30, 60, 90]) == [1, 1, 0]
assert daily_temperatures([90, 80, 70]) == [0, 0, 0]
assert daily_temperatures([55]) == [0]
print("All tests passed!")
`,
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
