import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Lock, PackagePlus, Box, FileText, UserCircle, 
  BarChart3, Settings, Plus, Edit, Trash2, X, Loader2, 
  CheckCircle, AlertCircle, Info, Menu, UploadCloud, Search, Printer,
  MapPin, Scan, Clock, Tag, CircleDollarSign, Warehouse, AlertTriangle,
  Scale, Save, PlusCircle, CalendarClock, Minus, 
  ArrowDownCircle, ArrowUpCircle, FileDown, DollarSign
} from 'lucide-react';

// --- Shared Components ---

const FullPageLoader = ({ message }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center font-body">
    <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
    <div className="bg-white px-6 py-3 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] font-medium text-slate-800 border border-slate-100">
      {message || 'กำลังประมวลผล...'}
    </div>
  </div>
);

const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 font-body items-center pointer-events-none w-full px-4">
    {toasts.map(toast => (
      <div key={toast.id} className={`pointer-events-auto flex items-center w-max max-w-full gap-3 px-5 py-4 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-white transform transition-all duration-300
        ${toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-slate-800'}
      `}>
        {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
        <span className="text-[16px] font-normal leading-[1.6] truncate">{toast.message}</span>
        <button onClick={() => removeToast(toast.id)} className="ml-4 opacity-80 hover:opacity-100 transition-opacity p-1 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
);

const ConfirmAlert = ({ isOpen, title, text, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] p-[28px] max-w-sm w-full shadow-[0_8px_32px_rgba(0,0,0,0.04)] transform scale-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="font-display text-[24px] font-bold tracking-[-0.01em] text-slate-800 mb-2">{title}</h3>
        <p className="font-body text-[16px] text-slate-600 mb-8 leading-[1.6]">{text}</p>
        <div className="flex gap-3 w-full font-body">
          <button onClick={onCancel} className="flex-1 h-[48px] px-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-[16px] hover:bg-slate-100 font-medium active:scale-95 transition-transform">
            ยกเลิก
          </button>
          <button onClick={onConfirm} className="flex-1 h-[48px] px-4 bg-rose-500 text-white rounded-[16px] hover:bg-rose-600 font-medium active:scale-95 transition-transform shadow-sm">
            ยืนยันการลบ
          </button>
        </div>
      </div>
    </div>
  );
};

// ใช้งานตัวแปร Hook สำหรับ Header Sticky Effect
const useStickyScroll = (headerRef, filterRef) => {
  useEffect(() => {
    const mainElement = document.getElementById('main-scroll-container');
    if (!mainElement) return;

    const handleScroll = (e) => {
      if (!headerRef.current || !filterRef.current) return;
      if (headerRef.current.offsetHeight === 0) return; 
      
      const { scrollTop } = e.target;
      
      const isHeaderScrolled = headerRef.current.classList.contains('is-scrolled');
      if (!isHeaderScrolled && scrollTop > 100) {
          headerRef.current.classList.add('is-scrolled');
      } else if (isHeaderScrolled && scrollTop < 10) {
          headerRef.current.classList.remove('is-scrolled');
      }

      const headerRect = headerRef.current.getBoundingClientRect();
      const filterRect = filterRef.current.getBoundingClientRect();
      
      if (filterRect.top <= headerRect.bottom + 5) {
          filterRef.current.classList.add('is-scrolled');
      } else {
          filterRef.current.classList.remove('is-scrolled');
      }
    };

    setTimeout(() => {
        if (mainElement && headerRef.current && filterRef.current) {
            if (mainElement.scrollTop > 100) headerRef.current.classList.add('is-scrolled');
            else if (mainElement.scrollTop < 10) headerRef.current.classList.remove('is-scrolled');
        }
    }, 50);

    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, [headerRef, filterRef]);
};

// ฟังก์ชันสร้างเลขที่เอกสารอัตโนมัติ
const generateDocId = (prefix, dataArray, dateStr) => {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return '';
  
  const yy = dateObj.getFullYear().toString().slice(-2);
  const mm = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const prefixWithDate = `${prefix}${yy}${mm}`;

  let maxRunning = 0;
  if (Array.isArray(dataArray)) {
    dataArray.forEach(item => {
      if (item.id && typeof item.id === 'string' && item.id.startsWith(prefixWithDate)) {
        const numPart = parseInt(item.id.slice(prefixWithDate.length), 10);
        if (!isNaN(numPart) && numPart > maxRunning) {
          maxRunning = numPart;
        }
      }
    });
  }

  const nextRunning = (maxRunning + 1).toString().padStart(4, '0');
  return `${prefixWithDate}${nextRunning}`; 
};

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvTHxvoyfPAz2eKZy2es-hYSL9Y5n198mNVx3XOJPntCnmC9yHy3LTUOm6GsS-_m7e/exec";

// --- Main Application ---
export default function App() {
  const [activeMenu, setActiveMenu] = useState('daily_prices');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  
  const [customerData, setCustomerData] = useState(null); 
  const [productData, setProductData] = useState(null);   
  const [stockData, setStockData] = useState(null);       
  const [lockData, setLockData] = useState(null);         
  const [dailyPriceData, setDailyPriceData] = useState(null); 
  const [billingData, setBillingData] = useState(null);

  // --- Global Bill Modal State ---
  const [billModalConfig, setBillModalConfig] = useState({ isOpen: false, bill: null, isViewOnly: false });
  const openBillModal = (bill = null, isViewOnly = false) => setBillModalConfig({ isOpen: true, bill, isViewOnly });
  const closeBillModal = () => setBillModalConfig({ isOpen: false, bill: null, isViewOnly: false });

  // ดึง Data ทั้งหมด
  const loadAllData = async () => {
    requestAPI('GET_DATA', 'Customers').then(res => setCustomerData(res.status === 'success' ? res.data : []));
    requestAPI('GET_DATA', 'Products').then(res => setProductData(res.status === 'success' ? res.data : []));
    requestAPI('GET_DATA', 'Stock').then(res => setStockData(res.status === 'success' ? res.data : []));
    requestAPI('GET_DATA', 'DailyLocks').then(res => setLockData(res.status === 'success' ? res.data : []));
    requestAPI('GET_DATA', 'DailyPrices').then(res => setDailyPriceData(res.status === 'success' ? res.data : [])); 
    requestAPI('GET_DATA', 'Billing').then(res => setBillingData(res.status === 'success' ? res.data : []));
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    const mainElement = document.getElementById('main-scroll-container');
    if (mainElement) mainElement.scrollTop = 0;
  }, [activeMenu]);

  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const menus = [
    { id: 'daily_prices', label: 'ราคารับซื้อประจำวัน', icon: CircleDollarSign },
    { id: 'customers', label: 'ระบบลูกค้า', icon: Users },
    { id: 'lock', label: 'โควตาล็อกน้ำหนัก', icon: Lock },
    { id: 'products', label: 'สินค้า', icon: PackagePlus },
    { id: 'stock', label: 'สต๊อกสินค้า', icon: Box },
    { id: 'billing', label: 'บิลซื้อ/ขาย', icon: FileText },
    { id: 'employees', label: 'พนักงาน', icon: UserCircle },
    { id: 'reports', label: 'รายงาน', icon: BarChart3 },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings },
  ];

  const requestAPI = async (action, sheetName, payload = {}) => {
    const useMockAPI = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let currentData = JSON.parse(localStorage.getItem(sheetName) || '[]');
          if (action === 'GET_DATA') resolve({ status: 'success', data: currentData });
          else if (action === 'SAVE_DATA') {
            const index = currentData.findIndex(item => item.id === payload.id);
            if (index >= 0) currentData[index] = payload;
            else currentData.unshift(payload);
            localStorage.setItem(sheetName, JSON.stringify(currentData));
            resolve({ status: 'success', message: 'Data saved (Mock mode)', data: payload });
          }
          else if (action === 'DELETE_DATA') {
            currentData = currentData.filter(item => item.id !== payload.id);
            localStorage.setItem(sheetName, JSON.stringify(currentData));
            resolve({ status: 'success', message: 'Data deleted (Mock mode)' });
          }
        }, 800);
      });
    };

    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('http')) {
      try {
        const cleanUrl = GOOGLE_SCRIPT_URL.trim();
        const response = await fetch(cleanUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action, sheetName, payload }),
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
      } catch (error) {
        return useMockAPI();
      }
    } 
    return useMockAPI();
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Roboto+Mono&display=swap');
        * { font-family: 'Kanit', sans-serif; }
        .font-display { font-family: 'Kanit', sans-serif; }
        .font-body { font-family: 'Kanit', sans-serif; }
        .font-mono-code { font-family: 'JetBrains Mono', 'Roboto Mono', monospace !important; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
        #main-scroll-container { overflow-anchor: none; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; appearance: textfield; }
        .sticky-header-bg { transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease; border-bottom: 1px solid transparent; background-color: transparent; will-change: background-color, backdrop-filter; }
        .is-scrolled.sticky-header-bg, .is-scrolled .sticky-header-bg { background-color: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom-color: transparent; }
        .sticky-header-inner { transition: padding 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding-top: 1.5rem; padding-bottom: 1rem; will-change: padding; }
        .is-scrolled .sticky-header-inner { padding-top: 0.75rem; padding-bottom: 0.75rem; }
        .sticky-header-title { transition: font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-size: 1.75rem; line-height: 1.2; }
        .is-scrolled .sticky-header-title { font-size: 1.25rem; }
        .sticky-header-desc { transition: opacity 0.25s ease, max-height 0.3s ease, margin-top 0.3s ease; opacity: 1; max-height: 50px; margin-top: 0.5rem; overflow: hidden; }
        .is-scrolled .sticky-header-desc { opacity: 0; max-height: 0; margin-top: 0px; }
        .sticky-filter-inner { transition: width 0.3s ease, padding 0.3s ease, border-radius 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease, backdrop-filter 0.3s ease; width: calc(100% - 4rem); border-radius: 1.5rem; border-width: 1px; border-color: rgba(241, 245, 249, 0.6); will-change: width, padding, border-radius; background-color: rgba(255, 255, 255, 1); box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 0.625rem; margin: 0 auto; }
        @media (max-width: 768px) { .sticky-filter-inner { width: calc(100% - 2rem); } }
        .is-scrolled.sticky-filter-inner, .is-scrolled .sticky-filter-inner { width: 100%; border-radius: 0 0 1.5rem 1.5rem; border-top-color: transparent; border-left-color: transparent; border-right-color: transparent; border-bottom-color: rgba(226, 232, 240, 0.8); box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05); background-color: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); padding-top: 2.5rem; padding-bottom: 1rem; padding-left: 2rem; padding-right: 2rem; }
        @media (max-width: 768px) { .is-scrolled.sticky-filter-inner, .is-scrolled .sticky-filter-inner { padding-top: 2.125rem; padding-bottom: 0.875rem; padding-left: 1rem; padding-right: 1rem; } }
      `}} />

      <aside className={`hidden md:flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200 transition-all duration-300 z-40 ${isSidebarOpen ? 'w-[210px]' : 'w-[88px]'}`}>
        <div className="h-[72px] px-6 flex items-center justify-between border-b border-slate-100">
          {isSidebarOpen && <span className="font-display text-[18px] font-bold tracking-[-0.01em] text-sky-500 truncate">SHK System</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-[12px] transition-colors text-slate-400">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {menus.map((menu) => (
              <li key={menu.id}>
                <button
                  onClick={() => setActiveMenu(menu.id)}
                  className={`w-full flex items-center gap-4 px-4 h-[48px] rounded-[16px] transition-colors
                    ${activeMenu === menu.id ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <menu.icon className={`w-5 h-5 flex-shrink-0 ${activeMenu === menu.id ? 'text-white' : 'text-slate-400'}`} />
                  {isSidebarOpen && <span className="font-medium text-[15px] truncate">{menu.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? 'bg-slate-50 p-3 rounded-[16px]' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-[12px] flex items-center justify-center font-bold shadow-sm shrink-0">SK</div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium text-[14px] truncate">Admin User</p>
                <p className="text-[12px] text-slate-500 truncate">System Manager</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50">
        <div id="main-scroll-container" className="flex-1 overflow-auto relative">
          {activeMenu === 'daily_prices' ? (
            <DailyPriceModule 
              setIsLoading={setIsLoading} setLoadingMsg={setLoadingMsg} addToast={addToast} requestAPI={requestAPI} 
              dailyPriceData={dailyPriceData} setDailyPriceData={setDailyPriceData} productData={productData}
            />
          ) : activeMenu === 'customers' ? (
            <CustomerModule 
              setIsLoading={setIsLoading} setLoadingMsg={setLoadingMsg} addToast={addToast} requestAPI={requestAPI} 
              customerData={customerData} setCustomerData={setCustomerData}
            />
          ) : activeMenu === 'lock' ? (
            <LockWeightModule 
              setIsLoading={setIsLoading} setLoadingMsg={setLoadingMsg} addToast={addToast} requestAPI={requestAPI} 
              lockData={lockData} setLockData={setLockData} stockData={stockData} billingData={billingData} openBillModal={openBillModal}
            />
          ) : activeMenu === 'products' ? (
            <ProductModule 
              setIsLoading={setIsLoading} setLoadingMsg={setLoadingMsg} addToast={addToast} requestAPI={requestAPI} 
              productData={productData} setProductData={setProductData}
            />
          ) : activeMenu === 'stock' ? (
            <StockModule 
              setIsLoading={setIsLoading} setLoadingMsg={setLoadingMsg} addToast={addToast} requestAPI={requestAPI} 
              stockData={stockData} setStockData={setStockData} productData={productData} 
            />
          ) : activeMenu === 'billing' ? (
            <BillingModule 
              setIsLoading={setIsLoading} setLoadingMsg={setLoadingMsg} addToast={addToast} requestAPI={requestAPI} 
              billingData={billingData} setBillingData={setBillingData} customerData={customerData} productData={productData} 
              dailyPriceData={dailyPriceData} stockData={stockData} setStockData={setStockData} openBillModal={openBillModal}
            />
          ) : (
            <div className="p-4 md:p-8 h-full">
              <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[28px] h-full flex flex-col items-center justify-center">
                  <p className="text-slate-400 font-display text-[20px]">กำลังพัฒนาระบบ...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {isLoading && <FullPageLoader message={loadingMsg} />}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* --- Global Bill Modal --- */}
      <GlobalBillModal 
        config={billModalConfig} onClose={closeBillModal} 
        setIsLoading={setIsLoading} setLoadingMsg={setLoadingMsg} addToast={addToast} requestAPI={requestAPI}
        billingData={billingData} customerData={customerData} productData={productData} dailyPriceData={dailyPriceData}
        lockData={lockData} stockData={stockData} reloadAllData={loadAllData}
      />
    </div>
  );
}

// --- Component สำหรับบิลล์แบบ Global ---
function GlobalBillModal({ config, onClose, setIsLoading, setLoadingMsg, addToast, requestAPI, billingData, customerData, productData, dailyPriceData, lockData, stockData, reloadAllData }) {
  if (!config.isOpen) return null;

  const isViewOnly = config.isViewOnly;
  const editingId = config.bill ? config.bill.id : null;
  const bills = billingData || [];

  // ฟังก์ชันช่วยหาโควตาที่เหลือของแต่ละวัน
  const getQuotaRemaining = (dateStr, excludeBillId = null) => {
    const refLock = (lockData || []).find(l => (l.date || '').startsWith(dateStr));
    const limit = refLock ? Number(refLock.dailyLimitKg) || 0 : 0;
    const used = (stockData || [])
      .filter(s => {
        const matchDate = s.quotaDate === dateStr || (!s.quotaDate && (s.date || '').startsWith(dateStr));
        return matchDate && (s.refId || '').startsWith('REC') && s.refId !== excludeBillId;
      })
      .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    return limit - used;
  };

  const initialFormData = config.bill ? { 
    ...config.bill, 
    // กรณีแก้ไข ดึง array กลับมา หรือถ้าเป็นบิลเก่าให้เอา referenceDate เดิมมาใส่ array
    quotaDates: config.bill.quotaDates || (config.bill.referenceDate ? [config.bill.referenceDate] : [config.bill.date ? config.bill.date.split('T')[0] : ''])
  } : {
    id: '', type: 'BUY', 
    date: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 19), 
    quotaDates: [], 
    category: 'ซื้อของเก่า', customerId: '', customerName: '', 
    items: [{ rowId: Date.now(), productId: '', name: '', quantity: '', price: '', unit: 'กก.' }],
    note: '', grandTotal: 0, status: 'Completed'
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState(config.bill ? config.bill.customerName : '');
  const customerRef = useRef(null);

  // ดึงราคาสินค้าอิงจาก "วันที่ทำรายการ (date)"
  const priceDateStr = formData.date ? formData.date.split('T')[0] : '';
  const todayPriceList = (dailyPriceData || []).find(p => (p.date || '').startsWith(priceDateStr));
  const dailyItems = todayPriceList ? (todayPriceList.items || []) : [];

  // กำหนดค่า Default โควตาวันเก่าสุดที่ยังว่าง (ตอนเปิดบิลใหม่)
  useEffect(() => {
    if (!config.bill && formData.quotaDates.length === 0) {
      let oldestAvailable = new Date().toISOString().split('T')[0];
      const sortedLocks = [...(lockData || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
      for (let lock of sortedLocks) {
        const qDate = lock.date.split('T')[0];
        if (getQuotaRemaining(qDate) > 0) {
          oldestAvailable = qDate; break;
        }
      }
      setFormData(prev => ({ ...prev, quotaDates: [oldestAvailable] }));
    }
  }, [config.bill, lockData, stockData]);

  // รายการโควตาทั้งหมดสำหรับให้เลือกใน Dropdown
  const availableQuotas = (lockData || []).map(lock => {
    const lockDateStr = lock.date ? lock.date.split('T')[0] : '';
    const limit = Number(lock.dailyLimitKg) || 0;
    const remaining = getQuotaRemaining(lockDateStr, editingId);
    return { dateStr: lockDateStr, limit, remaining, unit: lock.dailyLimitUnit || 'Kg.' };
  }).sort((a, b) => new Date(b.dateStr) - new Date(a.dateStr));

  // --- ฟังก์ชันกดเพิ่มวันที่โควตา (แบบฉลาด ไม่ข้ามวัน) ---
  const handleAddQuotaDate = () => {
    // เรียงวันจากเก่าไปใหม่
    const sortedQuotas = [...availableQuotas].sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));
    
    // หาวันที่ "ยังไม่ถูกเลือก" และ "ยังมีโควตาเหลือ" เป็นอันดับแรก
    const nextQ = sortedQuotas.find(q => !formData.quotaDates.includes(q.dateStr) && q.remaining > 0);
    
    let dateToAdd = priceDateStr || new Date().toISOString().split('T')[0];
    if (nextQ) {
      dateToAdd = nextQ.dateStr;
    } else {
       // ถ้าไม่มีวันไหนเหลือโควตาเลย ให้หาวันที่ยังไม่ถูกเลือกมาแปะไว้ก่อน
       const fallbackQ = sortedQuotas.find(q => !formData.quotaDates.includes(q.dateStr));
       if (fallbackQ) dateToAdd = fallbackQ.dateStr;
    }
    
    setFormData(prev => ({...prev, quotaDates: [...prev.quotaDates, dateToAdd]}));
  };

  // --- Real-time Allocation Logic (ระบบฉีกโควตาอัตโนมัติ) ---
  const calculateAllocation = () => {
    if (formData.type !== 'BUY') return [];
    
    let totalBillWeight = (formData.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    let remainingToAllocate = totalBillWeight;
    let allocations = [];

    const safeQuotaDates = formData.quotaDates.length > 0 ? formData.quotaDates : [priceDateStr];

    for (let i = 0; i < safeQuotaDates.length; i++) {
      const qDate = safeQuotaDates[i];
      const isLast = i === safeQuotaDates.length - 1;
      const capacity = getQuotaRemaining(qDate, editingId);
      
      let allocateHere = 0;
      if (remainingToAllocate > 0) {
        if (isLast) {
          allocateHere = remainingToAllocate;
          remainingToAllocate = 0;
        } else {
          allocateHere = Math.min(Math.max(0, capacity), remainingToAllocate);
          remainingToAllocate -= allocateHere;
        }
      }
      allocations.push({ date: qDate, capacity, allocated: allocateHere, resultingRemaining: capacity - allocateHere });
    }
    return allocations;
  };

  const allocations = calculateAllocation();
  const isAnyQuotaExceeded = allocations.some(a => a.resultingRemaining < 0);

  const formatDateTh = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear() + 543;
    return `${d}/${m}/${y}`;
  };

  useEffect(() => {
    if (!editingId && formData.date) {
      const prefix = formData.type === 'BUY' ? 'REC' : 'INV';
      const newId = generateDocId(prefix, bills, formData.date);
      if (formData.id !== newId) setFormData(prev => ({ ...prev, id: newId }));
    }
  }, [formData.date, formData.type, editingId, bills]);

  useEffect(() => {
    const total = (formData.items || []).reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.price) || 0)), 0);
    setFormData(prev => ({ ...prev, grandTotal: total }));
  }, [formData.items]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerRef.current && !customerRef.current.contains(event.target)) setIsCustomerDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.customerName && !formData.customerId) return addToast('กรุณาระบุชื่อลูกค้า', 'error');
    if (formData.items.length === 0) return addToast('กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ', 'error');
    if (formData.type === 'BUY' && formData.quotaDates.length === 0) return addToast('กรุณาเลือกโควตาอย่างน้อย 1 วัน', 'error');
    
    setLoadingMsg('กำลังฉีกน้ำหนักและบันทึกลงระบบ...');
    setIsLoading(true);

    const payloadToSave = { ...formData, _editingId: editingId };
    const response = await requestAPI('SAVE_DATA', 'Billing', payloadToSave);
    
    if (response.status === 'success') {
      const billId = response.data?.id || formData.id; 

      if (editingId) {
        const oldStocks = (stockData || []).filter(s => s.refId === editingId);
        for (let s of oldStocks) { await requestAPI('DELETE_DATA', 'Stock', { id: s.id }); }
      }

      if (formData.type === 'BUY') {
        // --- กระบวนการฉีกน้ำหนัก (Auto-Split) เข้าสต๊อกแต่ละโควตา ---
        let stockIndexCounter = 1;
        
        for (let item of formData.items) {
          let itemQtyRemaining = Number(item.quantity) || 0;
          if (itemQtyRemaining <= 0) continue;

          for (let alloc of allocations) {
            if (itemQtyRemaining <= 0) break;
            
            // จำกัดสิทธิ์ให้ไอเทมนี้เข้าโควตานี้ได้กี่กิโล (ตามที่ Allocations คำนวณไว้ด้านบน)
            let allowedToTake = Math.min(itemQtyRemaining, alloc.allocated);
            if (alloc === allocations[allocations.length - 1]) {
               // ถ้าเป็นโควตาสุดท้าย ไอเทมที่เหลือยัดลงให้หมด
               allowedToTake = itemQtyRemaining;
            }

            if (allowedToTake <= 0) continue;

            const newStockPayload = {
              id: `${billId}-${stockIndexCounter++}`, 
              refId: billId, 
              date: formData.date, // <--- ใช้วันที่บิลเป๊ะๆ ไม่ทำลายสถิติสต๊อก
              quotaDate: alloc.date, // <--- ฟิลด์ใหม่ผูกโควตา
              productId: item.productId, name: item.name, category: item.category || '',
              quantity: allowedToTake, unit: item.unit || 'กก.', status: 'Active',
              note: `รับซื้อ (บิล ${billId}) [หักโควตา ${formatDateTh(alloc.date)}]`
            };
            await requestAPI('SAVE_DATA', 'Stock', newStockPayload);
            
            itemQtyRemaining -= allowedToTake;
            alloc.allocated -= allowedToTake; // หักลดยอด alloc เผื่อไอเทมชิ้นต่อไป
          }
        }
      } else {
        // --- บิลขายออก (ไม่สนใจโควตา) ---
        for (let i = 0; i < formData.items.length; i++) {
          const item = formData.items[i];
          const qtyChange = (Number(item.quantity) || 0) * -1;
          if (qtyChange === 0) continue; 
          const newStockPayload = {
            id: `${billId}-${i + 1}`, refId: billId, date: formData.date, quotaDate: '',
            productId: item.productId, name: item.name, category: item.category || '',
            quantity: qtyChange, unit: item.unit || 'กก.', status: 'Active',
            note: `ขายออก (บิล ${billId})`
          };
          await requestAPI('SAVE_DATA', 'Stock', newStockPayload);
        }
      }

      addToast(editingId ? 'อัปเดตบิลสำเร็จ' : 'สร้างบิลและหักโควตาอัตโนมัติสำเร็จ', 'success');
      reloadAllData(); 
      onClose();
    }
    setIsLoading(false);
  };

  const handleAddItem = () => setFormData(prev => ({ ...prev, items: [...prev.items, { rowId: Date.now(), productId: '', name: '', quantity: '', price: '', unit: 'กก.' }] }));
  const handleRemoveItem = (rowId) => setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.rowId !== rowId) }));
  
  const handleItemChange = (rowId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.rowId === rowId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'productId') {
            const dailyProduct = dailyItems.find(p => p.id === value);
            const baseProduct = (productData || []).find(p => p.id === value); 
            if (dailyProduct) {
              updatedItem.name = dailyProduct.name;
              updatedItem.price = formData.type === 'BUY' ? dailyProduct.todayPrice : (baseProduct?.sellPrice || '');
              updatedItem.unit = dailyProduct.unit || baseProduct?.unit || 'กก.';
            } else if (baseProduct) {
              updatedItem.name = baseProduct.name;
              updatedItem.price = formData.type === 'BUY' ? baseProduct.buyPrice : baseProduct.sellPrice;
              updatedItem.unit = baseProduct.unit || 'กก.';
            } else {
              updatedItem.name = ''; updatedItem.price = '';
            }
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4 font-body">
      <div className="bg-white rounded-[24px] w-full max-w-4xl shadow-2xl flex flex-col h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center"><BarChart3 className="w-5 h-5" /></div>
            <div>
              <h3 className="font-display text-[18px] font-bold text-slate-800 leading-tight">{isViewOnly ? 'รายละเอียดบิล' : (editingId ? 'แก้ไขบิล' : 'เพิ่มรายการใหม่')}</h3>
              <p className="font-mono-code text-[12px] text-slate-400 uppercase tracking-widest">TRANSACTION DETAILS</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto bg-white space-y-6 flex-1 flex flex-col">
          <div className="flex gap-4 shrink-0">
            <button disabled={isViewOnly} onClick={() => setFormData({...formData, type: 'BUY', category: 'ซื้อของเก่า'})}
              className={`flex-1 py-4 rounded-[20px] border-2 flex flex-col items-center justify-center gap-2 transition-all ${formData.type === 'BUY' ? 'border-sky-500 bg-sky-50 text-sky-600 shadow-sm' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}>
              <ArrowDownCircle className={`w-8 h-8 ${formData.type === 'BUY' ? 'text-sky-500' : 'text-slate-300'}`} />
              <span className="font-bold text-[16px]">บิลรับซื้อ (รายจ่าย)</span>
            </button>
            <button disabled={isViewOnly} onClick={() => setFormData({...formData, type: 'SELL', category: 'ขายของเก่า'})}
              className={`flex-1 py-4 rounded-[20px] border-2 flex flex-col items-center justify-center gap-2 transition-all ${formData.type === 'SELL' ? 'border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}>
              <ArrowUpCircle className={`w-8 h-8 ${formData.type === 'SELL' ? 'text-emerald-500' : 'text-slate-300'}`} />
              <span className="font-bold text-[16px]">บิลขายออก (รายรับ)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 shrink-0">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500">เลขที่รายการ</label>
              <input value={formData.id} readOnly className="w-full h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-500 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500">วันที่ทำรายการ (อิงราคา) <span className="text-rose-500">*</span></label>
              <input disabled={isViewOnly} type="datetime-local" step="1" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full h-[48px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" />
            </div>
            {/* หมวดหมู่ (ย้ายขึ้นมาให้แสดงสำหรับทั้ง BUY และ SELL) */}
            <div className="space-y-1.5 shrink-0">
              <label className="text-[13px] font-medium text-slate-500">หมวดหมู่ <span className="text-rose-500">*</span></label>
              <select disabled={isViewOnly} value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full h-[48px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50">
                <option value="ซื้อของเก่า">ซื้อของเก่า</option><option value="ขายของเก่า">ขายของเก่า</option><option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            {/* โซนเลือกโควตา (เฉพาะบิลรับซื้อ) */}
            {formData.type === 'BUY' && (
              <div className="space-y-1.5 md:col-span-3 bg-slate-50 p-4 rounded-[16px] border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[13px] font-bold text-sky-600 flex items-center gap-1.5"><Lock className="w-4 h-4"/> โควตาที่ต้องการใช้ (หักน้ำหนัก) <span className="text-rose-500">*</span></label>
                  {!isViewOnly && (
                    <button type="button" onClick={handleAddQuotaDate} className="text-[12px] font-bold bg-sky-100 text-sky-600 px-3 py-1.5 rounded-full hover:bg-sky-200 transition-colors flex items-center gap-1">
                      <Plus className="w-3 h-3"/> เพิ่มวันที่โควตา
                    </button>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  {formData.quotaDates.map((qDate, index) => {
                    return (
                      <div key={index} className="flex items-center gap-2">
                         <div className="relative flex-1">
                            <select 
                              disabled={isViewOnly} 
                              value={qDate} 
                              onChange={(e) => {
                                const newDates = [...formData.quotaDates];
                                newDates[index] = e.target.value;
                                setFormData(prev => ({...prev, quotaDates: newDates}));
                              }} 
                              className="w-full h-[48px] px-4 bg-amber-50 border border-amber-200 rounded-[12px] text-[14px] font-bold text-amber-700 outline-none focus:border-amber-500 transition-all appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed"
                            >
                              {availableQuotas.length > 0 ? (
                                availableQuotas.map((q, idx) => (
                                  <option key={idx} value={q.dateStr}>
                                    {formatDateTh(q.dateStr)} (ว่าง {q.remaining.toLocaleString()} {q.unit})
                                  </option>
                                ))
                              ) : <option value={qDate}>{formatDateTh(qDate)} (ไม่มีประวัติโควตา)</option>}
                              {!availableQuotas.some(q => q.dateStr === qDate) && <option value={qDate}>{formatDateTh(qDate)} (ข้อมูลเก่า)</option>}
                            </select>
                            <CalendarClock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600/50 pointer-events-none" />
                         </div>
                         {!isViewOnly && formData.quotaDates.length > 1 && (
                           <button type="button" onClick={() => {
                             const newDates = formData.quotaDates.filter((_, i) => i !== index);
                             setFormData(prev => ({...prev, quotaDates: newDates}));
                           }} className="w-[48px] h-[48px] flex items-center justify-center rounded-[12px] bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors shrink-0">
                             <Trash2 className="w-5 h-5" />
                           </button>
                         )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* กล่องสรุปการแบ่งโควตา (Real-time Preview - แบบกึ่งตาราง) */}
          {formData.type === 'BUY' && (
            <div className={`p-5 rounded-[24px] border-2 ${isAnyQuotaExceeded ? 'bg-rose-50 border-rose-200 shadow-[0_4px_12px_rgba(244,63,94,0.1)]' : 'bg-gradient-to-br from-slate-50 to-sky-50/50 border-sky-200 shadow-[0_4px_12px_rgba(14,165,233,0.08)]'} flex flex-col gap-4 shrink-0 transition-all`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/60 pb-4">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${isAnyQuotaExceeded ? 'bg-rose-100 text-rose-600' : 'bg-white text-sky-500'}`}>
                       {isAnyQuotaExceeded ? <AlertTriangle className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
                    </div>
                    <span className={`text-[16px] font-bold ${isAnyQuotaExceeded ? 'text-rose-700' : 'text-slate-800'}`}>
                       ภาพรวมการจัดสรรน้ำหนัก (ระบบคำนวณให้อัตโนมัติ)
                    </span>
                 </div>
                 <div className="bg-white px-5 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <span className="text-[14px] font-medium text-slate-500">น้ำหนักบิลรวม:</span>
                    <span className="text-[18px] font-display font-bold text-slate-800">{(formData.items || []).reduce((sum, i) => sum + (Number(i.quantity)||0), 0).toLocaleString()} <span className="text-[14px] font-medium text-slate-500">กก.</span></span>
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                 {/* Table Header (แสดงเฉพาะบน Desktop) */}
                 <div className="hidden md:flex items-center px-4 pb-1 text-[13px] font-bold text-slate-500">
                   <div className="w-[160px]">วันที่อ้างอิงโควตา</div>
                   <div className="flex-1 flex items-center justify-between text-center pl-6 pr-2">
                      <div className="w-1/3">โควตาเดิม (กก.)</div>
                      <div className="w-1/3 text-sky-600">หักบิลนี้ (กก.)</div>
                      <div className="w-1/3 text-emerald-600">คงเหลือ (กก.)</div>
                   </div>
                 </div>

                 {allocations.map((alloc, idx) => (
                    <div key={idx} className="bg-white rounded-[20px] p-4 border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center gap-4 transition-colors hover:border-sky-300 hover:shadow-md">
                       
                       {/* Date Badge */}
                       <div className="w-full md:w-[160px] shrink-0">
                         <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center justify-center md:justify-start gap-2.5 w-full md:w-fit">
                            <CalendarClock className="w-5 h-5 text-slate-400" />
                            <span className="text-[15px] font-bold text-slate-700">{formatDateTh(alloc.date)}</span>
                         </div>
                       </div>
                       
                       {/* Flow calculation (แบ่ง 3 คอลัมน์เท่ากันเป๊ะ) */}
                       <div className="flex-1 w-full flex items-center justify-between md:gap-4 relative pl-0 md:pl-6">
                          
                          {/* 1. Original */}
                          <div className="w-1/3 flex flex-col items-center">
                             <span className="md:hidden text-[12px] font-bold text-slate-400 mb-1">โควตาเดิม</span>
                             <span className="text-[16px] md:text-[20px] font-mono-code font-bold text-slate-700">{alloc.capacity.toLocaleString()}</span>
                          </div>
                          
                          <div className="hidden md:flex items-center justify-center text-slate-300">
                             <div className="w-6 lg:w-12 h-[2px] bg-slate-200 rounded-full"></div>
                          </div>
                          
                          {/* 2. Deduct */}
                          <div className="w-1/3 flex flex-col items-center">
                             <span className="md:hidden text-[12px] font-bold text-sky-500 mb-1">หักบิลนี้</span>
                             <span className="text-[16px] md:text-[20px] font-mono-code font-bold text-sky-600">-{alloc.allocated.toLocaleString()}</span>
                          </div>
                          
                          <div className="hidden md:flex items-center justify-center text-slate-300">
                             <ArrowDownCircle className="w-6 h-6 -rotate-90 text-slate-300" />
                          </div>
                          
                          {/* 3. Remaining */}
                          <div className="w-1/3 flex flex-col items-center">
                             <span className="md:hidden text-[12px] font-bold text-slate-400 mb-1">คงเหลือ</span>
                             <span className={`text-[16px] md:text-[20px] font-mono-code font-bold px-4 py-1.5 rounded-xl shadow-sm border ${alloc.resultingRemaining < 0 ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                {alloc.resultingRemaining.toLocaleString()}
                             </span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              {isAnyQuotaExceeded && (
                <div className="bg-rose-100/50 border border-rose-200 rounded-xl p-3.5 flex gap-3 items-start mt-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[13px] md:text-[14px] text-rose-700 font-medium leading-relaxed">
                    <span className="font-bold">ทะลุโควตา!</span> ระบบโควตาวันสุดท้ายจะติดลบ แต่สามารถบันทึกบิลเพื่อรับซื้อของหน้างานได้ตามปกติ (Soft Limit) ระบบจะนำไปหักลบอัตโนมัติเมื่อตั้งโควตาวันถัดไป
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5 shrink-0" ref={customerRef}>
            <label className="text-[13px] font-medium text-slate-500">ค้นหาลูกค้าอ้างอิง (HN, ชื่อ, เบอร์โทร) <span className="text-rose-500">*</span></label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input disabled={isViewOnly} type="text" value={customerSearch} onChange={(e) => { setCustomerSearch(e.target.value); setIsCustomerDropdownOpen(true); if (e.target.value !== formData.customerName) setFormData({...formData, customerId: '', customerName: e.target.value}); }} onFocus={() => setIsCustomerDropdownOpen(true)} className="w-full h-[52px] pl-12 pr-4 bg-white border border-slate-200 rounded-[12px] text-[15px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 placeholder:text-slate-300" placeholder="พิมพ์ชื่อลูกค้า หรือเบอร์โทร..." />
              {isCustomerDropdownOpen && !isViewOnly && (
                <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-60 overflow-y-auto py-2">
                  {(customerData || []).filter(c => (c.name || '').toLowerCase().includes(customerSearch.toLowerCase()) || (c.phone || '').toLowerCase().includes(customerSearch.toLowerCase()) || (c.id || '').toLowerCase().includes(customerSearch.toLowerCase())).length > 0 ? (
                    (customerData || []).filter(c => (c.name || '').toLowerCase().includes(customerSearch.toLowerCase()) || (c.phone || '').toLowerCase().includes(customerSearch.toLowerCase()) || (c.id || '').toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                      <li key={c.id} onClick={() => { setFormData({...formData, customerId: c.id, customerName: c.name}); setCustomerSearch(c.name); setIsCustomerDropdownOpen(false); }} className="px-5 py-3 hover:bg-sky-50 cursor-pointer text-[14px] text-slate-700 border-b border-slate-50 flex items-center justify-between transition-colors">
                        <div className="flex flex-col"><span className="font-bold text-slate-800">{c.name}</span><span className="text-[12px] text-slate-400 font-mono-code">{c.phone || 'ไม่มีเบอร์'}</span></div>
                        <span className="text-[12px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-mono-code">{c.id}</span>
                      </li>
                    ))
                  ) : (<li className="px-4 py-4 text-[14px] text-slate-400 text-center">ไม่พบข้อมูลลูกค้า (สามารถพิมพ์ชื่อใหม่ลงไปได้เลย)</li>)}
                </ul>
              )}
            </div>
          </div>

          <div className="border border-slate-200 rounded-[20px] overflow-hidden flex flex-col shrink-0">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <span className="font-bold text-[14px] text-slate-700">รายการสินค้า/รายละเอียด <span className="text-rose-500">*</span></span>
              {!isViewOnly && <button onClick={handleAddItem} type="button" className="flex items-center gap-1.5 text-[13px] font-bold text-sky-600 bg-sky-100/50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors"><Plus className="w-4 h-4" /> เพิ่มรายการ</button>}
            </div>
            <div className="p-4 space-y-3 bg-white">
              {(formData.items || []).length > 0 && (
                <div className="hidden md:flex flex-row gap-3 px-3 pb-2 text-[13px] font-bold text-slate-500 border-b border-slate-100">
                  <div className="flex-[2]">รายการ</div>
                  <div className="flex-[1] text-center">จำนวน(kg)</div>
                  <div className="flex-[1] text-right pr-2">ราคาต่อหน่วย</div>
                  <div className="flex-[1] text-center pl-2">รวม</div>
                  <div className="w-[32px]"></div>
                </div>
              )}

              {(formData.items || []).map((item, index) => (
                <div key={item.rowId} className="flex flex-col md:flex-row gap-3 items-start md:items-center relative bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div className="w-full md:flex-[2]">
                    <label className="block md:hidden text-[11px] font-bold text-slate-400 mb-1">รายการ</label>
                    <select disabled={isViewOnly} value={item.productId} onChange={(e) => handleItemChange(item.rowId, 'productId', e.target.value)} className={`w-full h-[40px] px-3 bg-white border border-slate-200 rounded-lg text-[14px] outline-none focus:border-sky-500 transition-all disabled:bg-transparent ${dailyItems.length === 0 && !item.productId ? 'text-rose-500' : 'text-slate-700'}`}>
                      {dailyItems.length > 0 ? <option value="">-- เลือกราคารับซื้อวันนี้ --</option> : <option value="">-- ไม่พบการตั้งราคาวันนี้ --</option>}
                      {dailyItems.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
                      {item.productId && !dailyItems.some(p => p.id === item.productId) && <option value={item.productId}>{item.name || item.productId} (ข้อมูลเก่า)</option>}
                    </select>
                  </div>
                  <div className="w-full md:flex-[1]">
                    <label className="block md:hidden text-[11px] font-bold text-slate-400 mb-1">จำนวน(kg)</label>
                    <input disabled={isViewOnly} type="number" value={item.quantity} onChange={(e) => handleItemChange(item.rowId, 'quantity', e.target.value)} className="w-full h-[40px] px-3 bg-white border border-slate-200 rounded-lg text-[14px] text-center font-mono-code outline-none focus:border-sky-500 disabled:bg-transparent" placeholder="0" />
                  </div>
                  <div className="w-full md:flex-[1]">
                    <label className="block md:hidden text-[11px] font-bold text-slate-400 mb-1">ราคาต่อหน่วย</label>
                    <input 
                      disabled={isViewOnly} type="number" id={`price-input-${index}`} value={item.price} 
                      onChange={(e) => handleItemChange(item.rowId, 'price', e.target.value)} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
                          e.preventDefault(); const nextInput = document.getElementById(`price-input-${index + 1}`); if (nextInput) { nextInput.focus(); nextInput.select(); }
                        } else if (e.key === 'Tab' && e.shiftKey) {
                          e.preventDefault(); const prevInput = document.getElementById(`price-input-${index - 1}`); if (prevInput) { prevInput.focus(); prevInput.select(); }
                        }
                      }}
                      className="w-full h-[40px] px-3 bg-white border border-slate-200 rounded-lg text-[14px] text-right font-mono-code outline-none focus:border-sky-500 disabled:bg-transparent" placeholder="0.00" 
                    />
                  </div>
                  <div className="w-full md:flex-[1] text-right md:text-center mt-2 md:mt-0">
                    <label className="inline-block md:hidden text-[11px] font-bold text-slate-400 mr-2">รวม</label>
                    <span className="font-mono-code font-bold text-[16px] text-slate-800">{((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString()}</span>
                  </div>
                  {!isViewOnly && <button tabIndex="-1" onClick={() => handleRemoveItem(item.rowId)} className="absolute -top-2 -right-2 md:static md:w-auto p-1.5 bg-white md:bg-transparent border border-slate-200 md:border-none rounded-full text-slate-300 hover:text-rose-500 shadow-sm md:shadow-none"><Trash2 className="w-4 h-4" /></button>}
                </div>
              ))}
              {(formData.items || []).length === 0 && <div className="text-center text-[13px] text-slate-400 py-4">ยังไม่มีรายการสินค้า กดปุ่ม + เพิ่มรายการ</div>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-end shrink-0 pt-2">
            <div className="w-full flex-1 space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500">ช่องความทรงจำ (Note) <span className="text-rose-500">*</span></label>
              <textarea disabled={isViewOnly} value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-[16px] text-[14px] outline-none resize-none focus:border-sky-500 transition-all disabled:bg-transparent" placeholder="ระบุหมายเหตุ เช่น ทะเบียนรถ, ผู้รับเงิน..." />
            </div>
            <div className="w-full md:w-[300px] bg-slate-50 p-5 rounded-[20px] flex items-center justify-between border border-slate-100">
              <span className="font-bold text-[16px] text-slate-500">รวมเป็นเงิน</span>
              <span className="font-display font-bold text-[32px] text-slate-800 leading-none">{(formData.grandTotal || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="h-[48px] px-8 text-[15px] font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors active:scale-95">{isViewOnly ? 'ปิด' : 'ยกเลิก'}</button>
          {!isViewOnly && <button onClick={handleSave} className="h-[48px] px-8 text-[15px] font-medium text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]"><CheckCircle className="w-5 h-5" /> บันทึกรายการ</button>}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 1. DAILY PRICE MODULE (ราคารับซื้อประจำวัน)
// ==========================================
function DailyPriceModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, dailyPriceData, setDailyPriceData, productData }) {
  const prices = dailyPriceData || []; 
  const [isFetchingTable, setIsFetchingTable] = useState(dailyPriceData === null); 
  const [visibleCount, setVisibleCount] = useState(20); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: '', date: '', items: [], note: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [modalSearch, setModalSearch] = useState('');
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [isViewOnly, setIsViewOnly] = useState(false); 
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);
  const filterRef = useRef(null);

  useStickyScroll(headerRef, filterRef);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsProductDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredPrices = prices.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return ((p.id || '').toLowerCase().includes(q) || (p.date || '').includes(q));
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || '';
    let bValue = b[sortConfig.key] || '';
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredPrices.length > visibleCount) setVisibleCount(prev => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById('scroll-sentinel-price');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredPrices.length]);

  useEffect(() => { setIsFetchingTable(dailyPriceData === null); }, [dailyPriceData]);

  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI('GET_DATA', 'DailyPrices');
    if (response.status === 'success') setDailyPriceData(response.data);
    else setDailyPriceData([]); 
    setIsFetchingTable(false);
  };

  const openModal = (priceEntry = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (priceEntry) {
      setFormData(priceEntry);
      setEditingId(priceEntry.id);
    } else {
      const activeProducts = (productData || []).filter(p => p.status === 'Active').map(p => ({
        id: p.id, name: p.name, category: p.category, unit: p.unit, todayPrice: p.buyPrice || ''
      }));
      const todayStr = new Date().toISOString().split('T')[0];
      setFormData({ id: 'AUTO', date: todayStr, items: activeProducts, note: '' });
      setEditingId(null);
    }
    setProductSearch('');
    setModalSearch(''); 
    setIsModalOpen(true);
    setIsProductDropdownOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) return addToast('กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ', 'error');
    setLoadingMsg('กำลังบันทึกข้อมูลราคารายวัน...');
    setIsLoading(true);
    
    let finalPayload = { ...formData, _editingId: editingId };
    if (!editingId && formData.id === 'AUTO') {
      finalPayload.id = generateDocId('PRC', prices, formData.date);
    }

    const response = await requestAPI('SAVE_DATA', 'DailyPrices', finalPayload);
    if (response.status === 'success') {
      addToast(editingId ? 'อัปเดตราคาสำเร็จ' : 'บันทึกราคารายวันสำเร็จ', 'success');
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI('DELETE_DATA', 'DailyPrices', { id: idToDelete });
    if (response.status === 'success') {
      addToast('ลบประวัติราคาเรียบร้อย', 'success');
      loadData();
    }
    setIsLoading(false);
  };

  const handlePriceChange = (id, newPrice) => {
    setFormData(prev => ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, todayPrice: newPrice } : item) }));
  };

  const handleRemoveItem = (id) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const formatDateTh = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
  };

  return (
    <div className="flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5">
      <div ref={headerRef} className="sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col">
        <div className="w-full pointer-events-auto sticky-header-bg shrink-0">
          <div className="w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner">
            <div>
              <h2 className="font-display font-bold text-slate-800 tracking-tight sticky-header-title">ราคารับซื้อประจำวัน</h2>
              <p className="text-slate-500 sticky-header-desc text-[15px]">กำหนดและตรวจสอบราคารับซื้อสินค้าแบบวันต่อวัน</p>
            </div>
            <button onClick={() => openModal()} className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto">
              <Plus className="w-5 h-5" /> <span className="hidden sm:inline">ตั้งราคาวันนี้</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><Tag className="w-5 h-5"/></div>
              ประวัติตั้งราคา (วัน)
            </div>
            <div className="text-[40px] font-display font-bold text-slate-800 leading-none">{prices.length}</div>
          </div>
        </div>
      </div>

      <div ref={filterRef} className="w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]">
        <div className="w-full mx-auto pointer-events-none relative h-[56px] z-50">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ค้นหาวันที่, รหัส..." className="w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 flex-1">
        <div className="bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th onClick={() => requestSort('date')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">ประจำวันที่ {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th onClick={() => requestSort('id')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">รหัสอ้างอิง {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-center">จำนวนรายการอัปเดตราคา</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isFetchingTable ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16 mx-auto"></div></td>
                      <td className="px-6 py-5 flex justify-end gap-1"><div className="h-8 bg-slate-200 rounded w-24"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredPrices.slice(0, visibleCount).map((entry, index) => (
                    <tr key={`${entry.id}-${index}`} onClick={() => openModal(entry, true)} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-[15px] font-bold text-slate-800">{formatDateTh(entry.date)}</td>
                      <td className="px-6 py-4 font-mono-code text-[14px] text-slate-500">{entry.id}</td>
                      <td className="px-6 py-4 text-[15px] text-slate-600 text-center"><span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[13px] font-bold">{entry.items?.length || 0}</span></td>
                      <td className="px-6 py-4 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openModal(entry, true)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="ดูข้อมูล"><Info className="w-[18px] h-[18px]" /></button>
                        <button onClick={() => openModal(entry, false)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="แก้ไข"><Edit className="w-[18px] h-[18px]" /></button>
                        <button onClick={() => setConfirmDelete({ isOpen: true, id: entry.id })} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors" title="ลบ"><Trash2 className="w-[18px] h-[18px]" /></button>
                      </td>
                    </tr>
                  ))
                )}
                {!isFetchingTable && filteredPrices.length === 0 && (
                  <tr><td colSpan="4" className="text-center p-12 text-slate-400 text-[15px]">ไม่พบประวัติการตั้งราคา</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredPrices.length && (
            <div id="scroll-sentinel-price" className="h-16 flex items-center justify-center text-sky-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-5xl shadow-2xl flex flex-col h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  {isViewOnly ? <Info className="w-6 h-6" /> : <Tag className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-display text-[20px] font-bold text-slate-800 leading-tight">{isViewOnly ? 'รายละเอียดการตั้งราคารายวัน' : (editingId ? 'แก้ไขข้อมูลราคารายวัน' : 'ตั้งค่าราคารับซื้อรายวัน')}</h3>
                  <p className="text-[13px] text-slate-500">{isViewOnly ? 'ประวัติราคาของวันที่เลือก' : 'เพิ่มรายการสินค้าที่จะอัปเดตราคาในวันนี้'}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50/50 space-y-5 flex-1 flex flex-col">
              <div className="flex flex-col md:flex-row gap-4 shrink-0">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-600">วันที่ <span className="text-rose-500">*</span></label>
                  <input disabled={isViewOnly} type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full h-[40px] px-3 bg-white border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" />
                </div>
                <div className="flex-[3] space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-600">หมายเหตุ</label>
                  <input disabled={isViewOnly} type="text" value={formData.note || ''} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full h-[40px] px-3 bg-white border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" placeholder="ใส่หมายเหตุ (ถ้ามี)" />
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-[20px] shadow-sm flex flex-col shrink-0 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 shrink-0 bg-white">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={modalSearch} onChange={(e) => setModalSearch(e.target.value)} placeholder="ค้นหารายการ..." className="w-full h-[44px] pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all" />
                  </div>
                  <div className="relative w-full md:w-[320px]" ref={dropdownRef}>
                    <div className="relative">
                      <PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                      <input disabled={isViewOnly} type="text" value={productSearch} onChange={(e) => { setProductSearch(e.target.value); setIsProductDropdownOpen(true); }} onFocus={() => setIsProductDropdownOpen(true)} className="w-full h-[44px] pl-9 pr-4 bg-emerald-50/20 border border-emerald-200 text-emerald-600 rounded-[12px] text-[14px] font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-emerald-600" placeholder="+ ดึงสินค้าอื่นเข้ารายการวันนี้" />
                    </div>
                    {isProductDropdownOpen && !isViewOnly && (
                      <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                        {(productData || []).filter(p => ((p.name || '').toLowerCase().includes(productSearch.toLowerCase()) || (p.id || '').toLowerCase().includes(productSearch.toLowerCase())) && !(formData.items || []).some(item => item.id === p.id)).length > 0 ? (
                          (productData || []).filter(p => ((p.name || '').toLowerCase().includes(productSearch.toLowerCase()) || (p.id || '').toLowerCase().includes(productSearch.toLowerCase())) && !(formData.items || []).some(item => item.id === p.id)).map(p => (
                            <li key={p.id} className="px-3 py-2 hover:bg-sky-50 cursor-pointer text-[13px] text-slate-700 border-b border-slate-50 last:border-0 flex items-center justify-between"
                              onClick={() => {
                                const newItem = { id: p.id, name: p.name, category: p.category, unit: p.unit, todayPrice: p.buyPrice || '' };
                                setFormData(prev => ({ ...prev, items: [newItem, ...(prev.items || [])] }));
                                setProductSearch(''); setIsProductDropdownOpen(false);
                              }}>
                              <div className="flex items-center gap-2"><span className="font-mono-code text-sky-500 font-bold">[{p.id}]</span><span>{p.name}</span></div>
                              {p.status !== 'Active' && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">Inactive</span>}
                            </li>
                          ))
                        ) : (<li className="px-3 py-3 text-[13px] text-slate-400 text-center">ไม่พบสินค้าอื่นให้เพิ่มแล้ว</li>)}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto bg-white">
                  <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">รหัสสินค้า</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">ชื่อสินค้า</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-center">หมวดหมู่</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-center">ราคาอ้างอิง (DB)</th>
                        <th className="px-6 py-4 font-bold text-sky-500 text-[15px] bg-sky-50/20 w-[180px] text-center border-l border-r border-sky-100/50">ราคารับซื้อวันนี้ (บาท)</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-center w-[80px]">นำออก</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {!(formData.items || []).length ? (
                        <tr><td colSpan="6" className="text-center p-8 text-slate-400 text-[14px]">ไม่มีรายการสินค้า</td></tr>
                      ) : (
                        (formData.items || []).filter(item => {
                          if (!modalSearch) return true;
                          const q = modalSearch.toLowerCase();
                          return (item.id || '').toLowerCase().includes(q) || (item.name || '').toLowerCase().includes(q) || (item.category || '').toLowerCase().includes(q);
                        }).map((item, index) => {
                          const refProduct = (productData || []).find(p => p.id === item.id);
                          return (
                            <tr key={`${item.id}-${index}`} className="hover:bg-slate-50/50">
                              <td className="px-6 py-3 font-mono-code text-[14px] font-bold text-slate-400">{item.id}</td>
                              <td className="px-6 py-3 text-[14px] font-medium text-slate-800">{item.name}</td>
                              <td className="px-6 py-3 text-center">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-[12px] font-medium text-slate-600">{item.category}</span>
                              </td>
                              <td className="px-6 py-3 text-[14px] text-slate-500 font-medium text-center">{refProduct?.buyPrice || '0'}</td>
                              <td className="px-6 py-2 bg-sky-50/10 border-l border-r border-sky-100/30">
                                <div className="flex items-center justify-center gap-2">
                                  <input 
                                    id={`price-input-${index}`}
                                    disabled={isViewOnly}
                                    type="number"
                                    value={item.todayPrice}
                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) {
                                        e.preventDefault();
                                        const nextInput = document.getElementById(`price-input-${index + 1}`);
                                        if (nextInput) { nextInput.focus(); nextInput.select(); }
                                      } else if (e.key === 'Tab' && e.shiftKey) {
                                        e.preventDefault();
                                        const prevInput = document.getElementById(`price-input-${index - 1}`);
                                        if (prevInput) { prevInput.focus(); prevInput.select(); }
                                      }
                                    }}
                                    className="w-[100px] h-[38px] px-3 text-right bg-white border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-[8px] font-mono-code text-[14px] font-bold text-sky-700 outline-none disabled:bg-slate-50 disabled:text-slate-400 shadow-sm"
                                    placeholder="0.00"
                                  />
                                  <span className="text-[13px] text-slate-500 w-8">/{item.unit}</span>
                                </div>
                              </td>
                              <td className="px-6 py-3 text-center">
                                {!isViewOnly && (
                                  <button tabIndex="-1" onClick={() => handleRemoveItem(item.id)} className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors">
                                    <X className="w-5 h-5 mx-auto" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="h-[44px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95">{isViewOnly ? 'ปิดหน้าต่าง' : 'ยกเลิก'}</button>
              {!isViewOnly && <button onClick={handleSave} className="h-[44px] px-6 text-[14px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]"><Save className="w-4 h-4" /> ยืนยันบันทึกประจำวัน</button>}
            </div>
          </div>
        </div>
      )}
      <ConfirmAlert isOpen={confirmDelete.isOpen} onCancel={() => setConfirmDelete({ isOpen: false, id: null })} onConfirm={handleDelete} title="ยืนยันลบ" text="ต้องการลบประวัติการตั้งราคานี้ใช่ไหม" />
    </div>
  );
}

// ==========================================
// 2. LOCK WEIGHT MODULE (โควตาล็อกน้ำหนัก)
// ==========================================
function LockWeightModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, lockData, setLockData, stockData, billingData, openBillModal }) {
  const locks = lockData || []; 
  const [isFetchingTable, setIsFetchingTable] = useState(lockData === null); 
  const [visibleCount, setVisibleCount] = useState(20); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: '', date: '', dailyLimitKg: '', dailyLimitUnit: 'Kg.', note: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [modalSearch, setModalSearch] = useState(''); 
  const [isViewOnly, setIsViewOnly] = useState(false); 
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const headerRef = useRef(null);
  const filterRef = useRef(null);

  useStickyScroll(headerRef, filterRef);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredLocks = locks.filter(l => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return ((l.id || '').toLowerCase().includes(q) || (l.date || '').includes(q));
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || '';
    let bValue = b[sortConfig.key] || '';
    if (sortConfig.key === 'dailyLimitKg') {
      aValue = Number(aValue) || 0; bValue = Number(bValue) || 0;
    }
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredLocks.length > visibleCount) setVisibleCount(prev => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById('scroll-sentinel-lock');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredLocks.length]);

  useEffect(() => { setIsFetchingTable(lockData === null); }, [lockData]);

  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI('GET_DATA', 'DailyLocks');
    if (response.status === 'success') setLockData(response.data);
    else setLockData([]); 
    setIsFetchingTable(false);
  };

  const openModal = (lock = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    setModalSearch('');
    if (lock) {
      setFormData(lock);
      setEditingId(lock.id);
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      setFormData({ id: 'AUTO', date: todayStr, dailyLimitKg: '', dailyLimitUnit: 'Kg.', note: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.dailyLimitKg) return addToast('กรุณาระบุโควตาน้ำหนักรับซื้อ', 'error');
    setLoadingMsg('กำลังบันทึกข้อมูลโควตารายวัน...');
    setIsLoading(true);
    const payload = { ...formData, _editingId: editingId };
    const response = await requestAPI('SAVE_DATA', 'DailyLocks', payload);
    if (response.status === 'success') {
      addToast(editingId ? 'อัปเดตข้อมูลโควตาสำเร็จ' : 'เพิ่มข้อมูลโควตาสำเร็จ', 'success');
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI('DELETE_DATA', 'DailyLocks', { id: idToDelete });
    if (response.status === 'success') {
      addToast('ลบประวัติโควตาเรียบร้อย', 'success');
      loadData();
    }
    setIsLoading(false);
  };

  const formatDateTh = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
  };

  let totalActiveLimit = 0;
  let totalActiveUsed = 0;

  locks.forEach(lock => {
    const lockDateStr = lock.date ? lock.date.split('T')[0] : '';
    const limit = Number(lock.dailyLimitKg) || 0;
    
    // อัปเกรดตัว Filter ให้อ่านจากฟิลด์ quotaDate (ถ้ามี) ก่อนเสมอ
    const used = (stockData || [])
      .filter(s => {
         const matchDate = s.quotaDate === lockDateStr || (!s.quotaDate && (s.date || '').startsWith(lockDateStr));
         return matchDate && (s.refId || '').startsWith('REC');
      })
      .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    
    const rem = limit - used;
    if (rem !== 0) {
      totalActiveLimit += limit;
      totalActiveUsed += used;
    }
  });

  const totalActiveRemaining = totalActiveLimit - totalActiveUsed;
  const quotaUnit = 'Kg.';

  const selectedDateStr = formData.date ? formData.date.split('T')[0] : '';
  
  // ในหน้า Modal ก็ควรอ่านจาก quotaDate เหมือนกัน
  const modalDailyStocks = (stockData || [])
    .filter(s => {
       const matchDate = s.quotaDate === selectedDateStr || (!s.quotaDate && (s.date || '').startsWith(selectedDateStr));
       return matchDate && (s.refId || '').startsWith('REC');
    });

  const totalModalUsedQuota = modalDailyStocks.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
  const modalRemainingQuota = (Number(formData.dailyLimitKg) || 0) - totalModalUsedQuota;

  // สำหรับตารางโชว์บิล ก็ใช้วิธีดึง refId แบบ Unique จาก modalDailyStocks
  const modalBillIds = [...new Set(modalDailyStocks.map(s => s.refId))];
  const modalDailyBills = (billingData || [])
    .filter(b => modalBillIds.includes(b.id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredModalBills = modalDailyBills.filter(b => {
    if(!modalSearch) return true;
    const q = modalSearch.toLowerCase();
    return (b.id || '').toLowerCase().includes(q) || (b.customerName || '').toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5">
      <div ref={headerRef} className="sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col">
        <div className="w-full pointer-events-auto sticky-header-bg shrink-0">
          <div className="w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner">
            <div>
              <h2 className="font-display font-bold text-slate-800 tracking-tight sticky-header-title">โควตาล็อกน้ำหนัก</h2>
              <p className="text-slate-500 sticky-header-desc text-[15px]">กำหนดและตรวจสอบโควตารับซื้อย้อนหลัง</p>
            </div>
            <button onClick={() => openModal()} className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto">
              <Plus className="w-5 h-5" /> <span className="hidden sm:inline">กำหนดโควตาวันนี้</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle className="w-5 h-5"/></div>
              โควต้าคงเหลือรวมที่รับได้
            </div>
            <div className="text-[40px] font-display font-bold text-emerald-500 leading-none">
              {totalActiveRemaining.toLocaleString()} <span className="text-[16px] text-emerald-300 font-medium">{quotaUnit}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500"><ArrowDownCircle className="w-5 h-5"/></div>
              โควต้ารวมที่รับแล้ว
            </div>
            <div className="text-[40px] font-display font-bold text-amber-500 leading-none">
              {totalActiveUsed.toLocaleString()} <span className="text-[16px] text-amber-300 font-medium">{quotaUnit}</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600"><Lock className="w-5 h-5"/></div>
              เป้าหมายโควต้ารวมทั้งหมด
            </div>
            <div className="text-[40px] font-display font-bold text-slate-800 leading-none">
              {totalActiveLimit.toLocaleString()} <span className="text-[16px] text-slate-400 font-medium">{quotaUnit}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={filterRef} className="w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]">
        <div className="w-full mx-auto pointer-events-none relative h-[56px] z-50">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ค้นหาวันที่, รหัส..." className="w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 flex-1">
        <div className="bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th onClick={() => requestSort('date')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">ประจำวันที่ {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th onClick={() => requestSort('id')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">รหัสอ้างอิง {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th onClick={() => requestSort('dailyLimitKg')} className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right cursor-pointer hover:bg-slate-200 transition-colors select-none">โควตาที่ล็อกไว้ {sortConfig.key === 'dailyLimitKg' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right">โควตาที่รับ</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right">โควตาที่เหลือ</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isFetchingTable ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                      <td className="px-6 py-5 flex justify-end gap-1"><div className="h-8 bg-slate-200 rounded w-24"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredLocks.slice(0, visibleCount).map((lock, index) => {
                    const lockDateStr = lock.date ? lock.date.split('T')[0] : '';
                    const totalQuotaRow = Number(lock.dailyLimitKg) || 0;
                    const usedQuotaRow = (stockData || [])
                      .filter(s => {
                         const matchDate = s.quotaDate === lockDateStr || (!s.quotaDate && (s.date || '').startsWith(lockDateStr));
                         return matchDate && (s.refId || '').startsWith('REC');
                      })
                      .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
                    const remainingQuotaRow = totalQuotaRow - usedQuotaRow; // ลบ Math.max เพื่อให้แสดงติดลบได้

                    return (
                      <tr key={`${lock.id}-${index}`} onClick={() => openModal(lock, true)} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                        <td className="px-6 py-4 text-[15px] font-bold text-slate-800">{formatDateTh(lock.date)}</td>
                        <td className="px-6 py-4 font-mono-code text-[14px] text-slate-500">{lock.id}</td>
                        <td className="px-6 py-4 text-[15px] text-sky-600 font-bold text-right">{totalQuotaRow.toLocaleString()} <span className="text-[12px] font-normal text-slate-500 ml-1">{lock.dailyLimitUnit || 'Kg.'}</span></td>
                        <td className="px-6 py-4 text-[15px] text-amber-500 font-bold text-right">{usedQuotaRow.toLocaleString()} <span className="text-[12px] font-normal text-slate-500 ml-1">{lock.dailyLimitUnit || 'Kg.'}</span></td>
                        <td className="px-6 py-4 text-[15px] font-bold text-right">
                          <span className={`${remainingQuotaRow < 0 ? 'text-rose-500 bg-rose-50 px-2 py-1 rounded-md' : 'text-emerald-500'}`}>
                            {remainingQuotaRow.toLocaleString()}
                          </span>
                          <span className="text-[12px] font-normal text-slate-500 ml-1">{lock.dailyLimitUnit || 'Kg.'}</span>
                        </td>
                        <td className="px-6 py-4 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => openModal(lock, true)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="ดูข้อมูล"><Info className="w-[18px] h-[18px]" /></button>
                          <button onClick={() => openModal(lock, false)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="แก้ไข"><Edit className="w-[18px] h-[18px]" /></button>
                          <button onClick={() => setConfirmDelete({ isOpen: true, id: lock.id })} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors" title="ลบ"><Trash2 className="w-[18px] h-[18px]" /></button>
                        </td>
                      </tr>
                    );
                  })
                )}
                {!isFetchingTable && filteredLocks.length === 0 && (
                  <tr><td colSpan="6" className="text-center p-12 text-slate-400 text-[15px]">ไม่พบประวัติโควตาน้ำหนัก</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredLocks.length && (
            <div id="scroll-sentinel-lock" className="h-16 flex items-center justify-center text-sky-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-5xl shadow-2xl flex flex-col h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
                  {isViewOnly ? <Info className="w-6 h-6" /> : <Scale className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-display text-[20px] font-bold text-slate-800 leading-tight">{isViewOnly ? 'รายละเอียดการตั้งค่าโควตา' : (editingId ? 'แก้ไขข้อมูลโควตา' : 'ตั้งค่าล็อกโควตาน้ำหนักรายวัน')}</h3>
                  <p className="text-[13px] text-slate-500">{isViewOnly ? 'ประวัติโควตารับซื้อของวันที่เลือก' : 'กำหนดโควตาและตรวจสอบบิลการรับซื้อในวันนี้'}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50/50 space-y-5 flex-1 flex flex-col">
              <div className="flex flex-col md:flex-row gap-4 shrink-0">
                <div className="flex-1 space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-600">วันที่ <span className="text-rose-500">*</span></label>
                  <input disabled={isViewOnly} type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full h-[40px] px-3 bg-white border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" />
                </div>
                <div className="flex-[3] space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-600">หมายเหตุ</label>
                  <input disabled={isViewOnly} type="text" value={formData.note || ''} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full h-[40px] px-3 bg-white border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" placeholder="ใส่หมายเหตุ (ถ้ามี)" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0">
                <div className="bg-[#0ea5e9] p-6 rounded-[24px] shadow-[0_8px_24px_rgba(14,165,233,0.3)] flex flex-col gap-4 text-white md:col-span-2 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none"><Scale className="w-48 h-48" /></div>
                  <div className="flex items-center gap-2 text-[15px] font-medium text-sky-50 z-10"><Lock className="w-4 h-4"/> โควตารับซื้อรวมวันนี้</div>
                  <div className="flex items-center gap-3 z-10">
                    <div className="flex items-center bg-white/20 border border-white/30 rounded-[12px] backdrop-blur-md overflow-hidden h-[56px] w-full md:w-[320px] shadow-inner">
                      <button type="button" disabled={isViewOnly} onClick={() => setFormData({ ...formData, dailyLimitKg: String(Math.max(0, (Number(formData.dailyLimitKg) || 0) - 100)) })} className="w-[64px] h-full flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-50 border-r border-white/20"><Minus className="w-6 h-6" /></button>
                      <input disabled={isViewOnly} type="number" value={formData.dailyLimitKg} onChange={(e) => setFormData({...formData, dailyLimitKg: e.target.value})} className="flex-1 w-full h-full px-2 bg-transparent font-display font-bold text-[32px] text-white text-center outline-none placeholder:text-white/40 disabled:opacity-100 disabled:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="5000" />
                      <button type="button" disabled={isViewOnly} onClick={() => setFormData({ ...formData, dailyLimitKg: String((Number(formData.dailyLimitKg) || 0) + 100) })} className="w-[64px] h-full flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-50 border-l border-white/20"><Plus className="w-6 h-6" /></button>
                    </div>
                    <select disabled={isViewOnly} value={formData.dailyLimitUnit || 'Kg.'} onChange={(e) => setFormData({...formData, dailyLimitUnit: e.target.value})} className="bg-transparent text-[18px] font-medium text-sky-100 outline-none cursor-pointer hover:text-white transition-colors disabled:opacity-100 disabled:text-white disabled:cursor-not-allowed [&>option]:text-slate-800">
                      <option value="Kg.">Kg.</option><option value="ตัน">ตัน</option><option value="กรัม">กรัม</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm flex flex-col gap-2 justify-center shrink-0">
                  <div className="flex items-center gap-3 text-[14px] font-medium text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600"><Warehouse className="w-4 h-4"/></div>
                    ยอดรับซื้อรวม
                  </div>
                  <div className="text-[48px] font-display font-bold text-slate-800 leading-none ml-1 truncate" title={totalModalUsedQuota.toLocaleString()}>{totalModalUsedQuota.toLocaleString()}</div>
                </div>

                <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm flex flex-col gap-2 justify-center shrink-0">
                  <div className="flex items-center gap-3 text-[14px] font-medium text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle className="w-4 h-4"/></div>
                    โควตาคงเหลือ
                  </div>
                  <div className={`text-[48px] font-display font-bold leading-none ml-1 truncate ${modalRemainingQuota < 0 ? 'text-rose-500' : 'text-emerald-500'}`} title={modalRemainingQuota.toLocaleString()}>{modalRemainingQuota.toLocaleString()}</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-[20px] shadow-sm flex flex-col shrink-0 overflow-hidden flex-1">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 shrink-0 bg-white items-center justify-between">
                  <span className="font-bold text-[14px] text-slate-700 ml-2">รายการรับซื้อประจำวัน ({formatDateTh(selectedDateStr)})</span>
                  <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" value={modalSearch} onChange={(e) => setModalSearch(e.target.value)} placeholder="ค้นหาเลขที่บิล หรือชื่อลูกค้า..." className="w-full h-[40px] pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all" />
                  </div>
                </div>

                <div className="overflow-x-auto bg-white flex-1 min-h-[200px]">
                  <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">เลขที่อ้างอิงบิล</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-center">ประเภท</th>
                        <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">ลูกค้า/อ้างอิง</th>
                        <th className="px-6 py-4 font-bold text-sky-500 text-[15px] bg-sky-50/20 w-[180px] text-right border-l border-r border-sky-100/50">ยอดรวมน้ำหนักของบิลนี้</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredModalBills.length === 0 ? (
                        <tr><td colSpan="4" className="text-center p-8 text-slate-400 text-[14px]">ไม่มีรายการบิลในวันนี้</td></tr>
                      ) : (
                        filteredModalBills.map((bill, index) => {
                          const isBuy = bill.type === 'BUY';
                          const totalWeight = (bill.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
                          return (
                            <tr key={`${bill.id}-${index}`} onClick={() => openBillModal && openBillModal(bill, true)} className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
                              <td className="px-6 py-3 font-mono-code text-[14px] font-bold text-sky-500 group-hover:text-sky-600 transition-colors">{bill.id}</td>
                              <td className="px-6 py-3 text-center">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold ${isBuy ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                  {isBuy ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
                                  {isBuy ? 'รับซื้อ' : 'ขายออก'}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-[14px] font-medium text-slate-800">{bill.customerName || '-'}</td>
                              <td className="px-6 py-3 text-[15px] font-bold text-slate-800 text-right bg-sky-50/10 border-l border-r border-sky-100/30 group-hover:bg-sky-100/30 transition-colors">
                                  {totalWeight.toLocaleString()} <span className="text-[13px] font-normal text-slate-500 ml-1">กก.</span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="h-[44px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95">{isViewOnly ? 'ปิดหน้าต่าง' : 'ยกเลิก'}</button>
              {!isViewOnly && <button onClick={handleSave} className="h-[44px] px-6 text-[14px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]"><Save className="w-4 h-4" /> ยืนยันบันทึกโควตา</button>}
            </div>
          </div>
        </div>
      )}
      <ConfirmAlert isOpen={confirmDelete.isOpen} onCancel={() => setConfirmDelete({ isOpen: false, id: null })} onConfirm={handleDelete} title="ยืนยันลบ" text="ต้องการลบประวัติการตั้งโควตานี้ใช่ไหม" />
    </div>
  );
}

// ==========================================
// 3. CUSTOMER MODULE (ระบบลูกค้า)
// ==========================================
function CustomerModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, customerData, setCustomerData }) {
  const customers = customerData || []; 
  const [isFetchingTable, setIsFetchingTable] = useState(customerData === null); 
  const [visibleCount, setVisibleCount] = useState(20); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', type: 'Regular', phone: '', status: 'Active' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewOnly, setIsViewOnly] = useState(false); 
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' }); 

  const headerRef = useRef(null);
  const filterRef = useRef(null);

  useStickyScroll(headerRef, filterRef);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredCustomers = customers.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return ((c.id || '').toLowerCase().includes(q) || (c.name || '').toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q));
  }).sort((a, b) => {
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredCustomers.length > visibleCount) setVisibleCount(prev => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById('scroll-sentinel-customer');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredCustomers.length]);

  useEffect(() => { setIsFetchingTable(customerData === null); }, [customerData]);

  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI('GET_DATA', 'Customers');
    if (response.status === 'success') setCustomerData(response.data);
    else setCustomerData([]); 
    setIsFetchingTable(false);
  };

  const openModal = (customer = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (customer) {
      setFormData(customer);
      setEditingId(customer.id);
    } else {
      setFormData({ id: 'AUTO', name: '', type: 'Regular', phone: '', status: 'Active' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoadingMsg('กำลังบันทึกข้อมูล...');
    setIsLoading(true);
    const payload = { ...formData, _editingId: editingId };
    const response = await requestAPI('SAVE_DATA', 'Customers', payload);
    if (response.status === 'success') {
      addToast(editingId ? 'อัปเดตข้อมูลสำเร็จ' : 'เพิ่มข้อมูลใหม่สำเร็จ', 'success');
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI('DELETE_DATA', 'Customers', { id: idToDelete });
    if (response.status === 'success') {
      addToast('ลบข้อมูลเรียบร้อยแล้ว', 'success');
      loadData();
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5">
      <div ref={headerRef} className="sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col">
        <div className="w-full pointer-events-auto sticky-header-bg shrink-0">
          <div className="w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner">
            <div>
              <h2 className="font-display font-bold text-slate-800 tracking-tight sticky-header-title">ระบบลูกค้า</h2>
              <p className="text-slate-500 sticky-header-desc text-[15px]">จัดการข้อมูลลูกค้า ศูนย์รวมข้อมูลการซื้อขาย</p>
            </div>
            <button onClick={() => openModal()} className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto">
              <Plus className="w-5 h-5" /> <span className="hidden sm:inline">เพิ่มลูกค้าใหม่</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600"><Users className="w-5 h-5"/></div>
              ลูกค้าทั้งหมด
            </div>
            <div className="text-[40px] font-display font-bold text-slate-800 leading-none">{customers.length}</div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500"><UserCircle className="w-5 h-5"/></div>
              ลูกค้าทั่วไป
            </div>
            <div className="text-[40px] font-display font-bold text-sky-600 leading-none">{customers.filter(c => c.type === 'Regular').length}</div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500"><Users className="w-5 h-5"/></div>
              นิติบุคคล / VIP
            </div>
            <div className="text-[40px] font-display font-bold text-rose-600 leading-none">{customers.filter(c => c.type !== 'Regular').length}</div>
          </div>
        </div>
      </div>

      <div ref={filterRef} className="w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]">
        <div className="w-full mx-auto pointer-events-none relative h-[56px] z-50">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ค้นหาชื่อ, รหัสลูกค้า, หรือเบอร์โทร..." className="w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 flex-1">
        <div className="bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th onClick={() => requestSort('id')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">รหัสลูกค้า {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th onClick={() => requestSort('name')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">ชื่อลูกค้า {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">ประเภท</th>
                  <th onClick={() => requestSort('phone')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">เบอร์ติดต่อ {sortConfig.key === 'phone' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">สถานะ</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isFetchingTable ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                      <td className="px-6 py-5"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                      <td className="px-6 py-5 flex justify-end gap-1"><div className="h-8 bg-slate-200 rounded w-24"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredCustomers.slice(0, visibleCount).map((c, index) => (
                    <tr key={`${c.id}-${index}`} onClick={() => openModal(c, true)} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-mono-code text-[15px] font-bold text-sky-500">{c.id}</td>
                      <td className="px-6 py-4 text-[15px] text-slate-800 font-medium">{c.name}</td>
                      <td className="px-6 py-4 text-[15px] text-slate-600">{c.type === 'Regular' ? 'ลูกค้าทั่วไป' : c.type}</td>
                      <td className="px-6 py-4 font-mono-code text-[15px] text-slate-600">{c.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium border ${c.status === 'Active' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {c.status === 'Active' ? '✔ ยินยอม' : 'ระงับข้อมูล'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="p-2 text-sky-500 hover:bg-sky-50 rounded-[12px] transition-colors" title="พิมพ์"><Printer className="w-[18px] h-[18px]" /></button>
                        <button onClick={() => openModal(c, false)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="แก้ไข"><Edit className="w-[18px] h-[18px]" /></button>
                        <button onClick={() => setConfirmDelete({ isOpen: true, id: c.id })} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors" title="ลบ"><Trash2 className="w-[18px] h-[18px]" /></button>
                      </td>
                    </tr>
                  ))
                )}
                {!isFetchingTable && filteredCustomers.length === 0 && (
                  <tr><td colSpan="6" className="text-center p-12 text-slate-400 text-[15px]">ไม่พบข้อมูลลูกค้าในระบบ</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredCustomers.length && (
            <div id="scroll-sentinel-customer" className="h-16 flex items-center justify-center text-sky-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
                  {isViewOnly ? <Info className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-display text-[20px] font-bold text-slate-800 leading-tight">{isViewOnly ? 'รายละเอียดข้อมูลลูกค้า' : (editingId ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มข้อมูลลูกค้าใหม่')}</h3>
                  <p className="text-[13px] text-slate-500">{isViewOnly ? 'ดูรายละเอียดข้อมูลของลูกค้า' : 'กรอกข้อมูลลูกค้าให้ครบถ้วน'}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50/50 space-y-6 flex-1">
              <div className="bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-5">
                  <div className="flex items-center gap-2 text-sky-600"><UserCircle className="w-5 h-5" /><h4 className="font-bold text-[16px]">ข้อมูลส่วนตัว</h4></div>
                  <div className="flex items-center gap-3">
                    {!isViewOnly && <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[13px] font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors"><Scan className="w-4 h-4" /> สแกนจากกล้อง (OCR)</button>}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[13px] border border-slate-100"><Clock className="w-4 h-4" /> ลงทะเบียน: {new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })} น.</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">รหัสลูกค้า <span className="text-rose-500">*</span></label>
                    <input value={formData.id} readOnly className="w-full h-[44px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-500 outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">คำนำหน้า <span className="text-rose-500">*</span></label>
                    <select disabled={isViewOnly} value={formData.prefix || ''} onChange={(e)=>setFormData({...formData, prefix: e.target.value})} className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed">
                      <option>พิมพ์หรือเลือก</option><option>นาย</option><option>นาง</option><option>นางสาว</option><option>บจก.</option><option>หจก.</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-slate-600">ชื่อ-นามสกุล / ชื่อบริษัท <span className="text-rose-500">*</span></label>
                    <input disabled={isViewOnly} value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">ประเภทลูกค้า <span className="text-rose-500">*</span></label>
                    <select disabled={isViewOnly} value={formData.type} onChange={(e)=>setFormData({...formData, type: e.target.value})} className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed">
                      <option value="Regular">ลูกค้าทั่วไป</option><option value="VIP">VIP</option><option value="Corporate">นิติบุคคล</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">สถานะ <span className="text-rose-500">*</span></label>
                    <select disabled={isViewOnly} value={formData.status} onChange={(e)=>setFormData({...formData, status: e.target.value})} className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed">
                      <option value="Active">ใช้งานปกติ</option><option value="Inactive">ระงับข้อมูล</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-slate-600">หมายเลขบัตรประชาชน / เลขผู้เสียภาษี</label>
                    <input disabled={isViewOnly} placeholder="1-xxxx-xxxxx-xx-x" className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sky-600 border-b border-slate-100 pb-4 mb-5"><MapPin className="w-5 h-5" /><h4 className="font-bold text-[16px]">ข้อมูลติดต่อ</h4></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">เบอร์โทรศัพท์ <span className="text-rose-500">*</span></label>
                    <input disabled={isViewOnly} value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} placeholder="08X-XXX-XXXX" className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">อีเมล</label>
                    <input disabled={isViewOnly} placeholder="example@email.com" className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-slate-600">ที่อยู่</label>
                    <textarea disabled={isViewOnly} placeholder="บ้านเลขที่, ซอย, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์..." className="w-full h-[88px] p-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="h-[44px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95">{isViewOnly ? 'ปิดหน้าต่าง' : 'ยกเลิก'}</button>
              {!isViewOnly && <button onClick={handleSave} className="h-[44px] px-6 text-[14px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]"><CheckCircle className="w-4 h-4" /> บันทึกข้อมูล</button>}
            </div>
          </div>
        </div>
      )}
      <ConfirmAlert isOpen={confirmDelete.isOpen} onCancel={() => setConfirmDelete({ isOpen: false, id: null })} onConfirm={handleDelete} title="ยืนยันลบ" text="ต้องการลบรายการนี้ใช่ไหม" />
    </div>
  );
}

// ==========================================
// 4. PRODUCT MODULE (จัดการสินค้า)
// ==========================================
function ProductModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, productData, setProductData }) {
  const products = productData || []; 
  const [isFetchingTable, setIsFetchingTable] = useState(productData === null); 
  const [visibleCount, setVisibleCount] = useState(20); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', category: 'ทองแดง', unit: 'กก.', buyPrice: '', sellPrice: '', status: 'Active', note: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewOnly, setIsViewOnly] = useState(false); 
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  const headerRef = useRef(null);
  const filterRef = useRef(null);

  useStickyScroll(headerRef, filterRef);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredProducts = products.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return ((p.id || '').toLowerCase().includes(q) || (p.name || '').toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q));
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || '';
    let bValue = b[sortConfig.key] || '';
    if (sortConfig.key === 'buyPrice' || sortConfig.key === 'sellPrice') {
      aValue = Number(aValue) || 0; bValue = Number(bValue) || 0;
    }
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredProducts.length > visibleCount) setVisibleCount(prev => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById('scroll-sentinel-product');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  useEffect(() => { setIsFetchingTable(productData === null); }, [productData]);

  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI('GET_DATA', 'Products');
    if (response.status === 'success') setProductData(response.data);
    else setProductData([]); 
    setIsFetchingTable(false);
  };

  const openModal = (product = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (product) {
      setFormData(product);
      setEditingId(product.id);
    } else {
      setFormData({ id: 'AUTO', name: '', category: 'ทองแดง', unit: 'กก.', buyPrice: '', sellPrice: '', status: 'Active', note: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoadingMsg('กำลังบันทึกข้อมูล...');
    setIsLoading(true);
    const payload = { ...formData, _editingId: editingId };
    const response = await requestAPI('SAVE_DATA', 'Products', payload);
    if (response.status === 'success') {
      addToast(editingId ? 'อัปเดตสินค้าสำเร็จ' : 'เพิ่มสินค้าใหม่สำเร็จ', 'success');
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI('DELETE_DATA', 'Products', { id: idToDelete });
    if (response.status === 'success') {
      addToast('ลบสินค้าเรียบร้อยแล้ว', 'success');
      loadData();
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5">
      <div ref={headerRef} className="sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col">
        <div className="w-full pointer-events-auto sticky-header-bg shrink-0">
          <div className="w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner">
            <div>
              <h2 className="font-display font-bold text-slate-800 tracking-tight sticky-header-title">ระบบสินค้า</h2>
              <p className="text-slate-500 sticky-header-desc text-[15px]">จัดการรายการสินค้า โลหะมีค่า และราคารับซื้อ</p>
            </div>
            <button onClick={() => openModal()} className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto">
              <Plus className="w-5 h-5" /> <span className="hidden sm:inline">เพิ่มสินค้าใหม่</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600"><PackagePlus className="w-5 h-5"/></div>
              สินค้าทั้งหมด
            </div>
            <div className="text-[40px] font-display font-bold text-slate-800 leading-none">{products.length}</div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500"><Box className="w-5 h-5"/></div>
              หมวดทองแดง
            </div>
            <div className="text-[40px] font-display font-bold text-amber-600 leading-none">{products.filter(p => p.category === 'ทองแดง').length}</div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500"><Box className="w-5 h-5"/></div>
              หมวดอลูมิเนียม
            </div>
            <div className="text-[40px] font-display font-bold text-sky-600 leading-none">{products.filter(p => p.category === 'อลูมิเนียม').length}</div>
          </div>
        </div>
      </div>

      <div ref={filterRef} className="w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]">
        <div className="w-full mx-auto pointer-events-none relative h-[56px] z-50">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ค้นหาชื่อ, รหัสสินค้า, หรือหมวดหมู่..." className="w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 flex-1">
        <div className="bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th onClick={() => requestSort('id')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">รหัสสินค้า {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th onClick={() => requestSort('name')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">ชื่อสินค้า {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">หมวดหมู่</th>
                  <th onClick={() => requestSort('buyPrice')} className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right cursor-pointer hover:bg-slate-200 transition-colors select-none">ราคารับซื้อ {sortConfig.key === 'buyPrice' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">สถานะ</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isFetchingTable ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
                      <td className="px-6 py-5"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                      <td className="px-6 py-5 flex justify-end gap-1"><div className="h-8 bg-slate-200 rounded w-24"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredProducts.slice(0, visibleCount).map((p, index) => (
                    <tr key={`${p.id}-${index}`} onClick={() => openModal(p, true)} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                      <td className="px-6 py-4 font-mono-code text-[15px] font-bold text-sky-500">{p.id}</td>
                      <td className="px-6 py-4 text-[15px] text-slate-800 font-medium">{p.name}</td>
                      <td className="px-6 py-4 text-[15px] text-slate-600">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-[13px] font-medium text-slate-600"><Tag className="w-3.5 h-3.5" /> {p.category}</span>
                      </td>
                      <td className="px-6 py-4 text-[15px] text-slate-800 font-bold text-right">
                        {p.buyPrice ? `${Number(p.buyPrice).toLocaleString()} ฿` : '-'} <span className="text-[13px] font-normal text-slate-500">/{p.unit}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium border ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {p.status === 'Active' ? '✔ ใช้งาน' : 'ยกเลิก'}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openModal(p, true)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="ดูข้อมูล"><Info className="w-[18px] h-[18px]" /></button>
                        <button onClick={() => openModal(p, false)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="แก้ไข"><Edit className="w-[18px] h-[18px]" /></button>
                        <button onClick={() => setConfirmDelete({ isOpen: true, id: p.id })} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors" title="ลบ"><Trash2 className="w-[18px] h-[18px]" /></button>
                      </td>
                    </tr>
                  ))
                )}
                {!isFetchingTable && filteredProducts.length === 0 && (
                  <tr><td colSpan="6" className="text-center p-12 text-slate-400 text-[15px]">ไม่พบข้อมูลสินค้าในระบบ</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredProducts.length && (
            <div id="scroll-sentinel-product" className="h-16 flex items-center justify-center text-sky-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center"><Info className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-display text-[20px] font-bold text-slate-800 leading-tight">{isViewOnly ? 'รายละเอียดสินค้า' : (editingId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่')}</h3>
                  <p className="text-[13px] text-slate-500">{isViewOnly ? 'ดูรายละเอียดของสินค้าและราคา' : 'กรอกข้อมูลรายละเอียดและราคาของสินค้า'}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto bg-slate-50/50 space-y-6 flex-1">
              <div className="bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sky-600 border-b border-slate-100 pb-4 mb-5"><Box className="w-5 h-5" /><h4 className="font-bold text-[16px]">ข้อมูลสินค้าพื้นฐาน</h4></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-slate-600">รหัสสินค้า <span className="text-rose-500">*</span></label>
                    <input value={formData.id} readOnly className="w-full h-[44px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-500 outline-none" />
                  </div>
                  <div className="space-y-1.5 md:col-span-3">
                    <label className="text-[13px] font-medium text-slate-600">ชื่อสินค้า <span className="text-rose-500">*</span></label>
                    <input disabled={isViewOnly} value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-slate-600">หมวดหมู่ <span className="text-rose-500">*</span></label>
                    <select disabled={isViewOnly} value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed">
                      <option value="ทองแดง">ทองแดง</option><option value="อลูมิเนียม">อลูมิเนียม</option><option value="ทองเหลือง">ทองเหลือง</option>
                      <option value="สแตนเลส">สแตนเลส</option><option value="เหล็ก">เหล็ก</option><option value="เศษเหล็ก">เศษเหล็ก</option><option value="อื่นๆ">อื่นๆ</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-slate-600">สถานะ <span className="text-rose-500">*</span></label>
                    <select disabled={isViewOnly} value={formData.status} onChange={(e)=>setFormData({...formData, status: e.target.value})} className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed">
                      <option value="Active">ใช้งานปกติ</option><option value="Inactive">ยกเลิก/ไม่รับซื้อ</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 border-b border-slate-100 pb-4 mb-5"><CircleDollarSign className="w-5 h-5" /><h4 className="font-bold text-[16px]">ราคาและหน่วยนับ</h4></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                  <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-slate-600">หน่วยนับ <span className="text-rose-500">*</span></label>
                      <select disabled={isViewOnly} value={formData.unit} onChange={(e)=>setFormData({...formData, unit: e.target.value})} className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed">
                        <option value="กก.">กิโลกรัม (กก.)</option><option value="ตัน">ตัน</option><option value="ชิ้น">ชิ้น</option><option value="เครื่อง">เครื่อง</option>
                      </select>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-slate-600">ราคารับซื้อ (บาท) <span className="text-rose-500">*</span></label>
                      <input disabled={isViewOnly} type="number" value={formData.buyPrice} onChange={(e)=>setFormData({...formData, buyPrice: e.target.value})} placeholder="0.00" className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-slate-600">ราคาขายประเมิน (บาท)</label>
                      <input disabled={isViewOnly} type="number" value={formData.sellPrice} onChange={(e)=>setFormData({...formData, sellPrice: e.target.value})} placeholder="0.00" className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="h-[44px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95">{isViewOnly ? 'ปิดหน้าต่าง' : 'ยกเลิก'}</button>
              {!isViewOnly && <button onClick={handleSave} className="h-[44px] px-6 text-[14px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]"><CheckCircle className="w-4 h-4" /> บันทึกข้อมูล</button>}
            </div>
          </div>
        </div>
      )}
      <ConfirmAlert isOpen={confirmDelete.isOpen} onCancel={() => setConfirmDelete({ isOpen: false, id: null })} onConfirm={handleDelete} title="ยืนยันลบ" text="ต้องการลบสินค้านี้ใช่ไหม" />
    </div>
  );
}

// ==========================================
// 5. STOCK MODULE (สต๊อกสินค้า)
// ==========================================
function StockModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, stockData, setStockData, productData }) {
  const stocks = stockData || []; 
  const [isFetchingTable, setIsFetchingTable] = useState(stockData === null); 
  const [visibleCount, setVisibleCount] = useState(20); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: '', refId: '', date: '', name: '', category: '', quantity: '', unit: '', status: 'Active', note: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewOnly, setIsViewOnly] = useState(false); 
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const dropdownRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const headerRef = useRef(null);
  const filterRef = useRef(null);

  useStickyScroll(headerRef, filterRef);

  useEffect(() => {
    if (!editingId && formData.date && isModalOpen) {
      const newId = generateDocId('ADJ', stocks, formData.date);
      if (formData.id !== newId) setFormData(prev => ({ ...prev, id: newId, refId: newId }));
    }
  }, [formData.date, editingId, isModalOpen, stocks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsProductDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredStocks = stocks.filter(s => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return ((s.refId || s.id || '').toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q));
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || '';
    let bValue = b[sortConfig.key] || '';
    if (sortConfig.key === 'quantity') {
      aValue = Number(aValue) || 0; bValue = Number(bValue) || 0;
    }
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredStocks.length > visibleCount) setVisibleCount(prev => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById('scroll-sentinel-stock');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredStocks.length]);

  useEffect(() => { setIsFetchingTable(stockData === null); }, [stockData]);

  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI('GET_DATA', 'Stock');
    if (response.status === 'success') setStockData(response.data);
    else setStockData([]); 
    setIsFetchingTable(false);
  };

  const openModal = (stock = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (stock) {
      setFormData({ ...stock, date: stock.date || new Date().toISOString().split('T')[0] });
      setEditingId(stock.id);
      setProductSearch(stock.name || ''); 
    } else {
      setFormData({ id: '', refId: '', date: new Date().toISOString().split('T')[0], productId: '', name: '', category: '', quantity: '', unit: '', status: 'Active', note: '' });
      setEditingId(null);
      setProductSearch('');
    }
    setIsModalOpen(true);
    setIsProductDropdownOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if(!formData.name && !formData.productId) return addToast('กรุณาระบุชื่อสินค้า', 'error');
    if(formData.quantity === '') return addToast('กรุณาระบุปริมาณ', 'error');

    setLoadingMsg('กำลังบันทึกข้อมูลสต๊อก...');
    setIsLoading(true);
    const payload = { ...formData, refId: formData.id || editingId, _editingId: editingId };
    
    const response = await requestAPI('SAVE_DATA', 'Stock', payload);
    if (response.status === 'success') {
      addToast(editingId ? 'ปรับปรุงรายการสต๊อกสำเร็จ' : 'เพิ่มรายการประวัติสต๊อกสำเร็จ', 'success');
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI('DELETE_DATA', 'Stock', { id: idToDelete });
    if (response.status === 'success') {
      addToast('ลบรายการประวัติสต๊อกออกแล้ว (ยอดจะเปลี่ยน)', 'success');
      loadData();
    }
    setIsLoading(false);
  };

  const activeProducts = (productData || []).filter(p => p.status === 'Active');
  const summaryCards = activeProducts.map(product => {
    const productStocks = stocks.filter(s => s.productId === product.id || s.name === product.name);
    const totalQty = productStocks
      .filter(s => s.status === 'Active')
      .reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      unit: product.unit || 'กก.',
      totalQty: totalQty
    };
  }).sort((a, b) => b.totalQty - a.totalQty);

  const formatDateTh = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear() + 543;
    if (dateStr.includes('T') && dateStr.length > 10) {
      const hh = String(date.getHours()).padStart(2, '0');
      const mm = String(date.getMinutes()).padStart(2, '0');
      const ss = String(date.getSeconds()).padStart(2, '0');
      return `${d}/${m}/${y} ${hh}:${mm}:${ss}`;
    }
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5">
      <div ref={headerRef} className="sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col">
        <div className="w-full pointer-events-auto sticky-header-bg shrink-0">
          <div className="w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner">
            <div>
              <h2 className="font-display font-bold text-slate-800 tracking-tight sticky-header-title">ระบบสต๊อกสินค้า</h2>
              <p className="text-slate-500 sticky-header-desc text-[15px]">ตรวจสอบปริมาณคงคลัง และประวัติความเคลื่อนไหว</p>
            </div>
            <button onClick={() => openModal()} className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto">
              <Plus className="w-5 h-5" /> <span className="hidden sm:inline">ปรับยอดสต๊อก (Manual)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {summaryCards.length > 0 ? (
            summaryCards.map(item => (
              <div key={item.id} className="bg-white px-4 py-4 rounded-[16px] border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-1 transition-transform hover:-translate-y-1">
                <div className="text-[13px] font-medium text-slate-500 truncate" title={item.name}>{item.name}</div>
                <div className={`text-[24px] font-display font-bold leading-none ${item.totalQty < 0 ? 'text-[#ff2152]' : 'text-sky-500'}`}>
                  {item.totalQty.toLocaleString()} <span className="text-[12px] font-normal text-slate-400 ml-0.5">{item.unit}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white p-6 rounded-[24px] border border-slate-100 text-slate-400 text-[15px] w-full text-center">
              ไม่พบรายการสินค้าที่เปิดใช้งานในระบบ
            </div>
          )}
        </div>
      </div>

      <div ref={filterRef} className="w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]">
        <div className="w-full mx-auto pointer-events-none relative h-[56px] z-50">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ค้นหาชื่อสินค้า, เลขที่บิล/อ้างอิง..." className="w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 flex-1">
        <div className="bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th onClick={() => requestSort('date')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">วันที่/เวลา {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th onClick={() => requestSort('id')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">เลขที่อ้างอิง (บิล) {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th onClick={() => requestSort('name')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">รายการสินค้า {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">ประเภท/หมายเหตุ</th>
                  <th onClick={() => requestSort('quantity')} className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right cursor-pointer hover:bg-slate-200 transition-colors select-none">จำนวน (เข้า/ออก) {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isFetchingTable ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
                      <td className="px-6 py-5"><div className="h-6 bg-slate-200 rounded-full w-20 ml-auto"></div></td>
                      <td className="px-6 py-5 flex justify-end gap-1"><div className="h-8 bg-slate-200 rounded w-24"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredStocks.slice(0, visibleCount).map((s, index) => {
                    const fallbackProduct = (productData || []).find(p => p.id === s.productId || p.name === s.name);
                    const displayUnit = s.unit || (fallbackProduct ? fallbackProduct.unit : 'กก.');
                    const isPositive = Number(s.quantity) > 0;
                    const isNegative = Number(s.quantity) < 0;
                    
                    return (
                    <tr key={`${s.id}-${index}`} onClick={() => openModal(s, true)} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-[14px] text-slate-600">{formatDateTh(s.date)}</td>
                      <td className="px-6 py-4 font-mono-code text-[15px] font-bold text-sky-500">{s.refId || s.id}</td>
                      <td className="px-6 py-4 text-[15px] text-slate-800 font-medium">{s.name}</td>
                      <td className="px-6 py-4 text-[14px] text-slate-600 truncate max-w-[200px]" title={s.note}>{s.note || '-'}</td>
                      <td className="px-6 py-4 text-[15px] font-bold text-right">
                        <span className={`px-3 py-1.5 rounded-lg font-mono-code ${isPositive ? 'bg-emerald-50 text-emerald-600' : isNegative ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                          {isPositive ? '+' : ''}{s.quantity ? Number(s.quantity).toLocaleString() : '0'}
                        </span>
                        <span className="text-[13px] font-normal text-slate-500 ml-1.5 inline-block w-6 text-left">{displayUnit}</span>
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openModal(s, true)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="ดูข้อมูล"><Info className="w-[18px] h-[18px]" /></button>
                        {!(s.refId && (s.refId.startsWith('REC') || s.refId.startsWith('INV'))) && (
                          <button onClick={() => openModal(s, false)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="แก้ไขรายการ"><Edit className="w-[18px] h-[18px]" /></button>
                        )}
                        <button onClick={() => setConfirmDelete({ isOpen: true, id: s.id })} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors" title="ลบรายการนี้"><Trash2 className="w-[18px] h-[18px]" /></button>
                      </td>
                    </tr>
                  )
                })
                )}
                {!isFetchingTable && filteredStocks.length === 0 && (
                  <tr><td colSpan="6" className="text-center p-12 text-slate-400 text-[15px]">ไม่พบประวัติการเคลื่อนไหวสต๊อก</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredStocks.length && (
            <div id="scroll-sentinel-stock" className="h-16 flex items-center justify-center text-sky-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center">
                  {isViewOnly ? <Info className="w-6 h-6" /> : <Box className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-display text-[20px] font-bold text-slate-800 leading-tight">
                    {isViewOnly ? 'รายละเอียดการเคลื่อนไหว' : (editingId ? 'แก้ไขรายการปรับยอด' : 'เพิ่มประวัติสต๊อก (แมนนวล)')}
                  </h3>
                  <p className="text-[13px] text-slate-500">
                    {isViewOnly ? 'ดูประวัติการเข้า-ออกของสินค้านี้' : 'เพิ่มยอดเข้า (+) หรือลบยอดออก (-) ด้วยตัวเอง'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 overflow-y-auto bg-slate-50/50 space-y-6 flex-1 flex flex-col">
              <div className="bg-sky-50 border border-sky-100 rounded-[16px] p-4 flex gap-3 items-start shrink-0">
                <Info className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
                <div className="text-[13px] text-sky-800 leading-relaxed">
                  <span className="font-bold">ระบบบัญชี Transaction:</span> สต๊อกทั้งหมดทำงานแบบประวัติเข้า-ออก 
                  <br />หากต้องการเพิ่มสต๊อกให้ใส่ตัวเลขปกติ (เช่น <span className="font-bold">10</span>) หากต้องการหักสต๊อกให้ใส่เครื่องหมายลบนำหน้า (เช่น <span className="font-bold">-10</span>)
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm shrink-0">
                <div className="flex items-center gap-2 text-sky-600 border-b border-slate-100 pb-4 mb-5"><Box className="w-5 h-5" /><h4 className="font-bold text-[16px]">ข้อมูลสินค้า</h4></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-slate-600">วันที่รายการ <span className="text-rose-500">*</span></label>
                    <input disabled={isViewOnly} type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-slate-600">เลขที่อ้างอิง (บิล) <span className="text-rose-500">*</span></label>
                    <input value={formData.refId || formData.id} readOnly className="w-full h-[44px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-500 outline-none cursor-not-allowed" placeholder="อัตโนมัติ" />
                  </div>
                  
                  <div className="space-y-1.5 md:col-span-2" ref={dropdownRef}>
                    <label className="text-[13px] font-medium text-slate-600">ชื่อสินค้า / รายการอ้างอิง <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <input 
                        disabled={isViewOnly || editingId} 
                        type="text" value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value); setIsProductDropdownOpen(true);
                          if (e.target.value !== formData.name) setFormData({...formData, productId: '', name: e.target.value, category: '', unit: ''});
                        }}
                        onFocus={() => setIsProductDropdownOpen(true)}
                        className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
                        placeholder="ค้นหาสินค้าเพื่อผูกข้อมูล..."
                      />
                      {isProductDropdownOpen && !isViewOnly && !editingId && (
                        <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-60 overflow-y-auto">
                          {(productData || []).filter(p => (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) || (p.id || '').toLowerCase().includes(productSearch.toLowerCase())).length > 0 ? (
                            (productData || []).filter(p => (p.name || '').toLowerCase().includes(productSearch.toLowerCase()) || (p.id || '').toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                              <li key={p.id} className="px-4 py-3 hover:bg-sky-50 cursor-pointer text-[14px] text-slate-700 border-b border-slate-50 flex items-center gap-2"
                                onClick={() => {
                                  setFormData({...formData, productId: p.id, name: p.name, category: p.category, unit: p.unit});
                                  setProductSearch(p.name); setIsProductDropdownOpen(false);
                                }}>
                                <span className="font-mono-code text-[13px] text-sky-500 font-bold bg-sky-50 px-2 py-0.5 rounded-md">[{p.id}]</span><span>{p.name}</span>
                              </li>
                            ))
                          ) : (<li className="px-4 py-4 text-[14px] text-slate-400 text-center">ไม่พบรายการสินค้า สามารถพิมพ์ชื่ออิสระได้</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-medium text-slate-600">หมวดหมู่</label>
                    <input disabled={true} value={formData.category || 'ไม่มีหมวดหมู่'} className="w-full h-[44px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-slate-500 outline-none cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm shrink-0 flex-1">
                <div className="flex items-center gap-2 text-indigo-600 border-b border-slate-100 pb-4 mb-5"><Warehouse className="w-5 h-5" /><h4 className="font-bold text-[16px]">รายการเคลื่อนไหว</h4></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
                  <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[13px] font-medium text-slate-600">จำนวนที่เปลี่ยนแปลง (เข้า +, ออก -) <span className="text-rose-500">*</span></label>
                      <input 
                        disabled={isViewOnly || (formData.refId && (formData.refId.startsWith('REC') || formData.refId.startsWith('INV')))} 
                        type="number" 
                        value={formData.quantity} 
                        onChange={(e)=>setFormData({...formData, quantity: e.target.value})} 
                        placeholder="เช่น 15 หรือ -5" 
                        className="w-full h-[48px] px-4 bg-sky-50/50 border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-[12px] font-mono-code font-bold text-[18px] text-sky-700 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                      />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[13px] font-medium text-slate-600">หน่วยนับ</label>
                      <input disabled={true} value={formData.unit || 'กก.'} className="w-full h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-slate-500 outline-none cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5 md:col-span-3">
                      <label className="text-[13px] font-medium text-slate-600">หมายเหตุ / เหตุผล</label>
                      <textarea disabled={isViewOnly} value={formData.note} onChange={(e)=>setFormData({...formData, note: e.target.value})} placeholder="เช่น ยอดยกมา, สินค้าชำรุดตัดออก..." className="w-full h-[88px] p-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="h-[48px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95">{isViewOnly ? 'ปิดหน้าต่าง' : 'ยกเลิก'}</button>
              {!isViewOnly && (
                <button onClick={handleSave} className="h-[48px] px-8 text-[15px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]">
                  <CheckCircle className="w-5 h-5" /> บันทึกประวัติ
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <ConfirmAlert isOpen={confirmDelete.isOpen} onCancel={() => setConfirmDelete({ isOpen: false, id: null })} onConfirm={handleDelete} title="ยืนยันลบรายการ" text="ยอดรวมของสินค้านี้จะถูกหักลบ/คืนค่าตามรายการนี้ ต้องการลบใช่ไหม?" />
    </div>
  );
}

// ==========================================
// 6. BILLING MODULE (ออกบิลซื้อ/ขาย)
// ==========================================
function BillingModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, billingData, setBillingData, customerData, productData, dailyPriceData, stockData, setStockData, openBillModal }) {
  const bills = billingData || []; 
  const [isFetchingTable, setIsFetchingTable] = useState(billingData === null); 
  const [visibleCount, setVisibleCount] = useState(20); 
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });

  const headerRef = useRef(null);
  const filterRef = useRef(null);

  useStickyScroll(headerRef, filterRef);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const filteredBills = bills.filter(b => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return ((b.id || '').toLowerCase().includes(q) || (b.customerName || '').toLowerCase().includes(q) || (b.type === 'BUY' ? 'ซื้อ' : 'ขาย').includes(q));
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || '';
    let bValue = b[sortConfig.key] || '';
    if (sortConfig.key === 'grandTotal') {
      aValue = Number(aValue) || 0; bValue = Number(bValue) || 0;
    }
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredBills.length > visibleCount) setVisibleCount(prev => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById('scroll-sentinel-billing');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredBills.length]);

  useEffect(() => { setIsFetchingTable(billingData === null); }, [billingData]);

  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI('GET_DATA', 'Billing');
    if (response.status === 'success') setBillingData(response.data);
    else setBillingData([]); 
    setIsFetchingTable(false);
  };

  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    
    setIsLoading(true);
    setLoadingMsg('กำลังลบบิลและย้อนกลับยอดสต๊อก...');
    
    const response = await requestAPI('DELETE_DATA', 'Billing', { id: idToDelete });
    if (response.status === 'success') {
      
      const relatedStocks = (stockData || []).filter(s => s.refId === idToDelete);
      let stockUpdated = false;
      
      for (let s of relatedStocks) {
        const stockRes = await requestAPI('DELETE_DATA', 'Stock', { id: s.id });
        if (stockRes.status === 'success') stockUpdated = true;
      }
      
      if (stockUpdated) {
        const newStockData = await requestAPI('GET_DATA', 'Stock');
        if (newStockData.status === 'success') setStockData(newStockData.data);
      }

      addToast('ลบบิลและย้อนยอดสต๊อกคืนเรียบร้อยแล้ว', 'success');
      loadData();
    }
    setIsLoading(false);
  };

  const formatDateTh = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear() + 543;
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${d}/${m}/${y} ${hh}:${mm}:${ss}`;
  };

  return (
    <div className="flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5">
      <div ref={headerRef} className="sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col">
        <div className="w-full pointer-events-auto sticky-header-bg shrink-0">
          <div className="w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner">
            <div>
              <h2 className="font-display font-bold text-slate-800 tracking-tight sticky-header-title">บิลซื้อ/ขาย</h2>
              <p className="text-slate-500 sticky-header-desc text-[15px]">จัดการประวัติการรับซื้อและขายออกทั้งหมด</p>
            </div>
            <button onClick={() => openBillModal && openBillModal(null, false)} className="flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto">
              <Plus className="w-5 h-5" /> <span className="hidden sm:inline">สร้างบิลใหม่</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600"><FileText className="w-5 h-5"/></div>
              บิลทั้งหมด (รายการ)
            </div>
            <div className="text-[40px] font-display font-bold text-slate-800 leading-none">{bills.length}</div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500"><ArrowDownCircle className="w-5 h-5"/></div>
              บิลรับซื้อ (รายจ่าย)
            </div>
            <div className="text-[40px] font-display font-bold text-sky-600 leading-none">{bills.filter(b => b.type === 'BUY').length}</div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[15px] font-medium text-slate-500">
              <div className="w-10 h-10 rounded-[12px] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500"><ArrowUpCircle className="w-5 h-5"/></div>
              บิลขายออก (รายรับ)
            </div>
            <div className="text-[40px] font-display font-bold text-emerald-600 leading-none">{bills.filter(b => b.type === 'SELL').length}</div>
          </div>
        </div>
      </div>

      <div ref={filterRef} className="w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]">
        <div className="w-full mx-auto pointer-events-none relative h-[56px] z-50">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ค้นหาเลขที่บิล หรือชื่อลูกค้า..." className="w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-8 flex-1">
        <div className="bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th onClick={() => requestSort('date')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">วันที่/เวลา {sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th onClick={() => requestSort('id')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">เลขที่บิล {sortConfig.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px]">ประเภท</th>
                  <th onClick={() => requestSort('customerName')} className="px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none">ลูกค้า/อ้างอิง {sortConfig.key === 'customerName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th onClick={() => requestSort('grandTotal')} className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right cursor-pointer hover:bg-slate-200 transition-colors select-none">ยอดรวม (บาท) {sortConfig.key === 'grandTotal' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '⇅'}</th>
                  <th className="px-6 py-4 font-medium text-slate-500 text-[14px] text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isFetchingTable ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-slate-200 rounded w-20 ml-auto"></div></td>
                      <td className="px-6 py-5 flex justify-end gap-1"><div className="h-8 bg-slate-200 rounded w-24"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredBills.slice(0, visibleCount).map((b, index) => (
                    <tr key={`${b.id}-${index}`} onClick={() => openBillModal && openBillModal(b, true)} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-[14px] text-slate-600">{formatDateTh(b.date)}</td>
                      <td className="px-6 py-4 font-mono-code text-[15px] font-bold text-sky-500">{b.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-bold
                          ${b.type === 'BUY' ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600'}
                        `}>
                          {b.type === 'BUY' ? <ArrowDownCircle className="w-3.5 h-3.5" /> : <ArrowUpCircle className="w-3.5 h-3.5" />}
                          {b.type === 'BUY' ? 'รับซื้อ (จ่าย)' : 'ขายออก (รับ)'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[15px] text-slate-800 font-medium">{b.customerName}</td>
                      <td className="px-6 py-4 text-[16px] font-mono-code font-bold text-slate-800 text-right">
                        {Number(b.grandTotal).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="พิมพ์บิล"><Printer className="w-[18px] h-[18px]" /></button>
                        <button onClick={() => openBillModal && openBillModal(b, false)} className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors" title="แก้ไข"><Edit className="w-[18px] h-[18px]" /></button>
                        <button onClick={() => setConfirmDelete({ isOpen: true, id: b.id })} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors" title="ลบ"><Trash2 className="w-[18px] h-[18px]" /></button>
                      </td>
                    </tr>
                  ))
                )}
                {!isFetchingTable && filteredBills.length === 0 && (
                  <tr><td colSpan="6" className="text-center p-12 text-slate-400 text-[15px]">ไม่พบข้อมูลบิล</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {!isFetchingTable && visibleCount < filteredBills.length && (
            <div id="scroll-sentinel-billing" className="h-16 flex items-center justify-center text-sky-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
          )}
        </div>
      </div>
      
      <ConfirmAlert isOpen={confirmDelete.isOpen} onCancel={() => setConfirmDelete({ isOpen: false, id: null })} onConfirm={handleDelete} title="ยืนยันลบ" text="ต้องการลบบิลและคืนค่ายอดสต๊อกใช่ไหม" />
    </div>
  );
}