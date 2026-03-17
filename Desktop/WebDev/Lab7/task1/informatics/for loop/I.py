x = int(input())
cnt = 0
for i in range(1, int(x**0.5) + 1):
    if x % i == 0:
        if i == x // i:
            cnt += 1
        else:
            cnt += 2
print(cnt)