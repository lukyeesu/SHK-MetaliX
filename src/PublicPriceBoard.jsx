import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Loader2, CalendarClock, Tag, TrendingUp, TrendingDown, Minus, AlertCircle, Info, Phone } from 'lucide-react';

export default function PublicPriceBoard({ dailyPriceData, isGlobalFetching }) {
  const tableContainerRef = useRef(null);
  const [rowHeight, setRowHeight] = useState('auto');

  useEffect(() => {
    const updateHeight = () => {
      if (tableContainerRef.current) {
        const containerHeight = tableContainerRef.current.clientHeight;
        const thead = tableContainerRef.current.querySelector('thead');
        const theadHeight = thead ? thead.clientHeight : 0;
        const availableHeight = containerHeight - theadHeight;
        
        // Calculate height for exactly 11 items
        const calculatedHeight = Math.floor(availableHeight / 11);
        setRowHeight(`${calculatedHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [dailyPriceData]);

  if (isGlobalFetching || dailyPriceData === null) {
    return (
      <div className="h-[100dvh] bg-slate-50 font-sans p-2 md:p-6 flex flex-col items-center overflow-hidden">
        <div className="w-full max-w-4xl flex flex-col h-full gap-1.5 md:gap-3">
          
        {/* Transparent Clean Header inside the layout */}
        <div className="flex flex-col items-center justify-center pt-2 md:pt-4 pb-1 md:pb-2 shrink-0 text-center w-full">
          <h2 className="text-4xl sm:text-5xl md:text-[68px] leading-none font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-800 tracking-wider uppercase mb-1.5 md:mb-4 drop-shadow-sm whitespace-nowrap">
            SHK Metal Scrap
          </h2>
          <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 md:gap-4 text-slate-600 font-bold text-[11.5px] sm:text-[14px] md:text-[16px] mb-1.5 whitespace-nowrap">
            <a href="tel:0994636949" className="flex items-center gap-0.5 md:gap-1 hover:text-sky-600 transition-colors"><Phone className="w-3 h-3 md:w-4 md:h-4 text-sky-500" /> กิจ 099-463-6949</a>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <a href="tel:0949321362" className="flex items-center gap-0.5 md:gap-1 hover:text-sky-600 transition-colors"><Phone className="w-3 h-3 md:w-4 md:h-4 text-sky-500" /> ก้อย 094-932-1362</a>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <a href="tel:0815288327" className="flex items-center gap-0.5 md:gap-1 hover:text-sky-600 transition-colors"><Phone className="w-3 h-3 md:w-4 md:h-4 text-sky-500" /> กุ้ง 081-528-8327</a>
          </div>
          <p className="text-slate-400 text-[10px] sm:text-[11px] md:text-[13px] font-medium tracking-wide">( โทรติดต่อ-สอบถามได้ทุกวันเวลาทำการค่ะ )</p>
        </div>

          {/* Title Area Skeleton */}
          <div className="flex flex-row items-center justify-between shrink-0 px-1 md:px-2 gap-2">
            <h1 className="text-[15px] sm:text-lg md:text-2xl font-display font-bold text-slate-800 whitespace-nowrap">
              ราคารับซื้อประจำวัน
            </h1>
            <div className="inline-flex items-center justify-center">
              <div className="h-[28px] md:h-[36px] w-[120px] md:w-[160px] bg-slate-200 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="overflow-hidden flex-1 flex flex-col">
              <div className="bg-slate-50/95 border-b border-slate-200 shadow-sm shrink-0 flex">
                <div className="px-1 md:px-4 py-1 md:py-2 font-bold text-slate-500 text-[10px] sm:text-[11px] md:text-[13px] w-[40px] md:w-[60px] text-center shrink-0">ลำดับ</div>
                <div className="px-2 md:px-4 py-1 md:py-2 font-bold text-slate-500 text-[10px] sm:text-[11px] md:text-[13px] flex-1">ชื่อสินค้า</div>
                <div className="px-2 md:px-4 py-1 md:py-2 font-bold text-slate-500 text-[10px] sm:text-[11px] md:text-[13px] text-right w-[120px] md:w-[200px] shrink-0">ราคารับซื้อ (บาท)</div>
              </div>
              <div className="flex-1 flex flex-col divide-y divide-slate-100">
                {Array(11).fill(0).map((_, i) => (
                  <div key={i} className={`flex-1 flex items-center ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <div className="px-1 md:px-4 w-[40px] md:w-[60px] text-center shrink-0">
                      <div className="h-3 w-3 bg-slate-200 rounded animate-pulse mx-auto"></div>
                    </div>
                    <div className="px-2 md:px-4 flex-1 flex items-center gap-1.5 md:gap-2">
                      <div className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-slate-200 rounded-full animate-pulse shrink-0"></div>
                      <div className="h-3 md:h-4 w-24 md:w-48 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="px-2 md:px-4 w-[120px] md:w-[200px] flex justify-end shrink-0">
                      <div className="h-4 md:h-5 w-16 md:w-24 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Area */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-[12px] md:rounded-[16px] p-2 md:p-3 shrink-0 shadow-sm flex flex-row gap-2 md:gap-4 justify-between">
            <div className="flex items-start gap-1 md:gap-2 flex-1">
              <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[9px] sm:text-[11px] md:text-[13px] text-amber-800 space-y-0.5 md:space-y-1 leading-tight md:leading-relaxed">
                <p><strong>หมายเหตุ:</strong> รับสินค้าตั้งแต่ 50KG ขึ้นไป จำนวนไม่ถึง - 2 บาท</p>
                <p><strong>หมายเหตุ:</strong> ถ้าเป็นทองแดงเบอร์ 3,4 สายเผา มีติดขี้ฝุ่นมาทางร้านจะตัดฝุ่นด้วยค่ะ รบกวนให้ลูกค้าช่วยดูเรื่องขี้ฝุ่นให้ด้วยค่ะ</p>
              </div>
            </div>
            
            <div className="flex items-start gap-1 md:gap-2 flex-1 border-l border-amber-200/60 pl-2 md:pl-4">
              <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-[9px] sm:text-[11px] md:text-[13px] text-slate-700 space-y-0.5 md:space-y-1 leading-tight md:leading-relaxed">
                <p className="text-rose-600 font-bold">สินค้ามีราคาปรับเปลี่ยนระหว่างวัน กรุณาเช็คราคาก่อนล็อคทุกครั้ง</p>
                <p>ล็อคสินค้าก่อน 15:30 น. ขอบคุณค่ะ</p>
                <p className="font-medium">ก่อนเข้าส่งสินค้ากรุณาแจ้งล่วงหน้าตามเบอร์โทรศัพท์ข้างบนได้เลยนะคะ</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Find the latest daily price entry
  const sortedEntries = [...dailyPriceData].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  const latestEntry = sortedEntries[0];
  const previousEntry = sortedEntries[1];

  const getPriceDiff = (itemId, currentPrice) => {
    if (!previousEntry || !previousEntry.items) return null;
    const prevItem = previousEntry.items.find(i => i.id === itemId);
    if (!prevItem || !prevItem.todayPrice || !currentPrice) return null;
    return Number(currentPrice) - Number(prevItem.todayPrice);
  };

  const formatDateTh = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear() + 543;
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="h-[100dvh] bg-slate-50 font-sans p-2 md:p-6 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col h-full gap-1.5 md:gap-3">
        
        {/* Transparent Clean Header inside the layout */}
        <div className="flex flex-col items-center justify-center pt-2 md:pt-4 pb-1 md:pb-2 shrink-0 text-center w-full">
          <h2 className="text-4xl sm:text-5xl md:text-[68px] leading-none font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-800 tracking-wider uppercase mb-1.5 md:mb-4 drop-shadow-sm whitespace-nowrap">
            SHK Metal Scrap
          </h2>
          <div className="flex flex-row items-center justify-center gap-1 sm:gap-2 md:gap-4 text-slate-600 font-bold text-[11.5px] sm:text-[14px] md:text-[16px] mb-1.5 whitespace-nowrap">
            <a href="tel:0994636949" className="flex items-center gap-0.5 md:gap-1 hover:text-sky-600 transition-colors"><Phone className="w-3 h-3 md:w-4 md:h-4 text-sky-500" /> กิจ 099-463-6949</a>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <a href="tel:0949321362" className="flex items-center gap-0.5 md:gap-1 hover:text-sky-600 transition-colors"><Phone className="w-3 h-3 md:w-4 md:h-4 text-sky-500" /> ก้อย 094-932-1362</a>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <a href="tel:0815288327" className="flex items-center gap-0.5 md:gap-1 hover:text-sky-600 transition-colors"><Phone className="w-3 h-3 md:w-4 md:h-4 text-sky-500" /> กุ้ง 081-528-8327</a>
          </div>
          <p className="text-slate-400 text-[10px] sm:text-[11px] md:text-[13px] font-medium tracking-wide">( โทรติดต่อ-สอบถามได้ทุกวันเวลาทำการค่ะ )</p>
        </div>

        <div className="flex flex-row items-center justify-between shrink-0 px-1 md:px-2 gap-2">
          <h1 className="text-[15px] sm:text-lg md:text-2xl font-display font-bold text-slate-800 whitespace-nowrap">
            ราคารับซื้อประจำวัน
          </h1>
          {latestEntry ? (
            <div className="relative inline-flex items-center justify-center cursor-default hover:scale-105 transition-transform">
              <div className="absolute inset-0 rounded-full shadow-[0_0_5px_1px_rgba(2,132,199,0.9)] animate-[pulse_2s_ease-in-out_infinite]"></div>
              <div className="relative inline-flex items-center gap-1.5 md:gap-2 bg-gradient-to-r from-sky-400 to-blue-500 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-sky-300 whitespace-nowrap z-10">
                <CalendarClock className="w-4 h-4 md:w-5 md:h-5 text-white shrink-0" />
                <span className="text-white font-black text-[11px] sm:text-[13px] md:text-[15px] tracking-wide drop-shadow-sm">
                  อัปเดตล่าสุด: {formatDateTh(latestEntry.date)}
                </span>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-rose-50 px-5 py-2.5 rounded-full border border-rose-200">
              <span className="text-rose-600 font-medium">ยังไม่มีข้อมูลราคารับซื้อ</span>
            </div>
          )}
        </div>

        {latestEntry && (
          <div className="bg-white rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="overflow-y-auto flex-1 scrollbar-hide" ref={tableContainerRef}>
              <table className="w-full text-left border-collapse relative">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
                    <th className="px-1 md:px-4 py-1 md:py-2 font-bold text-slate-500 text-[10px] sm:text-[11px] md:text-[13px] w-[40px] md:w-[60px] text-center">ลำดับ</th>
                    <th className="px-2 md:px-4 py-1 md:py-2 font-bold text-slate-500 text-[10px] sm:text-[11px] md:text-[13px]">ชื่อสินค้า</th>
                    <th className="px-2 md:px-4 py-1 md:py-2 font-bold text-slate-500 text-[10px] sm:text-[11px] md:text-[13px] text-right">ราคารับซื้อ (บาท)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {latestEntry.items
                    ?.slice()
                    .sort((a, b) => (a.id || '').localeCompare(b.id || ''))
                    .map((item, index) => {
                      const diff = getPriceDiff(item.id, item.todayPrice);
                      return (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-sky-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                        style={{ height: rowHeight }}
                      >
                        <td className="px-1 md:px-4 py-0 md:py-1.5 text-[11px] md:text-[13px] font-bold text-slate-400 font-mono-code text-center">
                          {index + 1}
                        </td>
                        <td className="px-2 md:px-4 py-0 md:py-1.5">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <Tag className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-sky-500 shrink-0" />
                            <span className="text-[12px] md:text-[14px] font-bold text-slate-700">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-2 md:px-4 py-0 md:py-1.5 text-right">
                          <div className="flex items-center justify-end gap-2 md:gap-3">
                            {diff !== null && diff !== 0 ? (
                              diff > 0 ? (
                                <div className="flex items-center text-emerald-500 gap-0.5 md:gap-1 bg-emerald-50 px-1 md:px-2 py-0.5 rounded-md shadow-sm animate-[pulse_1.5s_ease-in-out_infinite]" title="ขึ้นจากรอบที่แล้ว">
                                  <TrendingUp className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                                  <span className="text-[9px] md:text-[12px] font-bold">+{diff.toLocaleString()}</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-rose-500 gap-0.5 md:gap-1 bg-rose-50 px-1 md:px-2 py-0.5 rounded-md shadow-sm animate-[pulse_1.5s_ease-in-out_infinite]" title="ลดลงจากรอบที่แล้ว">
                                  <TrendingDown className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
                                  <span className="text-[9px] md:text-[12px] font-bold">{diff.toLocaleString()}</span>
                                </div>
                              )
                            ) : (
                                <div className="flex items-center text-slate-300 gap-1" title="ราคาคงที่">
                                  <Minus className="w-3.5 h-3.5" />
                                </div>
                            )}
                            <div className="flex items-baseline min-w-[70px] justify-end">
                              <span className="text-[13px] sm:text-[14px] md:text-[16px] font-mono-code font-bold text-slate-800">
                                {item.todayPrice ? Number(item.todayPrice).toLocaleString() : '-'}
                              </span>
                              <span className="text-[10px] md:text-[12px] text-slate-400 ml-0.5 md:ml-1">/{item.unit || 'กก.'}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )})}
                  {(!latestEntry.items || latestEntry.items.length === 0) && (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-slate-400">
                        ไม่มีรายการสินค้าในวันนี้
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {latestEntry && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-[12px] md:rounded-[16px] p-2 md:p-3 shrink-0 shadow-sm flex flex-row gap-2 md:gap-4 justify-between">
            <div className="flex items-start gap-1 md:gap-2 flex-1">
              <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[9px] sm:text-[11px] md:text-[13px] text-amber-800 space-y-0.5 md:space-y-1 leading-tight md:leading-relaxed">
                <p><strong>หมายเหตุ:</strong> รับสินค้าตั้งแต่ 50KG ขึ้นไป จำนวนไม่ถึง - 2 บาท</p>
                <p><strong>หมายเหตุ:</strong> ถ้าเป็นทองแดงเบอร์ 3,4 สายเผา มีติดขี้ฝุ่นมาทางร้านจะตัดฝุ่นด้วยค่ะ รบกวนให้ลูกค้าช่วยดูเรื่องขี้ฝุ่นให้ด้วยค่ะ</p>
              </div>
            </div>
            
            <div className="flex items-start gap-1 md:gap-2 flex-1 border-l border-amber-200/60 pl-2 md:pl-4">
              <Info className="w-3.5 h-3.5 md:w-4 md:h-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="text-[9px] sm:text-[11px] md:text-[13px] text-slate-700 space-y-0.5 md:space-y-1 leading-tight md:leading-relaxed">
                <p className="text-rose-600 font-bold">สินค้ามีราคาปรับเปลี่ยนระหว่างวัน กรุณาเช็คราคาก่อนล็อคทุกครั้ง</p>
                <p>ล็อคสินค้าก่อน 15:30 น. ขอบคุณค่ะ</p>
                <p className="font-medium">ก่อนเข้าส่งสินค้ากรุณาแจ้งล่วงหน้าตามเบอร์โทรศัพท์ข้างบนได้เลยนะคะ</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
