from collections import deque

d = deque()

n = int(input())

for _ in range(n):
    cmd_line = input().split()
    cmd = cmd_line[0]
    
    if len(cmd_line) == 2:
        arg = int(cmd_line[1])
        getattr(d, cmd)(arg)
    else:
        getattr(d, cmd)()

print(*d)