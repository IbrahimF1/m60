# Count islands: "1" is land, "0" is water, connections are up/down/left/right
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

# ---- tests ----
assert num_islands([["1", "1", "1", "1", "0"], ["1", "1", "0", "1", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "0", "0", "0"]]) == 1
assert num_islands([["1", "1", "0", "0", "0"], ["1", "1", "0", "0", "0"], ["0", "0", "1", "0", "0"], ["0", "0", "0", "1", "1"]]) == 3
assert num_islands([["0"]]) == 0
assert num_islands([["1"]]) == 1
assert num_islands([["1", "0", "1", "0", "1"]]) == 3
print("All tests passed!")
