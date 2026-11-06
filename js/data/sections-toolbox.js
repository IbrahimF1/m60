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
          text: "<strong>One number in, one number out.</strong> Start with the shortest list there is: one number. Nothing comes before it, so the first running sum is that number alone. Return a list holding just it.",
          moves: [
            "Read the first number with nums[0]",
            "Wrap it in square brackets to make a list",
            "Return that one-item list"
          ],
          checks: [{ input: "[7]", output: "[7]" }, { input: "[4]", output: "[4]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-pc-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="8" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="58" y="4" width="30" height="22" rx="6" class="st f2"/><text x="73" y="15" text-anchor="middle" dominant-baseline="central">7</text><line x1="73" y1="28" x2="73" y2="36" class="st-k" marker-end="url(#ar-pc-1)"/><text x="8" y="49" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="58" y="38" width="30" height="22" rx="6" class="st f5"/><text x="73" y="49" text-anchor="middle" dominant-baseline="central">7</text><text x="102" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">one number in</text><text x="102" y="49" class="txd txs" text-anchor="start" dominant-baseline="central">the first sum is 7</text></g></svg>`,
          tests: [
            "assert running_sum([7]) == [7]",
            "assert running_sum([4]) == [4]"
          ],
          hint: "Square brackets build a list. This stays right only while the list holds exactly one number."
        },
        {
          text: "<strong>Carry the total forward.</strong> A list of any length needs one idea: each new sum is the last sum plus the next number. Start the answer with the first number, then keep adding as you walk.",
          moves: [
            "Start out as the list holding nums[0]",
            "Walk the rest with for n in nums[1:]",
            "Append out[-1] plus n to out",
            "Return out when the walk ends"
          ],
          checks: [{ input: "[1, 2]", output: "[1, 3]" }, { input: "[1, 2, 3]", output: "[1, 3, 6]" }, { input: "[2, 2, 2]", output: "[2, 4, 6]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-pc-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="8" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="46" y="4" width="28" height="22" rx="6" class="st f2"/><text x="60" y="15" text-anchor="middle" dominant-baseline="central">1</text><rect x="80" y="4" width="28" height="22" rx="6" class="st f2"/><text x="94" y="15" text-anchor="middle" dominant-baseline="central">2</text><rect x="114" y="4" width="28" height="22" rx="6" class="st f2"/><text x="128" y="15" text-anchor="middle" dominant-baseline="central">3</text><line x1="60" y1="28" x2="60" y2="36" class="st-k" marker-end="url(#ar-pc-2)"/><line x1="94" y1="28" x2="94" y2="36" class="st-k" marker-end="url(#ar-pc-2)"/><line x1="128" y1="28" x2="128" y2="36" class="st-k" marker-end="url(#ar-pc-2)"/><text x="8" y="49" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="46" y="38" width="28" height="22" rx="6" class="st f5"/><text x="60" y="49" text-anchor="middle" dominant-baseline="central">1</text><rect x="80" y="38" width="28" height="22" rx="6" class="st f5"/><text x="94" y="49" text-anchor="middle" dominant-baseline="central">3</text><rect x="114" y="38" width="28" height="22" rx="6" class="st f5"/><text x="128" y="49" text-anchor="middle" dominant-baseline="central">6</text><text x="152" y="31" class="txd txs" text-anchor="start" dominant-baseline="central">1, then 1+2, then 1+2+3</text></g></svg>`,
          tests: [
            "assert running_sum([1, 2]) == [1, 3]",
            "assert running_sum([1, 2, 3]) == [1, 3, 6]",
            "assert running_sum([2, 2, 2]) == [2, 4, 6]"
          ],
          hint: "out[-1] is the newest sum you appended. Add the next number to it and append the result."
        },
        {
          text: "<strong>Start from zero so an empty list works.</strong> Reading nums[0] right away crashes on an empty list. Swap the start: total begins at 0 and out begins empty, and the loop never runs when there is nothing to add.",
          moves: [
            "Make out an empty list and total 0",
            "Loop over every number in nums",
            "Add each number to total, then append total",
            "Empty input now returns [] with no crash"
          ],
          checks: [{ input: "[]", output: "[]" }, { input: "[5]", output: "[5]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-pc-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="8" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="50" y="4" width="30" height="22" rx="6" class="st dsh"/><text x="65" y="15" text-anchor="middle" dominant-baseline="central">[]</text><line x1="84" y1="15" x2="102" y2="15" class="st-k" marker-end="url(#ar-pc-3)"/><text x="110" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="138" y="4" width="30" height="22" rx="6" class="st dsh"/><text x="153" y="15" text-anchor="middle" dominant-baseline="central">[]</text><text x="176" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">stays empty</text><text x="8" y="47" class="txd txs" text-anchor="start" dominant-baseline="central">one</text><rect x="50" y="36" width="30" height="22" rx="6" class="st f2"/><text x="65" y="47" text-anchor="middle" dominant-baseline="central">5</text><line x1="84" y1="47" x2="102" y2="47" class="st-k" marker-end="url(#ar-pc-3)"/><rect x="138" y="36" width="30" height="22" rx="6" class="st f5"/><text x="153" y="47" text-anchor="middle" dominant-baseline="central">5</text><text x="176" y="47" class="txd txs" text-anchor="start" dominant-baseline="central">total 0 plus 5</text></g></svg>`,
          tests: [
            "assert running_sum([]) == []",
            "assert running_sum([5]) == [5]"
          ],
          hint: "With total at 0 and out empty, a loop over no numbers adds nothing, so [] comes back on its own."
        }
      ],
      steps: [
        `def running_sum(nums):
    return [nums[0]]
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
          text: "<strong>Start with plain equality.</strong> The simplest check asks if one string is already the other one, letter for letter. That is true only when the order also matches, which makes it wrong for real anagrams.",
          moves: [
            "Compare s and t with ==",
            "Return the result of that comparison",
            "Identical strings pass, all else fails"
          ],
          checks: [{ input: "s=cat t=cat", output: "True" }, { input: "s=a t=a", output: "True" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="6" y="19" class="txd txs" text-anchor="start" dominant-baseline="central">s</text><rect x="22" y="8" width="24" height="22" rx="6" class="st f2"/><text x="34" y="19" text-anchor="middle" dominant-baseline="central">c</text><rect x="50" y="8" width="24" height="22" rx="6" class="st f2"/><text x="62" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="78" y="8" width="24" height="22" rx="6" class="st f2"/><text x="90" y="19" text-anchor="middle" dominant-baseline="central">t</text><text x="116" y="19" class="txd txs" text-anchor="middle" dominant-baseline="central">=</text><text x="132" y="19" class="txd txs" text-anchor="start" dominant-baseline="central">t</text><rect x="142" y="8" width="24" height="22" rx="6" class="st f5"/><text x="154" y="19" text-anchor="middle" dominant-baseline="central">c</text><rect x="170" y="8" width="24" height="22" rx="6" class="st f5"/><text x="182" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="198" y="8" width="24" height="22" rx="6" class="st f5"/><text x="210" y="19" text-anchor="middle" dominant-baseline="central">t</text><text x="116" y="52" class="txd txs" text-anchor="middle" dominant-baseline="central">same letters in the same order</text></g></svg>`,
          tests: [
            "assert is_anagram('cat', 'cat') is True",
            "assert is_anagram('a', 'a') is True"
          ],
          hint: "Equality also demands the same order, and an anagram is free to shuffle its letters."
        },
        {
          text: "<strong>Throw away the order.</strong> An anagram may shuffle letters, so compare the letter collections instead. Turning a string into a set keeps one copy of each letter and forgets the order.",
          moves: [
            "Turn each string into a set with set()",
            "Compare set(s) with set(t)",
            "Return the comparison result"
          ],
          checks: [{ input: "s=anagram t=nagaram", output: "True" }, { input: "s=ab t=ba", output: "True" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-sd-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="19" class="txd txs" text-anchor="start" dominant-baseline="central">s</text><rect x="26" y="8" width="24" height="22" rx="6" class="st f2"/><text x="38" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="58" y="8" width="24" height="22" rx="6" class="st f2"/><text x="70" y="19" text-anchor="middle" dominant-baseline="central">b</text><text x="130" y="19" class="txd txs" text-anchor="start" dominant-baseline="central">t</text><rect x="146" y="8" width="24" height="22" rx="6" class="st f5"/><text x="158" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="178" y="8" width="24" height="22" rx="6" class="st f5"/><text x="190" y="19" text-anchor="middle" dominant-baseline="central">a</text><path d="M38 30 C70 50 160 50 189 31" class="st-k" marker-end="url(#ar-sd-2)"/><path d="M70 30 C102 44 130 44 156 31" class="st-k" marker-end="url(#ar-sd-2)"/><text x="116" y="58" class="txd txs" text-anchor="middle" dominant-baseline="central">same letters, new order</text></g></svg>`,
          tests: [
            "assert is_anagram('anagram', 'nagaram') is True",
            "assert is_anagram('ab', 'ba') is True"
          ],
          hint: "A set keeps one copy of each letter, so ab and ba now match. How many times each letter appears is still ignored."
        },
        {
          text: "<strong>Count how often each letter appears.</strong> Sets call aab and abb equal, but the counts differ. Tally s into a dict, subtract one for every letter of t, and the strings match only if every count lands on zero.",
          moves: [
            "Grow the tally with counts.get(ch, 0) + 1",
            "Subtract 1 for each letter of t",
            "Check all(v == 0 for v in counts.values())"
          ],
          checks: [{ input: "s=aab t=abb", output: "False" }, { input: "s=aabbcc t=abcabc", output: "True" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="6" y="13" class="txd txs" text-anchor="start" dominant-baseline="central">s</text><rect x="26" y="4" width="44" height="18" rx="6" class="st f2"/><text x="48" y="13" text-anchor="middle" dominant-baseline="central" class="txs">a 2</text><rect x="76" y="4" width="44" height="18" rx="6" class="st f2"/><text x="98" y="13" text-anchor="middle" dominant-baseline="central" class="txs">b 1</text><text x="128" y="28" class="txd txs" text-anchor="middle" dominant-baseline="central">!=</text><text x="6" y="43" class="txd txs" text-anchor="start" dominant-baseline="central">t</text><rect x="26" y="34" width="44" height="18" rx="6" class="st f5"/><text x="48" y="43" text-anchor="middle" dominant-baseline="central" class="txs">a 1</text><rect x="76" y="34" width="44" height="18" rx="6" class="st f5"/><text x="98" y="43" text-anchor="middle" dominant-baseline="central" class="txs">b 2</text><text x="116" y="58" class="txd txs" text-anchor="middle" dominant-baseline="central">same letters, different counts</text></g></svg>`,
          tests: [
            "assert is_anagram('aab', 'abb') is False",
            "assert is_anagram('aabbcc', 'abcabc') is True"
          ],
          hint: "counts.get(ch, 0) starts a brand new letter at zero, so its first tally becomes one."
        },
        {
          text: "<strong>Let Counter do the tallying.</strong> The hand tally crashes the moment t holds a letter s never had. Counter(s) builds the whole tally in one call, so the test becomes one comparison and no loops.",
          moves: [
            "Build Counter(s) and Counter(t)",
            "Compare the two Counters with ==",
            "Equal Counters mean equal letter counts",
            "A letter only one side has simply counts zero"
          ],
          checks: [{ input: "s=aabb t=bbaa", output: "True" }, { input: "s=aaa t=aa", output: "False" }, { input: "s=a t=ab", output: "False" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="18" y="6" width="76" height="24" rx="6" class="st f5"/><text x="56" y="18" text-anchor="middle" dominant-baseline="central" class="txs">a 2  b 1</text><text x="116" y="18" class="txd txs" text-anchor="middle" dominant-baseline="central">=</text><rect x="126" y="6" width="76" height="24" rx="6" class="st f5"/><text x="164" y="18" text-anchor="middle" dominant-baseline="central" class="txs">a 2  b 1</text><text x="56" y="42" class="txd txs" text-anchor="middle" dominant-baseline="central">Counter(s)</text><text x="164" y="42" class="txd txs" text-anchor="middle" dominant-baseline="central">Counter(t)</text><text x="116" y="58" class="txd txs" text-anchor="middle" dominant-baseline="central">one call counts every letter</text></g></svg>`,
          tests: [
            "assert is_anagram('aabb', 'bbaa') is True",
            "assert is_anagram('aaa', 'aa') is False",
            "assert is_anagram('a', 'ab') is False"
          ],
          hint: "Counter is already imported at the top. It reads a missing letter as a count of zero, never as an error."
        }
      ],
      steps: [
        `from collections import Counter


def is_anagram(s, t):
    return s == t
`,
        `from collections import Counter


def is_anagram(s, t):
    return set(s) == set(t)
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
          text: "<strong>A single number leaves nothing else to multiply.</strong> The product of an empty collection is 1, so a one-number list must answer [1]. Build the easiest thing that works: a list of ones, one slot per input number.",
          moves: [
            "Build [1] * len(nums), one slot per input",
            "Return it",
            "Check it on any one-number list"
          ],
          checks: [{ input: "[5]", output: "[1]" }, { input: "[9]", output: "[1]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-id-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="8" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="58" y="4" width="30" height="22" rx="6" class="st f2"/><text x="73" y="15" text-anchor="middle" dominant-baseline="central">5</text><line x1="73" y1="28" x2="73" y2="36" class="st-k" marker-end="url(#ar-id-1)"/><text x="8" y="49" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="58" y="38" width="30" height="22" rx="6" class="st f5"/><text x="73" y="49" text-anchor="middle" dominant-baseline="central">1</text><text x="102" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">nothing else to multiply</text><text x="102" y="49" class="txd txs" text-anchor="start" dominant-baseline="central">the answer is 1</text></g></svg>`,
          tests: [
            "assert product_except_self([5]) == [1]",
            "assert product_except_self([9]) == [1]"
          ],
          hint: "Multiply every number except one, and a lone number has no others: the answer stays 1."
        },
        {
          text: "<strong>Multiply everything, then divide out each slot.</strong> With no zero in sight, the product of all except nums[i] is just the total product divided by nums[i]. One loop multiplies everything, one pass divides.",
          moves: [
            "Multiply every number into total",
            "Return total // x for each x in nums",
            "Notice this breaks the day a zero shows up"
          ],
          checks: [{ input: "[1, 2, 3, 4]", output: "[24, 12, 8, 6]" }, { input: "[2, 3, 4]", output: "[12, 8, 6]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-id-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="40" y="4" width="26" height="22" rx="6" class="st f2"/><text x="53" y="15" text-anchor="middle" dominant-baseline="central">1</text><rect x="72" y="4" width="26" height="22" rx="6" class="st f2"/><text x="85" y="15" text-anchor="middle" dominant-baseline="central">2</text><rect x="104" y="4" width="26" height="22" rx="6" class="st f2"/><text x="117" y="15" text-anchor="middle" dominant-baseline="central">3</text><rect x="136" y="4" width="26" height="22" rx="6" class="st f2"/><text x="149" y="15" text-anchor="middle" dominant-baseline="central">4</text><line x1="53" y1="28" x2="53" y2="36" class="st-k" marker-end="url(#ar-id-2)"/><line x1="85" y1="28" x2="85" y2="36" class="st-k" marker-end="url(#ar-id-2)"/><line x1="117" y1="28" x2="117" y2="36" class="st-k" marker-end="url(#ar-id-2)"/><line x1="149" y1="28" x2="149" y2="36" class="st-k" marker-end="url(#ar-id-2)"/><text x="6" y="49" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="40" y="38" width="26" height="22" rx="6" class="st f5"/><text x="53" y="49" text-anchor="middle" dominant-baseline="central">24</text><rect x="72" y="38" width="26" height="22" rx="6" class="st f5"/><text x="85" y="49" text-anchor="middle" dominant-baseline="central">12</text><rect x="104" y="38" width="26" height="22" rx="6" class="st f5"/><text x="117" y="49" text-anchor="middle" dominant-baseline="central">8</text><rect x="136" y="38" width="26" height="22" rx="6" class="st f5"/><text x="149" y="49" text-anchor="middle" dominant-baseline="central">6</text><text x="172" y="15" class="txd txs" text-anchor="start" dominant-baseline="central">total 24</text><text x="172" y="49" class="txd txs" text-anchor="start" dominant-baseline="central">24 // each</text></g></svg>`,
          tests: [
            "assert product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6]",
            "assert product_except_self([2, 3, 4]) == [12, 8, 6]"
          ],
          hint: "This is the shortcut the problem bans, and it dies at the first zero because dividing by zero is an error."
        },
        {
          text: "<strong>Patch the zero instead of dividing by it.</strong> When exactly one number is zero, its own slot gets the product of all the other numbers and every other slot is zero. Multiply only the nonzero values and remember where the zero sits.",
          moves: [
            "Multiply only the numbers that are not zero",
            "Remember the index of the zero",
            "No zero at all: divide as before",
            "One zero: zeros everywhere, then the product at that index"
          ],
          checks: [{ input: "[-1, 1, 0, -3, 3]", output: "[0, 0, 9, 0, 0]" }, { input: "[2, 0, 3]", output: "[0, 6, 0]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-id-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><text x="6" y="13" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="34" y="4" width="28" height="18" rx="6" class="st f2"/><text x="48" y="13" text-anchor="middle" dominant-baseline="central">-1</text><rect x="66" y="4" width="28" height="18" rx="6" class="st f2"/><text x="80" y="13" text-anchor="middle" dominant-baseline="central">1</text><rect x="98" y="4" width="28" height="18" rx="6" class="st f5 st-k"/><text x="112" y="13" text-anchor="middle" dominant-baseline="central">0</text><rect x="130" y="4" width="28" height="18" rx="6" class="st f2"/><text x="144" y="13" text-anchor="middle" dominant-baseline="central">-3</text><rect x="162" y="4" width="28" height="18" rx="6" class="st f2"/><text x="176" y="13" text-anchor="middle" dominant-baseline="central">3</text><line x1="112" y1="24" x2="112" y2="31" class="st-k" marker-end="url(#ar-id-3)"/><text x="6" y="43" class="txd txs" text-anchor="start" dominant-baseline="central">out</text><rect x="34" y="34" width="28" height="18" rx="6" class="st f2"/><text x="48" y="43" text-anchor="middle" dominant-baseline="central">0</text><rect x="66" y="34" width="28" height="18" rx="6" class="st f2"/><text x="80" y="43" text-anchor="middle" dominant-baseline="central">0</text><rect x="98" y="34" width="28" height="18" rx="6" class="st f5 st-k"/><text x="112" y="43" text-anchor="middle" dominant-baseline="central">9</text><rect x="130" y="34" width="28" height="18" rx="6" class="st f2"/><text x="144" y="43" text-anchor="middle" dominant-baseline="central">0</text><rect x="162" y="34" width="28" height="18" rx="6" class="st f2"/><text x="176" y="43" text-anchor="middle" dominant-baseline="central">0</text><text x="116" y="58" class="txd txs" text-anchor="middle" dominant-baseline="central">the zero slot gets the product 9</text></g></svg>`,
          tests: [
            "assert product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0]",
            "assert product_except_self([2, 0, 3]) == [0, 6, 0]"
          ],
          hint: "Every slot except the zero slot still multiplies the zero in, so those answers are all 0."
        },
        {
          text: "<strong>Multiply the lefts and the rights instead.</strong> A second zero breaks the patch, and division was banned all along. For each slot, multiply everything to its left in one pass and everything to its right in a second pass.",
          moves: [
            "Fill out with [1] * len(nums)",
            "Forward pass: multiply in all numbers left of i",
            "Backward pass: multiply in all numbers right of i",
            "No division anywhere, so zeros never break it"
          ],
          checks: [{ input: "[0, 0, 3]", output: "[0, 0, 0]" }, { input: "[1, 0, 0, 2]", output: "[0, 0, 0, 0]" }, { input: "[]", output: "[]" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="6" y="10" class="txd txs" text-anchor="start" dominant-baseline="central">nums</text><rect x="44" y="2" width="24" height="16" rx="5" class="st f2"/><text x="56" y="10" text-anchor="middle" dominant-baseline="central" class="txs">1</text><rect x="72" y="2" width="24" height="16" rx="5" class="st f2"/><text x="84" y="10" text-anchor="middle" dominant-baseline="central" class="txs">2</text><rect x="100" y="2" width="24" height="16" rx="5" class="st f2"/><text x="112" y="10" text-anchor="middle" dominant-baseline="central" class="txs">3</text><text x="6" y="30" class="txd txs" text-anchor="start" dominant-baseline="central">left</text><rect x="44" y="22" width="24" height="16" rx="5" class="st f5"/><text x="56" y="30" text-anchor="middle" dominant-baseline="central" class="txs">1</text><rect x="72" y="22" width="24" height="16" rx="5" class="st f5"/><text x="84" y="30" text-anchor="middle" dominant-baseline="central" class="txs">1</text><rect x="100" y="22" width="24" height="16" rx="5" class="st f5"/><text x="112" y="30" text-anchor="middle" dominant-baseline="central" class="txs">2</text><text x="6" y="50" class="txd txs" text-anchor="start" dominant-baseline="central">right</text><rect x="44" y="42" width="24" height="16" rx="5" class="st f5"/><text x="56" y="50" text-anchor="middle" dominant-baseline="central" class="txs">6</text><rect x="72" y="42" width="24" height="16" rx="5" class="st f5"/><text x="84" y="50" text-anchor="middle" dominant-baseline="central" class="txs">3</text><rect x="100" y="42" width="24" height="16" rx="5" class="st f5"/><text x="112" y="50" text-anchor="middle" dominant-baseline="central" class="txs">1</text><text x="138" y="30" class="txd txs" text-anchor="start" dominant-baseline="central">left x right = 6 3 2</text></g></svg>`,
          tests: [
            "assert product_except_self([0, 0, 3]) == [0, 0, 0]",
            "assert product_except_self([1, 0, 0, 2]) == [0, 0, 0, 0]",
            "assert product_except_self([]) == []"
          ],
          hint: "Walk left to right keeping a running prefix, then walk back with a running suffix, multiplying into out."
        }
      ],
      steps: [
        `def product_except_self(nums):
    return [1] * len(nums)
`,
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
