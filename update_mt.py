with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove mt-4 from MobileCardView wrapper
content = content.replace(
    'className="md:hidden space-y-4 mt-4 w-full"',
    'className="md:hidden space-y-4 w-full"'
)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Removed mt-4 from MobileCardView wrappers')
