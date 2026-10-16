import { FIG } from "./figures.js";

export const PATTERNS_C = [
  {
    id: "dp-1d",
    title: "Dynamic Programming I: 1-D",
    minutes: 5,
    tagline: "Write the recurrence, memoize it, then keep only the two values it reads.",
    body: `<h3>Spot the recurrence</h3>
<p>One-dimensional dynamic programming shows up when the answer at position <code>i</code> depends on answers at a few earlier positions. The gateway problem is Climbing Stairs: ways(n) is ways(n-1) plus ways(n-2), because the last hop covered one step or two. House Robber bends the same shape: at each house you either take it and skip the neighbor, or leave it. Pin the recurrence down in words before any code; what follows is usually short.</p>
<p>Two properties must hold. <strong>Optimal substructure</strong>: the best result at <code>i</code> is built from best results earlier. <strong>Overlapping subproblems</strong>: the naive recursion recomputes the same states again and again, which is why it runs in exponential time while a table version runs in linear time.</p>
<h3>Three upgrades, one recurrence</h3>
<p>The same recurrence can run at three speeds.</p>
<ol>
<li>Brute force: the clearest possible statement of the problem, exponential time.</li>
<li>Memoized: decorate it with <a href="https://docs.python.org/3/library/functools.html#functools.lru_cache"><code>@lru_cache</code></a>; one stored result per index collapses the exponential tree into linear work.</li>
<li>Rolled: the recursion never reads further back than two positions, so two variables replace the cache.</li>
</ol>
${FIG.stairs}
<pre><code class="language-python"># rob from house i onward, brute force:
#     best(i) = max(best(i+1), nums[i] + best(i+2))
# wrap best() with @lru_cache  ->  memoized, O(n)
# then keep only the two values it reads:
prev, curr = 0, 0
for num in nums:               # walk houses left to right
    prev, curr = curr, max(curr, prev + num)
# curr = best from houses seen so far, prev = same, minus this house</code></pre>
<p>Every 1-D DP is this skeleton wearing a different recurrence: a <a href="https://docs.python.org/3/library/functions.html#max"><code>max</code></a> over the choices for optimization, a sum for counting. Tuple assignment, <code>prev, curr = curr, ...</code>, updates both variables from the old values in one step with no temp. When a recurrence needs the last three states, widen the tuple; nothing else changes. Grids, knapsacks, and two-string problems just add an index, which is <a href="#/section/dp-2d">the next section</a>.</p>
<p class="callout complexity"><strong>Complexity:</strong> O(n) time and O(1) space with rolling variables; the plain recursion or the memo table costs O(n) space instead.</p>
`,
    exercise: {
      title: "House Robber",
      prompt: `Given <code>nums</code>, the cash in each house, return the largest total you can take without robbing two adjacent houses. Write the recurrence first, then flatten it to two rolling variables.`,
      leetcode: "https://leetcode.com/problems/house-robber/",
      docs: [
        { text: "@lru_cache", url: "https://docs.python.org/3/library/functools.html#functools.lru_cache" },
        { text: "max()", url: "https://docs.python.org/3/library/functions.html#max" },
        { text: "Time complexity of Python types", url: "https://wiki.python.org/moin/TimeComplexity" },
      ],
      starter: `def rob(nums):
    pass  # TODO: your turn


# ---- tests ----
assert rob([1, 2, 3, 1]) == 4
assert rob([2, 7, 9, 3, 1]) == 12
assert rob([2, 1, 1, 2]) == 4
assert rob([5]) == 5
assert rob([]) == 0
print("All tests passed!")
`,
      solution: `def rob(nums):
    prev, curr = 0, 0
    for num in nums:
        prev, curr = curr, max(curr, prev + num)
    return curr
`,
    },
  },
  {
    id: "dp-2d",
    title: "Dynamic Programming II: Grids & Knapsack",
    minutes: 4,
    tagline: "Fill the table, then shrink it to a single row you sweep left to right.",
    body: `<h3>One more index, same trick</h3>
<p>Two-dimensional DP answers a question about a pair (i, j) using neighboring pairs: (i-1, j) above, (i, j-1) to the left, sometimes (i-1, j-1) diagonally. Unique Paths is the canonical grid: dp[i][j] = dp[i-1][j] + dp[i][j-1], because every path into a cell arrives from above or from the left. The first row and first column are all 1: a corridor grid offers exactly one path. Fill the table in reading order and read the answer in the bottom-right cell.</p>
<p>Cannot see the table yet? Write the recursion first and memoize it with <a href="https://docs.python.org/3/library/functools.html#functools.lru_cache"><code>@lru_cache</code></a>. The decorated recursion is a correct bridge, and the table falls straight out of what it caches.</p>
<h3>Roll the row</h3>
<p>A full grid is mostly wasted memory: row i only reads row i-1. One list plays both parts if you sweep left to right, just like the <a href="#/section/dp-1d">rolling pair from 1-D DP</a>: when you reach cell j, the slot still holds the stale value from above, while the slot to its left already holds the fresh value.</p>
${FIG.grid}
<pre><code class="language-python"># unique paths in an m x n grid, one row of memory
row = [1] * n                  # top row: one path into each cell
for _ in range(m - 1):         # each pass folds in one more row
    for j in range(1, n):
        row[j] += row[j - 1]   # above (stale) + left (fresh)
# row[-1] = paths to the bottom-right corner</code></pre>
<h3>The two classics</h3>
<p><strong>Coin Change</strong> is unbounded knapsack squeezed into one dimension. Build dp over amounts 0 to target, where dp[a] is the fewest coins totaling a: each cell is a <a href="https://docs.python.org/3/library/functions.html#min"><code>min</code></a> over dp[a - coin] + 1 for every coin, and looping amounts lets each coin be reused. <strong>Longest Common Subsequence</strong> is the two-string template: when the characters match, dp[i][j] = dp[i-1][j-1] + 1; otherwise take the <a href="https://docs.python.org/3/library/functions.html#max"><code>max</code></a> of skipping one character from either string. Edit distance and most 2-D string problems are rearrangements of that one line.</p>
<p class="callout complexity"><strong>Complexity:</strong> O(m*n) time for grids and string pairs; rolling cuts space to O(n); knapsack costs O(len(coins) * target) time in O(target) space.</p>
`,
    exercise: {
      title: "Unique Paths",
      prompt: `An <code>m</code> by <code>n</code> grid, a robot in the top-left corner, moves restricted to right and down. Return the number of distinct paths to the bottom-right corner using a single rolling row.`,
      leetcode: "https://leetcode.com/problems/unique-paths/",
      docs: [
        { text: "@lru_cache", url: "https://docs.python.org/3/library/functools.html#functools.lru_cache" },
        { text: "min()", url: "https://docs.python.org/3/library/functions.html#min" },
        { text: "Sequence operations ([1] * n)", url: "https://docs.python.org/3/library/stdtypes.html#common-sequence-operations" },
        { text: "Time complexity of Python types", url: "https://wiki.python.org/moin/TimeComplexity" },
      ],
      starter: `def unique_paths(m, n):
    pass  # TODO: your turn


# ---- tests ----
assert unique_paths(3, 7) == 28
assert unique_paths(3, 2) == 3
assert unique_paths(3, 3) == 6
assert unique_paths(1, 1) == 1
assert unique_paths(2, 2) == 2
print("All tests passed!")
`,
      solution: `def unique_paths(m, n):
    row = [1] * n
    for _ in range(m - 1):
        for j in range(1, n):
            row[j] += row[j - 1]
    return row[-1]
`,
    },
  },
  {
    id: "final",
    title: "Solving Any Medium: A Decision Guide",
    minutes: 3,
    tagline: "The signature of every pattern, and how to read it off the statement.",
    body: `<h3>Match the input to the pattern</h3>
<p>Most Medium problems announce their pattern in the first sentence of the statement. Read for the shape of the input, then reach:</p>
<ul>
<li><strong>Counts, duplicates, seen-before lookups</strong>: <a href="#/section/hashing">hash maps</a>.</li>
<li><strong>A sorted or sortable array with pair or triplet targets</strong>: <a href="#/section/two-pointers">two pointers</a>.</li>
<li><strong>The longest or shortest contiguous run that stays valid</strong>: <a href="#/section/sliding-window">sliding window</a>.</li>
<li><strong>The answer is a bound and feasibility moves one way</strong>: <a href="#/section/binary-search">binary search</a>.</li>
<li><strong>Node chains, in-place splices, cycle checks</strong>: <a href="#/section/linked-lists">linked lists</a>.</li>
<li><strong>Nesting, matching, most recent unresolved item</strong>: <a href="#/section/stacks">stacks</a>.</li>
<li><strong>Levels, ancestors, sorted output fast</strong>: <a href="#/section/trees">trees</a>.</li>
<li><strong>Connectivity, shortest paths, ordering under dependencies</strong>: <a href="#/section/graphs">graphs</a>.</li>
<li><strong>Build every combination, subset, or arrangement</strong>: <a href="#/section/backtracking">backtracking</a>.</li>
<li><strong>Top-k, streaming min or max</strong>: <a href="#/section/heaps">heaps</a>.</li>
<li><strong>Overlaps, merged ranges, scheduling</strong>: <a href="#/section/intervals">intervals</a>.</li>
<li><strong>Number of ways, min cost, take-or-skip along a line</strong>: <a href="#/section/dp-1d">1-D DP</a>.</li>
<li><strong>Grids, two strings side by side, capacity limits</strong>: <a href="#/section/dp-2d">2-D DP</a>.</li>
</ul>
<h3>When patterns mix</h3>
<p>Longest Palindromic Substring is the standard hybrid: scan every center, 2n-1 of them, and expand each outward while the ends match. Slicing the last matching window, <a href="https://docs.python.org/3/library/stdtypes.html#common-sequence-operations"><code>s[l + 1:r]</code></a>, finishes the job. It is neither a pure <a href="#/section/sliding-window">window</a> nor a full DP table, and naming the mix early saves ten minutes of forcing the wrong template.</p>
${FIG.centers}
<pre><code class="language-python">def expand(s, l, r):                 # grow while the ends match
    while l &gt;= 0 and r &lt; len(s) and s[l] == s[r]:
        l, r = l - 1, r + 1
    return s[l + 1:r]                 # last window that matched

best = ""
for i in range(len(s)):               # every index: odd and even centers
    for cand in (expand(s, i, i), expand(s, i, i + 1)):
        if len(cand) &gt; len(best):      # keep the widest
            best = cand</code></pre>
<h3>The interview loop</h3>
<p>Before typing: restate the problem in your own words and ask for the bounds, because n near 10^5 rules out O(n^2) and pushes you toward linear passes with a <a href="#/section/hashing">hash map</a> or <a href="#/section/two-pointers">pointers</a>. Agree on a complexity budget out loud. List edge cases, empty input, a single element, all values equal, negatives, and write three asserts covering them. Run the tests before you submit, every time.</p>
<p class="callout complexity"><strong>Complexity:</strong> the palindrome scan is O(n^2) time worst case in O(1) space; state your budget before coding and you will rarely be surprised.</p>
`,
    exercise: {
      title: "Longest Palindromic Substring",
      prompt: `Given a string <code>s</code>, return its longest palindromic substring. Expand around each of the 2n-1 centers and keep the widest window; the helper that grows a window is provided.`,
      leetcode: "https://leetcode.com/problems/longest-palindromic-substring/",
      docs: [
        { text: "Slicing (s[l + 1:r])", url: "https://docs.python.org/3/library/stdtypes.html#common-sequence-operations" },
        { text: "enumerate()", url: "https://docs.python.org/3/library/functions.html#enumerate" },
        { text: "Time complexity of Python types", url: "https://wiki.python.org/moin/TimeComplexity" },
      ],
      starter: `def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return s[left + 1:right]


def longest_palindrome(s):
    pass  # TODO: your turn


# ---- tests ----
assert longest_palindrome("babad") in ("bab", "aba")
assert longest_palindrome("cbbd") == "bb"
assert longest_palindrome("bananas") == "anana"
assert longest_palindrome("a") == "a"
assert longest_palindrome("") == ""
print("All tests passed!")
`,
      solution: `def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return s[left + 1:right]


def longest_palindrome(s):
    best = ""
    for i in range(len(s)):
        for cand in (expand(s, i, i), expand(s, i, i + 1)):
            if len(cand) > len(best):
                best = cand
    return best
`,
    },
  },
];
