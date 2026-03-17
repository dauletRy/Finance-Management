def power(a, n):
    result = 1.0
    for _ in range(n):
        result *= a
    return result

a, n = map(float, input().split())
n = int(n)
print(power(a, n))