const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. initialFormData
c = c.replace(
  "items: [{ rowId: Date.now(), productId: '', name: '', quantity: '', price: '', unit: 'กก.' }],",
  "items: [{ rowId: Date.now(), productId: '', name: '', quantity: '', price: '', unit: 'กก.' }],\n    quotaRefs: [''],"
);

// 2. handleSave Logic
const handleSavePattern = /const stockDateToSave = formData\.date;\s+for \(let i = 0; i < formData\.items\.length; i\+\+\) \{[\s\S]*?await requestAPI\('SAVE_DATA', 'Stock', newStockPayload\);\s+\}/;

const handleSaveReplacement = `const stockDateToSave = formData.date;
      
      let remainingQuotas = (formData.quotaRefs || []).map(q => {
        const aq = availableQuotas.find(a => a.dateStr === q);
        return { date: q, remaining: aq ? aq.remaining : 0 };
      });
      if (remainingQuotas.length === 0) remainingQuotas.push({ date: stockDateToSave.split('T')[0], remaining: 0 });
      
      let stockIndex = 1;
      for (let i = 0; i < formData.items.length; i++) {
        const item = formData.items[i];
        let itemQty = (Number(item.quantity) || 0) * newMultiplier;
        if (itemQty === 0) continue; 
        
        if (formData.type !== 'BUY') {
          // Sell bills don't map quotas
          await requestAPI('SAVE_DATA', 'Stock', {
            id: \`\${billId}-\${stockIndex++}\`, refId: billId, date: stockDateToSave,
            productId: item.productId, name: item.name, category: item.category || '',
            quantity: itemQty, unit: item.unit || 'กก.', status: 'Active',
            note: \`ขายออก (บิล \${billId})\`
          });
          continue;
        }

        let quotaIndex = 0;
        let currentQuota = remainingQuotas[quotaIndex];
        
        while (Math.abs(itemQty) > 0) {
          if (!currentQuota) {
            await requestAPI('SAVE_DATA', 'Stock', {
              id: \`\${billId}-\${stockIndex++}\`, refId: billId, date: stockDateToSave, quotaRefDate: stockDateToSave.split('T')[0],
              productId: item.productId, name: item.name, category: item.category || '',
              quantity: itemQty, unit: item.unit || 'กก.', status: 'Active', note: \`รับซื้อ (บิล \${billId})\`
            });
            itemQty = 0;
          } else if (quotaIndex === remainingQuotas.length - 1) {
            await requestAPI('SAVE_DATA', 'Stock', {
              id: \`\${billId}-\${stockIndex++}\`, refId: billId, date: stockDateToSave, quotaRefDate: currentQuota.date,
              productId: item.productId, name: item.name, category: item.category || '',
              quantity: itemQty, unit: item.unit || 'กก.', status: 'Active', note: \`รับซื้อ (บิล \${billId})\`
            });
            currentQuota.remaining -= Math.abs(itemQty);
            itemQty = 0;
          } else {
            let qtyToTake = Math.min(Math.abs(itemQty), Math.max(0, currentQuota.remaining));
            if (qtyToTake <= 0) {
              quotaIndex++;
              currentQuota = remainingQuotas[quotaIndex];
              continue;
            }
            await requestAPI('SAVE_DATA', 'Stock', {
              id: \`\${billId}-\${stockIndex++}\`, refId: billId, date: stockDateToSave, quotaRefDate: currentQuota.date,
              productId: item.productId, name: item.name, category: item.category || '',
              quantity: qtyToTake * newMultiplier, unit: item.unit || 'กก.', status: 'Active', note: \`รับซื้อ (บิล \${billId})\`
            });
            itemQty = (Math.abs(itemQty) - qtyToTake) * newMultiplier;
            currentQuota.remaining -= qtyToTake;
            if (currentQuota.remaining <= 0) {
              quotaIndex++;
              currentQuota = remainingQuotas[quotaIndex];
            }
          }
        }`;

c = c.replace(handleSavePattern, handleSaveReplacement);

// 3. UI Update (Inject Quota mapping UI after the Items array)
const itemsUIPattern = /<div className="flex justify-between items-center bg-slate-50 p-4 rounded-t-\[16px\] border-b border-slate-200">[\s\S]*?{formData\.items\.length === 0 && \(<div className="p-8 text-center text-slate-400">ยังไม่มีรายการสินค้า<\/div>\)}\n              <\/div>\n            <\/div>\n\n            <div className="flex flex-col md:flex-row gap-6">/;

