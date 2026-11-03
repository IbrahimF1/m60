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
        {
          text: "<strong>Write the three sums out by hand.</strong> Each output slot is a prefix of the input, so spelling out three additions gets the small case right before you generalize.",
          moves: [
            "Return a list with one entry per input slot",
            "out[0] is nums[0]",
            "out[1] adds nums[0] and nums[1]",
            "out[2] adds all three values"
          ],
          checks: [{ input: "[1, 2, 3]", output: "[1, 3, 6]" }, { input: "[2, 2, 2]", output: "[2, 4, 6]" }],
          diagram: `<svg viewBox="0 0 232 66" aria-hidden="true" focusable="false"><defs><marker id="ar-pc-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="38" y="6" width="28" height="20" rx="7" class="st f2"/><text x="52" y="16" text-anchor="middle" dominant-baseline="central">1</text><rect x="74" y="6" width="28" height="20" rx="7" class="st f2"/><text x="88" y="16" text-anchor="middle" dominant-baseline="central">2</text><rect x="110" y="6" width="28" height="20" rx="7" class="st f2"/><text x="124" y="16" text-anchor="middle" dominant-baseline="central">3</text><line x1="52" y1="28" x2="52" y2="35" class="st-k" marker-end="url(#ar-pc-1)"/><line x1="88" y1="28" x2="88" y2="35" class="st-k" marker-end="url(#ar-pc-1)"/><line x1="124" y1="28" x2="124" y2="35" class="st-k" marker-end="url(#ar-pc-1)"/><text x="6" y="48" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="38" y="38" width="28" height="20" rx="7" class="st f5"/><text x="52" y="48" text-anchor="middle" dominant-baseline="central">1</text><rect x="74" y="38" width="28" height="20" rx="7" class="st f5"/><text x="88" y="48" text-anchor="middle" dominant-baseline="central">3</text><rect x="110" y="38" width="28" height="20" rx="7" class="st f5"/><text x="124" y="48" text-anchor="middle" dominant-baseline="central">6</text><text x="150" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">prefix</text><text x="150" y="48" class="txd txs" text-anchor="start" dominant-baseline="central">three sums</text></g></svg>`,
          tests: [
            "assert running_sum([1, 2, 3]) == [1, 3, 6]",
            "assert running_sum([2, 2, 2]) == [2, 4, 6]"
          ],
          hint: "Three spelled-out indexes only work while the input has exactly three entries."
        },
        {
          text: "<strong>Replace the three sums with one running total.</strong> Add each value once and append the total, so the loop no longer cares how long the input is.",
          moves: [
            "Start from the first value and its total",
            "Walk the remaining values one at a time",
            "Add each value to the total, then append the total"
          ],
          checks: [{ input: "[1, 2, 3, 4]", output: "[1, 3, 6, 10]" }, { input: "[2, 2, 2, 2]", output: "[2, 4, 6, 8]" }],
          diagram: `<svg viewBox="0 0 232 60" aria-hidden="true" focusable="false"><defs><marker id="ar-pc-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="4" y="14" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="34" y="4" width="26" height="20" rx="7" class="st f2"/><text x="47" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="68" y="4" width="26" height="20" rx="7" class="st f2"/><text x="81" y="14" text-anchor="middle" dominant-baseline="central">2</text><rect x="102" y="4" width="26" height="20" rx="7" class="st f2"/><text x="115" y="14" text-anchor="middle" dominant-baseline="central">3</text><rect x="136" y="4" width="26" height="20" rx="7" class="st f2"/><text x="149" y="14" text-anchor="middle" dominant-baseline="central">4</text><line x1="47" y1="26" x2="47" y2="31" class="st-k" marker-end="url(#ar-pc-2)"/><line x1="81" y1="26" x2="81" y2="31" class="st-k" marker-end="url(#ar-pc-2)"/><line x1="115" y1="26" x2="115" y2="31" class="st-k" marker-end="url(#ar-pc-2)"/><line x1="149" y1="26" x2="149" y2="31" class="st-k" marker-end="url(#ar-pc-2)"/><text x="4" y="44" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="34" y="34" width="26" height="20" rx="7" class="st f5"/><text x="47" y="44" text-anchor="middle" dominant-baseline="central">1</text><rect x="68" y="34" width="26" height="20" rx="7" class="st f5"/><text x="81" y="44" text-anchor="middle" dominant-baseline="central">3</text><rect x="102" y="34" width="26" height="20" rx="7" class="st f5"/><text x="115" y="44" text-anchor="middle" dominant-baseline="central">6</text><rect x="136" y="34" width="26" height="20" rx="7" class="st f5"/><text x="149" y="44" text-anchor="middle" dominant-baseline="central">10</text><text x="172" y="34" class="txd txs" text-anchor="start" dominant-baseline="central">running</text><text x="172" y="48" class="txd txs" text-anchor="start" dominant-baseline="central">total</text></g></svg>`,
          tests: [
            "assert running_sum([1, 2, 3, 4]) == [1, 3, 6, 10]",
            "assert running_sum([2, 2, 2, 2]) == [2, 4, 6, 8]"
          ],
          hint: "Do not rebuild each prefix from scratch; carry the last total forward instead."
        },
        {
          text: "<strong>Guard the empty list before you read index zero.</strong> A seeded accumulator needs a first value, so return early when there is nothing to sum.",
          moves: [
            "Check whether nums is empty first",
            "Return [] when it is",
            "Leave the seeded loop for non-empty input",
            "One value still maps to itself"
          ],
          checks: [{ input: "[]", output: "[]" }, { input: "[5]", output: "[5]" }],
          diagram: `<svg viewBox="0 0 232 64" aria-hidden="true" focusable="false"><defs><marker id="ar-pc-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">empty</text><rect x="52" y="6" width="44" height="20" rx="7" class="st dsh"/><text x="74" y="16" text-anchor="middle" dominant-baseline="central" class="txs">[]</text><line x1="100" y1="16" x2="126" y2="16" class="st-k" marker-end="url(#ar-pc-3)"/><rect x="130" y="6" width="44" height="20" rx="7" class="st dsh"/><text x="152" y="16" text-anchor="middle" dominant-baseline="central" class="txs">[]</text><text x="6" y="46" class="txd txs" text-anchor="start" dominant-baseline="central">single</text><rect x="52" y="36" width="26" height="20" rx="7" class="st f2"/><text x="65" y="46" text-anchor="middle" dominant-baseline="central">5</text><line x1="82" y1="46" x2="126" y2="46" class="st-k" marker-end="url(#ar-pc-3)"/><rect x="130" y="36" width="26" height="20" rx="7" class="st f5"/><text x="143" y="46" text-anchor="middle" dominant-baseline="central">5</text></g></svg>`,
          tests: [
            "assert running_sum([]) == []",
            "assert running_sum([5]) == [5]"
          ],
          hint: "The guard has to come before nums[0], not after the crash."
        }
      ],
      steps: [
        `def running_sum(nums):
    return [nums[0], nums[0] + nums[1], nums[0] + nums[1] + nums[2]]
`,
        `def running_sum(nums):
    out = [nums[0]]
    for n in nums[1:]:
        out.append(out[-1] + n)
    return out
`,
        `def running_sum(nums):
    out = []
    total = 0
    for n in nums:
        total += n
        out.append(total)
    return out
`
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
        {
          text: "<strong>Start with exact equality.</strong> The simplest answer compares the two strings character by character, which is right only when the order already matches.",
          moves: [
            "Compare s and t with ==",
            "Return the boolean result",
            "Same letters in the same order gives True"
          ],
          checks: [{ input: "s=abc t=abc", output: "True" }, { input: "s=ab t=ab", output: "True" }],
          diagram: `<svg viewBox="0 0 232 56" aria-hidden="true" focusable="false"><g><text x="6" y="17" class="txd txs" text-anchor="start" dominant-baseline="central">s</text><rect x="24" y="6" width="24" height="22" rx="7" class="st f2"/><text x="36" y="17" text-anchor="middle" dominant-baseline="central">a</text><rect x="56" y="6" width="24" height="22" rx="7" class="st f2"/><text x="68" y="17" text-anchor="middle" dominant-baseline="central">b</text><rect x="88" y="6" width="24" height="22" rx="7" class="st f2"/><text x="100" y="17" text-anchor="middle" dominant-baseline="central">c</text><text x="120" y="17" class="txd txs" text-anchor="middle" dominant-baseline="central">=</text><text x="132" y="17" class="txd txs" text-anchor="start" dominant-baseline="central">t</text><rect x="146" y="6" width="24" height="22" rx="7" class="st f5"/><text x="158" y="17" text-anchor="middle" dominant-baseline="central">a</text><rect x="176" y="6" width="24" height="22" rx="7" class="st f5"/><text x="188" y="17" text-anchor="middle" dominant-baseline="central">b</text><rect x="206" y="6" width="24" height="22" rx="7" class="st f5"/><text x="218" y="17" text-anchor="middle" dominant-baseline="central">c</text><text x="116" y="44" class="txd txs" text-anchor="middle" dominant-baseline="central">same letters, same order</text></g></svg>`,
          tests: [
            "assert is_anagram('abc', 'abc') is True",
            "assert is_anagram('ab', 'ab') is True"
          ],
          hint: "Equality is stricter than an anagram: it also demands the same order."
        },
        {
          text: "<strong>Ignore the order.</strong> An anagram keeps the same letters, so compare the letter sets and check that the lengths match.",
          moves: [
            "Reject pairs whose lengths differ",
            "Compare set(s) with set(t)",
            "Return True when both checks match"
          ],
          checks: [{ input: "s=anagram t=nagaram", output: "True" }, { input: "s=ab t=ba", output: "True" }, { input: "s=abcd t=abcc", output: "False" }],
          diagram: `<svg viewBox="0 0 232 74" aria-hidden="true" focusable="false"><defs><marker id="ar-sd-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="17" class="txd txs" text-anchor="start" dominant-baseline="central">s</text><rect x="26" y="6" width="24" height="22" rx="7" class="st f2"/><text x="38" y="17" text-anchor="middle" dominant-baseline="central">a</text><rect x="58" y="6" width="24" height="22" rx="7" class="st f2"/><text x="70" y="17" text-anchor="middle" dominant-baseline="central">b</text><text x="130" y="17" class="txd txs" text-anchor="start" dominant-baseline="central">t</text><rect x="150" y="6" width="24" height="22" rx="7" class="st f5"/><text x="162" y="17" text-anchor="middle" dominant-baseline="central">b</text><rect x="182" y="6" width="24" height="22" rx="7" class="st f5"/><text x="194" y="17" text-anchor="middle" dominant-baseline="central">a</text><path d="M38 30 C66 46 140 46 160 31" class="st-k" marker-end="url(#ar-sd-2)"/><path d="M70 30 C96 44 168 44 192 31" class="st-k" marker-end="url(#ar-sd-2)"/><text x="116" y="64" class="txd txs" text-anchor="middle" dominant-baseline="central">same letters, new order</text></g></svg>`,
          tests: [
            "assert is_anagram('anagram', 'nagaram') is True",
            "assert is_anagram('ab', 'ba') is True",
            "assert is_anagram('abcd', 'abcc') is False"
          ],
          hint: "Order is irrelevant now, but equal sets say nothing about how often each letter appears."
        },
        {
          text: "<strong>Count how many times each letter appears.</strong> A set comparison passes aab and abb, so compare the multiplicities instead.",
          moves: [
            "Count every character in each string",
            "Compare the two count maps",
            "Equal counts mean an anagram"
          ],
          checks: [{ input: "s=aab t=abb", output: "False" }, { input: "s=aabbcc t=abcabc", output: "True" }],
          diagram: `<svg viewBox="0 0 232 72" aria-hidden="true" focusable="false"><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">s</text><rect x="26" y="6" width="44" height="20" rx="7" class="st f2"/><text x="48" y="16" text-anchor="middle" dominant-baseline="central" class="txs">a 2</text><rect x="76" y="6" width="44" height="20" rx="7" class="st f2"/><text x="98" y="16" text-anchor="middle" dominant-baseline="central" class="txs">b 1</text><text x="136" y="29" class="txd txs" text-anchor="middle" dominant-baseline="central">!=</text><text x="6" y="44" class="txd txs" text-anchor="start" dominant-baseline="central">t</text><rect x="26" y="34" width="44" height="20" rx="7" class="st f5"/><text x="48" y="44" text-anchor="middle" dominant-baseline="central" class="txs">a 1</text><rect x="76" y="34" width="44" height="20" rx="7" class="st f5"/><text x="98" y="44" text-anchor="middle" dominant-baseline="central" class="txs">b 2</text><text x="116" y="64" class="txd txs" text-anchor="middle" dominant-baseline="central">same letters, different counts</text></g></svg>`,
          tests: [
            "assert is_anagram('aab', 'abb') is False",
            "assert is_anagram('aabbcc', 'abcabc') is True"
          ],
          hint: "Equal lengths and equal sets still allow different counts; aab and abb prove it."
        },
        {
          text: "<strong>Guard the empty and one-sided pairs.</strong> Empty counts compare equal, while a letter with no matching count must answer False instead of raising.",
          moves: [
            "Both empty: return True",
            "One empty and one not: return False",
            "Compare the counts for every other pair",
            "Let Counter handle the missing key"
          ],
          checks: [{ input: "s=\"\" t=\"\"", output: "True" }, { input: "s=\"\" t=\"a\"", output: "False" }, { input: "s=\"aabb\" t=\"bbaa\"", output: "True" }, { input: "s=\"aabb\" t=\"abbb\"", output: "False" }],
          diagram: `<svg viewBox="0 0 232 78" aria-hidden="true" focusable="false"><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">empty</text><rect x="66" y="6" width="44" height="20" rx="7" class="st dsh"/><text x="88" y="16" text-anchor="middle" dominant-baseline="central" class="txs">[]</text><rect x="118" y="6" width="44" height="20" rx="7" class="st dsh"/><text x="140" y="16" text-anchor="middle" dominant-baseline="central" class="txs">[]</text><text x="186" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">True</text><text x="6" y="42" class="txd txs" text-anchor="start" dominant-baseline="central">one empty</text><rect x="66" y="32" width="44" height="20" rx="7" class="st dsh"/><text x="88" y="42" text-anchor="middle" dominant-baseline="central" class="txs">[]</text><rect x="118" y="32" width="44" height="20" rx="7" class="st f2"/><text x="140" y="42" text-anchor="middle" dominant-baseline="central">a</text><text x="186" y="42" class="txd txs" text-anchor="start" dominant-baseline="central">False</text><text x="6" y="68" class="txd txs" text-anchor="start" dominant-baseline="central">near</text><rect x="66" y="58" width="44" height="20" rx="7" class="st f2"/><text x="88" y="68" text-anchor="middle" dominant-baseline="central" class="txs">aabb</text><rect x="118" y="58" width="44" height="20" rx="7" class="st f2"/><text x="140" y="68" text-anchor="middle" dominant-baseline="central" class="txs">abbb</text><text x="186" y="68" class="txd txs" text-anchor="start" dominant-baseline="central">False</text></g></svg>`,
          tests: [
            "assert is_anagram('', '') is True and is_anagram('', 'a') is False",
            "assert is_anagram('aabb', 'bbaa') is True and is_anagram('aabb', 'abbb') is False"
          ],
          hint: "A hand-rolled decrement raises KeyError on a letter the first string never had."
        }
      ],
      steps: [
        `from collections import Counter


def is_anagram(s, t):
    return s == t
`,
        `from collections import Counter


def is_anagram(s, t):
    return len(s) == len(t) and set(s) == set(t)
`,
        `from collections import Counter


def is_anagram(s, t):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    for ch in t:
        counts[ch] -= 1
    return all(v == 0 for v in counts.values())
`,
        `from collections import Counter


def is_anagram(s, t):
    return Counter(s) == Counter(t)
`
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
        {
          text: "<strong>Use the total product and divide it out.</strong> With no zeros, every other slot is just the total divided by the value you are excluding.",
          moves: [
            "Multiply every value into one total",
            "Divide the total by nums[i] for each i",
            "Return the quotients in input order"
          ],
          checks: [{ input: "[1, 2, 3, 4]", output: "[24, 12, 8, 6]" }, { input: "[2, 3, 4]", output: "[12, 8, 6]" }],
          diagram: `<svg viewBox="0 0 232 76" aria-hidden="true" focusable="false"><defs><marker id="ar-id-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="4" y="14" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="40" y="4" width="26" height="20" rx="7" class="st f2"/><text x="53" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="72" y="4" width="26" height="20" rx="7" class="st f2"/><text x="85" y="14" text-anchor="middle" dominant-baseline="central">2</text><rect x="104" y="4" width="26" height="20" rx="7" class="st f2"/><text x="117" y="14" text-anchor="middle" dominant-baseline="central">3</text><rect x="136" y="4" width="26" height="20" rx="7" class="st f2"/><text x="149" y="14" text-anchor="middle" dominant-baseline="central">4</text><text x="176" y="14" class="txd txs" text-anchor="start" dominant-baseline="central">24</text><line x1="53" y1="26" x2="53" y2="31" class="st-k" marker-end="url(#ar-id-1)"/><line x1="85" y1="26" x2="85" y2="31" class="st-k" marker-end="url(#ar-id-1)"/><line x1="117" y1="26" x2="117" y2="31" class="st-k" marker-end="url(#ar-id-1)"/><line x1="149" y1="26" x2="149" y2="31" class="st-k" marker-end="url(#ar-id-1)"/><text x="4" y="42" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="40" y="32" width="26" height="20" rx="7" class="st f5"/><text x="53" y="42" text-anchor="middle" dominant-baseline="central">24</text><rect x="72" y="32" width="26" height="20" rx="7" class="st f5"/><text x="85" y="42" text-anchor="middle" dominant-baseline="central">12</text><rect x="104" y="32" width="26" height="20" rx="7" class="st f5"/><text x="117" y="42" text-anchor="middle" dominant-baseline="central">8</text><rect x="136" y="32" width="26" height="20" rx="7" class="st f5"/><text x="149" y="42" text-anchor="middle" dominant-baseline="central">6</text><text x="116" y="64" class="txd txs" text-anchor="middle" dominant-baseline="central">total / nums[i]</text></g></svg>`,
          tests: [
            "assert product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6]",
            "assert product_except_self([2, 3, 4]) == [12, 8, 6]"
          ],
          hint: "Division stops working at the first zero, so treat this as the no-zero case only."
        },
        {
          text: "<strong>Handle one zero without dividing.</strong> The zero's own slot becomes the product of the other values, and every other slot becomes zero.",
          moves: [
            "Multiply only the nonzero values",
            "Remember the index of the zero",
            "No zero: divide as before",
            "One zero: put the nonzero product at that index"
          ],
          checks: [{ input: "[-1, 1, 0, -3, 3]", output: "[0, 0, 9, 0, 0]" }, { input: "[0, 7]", output: "[7, 0]" }, { input: "[2, 0, 3]", output: "[0, 6, 0]" }],
          diagram: `<svg viewBox="0 0 232 86" aria-hidden="true" focusable="false"><defs><marker id="ar-id-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="4" y="14" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="34" y="4" width="28" height="20" rx="7" class="st f2"/><text x="48" y="14" text-anchor="middle" dominant-baseline="central">-1</text><rect x="68" y="4" width="28" height="20" rx="7" class="st f2"/><text x="82" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="102" y="4" width="28" height="20" rx="7" class="st f5 st-k"/><text x="116" y="14" text-anchor="middle" dominant-baseline="central">0</text><rect x="136" y="4" width="28" height="20" rx="7" class="st f2"/><text x="150" y="14" text-anchor="middle" dominant-baseline="central">-3</text><rect x="170" y="4" width="28" height="20" rx="7" class="st f2"/><text x="184" y="14" text-anchor="middle" dominant-baseline="central">3</text><line x1="116" y1="26" x2="116" y2="37" class="st-k" marker-end="url(#ar-id-2)"/><text x="4" y="52" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="34" y="42" width="28" height="20" rx="7" class="st f2"/><text x="48" y="52" text-anchor="middle" dominant-baseline="central">0</text><rect x="68" y="42" width="28" height="20" rx="7" class="st f2"/><text x="82" y="52" text-anchor="middle" dominant-baseline="central">0</text><rect x="102" y="42" width="28" height="20" rx="7" class="st f5 st-k"/><text x="116" y="52" text-anchor="middle" dominant-baseline="central">9</text><rect x="136" y="42" width="28" height="20" rx="7" class="st f2"/><text x="150" y="52" text-anchor="middle" dominant-baseline="central">0</text><rect x="170" y="42" width="28" height="20" rx="7" class="st f2"/><text x="184" y="52" text-anchor="middle" dominant-baseline="central">0</text><text x="116" y="76" class="txd txs" text-anchor="middle" dominant-baseline="central">one zero: product of the rest</text></g></svg>`,
          tests: [
            "assert product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]",
            "assert product_except_self([0, 7]) == [7, 0]",
            "assert product_except_self([2, 0, 3]) == [0, 6, 0]"
          ],
          hint: "A single zero needs its index; a flag alone cannot tell you where to put the product."
        },
        {
          text: "<strong>Two zeros zero every slot, so stop dividing.</strong> Build prefix products from the left and suffix products from the right, then multiply them at each index.",
          moves: [
            "Write the product of everything left of i",
            "Walk back with the product of everything right",
            "Multiply prefix by suffix at every index"
          ],
          checks: [{ input: "[0, 0, 3]", output: "[0, 0, 0]" }, { input: "[1, 0, 0, 2]", output: "[0, 0, 0, 0]" }, { input: "[0, 0]", output: "[0, 0]" }],
          diagram: `<svg viewBox="0 0 232 88" aria-hidden="true" focusable="false"><g><text x="4" y="10" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="64" y="2" width="28" height="16" rx="6" class="st f2"/><text x="78" y="10" text-anchor="middle" dominant-baseline="central">0</text><rect x="100" y="2" width="28" height="16" rx="6" class="st f2"/><text x="114" y="10" text-anchor="middle" dominant-baseline="central">0</text><rect x="136" y="2" width="28" height="16" rx="6" class="st f2"/><text x="150" y="10" text-anchor="middle" dominant-baseline="central">3</text><text x="4" y="32" class="txd txs" text-anchor="start" dominant-baseline="central">pre</text><rect x="64" y="24" width="28" height="16" rx="6" class="st f5"/><text x="78" y="32" text-anchor="middle" dominant-baseline="central">1</text><rect x="100" y="24" width="28" height="16" rx="6" class="st f5"/><text x="114" y="32" text-anchor="middle" dominant-baseline="central">0</text><rect x="136" y="24" width="28" height="16" rx="6" class="st f5"/><text x="150" y="32" text-anchor="middle" dominant-baseline="central">0</text><text x="4" y="54" class="txd txs" text-anchor="start" dominant-baseline="central">suf</text><rect x="64" y="46" width="28" height="16" rx="6" class="st f5"/><text x="78" y="54" text-anchor="middle" dominant-baseline="central">0</text><rect x="100" y="46" width="28" height="16" rx="6" class="st f5"/><text x="114" y="54" text-anchor="middle" dominant-baseline="central">3</text><rect x="136" y="46" width="28" height="16" rx="6" class="st f5"/><text x="150" y="54" text-anchor="middle" dominant-baseline="central">1</text><text x="4" y="76" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="64" y="68" width="28" height="16" rx="6" class="st f2"/><text x="78" y="76" text-anchor="middle" dominant-baseline="central">0</text><rect x="100" y="68" width="28" height="16" rx="6" class="st f2"/><text x="114" y="76" text-anchor="middle" dominant-baseline="central">0</text><rect x="136" y="68" width="28" height="16" rx="6" class="st f2"/><text x="150" y="76" text-anchor="middle" dominant-baseline="central">0</text><text x="176" y="54" class="txd txs" text-anchor="start" dominant-baseline="central">pre * suf</text></g></svg>`,
          tests: [
            "assert product_except_self([0, 0, 3]) == [0, 0, 0]",
            "assert product_except_self([1, 0, 0, 2]) == [0, 0, 0, 0]",
            "assert product_except_self([0, 0]) == [0, 0]"
          ],
          hint: "A zero-count patch still fails at the second zero; prefix and suffix never divide."
        },
        {
          text: "<strong>Start the prefix table empty so an empty input stays empty.</strong> Seeding the table with one is convenient for real input but invents an answer when there is no input.",
          moves: [
            "Return [] when nums has no values",
            "Otherwise build one slot per input value",
            "A single value leaves its own slot at 1"
          ],
          checks: [{ input: "[]", output: "[]" }, { input: "[5]", output: "[1]" }],
          diagram: `<svg viewBox="0 0 232 64" aria-hidden="true" focusable="false"><defs><marker id="ar-id-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="16" class="txd txs" text-anchor="start" dominant-baseline="central">empty</text><rect x="64" y="6" width="40" height="20" rx="7" class="st dsh"/><text x="84" y="16" text-anchor="middle" dominant-baseline="central" class="txs">[]</text><line x1="108" y1="16" x2="138" y2="16" class="st-k" marker-end="url(#ar-id-4)"/><rect x="142" y="6" width="40" height="20" rx="7" class="st dsh"/><text x="162" y="16" text-anchor="middle" dominant-baseline="central" class="txs">[]</text><text x="6" y="46" class="txd txs" text-anchor="start" dominant-baseline="central">single</text><rect x="64" y="36" width="26" height="20" rx="7" class="st f2"/><text x="77" y="46" text-anchor="middle" dominant-baseline="central">5</text><line x1="94" y1="46" x2="138" y2="46" class="st-k" marker-end="url(#ar-id-4)"/><rect x="142" y="36" width="26" height="20" rx="7" class="st f5"/><text x="155" y="46" text-anchor="middle" dominant-baseline="central">1</text></g></svg>`,
          tests: [
            "assert product_except_self([]) == []",
            "assert product_except_self([5]) == [1]"
          ],
          hint: "A table seeded with a literal 1 has length one even when the input has length zero."
        }
      ],
      steps: [
        `def product_except_self(nums):
    total = nums[0]
    for x in nums[1:]:
        total *= x
    return [total // x for x in nums]
`,
        `def product_except_self(nums):
    total = nums[0]
    zero_at = 0 if total == 0 else -1
    if total == 0:
        total = 1
    for i in range(1, len(nums)):
        if nums[i] == 0:
            zero_at = i
        else:
            total *= nums[i]
    if zero_at == -1:
        return [total // x for x in nums]
    out = [0] * len(nums)
    out[zero_at] = total
    return out
`,
        `def product_except_self(nums):
    out = [1]
    for x in nums[:-1]:
        out.append(out[-1] * x)
    suffix = 1
    for i in range(len(nums) - 1, -1, -1):
        out[i] *= suffix
        suffix *= nums[i]
    return out
`,
        `def product_except_self(nums):
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
