n = int(input())
arr = list(map(int, input().split()))
arr[:] = arr[::-1]
print(*arr)