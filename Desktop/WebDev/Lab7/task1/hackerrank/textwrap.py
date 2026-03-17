import textwrap

def wrap(string, max_width):
    wrapped_lines = textwrap.wrap(string, max_width)
    return "\n".join(wrapped_lines)

s = input()
w = int(input())
print(wrap(s, w))