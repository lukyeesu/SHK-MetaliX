with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the height of the sticky filter wrapper so the gaps become even
content = content.replace(
    'className="w-full mx-auto pointer-events-none relative h-[56px] z-50"',
    'className="w-full mx-auto pointer-events-none relative h-[68px] z-50"'
)

# And what about the alignment? Did the user mean the filter doesn't align with the table in desktop?
# On desktop, the filter is width: calc(100% - 4rem). Which is exactly the same as px-8 on both sides.
# But wait! If the filter is width: calc(100% - 4rem), it is 100% - 64px.
# The table wrapper has px-8, so it is 100% - 64px.
# Wait, the table wrapper has px-4 md:px-8. The filter has calc(100% - 2rem) which is 32px, matching px-4.
# Everything is mathematically identical. 
# Why did they say "แท็บ filter ไม่เท่ากันกับตาราง" ? 
# Oh! Because the filter has border-radius 1.5rem (24px). The cards might have border-radius 24px.
# But what if the table has no border-radius? 
# Wait, the table wrapper on desktop is: md:bg-white md:rounded-[24px].
# But I changed the MobileCardView to have `max-w-xl mx-auto`.
# Let's remove `max-w-xl mx-auto` from MobileCardView just in case it caused issues on some devices.
content = content.replace(
    'className="md:hidden space-y-4 mt-4 w-full mx-auto max-w-xl"',
    'className="md:hidden space-y-4 mt-4 w-full"'
)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated gaps and width')
