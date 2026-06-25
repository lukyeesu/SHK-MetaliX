import re

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# ----------------------------------------------------
# 3. StockModule
# ----------------------------------------------------
content = content.replace(
    '<div className="overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50 border-b border-slate-100">',
    '<div className="hidden md:block overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50 border-b border-slate-100">'
)

old_end_st = '''            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredStocks.length && (
            <div id="scroll-sentinel-stock"'''

new_end_st = '''            </table>
          </div>
          <MobileCardView 
            data={!isFetchingTable ? filteredStocks.slice(0, visibleCount) : []}
            keyField="id"
            onClick={(s) => openModal(s, true)}
            emptyText="ไม่พบประวัติสต๊อกสินค้า"
            renderHeader={(s) => {
              const isPositive = Number(s.quantity) > 0;
              const isNegative = Number(s.quantity) < 0;
              const isTransferByNote = s.note && (s.note.includes('โอนยอด') || s.note.includes('รับยอด'));
              const isTransferById = s.id && String(s.id).startsWith('TRANSF-');
              const isTransfer = isTransferByNote || isTransferById;
              const typeLabel = isTransfer ? (isPositive ? 'รับยอด' : 'โอนยอด') : (isPositive ? 'รับซื้อ (จ่าย)' : isNegative ? 'ขายออก (รับ)' : 'ปรับปรุงสต๊อก');
              const typeColor = isTransfer ? 'bg-amber-50 text-amber-600 border-amber-100' : isPositive ? 'bg-sky-50 text-sky-600 border-sky-100' : isNegative ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-200';
              
              return (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-sky-600 text-[15px] font-mono-code tracking-wide">{s.refId || s.id}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap border ${typeColor}`}>{typeLabel}</span>
                  </div>
                  <div className="text-right whitespace-nowrap shrink-0 ml-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">
                      {formatDateTh(s.date)}
                    </span>
                  </div>
                </>
              );
            }}
            renderTitle={(s) => {
              const isPositive = Number(s.quantity) > 0;
              const isNegative = Number(s.quantity) < 0;
              return (
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-[16px] leading-tight">{s.name}</h4>
                  <span className={`font-mono-code font-bold text-[16px] ${isPositive ? 'text-emerald-600' : isNegative ? 'text-rose-600' : 'text-slate-600'}`}>
                    {isPositive ? '+' : ''}{s.quantity ? Number(s.quantity).toLocaleString() : '0'} <span className="text-[12px] font-normal text-slate-500">{s.unit || 'กก.'}</span>
                  </span>
                </div>
              );
            }}
            renderFields={(s) => [
              { icon: <Info className="w-3.5 h-3.5" />, label: 'หมายเหตุ', value: s.note || '-' },
              { icon: <CalendarClock className="w-3.5 h-3.5" />, label: 'อ้างอิงโควตา', value: s.quotaDate ? formatDateTh(s.quotaDate) : '-' }
            ]}
            renderActions={(s) => (
              <>
                <button onClick={() => openModal(s, true)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors font-medium text-xs"><Info className="w-4 h-4" /> ดูข้อมูล</button>
                {!(s.refId && (s.refId.startsWith('REC') || s.refId.startsWith('INV'))) && (
                  <button onClick={() => openModal(s, false)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 rounded-xl transition-colors font-medium text-xs"><Edit className="w-4 h-4" /> แก้ไข</button>
                )}
                {!(s.refId && (s.refId.startsWith('REC') || s.refId.startsWith('INV'))) && (
                  <button onClick={() => setConfirmDelete({ isOpen: true, id: s.id, refId: s.refId })} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors font-medium text-xs"><Trash2 className="w-4 h-4" /> ลบ</button>
                )}
              </>
            )}
          />
          {!isFetchingTable && visibleCount < filteredStocks.length && (
            <div id="scroll-sentinel-stock"'''

content = content.replace(old_end_st, new_end_st)

# ----------------------------------------------------
# 4. BillingModule
# ----------------------------------------------------
content = content.replace(
    '<div className="overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50 border-b border-slate-100">',
    '<div className="hidden md:block overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50 border-b border-slate-100">'
)

