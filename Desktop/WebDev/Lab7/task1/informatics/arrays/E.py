n = int(input())
arr = list(map(int, input().split()))
found = False
for i in range(1, n):
    if arr[i] * arr[i - 1] > 0:
        found = True
        break
if found:
    print('YES')
else:
    print('NO')