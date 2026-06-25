import re

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

component_code = """
// =========================================
// Generic Mobile Card View Component
// =========================================
function MobileCardView({ data, keyField, renderHeader, renderTitle, renderFields, renderActions, onClick, emptyText }) {
  if (!data || data.length === 0) {
    return <div className="md:hidden text-center p-8 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm mt-4 text-[14px]">{emptyText || 'ไม่มีข้อมูล'}</div>;
  }
  return (
    <div className="md:hidden space-y-4 mt-4">
      {data.map((item, index) => (
        <div key={`${item[keyField] || 'row'}-${index}`} onClick={(e) => { if(onClick) onClick(item, e); }} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col cursor-pointer hover:border-sky-300 hover:shadow-md transition-all active:scale-[0.98]">
          {renderHeader && (
            <div className="flex justify-between items-start mb-2">
              {renderHeader(item, index)}
            </div>
          )}
          {renderTitle && (
            <div className="mb-3">
              {renderTitle(item, index)}
            </div>
          )}
          {renderFields && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col gap-2">
              {renderFields(item, index).filter(Boolean).map((field, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px]">
                  <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    {field.icon || <Info className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1 flex justify-between items-start gap-2">
                    <span className="font-medium text-slate-500 shrink-0">{field.label}:</span>
                    <span className="font-bold text-slate-700 text-right break-words">{field.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {renderActions && (
            <div className="mt-3 flex gap-2 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
              {renderActions(item, index)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
"""

target = r'// ==========================================\n// 1. MAIN LAYOUT & NAVIGATION\n// =========================================='
content = content.replace(target, component_code + '\n' + target)

with open(r'D:\WebApp SHK\SHKMETAL\src\App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Injected MobileCardView component')
