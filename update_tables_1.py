import re

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# ----------------------------------------------------
# 1. DailyPriceModule
# ----------------------------------------------------
content = content.replace(
    '<div className="overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">\n              <thead className="bg-slate-50 border-b border-slate-100">',
    '<div className="hidden md:block overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">\n              <thead className="bg-slate-50 border-b border-slate-100">'
)

old_end_dp = '''            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredHistory.length && (
            <div id="scroll-sentinel-price"'''

new_end_dp = '''            </table>
          </div>
          <MobileCardView 
            data={!isFetchingTable ? filteredHistory.slice(0, visibleCount) : []}
            keyField="id"
            onClick={(entry) => openModal(entry, true)}
            emptyText="ไม่พบประวัติราคารับซื้อ"
            renderHeader={(entry) => (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-sky-600 text-[15px] font-mono-code tracking-wide">{entry.id}</span>
                </div>
                <div className="text-right whitespace-nowrap shrink-0 ml-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">
                    {formatDateTh(entry.date)}
                  </span>
                </div>
              </>
            )}
            renderTitle={(entry) => (
              <h4 className="font-bold text-slate-800 text-[16px] leading-tight">อัปเดตราคา {entry.items?.length || 0} รายการ</h4>
            )}
            renderFields={(entry) => []}
            renderActions={(entry) => (
              <>
                <button onClick={() => openModal(entry, true)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors font-medium text-xs"><Info className="w-4 h-4" /> ดูข้อมูล</button>
                <button onClick={() => openModal(entry, false)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 rounded-xl transition-colors font-medium text-xs"><Edit className="w-4 h-4" /> แก้ไข</button>
                <button onClick={() => setConfirmDelete({ isOpen: true, id: entry.id })} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors font-medium text-xs"><Trash2 className="w-4 h-4" /> ลบ</button>
              </>
            )}
          />
          {!isFetchingTable && visibleCount < filteredHistory.length && (
            <div id="scroll-sentinel-price"'''

content = content.replace(old_end_dp, new_end_dp)

# ----------------------------------------------------
# 2. LockWeightModule
# ----------------------------------------------------
content = content.replace(
    '<div className="overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">\n              <thead className="bg-slate-50 border-b border-slate-100">',
    '<div className="hidden md:block overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">\n              <thead className="bg-slate-50 border-b border-slate-100">'
)

old_end_lw = '''            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredLocks.length && (
            <div id="scroll-sentinel-lock"'''

new_end_lw = '''            </table>
          </div>
          <MobileCardView 
            data={!isFetchingTable ? filteredLocks.slice(0, visibleCount) : []}
            keyField="id"
            onClick={(lock) => openModal(lock, true)}
            emptyText="ไม่พบประวัติโควตาน้ำหนัก"
            renderHeader={(lock) => (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-sky-600 text-[15px] font-mono-code tracking-wide">{lock.id}</span>
                </div>
                <div className="text-right whitespace-nowrap shrink-0 ml-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">
                    {formatDateTh(lock.date)}
                  </span>
                </div>
              </>
            )}
            renderTitle={(lock) => (
              <h4 className="font-bold text-slate-800 text-[15px] leading-tight">{lock.note || 'ไม่มีหมายเหตุ'}</h4>
            )}
            renderFields={(lock) => {
              const lockDateStr = lock.date ? lock.date.split('T')[0] : '';
              const totalQuotaRow = Number(lock.dailyLimitKg) || 0;
              const usedQuotaRow = (stockData || [])
                .filter(s => s.quotaId ? (s.quotaId === lock.id) : (s.quotaDate === lockDateStr || (!s.quotaDate && (s.date || '').startsWith(lockDateStr))))
                .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
              const remainingQuotaRow = totalQuotaRow - usedQuotaRow;
              return [
                { icon: <Lock className="w-3.5 h-3.5" />, label: 'โควตารวม', value: `${totalQuotaRow.toLocaleString()} ${lock.dailyLimitUnit || 'Kg.'}` },
                { icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'ตัดโควตาแล้ว', value: `${usedQuotaRow.toLocaleString()} ${lock.dailyLimitUnit || 'Kg.'}` },
                { icon: <Info className="w-3.5 h-3.5" />, label: 'คงเหลือ', value: `${remainingQuotaRow.toLocaleString()} ${lock.dailyLimitUnit || 'Kg.'}` }
              ];
            }}
            renderActions={(lock) => (
              <>
                <button onClick={() => openModal(lock, true)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors font-medium text-xs"><Info className="w-4 h-4" /> ดูข้อมูล</button>
                <button onClick={() => openModal(lock, false)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 rounded-xl transition-colors font-medium text-xs"><Edit className="w-4 h-4" /> แก้ไข</button>
                <button onClick={() => {
                  const associatedStocks = (stockData || []).filter(s => {
                     if (s.quotaId === lock.id) return true;
                     if ((s.id || '').startsWith('TRANSF-')) {
                        const parts = s.id.split('-');
                        if (parts.length >= 4) {
                           const ts = parts[1];
                           return (stockData || []).some(ps => (ps.id || '').startsWith(`TRANSF-${ts}-`) && ps.quotaId === lock.id);
                        }
                     }
                     return false;
                  });
                  setConfirmDelete({ isOpen: true, id: lock.id, data: associatedStocks });
                }} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors font-medium text-xs"><Trash2 className="w-4 h-4" /> ลบ</button>
              </>
            )}
          />
          {!isFetchingTable && visibleCount < filteredLocks.length && (
            <div id="scroll-sentinel-lock"'''

content = content.replace(old_end_lw, new_end_lw)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated DailyPriceModule and LockWeightModule')
