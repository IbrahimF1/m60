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
`,
      tasks: [
        {
          text: "<strong>Start with the first house.</strong> On a one-house street the whole answer is that house, and when the second is worth less it cannot change the total.",
          moves: [
            "Start the running total at nums[0]",
            "Walk the even indices only",
            "Return the total for the street"
          ],
          checks: [{ input: "5", output: "5" }, { input: "5 1", output: "5" }, { input: "4", output: "4" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-dp1-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="26" y="14" width="34" height="24" rx="7" class="st f5"/><text x="43" y="26" text-anchor="middle" dominant-baseline="central">5</text><rect x="76" y="14" width="34" height="24" rx="7" class="st dsh"/><text x="93" y="26" text-anchor="middle" dominant-baseline="central">1</text><text x="43" y="50" text-anchor="middle" dominant-baseline="central" class="txd txs">take</text><text x="93" y="50" text-anchor="middle" dominant-baseline="central" class="txd txs">skip</text><line x1="114" y1="26" x2="146" y2="26" class="st-k" marker-end="url(#ar-dp1-1)"/><text x="154" y="26" text-anchor="start" dominant-baseline="central" class="txd txs">total 5</text></g></svg>`,
          tests: [
            "assert rob([5]) == 5",
            "assert rob([5, 1]) == 5",
            "assert rob([4]) == 4"
          ],
          hint: "A one-house street has no neighbor to skip, so the total is that house itself."
        },
        {
          text: "<strong>Adjacent houses force a real choice.</strong> Taking the first house locks out the second, but the last house is still free, so a street can use both ends.",
          moves: [
            "Compare each adjacent pair of houses",
            "Add the larger house of every pair",
            "Move two positions after each pair"
          ],
          checks: [{ input: "2 1 1 2", output: "4" }, { input: "3 2 2 3", output: "6" }],
          diagram: `<svg viewBox="0 0 232 64" aria-hidden="true" focusable="false"><g><rect x="20" y="10" width="32" height="24" rx="7" class="st f5"/><text x="36" y="22" text-anchor="middle" dominant-baseline="central">2</text><rect x="60" y="10" width="32" height="24" rx="7" class="st dsh"/><text x="76" y="22" text-anchor="middle" dominant-baseline="central">1</text><rect x="100" y="10" width="32" height="24" rx="7" class="st dsh"/><text x="116" y="22" text-anchor="middle" dominant-baseline="central">1</text><rect x="140" y="10" width="32" height="24" rx="7" class="st f5"/><text x="156" y="22" text-anchor="middle" dominant-baseline="central">2</text><text x="36" y="52" text-anchor="middle" dominant-baseline="central" class="txd txs">take</text><text x="76" y="52" text-anchor="middle" dominant-baseline="central" class="txd txs">skip</text><text x="116" y="52" text-anchor="middle" dominant-baseline="central" class="txd txs">skip</text><text x="156" y="52" text-anchor="middle" dominant-baseline="central" class="txd txs">take</text><text x="196" y="22" text-anchor="start" dominant-baseline="central">= 4</text></g></svg>`,
          tests: [
            "assert rob([2, 1, 1, 2]) == 4",
            "assert rob([3, 2, 2, 3]) == 6"
          ],
          hint: "A pair is not independent of the pair before it, so local compares can still miss the best street."
        },
        {
          text: "<strong>Carry the best total for the street so far.</strong> On <code>[1, 2, 3, 1]</code> houses 0 and 2 beat every neighbor pair, and the same recurrence scales to longer streets.",
          moves: [
            "Keep the best total up to the previous house and up to the current house",
            "For each house, take max(skip it, its cash plus the total two back)",
            "Roll the two totals forward in one tuple assignment"
          ],
          checks: [{ input: "1 2 3 1", output: "4" }, { input: "4 10 3 1 5", output: "15" }, { input: "5 1 1 5 1", output: "10" }],
          diagram: `<svg viewBox="0 0 232 64" aria-hidden="true" focusable="false"><g><rect x="10" y="10" width="32" height="24" rx="7" class="st dsh"/><text x="26" y="22" text-anchor="middle" dominant-baseline="central">4</text><rect x="50" y="10" width="32" height="24" rx="7" class="st f5 st-k"/><text x="66" y="22" text-anchor="middle" dominant-baseline="central">10</text><rect x="90" y="10" width="32" height="24" rx="7" class="st dsh"/><text x="106" y="22" text-anchor="middle" dominant-baseline="central">3</text><rect x="130" y="10" width="32" height="24" rx="7" class="st dsh"/><text x="146" y="22" text-anchor="middle" dominant-baseline="central">1</text><rect x="170" y="10" width="32" height="24" rx="7" class="st f5 st-k"/><text x="186" y="22" text-anchor="middle" dominant-baseline="central">5</text><text x="116" y="52" text-anchor="middle" dominant-baseline="central" class="txd txs">10 + 5 = 15, with the gap skipped</text></g></svg>`,
          tests: [
            "assert rob([1, 2, 3, 1]) == 4",
            "assert rob([4, 10, 3, 1, 5]) == 15",
            "assert rob([5, 1, 1, 5, 1]) == 10"
          ],
          hint: "The recurrence reads the total two houses back, not the previous pair's sum."
        },
        {
          text: "<strong>Guard the empty street.</strong> With no houses the loop never runs, so both totals must start at zero instead of being seeded from nums[0].",
          moves: [
            "Start prev and curr at 0 before the loop",
            "Seed nothing from nums[0]",
            "Return curr after the loop"
          ],
          checks: [{ input: "empty", output: "0" }],
          diagram: `<svg viewBox="0 0 232 56" aria-hidden="true" focusable="false"><defs><marker id="ar-dp1-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="20" y="16" width="92" height="24" rx="7" class="st dsh"/><text x="66" y="28" text-anchor="middle" dominant-baseline="central" class="txd txs">no houses</text><line x1="120" y1="28" x2="150" y2="28" class="st-k" marker-end="url(#ar-dp1-4)"/><text x="160" y="28" text-anchor="start" dominant-baseline="central">0</text></g></svg>`,
          tests: ["assert rob([]) == 0"],
          hint: "Reading nums[0] to seed the total raises IndexError before an empty street can return 0."
        }
      ],
      steps: [
        `def rob(nums):
    total = nums[0]                  # first house, then every other house
    for i in range(2, len(nums), 2):
        total += nums[i]
    return total
`,
        `def rob(nums):
    if len(nums) <= 2:
        return max(nums)
    return max(nums[0], nums[1]) + rob(nums[2:])
`,
        `def rob(nums):
    prev, curr = 0, nums[0]
    for num in nums[1:]:
        prev, curr = curr, max(curr, prev + num)
    return curr
`,
        `def rob(nums):
    prev, curr = 0, 0
    for num in nums:
        prev, curr = curr, max(curr, prev + num)
    return curr
`
      ],
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
`,
      tasks: [
        {
          text: "<strong>A corridor has exactly one path.</strong> With one row or one column the robot never chooses, so every thin grid answers 1.",
          moves: [
            "Return 1 when m is 1",
            "Return 1 when n is 1",
            "Treat the 1 by 1 grid as the shortest corridor"
          ],
          checks: [{ input: "1 x 4", output: "1" }, { input: "5 x 1", output: "1" }, { input: "1 x 1", output: "1" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-dp2-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="14" y="14" width="32" height="22" rx="7" class="st f2"/><text x="30" y="25" text-anchor="middle" dominant-baseline="central">1</text><rect x="60" y="14" width="32" height="22" rx="7" class="st f2"/><text x="76" y="25" text-anchor="middle" dominant-baseline="central">1</text><rect x="106" y="14" width="32" height="22" rx="7" class="st f2"/><text x="122" y="25" text-anchor="middle" dominant-baseline="central">1</text><rect x="152" y="14" width="32" height="22" rx="7" class="st f5"/><text x="168" y="25" text-anchor="middle" dominant-baseline="central">1</text><line x1="48" y1="25" x2="56" y2="25" class="st-k" marker-end="url(#ar-dp2-1)"/><line x1="94" y1="25" x2="102" y2="25" class="st-k" marker-end="url(#ar-dp2-1)"/><line x1="140" y1="25" x2="148" y2="25" class="st-k" marker-end="url(#ar-dp2-1)"/><text x="116" y="50" text-anchor="middle" dominant-baseline="central" class="txd txs">one row, one path</text></g></svg>`,
          tests: [
            "assert unique_paths(1, 4) == 1",
            "assert unique_paths(5, 1) == 1",
            "assert unique_paths(1, 1) == 1"
          ],
          hint: "No branch means no multiplication; a corridor is one route however long it is."
        },
        {
          text: "<strong>The first real choice is a 2 by 2 grid.</strong> From the top-left corner the robot can go right then down, or down then right, and nothing else.",
          moves: [
            "Notice the grid is no longer a corridor",
            "Count the two orders of one right and one down",
            "Return 2 for this smallest square"
          ],
          checks: [{ input: "2 x 2", output: "2" }],
          diagram: `<svg viewBox="0 0 232 70" aria-hidden="true" focusable="false"><g><rect x="80" y="8" width="34" height="22" rx="7" class="st f5 st-k"/><rect x="118" y="8" width="34" height="22" rx="7" class="st f2"/><rect x="80" y="34" width="34" height="22" rx="7" class="st f2"/><rect x="118" y="34" width="34" height="22" rx="7" class="st f5 st-k"/><text x="166" y="45" text-anchor="start" dominant-baseline="central" class="txd txs">= 2</text><text x="116" y="64" text-anchor="middle" dominant-baseline="central" class="txd txs">right-down or down-right</text></g></svg>`,
          tests: ["assert unique_paths(2, 2) == 2"],
          hint: "Two paths exist only because the order of the right and the down can swap."
        },
        {
          text: "<strong>Count the moves a path needs.</strong> A 3 by 2 grid takes two downs and one right, and there are three orders for those moves, so the answer is three.",
          moves: [
            "Count the m + n - 2 moves in one path",
            "List the orders of the downs and rights",
            "Return that count for a 3 by 2 grid"
          ],
          checks: [{ input: "3 x 2", output: "3" }, { input: "2 x 3", output: "3" }],
          diagram: `<svg viewBox="0 0 232 70" aria-hidden="true" focusable="false"><g><text x="6" y="12" text-anchor="start" dominant-baseline="central" class="txd txs">3 x 2: two downs, one right</text><rect x="24" y="22" width="20" height="14" rx="5" class="st f5"/><text x="34" y="29" text-anchor="middle" dominant-baseline="central" class="txs">D</text><rect x="48" y="22" width="20" height="14" rx="5" class="st f5"/><text x="58" y="29" text-anchor="middle" dominant-baseline="central" class="txs">D</text><rect x="72" y="22" width="20" height="14" rx="5" class="st f5"/><text x="82" y="29" text-anchor="middle" dominant-baseline="central" class="txs">R</text><rect x="24" y="40" width="20" height="14" rx="5" class="st f2"/><text x="34" y="47" text-anchor="middle" dominant-baseline="central" class="txs">D</text><rect x="48" y="40" width="20" height="14" rx="5" class="st f2"/><text x="58" y="47" text-anchor="middle" dominant-baseline="central" class="txs">R</text><rect x="72" y="40" width="20" height="14" rx="5" class="st f2"/><text x="82" y="47" text-anchor="middle" dominant-baseline="central" class="txs">D</text><rect x="24" y="58" width="20" height="14" rx="5" class="st f2"/><text x="34" y="65" text-anchor="middle" dominant-baseline="central" class="txs">R</text><rect x="48" y="58" width="20" height="14" rx="5" class="st f2"/><text x="58" y="65" text-anchor="middle" dominant-baseline="central" class="txs">D</text><rect x="72" y="58" width="20" height="14" rx="5" class="st f2"/><text x="82" y="65" text-anchor="middle" dominant-baseline="central" class="txs">D</text><text x="112" y="47" text-anchor="start" dominant-baseline="central" class="txd txs">three routes</text></g></svg>`,
          tests: [
            "assert unique_paths(3, 2) == 3",
            "assert unique_paths(2, 3) == 3"
          ],
          hint: "The move count gives path length, not how many paths share that length."
        },
        {
          text: "<strong>Count routes, not moves.</strong> Every cell is reached from above or from the left, so its count is the sum of those two, and the bottom-right cell holds the answer.",
          moves: [
            "Seed the top row and left column with 1",
            "Fill each cell with the cell above plus the cell left",
            "Return the bottom-right cell"
          ],
          checks: [{ input: "3 x 7", output: "28" }, { input: "3 x 3", output: "6" }],
          diagram: `<svg viewBox="0 0 232 86" aria-hidden="true" focusable="false"><g><rect x="72" y="8" width="30" height="20" rx="7" class="st f2"/><text x="87" y="18" text-anchor="middle" dominant-baseline="central">1</text><rect x="106" y="8" width="30" height="20" rx="7" class="st f2"/><text x="121" y="18" text-anchor="middle" dominant-baseline="central">1</text><rect x="140" y="8" width="30" height="20" rx="7" class="st f2"/><text x="155" y="18" text-anchor="middle" dominant-baseline="central">1</text><rect x="72" y="32" width="30" height="20" rx="7" class="st f2"/><text x="87" y="42" text-anchor="middle" dominant-baseline="central">1</text><rect x="106" y="32" width="30" height="20" rx="7" class="st f2"/><text x="121" y="42" text-anchor="middle" dominant-baseline="central">2</text><rect x="140" y="32" width="30" height="20" rx="7" class="st f2"/><text x="155" y="42" text-anchor="middle" dominant-baseline="central">3</text><rect x="72" y="56" width="30" height="20" rx="7" class="st f2"/><text x="87" y="66" text-anchor="middle" dominant-baseline="central">1</text><rect x="106" y="56" width="30" height="20" rx="7" class="st f2"/><text x="121" y="66" text-anchor="middle" dominant-baseline="central">3</text><rect x="140" y="56" width="30" height="20" rx="7" class="st f5 st-k"/><text x="155" y="66" text-anchor="middle" dominant-baseline="central">6</text><text x="116" y="82" text-anchor="middle" dominant-baseline="central" class="txd txs">3 x 3: each cell = above + left</text></g></svg>`,
          tests: [
            "assert unique_paths(3, 7) == 28",
            "assert unique_paths(3, 3) == 6"
          ],
          hint: "A table with zeroed borders loses every path that hugs the top or left edge."
        }
      ],
      steps: [
        `def unique_paths(m, n):
    if m == 1 or n == 1:          # a corridor never branches
        return 1
    return 0
`,
        `def unique_paths(m, n):
    if m == 1 or n == 1:
        return 1
    return 2                      # right then down, or down then right
`,
        `def unique_paths(m, n):
    if m == 1 or n == 1:
        return 1
    return m + n - 2              # count the moves in one path
`,
        `def unique_paths(m, n):
    row = [1] * n
    for _ in range(m - 1):
        for j in range(1, n):
            row[j] += row[j - 1]
    return row[-1]
`
      ],
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
`,
      tasks: [
        {
          text: "<strong>One character is already a palindrome.</strong> Put the center on index 0, expand with the helper, and return that single character.",
          moves: [
            "Read s[0] as the starting best",
            "Expand from the center (0, 0)",
            "Return the longer of the best and the expansion"
          ],
          checks: [{ input: "a", output: "a" }, { input: "z", output: "z" }],
          diagram: `<svg viewBox="0 0 232 60" aria-hidden="true" focusable="false"><g><rect x="102" y="10" width="28" height="24" rx="7" class="st f5 st-k"/><text x="116" y="22" text-anchor="middle" dominant-baseline="central">a</text><line x1="96" y1="22" x2="82" y2="22" class="st-d dsh"/><line x1="136" y1="22" x2="150" y2="22" class="st-d dsh"/><text x="116" y="50" text-anchor="middle" dominant-baseline="central" class="txd txs">center 0, no neighbor to match</text></g></svg>`,
          tests: [
            "assert longest_palindrome(\"a\") == \"a\"",
            "assert longest_palindrome(\"z\") == \"z\""
          ],
          hint: "A center with no matching neighbor on either side returns just itself."
        },
        {
          text: "<strong>Odd palindromes grow from a character.</strong> Try every index as a center, expand while the ends match, and keep the widest window.",
          moves: [
            "Loop i over every index of s",
            "Expand around (i, i), the odd center",
            "Replace best only when the candidate is longer"
          ],
          checks: [{ input: "babad", output: "bab or aba" }, { input: "xabay", output: "aba" }],
          diagram: `<svg viewBox="0 0 232 60" aria-hidden="true" focusable="false"><g><rect x="28" y="10" width="28" height="22" rx="7" class="st f2"/><text x="42" y="21" text-anchor="middle" dominant-baseline="central">b</text><rect x="66" y="10" width="28" height="22" rx="7" class="st f5 st-k"/><text x="80" y="21" text-anchor="middle" dominant-baseline="central">a</text><rect x="104" y="10" width="28" height="22" rx="7" class="st f2"/><text x="118" y="21" text-anchor="middle" dominant-baseline="central">b</text><rect x="142" y="10" width="28" height="22" rx="7" class="st dsh"/><text x="156" y="21" text-anchor="middle" dominant-baseline="central">a</text><rect x="180" y="10" width="28" height="22" rx="7" class="st dsh"/><text x="194" y="21" text-anchor="middle" dominant-baseline="central">d</text><text x="116" y="50" text-anchor="middle" dominant-baseline="central" class="txd txs">center 1 expands to bab</text></g></svg>`,
          tests: [
            "assert longest_palindrome(\"babad\") in (\"bab\", \"aba\")",
            "assert longest_palindrome(\"xabay\") == \"aba\""
          ],
          hint: "Stopping at center 0 misses every palindrome that sits later in the string."
        },
        {
          text: "<strong>Even palindromes grow from a gap.</strong> Expand around (i, i + 1) as well, which catches a palindrome whose two middle characters are equal.",
          moves: [
            "Keep the odd expansion at (i, i)",
            "Add the even expansion at (i, i + 1)",
            "Compare both candidates with the running best"
          ],
          checks: [{ input: "cbbd", output: "bb" }, { input: "abba", output: "abba" }],
          diagram: `<svg viewBox="0 0 232 60" aria-hidden="true" focusable="false"><g><rect x="36" y="10" width="32" height="22" rx="7" class="st f2"/><text x="52" y="21" text-anchor="middle" dominant-baseline="central">c</text><rect x="88" y="10" width="32" height="22" rx="7" class="st f5 st-k"/><text x="104" y="21" text-anchor="middle" dominant-baseline="central">b</text><rect x="140" y="10" width="32" height="22" rx="7" class="st f5 st-k"/><text x="156" y="21" text-anchor="middle" dominant-baseline="central">b</text><rect x="192" y="10" width="32" height="22" rx="7" class="st f2"/><text x="208" y="21" text-anchor="middle" dominant-baseline="central">d</text><line x1="132" y1="4" x2="132" y2="38" class="st-d dsh"/><text x="116" y="50" text-anchor="middle" dominant-baseline="central" class="txd txs">the gap between the two b characters</text></g></svg>`,
          tests: [
            "assert longest_palindrome(\"cbbd\") == \"bb\"",
            "assert longest_palindrome(\"abba\") == \"abba\""
          ],
          hint: "With odd centers only, bb has no center to grow from and stays invisible."
        },
        {
          text: "<strong>Guard the empty string.</strong> No characters means no center to expand, so best must start empty rather than at s[0].",
          moves: [
            "Start best as an empty string",
            "Let the loop cover every nonempty string",
            "Return best unchanged when s is empty"
          ],
          checks: [{ input: "\"\"", output: "\"\"" }],
          diagram: `<svg viewBox="0 0 232 56" aria-hidden="true" focusable="false"><defs><marker id="ar-fin-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="20" y="16" width="82" height="24" rx="7" class="st dsh"/><text x="61" y="28" text-anchor="middle" dominant-baseline="central" class="txd txs">no centers</text><line x1="110" y1="28" x2="142" y2="28" class="st-k" marker-end="url(#ar-fin-4)"/><rect x="148" y="16" width="44" height="24" rx="7" class="st f2"/><text x="170" y="28" text-anchor="middle" dominant-baseline="central">""</text></g></svg>`,
          tests: ["assert longest_palindrome(\"\") == \"\""],
          hint: "Seeding best from s[0] raises IndexError before the loop on empty input."
        }
      ],
      steps: [
        `def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return s[left + 1:right]


def longest_palindrome(s):
    best = s[0]                       # first character as the starting best
    for i in range(1):                # center 0 only
        cand = expand(s, i, i)
        if len(cand) > len(best):
            best = cand
    return best
`,
        `def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return s[left + 1:right]


def longest_palindrome(s):
    best = s[0]
    for i in range(len(s)):
        cand = expand(s, i, i)        # odd centers only
        if len(cand) > len(best):
            best = cand
    return best
`,
        `def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return s[left + 1:right]


def longest_palindrome(s):
    best = s[0]
    for i in range(len(s)):
        for cand in (expand(s, i, i), expand(s, i, i + 1)):
            if len(cand) > len(best):
                best = cand
    return best
`,
        `def expand(s, left, right):
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
`
      ],
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
