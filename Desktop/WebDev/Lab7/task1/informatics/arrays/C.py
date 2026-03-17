n = int(input())
arr = list(map(int, input().split()))
count = 0
for elem in arr:
    if elem > 0:
        count += 1
print(count)