const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Replace handleSave
const handleSaveStart = c.indexOf('  const handleSave = async (e) => {');
const handleDeleteStart = c.indexOf('  const handleDelete = async () => {', handleSaveStart);

if (handleSaveStart > -1 && handleDeleteStart > -1) {
  const newHandleSave = `  const handleSave = async (e) => {
    if (!formData.customerId && !formData.customerName) return addToast('กรุณาระบุลูกค้า', 'error');
    if (formData.items.length === 0) return addToast('กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ', 'error');

    setLoadingMsg('กำลังบันทึกข้อมูล...');
    setIsLoading(true);

    try {
      const isNew = !formData.id;
      let billId = formData.id;
      
      if (isNew) {
        const prefix = formData.type === 'BUY' ? 'REC' : 'PAY';
        const dateStrForId = formData.date.split('T')[0].replace(/-/g, '').substring(2);
        
        const todayBills = bills.filter(b => b.id.startsWith(\`\${prefix}\${dateStrForId}\`));
        let maxSeq = 0;
        todayBills.forEach(b => {
          const seq = parseInt(b.id.substring(b.id.length - 4));
          if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
        });
        const nextSeq = String(maxSeq + 1).padStart(4, '0');
        billId = \`\${prefix}\${dateStrForId}\${nextSeq}\`;
      }

      const payload = { ...formData, id: billId };
      const billRes = await requestAPI('SAVE_DATA', 'Billing', payload);

      if (billRes.status === 'success') {
        const existingStocks = (stockData || []).filter(s => s.refId === billId);
        for (const stock of existingStocks) {
          await requestAPI('DELETE_DATA', 'Stock', { id: stock.id });
        }

        const stockDateToSave = formData.date;
        let stockIndex = 1;

        let remainingQuotas = (formData.quotaRefs || []).map(q => {
          const aq = availableQuotas.find(a => a.dateStr === q);
          return { date: q, remaining: aq ? aq.remaining : 0 };
        });

        for (let i = 0; i < formData.items.length; i++) {
          const item = formData.items[i];
          if (!item.productId && !item.name) continue;
          
          let itemQty = Number(item.quantity) || 0;
          if (itemQty === 0) continue;

          const newMultiplier = formData.type === 'BUY' ? 1 : -1;

          if (formData.type !== 'BUY') {
            await requestAPI('SAVE_DATA', 'Stock', {
              id: \`\${billId}-\${stockIndex++}\`, refId: billId, date: stockDateToSave, quotaRefDate: '',
              productId: item.productId, name: item.name, category: item.category || '',
              quantity: itemQty * newMultiplier, unit: item.unit || 'กก.', status: 'Active', 
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
          }
        }

        addToast(isNew ? 'สร้างบิลและอัปเดตสต๊อกสำเร็จ' : 'บันทึกการแก้ไขบิลสำเร็จ', 'success');
        reloadAllData();
        onClose();
      } else {
        addToast('เกิดข้อผิดพลาดในการบันทึกบิล', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('เกิดข้อผิดพลาดของระบบ', 'error');
    }
    setIsLoading(false);
  };
\n`;
  c = c.substring(0, handleSaveStart) + newHandleSave + c.substring(handleDeleteStart);
} else {
  console.log('handleSave or handleDelete not found');
}

// 2. Add UI for Quota selection
const targetUIPattern = '{formData.items.length === 0 && (<div className="p-8 text-center text-slate-400">ยังไม่มีรายการสินค้า</div>)}';
const targetUIIndex = c.indexOf(targetUIPattern);

if (targetUIIndex > -1) {
  const insertIndex = c.indexOf('</div>', c.indexOf('</div>', targetUIIndex) + 6) + 6;
  const quotaUI = `
            {formData.type === 'BUY' && (
              <div className="border border-slate-200 rounded-[16px] overflow-hidden shrink-0 mt-4">
                <div className="bg-amber-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-amber-800 text-[15px]">โควต้าที่ต้องการใช้ (หักน้ำหนัก)</h4>
                    <p className="text-[12px] text-amber-600">ระบบจะกระจายน้ำหนักของบิลนี้ไปตามโควต้าที่คุณเลือกให้ตามลำดับ</p>
                  </div>
                  <button disabled={isViewOnly} onClick={() => setFormData(prev => ({...prev, quotaRefs: [...(prev.quotaRefs || []), '']}))} className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-full text-[13px] font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 disabled:opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg> เพิ่มโควต้า
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
`;
  if (c.indexOf('โควต้าที่ต้องการใช้ (หักน้ำหนัก)') === -1) {
    c = c.substring(0, insertIndex) + '\n' + quotaUI + c.substring(insertIndex);
  }
}

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('Hybrid Logic applied successfully!');
