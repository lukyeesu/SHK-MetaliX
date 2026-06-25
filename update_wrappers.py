with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the outer wrapper classes to be md: prefixed, so on mobile it blends into the background
old_class = 'className="bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden"'
new_class = 'className="md:bg-white md:rounded-[24px] md:border md:border-slate-100/60 md:shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden"'

content = content.replace(old_class, new_class)

# Also fix MobileCardView padding/margin. Since the outer wrapper is now transparent on mobile,
# MobileCardView doesn't need mt-4 if we just give it normal spacing.
# Actually, mt-4 is fine to separate from filter. Let's just keep it, or make it w-full mx-auto max-w-lg
# Wait, the cards are already w-full. 
# Let's change MobileCardView to have max-w-xl mx-auto so it doesn't stretch too wide on tablets.
content = content.replace(
    'className="md:hidden space-y-4 mt-4"',
    'className="md:hidden space-y-4 mt-4 w-full mx-auto max-w-xl"'
)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated outer wrapper classes')
