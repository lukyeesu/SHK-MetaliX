import re

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Product
content = content.replace(
    "renderFields={(p) => [\n              { icon: <CircleDollarSign className=\"w-3.5 h-3.5\" />, label: 'ราคารับซื้อ', value: p.buyPrice ? `${Number(p.buyPrice).toLocaleString()} ฿ / ${p.unit}` : '-' }\n            ]}",
    "renderFields={(p) => [\n              { icon: <CircleDollarSign className=\"w-3.5 h-3.5 text-slate-500\" />, label: 'ราคารับซื้อ', value: p.buyPrice ? `${Number(p.buyPrice).toLocaleString()} ฿ / ${p.unit}` : '-', valueClassName: 'text-slate-800' }\n            ]}"
)

# Daily Price
content = content.replace(
    "renderHeader={(entry) => (\n              <>\n                <div className=\"flex items-center gap-2.5\">\n                  <span className=\"font-black text-sky-600 text-[15px] font-mono-code tracking-wide\">{entry.id}</span>\n                </div>",
    "renderHeader={(entry) => (\n              <>\n                <div className=\"flex items-center gap-2.5\">\n                  <span className=\"font-bold text-slate-500 text-[14px] font-mono-code tracking-wide\">{entry.id}</span>\n                </div>"
)

# Lock Weight
content = content.replace(
    "renderHeader={(lock) => (\n              <>\n                <div className=\"flex items-center gap-2.5\">\n                  <span className=\"font-black text-sky-600 text-[15px] font-mono-code tracking-wide\">{lock.id}</span>\n                </div>",
    "renderHeader={(lock) => (\n              <>\n                <div className=\"flex items-center gap-2.5\">\n                  <span className=\"font-bold text-slate-500 text-[14px] font-mono-code tracking-wide\">{lock.id}</span>\n                </div>"
)

old_lw_fields = """            renderFields={(lock) => {
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
            }}"""

new_lw_fields = """            renderFields={(lock) => {
              const lockDateStr = lock.date ? lock.date.split('T')[0] : '';
              const totalQuotaRow = Number(lock.dailyLimitKg) || 0;
              const usedQuotaRow = (stockData || [])
                .filter(s => s.quotaId ? (s.quotaId === lock.id) : (s.quotaDate === lockDateStr || (!s.quotaDate && (s.date || '').startsWith(lockDateStr))))
                .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
              const remainingQuotaRow = totalQuotaRow - usedQuotaRow;
              return [
                { icon: <Lock className="w-3.5 h-3.5 text-slate-500" />, label: 'โควตารวม', value: `${totalQuotaRow.toLocaleString()} ${lock.dailyLimitUnit || 'Kg.'}`, valueClassName: 'text-slate-700' },
                { icon: <CheckCircle className="w-3.5 h-3.5 text-sky-500" />, label: 'ตัดโควตาแล้ว', value: `${usedQuotaRow.toLocaleString()} ${lock.dailyLimitUnit || 'Kg.'}`, valueClassName: 'text-sky-600' },
                { icon: <Info className={`w-3.5 h-3.5 ${remainingQuotaRow < 0 ? 'text-rose-500' : 'text-emerald-500'}`} />, label: 'คงเหลือ', value: `${remainingQuotaRow.toLocaleString()} ${lock.dailyLimitUnit || 'Kg.'}`, valueClassName: remainingQuotaRow < 0 ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md' : 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md' }
              ];
            }}"""
content = content.replace(old_lw_fields, new_lw_fields)

# Billing
old_bi_fields = """            renderFields={(b) => {
              const totalWeight = (b.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
              return [
                { icon: <Box className="w-3.5 h-3.5" />, label: 'น้ำหนักรวม', value: `${totalWeight.toLocaleString()} กก.` },
                { icon: <CircleDollarSign className="w-3.5 h-3.5" />, label: 'ยอดรวม (บาท)', value: b.grandTotal ? Number(b.grandTotal).toLocaleString() : '0' }
              ];
            }}"""

new_bi_fields = """            renderFields={(b) => {
              const totalWeight = (b.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
              return [
                { icon: <Box className="w-3.5 h-3.5 text-slate-500" />, label: 'น้ำหนักรวม', value: `${totalWeight.toLocaleString()} กก.`, valueClassName: 'text-slate-800' },
                { icon: <CircleDollarSign className="w-3.5 h-3.5 text-sky-500" />, label: 'ยอดรวม (บาท)', value: b.grandTotal ? Number(b.grandTotal).toLocaleString() : '0', valueClassName: 'text-sky-600' }
              ];
            }}"""
content = content.replace(old_bi_fields, new_bi_fields)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated colors')
