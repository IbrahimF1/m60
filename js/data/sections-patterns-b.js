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
`,
      tasks: [
        { text: "<strong>Get the shape right on a one-level tree.</strong> The result is a list of levels, so even a lone root comes back inside another list.",
          moves: [
            "Collect the root value",
            "Wrap it in one level list",
            "Return the list of levels, never a flat list"
          ],
          checks: [
            { input: "[1]", output: "[[1]]" },
            { input: "[5]", output: "[[5]]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><circle cx="116" cy="22" r="14" class="st f2"/><text x="116" y="23" text-anchor="middle" dominant-baseline="central">1</text><text x="116" y="50" text-anchor="middle" dominant-baseline="central" class="txd txs">one node, one level</text></g></svg>`,
          tests: [
            "assert level_order(build_tree([1])) == [[1]]",
            "assert level_order(build_tree([5])) == [[5]]"
          ],
          hint: "Returning a flat [1] instead of [[1]] is the first shape mistake; levels are always lists." },
        { text: "<strong>Cut a tree with full levels into rows by width.</strong> When every level except the deepest is full, the rows are slices of widths 1, 2, 4, 8 over one breadth-first walk.",
          moves: [
            "Walk the tree breadth first into one flat list",
            "Slice the list at widths 1, 2, 4, 8",
            "Append each slice as a level"
          ],
          checks: [
            { input: "[1,2,3]", output: "[[1],[2,3]]" },
            { input: "[3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }
          ],
          diagram: `<svg viewBox="0 0 232 66" aria-hidden="true" focusable="false"><g><line x1="116" y1="26" x2="90" y2="38" class="st-d"/><line x1="116" y1="26" x2="142" y2="38" class="st-d"/><circle cx="116" cy="16" r="12" class="st f2"/><text x="116" y="17" text-anchor="middle" dominant-baseline="central">1</text><circle cx="86" cy="46" r="12" class="st f2"/><text x="86" y="47" text-anchor="middle" dominant-baseline="central">2</text><circle cx="146" cy="46" r="12" class="st f2"/><text x="146" y="47" text-anchor="middle" dominant-baseline="central">3</text><text x="196" y="61" text-anchor="middle" dominant-baseline="central" class="txd txs">widths 1, 2</text></g></svg>`,
          tests: [
            "assert level_order(build_tree([1, 2, 3])) == [[1], [2, 3]]",
            "assert level_order(build_tree([3, 9, 20, None, None, 15, 7])) == [[3], [9, 20], [15, 7]]"
          ],
          hint: "Powers of two match a tree whose internal levels are full; the next task is the tree where they stop matching." },
        { text: "<strong>Freeze the queue length instead of assuming full levels.</strong> When a level is missing children, its real width is what the queue holds at that moment, not the next power of two.",
          moves: [
            "Read len(queue) before draining the level",
            "Pop exactly that many nodes into one level",
            "Append children during the sweep; they wait for the next round"
          ],
          checks: [
            { input: "[1,2,null,3]", output: "[[1],[2],[3]]" },
            { input: "[1,2,null,3,null,4]", output: "[[1],[2],[3],[4]]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><defs><marker id="ar-tr-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><circle cx="40" cy="20" r="11" class="st f2"/><text x="40" y="21" text-anchor="middle" dominant-baseline="central">1</text><path d="M53 23 L87 23" class="st-k" marker-end="url(#ar-tr-3)"/><circle cx="104" cy="20" r="11" class="st f2"/><text x="104" y="21" text-anchor="middle" dominant-baseline="central">2</text><path d="M117 23 L151 23" class="st-k" marker-end="url(#ar-tr-3)"/><circle cx="168" cy="20" r="11" class="st f2"/><text x="168" y="21" text-anchor="middle" dominant-baseline="central">3</text><line x1="40" y1="38" x2="40" y2="46" class="st-d dsh"/><line x1="34" y1="46" x2="46" y2="46" class="st-d dsh"/><line x1="104" y1="38" x2="104" y2="46" class="st-d dsh"/><line x1="98" y1="46" x2="110" y2="46" class="st-d dsh"/><line x1="168" y1="38" x2="168" y2="46" class="st-d dsh"/><line x1="162" y1="46" x2="174" y2="46" class="st-d dsh"/><text x="116" y="58" text-anchor="middle" dominant-baseline="central" class="txd txs">one node per level, no holes assumed</text></g></svg>`,
          tests: [
            "assert level_order(build_tree([1, 2, None, 3])) == [[1], [2], [3]]",
            "assert level_order(build_tree([1, 2, None, 3, None, 4])) == [[1], [2], [3], [4]]"
          ],
          hint: "A slice width of 2, 4, 8 assumes the hole is not there; the queue knows how many nodes really sit on the level." },
        { text: "<strong>Guard the empty tree before touching the queue.</strong> A deque holding None still enters the loop, and the first popleft dereferences it.",
          moves: [
            "Return [] when root is None, before building the queue",
            "Then run the frozen-width loop as before"
          ],
          checks: [
            { input: "empty", output: "[]" },
            { input: "null root", output: "[]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="30" y="15" width="72" height="28" rx="9" class="st dsh"/><text x="66" y="29" text-anchor="middle" dominant-baseline="central" class="txd txs">None</text><path d="M106 29 L146 29" class="st-k"/><path d="M144 24 L152 29 L144 34" class="st-k"/><rect x="158" y="15" width="56" height="28" rx="9" class="st-k f5"/><text x="186" y="29" text-anchor="middle" dominant-baseline="central" class="txs">[]</text><text x="116" y="55" text-anchor="middle" dominant-baseline="central" class="txd txs">check before deque</text></g></svg>`,
          tests: [
            "assert level_order(build_tree([])) == []",
            "assert level_order(None) == []"
          ],
          hint: "The None check belongs before deque([root]); the loop itself will not save you." }
      ],
      steps: [
        `from collections import deque


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


# Step 1: one flat depth-first walk, wrapped as a single level.
def level_order(root):
    values = []
    stack = [root]
    while stack:
        node = stack.pop()
        values.append(node.val)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    return [values]
`,
        `from collections import deque


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


# Step 2: breadth-first order, cut at widths 1, 2, 4, 8.
def level_order(root):
    values = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        values.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    levels = []
    start = 0
    width = 1
    while start < len(values):
        levels.append(values[start:start + width])
        start += width
        width *= 2
    return levels
`,
        `from collections import deque


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


# Step 3: freeze the queue length so one round is one real level.
def level_order(root):
    levels = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        levels.append(level)
    return levels
`,
        `from collections import deque


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


# Step 4: guard the empty tree, then freeze each level's width.
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
      ],
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
`,
      tasks: [
        { text: "<strong>Count a lone land cell as one island.</strong> With no neighbors to join, every 1 is its own island, so the count starts as a plain tally.",
          moves: [
            "Walk every row and column",
            "Add one for each cell equal to 1",
            "Return the tally"
          ],
          checks: [
            { input: "1 0 / 0 0", output: "1" },
            { input: "1 0 0 / 0 1 0 / 0 0 0", output: "2" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="76" y="2" width="22" height="18" rx="4" class="st f5"/><text x="87" y="11" text-anchor="middle" dominant-baseline="central">1</text><rect x="100" y="2" width="22" height="18" rx="4" class="st f2"/><text x="111" y="11" text-anchor="middle" dominant-baseline="central">0</text><rect x="124" y="2" width="22" height="18" rx="4" class="st f2"/><text x="135" y="11" text-anchor="middle" dominant-baseline="central">0</text><rect x="76" y="22" width="22" height="18" rx="4" class="st f2"/><text x="87" y="31" text-anchor="middle" dominant-baseline="central">0</text><rect x="100" y="22" width="22" height="18" rx="4" class="st f5"/><text x="111" y="31" text-anchor="middle" dominant-baseline="central">1</text><rect x="124" y="22" width="22" height="18" rx="4" class="st f2"/><text x="135" y="31" text-anchor="middle" dominant-baseline="central">0</text><rect x="76" y="42" width="22" height="18" rx="4" class="st f2"/><text x="87" y="51" text-anchor="middle" dominant-baseline="central">0</text><rect x="100" y="42" width="22" height="18" rx="4" class="st f2"/><text x="111" y="51" text-anchor="middle" dominant-baseline="central">0</text><rect x="124" y="42" width="22" height="18" rx="4" class="st f2"/><text x="135" y="51" text-anchor="middle" dominant-baseline="central">0</text><text x="164" y="31" text-anchor="start" dominant-baseline="central" class="txd txs">two islands</text></g></svg>`,
          tests: [
            "assert num_islands([[\"1\", \"0\"], [\"0\", \"0\"]]) == 1",
            "assert num_islands([[\"1\", \"0\", \"0\"], [\"0\", \"1\", \"0\"], [\"0\", \"0\", \"0\"]]) == 2"
          ],
          hint: "This tally is only right while no two land cells touch; the next task joins them." },
        { text: "<strong>Erase an island when you find it.</strong> Count one, then flood its connected cells to water so the scan never counts the same island twice.",
          moves: [
            "When a cell is 1, add one and start a flood from it",
            "Flood down and right, writing 0 into each visited cell",
            "Resume the scan: sunk cells are already water"
          ],
          checks: [
            { input: "1 1 0 0 / 0 1 1 0", output: "1" },
            { input: "1 1 0 0 0 / 0 1 1 0 0 / 0 0 0 1 0", output: "2" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="56" y="6" width="22" height="18" rx="4" class="st f5"/><text x="67" y="15" text-anchor="middle" dominant-baseline="central">1</text><rect x="80" y="6" width="22" height="18" rx="4" class="st f5"/><text x="91" y="15" text-anchor="middle" dominant-baseline="central">1</text><rect x="104" y="6" width="22" height="18" rx="4" class="st f2"/><text x="115" y="15" text-anchor="middle" dominant-baseline="central">0</text><rect x="128" y="6" width="22" height="18" rx="4" class="st f2"/><text x="139" y="15" text-anchor="middle" dominant-baseline="central">0</text><rect x="56" y="28" width="22" height="18" rx="4" class="st f2"/><text x="67" y="37" text-anchor="middle" dominant-baseline="central">0</text><rect x="80" y="28" width="22" height="18" rx="4" class="st f5"/><text x="91" y="37" text-anchor="middle" dominant-baseline="central">1</text><rect x="104" y="28" width="22" height="18" rx="4" class="st f5"/><text x="115" y="37" text-anchor="middle" dominant-baseline="central">1</text><rect x="128" y="28" width="22" height="18" rx="4" class="st f2"/><text x="139" y="37" text-anchor="middle" dominant-baseline="central">0</text><text x="164" y="22" text-anchor="start" dominant-baseline="central" class="txd txs">one flood</text><text x="164" y="40" text-anchor="start" dominant-baseline="central" class="txd txs">erases it</text></g></svg>`,
          tests: [
            "assert num_islands([[\"1\", \"1\", \"0\", \"0\"], [\"0\", \"1\", \"1\", \"0\"]]) == 1",
            "assert num_islands([[\"1\", \"1\", \"0\", \"0\", \"0\"], [\"0\", \"1\", \"1\", \"0\", \"0\"], [\"0\", \"0\", \"0\", \"1\", \"0\"]]) == 2"
          ],
          hint: "Marking cells is what stops the tally from counting one island once per cell." },
        { text: "<strong>Flood all four directions.</strong> Land joins up, down, left, and right only; a diagonal touch is a different island.",
          moves: [
            "From each cell, recurse to r+1, r-1, c+1, c-1",
            "Stop at the grid edge, water, or a cell already sunk",
            "Never move diagonally"
          ],
          checks: [
            { input: "0 1 0 0 0 / 1 1 0 0 0 / 0 0 0 1 0", output: "2" },
            { input: "1 0 0 / 0 1 0 / 0 0 0", output: "2" },
            { input: "11110 / 11010 / 11000 / 00000", output: "1" }
          ],
          diagram: `<svg viewBox="0 0 232 76" aria-hidden="true" focusable="false"><g><rect x="66" y="4" width="20" height="20" rx="3" class="st dsh"/><rect x="90" y="4" width="20" height="20" rx="3" class="st f5"/><rect x="114" y="4" width="20" height="20" rx="3" class="st dsh"/><rect x="66" y="28" width="20" height="20" rx="3" class="st f5"/><rect x="90" y="28" width="20" height="20" rx="3" class="st-k f5"/><rect x="114" y="28" width="20" height="20" rx="3" class="st f5"/><rect x="66" y="52" width="20" height="20" rx="3" class="st dsh"/><rect x="90" y="52" width="20" height="20" rx="3" class="st f5"/><rect x="114" y="52" width="20" height="20" rx="3" class="st dsh"/><text x="150" y="34" text-anchor="start" dominant-baseline="central" class="txd txs">four ways</text><text x="150" y="48" text-anchor="start" dominant-baseline="central" class="txd txs">no diagonals</text></g></svg>`,
          tests: [
            "assert num_islands([[\"0\", \"1\", \"0\", \"0\", \"0\"], [\"1\", \"1\", \"0\", \"0\", \"0\"], [\"0\", \"0\", \"0\", \"1\", \"0\"]]) == 2",
            "assert num_islands([[\"1\", \"0\", \"0\"], [\"0\", \"1\", \"0\"], [\"0\", \"0\", \"0\"]]) == 2",
            "assert num_islands([[\"1\", \"1\", \"1\", \"1\", \"0\"], [\"1\", \"1\", \"0\", \"1\", \"0\"], [\"1\", \"1\", \"0\", \"0\", \"0\"], [\"0\", \"0\", \"0\", \"0\", \"0\"]]) == 1"
          ],
          hint: "A flood that only moves right and down misses land that sits up or left of the cell that reached it." },
        { text: "<strong>Check the column against cols, not past it.</strong> A cell on the last column asks for a neighbor at c equal to cols; the bounds test must reject that index before Python raises.",
          moves: [
            "Reject c at or past cols in the flood's first line",
            "Reject r at or past rows the same way",
            "Only then read the cell"
          ],
          checks: [
            { input: "1 0 1", output: "2" },
            { input: "0 1 / 0 1", output: "1" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="50" y="8" width="26" height="22" rx="4" class="st f2"/><text x="63" y="19" text-anchor="middle" dominant-baseline="central">1</text><rect x="80" y="8" width="26" height="22" rx="4" class="st f2"/><text x="93" y="19" text-anchor="middle" dominant-baseline="central">0</text><rect x="110" y="8" width="26" height="22" rx="4" class="st-k f5"/><text x="123" y="19" text-anchor="middle" dominant-baseline="central">1</text><text x="110" y="42" text-anchor="middle" dominant-baseline="central" class="txd txs">last column</text><path d="M140 19 L168 19" class="st-d dsh"/><text x="172" y="19" text-anchor="start" dominant-baseline="central" class="txd txs">stop</text></g></svg>`,
          tests: [
            "assert num_islands([[\"1\", \"0\", \"1\"]]) == 2",
            "assert num_islands([[\"0\", \"1\"], [\"0\", \"1\"]]) == 1"
          ],
          hint: "Testing c past cols lets c equal cols through, so the last column's right neighbor indexes off the row." }
      ],
      steps: [
        `# Step 1: tally every land cell; no two of them touch yet.
def num_islands(grid):
    count = 0
    for row in grid:
        for cell in row:
            if cell == "1":
                count += 1
    return count
`,
        `# Step 2: flood down and right so one island is counted once.
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0

    def sink(r, c):
        if r < 0 or r >= rows or c < 0 or c > cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        sink(r + 1, c)
        sink(r, c + 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count
`,
        `# Step 3: flood in all four directions.
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0

    def sink(r, c):
        if r < 0 or r >= rows or c < 0 or c > cols or grid[r][c] != "1":
            return
        grid[r][c] = "0"
        sink(r + 1, c)
        sink(r - 1, c)
        sink(r, c + 1)
        sink(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                sink(r, c)
    return count
`,
        `# Step 4: reject c equal to cols as well, then flood all four ways.
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
      ],
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
`,
      tasks: [
        { text: "<strong>One value has exactly one arrangement.</strong> The outer list holds every arrangement, so even a single value comes back inside another list.",
          moves: [
            "Start with an empty result list",
            "Add one arrangement holding the only value"
          ],
          checks: [
            { input: "[1]", output: "[[1]]" },
            { input: "[7]", output: "[[7]]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="52" y="16" width="30" height="24" rx="7" class="st f2"/><text x="67" y="28" text-anchor="middle" dominant-baseline="central">1</text><path d="M88 28 L134 28" class="st-k"/><path d="M132 23 L140 28 L132 33" class="st-k"/><rect x="146" y="12" width="60" height="32" rx="7" class="st-k f5"/><text x="176" y="28" text-anchor="middle" dominant-baseline="central" class="txs">[1]</text><text x="116" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">one path, one list</text></g></svg>`,
          tests: [
            "assert permute([1]) == [[1]]",
            "assert permute([7]) == [[7]]"
          ],
          hint: "The result is a list of arrangements, so a lone value still needs the inner list around it." },
        { text: "<strong>Two values have two orders.</strong> Pick each value as the first element, then place the other one in the only remaining slot.",
          moves: [
            "Loop over every value as the first pick",
            "Append the other values in their given order",
            "Collect one arrangement per first pick"
          ],
          checks: [
            { input: "[1,2]", output: "[[1,2],[2,1]]" },
            { input: "[5,9]", output: "[[5,9],[9,5]]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><defs><marker id="ar-bt-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><text x="42" y="18" text-anchor="middle" dominant-baseline="central" class="txd txs">first</text><path d="M58 24 C 84 24, 92 32, 112 36" class="st-k" marker-end="url(#ar-bt-2)"/><path d="M58 24 C 84 24, 96 14, 112 12" class="st-k" marker-end="url(#ar-bt-2)"/><text x="124" y="38" text-anchor="start" dominant-baseline="central">1</text><text x="124" y="10" text-anchor="start" dominant-baseline="central">2</text><text x="150" y="38" text-anchor="start" dominant-baseline="central" class="txd txs">then 2</text><text x="150" y="10" text-anchor="start" dominant-baseline="central" class="txd txs">then 1</text><text x="116" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">two branches</text></g></svg>`,
          tests: [
            "assert sorted(permute([1, 2])) == [[1, 2], [2, 1]]",
            "assert sorted(permute([5, 9])) == [[5, 9], [9, 5]]"
          ],
          hint: "A loop that only rotates the input gives n arrangements; the rest needs recursion on the remaining values." },
        { text: "<strong>Hand the remaining values to a recursive call.</strong> Pick one value, recurse on the rest, and prepend the pick to every arrangement that comes back.",
          moves: [
            "Base case: one value left returns one arrangement",
            "For each index, recurse on the list without that index",
            "Prepend the picked value to each returned arrangement"
          ],
          checks: [
            { input: "[1,2,3]", output: "123 132 213 231 312 321" },
            { input: "[4,5,6]", output: "456 465 546 564 645 654" }
          ],
          diagram: `<svg viewBox="0 0 232 70" aria-hidden="true" focusable="false"><g><defs><marker id="ar-bt-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><text x="116" y="10" text-anchor="middle" dominant-baseline="central" class="txd txs">pick 1, 2, or 3</text><path d="M116 22 L60 42" class="st-k" marker-end="url(#ar-bt-3)"/><path d="M116 22 L116 42" class="st-k" marker-end="url(#ar-bt-3)"/><path d="M116 22 L172 42" class="st-k" marker-end="url(#ar-bt-3)"/><rect x="38" y="44" width="44" height="18" rx="6" class="st f2"/><text x="60" y="53" text-anchor="middle" dominant-baseline="central" class="txs">1</text><rect x="94" y="44" width="44" height="18" rx="6" class="st f2"/><text x="116" y="53" text-anchor="middle" dominant-baseline="central" class="txs">2</text><rect x="150" y="44" width="44" height="18" rx="6" class="st f2"/><text x="172" y="53" text-anchor="middle" dominant-baseline="central" class="txs">3</text></g></svg>`,
          tests: [
            "assert sorted(permute([1, 2, 3])) == [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
            "assert sorted(permute([4, 5, 6])) == [[4, 5, 6], [4, 6, 5], [5, 4, 6], [5, 6, 4], [6, 4, 5], [6, 5, 4]]"
          ],
          hint: "Prepend the picked value to each arrangement of the rest; three picks times two tails is all six." },
        { text: "<strong>An empty list still has one arrangement: the empty one.</strong> The base case is no values left, not one value left, or the loop runs zero times and returns nothing.",
          moves: [
            "Return a list holding one empty list when nums is empty",
            "Let every other call recurse as before",
            "Copy each finished path before storing it"
          ],
          checks: [
            { input: "[]", output: "[[]]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="26" y="16" width="64" height="26" rx="7" class="st dsh"/><text x="58" y="29" text-anchor="middle" dominant-baseline="central" class="txd txs">nums empty</text><path d="M96 29 L138 29" class="st-k"/><path d="M136 24 L144 29 L136 34" class="st-k"/><rect x="150" y="12" width="66" height="34" rx="7" class="st-k f5"/><text x="183" y="29" text-anchor="middle" dominant-baseline="central" class="txs">[[]]</text><text x="116" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">one empty arrangement</text></g></svg>`,
          tests: [
            "assert permute([]) == [[]]",
            "assert len(permute([])) == 1"
          ],
          hint: "One-value base cases skip the empty list entirely; the empty path itself is the missing arrangement." }
      ],
      steps: [
        `# Step 1: one arrangement per value.
def permute(nums):
    result = []
    for num in nums:
        result.append([num])
    return result
`,
        `# Step 2: each value first, the others after it in order.
def permute(nums):
    result = []
    for num in nums:
        rest = [other for other in nums if other != num]
        result.append([num] + rest)
    return result
`,
        `# Step 3: recurse on the values that remain.
def permute(nums):
    if len(nums) == 1:
        return [nums]
    result = []
    for i, num in enumerate(nums):
        for tail in permute(nums[:i] + nums[i + 1:]):
            result.append([num] + tail)
    return result
`,
        `# Step 4: the base case is zero values left, so the empty list has [[]].
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
      ],
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
`,
      tasks: [
        { text: "<strong>With k covering every distinct value, the answer is the whole frequency table.</strong> Count each value once, then order the keys by how often they appear; no cut is needed yet.",
          moves: [
            "Count every value with Counter",
            "Sort the keys by count, largest first",
            "Return every key"
          ],
          checks: [
            { input: "[5,5,5,9,9,2], k=3", output: "[5,9,2]" },
            { input: "[6,6,6,6,2,2,2,7], k=3", output: "[6,2,7]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="12" y="13" text-anchor="start" dominant-baseline="central" class="txd txs">5</text><rect x="34" y="6" width="66" height="14" rx="4" class="st f5"/><text x="108" y="13" text-anchor="start" dominant-baseline="central" class="txd txs">3</text><text x="12" y="33" text-anchor="start" dominant-baseline="central" class="txd txs">9</text><rect x="34" y="26" width="44" height="14" rx="4" class="st f2"/><text x="86" y="33" text-anchor="start" dominant-baseline="central" class="txd txs">2</text><text x="12" y="53" text-anchor="start" dominant-baseline="central" class="txd txs">2</text><rect x="34" y="46" width="22" height="14" rx="4" class="st f2"/><text x="64" y="53" text-anchor="start" dominant-baseline="central" class="txd txs">1</text></g></svg>`,
          tests: [
            "assert top_k_frequent([5, 5, 5, 9, 9, 2], 3) == [5, 9, 2]",
            "assert top_k_frequent([6, 6, 6, 6, 2, 2, 2, 7], 3) == [6, 2, 7]"
          ],
          hint: "Every distinct value fits here, so the only work is counting and ordering; dropping values starts next." },
        { text: "<strong>A smaller k is a cut, not a new computation.</strong> Keep the same count order and drop everything past position k.",
          moves: [
            "Sort the distinct values by count, largest first",
            "Slice the first k entries",
            "Return those values"
          ],
          checks: [
            { input: "[1,1,1,2,2,3], k=2", output: "[1,2]" },
            { input: "[2,5,5,5,9,9], k=2", output: "[5,9]" },
            { input: "[7,1,1,3,3,3], k=1", output: "[3]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="12" y="11" text-anchor="start" dominant-baseline="central" class="txd txs">5</text><rect x="34" y="4" width="66" height="13" rx="4" class="st f5"/><text x="108" y="11" text-anchor="start" dominant-baseline="central" class="txd txs">3</text><text x="12" y="30" text-anchor="start" dominant-baseline="central" class="txd txs">9</text><rect x="34" y="23" width="44" height="13" rx="4" class="st f5"/><text x="86" y="30" text-anchor="start" dominant-baseline="central" class="txd txs">2</text><line x1="8" y1="40" x2="160" y2="40" class="st-k dsh"/><text x="168" y="40" text-anchor="start" dominant-baseline="central" class="txd txs">keep 2</text><text x="12" y="52" text-anchor="start" dominant-baseline="central" class="txd txs">2</text><rect x="34" y="45" width="22" height="13" rx="4" class="st f2 st-d"/><text x="64" y="52" text-anchor="start" dominant-baseline="central" class="txd txs">1</text></g></svg>`,
          tests: [
            "assert top_k_frequent([1, 1, 1, 2, 2, 3], 2) == [1, 2]",
            "assert top_k_frequent([2, 5, 5, 5, 9, 9], 2) == [5, 9]",
            "assert top_k_frequent([7, 1, 1, 3, 3, 3], 1) == [3]"
          ],
          hint: "Counts must decide which k survive; first appearance or value order alone gives the wrong survivors." },
        { text: "<strong>Break equal counts with the value itself, larger first.</strong> The heap stores (count, value), so tied counts compare their second element when you sort the survivors descending.",
          moves: [
            "Push a (count, value) tuple for each distinct value",
            "Keep a min-heap of size k, popping whenever it grows past k",
            "Sort the surviving tuples descending and keep the values"
          ],
          checks: [
            { input: "[4,4,6,6,8,8], k=3", output: "[8,6,4]" },
            { input: "[1,1,2,2], k=2", output: "[2,1]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="12" y="12" text-anchor="start" dominant-baseline="central" class="txd txs">4</text><rect x="34" y="5" width="44" height="13" rx="4" class="st f2"/><text x="12" y="30" text-anchor="start" dominant-baseline="central" class="txd txs">6</text><rect x="34" y="23" width="44" height="13" rx="4" class="st f2"/><text x="12" y="48" text-anchor="start" dominant-baseline="central" class="txd txs">8</text><rect x="34" y="41" width="44" height="13" rx="4" class="st-k f5"/><text x="96" y="22" text-anchor="start" dominant-baseline="central" class="txd txs">all count 2</text><text x="96" y="42" text-anchor="start" dominant-baseline="central" class="txd txs">order 8, 6, 4</text></g></svg>`,
          tests: [
            "assert top_k_frequent([4, 4, 6, 6, 8, 8], 3) == [8, 6, 4]",
            "assert top_k_frequent([1, 1, 2, 2], 2) == [2, 1]"
          ],
          hint: "Sorting the keys alone is stable, so ties keep their first-seen order; the tuple adds the value as a second key." }
      ],
      steps: [
        `from collections import Counter


# Step 1: count, then order the keys by frequency.
def top_k_frequent(nums, k):
    counts = Counter(nums)
    return sorted(counts, key=counts.get, reverse=True)
`,
        `from collections import Counter


# Step 2: order the keys by frequency and keep the first k.
def top_k_frequent(nums, k):
    counts = Counter(nums)
    return sorted(counts, key=counts.get, reverse=True)[:k]
`,
        `from collections import Counter
import heapq


# Step 3: a min-heap of (count, value) pairs keeps the best k.
def top_k_frequent(nums, k):
    counts = Counter(nums)                 # value -> frequency
    heap = []                              # min-heap on count, size <= k
    for value, count in counts.items():
        heapq.heappush(heap, (count, value))
        if len(heap) > k:
            heapq.heappop(heap)            # drop the least frequent
    return [value for count, value in sorted(heap, reverse=True)]
`
      ],
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
`,
      tasks: [
        { text: "<strong>Put the blocks in order before you join anything.</strong> The answer must be sorted by start, and sorting first is what makes each block's only possible partner the one just before it.",
          moves: [
            "Sort the input by start, then by end",
            "Seed the output with a copy of the first sorted block",
            "Append every other block unchanged"
          ],
          checks: [
            { input: "[5,6] [1,2] [3,4]", output: "[1,2] [3,4] [5,6]" },
            { input: "[10,12] [1,2]", output: "[1,2] [10,12]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="52" y="16" text-anchor="end" dominant-baseline="central" class="txd txs">[5,6]</text><rect x="170" y="9" width="22" height="14" rx="4" class="st f2"/><text x="52" y="34" text-anchor="end" dominant-baseline="central" class="txd txs">[1,2]</text><rect x="82" y="27" width="22" height="14" rx="4" class="st f2"/><text x="52" y="52" text-anchor="end" dominant-baseline="central" class="txd txs">[3,4]</text><rect x="126" y="45" width="22" height="14" rx="4" class="st f2"/><line x1="60" y1="60" x2="222" y2="60" class="st-d dsh"/></g></svg>`,
          tests: [
            "assert merge([[5, 6], [1, 2], [3, 4]]) == [[1, 2], [3, 4], [5, 6]]",
            "assert merge([[10, 12], [1, 2]]) == [[1, 2], [10, 12]]"
          ],
          hint: "The output order is part of the contract: sort before you compare neighbors, and copy the pairs into lists." },
        { text: "<strong>Join the next block to the last one you kept.</strong> Sorted order guarantees that only the last merged block can overlap what comes next, so one comparison per interval is enough.",
          moves: [
            "Compare the next start with the last kept end",
            "On an overlap, set that end to the larger of the two ends",
            "Otherwise append the interval as a new block"
          ],
          checks: [
            { input: "[1,3] [2,6] [8,10] [15,18]", output: "[1,6] [8,10] [15,18]" },
            { input: "[2,6] [1,3]", output: "[1,6]" },
            { input: "[1,4] [2,3]", output: "[1,4]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="52" y="12" text-anchor="end" dominant-baseline="central" class="txd txs">[1,3]</text><rect x="82" y="5" width="44" height="13" rx="4" class="st f2"/><text x="52" y="28" text-anchor="end" dominant-baseline="central" class="txd txs">[2,6]</text><rect x="104" y="21" width="88" height="13" rx="4" class="st f2"/><text x="52" y="50" text-anchor="end" dominant-baseline="central" class="txd txs">[1,6]</text><rect x="82" y="43" width="110" height="13" rx="4" class="st-k f5"/><path d="M148 36 L148 41" class="st-k"/></g></svg>`,
          tests: [
            "assert merge([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]",
            "assert merge([[2, 6], [1, 3]]) == [[1, 6]]",
            "assert merge([[1, 4], [2, 3]]) == [[1, 4]]"
          ],
          hint: "Compare with the last kept block, not the previous input pair: an earlier merge may already cover the newcomer." },
        { text: "<strong>Count a shared endpoint as an overlap.</strong> [1,4] and [4,5] cover one continuous stretch, so the test is a start at or before the last end, not strictly before it.",
          moves: [
            "Let a start equal to the last end pass the merge test",
            "Extend with max so a contained interval cannot shrink the block",
            "Leave the result ordered by construction"
          ],
          checks: [
            { input: "[1,4] [4,5]", output: "[1,5]" },
            { input: "[1,2] [2,3] [3,4]", output: "[1,4]" },
            { input: "[1,2] [2,3] [5,6]", output: "[1,3] [5,6]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="52" y="12" text-anchor="end" dominant-baseline="central" class="txd txs">[1,4]</text><rect x="82" y="5" width="66" height="13" rx="4" class="st f2"/><text x="52" y="28" text-anchor="end" dominant-baseline="central" class="txd txs">[4,5]</text><rect x="148" y="21" width="22" height="13" rx="4" class="st f2"/><text x="52" y="50" text-anchor="end" dominant-baseline="central" class="txd txs">[1,5]</text><rect x="82" y="43" width="88" height="13" rx="4" class="st-k f5"/><line x1="148" y1="4" x2="148" y2="40" class="st-d dsh"/><text x="196" y="50" text-anchor="middle" dominant-baseline="central" class="txd txs">touch, join</text></g></svg>`,
          tests: [
            "assert merge([[1, 4], [4, 5]]) == [[1, 5]]",
            "assert merge([[1, 2], [2, 3], [3, 4]]) == [[1, 4]]",
            "assert merge([[1, 2], [2, 3], [5, 6]]) == [[1, 3], [5, 6]]"
          ],
          hint: "A strict comparison leaves touching blocks apart; the shared endpoint is the whole lesson." },
        { text: "<strong>Start the output empty instead of seeding it with the first block.</strong> A seed has no first block to copy when the list is empty, while an empty output plus a guarded test handles every size.",
          moves: [
            "Drop the seed and start merged as an empty list",
            "Guard the merge with a check that merged is non-empty",
            "Let the loop return an empty list untouched"
          ],
          checks: [
            { input: "[2,5]", output: "[2,5]" },
            { input: "empty", output: "[]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="14" y="14" text-anchor="start" dominant-baseline="central" class="txd txs">[2,5]</text><rect x="58" y="7" width="54" height="14" rx="4" class="st f2"/><text x="14" y="46" text-anchor="start" dominant-baseline="central" class="txd txs">empty</text><rect x="58" y="36" width="54" height="20" rx="7" class="st dsh"/><text x="128" y="46" text-anchor="start" dominant-baseline="central" class="txd txs">no seed, no crash</text></g></svg>`,
          tests: [
            "assert merge([[2, 5]]) == [[2, 5]]",
            "assert merge([]) == []"
          ],
          hint: "Seeding with the first interval is the usual style, and the usual crash on an empty input." }
      ],
      steps: [
        `# Step 1: sort the blocks and keep them whole.
def merge(intervals):
    ordered = sorted(intervals)
    merged = [ordered[0][:]]        # seed with the first block
    for start, end in ordered[1:]:
        merged.append([start, end])
    return merged
`,
        `# Step 2: join a block when it overlaps the last kept one.
def merge(intervals):
    ordered = sorted(intervals)
    merged = [ordered[0][:]]
    for start, end in ordered[1:]:
        if start < merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
`,
        `# Step 3: touching blocks merge too.
def merge(intervals):
    ordered = sorted(intervals)
    merged = [ordered[0][:]]
    for start, end in ordered[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged
`,
        `# Step 4: start empty so an empty input needs no first block.
def merge(intervals):
    merged = []
    for start, end in sorted(intervals):        # by start, then end
        if merged and start <= merged[-1][1]:   # touches the last block
            merged[-1][1] = max(merged[-1][1], end)   # extend it
        else:
            merged.append([start, end])         # start a new block
    return merged
`
      ],
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
