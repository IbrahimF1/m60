import { FIG } from "./figures.js";

export const TOOLBOX = [
  {
    id: "python-core",
    title: "Python: The 20% You Need",
    minutes: 5,
    tagline: "Most of every solution is a container choice, a slice, and a comprehension.",
    body: `<h3>Pick the container first</h3>
<p>Most solutions start with a data structure choice. A <a href="https://docs.python.org/3/tutorial/introduction.html#lists"><code>list</code></a> <code>[1, 2, 3]</code> keeps order and duplicates. A <a href="https://docs.python.org/3/library/stdtypes.html#mapping-types-dict"><code>dict</code></a> <code>{'a': 1}</code> maps keys to values. A <a href="https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset"><code>set</code></a> <code>{1, 2}</code> answers "seen it before?" fast. A <a href="https://docs.python.org/3/library/stdtypes.html#common-sequence-operations"><code>tuple</code></a> <code>(r, c)</code> is a frozen record: hashable, so it works as a dict key, and it lets a function return two values at once. Get this choice wrong and every later line pays for it.</p>
${FIG.containers}
<h3>Slices and costs</h3>
<p>Indexes start at zero; negatives count from the end, so <code>nums[-1]</code> is the last item. A slice is <code>a[start:stop:step]</code>: <code>a[::-1]</code> reverses, <code>a[1:]</code> drops the first item, <code>a[-2:]</code> takes the last two. A missing key never raises on <a href="https://docs.python.org/3/library/stdtypes.html#dict.get"><code>get(key, default)</code></a>.</p>
<ul>
<li><a href="https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types"><code>append</code></a> and <a href="https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types"><code>pop</code></a> work on the end: O(1).</li>
<li><a href="https://wiki.python.org/moin/TimeComplexity"><code>insert</code></a> and <a href="https://wiki.python.org/moin/TimeComplexity"><code>remove</code></a> shift every later element: O(n).</li>
<li><code>x in s</code> is O(1) on a <a href="https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset"><code>set</code></a>, O(n) on a list.</li>
</ul>
<p>Those three lines are the price sheet for everything that follows.</p>
<h3>Strings and comprehensions</h3>
<p>Strings are immutable: <code>s += t</code> builds a new string each time. Collect parts in a list and glue once with <a href="https://docs.python.org/3/library/stdtypes.html#str.join"><code>join</code></a>. To transform and filter in one expression, use a <a href="https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions"><code>list comprehension</code></a>: it reads top to bottom as expression, for clause, then if filter. The same shape builds dicts and sets, <code>{k: v for k, v in pairs}</code>.</p>
<pre><code class="language-python">nums = [1, 2, 3, 4, 5]

# Slice [start:stop:step]; a negative step walks backwards
rev = nums[::-1]                  # [5, 4, 3, 2, 1]

# Rotate right by k: last k items, then the rest
k = 2
rotated = nums[-k:] + nums[:-k]   # [4, 5, 1, 2, 3]

# Comprehension with a condition: squares of the evens
sq = [n * n for n in nums if n % 2 == 0]   # [4, 16]

# Count with a default instead of guarding with if
counts = {}
for ch in 'banana':
    counts[ch] = counts.get(ch, 0) + 1
# counts is now {'b': 1, 'a': 3, 'n': 2}</code></pre>
<p class="callout complexity"><strong>Complexity:</strong> per the <a href="https://wiki.python.org/moin/TimeComplexity"><code>TimeComplexity</code></a> wiki, <a href="https://wiki.python.org/moin/TimeComplexity"><code>append</code></a> and <a href="https://wiki.python.org/moin/TimeComplexity"><code>pop</code></a> are O(1), dict and set operations are O(1) on average, and scanning a list is O(n). Price every line you write.</p>`,
    exercise: {
      title: "Running Sum of 1d Array",
      prompt: "Given a list <code>nums</code>, return a list where <code>out[i]</code> equals the sum of <code>nums[0]</code> through <code>nums[i]</code>. Do it in one pass with a running total.",
      leetcode: "https://leetcode.com/problems/running-sum-of-1d-array/",
      docs: [
        { text: "Lists (tutorial)", url: "https://docs.python.org/3/tutorial/introduction.html#lists" },
        { text: "sum()", url: "https://docs.python.org/3/library/functions.html#sum" },
        { text: "enumerate()", url: "https://docs.python.org/3/library/functions.html#enumerate" },
        { text: "List comprehensions", url: "https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions" }
      ],
      starter: `def running_sum(nums):
    pass  # TODO: your turn
`,
      tasks: [
        { text: "The example: <code>[1, 2, 3, 4]</code> &rarr; <code>[1, 3, 6, 10]</code>", test: "assert running_sum([1, 2, 3, 4]) == [1, 3, 6, 10]" },
        { text: "All ones: <code>[1, 1, 1, 1, 1]</code> &rarr; <code>[1, 2, 3, 4, 5]</code>", test: "assert running_sum([1, 1, 1, 1, 1]) == [1, 2, 3, 4, 5]" },
        { text: "Mixed values: <code>[3, 1, 2, 10, 1]</code> &rarr; <code>[3, 4, 6, 16, 17]</code>", test: "assert running_sum([3, 1, 2, 10, 1]) == [3, 4, 6, 16, 17]" },
        { text: "An empty list returns an empty list", test: "assert running_sum([]) == []" },
        { text: "A single element maps to itself: <code>[5]</code> &rarr; <code>[5]</code>", test: "assert running_sum([5]) == [5]" }
      ],
      solution: `def running_sum(nums):
    out = []
    total = 0
    for n in nums:
        total += n
        out.append(total)
    return out
`
    }
  },
  {
    id: "stdlib",
    title: "The Stdlib Toolbox",
    minutes: 5,
    tagline: "The imports that replace most hand-rolled loops: counting, queues, order, top-k, brute force.",
    body: `<p>Almost nothing here needs a library; it needs about a dozen imports. The stdlib already carries the machinery behind most Mediums: counting, grouping, queues, sorted order, top-k, and brute-force generation. Each one replaces a manual loop that is easy to get subtly wrong with the clock running.</p>
${FIG.toolbox}
<h3>collections: counting and grouping</h3>
<p><a href="https://docs.python.org/3/library/collections.html#collections.Counter"><code>Counter</code></a> tallies anything hashable and hands you <a href="https://docs.python.org/3/library/collections.html#collections.Counter"><code>most_common(k)</code></a> for top-k. It behaves like a multiset too: subtract, intersect, and compare counts directly. <a href="https://docs.python.org/3/library/collections.html#collections.defaultdict"><code>defaultdict(list)</code></a> removes the "if key not in d" dance when you group things by a computed key. <a href="https://docs.python.org/3/library/collections.html#collections.deque"><code>deque</code></a> gives O(1) <a href="https://docs.python.org/3/library/collections.html#collections.deque"><code>popleft</code></a>, which makes it your queue, stack, or sliding window.</p>
<h3>Built-ins that delete loops</h3>
<p><a href="https://docs.python.org/3/library/functions.html#sorted"><code>sorted(xs, key=..., reverse=True)</code></a> reorders anything your way; read the <a href="https://docs.python.org/3/howto/sorting.html"><code>Sorting HOWTO</code></a> once. <a href="https://docs.python.org/3/library/functions.html#enumerate"><code>enumerate(xs)</code></a> yields index and item together; <a href="https://docs.python.org/3/library/functions.html#zip"><code>zip(a, b)</code></a> walks sequences in lockstep. Before writing a loop, check <a href="https://docs.python.org/3/library/functions.html#sum"><code>sum</code></a>, <a href="https://docs.python.org/3/library/functions.html#min"><code>min</code></a>, <a href="https://docs.python.org/3/library/functions.html#max"><code>max</code></a>, <a href="https://docs.python.org/3/library/functions.html#abs"><code>abs</code></a>, and the short-circuiting <a href="https://docs.python.org/3/library/functions.html#any"><code>any</code></a> and <a href="https://docs.python.org/3/library/functions.html#all"><code>all</code></a>, which stop at the first answer they find.</p>
<h3>Order, heaps, and generation</h3>
<p>On sorted data, <a href="https://docs.python.org/3/library/bisect.html"><code>bisect_left</code></a> finds an insert point in O(log n) and <a href="https://docs.python.org/3/library/bisect.html"><code>insort</code></a> inserts there. <a href="https://docs.python.org/3/library/heapq.html"><code>heappush</code></a> and <a href="https://docs.python.org/3/library/heapq.html"><code>heappop</code></a> maintain a min-heap; <a href="https://docs.python.org/3/library/heapq.html"><code>nlargest(k, xs)</code></a> answers top-k in one call. <a href="https://docs.python.org/3/library/itertools.html"><code>product</code></a>, <a href="https://docs.python.org/3/library/itertools.html"><code>permutations</code></a>, and <a href="https://docs.python.org/3/library/itertools.html"><code>combinations</code></a> enumerate candidate universes: on grids, <a href="https://docs.python.org/3/library/itertools.html"><code>product(range(m), range(n))</code></a> visits every cell. <a href="https://docs.python.org/3/library/itertools.html"><code>accumulate</code></a> emits running totals. Memoize recursion with <a href="https://docs.python.org/3/library/functools.html#functools.lru_cache"><code>lru_cache</code></a>; reduce fractions with <a href="https://docs.python.org/3/library/math.html#math.gcd"><code>math.gcd</code></a>.</p>
<pre><code class="language-python">from collections import Counter, defaultdict, deque
import heapq

# Count and compare: anagram test in one line
same = Counter('listen') == Counter('silent')   # True

# Group by key, no guards needed
by_len = defaultdict(list)
for w in ['ox', 'go', 'cat']:
    by_len[len(w)].append(w)         # {2: ['ox', 'go'], 3: ['cat']}

q = deque(['a', 'b'])                # O(1) at both ends
front = q.popleft()                  # 'a'

heap = [(2, 'b')]                    # min-heap of (value, label)
heapq.heappush(heap, (1, 'a'))
best = heapq.heappop(heap)           # (1, 'a')</code></pre>
<p class="callout complexity"><strong>Complexity:</strong> <a href="https://docs.python.org/3/library/collections.html#collections.Counter"><code>Counter</code></a> and <a href="https://docs.python.org/3/library/itertools.html"><code>accumulate</code></a> are O(n); a heap push or pop is O(log n); bisect search is O(log n) but <a href="https://docs.python.org/3/library/bisect.html"><code>insort</code></a> must shift, O(n); <a href="https://docs.python.org/3/library/itertools.html"><code>permutations</code></a> grows as n factorial, so cap n near ten.</p>`,
    exercise: {
      title: "Valid Anagram",
      prompt: "Given two strings <code>s</code> and <code>t</code>, return <code>True</code> if <code>t</code> is an anagram of <code>s</code>, else <code>False</code>. Count both with <code>Counter</code> and compare the multisets in one expression.",
      leetcode: "https://leetcode.com/problems/valid-anagram/",
      docs: [
        { text: "collections.Counter", url: "https://docs.python.org/3/library/collections.html#collections.Counter" },
        { text: "sorted()", url: "https://docs.python.org/3/library/functions.html#sorted" },
        { text: "Sorting HOWTO", url: "https://docs.python.org/3/howto/sorting.html" },
        { text: "TimeComplexity wiki", url: "https://wiki.python.org/moin/TimeComplexity" }
      ],
      starter: `from collections import Counter


def is_anagram(s, t):
    pass  # TODO: your turn
`,
      tasks: [
        { text: "Anagrams: <code>anagram</code> and <code>nagaram</code> return <code>True</code>", test: "assert is_anagram('anagram', 'nagaram') is True" },
        { text: "Not anagrams: <code>rat</code> and <code>car</code> return <code>False</code>", test: "assert is_anagram('rat', 'car') is False" },
        { text: "Two empty strings are anagrams", test: "assert is_anagram('', '') is True" },
        { text: "Different lengths can never match: <code>a</code> and <code>ab</code>", test: "assert is_anagram('a', 'ab') is False" },
        { text: "Repeated letters still count: <code>aab</code> and <code>aba</code>", test: "assert is_anagram('aab', 'aba') is True" }
      ],
      solution: `from collections import Counter


def is_anagram(s, t):
    return Counter(s) == Counter(t)
`
    }
  },
  {
    id: "idioms",
    title: "Idioms, Pitfalls & Big-O",
    minutes: 4,
    tagline: "The traps that fail a 10^5-element test, and the idioms that read well.",
    body: `<h3>Price every operation</h3>
<p>Big-O in Python is per operation, not per program: a loop that rescans a list each pass is O(n^2) even though it looks innocent. Before you commit, look up each op on the <a href="https://wiki.python.org/moin/TimeComplexity"><code>TimeComplexity</code></a> wiki page and multiply; write the loop counts next to your lines if unsure. Most Medium timeouts come from one hidden O(n) scan inside a loop.</p>
<h3>Traps that cost answers</h3>
<p>Each of these looks harmless in an editor and fails on a 10^5-element test:</p>
<ul>
<li>String <code>s += t</code> in a loop is O(n^2); <a href="https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types"><code>append</code></a> parts to a list and <a href="https://docs.python.org/3/library/stdtypes.html#str.join"><code>join</code></a> once.</li>
<li><code>b = a</code> is an alias, not a copy: both names point at one list. Copy with <a href="https://docs.python.org/3/library/stdtypes.html#common-sequence-operations"><code>a[:]</code></a> when you need two.</li>
<li>Sorting is O(n log n); call <a href="https://docs.python.org/3/library/functions.html#sorted"><code>sorted</code></a> once, outside the loop, never per iteration.</li>
<li>Mutable defaults persist across calls: <code>def f(seen=[])</code> reuses the same list. Take <code>None</code> and build inside.</li>
<li>Recursion depth tops out near 1000; raise it with <a href="https://docs.python.org/3/library/sys.html#sys.setrecursionlimit"><code>sys.setrecursionlimit</code></a> or rewrite as a loop.</li>
</ul>
${FIG.alias}
<h3>Small idioms that read well</h3>
<p>Swap with <code>a, b = b, a</code>; no temp variable needed. Use <code>//</code> for integer division: <code>(lo + hi) // 2</code> is the binary search midpoint. Iterate with <a href="https://docs.python.org/3/library/functions.html#enumerate"><code>enumerate(xs)</code></a>, never <code>range(len(xs))</code>. Empty input is the most common wrong answer and takes seconds to check; run the empty list and the single element before anything else.</p>
<pre><code class="language-python"># join once: build the whole string in a single O(n) pass
parts = []
for i in range(5):
    parts.append(str(i * 2))    # collect the pieces
s = ''.join(parts)              # '02468'

a = [1, 2, 3]
b = a                           # alias: the very same object
b.append(4)                     # a is [1, 2, 3, 4] now too
c = a[:]                        # real copy, independent

# swap and integer division
x, y = 3, 8
x, y = y, x
mid = (0 + 7) // 2              # 3, integer division

def bad(seen=[]):               # trap: seen survives calls
    seen.append(1)
    return seen</code></pre>
<p class="callout complexity"><strong>Complexity:</strong> join once, copy on purpose, sort once, and know your recursion depth. Each trap above is a hidden cost; avoid them and the O(n) you designed is the O(n) you get.</p>`,
    exercise: {
      title: "Product of Array Except Self",
      prompt: "Given <code>nums</code>, return a list where <code>out[i]</code> is the product of every element except <code>nums[i]</code>. Division is banned: make one prefix pass and one suffix pass.",
      leetcode: "https://leetcode.com/problems/product-of-array-except-self/",
      docs: [
        { text: "TimeComplexity wiki", url: "https://wiki.python.org/moin/TimeComplexity" },
        { text: "Common sequence operations", url: "https://docs.python.org/3/library/stdtypes.html#common-sequence-operations" },
        { text: "Mutable sequence types", url: "https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types" },
        { text: "enumerate()", url: "https://docs.python.org/3/library/functions.html#enumerate" }
      ],
      starter: `def product_except_self(nums):
    pass  # TODO: your turn
`,
      tasks: [
        { text: "The example: <code>[1, 2, 3, 4]</code> &rarr; <code>[24, 12, 8, 6]</code>", test: "assert product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6]" },
        { text: "A single zero zeroes every other slot: <code>[-1, 1, 0, -3, 3]</code> &rarr; <code>[0, 0, 9, 0, 0]</code>", test: "assert product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]" },
        { text: "Two elements swap: <code>[2, 3]</code> &rarr; <code>[3, 2]</code>", test: "assert product_except_self([2, 3]) == [3, 2]" },
        { text: "One element: the product of nothing is <code>1</code>", test: "assert product_except_self([5]) == [1]" },
        { text: "Empty input returns empty output", test: "assert product_except_self([]) == []" }
      ],
      solution: `def product_except_self(nums):
    n = len(nums)
    out = [1] * n
    prefix = 1
    for i in range(n):
        out[i] = prefix
        prefix *= nums[i]
    suffix = 1
    for i in range(n - 1, -1, -1):
        out[i] *= suffix
        suffix *= nums[i]
    return out
`
    }
  }
];
