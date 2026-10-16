export const CHEATSHEET = {
  bigO: [
    { op: "list.append(x)", complexity: "O(1)", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "list.pop()", complexity: "O(1)", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "list.insert(i, x)", complexity: "O(n)", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "list.index(x)", complexity: "O(n)", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "dict get/set d[k]", complexity: "O(1) avg", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "k in dict", complexity: "O(1) avg", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "set.add(x)", complexity: "O(1) avg", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "x in set", complexity: "O(1) avg", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "deque.appendleft/popleft", complexity: "O(1)", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "heapq.heappush(h, x)", complexity: "O(log n)", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "heapq.heappop(h)", complexity: "O(log n)", url: "https://wiki.python.org/moin/TimeComplexity" },
    { op: "sorted(a) / a.sort()", complexity: "O(n log n)", url: "https://wiki.python.org/moin/TimeComplexity" }
  ],
  weapons: [
    { name: "Counter", what: "Tally hashable items; most_common(k) gives the top k.", url: "https://docs.python.org/3/library/collections.html#collections.Counter" },
    { name: "defaultdict", what: "dict that builds missing keys itself, e.g. defaultdict(list).", url: "https://docs.python.org/3/library/collections.html#collections.defaultdict" },
    { name: "deque", what: "Double-ended queue; O(1) pushes and pops at both ends.", url: "https://docs.python.org/3/library/collections.html#collections.deque" },
    { name: "heappush", what: "Push an item onto a min-heap; pair with heappop for queues.", url: "https://docs.python.org/3/library/heapq.html" },
    { name: "nlargest", what: "heapq.nlargest(k, xs) returns the top k without a full sort.", url: "https://docs.python.org/3/library/heapq.html" },
    { name: "bisect_left", what: "Binary search a sorted list for an insert point in O(log n).", url: "https://docs.python.org/3/library/bisect.html" },
    { name: "sorted(key=)", what: "sorted(xs, key=fn, reverse=True) orders anything your way.", url: "https://docs.python.org/3/library/functions.html#sorted" },
    { name: "enumerate", what: "Yields (index, item) pairs; kills range(len(xs)).", url: "https://docs.python.org/3/library/functions.html#enumerate" },
    { name: "zip", what: "Walks two or more sequences in lockstep as tuples.", url: "https://docs.python.org/3/library/functions.html#zip" },
    { name: "lru_cache", what: "@lru_cache memoizes calls; turns recursion into DP for free.", url: "https://docs.python.org/3/library/functools.html#functools.lru_cache" },
    { name: "permutations", what: "All ordered arrangements; factorial growth, keep n small.", url: "https://docs.python.org/3/library/itertools.html" },
    { name: "combinations", what: "All unordered r-element subsets; the subsets template.", url: "https://docs.python.org/3/library/itertools.html" },
    { name: "accumulate", what: "Running totals (or any op) across an iterable, lazily.", url: "https://docs.python.org/3/library/itertools.html" },
    { name: "gcd", what: "math.gcd(a, b): greatest common divisor, exact integers.", url: "https://docs.python.org/3/library/math.html#math.gcd" }
  ],
  signals: [
    { signal: "Count, group, or dedupe values as you stream through them", pattern: "Hash Map", href: "#/section/hashing" },
    { signal: "Sorted input; find a pair summing to a target", pattern: "Two Pointers", href: "#/section/two-pointers" },
    { signal: "Longest or shortest subarray/substring meeting a bound", pattern: "Sliding Window", href: "#/section/sliding-window" },
    { signal: "Sorted data or monotonic answer space; minimum x such that", pattern: "Binary Search", href: "#/section/binary-search" },
    { signal: "Nodes joined by .next; reverse, merge, or find the middle", pattern: "Linked Lists", href: "#/section/linked-lists" },
    { signal: "Most recent unmatched item; nested or bracket structure", pattern: "Stack", href: "#/section/stacks" },
    { signal: "Root with children; traverse, search, or compute depth", pattern: "Trees (DFS/BFS)", href: "#/section/trees" },
    { signal: "Grid or adjacency list; reachability or shortest path", pattern: "Graphs (BFS/DFS)", href: "#/section/graphs" },
    { signal: "Build candidates and undo; all possible combinations", pattern: "Backtracking", href: "#/section/backtracking" },
    { signal: "Repeatedly take the extreme of a changing set", pattern: "Heap", href: "#/section/heaps" },
    { signal: "Start and end pairs; overlaps, merges, meeting rooms", pattern: "Intervals", href: "#/section/intervals" },
    { signal: "Best value at step i depends on earlier steps only", pattern: "1D DP", href: "#/section/dp-1d" },
    { signal: "Two strings or a grid; table[i][j] subproblems", pattern: "2D DP", href: "#/section/dp-2d" },
    { signal: "Several signals fire at once, or none do; practice timed", pattern: "Putting It Together", href: "#/section/final" }
  ]
};
