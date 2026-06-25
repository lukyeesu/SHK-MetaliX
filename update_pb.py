with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace pb-10 with pb-[100px] md:pb-10 on all modules wrappers
content = content.replace(
    'className="flex flex-col font-body pb-10 w-full gap-4 md:gap-5"',
    'className="flex flex-col font-body pb-[100px] md:pb-10 w-full gap-4 md:gap-5"'
)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated padding bottom')
