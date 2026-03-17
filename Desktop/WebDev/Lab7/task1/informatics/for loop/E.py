a = int(input())
b = 0
while a > 0:
    b += a % 10
    a //= 10
print(b)