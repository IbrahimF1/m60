import { FIG } from "./figures.js";

export const PATTERNS_B = [
  {
    id: "trees",
    title: "Trees: DFS & BFS",
    minutes: 4,
    tagline: "Down first or across first; the question usually says which.",
    body: `<h3>Depth first or breadth first</h3>
<p>Every tree Medium is one of two walks. Depth-first (DFS) goes down before across: recursion carries the state and the call stack is your memory. Breadth-first (BFS) goes across before down: a queue holds the frontier, one level at a time. Both visit every node once, so both run in O(n); the difference is the order the answers come out in.</p>
<p>DFS asks "what do my children report back?" and works bottom-up: subtree sizes, root-to-leaf paths, anything computed from child results. BFS asks "who is one step further out?" and works top-down: levels, widths, minimum distance from the root.</p>
${FIG.walks}
<h3>BFS: freeze the width</h3>
<p>A queue in Python is <a href="https://docs.python.org/3/library/collections.html#collections.deque"><code>collections.deque</code></a>: append to the right, pop from the left, both O(1). The level-order move is one line: read the queue length before draining it. The inner loop then handles exactly the nodes that were sitting there when the level began, while children appended during the sweep wait for the next round. That snapshot is what turns one pass into a list of levels.</p>
<h3>DFS: pass the depth</h3>
<p>Recursive DFS gets the same answer differently: hand a depth index down and, on the first visit to a depth, append a fresh list. It needs no queue and suits root-to-leaf work, but it cannot report a level before walking past it. Levels and shortest distances want the queue; paths, subtree sizes, and depth so far want a depth index handed down through the recursion.</p>
<h3>The skeleton</h3>
<pre><code>from collections import deque

def level_order(root):
    if root is None:
        return []
    levels = []
    queue = deque([root])          # frontier: nodes one level out
    while queue:
        level = []
        for _ in range(len(queue)):    # freeze the current width
            node = queue.popleft()     # O(1) from the front
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        levels.append(level)
    return levels
</code></pre>
<p class="callout complexity"><strong>Complexity:</strong> O(n) time: every node enters and leaves the queue once; O(w) space for the queue, where w is the widest level and O(n) in the worst case, plus the output.</p>`,
    exercise: {
      title: "Binary Tree Level Order Traversal",
      prompt: `Given the root of a binary tree, return its level order traversal: a list of levels, each level listing node values from left to right. Use <a href="https://docs.python.org/3/library/collections.html#collections.deque"><code>collections.deque</code></a> and freeze the queue length so one outer loop iteration handles one level. The <code>TreeNode</code> class and <code>build_tree</code> helper are provided.`,
      leetcode: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      docs: [
        { text: "collections.deque", url: "https://docs.python.org/3/library/collections.html#collections.deque" },
        { text: "mutable sequence types (append/pop)", url: "https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types" },
        { text: "common sequence operations (len)", url: "https://docs.python.org/3/library/stdtypes.html#common-sequence-operations" },
        { text: "Time complexity (Python wiki)", url: "https://wiki.python.org/moin/TimeComplexity" }
      ],
      starter: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def build_tree(levels):
    """Build a tree from a LeetCode-style level-order list; None is a hole."""
    if not levels or levels[0] is None:
        return None
    root = TreeNode(levels[0])
    queue = deque([root])
    i = 1
    while queue and i < len(levels):
        node = queue.popleft()
        if levels[i] is not None:
            node.left = TreeNode(levels[i])
            queue.append(node.left)
        i += 1
        if i < len(levels) and levels[i] is not None:
            node.right = TreeNode(levels[i])
            queue.append(node.right)
        i += 1
    return root


# Return the node values one level at a time, left to right.
def level_order(root):
    pass  # TODO: your turn

# ---- tests ----
assert level_order(build_tree([3, 9, 20, None, None, 15, 7])) == [[3], [9, 20], [15, 7]]
assert level_order(build_tree([1])) == [[1]]
assert level_order(build_tree([1, 2, 3, 4, None, None, 5])) == [[1], [2, 3], [4, 5]]
assert level_order(build_tree([])) == []
assert level_order(None) == []
print("All tests passed!")
`,
      solution: `from collections import deque


class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def build_tree(levels):
    """Build a tree from a LeetCode-style level-order list; None is a hole."""
    if not levels or levels[0] is None:
        return None
    root = TreeNode(levels[0])
    queue = deque([root])
    i = 1
    while queue and i < len(levels):
        node = queue.popleft()
        if levels[i] is not None:
            node.left = TreeNode(levels[i])
            queue.append(node.left)
        i += 1
        if i < len(levels) and levels[i] is not None:
            node.right = TreeNode(levels[i])
            queue.append(node.right)
        i += 1
    return root


# Return the node values one level at a time, left to right.
def level_order(root):
    if root is None:
        return []
    levels = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):   # freeze the current width
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        levels.append(level)
    return levels
`
    }
  },
  {
    id: "graphs",
    title: "Graphs & Union-Find",
    minutes: 4,
    tagline: "Grids, edges, and groups are the same two moves: mark, expand.",
    body: `<h3>A grid is a graph</h3>
<p>Graph problems look varied until you name the nodes and their neighbors. A grid is already a graph: every cell is a node joined to the four cells around it. An edge list becomes an adjacency list, a mapping from node to its neighbors, and <a href="https://docs.python.org/3/library/collections.html#collections.defaultdict"><code>collections.defaultdict</code></a> builds that map in one pass. The traversal never changes: mark a node seen in a <a href="https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset"><code>set</code></a>, then visit every unvisited neighbor. Flood fill is that same walk confined to one connected blob.</p>
${FIG.rings}
<h3>DFS fills, BFS measures</h3>
<p>Depth-first (recursion or an explicit stack) is the shortest code for connectivity: how many islands, is A connected to B. Breadth-first is mandatory when distance matters: it expands the frontier one ring at a time, so the first time it reaches a node is the shortest path in steps. Rotting Oranges is that pattern: each BFS round is one minute and every rotten orange expands to its fresh neighbors.</p>
<h3>Union-Find in ten lines</h3>
<p>When the question is only "same group or not?", Union-Find answers in near-constant time. Every node keeps a parent pointer; find walks to the root and, on the way back, rewrites parent pointers along the path so the next walk is shorter. That rewrite is path compression. Union hangs the smaller tree under the larger (union by rank), and both tricks keep the trees flat. Accounts Merge is the classic use: union emails that appear together, then group by root.</p>
<h3>The skeleton</h3>
<pre><code>def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0
    def sink(r, c):                  # flood fill: erase one island
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return                   # off the grid or already water
        grid[r][c] = "0"             # mark seen by sinking it
        sink(r + 1, c)               # four neighbors
        sink(r - 1, c)
        sink(r, c + 1)
        sink(r, c - 1)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1           # new island: erase all of it
                sink(r, c)
    return count
</code></pre>
<p class="callout complexity"><strong>Complexity:</strong> O(rows * cols) time: every cell is scanned once and flooded at most once; O(rows * cols) worst-case recursion depth, or the frontier of a BFS queue, and the marking is done in place.</p>`,
    exercise: {
      title: "Number of Islands",
      prompt: `Given a 2-D grid where "1" is land and "0" is water, return the number of islands: maximal groups of land connected horizontally or vertically. Flood fill each unvisited island, sinking its cells to water as you mark them, and count how many times you start.`,
      leetcode: "https://leetcode.com/problems/number-of-islands/",
      docs: [
        { text: "set and frozenset", url: "https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset" },
        { text: "collections.defaultdict", url: "https://docs.python.org/3/library/collections.html#collections.defaultdict" },
        { text: "mutable sequence types", url: "https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types" },
        { text: "Time complexity (Python wiki)", url: "https://wiki.python.org/moin/TimeComplexity" }
      ],
      starter: `# Count islands: "1" is land, "0" is water, connections are up/down/left/right
def num_islands(grid):
    pass  # TODO: your turn

# ---- tests ----
assert num_islands([["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]) == 1
assert num_islands([["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]) == 3
assert num_islands([["0"]]) == 0
assert num_islands([["1"]]) == 1
assert num_islands([["1", "0", "1", "0", "1"]]) == 3
print("All tests passed!")
`,
      solution: `# Count islands: "1" is land, "0" is water, connections are up/down/left/right
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0

    def sink(r, c):                  # flood fill: erase one island
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":
            return                   # off the grid or already water
        grid[r][c] = "0"             # mark seen by sinking it
        sink(r + 1, c)               # four neighbors
        sink(r - 1, c)
        sink(r, c + 1)
        sink(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1           # new island: erase all of it
                sink(r, c)
    return count
`
    }
  },
  {
    id: "backtracking",
    title: "Backtracking",
    minutes: 4,
    tagline: "Choose, explore, un-choose. Each branch is three lines.",
    body: `<h3>Choose, explore, un-choose</h3>
<p>Backtracking builds one candidate at a time and abandons a branch the moment it cannot pan out. Every implementation is the same loop: append the choice, recurse, pop the choice back. The recursion carries the partial arrangement; returning restores the exact previous state, which is what lets the next candidate start clean instead of rebuilding from scratch.</p>
${FIG.backtrack}
<h3>The same loop makes subsets</h3>
<p>Permutations try every remaining item at every step. Subsets keep the skeleton and change one rule: every prefix is already a valid answer, so record a copy on entry instead of only at full length.</p>
<p>Equal items that swap places produce duplicate results. Sort the input with <a href="https://docs.python.org/3/library/functions.html#sorted"><code>sorted</code></a> and, walking with <a href="https://docs.python.org/3/library/functions.html#enumerate"><code>enumerate</code></a>, skip any item equal to the previous one that has not been placed yet; that is the <strong>Subsets II</strong> idea. Record at entry, loop from an index onward, and permutations are simply the variant that cannot reuse an item.</p>
<h3>Prune the branches</h3>
<p>Speed comes from refusing branches early: cut when a running sum passes the target, when too few items remain to fill the required count, or when a sorted scan has moved past everything that could still work. Sorting first sharpens every cut, and it is what makes duplicate skipping possible at all. One more habit: store a copy of each finished result, because the live path keeps mutating.</p>
<h3>The skeleton</h3>
<pre><code>def permute(nums):
    result = []
    path = []
    def backtrack(remaining):
        if not remaining:              # path is one full arrangement
            result.append(path[:])     # snapshot: copy, never alias
            return
        for i, num in enumerate(remaining):
            path.append(num)           # choose
            backtrack(remaining[:i] + remaining[i + 1:])  # explore rest
            path.pop()                 # un-choose: restore the state
    backtrack(nums)
    return result
</code></pre>
<p class="callout complexity"><strong>Complexity:</strong> O(n * n!) time: n! full arrangements and each copy costs O(n); O(n) recursion depth for the path, plus O(n!) space for the output. Pruning only removes work from that tree.</p>`,
    exercise: {
      title: "Permutations",
      prompt: `Given <code>nums</code> of distinct integers, return all possible permutations in any order. Choose an item by appending it, explore the rest, then un-choose by popping before the next iteration.`,
      leetcode: "https://leetcode.com/problems/permutations/",
      docs: [
        { text: "enumerate()", url: "https://docs.python.org/3/library/functions.html#enumerate" },
        { text: "sorted()", url: "https://docs.python.org/3/library/functions.html#sorted" },
        { text: "common sequence operations (slicing)", url: "https://docs.python.org/3/library/stdtypes.html#common-sequence-operations" },
        { text: "mutable sequence types (append/pop)", url: "https://docs.python.org/3/library/stdtypes.html#mutable-sequence-types" }
      ],
      starter: `# Return every permutation of nums, as a list of lists
def permute(nums):
    pass  # TODO: your turn

# ---- tests ----
assert permute([]) == [[]]
assert permute([1]) == [[1]]
assert sorted(permute([1, 2])) == [[1, 2], [2, 1]]
assert sorted(permute([1, 2, 3])) == [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
print("All tests passed!")
`,
      solution: `# Return every permutation of nums, as a list of lists
def permute(nums):
    result = []
    path = []

    def backtrack(remaining):
        if not remaining:              # path is one full arrangement
            result.append(path[:])     # snapshot: copy, never alias
            return
        for i, num in enumerate(remaining):
            path.append(num)           # choose
            backtrack(remaining[:i] + remaining[i + 1:])  # explore rest
            path.pop()                 # un-choose: restore the state

    backtrack(nums)
    return result
`
    }
  },
  {
    id: "heaps",
    title: "Heaps & Top-K",
    minutes: 3,
    tagline: "Keep only what fits: heapify once, evict the smallest, skip the full sort.",
    body: `<h3>heapq is a list with rules</h3>
<p><a href="https://docs.python.org/3/library/heapq.html"><code>heapq</code></a> is a module of functions over a plain list, not a class. <a href="https://docs.python.org/3/library/heapq.html"><code>heapq.heapify</code></a> arranges an existing list in O(n); <a href="https://docs.python.org/3/library/heapq.html"><code>heappush</code></a> and <a href="https://docs.python.org/3/library/heapq.html"><code>heappop</code></a> cost O(log n) each and always touch the smallest item, so a max-heap means pushing negated values. There is no peek method: the root sits at index zero.</p>
${FIG.heap}
<h3>Top-k without sorting everything</h3>
<p>Count with <a href="https://docs.python.org/3/library/collections.html#collections.Counter"><code>collections.Counter</code></a>, then keep only the k best. Top-k wants a min-heap of size k: push every pair and, whenever the size passes k, pop the smallest. The survivors are the k most frequent, and the pair just evicted can never make the cut. That is O(n log k) instead of a full O(n log n) <a href="https://docs.python.org/3/library/functions.html#sorted"><code>sorted</code></a>, and <a href="https://docs.python.org/3/library/heapq.html"><code>heapq.nlargest</code></a> does that in one call. The same eviction trick hands you the k-th largest element for free: it is whatever sits at the heap root when the pass ends. When k is close to n, just sort; the constant factors win back the difference.</p>
<h3>Two heaps, running median</h3>
<p>A running median keeps two heaps facing each other: a max-heap of the lower half, stored negated, and a min-heap of the upper half, rebalanced after every insert so the sizes differ by at most one. The median is the single extra element, or the average of the two roots. This shape (one heap for the best k seen, another for the rest) recurs in scheduling and streaming problems.</p>
<h3>The skeleton</h3>
<pre><code>from collections import Counter
import heapq

def top_k_frequent(nums, k):
    counts = Counter(nums)              # value -> frequency
    heap = []                           # min-heap on count, size <= k
    for value, count in counts.items():
        heapq.heappush(heap, (count, value))
        if len(heap) > k:
            heapq.heappop(heap)         # drop the least frequent
    return [value for count, value in sorted(heap, reverse=True)]
</code></pre>
<p class="callout complexity"><strong>Complexity:</strong> O(n + m log k) time for n numbers and m distinct values: one counting pass, then m pushes whose memory is bounded by k. Space is O(m) for the counts and O(k) for the heap.</p>`,
    exercise: {
      title: "Top K Frequent Elements",
      prompt: `Given an integer list and an integer k, return the k most frequent values, most frequent first. Count with <a href="https://docs.python.org/3/library/collections.html#collections.Counter"><code>collections.Counter</code></a>, then keep a min-heap of size k and pop whenever it grows past k.`,
      leetcode: "https://leetcode.com/problems/top-k-frequent-elements/",
      docs: [
        { text: "heapq module", url: "https://docs.python.org/3/library/heapq.html" },
        { text: "collections.Counter", url: "https://docs.python.org/3/library/collections.html#collections.Counter" },
        { text: "sorted()", url: "https://docs.python.org/3/library/functions.html#sorted" },
        { text: "Time complexity (Python wiki)", url: "https://wiki.python.org/moin/TimeComplexity" }
      ],
      starter: `from collections import Counter
import heapq


# Return the k most frequent values, most frequent first.
def top_k_frequent(nums, k):
    pass  # TODO: your turn

# ---- tests ----
assert top_k_frequent([1, 1, 1, 2, 2, 3], 2) == [1, 2]
assert top_k_frequent([1], 1) == [1]
assert top_k_frequent([1, 1, 2, 3], 2) == [1, 3]
assert top_k_frequent([4, 4, 4, 5, 5, 6], 1) == [4]
assert top_k_frequent([1, 2], 2) == [2, 1]
print("All tests passed!")
`,
      solution: `from collections import Counter
import heapq


# Return the k most frequent values, most frequent first.
def top_k_frequent(nums, k):
    counts = Counter(nums)                 # value -> frequency
    heap = []                              # min-heap on count, size <= k
    for value, count in counts.items():
        heapq.heappush(heap, (count, value))
        if len(heap) > k:
            heapq.heappop(heap)            # drop the least frequent
    return [value for count, value in sorted(heap, reverse=True)]
`
    }
  },
  {
    id: "intervals",
    title: "Intervals & Greedy",
    minutes: 3,
    tagline: "Sort by one endpoint and the overlaps line up for a single sweep.",
    body: `<h3>Sort by start, sweep once</h3>
<p>Intervals feel open-ended until you sort them. Sort by start position and overlapping blocks land next to each other, so one sweep is enough: carry the current block, extend it when the next interval touches, otherwise close it and open a new one. Carrying only the current block keeps the state small, and the result comes out sorted by construction. Scattered input hides the structure; sorting restores it. This is the pattern behind merging calendars and collapsing ranges.</p>
${FIG.merge}
<h3>The overlap test</h3>
<p>Two intervals overlap when neither ends before the other starts, and the compact test is <a href="https://docs.python.org/3/library/functions.html#max"><code>max</code></a>(start) &lt; <a href="https://docs.python.org/3/library/functions.html#min"><code>min</code></a>(end). Treating touching as overlap, where [1,4] and [4,5] merge into [1,5], uses &lt;= instead. In the sweep, comparing only against the carried block is enough, because sorted order guarantees nothing earlier can reappear. Meeting Rooms II asks how many meetings overlap at peak: the same sweep, tracking open blocks instead of merging them.</p>
<h3>Sort by end instead</h3>
<p>Scheduling questions flip the sort. To keep the maximum number of non-overlapping intervals, sort by end and greedily take every interval that starts at or after the last end; the earliest-ending interval always leaves the most room, so the greedy choice is optimal. Counting then costs one linear scan and one variable. Classic uses: booking the most meetings into one room, and turning a wall of busy blocks into a free-time list.</p>
<h3>The skeleton</h3>
<pre><code>def merge(intervals):
    merged = []
    for start, end in sorted(intervals):      # by start, then end
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)   # extend it
        else:
            merged.append([start, end])       # nothing to join
    return merged

print(merge([[1, 3], [2, 6], [8, 10], [15, 18]]))
# [[1, 6], [8, 10], [15, 18]]
</code></pre>
<p class="callout complexity"><strong>Complexity:</strong> O(n log n) time: the sort dominates and the sweep is a single pass with O(1) work per interval; O(n) space for the merged output and O(1) extra besides it.</p>`,
    exercise: {
      title: "Merge Intervals",
      prompt: `Given a list of intervals [start, end], merge every pair that overlaps and return the disjoint result sorted by start. Sort by start and sweep once, extending the last merged interval whenever the next one touches it.`,
      leetcode: "https://leetcode.com/problems/merge-intervals/",
      docs: [
        { text: "sorted()", url: "https://docs.python.org/3/library/functions.html#sorted" },
        { text: "Sorting HOW TO (key functions)", url: "https://docs.python.org/3/howto/sorting.html" },
        { text: "max()", url: "https://docs.python.org/3/library/functions.html#max" },
        { text: "min()", url: "https://docs.python.org/3/library/functions.html#min" }
      ],
      starter: `# Merge overlapping intervals; return disjoint [start, end] pairs in order
def merge(intervals):
    pass  # TODO: your turn

# ---- tests ----
assert merge([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]
assert merge([[1, 4], [4, 5]]) == [[1, 5]]
assert merge([[1, 4], [2, 3]]) == [[1, 4]]
assert merge([[1, 4], [0, 4]]) == [[0, 4]]
assert merge([]) == []
print("All tests passed!")
`,
      solution: `# Merge overlapping intervals; return disjoint [start, end] pairs in order
def merge(intervals):
    merged = []
    for start, end in sorted(intervals):        # by start, then end
        if merged and start <= merged[-1][1]:   # touches the last block
            merged[-1][1] = max(merged[-1][1], end)   # extend it
        else:
            merged.append([start, end])         # start a new block
    return merged
`
    }
  }
];
