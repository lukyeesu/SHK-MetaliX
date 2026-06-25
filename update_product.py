import re

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Product Module Replacement
content = content.replace(
    '<div className="overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50/50 border-b border-slate-100">',
    '<div className="hidden md:block overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50/50 border-b border-slate-100">',
)

old_end = '''            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredProducts.length && (
            <div id="scroll-sentinel-product"'''

new_end = '''            </table>
          </div>
          <MobileCardView 
            data={!isFetchingTable ? filteredProducts.slice(0, visibleCount) : []}
            keyField="id"
            onClick={(p) => openModal(p, true)}
            emptyText="ไม่พบรายการสินค้า"
            renderHeader={(p) => (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-sky-600 text-[15px] font-mono-code tracking-wide">{p.id}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap bg-indigo-50 text-indigo-600 border border-indigo-100">{p.category}</span>
                </div>
                <div className="text-right whitespace-nowrap shrink-0 ml-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {p.status === 'Active' ? '✔ ใช้งาน' : 'ยกเลิก'}
                  </span>
                </div>
              </>
            )}
            renderTitle={(p) => (
              <h4 className="font-bold text-slate-800 text-[16px] leading-tight">{p.name}</h4>
            )}
            renderFields={(p) => [
              { icon: <CircleDollarSign className="w-3.5 h-3.5" />, label: 'ราคารับซื้อ', value: p.buyPrice ? `${Number(p.buyPrice).toLocaleString()} ฿ / ${p.unit}` : '-' }
            ]}
            renderActions={(p) => (
              <>
                <button onClick={() => openModal(p, true)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors font-medium text-xs"><Info className="w-4 h-4" /> ดูข้อมูล</button>
                <button onClick={() => openModal(p, false)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 rounded-xl transition-colors font-medium text-xs"><Edit className="w-4 h-4" /> แก้ไข</button>
                <button onClick={() => setConfirmDelete({ isOpen: true, id: p.id })} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors font-medium text-xs"><Trash2 className="w-4 h-4" /> ลบ</button>
              </>
            )}
          />
          {!isFetchingTable && visibleCount < filteredProducts.length && (
            <div id="scroll-sentinel-product"'''

content = content.replace(old_end, new_end)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated ProductModule')
