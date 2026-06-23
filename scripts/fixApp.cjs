const fs = require('fs');
let c = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Move calculateDynamicQuotas outside of App
const matchQuotas = c.match(/  const calculateDynamicQuotas = useCallback\(\(locks, stocks, excludeRefId = null\) => \{[\s\S]*?  \}, \[\]\);\n/);
if (matchQuotas) {
  let funcBody = matchQuotas[0].replace('  const calculateDynamicQuotas = useCallback', 'const calculateDynamicQuotas = ');
  funcBody = funcBody.replace('  }, []);\n', '};\n');
  
  c = c.replace(matchQuotas[0], '');
  c = c.replace('// --- Main Application ---', '// --- Main Application ---\n' + funcBody);
}

// 2. Add 'Total Weight' column to Billing Table
c = c.replace(
  '<th onClick={() => requestSort(\'customerName\')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">ลูกค้า/อ้างอิง {sortConfig.key === \'customerName\' ? (sortConfig.direction === \'asc\' ? \'↑\' : \'↓\') : \'⇅\'}</th>\n                  <th onClick={() => requestSort(\'grandTotal\')}',
  '<th onClick={() => requestSort(\'customerName\')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">ลูกค้า/อ้างอิง {sortConfig.key === \'customerName\' ? (sortConfig.direction === \'asc\' ? \'↑\' : \'↓\') : \'⇅\'}</th>\n                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right">น้ำหนักรวม (กก.)</th>\n                  <th onClick={() => requestSort(\'grandTotal\')}'
);
c = c.replace(
  '<td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-32\"></div></td>\n                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20 ml-auto\"></div></td>',
  '<td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-32\"></div></td>\n                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16 ml-auto\"></div></td>\n                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20 ml-auto\"></div></td>'
);
c = c.replace(
  '<td className="px-6 py-4 text-[15px] text-slate-800 font-medium">{b.customerName}</td>\n                      <td className="px-6 py-4 text-[16px] font-mono-code font-bold text-slate-800 text-right">\n                        {Number(b.grandTotal).toLocaleString()}\n                      </td>',
  '<td className="px-6 py-4 text-[15px] text-slate-800 font-medium">{b.customerName}</td>\n                      <td className="px-6 py-4 text-[15px] font-mono-code font-bold text-amber-600 text-right">\n                        {(b.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0).toLocaleString()}\n                      </td>\n                      <td className="px-6 py-4 text-[16px] font-mono-code font-bold text-slate-800 text-right">\n                        {Number(b.grandTotal).toLocaleString()}\n                      </td>'
);
c = c.replace('colSpan="6" className="text-center', 'colSpan="7" className="text-center');

// 3. Remove referenceDate from GlobalBillModal
c = c.replace(
  /,\s*referenceDate: config\.bill\.referenceDate \|\| \(config\.bill\.date \? config\.bill\.date\.split\('T'\)\[0\] : ''\)/g,
  ''
);
c = c.replace(
  /,\n    referenceDate: new Date\(new Date\(\)\.getTime\(\) - \(new Date\(\)\.getTimezoneOffset\(\) \* 60000\)\)\.toISOString\(\)\.slice\(0, 10\)/g,
  ''
);
c = c.replace(
  'const quotaDateStr = formData.referenceDate || priceDateStr;',
  'const quotaDateStr = priceDateStr;'
);
c = c.replace(
  'const timePart = formData.date.includes(\'T\') ? formData.date.split(\'T\')[1] : \'00:00:00\';\n      const stockDateToSave = formData.referenceDate ? `${formData.referenceDate}T${timePart}` : formData.date;',
  'const stockDateToSave = formData.date;'
);
const dropdownRegex = /<div className="space-y-1\.5" ref=\{quotaRef\}>[\s\S]*?<\/ul>\n                \)}\n              <\/div>\n            <\/div>/;
c = c.replace(dropdownRegex, '');
c = c.replace('<div className="space-y-1.5 md:col-span-3 shrink-0">\n              <label className="text-[13px] font-medium text-slate-500\">หมวดหมู่ <span className="text-rose-500\">*</span></label>', '<div className="space-y-1.5 md:col-span-2 shrink-0">\n              <label className="text-[13px] font-medium text-slate-500">หมวดหมู่ <span className="text-rose-500\">*</span></label>');
c = c.replace('<div className="space-y-1.5">\n              <label className="text-[13px] font-medium text-slate-500\">วันที่ทำรายการ (อิงราคา)', '<div className="space-y-1.5 md:col-span-2">\n              <label className="text-[13px] font-medium text-slate-500">วันที่ทำรายการ (อิงราคา)');

fs.writeFileSync('src/App.jsx', c, 'utf8');
console.log('App.jsx fixed successfully!');
