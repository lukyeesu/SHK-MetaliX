import re

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Customer Module Replacement
content = content.replace(
    '<div className="overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50/50 border-b border-slate-100">',
    '<div className="hidden md:block overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50/50 border-b border-slate-100">',
)

old_end = '''            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredCustomers.length && (
            <div id="scroll-sentinel-customer"'''

new_end = '''            </table>
          </div>
          <MobileCardView 
            data={!isFetchingTable ? filteredCustomers.slice(0, visibleCount) : []}
            keyField="id"
            onClick={(c) => openModal(c, true)}
            emptyText="ไม่พบข้อมูลลูกค้าในระบบ"
            renderHeader={(c) => (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-sky-600 text-[15px] font-mono-code tracking-wide">{c.id}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap bg-indigo-50 text-indigo-600 border border-indigo-100">{c.type === 'Regular' ? 'ลูกค้าทั่วไป' : c.type}</span>
                </div>
                <div className="text-right whitespace-nowrap shrink-0 ml-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {c.status === 'Active' ? '✔ ยินยอม' : 'ระงับข้อมูล'}
                  </span>
                </div>
              </>
            )}
            renderTitle={(c) => (
              <>
                <h4 className="font-bold text-slate-800 text-[16px] leading-tight">{c.name}</h4>
                <div className="mt-1.5">
                  <a href={`tel:${c.phone}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-sky-600 font-medium text-[11px] bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit transition-colors">
                    <Phone className="w-3.5 h-3.5 text-sky-500" /> {c.phone || 'ไม่มีเบอร์โทร'}
                  </a>
                </div>
              </>
            )}
            renderFields={(c) => []}
            renderActions={(c) => (
              <>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors font-medium text-xs"><Printer className="w-4 h-4" /> พิมพ์</button>
                <button onClick={() => openModal(c, false)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 rounded-xl transition-colors font-medium text-xs"><Edit className="w-4 h-4" /> แก้ไข</button>
                <button onClick={() => setConfirmDelete({ isOpen: true, id: c.id })} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors font-medium text-xs"><Trash2 className="w-4 h-4" /> ลบ</button>
              </>
            )}
          />
          {!isFetchingTable && visibleCount < filteredCustomers.length && (
            <div id="scroll-sentinel-customer"'''

content = content.replace(old_end, new_end)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated CustomerModule')
