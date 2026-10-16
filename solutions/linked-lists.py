class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build_list(values):
    head = None
    for value in reversed(values):
        head = ListNode(value, head)
    return head


def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


# Reorder L0, L1, ..., Ln into L0, Ln, L1, Ln-1, ... in place; return the head.
def reorder_list(head):
    if not head or not head.next:      # nothing to reorder
        return head

    slow, fast = head, head.next       # slow stops before the middle
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next

    second, slow.next = slow.next, None
    prev = None                        # reverse the back half
    while second:
        second.next, prev, second = prev, second, second.next

    first, second = head, prev         # weave, one node from each half
    while second:
        nxt1, nxt2 = first.next, second.next
        first.next, second.next = second, nxt1
        first, second = nxt1, nxt2
    return head

# ---- tests ----
assert to_list(reorder_list(build_list([1, 2, 3, 4]))) == [1, 4, 2, 3]
assert to_list(reorder_list(build_list([1, 2, 3, 4, 5]))) == [1, 5, 2, 4, 3]
assert to_list(reorder_list(build_list([1, 2]))) == [1, 2]
assert to_list(reorder_list(build_list([1]))) == [1]
assert to_list(reorder_list(build_list([]))) == []
print("All tests passed!")
