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
      prompt: `Given <code>nums</code>, the cash in each house, return the largest total you can take without robbing two adjacent houses.`,
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
          text: "<strong>Rob every second house.</strong> Take house 0, skip house 1, take house 2, and keep going to the end. That plan never touches two neighbors, so it is a legal first answer for any street.",
          moves: [
            "Start the total at house 0",
            "Skip a house, add the next, repeat to the end",
            "Return the total of houses 0, 2, 4 and so on"
          ],
          checks: [{ input: "[5]", output: "5" }, { input: "[5, 1]", output: "5" }, { input: "[10, 1, 2]", output: "12" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="30" y="8" width="34" height="22" rx="6" class="st f5"/><text x="47" y="19" text-anchor="middle" dominant-baseline="central">10</text><rect x="72" y="8" width="34" height="22" rx="6" class="st dsh"/><text x="89" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="114" y="8" width="34" height="22" rx="6" class="st f5"/><text x="131" y="19" text-anchor="middle" dominant-baseline="central">2</text><text x="47" y="44" text-anchor="middle" dominant-baseline="central" class="txd txs">take</text><text x="89" y="44" text-anchor="middle" dominant-baseline="central" class="txd txs">skip</text><text x="131" y="44" text-anchor="middle" dominant-baseline="central" class="txd txs">take</text><text x="116" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">10 + 2 = 12, no neighbors touch</text></g></svg>`,
          tests: [
            "assert rob([5]) == 5",
            "assert rob([5, 1]) == 5",
            "assert rob([10, 1, 2]) == 12"
          ],
          hint: "Houses 0, 2, 4 and so on never touch, so the plan is always legal; it just misses streets where the odd positions hold more cash."
        },
        {
          text: "<strong>Try both stride plans.</strong> The richer houses may sit at positions 1, 3, 5 and so on. Sum that plan too, and return the larger of the two totals.",
          moves: [
            "Sum the houses at even positions, nums[0::2]",
            "Sum the houses at odd positions, nums[1::2]",
            "Return the larger of the two sums"
          ],
          checks: [{ input: "[1, 2]", output: "2" }, { input: "[2, 7]", output: "7" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="30" y="7" width="34" height="20" rx="6" class="st f5"/><text x="47" y="17" text-anchor="middle" dominant-baseline="central">1</text><text x="76" y="17" text-anchor="start" dominant-baseline="central" class="txd txs">start at house 0: total 1</text><rect x="30" y="31" width="34" height="20" rx="6" class="st f5 st-k"/><text x="47" y="41" text-anchor="middle" dominant-baseline="central">2</text><text x="76" y="41" text-anchor="start" dominant-baseline="central" class="txd txs">start at house 1: total 2</text><text x="116" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">the plan starting at house 1 wins</text></g></svg>`,
          tests: [
            "assert rob([1, 2]) == 2",
            "assert rob([2, 7]) == 7"
          ],
          hint: "sum(nums[0::2]) and sum(nums[1::2]) are the two plans. The better one still misses routes that mix wide and narrow gaps."
        },
        {
          text: "<strong>Choose again at every house.</strong> The best route mixes wide and narrow gaps, so neither stride plan wins in general. Keep a list of best totals, one per street length: at each house either skip it and reuse the total before it, or take it and add the total from two houses back.",
          moves: [
            "Keep a list best where best[i] is the top cash from the first i houses",
            "Seed best[0] with 0 and best[1] with nums[0]",
            "Fill best[i] with max(best[i - 1], best[i - 2] + nums[i - 1])",
            "Return the last entry"
          ],
          checks: [{ input: "[5, 1, 1, 5]", output: "10" }, { input: "[1, 3, 1, 3, 100]", output: "103" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="42" y="5" width="30" height="18" rx="6" class="st f2"/><text x="57" y="14" text-anchor="middle" dominant-baseline="central">5</text><rect x="76" y="5" width="30" height="18" rx="6" class="st f2"/><text x="91" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="110" y="5" width="30" height="18" rx="6" class="st f2"/><text x="125" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="144" y="5" width="30" height="18" rx="6" class="st f2"/><text x="159" y="14" text-anchor="middle" dominant-baseline="central">5</text><rect x="8" y="29" width="30" height="18" rx="6" class="st f2"/><text x="23" y="38" text-anchor="middle" dominant-baseline="central">0</text><rect x="42" y="29" width="30" height="18" rx="6" class="st f2"/><text x="57" y="38" text-anchor="middle" dominant-baseline="central">5</text><rect x="76" y="29" width="30" height="18" rx="6" class="st f2"/><text x="91" y="38" text-anchor="middle" dominant-baseline="central">5</text><rect x="110" y="29" width="30" height="18" rx="6" class="st f2"/><text x="125" y="38" text-anchor="middle" dominant-baseline="central">6</text><rect x="144" y="29" width="30" height="18" rx="6" class="st f5 st-k"/><text x="159" y="38" text-anchor="middle" dominant-baseline="central">10</text><text x="116" y="57" text-anchor="middle" dominant-baseline="central" class="txd txs">best per prefix; last entry is 10</text></g></svg>`,
          tests: [
            "assert rob([5, 1, 1, 5]) == 10",
            "assert rob([1, 3, 1, 3, 100]) == 103"
          ],
          hint: "Skip the newest house: keep best[i - 1]. Take it: best[i - 2] plus its cash. The larger of the two fills best[i]."
        },
        {
          text: "<strong>Keep only the last two entries.</strong> Each new entry reads just the two entries before it, so two rolling totals can replace the whole table. Start both at 0 and walk every house: a street with no houses then returns 0 instead of crashing.",
          moves: [
            "Keep two running totals instead of the list",
            "Both start at 0, so an empty street returns 0",
            "At each house the new total is max(curr, prev + cash)",
            "Shift the totals forward in one tuple assignment"
          ],
          checks: [{ input: "[]", output: "0" }, { input: "[2, 1, 1, 2]", output: "4" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-d1-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="24" y="16" width="56" height="24" rx="6" class="st f2"/><text x="52" y="28" text-anchor="middle" dominant-baseline="central">prev = 5</text><rect x="116" y="16" width="56" height="24" rx="6" class="st f5"/><text x="144" y="28" text-anchor="middle" dominant-baseline="central">curr = 10</text><line x1="86" y1="28" x2="110" y2="28" class="st-k" marker-end="url(#ar-d1-4)"/><text x="116" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">two totals roll; no houses keeps 0</text></g></svg>`,
          tests: [
            "assert rob([]) == 0",
            "assert rob([2, 1, 1, 2]) == 4"
          ],
          hint: "prev and curr are the last two table entries. Both start at 0, and an empty street never enters the loop."
        }
      ],
      steps: [
        `def rob(nums):
    total = nums[0]                  # take house 0, then every second house
    for i in range(2, len(nums), 2):
        total += nums[i]
    return total
`,
        `def rob(nums):
    even_plan = sum(nums[0::2])      # houses 0, 2, 4 and so on
    odd_plan = sum(nums[1::2])       # houses 1, 3, 5 and so on
    return max(even_plan, odd_plan)
`,
        `def rob(nums):
    best = [0] * (len(nums) + 1)     # best[i]: most cash from the first i houses
    best[1] = nums[0]                # one house: take it
    for i in range(2, len(nums) + 1):
        take = best[i - 2] + nums[i - 1]
        skip = best[i - 1]
        best[i] = max(take, skip)
    return best[-1]
`,
        `def rob(nums):
    prev, curr = 0, 0                # the last two entries of the table
    for num in nums:                 # both start at 0, so an empty street returns 0
        prev, curr = curr, max(curr, prev + num)
    return curr
`
      ],
      solution: `def rob(nums):
    prev, curr = 0, 0                # the last two table entries
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
      prompt: `An <code>m</code> by <code>n</code> grid, a robot in the top-left corner, moves restricted to right and down. Return the number of distinct paths to the bottom-right corner.`,
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
          text: "<strong>One lane, one path.</strong> A grid that is a single row or a single column gives the robot no choice: the only route goes straight. Return 1 for every grid; it is exactly right for one-lane grids and too small for all wider ones.",
          moves: [
            "Return 1 for every grid",
            "That is exact for single-row and single-column grids",
            "Wider grids have more paths, so 1 falls short"
          ],
          checks: [{ input: "1 x 4", output: "1" }, { input: "5 x 1", output: "1" }, { input: "1 x 1", output: "1" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-d2-1" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="14" y="14" width="32" height="22" rx="7" class="st f2"/><text x="30" y="25" text-anchor="middle" dominant-baseline="central">1</text><rect x="60" y="14" width="32" height="22" rx="7" class="st f2"/><text x="76" y="25" text-anchor="middle" dominant-baseline="central">1</text><rect x="106" y="14" width="32" height="22" rx="7" class="st f2"/><text x="122" y="25" text-anchor="middle" dominant-baseline="central">1</text><rect x="152" y="14" width="32" height="22" rx="7" class="st f5"/><text x="168" y="25" text-anchor="middle" dominant-baseline="central">1</text><line x1="48" y1="25" x2="56" y2="25" class="st-k" marker-end="url(#ar-d2-1)"/><line x1="94" y1="25" x2="102" y2="25" class="st-k" marker-end="url(#ar-d2-1)"/><line x1="140" y1="25" x2="148" y2="25" class="st-k" marker-end="url(#ar-d2-1)"/><text x="116" y="52" text-anchor="middle" dominant-baseline="central" class="txd txs">one row: a single straight path</text></g></svg>`,
          tests: [
            "assert unique_paths(1, 4) == 1",
            "assert unique_paths(5, 1) == 1",
            "assert unique_paths(1, 1) == 1"
          ],
          hint: "A corridor forces every move in one direction, so exactly one route exists; wider grids branch and multiply."
        },
        {
          text: "<strong>Paths arrive from above or from the left.</strong> Every cell of the top row has exactly 1 path, the straight run from the corner. In the second row each cell holds the 1 from above plus the count to its left, so the row reads 1, 2, 3 and a two-row grid of n columns ends at n.",
          moves: [
            "If m is 1, return 1: no sweep for a single row",
            "Make row a list of n ones, the top row",
            "For j from 1 on, add row[j - 1] into row[j]",
            "Return the last count"
          ],
          checks: [{ input: "2 x 2", output: "2" }, { input: "2 x 3", output: "3" }, { input: "2 x 5", output: "5" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-d2-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="40" y="6" width="32" height="18" rx="6" class="st f2"/><text x="56" y="15" text-anchor="middle" dominant-baseline="central">1</text><rect x="80" y="6" width="32" height="18" rx="6" class="st f2"/><text x="96" y="15" text-anchor="middle" dominant-baseline="central">1</text><rect x="120" y="6" width="32" height="18" rx="6" class="st f2"/><text x="136" y="15" text-anchor="middle" dominant-baseline="central">1</text><rect x="40" y="30" width="32" height="18" rx="6" class="st f2"/><text x="56" y="39" text-anchor="middle" dominant-baseline="central">1</text><rect x="80" y="30" width="32" height="18" rx="6" class="st f5"/><text x="96" y="39" text-anchor="middle" dominant-baseline="central">2</text><rect x="120" y="30" width="32" height="18" rx="6" class="st f5 st-k"/><text x="136" y="39" text-anchor="middle" dominant-baseline="central">3</text><line x1="96" y1="25" x2="96" y2="28" class="st-k" marker-end="url(#ar-d2-2)"/><line x1="113" y1="39" x2="118" y2="39" class="st-k" marker-end="url(#ar-d2-2)"/><text x="116" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">each new cell adds its left neighbor</text></g></svg>`,
          tests: [
            "assert unique_paths(2, 2) == 2",
            "assert unique_paths(2, 3) == 3",
            "assert unique_paths(2, 5) == 5"
          ],
          hint: "row[j] += row[j - 1]: keep the 1 from above and add the paths already counted to the left."
        },
        {
          text: "<strong>One sweep per row.</strong> The third row adds its own paths on top of the second row's counts, and so on down the grid. Sweep the same list once for every row below the top; each cell still reads the fresh count to its left and the old count from above.",
          moves: [
            "Wrap the sweep in a loop that runs m - 1 times",
            "Each pass adds one more row's paths to the counts",
            "Zero sweeps leave a one-row grid correct",
            "The last cell holds the answer"
          ],
          checks: [{ input: "3 x 2", output: "3" }, { input: "3 x 3", output: "6" }, { input: "3 x 7", output: "28" }, { input: "5 x 4", output: "35" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="20" y="6" width="24" height="16" rx="5" class="st f2"/><text x="32" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="48" y="6" width="24" height="16" rx="5" class="st f2"/><text x="60" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="76" y="6" width="24" height="16" rx="5" class="st f2"/><text x="88" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="20" y="26" width="24" height="16" rx="5" class="st f2"/><text x="32" y="34" text-anchor="middle" dominant-baseline="central">1</text><rect x="48" y="26" width="24" height="16" rx="5" class="st f5"/><text x="60" y="34" text-anchor="middle" dominant-baseline="central">2</text><rect x="76" y="26" width="24" height="16" rx="5" class="st f5"/><text x="88" y="34" text-anchor="middle" dominant-baseline="central">3</text><rect x="20" y="46" width="24" height="16" rx="5" class="st f2"/><text x="32" y="54" text-anchor="middle" dominant-baseline="central">1</text><rect x="48" y="46" width="24" height="16" rx="5" class="st f2"/><text x="60" y="54" text-anchor="middle" dominant-baseline="central">3</text><rect x="76" y="46" width="24" height="16" rx="5" class="st f5 st-k"/><text x="88" y="54" text-anchor="middle" dominant-baseline="central">6</text><text x="116" y="34" text-anchor="start" dominant-baseline="central" class="txd txs">one sweep per</text><text x="116" y="46" text-anchor="start" dominant-baseline="central" class="txd txs">row below the top</text></g></svg>`,
          tests: [
            "assert unique_paths(3, 2) == 3",
            "assert unique_paths(3, 3) == 6",
            "assert unique_paths(3, 7) == 28",
            "assert unique_paths(5, 4) == 35"
          ],
          hint: "Slot j still holds the count from the row above when slot j - 1 is already fresh, so one list is enough."
        }
      ],
      steps: [
        `def unique_paths(m, n):
    return 1                         # every grid has at least one straight path
`,
        `def unique_paths(m, n):
    if m == 1:                       # a single row: nothing to sweep
        return 1
    row = [1] * n                    # path counts along the top row
    for j in range(1, n):
        row[j] += row[j - 1]         # the 1 from above plus the count to the left
    return row[-1]
`,
        `def unique_paths(m, n):
    row = [1] * n                    # path counts along the top row
    for _ in range(m - 1):           # one sweep per row below the top
        for j in range(1, n):
            row[j] += row[j - 1]     # fresh count from the left, old count from above
    return row[-1]
`
      ],
      solution: `def unique_paths(m, n):
    row = [1] * n                    # path counts along the top row
    for _ in range(m - 1):           # one sweep per row below the top
        for j in range(1, n):
            row[j] += row[j - 1]     # fresh count from the left, old count from above
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
      prompt: `Given a string <code>s</code>, return its longest palindromic substring. The helper <code>expand(s, left, right)</code> grows a palindrome outward from a center while the end letters match.`,
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
          text: "<strong>One letter is already a palindrome.</strong> A single letter reads the same forwards and backwards, so the first character is a legal answer for any string. Return it; it is exactly right whenever nothing longer exists.",
          moves: [
            "Return s[0], the first character",
            "A single letter reads the same both ways",
            "It falls short once a longer palindrome exists"
          ],
          checks: [{ input: "a", output: "a" }, { input: "z", output: "z" }, { input: "abc", output: "a" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="64" y="8" width="30" height="22" rx="6" class="st f5 st-k"/><text x="79" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="100" y="8" width="30" height="22" rx="6" class="st dsh"/><text x="115" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="136" y="8" width="30" height="22" rx="6" class="st dsh"/><text x="151" y="19" text-anchor="middle" dominant-baseline="central">c</text><text x="116" y="52" text-anchor="middle" dominant-baseline="central" class="txd txs">any one letter is a palindrome</text></g></svg>`,
          tests: [
            "assert longest_palindrome(\"a\") == \"a\"",
            "assert longest_palindrome(\"z\") == \"z\"",
            "assert longest_palindrome(\"abc\") == \"a\""
          ],
          hint: "s[0] is always a palindrome of length 1; it is the answer only when no run of length 2 or more exists."
        },
        {
          text: "<strong>Grow around every letter.</strong> The helper <code>expand(s, i, i)</code> starts at one letter and pushes both ends outward while they match. Try it at every index and keep the longest result you see.",
          moves: [
            "Loop i over every index of s",
            "Grow a candidate with expand(s, i, i)",
            "Keep it only when it is longer than the best"
          ],
          checks: [{ input: "babad", output: "bab or aba" }, { input: "xabay", output: "aba" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-fi-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="40" y="8" width="28" height="22" rx="6" class="st f5"/><text x="54" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="72" y="8" width="28" height="22" rx="6" class="st f5 st-k"/><text x="86" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="104" y="8" width="28" height="22" rx="6" class="st f5"/><text x="118" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="136" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="150" y="19" text-anchor="middle" dominant-baseline="central">a</text><rect x="168" y="8" width="28" height="22" rx="6" class="st dsh"/><text x="182" y="19" text-anchor="middle" dominant-baseline="central">d</text><path d="M83 40 C74 46 68 42 70 34" class="st-k" marker-end="url(#ar-fi-2)"/><path d="M89 40 C98 46 104 42 102 34" class="st-k" marker-end="url(#ar-fi-2)"/><text x="116" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">center the a, grow outward to bab</text></g></svg>`,
          tests: [
            "assert longest_palindrome(\"babad\") in (\"bab\", \"aba\")",
            "assert longest_palindrome(\"xabay\") == \"aba\""
          ],
          hint: "expand(s, i, i) returns the widest palindrome centered on letter i; track the longest with len()."
        },
        {
          text: "<strong>Even palindromes sit on a gap.</strong> In <code>abba</code> the middle is the gap between the two b letters, not any letter. Also grow around each pair of neighbors i and i + 1, and keep the longest of both kinds.",
          moves: [
            "For each i, also grow expand(s, i, i + 1)",
            "The pair only grows when both letters match",
            "Compare both candidates with the running best"
          ],
          checks: [{ input: "cbbd", output: "bb" }, { input: "abba", output: "abba" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="36" y="8" width="32" height="22" rx="6" class="st f2"/><text x="52" y="19" text-anchor="middle" dominant-baseline="central">c</text><rect x="88" y="8" width="32" height="22" rx="6" class="st f5"/><text x="104" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="140" y="8" width="32" height="22" rx="6" class="st f5 st-k"/><text x="156" y="19" text-anchor="middle" dominant-baseline="central">b</text><rect x="192" y="8" width="32" height="22" rx="6" class="st f2"/><text x="208" y="19" text-anchor="middle" dominant-baseline="central">d</text><line x1="132" y1="4" x2="132" y2="38" class="st-d dsh"/><text x="116" y="52" text-anchor="middle" dominant-baseline="central" class="txd txs">the gap between the two b letters</text></g></svg>`,
          tests: [
            "assert longest_palindrome(\"cbbd\") == \"bb\"",
            "assert longest_palindrome(\"abba\") == \"abba\""
          ],
          hint: "expand(s, i, i + 1) starts on a gap: it only grows when the two middle letters are equal, which is how bb and abba appear."
        },
        {
          text: "<strong>Sweep all 2n - 1 centers.</strong> A string of n letters has n letter centers plus n - 1 gaps between letters, so 2n - 1 centers in total. Number them 0 to 2n - 2, where an even number is a letter and an odd number is the gap after it, and start from an empty best so an empty string returns itself.",
          moves: [
            "Start best as the empty string",
            "Loop a center number over range(2 * len(s) - 1)",
            "left is center // 2; right is left plus center % 2",
            "An empty string has no centers and stays empty"
          ],
          checks: [{ input: "\"\"", output: "\"\"" }, { input: "bananas", output: "anana" }],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="56" y="6" width="32" height="20" rx="6" class="st f2"/><text x="72" y="16" text-anchor="middle" dominant-baseline="central">a</text><rect x="96" y="6" width="32" height="20" rx="6" class="st f2"/><text x="112" y="16" text-anchor="middle" dominant-baseline="central">b</text><rect x="136" y="6" width="32" height="20" rx="6" class="st f2"/><text x="152" y="16" text-anchor="middle" dominant-baseline="central">a</text><circle cx="72" cy="42" r="4" class="st f5"/><circle cx="112" cy="42" r="4" class="st f5"/><circle cx="152" cy="42" r="4" class="st f5"/><circle cx="92" cy="42" r="4" class="st dsh"/><circle cx="132" cy="42" r="4" class="st dsh"/><text x="116" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">3 letters + 2 gaps = 5 centers</text></g></svg>`,
          tests: [
            "assert longest_palindrome(\"\") == \"\"",
            "assert longest_palindrome(\"bananas\") == \"anana\""
          ],
          hint: "best starts empty and range(2 * len(s) - 1) runs zero times for an empty string, so no letter is ever read."
        }
      ],
      steps: [
        `def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return s[left + 1:right]


def longest_palindrome(s):
    return s[0]                      # one letter is a palindrome
`,
        `def expand(s, left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
        left -= 1
        right += 1
    return s[left + 1:right]


def longest_palindrome(s):
    best = s[0]
    for i in range(len(s)):
        cand = expand(s, i, i)       # widest palindrome centered on letter i
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
    best = ""                        # empty string has no center to grow
    for center in range(2 * len(s) - 1):
        left = center // 2           # even center number: a letter
        right = left + center % 2    # odd center number: the gap after it
        cand = expand(s, left, right)
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
    best = ""                        # empty string has no center to grow
    for center in range(2 * len(s) - 1):
        left = center // 2           # even center number: a letter
        right = left + center % 2    # odd center number: the gap after it
        cand = expand(s, left, right)
        if len(cand) > len(best):
            best = cand
    return best
`,
    },
  },
];