const quotaUI = `
            {formData.type === 'BUY' && (
              <div className="border border-slate-200 rounded-[16px] overflow-hidden shrink-0 mt-4">
                <div className="bg-amber-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-amber-800 text-[15px]">โควต้าที่ต้องการใช้ (หักน้ำหนัก)</h4>
                    <p className="text-[12px] text-amber-600">ระบบจะกระจายน้ำหนักของบิลนี้ไปตามโควต้าที่คุณเลือกให้ตามลำดับ</p>
                  </div>
                  <button disabled={isViewOnly} onClick={() => setFormData(prev => ({...prev, quotaRefs: [...(prev.quotaRefs || []), '']}))} className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-full text-[13px] font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 disabled:opacity-50">
                    <Plus className="w-4 h-4" /> เพิ่มโควต้า
                  </button>
                </div>
                <div className="p-4 space-y-3 bg-white">
                  {(formData.quotaRefs || ['']).map((qRef, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <select disabled={isViewOnly} value={qRef} onChange={(e) => {
                          const newRefs = [...(formData.quotaRefs || [''])];
                          newRefs[idx] = e.target.value;
                          setFormData({...formData, quotaRefs: newRefs});
                        }} className="w-full h-[48px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-amber-500 transition-all disabled:bg-slate-50">
                          <option value="">เลือกโควตาวันที่...</option>
                          {availableQuotas.map(q => (
                            <option key={q.dateStr} value={q.dateStr}>
                              {formatDateTh(q.dateStr)} (เหลือ {q.remaining.toLocaleString()} {q.unit})
                            </option>
                          ))}
                        </select>
                      </div>
                      {idx > 0 && !isViewOnly && (
                        <button onClick={() => {
                          const newRefs = [...(formData.quotaRefs || [])];
                          newRefs.splice(idx, 1);
                          setFormData({...formData, quotaRefs: newRefs});
                        }} className="w-10 h-10 rounded-[12px] flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors shrink-0">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-6 mt-4">`;

c = c.replace(itemsUIPattern, match => match.replace('\n            <div className="flex flex-col md:flex-row gap-6">', quotaUI));

// Fix useEffect for default quota
const useEffectPattern = /useEffect\(\(\) => \{\n    if \(\!isOpen\) return;\n    if \(\!config\.bill\) \{\n      const defaultPriceDateStr = new Date\(new Date\(\)\.getTime\(\) - \(new Date\(\)\.getTimezoneOffset\(\) \* 60000\)\)\.toISOString\(\)\.slice\(0, 10\);\n      setPriceDateStr\(defaultPriceDateStr\);\n    \} else \{\n      setPriceDateStr\(config\.bill\.date \? config\.bill\.date\.split\('T'\)\[0\] : ''\);\n    \}\n    setIsLoading\(false\);\n  \}, \[isOpen, config\]\);/;

const useEffectReplacement = `useEffect(() => {
    if (!isOpen) return;
    if (!config.bill) {
      const defaultPriceDateStr = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
      setPriceDateStr(defaultPriceDateStr);
      
      // Auto-set the oldest available quota as default
      const defaultQuota = availableQuotas.find(q => q.remaining > 0);
      setFormData(prev => ({
        ...prev, 
        quotaRefs: [defaultQuota ? defaultQuota.dateStr : defaultPriceDateStr]
      }));
    } else {
      setPriceDateStr(config.bill.date ? config.bill.date.split('T')[0] : '');
      
      // Extract quotaRefs from old stocks if viewing an existing bill
      if (config.bill.id) {
        const relatedStocks = (stockData || []).filter(s => s.refId === config.bill.id);
        const uniqueRefs = [...new Set(relatedStocks.map(s => s.quotaRefDate || s.date?.split('T')[0]).filter(Boolean))];
        setFormData(prev => ({
          ...prev, 
          quotaRefs: uniqueRefs.length > 0 ? uniqueRefs : [config.bill.date ? config.bill.date.split('T')[0] : '']
        }));
      }
    }
    setIsLoading(false);
  }, [isOpen, config, availableQuotas, stockData]);`;

c = c.replace(useEffectPattern, useEffectReplacement);

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('Done!');
