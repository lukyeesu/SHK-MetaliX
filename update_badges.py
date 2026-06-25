with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Date pills
content = content.replace(
    'className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200"',
    'className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold border bg-slate-50 text-slate-600 border-slate-200 shadow-sm"'
)

# Status pills
content = content.replace(
    'text-[10px] font-bold whitespace-nowrap bg-indigo-50 text-indigo-600 border border-indigo-100"',
    'text-[12px] font-bold whitespace-nowrap bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm px-2.5 py-1"'
)

content = content.replace(
    'text-[10px] font-bold border ${c.status === \'Active\' ? \'bg-emerald-50 text-emerald-600 border-emerald-200\' : \'bg-slate-50 text-slate-500 border-slate-200\'}`}',
    'text-[12px] font-bold border shadow-sm px-2.5 py-1 ${c.status === \'Active\' ? \'bg-emerald-50 text-emerald-600 border-emerald-200\' : \'bg-slate-50 text-slate-500 border-slate-200\'}`}'
)

content = content.replace(
    'text-[10px] font-bold border ${p.status === \'Active\' ? \'bg-emerald-50 text-emerald-600 border-emerald-200\' : \'bg-slate-50 text-slate-500 border-slate-200\'}`}',
    'text-[12px] font-bold border shadow-sm px-2.5 py-1 ${p.status === \'Active\' ? \'bg-emerald-50 text-emerald-600 border-emerald-200\' : \'bg-slate-50 text-slate-500 border-slate-200\'}`}'
)

content = content.replace(
    'text-[10px] font-bold whitespace-nowrap border ${typeColor}`}',
    'text-[12px] font-bold whitespace-nowrap border shadow-sm px-2.5 py-1 ${typeColor}`}'
)

content = content.replace(
    'text-[10px] font-bold whitespace-nowrap border ${b.type === \'BUY\' ? \'bg-sky-50 text-sky-600 border-sky-100\' : \'bg-emerald-50 text-emerald-600 border-emerald-100\'}`}',
    'text-[12px] font-bold whitespace-nowrap border shadow-sm px-2.5 py-1 ${b.type === \'BUY\' ? \'bg-sky-50 text-sky-600 border-sky-100\' : \'bg-emerald-50 text-emerald-600 border-emerald-100\'}`}'
)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated pill sizes')
