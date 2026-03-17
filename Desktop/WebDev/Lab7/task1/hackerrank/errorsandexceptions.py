n = int(input())

for _ in range(n):
    try:
        a, b = input().split()
        a = int(a)
        b = int(b)
        print(a // b)
    except (ZeroDivisionError, ValueError) as e:
        print("Error Code:", e)