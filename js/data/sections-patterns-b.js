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
      prompt: `Given the root of a binary tree, return its level order traversal: a list of levels, each level listing node values from left to right. A queue from <a href="https://docs.python.org/3/library/collections.html#collections.deque"><code>collections.deque</code></a> hands you the next node in one step. The <code>TreeNode</code> class and <code>build_tree</code> helper are provided.`,
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
        { text: "<strong>One node is one level.</strong> A tree with only a root has a single level holding a single value. Return a list of levels: one inner list around the root value.",
          moves: [
            "Return one inner list holding just root.val",
            "Try it on a tree built from 1 and from 5",
            "A flat list of the value alone would be wrong"
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
          hint: "The answer is a list of levels and every level is a list, so one node still comes back as a list inside a list." },
        { text: "<strong>Add the children as a second level.</strong> The root sits on level one. Its left and right children, when they exist, sit on level two, so read them straight off the root.",
          moves: [
            "Start the answer with one level holding root.val",
            "Add root.left.val and root.right.val when they exist",
            "Skip the second level when the root has no children"
          ],
          checks: [
            { input: "[1,2,3]", output: "[[1],[2,3]]" },
            { input: "[1,null,2]", output: "[[1],[2]]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><line x1="111" y1="20" x2="93" y2="33" class="st-d"/><line x1="121" y1="20" x2="139" y2="33" class="st-d"/><circle cx="116" cy="12" r="10" class="st f2"/><text x="116" y="13" text-anchor="middle" dominant-baseline="central">1</text><circle cx="86" cy="42" r="10" class="st f5"/><text x="86" y="43" text-anchor="middle" dominant-baseline="central">2</text><circle cx="146" cy="42" r="10" class="st f5"/><text x="146" y="43" text-anchor="middle" dominant-baseline="central">3</text><text x="196" y="27" text-anchor="middle" dominant-baseline="central" class="txd txs">root,</text><text x="196" y="39" text-anchor="middle" dominant-baseline="central" class="txd txs">children</text></g></svg>`,
          tests: [
            "assert level_order(build_tree([1, 2, 3])) == [[1], [2, 3]]",
            "assert level_order(build_tree([1, None, 2])) == [[1], [2]]"
          ],
          hint: "Two if statements cover root.left and root.right; collect the values that exist into a second list." },
        { text: "<strong>Reach any depth with a queue walk.</strong> Grandchildren exist too, and reading levels by hand cannot go on forever. Walk the tree with a queue: pop a node, save its value, push its children. Then cut the walk into rows of 1, 2, 4, 8 values, which is right while every level is full.",
          moves: [
            "Pop nodes from the front of a deque and save each value",
            "Push every child that exists onto the back",
            "Slice the flat value list into rows of 1, then 2, then 4 values"
          ],
          checks: [
            { input: "[3,9,20,15,7]", output: "[[3],[9,20],[15,7]]" },
            { input: "[1,2,3,4,5,6,7]", output: "[[1],[2,3],[4,5,6,7]]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><circle cx="116" cy="10" r="9" class="st f2"/><text x="116" y="11" text-anchor="middle" dominant-baseline="central">1</text><circle cx="86" cy="30" r="9" class="st f5"/><text x="86" y="31" text-anchor="middle" dominant-baseline="central">2</text><circle cx="146" cy="30" r="9" class="st f5"/><text x="146" y="31" text-anchor="middle" dominant-baseline="central">3</text><circle cx="71" cy="50" r="7" class="st f5"/><circle cx="101" cy="50" r="7" class="st f5"/><circle cx="131" cy="50" r="7" class="st f5"/><circle cx="161" cy="50" r="7" class="st f5"/><text x="200" y="24" text-anchor="middle" dominant-baseline="central" class="txd txs">full rows:</text><text x="200" y="36" text-anchor="middle" dominant-baseline="central" class="txd txs">1, 2, 4</text></g></svg>`,
          tests: [
            "assert level_order(build_tree([3, 9, 20, 15, 7])) == [[3], [9, 20], [15, 7]]",
            "assert level_order(build_tree([1, 2, 3, 4, 5, 6, 7])) == [[1], [2, 3], [4, 5, 6, 7]]"
          ],
          hint: "Children pushed while you drain one row come out on later rows, so the flat walk still visits every node in order." },
        { text: "<strong>Ask the queue how wide the level really is.</strong> When a node is missing a child, the next level is not twice as wide. Before draining each level, read the queue's length: exactly that many nodes belong to it.",
          moves: [
            "Before each level, save the queue's length as its width",
            "Pop exactly that many nodes into the current level",
            "Children pushed during the sweep wait for the next round"
          ],
          checks: [
            { input: "[1,2,null,3]", output: "[[1],[2],[3]]" },
            { input: "[1,null,2,null,3]", output: "[[1],[2],[3]]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-tr-4" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><circle cx="40" cy="18" r="11" class="st f2"/><text x="40" y="19" text-anchor="middle" dominant-baseline="central">1</text><path d="M53 21 L87 21" class="st-k" marker-end="url(#ar-tr-4)"/><circle cx="104" cy="18" r="11" class="st f2"/><text x="104" y="19" text-anchor="middle" dominant-baseline="central">2</text><path d="M117 21 L151 21" class="st-k" marker-end="url(#ar-tr-4)"/><circle cx="168" cy="18" r="11" class="st f2"/><text x="168" y="19" text-anchor="middle" dominant-baseline="central">3</text><text x="116" y="52" text-anchor="middle" dominant-baseline="central" class="txd txs">a missing child: one node per level</text></g></svg>`,
          tests: [
            "assert level_order(build_tree([1, 2, None, 3])) == [[1], [2], [3]]",
            "assert level_order(build_tree([1, None, 2, None, 3])) == [[1], [2], [3]]"
          ],
          hint: "for _ in range(len(queue)) freezes the width before any child is pushed; doubling widths guess wrong when children are missing." },
        { text: "<strong>Guard the empty tree.</strong> A deque holding None still enters the loop, and the first pop crashes reading its value. Check root is None before building the queue and return an empty list.",
          moves: [
            "Return [] right away when root is None",
            "Then run the frozen-width loop as before"
          ],
          checks: [
            { input: "empty", output: "[]" },
            { input: "null root", output: "[]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="30" y="15" width="72" height="28" rx="9" class="st dsh"/><text x="66" y="29" text-anchor="middle" dominant-baseline="central" class="txd txs">None</text><path d="M106 29 L146 29" class="st-k"/><path d="M144 24 L152 29 L144 34" class="st-k"/><rect x="158" y="15" width="56" height="28" rx="9" class="st-k f5"/><text x="186" y="29" text-anchor="middle" dominant-baseline="central" class="txs">[]</text><text x="116" y="55" text-anchor="middle" dominant-baseline="central" class="txd txs">check before the queue</text></g></svg>`,
          tests: [
            "assert level_order(build_tree([])) == []",
            "assert level_order(None) == []"
          ],
          hint: "The None check belongs before deque([root]); once None is inside the queue, the loop will try to read its value." }
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


# Step 1: one node, one level.
def level_order(root):
    return [[root.val]]
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


# Step 2: the root's children make a second level.
def level_order(root):
    levels = [[root.val]]
    kids = []
    if root.left:
        kids.append(root.left.val)
    if root.right:
        kids.append(root.right.val)
    if kids:
        levels.append(kids)
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


# Step 3: a queue walk, cut into rows of 1, 2, 4, 8 values.
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


# Step 4: freeze the real width of each level.
def level_order(root):
    levels = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):    # how many nodes are on this level
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


# Step 5: guard the empty tree, then freeze each level's width.
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
      prompt: `Given a 2-D grid where "1" is land and "0" is water, return the number of islands: maximal groups of land connected up, down, left, or right, never diagonally. Each time your scan finds land that is still there, that is one more island.`,
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
        { text: "<strong>Count land cells when nothing touches.</strong> If no two land cells sit side by side, every single one is its own island. Walk the whole grid and tally the cells equal to 1.",
          moves: [
            "Visit every cell with two nested for loops",
            "Add one for each cell equal to 1",
            "Diagonal cells never connect, so the tally works here"
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
          hint: "A plain double loop over the rows and their cells is all this needs; it is only right while no two land cells touch." },
        { text: "<strong>Erase a strip of land once you count it.</strong> Land cells standing side by side in a row are one island. When the scan meets land, count one island and erase land to the right until water, so the scan never counts that strip again.",
          moves: [
            "When a cell is 1, add one island",
            "Erase cells to the right while they are still 1",
            "Islands that bend onto another row come later"
          ],
          checks: [
            { input: "1 1 0 / 0 0 0", output: "1" },
            { input: "1 0 1 1", output: "2" },
            { input: "1 1 0 0 / 0 0 1 1", output: "2" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><defs><marker id="ar-gr-2" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><g><rect x="70" y="8" width="24" height="20" rx="5" class="st f5"/><text x="82" y="18" text-anchor="middle" dominant-baseline="central">1</text><rect x="98" y="8" width="24" height="20" rx="5" class="st f5"/><text x="110" y="18" text-anchor="middle" dominant-baseline="central">1</text><rect x="126" y="8" width="24" height="20" rx="5" class="st f2"/><text x="138" y="18" text-anchor="middle" dominant-baseline="central">0</text><path d="M74 44 L118 44" class="st-k" marker-end="url(#ar-gr-2)"/><text x="116" y="60" text-anchor="middle" dominant-baseline="central" class="txd txs">one strip is one island: erase it all</text></g></svg>`,
          tests: [
            "assert num_islands([[\"1\", \"1\", \"0\"], [\"0\", \"0\", \"0\"]]) == 1",
            "assert num_islands([[\"1\", \"0\", \"1\", \"1\"]]) == 2",
            "assert num_islands([[\"1\", \"1\", \"0\", \"0\"], [\"0\", \"0\", \"1\", \"1\"]]) == 2"
          ],
          hint: "A while loop that moves a column index forward, writing 0 over each 1 it lands on, erases the whole strip in one go." },
        { text: "<strong>Spread down and right through connected land.</strong> Islands are not just strips: land also joins the cell below. From each counted cell, flood through land downward and to the right with a stack of cells to visit, erasing as you go.",
          moves: [
            "Start a stack holding the land cell you just counted",
            "Pop a cell; skip it if it is off the grid or water",
            "Otherwise erase it and push the cells below and right of it"
          ],
          checks: [
            { input: "1 1 0 0 / 0 1 1 0", output: "1" },
            { input: "1 0 0 / 1 1 0", output: "1" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="58" y="4" width="20" height="20" rx="3" class="st f5"/><text x="68" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="82" y="4" width="20" height="20" rx="3" class="st f5"/><text x="92" y="14" text-anchor="middle" dominant-baseline="central">1</text><rect x="106" y="4" width="20" height="20" rx="3" class="st f2"/><text x="116" y="14" text-anchor="middle" dominant-baseline="central">0</text><rect x="130" y="4" width="20" height="20" rx="3" class="st f2"/><text x="140" y="14" text-anchor="middle" dominant-baseline="central">0</text><rect x="58" y="28" width="20" height="20" rx="3" class="st f2"/><text x="68" y="38" text-anchor="middle" dominant-baseline="central">0</text><rect x="82" y="28" width="20" height="20" rx="3" class="st f5"/><text x="92" y="38" text-anchor="middle" dominant-baseline="central">1</text><rect x="106" y="28" width="20" height="20" rx="3" class="st f5"/><text x="116" y="38" text-anchor="middle" dominant-baseline="central">1</text><rect x="130" y="28" width="20" height="20" rx="3" class="st f2"/><text x="140" y="38" text-anchor="middle" dominant-baseline="central">0</text><text x="168" y="26" text-anchor="start" dominant-baseline="central" class="txd txs">spread</text><text x="168" y="38" text-anchor="start" dominant-baseline="central" class="txd txs">down and</text><text x="168" y="50" text-anchor="start" dominant-baseline="central" class="txd txs">right</text></g></svg>`,
          tests: [
            "assert num_islands([[\"1\", \"1\", \"0\", \"0\"], [\"0\", \"1\", \"1\", \"0\"]]) == 1",
            "assert num_islands([[\"1\", \"0\", \"0\"], [\"1\", \"1\", \"0\"]]) == 1"
          ],
          hint: "A plain list works as a stack: pop the last cell, check it, erase it, then push the cell below it and the cell to its right." },
        { text: "<strong>Flood in all four directions.</strong> Land can sit above or to the left of the cell you are on, and a down-and-right flood never reaches it. Recurse up, down, left, and right, stopping at the grid edge or on water.",
          moves: [
            "From each land cell, recurse to its four neighbors",
            "Stop at a row or column outside the grid, or on water",
            "Diagonal cells are never neighbors"
          ],
          checks: [
            { input: "0 1 0 / 1 1 0 / 0 0 0", output: "1" },
            { input: "1 0 0 / 0 1 0 / 0 0 0", output: "2" },
            { input: "11110 / 11010 / 11000 / 00000", output: "1" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="70" y="4" width="18" height="18" rx="3" class="st dsh"/><rect x="92" y="4" width="18" height="18" rx="3" class="st f5"/><rect x="114" y="4" width="18" height="18" rx="3" class="st dsh"/><rect x="70" y="24" width="18" height="18" rx="3" class="st f5"/><rect x="92" y="24" width="18" height="18" rx="3" class="st-k f5"/><rect x="114" y="24" width="18" height="18" rx="3" class="st f5"/><rect x="70" y="44" width="18" height="18" rx="3" class="st dsh"/><rect x="92" y="44" width="18" height="18" rx="3" class="st f5"/><rect x="114" y="44" width="18" height="18" rx="3" class="st dsh"/><text x="150" y="33" text-anchor="start" dominant-baseline="central" class="txd txs">four ways, never diagonal</text></g></svg>`,
          tests: [
            "assert num_islands([[\"0\", \"1\", \"0\"], [\"1\", \"1\", \"0\"], [\"0\", \"0\", \"0\"]]) == 1",
            "assert num_islands([[\"1\", \"0\", \"0\"], [\"0\", \"1\", \"0\"], [\"0\", \"0\", \"0\"]]) == 2",
            "assert num_islands([[\"1\", \"1\", \"1\", \"1\", \"0\"], [\"1\", \"1\", \"0\", \"1\", \"0\"], [\"1\", \"1\", \"0\", \"0\", \"0\"], [\"0\", \"0\", \"0\", \"0\", \"0\"]]) == 1"
          ],
          hint: "The recursive sink returns at once when r or c is outside the grid or the cell is water; then it erases the cell and calls itself four times." }
      ],
      steps: [
        `# Step 1: every land cell is its own island while nothing touches.
def num_islands(grid):
    count = 0
    for row in grid:
        for cell in row:
            if cell == "1":
                count += 1
    return count
`,
        `# Step 2: count a strip once by erasing land to the right.
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                cc = c
                while cc < cols and grid[r][cc] == "1":
                    grid[r][cc] = "0"      # erase the rest of the strip
                    cc += 1
    return count
`,
        `# Step 3: flood down and right through land with a stack.
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                stack = [(r, c)]
                while stack:
                    rr, cc = stack.pop()
                    if rr < 0 or rr >= rows or cc < 0 or cc >= cols or grid[rr][cc] != "1":
                        continue           # off the grid or not land
                    grid[rr][cc] = "0"
                    stack.append((rr + 1, cc))   # down
                    stack.append((rr, cc + 1))   # right
    return count
`,
        `# Step 4: flood in all four directions with recursion.
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
        { text: "<strong>One value has one arrangement.</strong> The answer is a list of arrangements, so even a single value comes back wrapped in its own inner list.",
          moves: [
            "Return a list holding one arrangement",
            "That arrangement is a list with the only value in it"
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
          hint: "The outer list holds every arrangement; the inner list is one arrangement. A bare 1 is not an arrangement yet." },
        { text: "<strong>Two values, two orders.</strong> Either value can come first and the other follows it. Loop over every value, put it in front, and collect one arrangement per first pick.",
          moves: [
            "Loop over every value as the first pick",
            "Put the other values after it, keeping their order",
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
          hint: "For each value, one arrangement is that value followed by the others. Three values have six orders, and this finds only three." },
        { text: "<strong>Let the function call itself on the leftovers.</strong> Three values have six orders, and nesting loops by hand stops scaling. Pick each value in turn, ask permute for every arrangement of the remaining values, and put your pick in front of each one.",
          moves: [
            "If one value is left, it has a single arrangement",
            "For each index, call permute on the list without it",
            "Put the picked value in front of every arrangement returned"
          ],
          checks: [
            { input: "[1,2,3]", output: "123 132 213 231 312 321" },
            { input: "[4,5,6]", output: "456 465 546 564 645 654" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><defs><marker id="ar-bt-3" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10 Z" class="mk"/></marker></defs><text x="116" y="10" text-anchor="middle" dominant-baseline="central" class="txd txs">pick 1, 2, or 3</text><path d="M116 22 L60 42" class="st-k" marker-end="url(#ar-bt-3)"/><path d="M116 22 L116 42" class="st-k" marker-end="url(#ar-bt-3)"/><path d="M116 22 L172 42" class="st-k" marker-end="url(#ar-bt-3)"/><rect x="38" y="44" width="44" height="18" rx="6" class="st f2"/><text x="60" y="53" text-anchor="middle" dominant-baseline="central" class="txs">1</text><rect x="94" y="44" width="44" height="18" rx="6" class="st f2"/><text x="116" y="53" text-anchor="middle" dominant-baseline="central" class="txs">2</text><rect x="150" y="44" width="44" height="18" rx="6" class="st f2"/><text x="172" y="53" text-anchor="middle" dominant-baseline="central" class="txs">3</text></g></svg>`,
          tests: [
            "assert sorted(permute([1, 2, 3])) == [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
            "assert sorted(permute([4, 5, 6])) == [[4, 5, 6], [4, 6, 5], [5, 4, 6], [5, 6, 4], [6, 4, 5], [6, 5, 4]]"
          ],
          hint: "nums[:i] + nums[i + 1:] is the list with index i removed. Three first picks, each with two tails, make all six." },
        { text: "<strong>The empty list still has one arrangement.</strong> A list with no values has exactly one order: the empty arrangement. Save the path whenever no values remain, and share one running path: append the choice, recurse, pop it back.",
          moves: [
            "When no values remain, save a copy of the path",
            "Otherwise append a value, recurse on the rest, then pop it",
            "The pop undoes the choice so the next pick starts clean"
          ],
          checks: [
            { input: "[]", output: "[[]]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><rect x="26" y="16" width="64" height="26" rx="7" class="st dsh"/><text x="58" y="29" text-anchor="middle" dominant-baseline="central" class="txd txs">nums empty</text><path d="M96 29 L138 29" class="st-k"/><path d="M136 24 L144 29 L136 34" class="st-k"/><rect x="150" y="12" width="66" height="34" rx="7" class="st-k f5"/><text x="183" y="29" text-anchor="middle" dominant-baseline="central" class="txs">[[]]</text><text x="116" y="56" text-anchor="middle" dominant-baseline="central" class="txd txs">one empty arrangement</text></g></svg>`,
          tests: [
            "assert permute([]) == [[]]",
            "assert sorted(permute([1, 2, 3])) == [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]"
          ],
          hint: "A base case that waits for one value skips the empty call entirely; only a no-values base case returns the empty arrangement." }
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
      prompt: `Given an integer list <code>nums</code> and an integer <code>k</code>, return the k most frequent values, most frequent first. Count with <a href="https://docs.python.org/3/library/collections.html#collections.Counter"><code>collections.Counter</code></a>, then work out which k values survive.`,
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
        { text: "<strong>Counting is the whole job while k covers everything.</strong> If k equals the number of distinct values, nothing gets dropped. Count with Counter, then list the distinct values in the order you first met them.",
          moves: [
            "Count the values with Counter(nums)",
            "List the distinct values in first-seen order",
            "This holds while the most frequent value also appeared first"
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
          hint: "list(Counter(nums)) hands back the distinct values in the order they first appeared." },
        { text: "<strong>Put the most frequent first.</strong> First-seen order is not frequency order. Sort the distinct values by their counts, largest count first.",
          moves: [
            "Sort the distinct values by count, largest first",
            "Use each value's count as its sort key",
            "Return every value while k still covers them all"
          ],
          checks: [
            { input: "[9,9,2,2,2,7], k=3", output: "[2,9,7]" },
            { input: "[1,1,2], k=2", output: "[1,2]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="12" y="13" text-anchor="start" dominant-baseline="central" class="txd txs">2</text><rect x="30" y="6" width="66" height="14" rx="4" class="st f5"/><text x="102" y="13" text-anchor="start" dominant-baseline="central" class="txd txs">3</text><text x="12" y="33" text-anchor="start" dominant-baseline="central" class="txd txs">9</text><rect x="30" y="26" width="44" height="14" rx="4" class="st f2"/><text x="80" y="33" text-anchor="start" dominant-baseline="central" class="txd txs">2</text><text x="12" y="53" text-anchor="start" dominant-baseline="central" class="txd txs">7</text><rect x="30" y="46" width="22" height="14" rx="4" class="st f2"/><text x="58" y="53" text-anchor="start" dominant-baseline="central" class="txd txs">1</text><text x="150" y="27" text-anchor="start" dominant-baseline="central" class="txd txs">tallest</text><text x="150" y="39" text-anchor="start" dominant-baseline="central" class="txd txs">first</text></g></svg>`,
          tests: [
            "assert top_k_frequent([9, 9, 2, 2, 2, 7], 3) == [2, 9, 7]",
            "assert top_k_frequent([1, 1, 2], 2) == [1, 2]"
          ],
          hint: "counts.get is the function that fetches a value's count; hand it to sorted as the key with reverse=True." },
        { text: "<strong>Pick the best, delete it, repeat.</strong> A smaller k means most values do not survive. Instead of ordering everything, repeat k times: take the value with the largest count, then delete it so the next pick is different.",
          moves: [
            "Repeat k times: find the value with the largest count",
            "Append it to the answer and delete it from the counts",
            "No sorting anywhere, just k picks"
          ],
          checks: [
            { input: "[1,1,1,2,2,3], k=2", output: "[1,2]" },
            { input: "[7,1,1,3,3,3], k=1", output: "[3]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="12" y="13" text-anchor="start" dominant-baseline="central" class="txd txs">1</text><rect x="30" y="6" width="66" height="14" rx="4" class="st-k f5"/><text x="102" y="13" text-anchor="start" dominant-baseline="central" class="txd txs">3</text><text x="12" y="33" text-anchor="start" dominant-baseline="central" class="txd txs">2</text><rect x="30" y="26" width="44" height="14" rx="4" class="st f2"/><text x="80" y="33" text-anchor="start" dominant-baseline="central" class="txd txs">2</text><text x="12" y="53" text-anchor="start" dominant-baseline="central" class="txd txs">3</text><rect x="30" y="46" width="22" height="14" rx="4" class="st f2"/><text x="58" y="53" text-anchor="start" dominant-baseline="central" class="txd txs">1</text><text x="148" y="21" text-anchor="start" dominant-baseline="central" class="txd txs">take 1,</text><text x="148" y="33" text-anchor="start" dominant-baseline="central" class="txd txs">remove it,</text><text x="148" y="45" text-anchor="start" dominant-baseline="central" class="txd txs">repeat</text></g></svg>`,
          tests: [
            "assert top_k_frequent([1, 1, 1, 2, 2, 3], 2) == [1, 2]",
            "assert top_k_frequent([7, 1, 1, 3, 3, 3], 1) == [3]"
          ],
          hint: "max(counts, key=counts.get) names the most frequent value left; del counts[value] removes it before the next pick." },
        { text: "<strong>Keep a heap of only k pairs.</strong> Repeated max rescans all the counts on every pick. Push each (count, value) pair into a heap; the moment it holds more than k pairs, pop the smallest one out. Sort the survivors and keep their values.",
          moves: [
            "Push a (count, value) pair for every distinct value",
            "Whenever the heap grows past k, pop the smallest pair",
            "Sort the survivors, largest first, and keep their values"
          ],
          checks: [
            { input: "[4,4,6,6,8,8], k=2", output: "[8,6]" },
            { input: "[1,1,1,2,2,3], k=2", output: "[1,2]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="12" y="12" text-anchor="start" dominant-baseline="central" class="txd txs">4</text><rect x="34" y="5" width="44" height="13" rx="4" class="st f2"/><text x="12" y="30" text-anchor="start" dominant-baseline="central" class="txd txs">6</text><rect x="34" y="23" width="44" height="13" rx="4" class="st f2"/><text x="12" y="48" text-anchor="start" dominant-baseline="central" class="txd txs">8</text><rect x="34" y="41" width="44" height="13" rx="4" class="st-k f5"/><text x="96" y="22" text-anchor="start" dominant-baseline="central" class="txd txs">all count 2</text><text x="96" y="42" text-anchor="start" dominant-baseline="central" class="txd txs">k=2 keeps 8, 6</text></g></svg>`,
          tests: [
            "assert top_k_frequent([4, 4, 6, 6, 8, 8], 2) == [8, 6]",
            "assert top_k_frequent([1, 1, 1, 2, 2, 3], 2) == [1, 2]"
          ],
          hint: "The heap compares whole pairs, so among equal counts the smaller value counts as the smaller pair and leaves first." }
      ],
      steps: [
        `from collections import Counter


# Step 1: k covers every distinct value, so list them as counted.
def top_k_frequent(nums, k):
    counts = Counter(nums)
    return list(counts)
`,
        `from collections import Counter


# Step 2: order the distinct values by count, largest first.
def top_k_frequent(nums, k):
    counts = Counter(nums)
    return sorted(counts, key=counts.get, reverse=True)
`,
        `from collections import Counter


# Step 3: pick the most frequent value k times, deleting each pick.
def top_k_frequent(nums, k):
    counts = Counter(nums)
    result = []
    for _ in range(k):
        best = max(counts, key=counts.get)
        result.append(best)
        del counts[best]
    return result
`,
        `from collections import Counter
import heapq


# Step 4: a min-heap of (count, value) pairs keeps only the best k.
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
        { text: "<strong>Put the blocks in order.</strong> The answer must come out sorted by start. When no two blocks overlap, sorting is the entire job: copy every block in order.",
          moves: [
            "Sort the intervals by start with sorted()",
            "Copy every block into the answer unchanged",
            "The input order does not matter; the answer order does"
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
          hint: "sorted(intervals) orders pairs by first number, then second. Copy each pair as a fresh list." },
        { text: "<strong>Join the next block to the last one you kept.</strong> Sorted order makes the last kept block the only one that can overlap what comes next. When the next block starts at or before that block's end, they cover one stretch: extend the end to the larger of the two ends.",
          moves: [
            "Compare the next start with the last kept end",
            "At or before it means one stretch: extend to the larger end",
            "Otherwise append the block as a new one"
          ],
          checks: [
            { input: "[1,3] [2,6] [8,10] [15,18]", output: "[1,6] [8,10] [15,18]" },
            { input: "[2,6] [1,3]", output: "[1,6]" },
            { input: "[1,4] [2,3]", output: "[1,4]" },
            { input: "[1,4] [4,5]", output: "[1,5]" }
          ],
          diagram: `<svg viewBox="0 0 232 62" aria-hidden="true" focusable="false"><g><text x="52" y="12" text-anchor="end" dominant-baseline="central" class="txd txs">[1,3]</text><rect x="82" y="5" width="44" height="13" rx="4" class="st f2"/><text x="52" y="28" text-anchor="end" dominant-baseline="central" class="txd txs">[2,6]</text><rect x="104" y="21" width="88" height="13" rx="4" class="st f2"/><text x="52" y="50" text-anchor="end" dominant-baseline="central" class="txd txs">[1,6]</text><rect x="82" y="43" width="110" height="13" rx="4" class="st-k f5"/><path d="M148 36 L148 41" class="st-k"/></g></svg>`,
          tests: [
            "assert merge([[1, 3], [2, 6], [8, 10], [15, 18]]) == [[1, 6], [8, 10], [15, 18]]",
            "assert merge([[2, 6], [1, 3]]) == [[1, 6]]",
            "assert merge([[1, 4], [2, 3]]) == [[1, 4]]",
            "assert merge([[1, 4], [4, 5]]) == [[1, 5]]"
          ],
          hint: "Compare with the last block in the answer, not the previous input pair, and extend with max so nothing shrinks." },
        { text: "<strong>Handle an empty list without a first block.</strong> Seeding the answer with the first sorted block crashes when there is no input at all. Start the answer empty and let the loop append the first block itself.",
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
        `# Step 2: join a block to the last kept one when they cover one stretch.
def merge(intervals):
    ordered = sorted(intervals)
    merged = [ordered[0][:]]
    for start, end in ordered[1:]:
        if start <= merged[-1][1]:          # touches or overlaps
            merged[-1][1] = max(merged[-1][1], end)   # reach further
        else:
            merged.append([start, end])     # a gap: a new block
    return merged
`,
        `# Step 3: start empty so an empty input needs no first block.
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
