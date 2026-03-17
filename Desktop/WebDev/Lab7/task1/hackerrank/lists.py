my_list = []

n = int(input())

for _ in range(n):
    cmd_line = input().split()
    cmd = cmd_line[0]
    
    args = list(map(int, cmd_line[1:]))
    
    if cmd == "print":
        print(my_list)
    elif cmd == "insert":
        my_list.insert(args[0], args[1])
    elif cmd == "remove":
        my_list.remove(args[0])
    elif cmd == "append":
        my_list.append(args[0])
    elif cmd == "sort":
        my_list.sort()
    elif cmd == "pop":
        my_list.pop()
    elif cmd == "reverse":
        my_list.reverse()