# answer[i] = days until a strictly warmer day, or 0 if none comes.
def daily_temperatures(temps):
    answer = [0] * len(temps)
    stack = []                    # indices, decreasing temperatures
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()       # j finally sees a warmer day
            answer[j] = i - j
        stack.append(i)
    return answer

# ---- tests ----
assert daily_temperatures([73, 74, 75, 71, 69, 72, 76, 73]) == [1, 1, 4, 2, 1, 1, 0, 0]
assert daily_temperatures([30, 40, 50, 60]) == [1, 1, 1, 0]
assert daily_temperatures([30, 60, 90]) == [1, 1, 0]
assert daily_temperatures([90, 80, 70]) == [0, 0, 0]
assert daily_temperatures([55]) == [0]
print("All tests passed!")