old_end_bi = '''            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredBills.length && (
            <div id="scroll-sentinel-billing"'''

new_end_bi = '''            </table>
          </div>
          <MobileCardView 
            data={!isFetchingTable ? filteredBills.slice(0, visibleCount) : []}
            keyField="id"
            onClick={(b) => openModal(b, true)}
            emptyText="ไม่พบประวัติบิล"
            renderHeader={(b) => (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-sky-600 text-[15px] font-mono-code tracking-wide">{b.id}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap border ${b.type === 'BUY' ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {b.type === 'BUY' ? 'บิลรับซื้อ' : 'บิลขายออก'}
                  </span>
                </div>
                <div className="text-right whitespace-nowrap shrink-0 ml-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">
                    {formatDateTh(b.date)}
                  </span>
                </div>
              </>
            )}
            renderTitle={(b) => (
              <h4 className="font-bold text-slate-800 text-[16px] leading-tight truncate">{b.customerName || 'ลูกค้าทั่วไป'}</h4>
            )}
            renderFields={(b) => {
              const totalWeight = (b.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
              return [
                { icon: <Box className="w-3.5 h-3.5" />, label: 'น้ำหนักรวม', value: `${totalWeight.toLocaleString()} กก.` },
                { icon: <CircleDollarSign className="w-3.5 h-3.5" />, label: 'ยอดรวม (บาท)', value: b.grandTotal ? Number(b.grandTotal).toLocaleString() : '0' }
              ];
            }}
            renderActions={(b) => (
              <>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-colors font-medium text-xs"><Printer className="w-4 h-4" /> พิมพ์</button>
                <button onClick={() => openModal(b, true)} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 rounded-xl transition-colors font-medium text-xs"><Info className="w-4 h-4" /> ดูบิล</button>
                <button onClick={() => setConfirmDelete({ isOpen: true, id: b.id })} className="flex-1 flex items-center justify-center gap-2 py-2 text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-xl transition-colors font-medium text-xs"><Trash2 className="w-4 h-4" /> ลบ</button>
              </>
            )}
          />
          {!isFetchingTable && visibleCount < filteredBills.length && (
            <div id="scroll-sentinel-billing"'''

content = content.replace(old_end_bi, new_end_bi)


# ----------------------------------------------------
# 5. ReportModule
# ----------------------------------------------------
content = content.replace(
    '<div className="overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50 border-b border-slate-100">',
    '<div className="hidden md:block overflow-x-auto">\n            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">\n              <thead className="bg-slate-50 border-b border-slate-100">'
)

old_end_rp = '''            </table>
          </div>
          {visibleCount < filteredReports.length && (
            <div id="scroll-sentinel-report"'''

new_end_rp = '''            </table>
          </div>
          <MobileCardView 
            data={filteredReports.slice(0, visibleCount)}
            keyField="id"
            emptyText="ไม่พบรายการสรุป"
            renderHeader={(item) => (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="font-black text-slate-700 text-[14px] font-mono-code tracking-wide">{item.id}</span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap border ${item.typeColor || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {item.typeText}
                  </span>
                </div>
                <div className="text-right whitespace-nowrap shrink-0 ml-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border bg-slate-50 text-slate-500 border-slate-200">
                    {formatDateTh(item.date)}
                  </span>
                </div>
              </>
            )}
            renderTitle={(item) => (
              <h4 className="font-bold text-slate-800 text-[16px] leading-tight truncate">{item.customer || '-'}</h4>
            )}
            renderFields={(item) => [
              { icon: <Box className="w-3.5 h-3.5" />, label: 'น้ำหนัก/จำนวน', value: `${Number(item.weight || 0).toLocaleString()} ${item.unit || 'กก.'}` }
            ]}
          />
          {visibleCount < filteredReports.length && (
            <div id="scroll-sentinel-report"'''

content = content.replace(old_end_rp, new_end_rp)


with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated Stock, Billing, Report Modules')
