from collections import deque


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

# ---- tests ----
assert level_order(build_tree([3, 9, 20, None, None, 15, 7])) == [[3], [9, 20], [15, 7]]
assert level_order(build_tree([1])) == [[1]]
assert level_order(build_tree([1, 2, 3, 4, None, None, 5])) == [[1], [2, 3], [4, 5]]
assert level_order(build_tree([])) == []
assert level_order(None) == []
print("All tests passed!")
