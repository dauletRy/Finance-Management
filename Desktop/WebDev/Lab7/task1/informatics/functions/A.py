def min4(a, b, c, d):
    return min(a, b, c, d)

nums = list(map(int, input().split()))
print(min4(*nums))