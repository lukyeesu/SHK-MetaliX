import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Users,
  Lock,
  PackagePlus,
  Box,
  FileText,
  UserCircle,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Menu,
  UploadCloud,
  Search,
  Printer,
  MapPin,
  Scan,
  Clock,
  Tag,
  CircleDollarSign,
  Warehouse,
  AlertTriangle,
  Scale,
  Save,
  PlusCircle,
  CalendarClock,
  Minus,
  ArrowDownCircle,
  ArrowUpCircle,
  FileDown,
  DollarSign
} from "lucide-react";
const FullPageLoader = ({ message }) => /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-white/80 backdrop-blur-sm z-[99] flex flex-col items-center justify-center font-body" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-12 h-12 text-sky-500 animate-spin mb-4" }), /* @__PURE__ */ React.createElement("div", { className: "bg-white px-6 py-3 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] font-medium text-slate-800 border border-slate-100" }, message || "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1B\u0E23\u0E30\u0E21\u0E27\u0E25\u0E1C\u0E25..."));
const Toast = ({ toasts, removeToast }) => /* @__PURE__ */ React.createElement("div", { className: "fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 font-body items-center pointer-events-none w-full px-4" }, toasts.map((toast) => /* @__PURE__ */ React.createElement("div", { key: toast.id, className: `pointer-events-auto flex items-center w-max max-w-full gap-3 px-5 py-4 rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] text-white transform transition-all duration-300
        ${toast.type === "success" ? "bg-emerald-500" : toast.type === "error" ? "bg-rose-500" : "bg-slate-800"}
      ` }, toast.type === "success" && /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-5 h-5 flex-shrink-0" }), toast.type === "error" && /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-5 h-5 flex-shrink-0" }), toast.type === "info" && /* @__PURE__ */ React.createElement(Info, { className: "w-5 h-5 flex-shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "text-[16px] font-normal leading-[1.6] truncate" }, toast.message), /* @__PURE__ */ React.createElement("button", { onClick: () => removeToast(toast.id), className: "ml-4 opacity-80 hover:opacity-100 transition-opacity p-1 shrink-0" }, /* @__PURE__ */ React.createElement(X, { className: "w-4 h-4" })))));
const ConfirmAlert = ({ isOpen, title, text, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] p-[28px] max-w-sm w-full shadow-[0_8px_32px_rgba(0,0,0,0.04)] transform scale-100 flex flex-col items-center text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4" }, /* @__PURE__ */ React.createElement(AlertCircle, { className: "w-8 h-8 text-rose-500" })), /* @__PURE__ */ React.createElement("h3", { className: "font-display text-[24px] font-bold tracking-[-0.01em] text-slate-800 mb-2" }, title), /* @__PURE__ */ React.createElement("p", { className: "font-body text-[16px] text-slate-600 mb-8 leading-[1.6]" }, text), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 w-full font-body" }, /* @__PURE__ */ React.createElement("button", { onClick: onCancel, className: "flex-1 h-[48px] px-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-[16px] hover:bg-slate-100 font-medium active:scale-95 transition-transform" }, "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"), /* @__PURE__ */ React.createElement("button", { onClick: onConfirm, className: "flex-1 h-[48px] px-4 bg-rose-500 text-white rounded-[16px] hover:bg-rose-600 font-medium active:scale-95 transition-transform shadow-sm" }, "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E01\u0E32\u0E23\u0E25\u0E1A"))));
};
const useStickyScroll = (headerRef, filterRef) => {
  useEffect(() => {
    const mainElement = document.getElementById("main-scroll-container");
    if (!mainElement) return;
    const handleScroll = (e) => {
      if (!headerRef.current || !filterRef.current) return;
      if (headerRef.current.offsetHeight === 0) return;
      const { scrollTop } = e.target;
      const isHeaderScrolled = headerRef.current.classList.contains("is-scrolled");
      if (!isHeaderScrolled && scrollTop > 100) {
        headerRef.current.classList.add("is-scrolled");
      } else if (isHeaderScrolled && scrollTop < 10) {
        headerRef.current.classList.remove("is-scrolled");
      }
      const headerRect = headerRef.current.getBoundingClientRect();
      const filterRect = filterRef.current.getBoundingClientRect();
      if (filterRect.top <= headerRect.bottom + 5) {
        filterRef.current.classList.add("is-scrolled");
      } else {
        filterRef.current.classList.remove("is-scrolled");
      }
    };
    setTimeout(() => {
      if (mainElement && headerRef.current && filterRef.current) {
        if (mainElement.scrollTop > 100) headerRef.current.classList.add("is-scrolled");
        else if (mainElement.scrollTop < 10) headerRef.current.classList.remove("is-scrolled");
      }
    }, 50);
    mainElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainElement.removeEventListener("scroll", handleScroll);
  }, [headerRef, filterRef]);
};
const generateDocId = (prefix, dataArray, dateStr) => {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return "";
  const yy = dateObj.getFullYear().toString().slice(-2);
  const mm = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const prefixWithDate = `${prefix}${yy}${mm}`;
  let maxRunning = 0;
  if (Array.isArray(dataArray)) {
    dataArray.forEach((item) => {
      if (item.id && typeof item.id === "string" && item.id.startsWith(prefixWithDate)) {
        const numPart = parseInt(item.id.slice(prefixWithDate.length), 10);
        if (!isNaN(numPart) && numPart > maxRunning) {
          maxRunning = numPart;
        }
      }
    });
  }
  const nextRunning = (maxRunning + 1).toString().padStart(4, "0");
  return `${prefixWithDate}${nextRunning}`;
};
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvTHxvoyfPAz2eKZy2es-hYSL9Y5n198mNVx3XOJPntCnmC9yHy3LTUOm6GsS-_m7e/exec";
const calculateDynamicQuotas = (locks, stocks, excludeRefId = null) => {
  if (!locks || !stocks) return [];
  const sortedLocks = [...locks].sort((a, b) => new Date(a.date) - new Date(b.date));
  let carryOverUsed = 0;
  return sortedLocks.map((lock, index) => {
    const lockDateStr = lock.date ? lock.date.split("T")[0] : "";
    const limit = Number(lock.dailyLimitKg) || 0;
    const rawUsed = stocks.filter((s) => {
      if (!(s.date || "").startsWith(lockDateStr)) return false;
      if (!(s.refId || "").startsWith("REC")) return false;
      if (excludeRefId && s.refId === excludeRefId) return false;
      return true;
    }).reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    const totalToHandle = rawUsed + carryOverUsed;
    let actualUsed = totalToHandle;
    let remaining = limit - actualUsed;
    if (index < sortedLocks.length - 1 && remaining < 0) {
      carryOverUsed = Math.abs(remaining);
      actualUsed = limit;
      remaining = 0;
    } else {
      carryOverUsed = 0;
    }
    return {
      ...lock,
      dateStr: lockDateStr,
      limit,
      rawUsed,
      used: actualUsed,
      remaining,
      unit: lock.dailyLimitUnit || "Kg."
    };
  });
};
export default function App() {
  const [activeMenu, setActiveMenu] = useState("daily_prices");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [customerData, setCustomerData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [lockData, setLockData] = useState(null);
  const [dailyPriceData, setDailyPriceData] = useState(null);
  const [billingData, setBillingData] = useState(null);
  const [billModalConfig, setBillModalConfig] = useState({ isOpen: false, bill: null, isViewOnly: false });
  const openBillModal = (bill = null, isViewOnly = false) => setBillModalConfig({ isOpen: true, bill, isViewOnly });
  const closeBillModal = () => setBillModalConfig({ isOpen: false, bill: null, isViewOnly: false });
  const loadAllData = async () => {
    requestAPI("GET_DATA", "Customers").then((res) => setCustomerData(res.status === "success" ? res.data : []));
    requestAPI("GET_DATA", "Products").then((res) => setProductData(res.status === "success" ? res.data : []));
    requestAPI("GET_DATA", "Stock").then((res) => setStockData(res.status === "success" ? res.data : []));
    requestAPI("GET_DATA", "DailyLocks").then((res) => setLockData(res.status === "success" ? res.data : []));
    requestAPI("GET_DATA", "DailyPrices").then((res) => setDailyPriceData(res.status === "success" ? res.data : []));
    requestAPI("GET_DATA", "Billing").then((res) => setBillingData(res.status === "success" ? res.data : []));
  };
  useEffect(() => {
    loadAllData();
  }, []);
  useEffect(() => {
    const mainElement = document.getElementById("main-scroll-container");
    if (mainElement) mainElement.scrollTop = 0;
  }, [activeMenu]);
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3e3);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const menus = [
    { id: "daily_prices", label: "\u0E23\u0E32\u0E04\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19", icon: CircleDollarSign },
    { id: "customers", label: "\u0E23\u0E30\u0E1A\u0E1A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32", icon: Users },
    { id: "lock", label: "\u0E42\u0E04\u0E27\u0E15\u0E32\u0E25\u0E47\u0E2D\u0E01\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01", icon: Lock },
    { id: "products", label: "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32", icon: PackagePlus },
    { id: "stock", label: "\u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32", icon: Box },
    { id: "billing", label: "\u0E1A\u0E34\u0E25\u0E0B\u0E37\u0E49\u0E2D/\u0E02\u0E32\u0E22", icon: FileText },
    { id: "employees", label: "\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19", icon: UserCircle },
    { id: "reports", label: "\u0E23\u0E32\u0E22\u0E07\u0E32\u0E19", icon: BarChart3 },
    { id: "settings", label: "\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32", icon: Settings }
  ];
  const requestAPI = async (action, sheetName, payload = {}) => {
    const useMockAPI = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let currentData = JSON.parse(localStorage.getItem(sheetName) || "[]");
          if (action === "GET_DATA") resolve({ status: "success", data: currentData });
          else if (action === "SAVE_DATA") {
            const index = currentData.findIndex((item) => item.id === payload.id);
            if (index >= 0) currentData[index] = payload;
            else currentData.unshift(payload);
            localStorage.setItem(sheetName, JSON.stringify(currentData));
            resolve({ status: "success", message: "Data saved (Mock mode)", data: payload });
          } else if (action === "DELETE_DATA") {
            currentData = currentData.filter((item) => item.id !== payload.id);
            localStorage.setItem(sheetName, JSON.stringify(currentData));
            resolve({ status: "success", message: "Data deleted (Mock mode)" });
          }
        }, 800);
      });
    };
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith("http")) {
      try {
        const cleanUrl = GOOGLE_SCRIPT_URL.trim();
        const response = await fetch(cleanUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action, sheetName, payload })
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
      } catch (error) {
        return useMockAPI();
      }
    }
    return useMockAPI();
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen bg-slate-50 text-slate-800 overflow-hidden relative" }, /* @__PURE__ */ React.createElement("style", { dangerouslySetInnerHTML: { __html: `
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
      ` } }), /* @__PURE__ */ React.createElement("aside", { className: `hidden md:flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200 transition-all duration-300 z-40 ${isSidebarOpen ? "w-[210px]" : "w-[88px]"}` }, /* @__PURE__ */ React.createElement("div", { className: "h-[72px] px-6 flex items-center justify-between border-b border-slate-100" }, isSidebarOpen && /* @__PURE__ */ React.createElement("span", { className: "font-display text-[18px] font-bold tracking-[-0.01em] text-sky-500 truncate" }, "SHK MetaliX"), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsSidebarOpen(!isSidebarOpen), className: "p-2 hover:bg-slate-50 rounded-[12px] transition-colors text-slate-400" }, /* @__PURE__ */ React.createElement(Menu, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("nav", { className: "flex-1 overflow-y-auto py-6 px-4" }, /* @__PURE__ */ React.createElement("ul", { className: "space-y-2" }, menus.map((menu) => /* @__PURE__ */ React.createElement("li", { key: menu.id }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setActiveMenu(menu.id),
      className: `w-full flex items-center gap-4 px-4 h-[48px] rounded-[16px] transition-colors
                    ${activeMenu === menu.id ? "bg-sky-500 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                  `
    },
    /* @__PURE__ */ React.createElement(menu.icon, { className: `w-5 h-5 flex-shrink-0 ${activeMenu === menu.id ? "text-white" : "text-slate-400"}` }),
    isSidebarOpen && /* @__PURE__ */ React.createElement("span", { className: "font-medium text-[15px] truncate" }, menu.label)
  ))))), /* @__PURE__ */ React.createElement("div", { className: "p-4 border-t border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: `flex items-center gap-3 ${isSidebarOpen ? "bg-slate-50 p-3 rounded-[16px]" : "justify-center"}` }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 bg-sky-100 text-sky-600 rounded-[12px] flex items-center justify-center font-bold shadow-sm shrink-0" }, "SK"), isSidebarOpen && /* @__PURE__ */ React.createElement("div", { className: "overflow-hidden" }, /* @__PURE__ */ React.createElement("p", { className: "font-medium text-[14px] truncate" }, "Admin User"), /* @__PURE__ */ React.createElement("p", { className: "text-[12px] text-slate-500 truncate" }, "System Manager"))))), /* @__PURE__ */ React.createElement("main", { className: "flex-1 flex flex-col h-full overflow-hidden relative bg-slate-50" }, /* @__PURE__ */ React.createElement("div", { id: "main-scroll-container", className: "flex-1 overflow-auto relative" }, activeMenu === "daily_prices" ? /* @__PURE__ */ React.createElement(
    DailyPriceModule,
    {
      setIsLoading,
      setLoadingMsg,
      addToast,
      requestAPI,
      dailyPriceData,
      setDailyPriceData,
      productData
    }
  ) : activeMenu === "customers" ? /* @__PURE__ */ React.createElement(
    CustomerModule,
    {
      setIsLoading,
      setLoadingMsg,
      addToast,
      requestAPI,
      customerData,
      setCustomerData
    }
  ) : activeMenu === "lock" ? /* @__PURE__ */ React.createElement(
    LockWeightModule,
    {
      setIsLoading,
      setLoadingMsg,
      addToast,
      requestAPI,
      lockData,
      setLockData,
      stockData,
      billingData,
      openBillModal,
      calculateDynamicQuotas
    }
  ) : activeMenu === "products" ? /* @__PURE__ */ React.createElement(
    ProductModule,
    {
      setIsLoading,
      setLoadingMsg,
      addToast,
      requestAPI,
      productData,
      setProductData
    }
  ) : activeMenu === "stock" ? /* @__PURE__ */ React.createElement(
    StockModule,
    {
      setIsLoading,
      setLoadingMsg,
      addToast,
      requestAPI,
      stockData,
      setStockData,
      productData
    }
  ) : activeMenu === "billing" ? /* @__PURE__ */ React.createElement(
    BillingModule,
    {
      setIsLoading,
      setLoadingMsg,
      addToast,
      requestAPI,
      billingData,
      setBillingData,
      customerData,
      productData,
      dailyPriceData,
      stockData,
      setStockData,
      openBillModal
    }
  ) : /* @__PURE__ */ React.createElement("div", { className: "p-4 md:p-8 h-full" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] border border-slate-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-[28px] h-full flex flex-col items-center justify-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-slate-400 font-display text-[20px]" }, "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1E\u0E31\u0E12\u0E19\u0E32\u0E23\u0E30\u0E1A\u0E1A..."))))), isLoading && /* @__PURE__ */ React.createElement(FullPageLoader, { message: loadingMsg }), /* @__PURE__ */ React.createElement(Toast, { toasts, removeToast }), /* @__PURE__ */ React.createElement(
    GlobalBillModal,
    {
      config: billModalConfig,
      onClose: closeBillModal,
      setIsLoading,
      setLoadingMsg,
      addToast,
      requestAPI,
      billingData,
      customerData,
      productData,
      dailyPriceData,
      lockData,
      stockData,
      reloadAllData: loadAllData
    }
  ));
}
function GlobalBillModal({ config, onClose, setIsLoading, setLoadingMsg, addToast, requestAPI, billingData, customerData, productData, dailyPriceData, lockData, stockData, reloadAllData }) {
  if (!config.isOpen) return null;
  const isViewOnly = config.isViewOnly;
  const editingId = config.bill ? config.bill.id : null;
  const bills = billingData || [];
  const initialFormData = config.bill ? {
    ...config.bill
  } : {
    id: "",
    type: "BUY",
    date: new Date((/* @__PURE__ */ new Date()).getTime() - (/* @__PURE__ */ new Date()).getTimezoneOffset() * 6e4).toISOString().slice(0, 19),
    category: "\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32",
    customerId: "",
    customerName: "",
    items: [{ rowId: Date.now(), productId: "", name: "", quantity: "", price: "", unit: "\u0E01\u0E01." }],
    quotaRefs: [""],
    note: "",
    grandTotal: 0,
    status: "Completed"
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [customerSearch, setCustomerSearch] = useState(config.bill ? config.bill.customerName : "");
  const customerRef = useRef(null);
  const [isQuotaDropdownOpen, setIsQuotaDropdownOpen] = useState(false);
  const quotaRef = useRef(null);
  const priceDateStr = formData.date ? formData.date.split("T")[0] : "";
  const todayPriceList = (dailyPriceData || []).find((p) => (p.date || "").startsWith(priceDateStr));
  const dailyItems = todayPriceList ? todayPriceList.items || [] : [];
  const quotaDateStr = priceDateStr;
  const remainingQuota = dailyLimitKg - usedFromDB - usedFromForm;
  const isQuotaExceeded = formData.type === "BUY" && remainingQuota < 0;
  const availableQuotas = calculateDynamicQuotas(lockData, stockData, editingId).sort((a, b) => new Date(b.dateStr) - new Date(a.dateStr));
  useEffect(() => {
    if (config.isOpen && !config.bill) {
      const defaultQuota = availableQuotas.find((q) => q.remaining > 0);
      setFormData((prev) => ({
        ...prev,
        quotaRefs: [defaultQuota ? defaultQuota.dateStr : prev.date.split("T")[0]]
      }));
    } else if (config.isOpen && config.bill && config.bill.id) {
      const relatedStocks = (stockData || []).filter((s) => s.refId === config.bill.id);
      const uniqueRefs = [...new Set(relatedStocks.map((s) => s.quotaRefDate || s.date?.split("T")[0]).filter(Boolean))];
      setFormData((prev) => ({
        ...prev,
        quotaRefs: uniqueRefs.length > 0 ? uniqueRefs : [config.bill.date ? config.bill.date.split("T")[0] : ""]
      }));
    }
  }, [config.isOpen, config.bill, availableQuotas, stockData]);
  const formatDateTh = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear() + 543;
    return `${d}/${m}/${y}`;
  };
  useEffect(() => {
    if (!editingId && formData.date) {
      const prefix = formData.type === "BUY" ? "REC" : "INV";
      const newId = generateDocId(prefix, bills, formData.date);
      if (formData.id !== newId) setFormData((prev) => ({ ...prev, id: newId }));
    }
  }, [formData.date, formData.type, editingId, bills]);
  useEffect(() => {
    const total = (formData.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0), 0);
    setFormData((prev) => ({ ...prev, grandTotal: total }));
  }, [formData.items]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerRef.current && !customerRef.current.contains(event.target)) setIsCustomerDropdownOpen(false);
      if (quotaRef.current && !quotaRef.current.contains(event.target)) setIsQuotaDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.customerName && !formData.customerId) return addToast("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E0A\u0E37\u0E48\u0E2D\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32", "error");
    if (formData.items.length === 0) return addToast("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 1 \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", "error");
    setLoadingMsg("\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1A\u0E34\u0E25\u0E41\u0E25\u0E30\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E2A\u0E15\u0E4A\u0E2D\u0E01...");
    setIsLoading(true);
    const payload = { ...formData, _editingId: editingId };
    const response = await requestAPI("SAVE_DATA", "Billing", payload);
    if (response.status === "success") {
      const billId = response.data?.id || formData.id;
      if (editingId) {
        const oldStocks = (stockData || []).filter((s) => s.refId === editingId);
        for (let s of oldStocks) {
          await requestAPI("DELETE_DATA", "Stock", { id: s.id });
        }
      }
      const newMultiplier = formData.type === "BUY" ? 1 : -1;
      const timePart = formData.date.includes("T") ? formData.date.split("T")[1] : "00:00:00";
      const stockDateToSave = formData.date;
      for (let i = 0; i < formData.items.length; i++) {
        const item = formData.items[i];
        const qtyChange = (Number(item.quantity) || 0) * newMultiplier;
        if (qtyChange === 0) continue;
        const newStockPayload = {
          id: `${billId}-${i + 1}`,
          refId: billId,
          date: stockDateToSave,
          productId: item.productId,
          name: item.name,
          category: item.category || "",
          quantity: qtyChange,
          unit: item.unit || "\u0E01\u0E01.",
          status: "Active",
          note: formData.type === "BUY" ? `\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D (\u0E1A\u0E34\u0E25 ${billId})` : `\u0E02\u0E32\u0E22\u0E2D\u0E2D\u0E01 (\u0E1A\u0E34\u0E25 ${billId})`
        };
        await requestAPI("SAVE_DATA", "Stock", newStockPayload);
      }
      addToast(editingId ? "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E1A\u0E34\u0E25\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" : "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E1A\u0E34\u0E25\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08", "success");
      reloadAllData();
      onClose();
    }
    setIsLoading(false);
  };
  const handleAddItem = () => setFormData((prev) => ({ ...prev, items: [...prev.items, { rowId: Date.now(), productId: "", name: "", quantity: "", price: "", unit: "\u0E01\u0E01." }] }));
  const handleRemoveItem = (rowId) => setFormData((prev) => ({ ...prev, items: prev.items.filter((item) => item.rowId !== rowId) }));
  const handleItemChange = (rowId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.rowId === rowId) {
          const updatedItem = { ...item, [field]: value };
          if (field === "productId") {
            const dailyProduct = dailyItems.find((p) => p.id === value);
            const baseProduct = (productData || []).find((p) => p.id === value);
            if (dailyProduct) {
              updatedItem.name = dailyProduct.name;
              updatedItem.price = formData.type === "BUY" ? dailyProduct.todayPrice : baseProduct?.sellPrice || "";
              updatedItem.unit = dailyProduct.unit || baseProduct?.unit || "\u0E01\u0E01.";
            } else if (baseProduct) {
              updatedItem.name = baseProduct.name;
              updatedItem.price = formData.type === "BUY" ? baseProduct.buyPrice : baseProduct.sellPrice;
              updatedItem.unit = baseProduct.unit || "\u0E01\u0E01.";
            } else {
              updatedItem.name = "";
              updatedItem.price = "";
            }
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] flex items-center justify-center p-4 font-body" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] w-full max-w-4xl shadow-2xl flex flex-col h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center" }, /* @__PURE__ */ React.createElement(BarChart3, { className: "w-5 h-5" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-display text-[18px] font-bold text-slate-800 leading-tight" }, isViewOnly ? "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E1A\u0E34\u0E25" : editingId ? "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E1A\u0E34\u0E25" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E43\u0E2B\u0E21\u0E48"), /* @__PURE__ */ React.createElement("p", { className: "font-mono-code text-[12px] text-slate-400 uppercase tracking-widest" }, "TRANSACTION DETAILS"))), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors" }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("div", { className: "p-6 overflow-y-auto bg-white space-y-6 flex-1 flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 shrink-0" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      disabled: isViewOnly,
      onClick: () => setFormData({ ...formData, type: "BUY", category: "\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32" }),
      className: `flex-1 py-4 rounded-[20px] border-2 flex flex-col items-center justify-center gap-2 transition-all ${formData.type === "BUY" ? "border-sky-500 bg-sky-50 text-sky-600 shadow-sm" : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"}`
    },
    /* @__PURE__ */ React.createElement(ArrowDownCircle, { className: `w-8 h-8 ${formData.type === "BUY" ? "text-sky-500" : "text-slate-300"}` }),
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-[16px]" }, "\u0E1A\u0E34\u0E25\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D (\u0E23\u0E32\u0E22\u0E08\u0E48\u0E32\u0E22)")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      disabled: isViewOnly,
      onClick: () => setFormData({ ...formData, type: "SELL", category: "\u0E02\u0E32\u0E22\u0E02\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32" }),
      className: `flex-1 py-4 rounded-[20px] border-2 flex flex-col items-center justify-center gap-2 transition-all ${formData.type === "SELL" ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm" : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"}`
    },
    /* @__PURE__ */ React.createElement(ArrowUpCircle, { className: `w-8 h-8 ${formData.type === "SELL" ? "text-emerald-500" : "text-slate-300"}` }),
    /* @__PURE__ */ React.createElement("span", { className: "font-bold text-[16px]" }, "\u0E1A\u0E34\u0E25\u0E02\u0E32\u0E22\u0E2D\u0E2D\u0E01 (\u0E23\u0E32\u0E22\u0E23\u0E31\u0E1A)")
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-500" }, "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"), /* @__PURE__ */ React.createElement("input", { value: formData.id, readOnly: true, className: "w-full h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-500 outline-none" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-500" }, "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E17\u0E33\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 (\u0E2D\u0E34\u0E07\u0E23\u0E32\u0E04\u0E32) ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "datetime-local", step: "1", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }), className: "w-full h-[48px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2 shrink-0" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-500" }, "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), className: "w-full h-[48px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50" }, /* @__PURE__ */ React.createElement("option", { value: "\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32" }, "\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32"), /* @__PURE__ */ React.createElement("option", { value: "\u0E02\u0E32\u0E22\u0E02\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32" }, "\u0E02\u0E32\u0E22\u0E02\u0E2D\u0E07\u0E40\u0E01\u0E48\u0E32"), /* @__PURE__ */ React.createElement("option", { value: "\u0E2D\u0E37\u0E48\u0E19\u0E46" }, "\u0E2D\u0E37\u0E48\u0E19\u0E46")))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 shrink-0", ref: customerRef }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-500" }, "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 (HN, \u0E0A\u0E37\u0E48\u0E2D, \u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23) ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "text", value: customerSearch, onChange: (e) => {
    setCustomerSearch(e.target.value);
    setIsCustomerDropdownOpen(true);
    if (e.target.value !== formData.customerName) setFormData({ ...formData, customerId: "", customerName: e.target.value });
  }, onFocus: () => setIsCustomerDropdownOpen(true), className: "w-full h-[52px] pl-12 pr-4 bg-white border border-slate-200 rounded-[12px] text-[15px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 placeholder:text-slate-300", placeholder: "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E0A\u0E37\u0E48\u0E2D\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23..." }), isCustomerDropdownOpen && !isViewOnly && /* @__PURE__ */ React.createElement("ul", { className: "absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-60 overflow-y-auto py-2" }, (customerData || []).filter((c) => (c.name || "").toLowerCase().includes(customerSearch.toLowerCase()) || (c.phone || "").toLowerCase().includes(customerSearch.toLowerCase()) || (c.id || "").toLowerCase().includes(customerSearch.toLowerCase())).length > 0 ? (customerData || []).filter((c) => (c.name || "").toLowerCase().includes(customerSearch.toLowerCase()) || (c.phone || "").toLowerCase().includes(customerSearch.toLowerCase()) || (c.id || "").toLowerCase().includes(customerSearch.toLowerCase())).map((c) => /* @__PURE__ */ React.createElement("li", { key: c.id, onClick: () => {
    setFormData({ ...formData, customerId: c.id, customerName: c.name });
    setCustomerSearch(c.name);
    setIsCustomerDropdownOpen(false);
  }, className: "px-5 py-3 hover:bg-sky-50 cursor-pointer text-[14px] text-slate-700 border-b border-slate-50 flex items-center justify-between transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-slate-800" }, c.name), /* @__PURE__ */ React.createElement("span", { className: "text-[12px] text-slate-400 font-mono-code" }, c.phone || "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E40\u0E1A\u0E2D\u0E23\u0E4C")), /* @__PURE__ */ React.createElement("span", { className: "text-[12px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-mono-code" }, c.id))) : /* @__PURE__ */ React.createElement("li", { className: "px-4 py-4 text-[14px] text-slate-400 text-center" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 (\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E0A\u0E37\u0E48\u0E2D\u0E43\u0E2B\u0E21\u0E48\u0E25\u0E07\u0E44\u0E1B\u0E44\u0E14\u0E49\u0E40\u0E25\u0E22)")))), /* @__PURE__ */ React.createElement("div", { className: "border border-slate-200 rounded-[20px] overflow-hidden flex flex-col shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-[14px] text-slate-700" }, "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32/\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), !isViewOnly && /* @__PURE__ */ React.createElement("button", { onClick: handleAddItem, type: "button", className: "flex items-center gap-1.5 text-[13px] font-bold text-sky-600 bg-sky-100/50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors" }, /* @__PURE__ */ React.createElement(Plus, { className: "w-4 h-4" }), " \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23")), /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-3 bg-white" }, (formData.items || []).length > 0 && /* @__PURE__ */ React.createElement("div", { className: "hidden md:flex flex-row gap-3 px-3 pb-2 text-[13px] font-bold text-slate-500 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: "flex-[2]" }, "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"), /* @__PURE__ */ React.createElement("div", { className: "flex-[1] text-center" }, "\u0E08\u0E33\u0E19\u0E27\u0E19(kg)"), /* @__PURE__ */ React.createElement("div", { className: "flex-[1] text-right pr-2" }, "\u0E23\u0E32\u0E04\u0E32\u0E15\u0E48\u0E2D\u0E2B\u0E19\u0E48\u0E27\u0E22"), /* @__PURE__ */ React.createElement("div", { className: "flex-[1] text-center pl-2" }, "\u0E23\u0E27\u0E21"), /* @__PURE__ */ React.createElement("div", { className: "w-[32px]" })), (formData.items || []).map((item, index) => /* @__PURE__ */ React.createElement("div", { key: item.rowId, className: "flex flex-col md:flex-row gap-3 items-start md:items-center relative bg-slate-50/50 p-3 rounded-xl border border-slate-100" }, /* @__PURE__ */ React.createElement("div", { className: "w-full md:flex-[2]" }, /* @__PURE__ */ React.createElement("label", { className: "block md:hidden text-[11px] font-bold text-slate-400 mb-1" }, "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"), /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: item.productId, onChange: (e) => handleItemChange(item.rowId, "productId", e.target.value), className: `w-full h-[40px] px-3 bg-white border border-slate-200 rounded-lg text-[14px] outline-none focus:border-sky-500 transition-all disabled:bg-transparent ${dailyItems.length === 0 && !item.productId ? "text-rose-500" : "text-slate-700"}` }, dailyItems.length > 0 ? /* @__PURE__ */ React.createElement("option", { value: "" }, "-- \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E23\u0E32\u0E04\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49 --") : /* @__PURE__ */ React.createElement("option", { value: "" }, "-- \u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E23\u0E32\u0E04\u0E32\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49 --"), dailyItems.map((p) => /* @__PURE__ */ React.createElement("option", { key: p.id, value: p.id }, p.name, " (", p.category, ")")), item.productId && !dailyItems.some((p) => p.id === item.productId) && /* @__PURE__ */ React.createElement("option", { value: item.productId }, item.name || item.productId, " (\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E01\u0E48\u0E32)"))), /* @__PURE__ */ React.createElement("div", { className: "w-full md:flex-[1]" }, /* @__PURE__ */ React.createElement("label", { className: "block md:hidden text-[11px] font-bold text-slate-400 mb-1" }, "\u0E08\u0E33\u0E19\u0E27\u0E19(kg)"), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "number", value: item.quantity, onChange: (e) => handleItemChange(item.rowId, "quantity", e.target.value), className: "w-full h-[40px] px-3 bg-white border border-slate-200 rounded-lg text-[14px] text-center font-mono-code outline-none focus:border-sky-500 disabled:bg-transparent", placeholder: "0" })), /* @__PURE__ */ React.createElement("div", { className: "w-full md:flex-[1]" }, /* @__PURE__ */ React.createElement("label", { className: "block md:hidden text-[11px] font-bold text-slate-400 mb-1" }, "\u0E23\u0E32\u0E04\u0E32\u0E15\u0E48\u0E2D\u0E2B\u0E19\u0E48\u0E27\u0E22"), /* @__PURE__ */ React.createElement(
    "input",
    {
      disabled: isViewOnly,
      type: "number",
      id: `price-input-${index}`,
      value: item.price,
      onChange: (e) => handleItemChange(item.rowId, "price", e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === "Tab" && !e.shiftKey) {
          e.preventDefault();
          const nextInput = document.getElementById(`price-input-${index + 1}`);
          if (nextInput) {
            nextInput.focus();
            nextInput.select();
          }
        } else if (e.key === "Tab" && e.shiftKey) {
          e.preventDefault();
          const prevInput = document.getElementById(`price-input-${index - 1}`);
          if (prevInput) {
            prevInput.focus();
            prevInput.select();
          }
        }
      },
      className: "w-full h-[40px] px-3 bg-white border border-slate-200 rounded-lg text-[14px] text-right font-mono-code outline-none focus:border-sky-500 disabled:bg-transparent",
      placeholder: "0.00"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "w-full md:flex-[1] text-right md:text-center mt-2 md:mt-0" }, /* @__PURE__ */ React.createElement("label", { className: "inline-block md:hidden text-[11px] font-bold text-slate-400 mr-2" }, "\u0E23\u0E27\u0E21"), /* @__PURE__ */ React.createElement("span", { className: "font-mono-code font-bold text-[16px] text-slate-800" }, ((Number(item.quantity) || 0) * (Number(item.price) || 0)).toLocaleString())), !isViewOnly && /* @__PURE__ */ React.createElement("button", { tabIndex: "-1", onClick: () => handleRemoveItem(item.rowId), className: "absolute -top-2 -right-2 md:static md:w-auto p-1.5 bg-white md:bg-transparent border border-slate-200 md:border-none rounded-full text-slate-300 hover:text-rose-500 shadow-sm md:shadow-none" }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-4 h-4" })))), (formData.items || []).length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center text-[13px] text-slate-400 py-4" }, "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 \u0E01\u0E14\u0E1B\u0E38\u0E48\u0E21 + \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"))), formData.type === "BUY" && /* @__PURE__ */ React.createElement("div", { className: "border border-slate-200 rounded-[16px] overflow-hidden shrink-0 mt-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-amber-50 p-4 border-b border-slate-200 flex justify-between items-center" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-amber-800 text-[15px]" }, "\u0E42\u0E04\u0E27\u0E15\u0E49\u0E32\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49 (\u0E2B\u0E31\u0E01\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01)"), /* @__PURE__ */ React.createElement("p", { className: "text-[12px] text-amber-600" }, "\u0E23\u0E30\u0E1A\u0E1A\u0E08\u0E30\u0E01\u0E23\u0E30\u0E08\u0E32\u0E22\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E02\u0E2D\u0E07\u0E1A\u0E34\u0E25\u0E19\u0E35\u0E49\u0E44\u0E1B\u0E15\u0E32\u0E21\u0E42\u0E04\u0E27\u0E15\u0E49\u0E32\u0E17\u0E35\u0E48\u0E04\u0E38\u0E13\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E43\u0E2B\u0E49\u0E15\u0E32\u0E21\u0E25\u0E33\u0E14\u0E31\u0E1A")), /* @__PURE__ */ React.createElement("button", { disabled: isViewOnly, onClick: () => setFormData((prev) => ({ ...prev, quotaRefs: [...prev.quotaRefs || [], ""] })), className: "px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-full text-[13px] font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 disabled:opacity-50" }, /* @__PURE__ */ React.createElement(Plus, { className: "w-4 h-4" }), " \u0E40\u0E1E\u0E34\u0E48\u0E21\u0E42\u0E04\u0E27\u0E15\u0E49\u0E32")), /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-3 bg-white" }, (formData.quotaRefs || [""]).map((qRef, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: qRef, onChange: (e) => {
    const newRefs = [...formData.quotaRefs || [""]];
    newRefs[idx] = e.target.value;
    setFormData({ ...formData, quotaRefs: newRefs });
  }, className: "w-full h-[48px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-amber-500 transition-all disabled:bg-slate-50" }, /* @__PURE__ */ React.createElement("option", { value: "" }, "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E42\u0E04\u0E27\u0E15\u0E32\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48..."), availableQuotas.map((q) => /* @__PURE__ */ React.createElement("option", { key: q.dateStr, value: q.dateStr }, formatDateTh(q.dateStr), " (\u0E40\u0E2B\u0E25\u0E37\u0E2D ", q.remaining.toLocaleString(), " ", q.unit, ")")))), idx > 0 && !isViewOnly && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    const newRefs = [...formData.quotaRefs || []];
    newRefs.splice(idx, 1);
    setFormData({ ...formData, quotaRefs: newRefs });
  }, className: "w-10 h-10 rounded-[12px] flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-colors shrink-0" }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" })))))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row gap-6 items-end shrink-0 pt-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-full flex-1 space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-500" }, "\u0E0A\u0E48\u0E2D\u0E07\u0E04\u0E27\u0E32\u0E21\u0E17\u0E23\u0E07\u0E08\u0E33 (Note) ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("textarea", { disabled: isViewOnly, value: formData.note, onChange: (e) => setFormData({ ...formData, note: e.target.value }), className: "w-full h-[80px] p-4 bg-slate-50 border border-slate-200 rounded-[16px] text-[14px] outline-none resize-none focus:border-sky-500 transition-all disabled:bg-transparent", placeholder: "\u0E23\u0E30\u0E1A\u0E38\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38 \u0E40\u0E0A\u0E48\u0E19 \u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19\u0E23\u0E16, \u0E1C\u0E39\u0E49\u0E23\u0E31\u0E1A\u0E40\u0E07\u0E34\u0E19..." })), /* @__PURE__ */ React.createElement("div", { className: "w-full md:w-[300px] bg-slate-50 p-5 rounded-[20px] flex items-center justify-between border border-slate-100" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-[16px] text-slate-500" }, "\u0E23\u0E27\u0E21\u0E40\u0E1B\u0E47\u0E19\u0E40\u0E07\u0E34\u0E19"), /* @__PURE__ */ React.createElement("span", { className: "font-display font-bold text-[32px] text-slate-800 leading-none" }, (formData.grandTotal || 0).toLocaleString())))), /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "h-[48px] px-8 text-[15px] font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors active:scale-95" }, isViewOnly ? "\u0E1B\u0E34\u0E14" : "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"), !isViewOnly && /* @__PURE__ */ React.createElement("button", { onClick: handleSave, className: "h-[48px] px-8 text-[15px] font-medium text-white bg-sky-500 rounded-xl hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-5 h-5" }), " \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"))));
}
function DailyPriceModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, dailyPriceData, setDailyPriceData, productData }) {
  const prices = dailyPriceData || [];
  const [isFetchingTable, setIsFetchingTable] = useState(dailyPriceData === null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: "", date: "", items: [], note: "" });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [modalSearch, setModalSearch] = useState("");
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
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
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };
  const filteredPrices = prices.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (p.id || "").toLowerCase().includes(q) || (p.date || "").includes(q);
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredPrices.length > visibleCount) setVisibleCount((prev) => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById("scroll-sentinel-price");
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredPrices.length]);
  useEffect(() => {
    setIsFetchingTable(dailyPriceData === null);
  }, [dailyPriceData]);
  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI("GET_DATA", "DailyPrices");
    if (response.status === "success") setDailyPriceData(response.data);
    else setDailyPriceData([]);
    setIsFetchingTable(false);
  };
  const openModal = (priceEntry = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (priceEntry) {
      setFormData(priceEntry);
      setEditingId(priceEntry.id);
    } else {
      const activeProducts = (productData || []).filter((p) => p.status === "Active").map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        unit: p.unit,
        todayPrice: p.buyPrice || ""
      }));
      const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      setFormData({ id: "AUTO", date: todayStr, items: activeProducts, note: "" });
      setEditingId(null);
    }
    setProductSearch("");
    setModalSearch("");
    setIsModalOpen(true);
    setIsProductDropdownOpen(false);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) return addToast("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22 1 \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", "error");
    setLoadingMsg("\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E23\u0E32\u0E04\u0E32\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19...");
    setIsLoading(true);
    let finalPayload = { ...formData, _editingId: editingId };
    if (!editingId && formData.id === "AUTO") {
      finalPayload.id = generateDocId("PRC", prices, formData.date);
    }
    const response = await requestAPI("SAVE_DATA", "DailyPrices", finalPayload);
    if (response.status === "success") {
      addToast(editingId ? "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E23\u0E32\u0E04\u0E32\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" : "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E23\u0E32\u0E04\u0E32\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08", "success");
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };
  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI("DELETE_DATA", "DailyPrices", { id: idToDelete });
    if (response.status === "success") {
      addToast("\u0E25\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E23\u0E32\u0E04\u0E32\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22", "success");
      loadData();
    }
    setIsLoading(false);
  };
  const handlePriceChange = (id, newPrice) => {
    setFormData((prev) => ({ ...prev, items: prev.items.map((item) => item.id === id ? { ...item, todayPrice: newPrice } : item) }));
  };
  const handleRemoveItem = (id) => {
    setFormData((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  };
  const formatDateTh = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5" }, /* @__PURE__ */ React.createElement("div", { ref: headerRef, className: "sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "w-full pointer-events-auto sticky-header-bg shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "font-display font-bold text-slate-800 tracking-tight sticky-header-title" }, "\u0E23\u0E32\u0E04\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-500 sticky-header-desc text-[15px]" }, "\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E41\u0E25\u0E30\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E23\u0E32\u0E04\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E41\u0E1A\u0E1A\u0E27\u0E31\u0E19\u0E15\u0E48\u0E2D\u0E27\u0E31\u0E19")), /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(), className: "flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto" }, /* @__PURE__ */ React.createElement(Plus, { className: "w-5 h-5" }), " ", /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "\u0E15\u0E31\u0E49\u0E07\u0E23\u0E32\u0E04\u0E32\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49"))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600" }, /* @__PURE__ */ React.createElement(Tag, { className: "w-5 h-5" })), "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E15\u0E31\u0E49\u0E07\u0E23\u0E32\u0E04\u0E32 (\u0E27\u0E31\u0E19)"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-slate-800 leading-none" }, prices.length)))), /* @__PURE__ */ React.createElement("div", { ref: filterRef, className: "w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto pointer-events-none relative h-[56px] z-50" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48, \u0E23\u0E2B\u0E31\u0E2A...", className: "w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" }))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse whitespace-nowrap min-w-[800px]" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50/50 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("date"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 ", sortConfig.key === "date" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("id"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E23\u0E2B\u0E31\u0E2A\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 ", sortConfig.key === "id" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-center" }, "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E23\u0E32\u0E04\u0E32"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-50" }, isFetchingTable ? Array(5).fill(0).map((_, i) => /* @__PURE__ */ React.createElement("tr", { key: `skeleton-${i}`, className: "animate-pulse" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-24" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-20" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-16 mx-auto" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5 flex justify-end gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "h-8 bg-slate-200 rounded w-24" })))) : filteredPrices.slice(0, visibleCount).map((entry, index) => /* @__PURE__ */ React.createElement("tr", { key: `${entry.id}-${index}`, onClick: () => openModal(entry, true), className: "hover:bg-slate-50/70 transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] font-bold text-slate-800" }, formatDateTh(entry.date)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 font-mono-code text-[14px] text-slate-500" }, entry.id), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-slate-600 text-center" }, /* @__PURE__ */ React.createElement("span", { className: "bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[13px] font-bold" }, entry.items?.length || 0)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 flex justify-end gap-1", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(entry, true), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E14\u0E39\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" }, /* @__PURE__ */ React.createElement(Info, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(entry, false), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E41\u0E01\u0E49\u0E44\u0E02" }, /* @__PURE__ */ React.createElement(Edit, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmDelete({ isOpen: true, id: entry.id }), className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors", title: "\u0E25\u0E1A" }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-[18px] h-[18px]" }))))), !isFetchingTable && filteredPrices.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "4", className: "text-center p-12 text-slate-400 text-[15px]" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E23\u0E32\u0E04\u0E32"))))), !isFetchingTable && visibleCount < filteredPrices.length && /* @__PURE__ */ React.createElement("div", { id: "scroll-sentinel-price", className: "h-16 flex items-center justify-center text-sky-500" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-6 h-6 animate-spin" })))), isModalOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] w-full max-w-5xl shadow-2xl flex flex-col h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center" }, isViewOnly ? /* @__PURE__ */ React.createElement(Info, { className: "w-6 h-6" }) : /* @__PURE__ */ React.createElement(Tag, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-display text-[20px] font-bold text-slate-800 leading-tight" }, isViewOnly ? "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E23\u0E32\u0E04\u0E32\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19" : editingId ? "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E23\u0E32\u0E04\u0E32\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19" : "\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E23\u0E32\u0E04\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19"), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-slate-500" }, isViewOnly ? "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E23\u0E32\u0E04\u0E32\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E35\u0E48\u0E08\u0E30\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E23\u0E32\u0E04\u0E32\u0E43\u0E19\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49"))), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors" }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("div", { className: "p-6 overflow-y-auto bg-slate-50/50 space-y-5 flex-1 flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row gap-4 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "date", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }), className: "w-full h-[40px] px-3 bg-white border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" })), /* @__PURE__ */ React.createElement("div", { className: "flex-[3] space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38"), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "text", value: formData.note || "", onChange: (e) => setFormData({ ...formData, note: e.target.value }), className: "w-full h-[40px] px-3 bg-white border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500", placeholder: "\u0E43\u0E2A\u0E48\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38 (\u0E16\u0E49\u0E32\u0E21\u0E35)" }))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-slate-200/60 rounded-[20px] shadow-sm flex flex-col shrink-0 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 shrink-0 bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: modalSearch, onChange: (e) => setModalSearch(e.target.value), placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23...", className: "w-full h-[44px] pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all" })), /* @__PURE__ */ React.createElement("div", { className: "relative w-full md:w-[320px]", ref: dropdownRef }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(PlusCircle, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" }), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "text", value: productSearch, onChange: (e) => {
    setProductSearch(e.target.value);
    setIsProductDropdownOpen(true);
  }, onFocus: () => setIsProductDropdownOpen(true), className: "w-full h-[44px] pl-9 pr-4 bg-emerald-50/20 border border-emerald-200 text-emerald-600 rounded-[12px] text-[14px] font-medium outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-400 placeholder:text-emerald-600", placeholder: "+ \u0E14\u0E36\u0E07\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2D\u0E37\u0E48\u0E19\u0E40\u0E02\u0E49\u0E32\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49" })), isProductDropdownOpen && !isViewOnly && /* @__PURE__ */ React.createElement("ul", { className: "absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-48 overflow-y-auto" }, (productData || []).filter((p) => ((p.name || "").toLowerCase().includes(productSearch.toLowerCase()) || (p.id || "").toLowerCase().includes(productSearch.toLowerCase())) && !(formData.items || []).some((item) => item.id === p.id)).length > 0 ? (productData || []).filter((p) => ((p.name || "").toLowerCase().includes(productSearch.toLowerCase()) || (p.id || "").toLowerCase().includes(productSearch.toLowerCase())) && !(formData.items || []).some((item) => item.id === p.id)).map((p) => /* @__PURE__ */ React.createElement(
    "li",
    {
      key: p.id,
      className: "px-3 py-2 hover:bg-sky-50 cursor-pointer text-[13px] text-slate-700 border-b border-slate-50 last:border-0 flex items-center justify-between",
      onClick: () => {
        const newItem = { id: p.id, name: p.name, category: p.category, unit: p.unit, todayPrice: p.buyPrice || "" };
        setFormData((prev) => ({ ...prev, items: [newItem, ...prev.items || []] }));
        setProductSearch("");
        setIsProductDropdownOpen(false);
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-mono-code text-sky-500 font-bold" }, "[", p.id, "]"), /* @__PURE__ */ React.createElement("span", null, p.name)),
    p.status !== "Active" && /* @__PURE__ */ React.createElement("span", { className: "text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded" }, "Inactive")
  )) : /* @__PURE__ */ React.createElement("li", { className: "px-3 py-3 text-[13px] text-slate-400 text-center" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2D\u0E37\u0E48\u0E19\u0E43\u0E2B\u0E49\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E41\u0E25\u0E49\u0E27")))), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto bg-white" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse whitespace-nowrap min-w-[700px]" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E23\u0E2B\u0E31\u0E2A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-center" }, "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-center" }, "\u0E23\u0E32\u0E04\u0E32\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 (DB)"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-bold text-sky-500 text-[15px] bg-sky-50/20 w-[180px] text-center border-l border-r border-sky-100/50" }, "\u0E23\u0E32\u0E04\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49 (\u0E1A\u0E32\u0E17)"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-center w-[80px]" }, "\u0E19\u0E33\u0E2D\u0E2D\u0E01"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-100" }, !(formData.items || []).length ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "7", className: "text-center p-8 text-slate-400 text-[14px]" }, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32")) : (formData.items || []).filter((item) => {
    if (!modalSearch) return true;
    const q = modalSearch.toLowerCase();
    return (item.id || "").toLowerCase().includes(q) || (item.name || "").toLowerCase().includes(q) || (item.category || "").toLowerCase().includes(q);
  }).map((item, index) => {
    const refProduct = (productData || []).find((p) => p.id === item.id);
    return /* @__PURE__ */ React.createElement("tr", { key: `${item.id}-${index}`, className: "hover:bg-slate-50/50" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 font-mono-code text-[14px] font-bold text-slate-400" }, item.id), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-[14px] font-medium text-slate-800" }, item.name), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-center" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-[12px] font-medium text-slate-600" }, item.category)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-[14px] text-slate-500 font-medium text-center" }, refProduct?.buyPrice || "0"), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-2 bg-sky-50/10 border-l border-r border-sky-100/30" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-2" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        id: `price-input-${index}`,
        disabled: isViewOnly,
        type: "number",
        value: item.todayPrice,
        onChange: (e) => handlePriceChange(item.id, e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            const nextInput = document.getElementById(`price-input-${index + 1}`);
            if (nextInput) {
              nextInput.focus();
              nextInput.select();
            }
          } else if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            const prevInput = document.getElementById(`price-input-${index - 1}`);
            if (prevInput) {
              prevInput.focus();
              prevInput.select();
            }
          }
        },
        className: "w-[100px] h-[38px] px-3 text-right bg-white border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-[8px] font-mono-code text-[14px] font-bold text-sky-700 outline-none disabled:bg-slate-50 disabled:text-slate-400 shadow-sm",
        placeholder: "0.00"
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "text-[13px] text-slate-500 w-8" }, "/", item.unit))), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-center" }, !isViewOnly && /* @__PURE__ */ React.createElement("button", { tabIndex: "-1", onClick: () => handleRemoveItem(item.id), className: "p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors" }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5 mx-auto" }))));
  })))))), /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "h-[44px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95" }, isViewOnly ? "\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07" : "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"), !isViewOnly && /* @__PURE__ */ React.createElement("button", { onClick: handleSave, className: "h-[44px] px-6 text-[14px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]" }, /* @__PURE__ */ React.createElement(Save, { className: "w-4 h-4" }), " \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19")))), /* @__PURE__ */ React.createElement(ConfirmAlert, { isOpen: confirmDelete.isOpen, onCancel: () => setConfirmDelete({ isOpen: false, id: null }), onConfirm: handleDelete, title: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E25\u0E1A", text: "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E23\u0E32\u0E04\u0E32\u0E19\u0E35\u0E49\u0E43\u0E0A\u0E48\u0E44\u0E2B\u0E21" }));
}
function LockWeightModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, lockData, setLockData, stockData, billingData, openBillModal, calculateDynamicQuotas: calculateDynamicQuotas2 }) {
  const locks = calculateDynamicQuotas2 ? calculateDynamicQuotas2(lockData, stockData) : lockData || [];
  const [isFetchingTable, setIsFetchingTable] = useState(lockData === null);
  const activeLocks = locks.filter((l) => l.status === "Active");
  const totalActiveLimit = activeLocks.reduce((sum, l) => sum + (l.limit !== void 0 ? l.limit : Number(l.dailyLimitKg) || 0), 0);
  const totalActiveUsed = activeLocks.reduce((sum, l) => sum + (l.used !== void 0 ? l.used : 0), 0);
  const totalActiveRemaining = totalActiveLimit - totalActiveUsed;
  const [visibleCount, setVisibleCount] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: "", date: "", dailyLimitKg: "", dailyLimitUnit: "Kg.", note: "" });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [modalSearch, setModalSearch] = useState("");
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  useStickyScroll(headerRef, filterRef);
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };
  const filteredLocks = locks.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (l.id || "").toLowerCase().includes(q) || (l.date || "").includes(q);
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";
    if (sortConfig.key === "dailyLimitKg") {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    }
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredLocks.length > visibleCount) setVisibleCount((prev) => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById("scroll-sentinel-lock");
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredLocks.length]);
  useEffect(() => {
    setIsFetchingTable(lockData === null);
  }, [lockData]);
  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI("GET_DATA", "DailyLocks");
    if (response.status === "success") setLockData(response.data);
    else setLockData([]);
    setIsFetchingTable(false);
  };
  const openModal = (lock = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    setModalSearch("");
    if (lock) {
      setFormData(lock);
      setEditingId(lock.id);
    } else {
      const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      setFormData({ id: "AUTO", date: todayStr, dailyLimitKg: "", dailyLimitUnit: "Kg.", note: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.dailyLimitKg) return addToast("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E42\u0E04\u0E27\u0E15\u0E32\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D", "error");
    setLoadingMsg("\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E42\u0E04\u0E27\u0E15\u0E32\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19...");
    setIsLoading(true);
    const payload = { ...formData, _editingId: editingId };
    const response = await requestAPI("SAVE_DATA", "DailyLocks", payload);
    if (response.status === "success") {
      addToast(editingId ? "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E42\u0E04\u0E27\u0E15\u0E32\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E42\u0E04\u0E27\u0E15\u0E32\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08", "success");
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };
  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI("DELETE_DATA", "DailyLocks", { id: idToDelete });
    if (response.status === "success") {
      addToast("\u0E25\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E42\u0E04\u0E27\u0E15\u0E32\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22", "success");
      loadData();
    }
    setIsLoading(false);
  };
  const formatDateTh = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;
  };
  const quotaUnit = "Kg.";
  const selectedDateStr = formData.date ? formData.date.split("T")[0] : "";
  const modalDailyStocks = (stockData || []).filter((s) => (s.date || "").startsWith(selectedDateStr) && (s.refId || "").startsWith("REC")).sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalModalUsedQuota = modalDailyStocks.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
  const modalRemainingQuota = (Number(formData.dailyLimitKg) || 0) - totalModalUsedQuota;
  const modalDailyBills = (billingData || []).filter((b) => (b.date || "").startsWith(selectedDateStr)).sort((a, b) => new Date(b.date) - new Date(a.date));
  const filteredModalBills = modalDailyBills.filter((b) => {
    if (!modalSearch) return true;
    const q = modalSearch.toLowerCase();
    return (b.id || "").toLowerCase().includes(q) || (b.customerName || "").toLowerCase().includes(q);
  });
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5" }, /* @__PURE__ */ React.createElement("div", { ref: headerRef, className: "sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "w-full pointer-events-auto sticky-header-bg shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "font-display font-bold text-slate-800 tracking-tight sticky-header-title" }, "\u0E42\u0E04\u0E27\u0E15\u0E32\u0E25\u0E47\u0E2D\u0E01\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-500 sticky-header-desc text-[15px]" }, "\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E41\u0E25\u0E30\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E42\u0E04\u0E27\u0E15\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E22\u0E49\u0E2D\u0E19\u0E2B\u0E25\u0E31\u0E07")), /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(), className: "flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto" }, /* @__PURE__ */ React.createElement(Plus, { className: "w-5 h-5" }), " ", /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E42\u0E04\u0E27\u0E15\u0E32\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49"))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-5 h-5" })), "\u0E42\u0E04\u0E27\u0E15\u0E49\u0E32\u0E04\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E23\u0E27\u0E21\u0E17\u0E35\u0E48\u0E23\u0E31\u0E1A\u0E44\u0E14\u0E49"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-emerald-500 leading-none" }, totalActiveRemaining.toLocaleString(), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[16px] text-emerald-300 font-medium" }, quotaUnit))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500" }, /* @__PURE__ */ React.createElement(ArrowDownCircle, { className: "w-5 h-5" })), "\u0E42\u0E04\u0E27\u0E15\u0E49\u0E32\u0E23\u0E27\u0E21\u0E17\u0E35\u0E48\u0E23\u0E31\u0E1A\u0E41\u0E25\u0E49\u0E27"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-amber-500 leading-none" }, totalActiveUsed.toLocaleString(), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[16px] text-amber-300 font-medium" }, quotaUnit))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600" }, /* @__PURE__ */ React.createElement(Lock, { className: "w-5 h-5" })), "\u0E40\u0E1B\u0E49\u0E32\u0E2B\u0E21\u0E32\u0E22\u0E42\u0E04\u0E27\u0E15\u0E49\u0E32\u0E23\u0E27\u0E21\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-slate-800 leading-none" }, totalActiveLimit.toLocaleString(), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[16px] text-slate-400 font-medium" }, quotaUnit))))), /* @__PURE__ */ React.createElement("div", { ref: filterRef, className: "w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto pointer-events-none relative h-[56px] z-50" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48, \u0E23\u0E2B\u0E31\u0E2A...", className: "w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" }))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse whitespace-nowrap min-w-[800px]" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50/50 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("date"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 ", sortConfig.key === "date" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("id"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E23\u0E2B\u0E31\u0E2A\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 ", sortConfig.key === "id" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("dailyLimitKg"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E42\u0E04\u0E27\u0E15\u0E32\u0E17\u0E35\u0E48\u0E25\u0E47\u0E2D\u0E01\u0E44\u0E27\u0E49 ", sortConfig.key === "dailyLimitKg" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right" }, "\u0E42\u0E04\u0E27\u0E15\u0E32\u0E17\u0E35\u0E48\u0E23\u0E31\u0E1A"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right" }, "\u0E42\u0E04\u0E27\u0E15\u0E32\u0E17\u0E35\u0E48\u0E40\u0E2B\u0E25\u0E37\u0E2D"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-50" }, isFetchingTable ? Array(5).fill(0).map((_, i) => /* @__PURE__ */ React.createElement("tr", { key: `skeleton-${i}`, className: "animate-pulse" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-24" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-20" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-16 ml-auto" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-16 ml-auto" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-16 ml-auto" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5 flex justify-end gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "h-8 bg-slate-200 rounded w-24" })))) : filteredLocks.slice(0, visibleCount).map((lock, index) => {
    const lockDateStr = lock.date ? lock.date.split("T")[0] : "";
    const totalQuotaRow = lock.limit !== void 0 ? lock.limit : Number(lock.dailyLimitKg) || 0;
    const usedQuotaRow = lock.used !== void 0 ? lock.used : 0;
    const remainingQuotaRow = lock.remaining !== void 0 ? lock.remaining : totalQuotaRow - usedQuotaRow;
    return /* @__PURE__ */ React.createElement("tr", { key: `${lock.id}-${index}`, onClick: () => openModal(lock, true), className: "hover:bg-slate-50/70 transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] font-bold text-slate-800" }, formatDateTh(lock.date)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 font-mono-code text-[14px] text-slate-500" }, lock.id), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-sky-600 font-bold text-right" }, totalQuotaRow.toLocaleString(), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[12px] font-normal text-slate-500 ml-1" }, lock.dailyLimitUnit || "Kg.")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-amber-500 font-bold text-right" }, usedQuotaRow.toLocaleString(), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[12px] font-normal text-slate-500 ml-1" }, lock.dailyLimitUnit || "Kg.")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] font-bold text-right" }, /* @__PURE__ */ React.createElement("span", { className: `${remainingQuotaRow < 0 ? "text-rose-500 bg-rose-50 px-2 py-1 rounded-md" : "text-emerald-500"}` }, remainingQuotaRow.toLocaleString()), /* @__PURE__ */ React.createElement("span", { className: "text-[12px] font-normal text-slate-500 ml-1" }, lock.dailyLimitUnit || "Kg.")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 flex justify-end gap-1", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(lock, true), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E14\u0E39\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" }, /* @__PURE__ */ React.createElement(Info, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(lock, false), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E41\u0E01\u0E49\u0E44\u0E02" }, /* @__PURE__ */ React.createElement(Edit, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmDelete({ isOpen: true, id: lock.id }), className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors", title: "\u0E25\u0E1A" }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-[18px] h-[18px]" }))));
  }), !isFetchingTable && filteredLocks.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "6", className: "text-center p-12 text-slate-400 text-[15px]" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E42\u0E04\u0E27\u0E15\u0E32\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01"))))), !isFetchingTable && visibleCount < filteredLocks.length && /* @__PURE__ */ React.createElement("div", { id: "scroll-sentinel-lock", className: "h-16 flex items-center justify-center text-sky-500" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-6 h-6 animate-spin" })))), isModalOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] w-full max-w-5xl shadow-2xl flex flex-col h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center" }, isViewOnly ? /* @__PURE__ */ React.createElement(Info, { className: "w-6 h-6" }) : /* @__PURE__ */ React.createElement(Scale, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-display text-[20px] font-bold text-slate-800 leading-tight" }, isViewOnly ? "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E42\u0E04\u0E27\u0E15\u0E32" : editingId ? "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E42\u0E04\u0E27\u0E15\u0E32" : "\u0E15\u0E31\u0E49\u0E07\u0E04\u0E48\u0E32\u0E25\u0E47\u0E2D\u0E01\u0E42\u0E04\u0E27\u0E15\u0E32\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E23\u0E32\u0E22\u0E27\u0E31\u0E19"), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-slate-500" }, isViewOnly ? "\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E42\u0E04\u0E27\u0E15\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E2D\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01" : "\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E42\u0E04\u0E27\u0E15\u0E32\u0E41\u0E25\u0E30\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E1A\u0E34\u0E25\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E43\u0E19\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49"))), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors" }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("div", { className: "p-6 overflow-y-auto bg-slate-50/50 space-y-5 flex-1 flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row gap-4 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "date", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }), className: "w-full h-[40px] px-3 bg-white border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" })), /* @__PURE__ */ React.createElement("div", { className: "flex-[3] space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38"), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "text", value: formData.note || "", onChange: (e) => setFormData({ ...formData, note: e.target.value }), className: "w-full h-[40px] px-3 bg-white border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500", placeholder: "\u0E43\u0E2A\u0E48\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38 (\u0E16\u0E49\u0E32\u0E21\u0E35)" }))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "bg-[#0ea5e9] p-6 rounded-[24px] shadow-[0_8px_24px_rgba(14,165,233,0.3)] flex flex-col gap-4 text-white md:col-span-2 relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none" }, /* @__PURE__ */ React.createElement(Scale, { className: "w-48 h-48" })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-[15px] font-medium text-sky-50 z-10" }, /* @__PURE__ */ React.createElement(Lock, { className: "w-4 h-4" }), " \u0E42\u0E04\u0E27\u0E15\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E23\u0E27\u0E21\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 z-10" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center bg-white/20 border border-white/30 rounded-[12px] backdrop-blur-md overflow-hidden h-[56px] w-full md:w-[320px] shadow-inner" }, /* @__PURE__ */ React.createElement("button", { type: "button", disabled: isViewOnly, onClick: () => setFormData({ ...formData, dailyLimitKg: String(Math.max(0, (Number(formData.dailyLimitKg) || 0) - 100)) }), className: "w-[64px] h-full flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-50 border-r border-white/20" }, /* @__PURE__ */ React.createElement(Minus, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "number", value: formData.dailyLimitKg, onChange: (e) => setFormData({ ...formData, dailyLimitKg: e.target.value }), className: "flex-1 w-full h-full px-2 bg-transparent font-display font-bold text-[32px] text-white text-center outline-none placeholder:text-white/40 disabled:opacity-100 disabled:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", placeholder: "5000" }), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: isViewOnly, onClick: () => setFormData({ ...formData, dailyLimitKg: String((Number(formData.dailyLimitKg) || 0) + 100) }), className: "w-[64px] h-full flex items-center justify-center text-white hover:bg-white/20 active:bg-white/30 transition-colors disabled:opacity-50 border-l border-white/20" }, /* @__PURE__ */ React.createElement(Plus, { className: "w-6 h-6" }))), /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: formData.dailyLimitUnit || "Kg.", onChange: (e) => setFormData({ ...formData, dailyLimitUnit: e.target.value }), className: "bg-transparent text-[18px] font-medium text-sky-100 outline-none cursor-pointer hover:text-white transition-colors disabled:opacity-100 disabled:text-white disabled:cursor-not-allowed [&>option]:text-slate-800" }, /* @__PURE__ */ React.createElement("option", { value: "Kg." }, "Kg."), /* @__PURE__ */ React.createElement("option", { value: "\u0E15\u0E31\u0E19" }, "\u0E15\u0E31\u0E19"), /* @__PURE__ */ React.createElement("option", { value: "\u0E01\u0E23\u0E31\u0E21" }, "\u0E01\u0E23\u0E31\u0E21")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm flex flex-col gap-2 justify-center shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[14px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600" }, /* @__PURE__ */ React.createElement(Warehouse, { className: "w-4 h-4" })), "\u0E22\u0E2D\u0E14\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E23\u0E27\u0E21"), /* @__PURE__ */ React.createElement("div", { className: "text-[48px] font-display font-bold text-slate-800 leading-none ml-1 truncate", title: totalModalUsedQuota.toLocaleString() }, totalModalUsedQuota.toLocaleString())), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-sm flex flex-col gap-2 justify-center shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[14px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-4 h-4" })), "\u0E42\u0E04\u0E27\u0E15\u0E32\u0E04\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D"), /* @__PURE__ */ React.createElement("div", { className: `text-[48px] font-display font-bold leading-none ml-1 truncate ${modalRemainingQuota < 0 ? "text-rose-500" : "text-emerald-500"}`, title: modalRemainingQuota.toLocaleString() }, modalRemainingQuota.toLocaleString()))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-slate-200/60 rounded-[20px] shadow-sm flex flex-col shrink-0 overflow-hidden flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 shrink-0 bg-white items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-[14px] text-slate-700 ml-2" }, "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E27\u0E31\u0E19 (", formatDateTh(selectedDateStr), ")"), /* @__PURE__ */ React.createElement("div", { className: "relative w-full md:w-1/3" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: modalSearch, onChange: (e) => setModalSearch(e.target.value), placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E1A\u0E34\u0E25 \u0E2B\u0E23\u0E37\u0E2D\u0E0A\u0E37\u0E48\u0E2D\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32...", className: "w-full h-[40px] pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-[10px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all" }))), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto bg-white flex-1 min-h-[200px]" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse whitespace-nowrap min-w-[700px]" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07\u0E1A\u0E34\u0E25"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-center" }, "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32/\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-bold text-sky-500 text-[15px] bg-sky-50/20 w-[180px] text-right border-l border-r border-sky-100/50" }, "\u0E22\u0E2D\u0E14\u0E23\u0E27\u0E21\u0E19\u0E49\u0E33\u0E2B\u0E19\u0E31\u0E01\u0E02\u0E2D\u0E07\u0E1A\u0E34\u0E25\u0E19\u0E35\u0E49"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-100" }, filteredModalBills.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "4", className: "text-center p-8 text-slate-400 text-[14px]" }, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E1A\u0E34\u0E25\u0E43\u0E19\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49")) : filteredModalBills.map((bill, index) => {
    const isBuy = bill.type === "BUY";
    const totalWeight = (bill.items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    return /* @__PURE__ */ React.createElement("tr", { key: `${bill.id}-${index}`, onClick: () => openBillModal && openBillModal(bill, true), className: "hover:bg-slate-50/50 transition-colors cursor-pointer group" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 font-mono-code text-[14px] font-bold text-sky-500 group-hover:text-sky-600 transition-colors" }, bill.id), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-center" }, /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-bold ${isBuy ? "bg-sky-50 text-sky-600" : "bg-emerald-50 text-emerald-600"}` }, isBuy ? /* @__PURE__ */ React.createElement(ArrowDownCircle, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ React.createElement(ArrowUpCircle, { className: "w-3.5 h-3.5" }), isBuy ? "\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D" : "\u0E02\u0E32\u0E22\u0E2D\u0E2D\u0E01")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-[14px] font-medium text-slate-800" }, bill.customerName || "-"), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-3 text-[15px] font-bold text-slate-800 text-right bg-sky-50/10 border-l border-r border-sky-100/30 group-hover:bg-sky-100/30 transition-colors" }, totalWeight.toLocaleString(), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[13px] font-normal text-slate-500 ml-1" }, "\u0E01\u0E01.")));
  })))))), /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "h-[44px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95" }, isViewOnly ? "\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07" : "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"), !isViewOnly && /* @__PURE__ */ React.createElement("button", { onClick: handleSave, className: "h-[44px] px-6 text-[14px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]" }, /* @__PURE__ */ React.createElement(Save, { className: "w-4 h-4" }), " \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E42\u0E04\u0E27\u0E15\u0E32")))), /* @__PURE__ */ React.createElement(ConfirmAlert, { isOpen: confirmDelete.isOpen, onCancel: () => setConfirmDelete({ isOpen: false, id: null }), onConfirm: handleDelete, title: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E25\u0E1A", text: "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E15\u0E31\u0E49\u0E07\u0E42\u0E04\u0E27\u0E15\u0E32\u0E19\u0E35\u0E49\u0E43\u0E0A\u0E48\u0E44\u0E2B\u0E21" }));
}
function CustomerModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, customerData, setCustomerData }) {
  const customers = customerData || [];
  const [isFetchingTable, setIsFetchingTable] = useState(customerData === null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "", type: "Regular", phone: "", status: "Active" });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  useStickyScroll(headerRef, filterRef);
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };
  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (c.id || "").toLowerCase().includes(q) || (c.name || "").toLowerCase().includes(q) || (c.phone || "").toLowerCase().includes(q);
  }).sort((a, b) => {
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredCustomers.length > visibleCount) setVisibleCount((prev) => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById("scroll-sentinel-customer");
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredCustomers.length]);
  useEffect(() => {
    setIsFetchingTable(customerData === null);
  }, [customerData]);
  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI("GET_DATA", "Customers");
    if (response.status === "success") setCustomerData(response.data);
    else setCustomerData([]);
    setIsFetchingTable(false);
  };
  const openModal = (customer = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (customer) {
      setFormData(customer);
      setEditingId(customer.id);
    } else {
      setFormData({ id: "AUTO", name: "", type: "Regular", phone: "", status: "Active" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setLoadingMsg("\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25...");
    setIsLoading(true);
    const payload = { ...formData, _editingId: editingId };
    const response = await requestAPI("SAVE_DATA", "Customers", payload);
    if (response.status === "success") {
      addToast(editingId ? "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E2B\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08", "success");
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };
  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI("DELETE_DATA", "Customers", { id: idToDelete });
    if (response.status === "success") {
      addToast("\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27", "success");
      loadData();
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5" }, /* @__PURE__ */ React.createElement("div", { ref: headerRef, className: "sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "w-full pointer-events-auto sticky-header-bg shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "font-display font-bold text-slate-800 tracking-tight sticky-header-title" }, "\u0E23\u0E30\u0E1A\u0E1A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-500 sticky-header-desc text-[15px]" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 \u0E28\u0E39\u0E19\u0E22\u0E4C\u0E23\u0E27\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E0B\u0E37\u0E49\u0E2D\u0E02\u0E32\u0E22")), /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(), className: "flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto" }, /* @__PURE__ */ React.createElement(Plus, { className: "w-5 h-5" }), " ", /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E21\u0E48"))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600" }, /* @__PURE__ */ React.createElement(Users, { className: "w-5 h-5" })), "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-slate-800 leading-none" }, customers.length)), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500" }, /* @__PURE__ */ React.createElement(UserCircle, { className: "w-5 h-5" })), "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-sky-600 leading-none" }, customers.filter((c) => c.type === "Regular").length)), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500" }, /* @__PURE__ */ React.createElement(Users, { className: "w-5 h-5" })), "\u0E19\u0E34\u0E15\u0E34\u0E1A\u0E38\u0E04\u0E04\u0E25 / VIP"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-rose-600 leading-none" }, customers.filter((c) => c.type !== "Regular").length)))), /* @__PURE__ */ React.createElement("div", { ref: filterRef, className: "w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto pointer-events-none relative h-[56px] z-50" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E0A\u0E37\u0E48\u0E2D, \u0E23\u0E2B\u0E31\u0E2A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32, \u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23...", className: "w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" }))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse whitespace-nowrap min-w-[800px]" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50/50 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("id"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E23\u0E2B\u0E31\u0E2A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 ", sortConfig.key === "id" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("name"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E0A\u0E37\u0E48\u0E2D\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 ", sortConfig.key === "name" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("phone"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D ", sortConfig.key === "phone" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E2A\u0E16\u0E32\u0E19\u0E30"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-50" }, isFetchingTable ? Array(5).fill(0).map((_, i) => /* @__PURE__ */ React.createElement("tr", { key: `skeleton-${i}`, className: "animate-pulse" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-16" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-32" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-24" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-28" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-6 bg-slate-200 rounded-full w-20" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5 flex justify-end gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "h-8 bg-slate-200 rounded w-24" })))) : filteredCustomers.slice(0, visibleCount).map((c, index) => /* @__PURE__ */ React.createElement("tr", { key: `${c.id}-${index}`, onClick: () => openModal(c, true), className: "hover:bg-slate-50/70 transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 font-mono-code text-[15px] font-bold text-sky-500" }, c.id), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-slate-800 font-medium" }, c.name), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-slate-600" }, c.type === "Regular" ? "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B" : c.type), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 font-mono-code text-[15px] text-slate-600" }, c.phone || "-"), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium border ${c.status === "Active" ? "bg-amber-50 text-amber-600 border-amber-200" : "bg-slate-50 text-slate-500 border-slate-200"}` }, c.status === "Active" ? "\u2714 \u0E22\u0E34\u0E19\u0E22\u0E2D\u0E21" : "\u0E23\u0E30\u0E07\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 flex justify-end gap-1", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("button", { className: "p-2 text-sky-500 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E1E\u0E34\u0E21\u0E1E\u0E4C" }, /* @__PURE__ */ React.createElement(Printer, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(c, false), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E41\u0E01\u0E49\u0E44\u0E02" }, /* @__PURE__ */ React.createElement(Edit, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmDelete({ isOpen: true, id: c.id }), className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors", title: "\u0E25\u0E1A" }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-[18px] h-[18px]" }))))), !isFetchingTable && filteredCustomers.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "6", className: "text-center p-12 text-slate-400 text-[15px]" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A"))))), !isFetchingTable && visibleCount < filteredCustomers.length && /* @__PURE__ */ React.createElement("div", { id: "scroll-sentinel-customer", className: "h-16 flex items-center justify-center text-sky-500" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-6 h-6 animate-spin" })))), isModalOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center" }, isViewOnly ? /* @__PURE__ */ React.createElement(Info, { className: "w-6 h-6" }) : /* @__PURE__ */ React.createElement(Plus, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-display text-[20px] font-bold text-slate-800 leading-tight" }, isViewOnly ? "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32" : editingId ? "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E21\u0E48"), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-slate-500" }, isViewOnly ? "\u0E14\u0E39\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E02\u0E2D\u0E07\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32" : "\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E49\u0E04\u0E23\u0E1A\u0E16\u0E49\u0E27\u0E19"))), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors" }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("div", { className: "p-6 overflow-y-auto bg-slate-50/50 space-y-6 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4 mb-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sky-600" }, /* @__PURE__ */ React.createElement(UserCircle, { className: "w-5 h-5" }), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-[16px]" }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E48\u0E27\u0E19\u0E15\u0E31\u0E27")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, !isViewOnly && /* @__PURE__ */ React.createElement("button", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[13px] font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors" }, /* @__PURE__ */ React.createElement(Scan, { className: "w-4 h-4" }), " \u0E2A\u0E41\u0E01\u0E19\u0E08\u0E32\u0E01\u0E01\u0E25\u0E49\u0E2D\u0E07 (OCR)"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[13px] border border-slate-100" }, /* @__PURE__ */ React.createElement(Clock, { className: "w-4 h-4" }), " \u0E25\u0E07\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19: ", (/* @__PURE__ */ new Date()).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" }), " \u0E19."))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E23\u0E2B\u0E31\u0E2A\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { value: formData.id, readOnly: true, className: "w-full h-[44px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-500 outline-none" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E04\u0E33\u0E19\u0E33\u0E2B\u0E19\u0E49\u0E32 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: formData.prefix || "", onChange: (e) => setFormData({ ...formData, prefix: e.target.value }), className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" }, /* @__PURE__ */ React.createElement("option", null, "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E2B\u0E23\u0E37\u0E2D\u0E40\u0E25\u0E37\u0E2D\u0E01"), /* @__PURE__ */ React.createElement("option", null, "\u0E19\u0E32\u0E22"), /* @__PURE__ */ React.createElement("option", null, "\u0E19\u0E32\u0E07"), /* @__PURE__ */ React.createElement("option", null, "\u0E19\u0E32\u0E07\u0E2A\u0E32\u0E27"), /* @__PURE__ */ React.createElement("option", null, "\u0E1A\u0E08\u0E01."), /* @__PURE__ */ React.createElement("option", null, "\u0E2B\u0E08\u0E01."))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E0A\u0E37\u0E48\u0E2D-\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25 / \u0E0A\u0E37\u0E48\u0E2D\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" }, /* @__PURE__ */ React.createElement("option", { value: "Regular" }, "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E17\u0E31\u0E48\u0E27\u0E44\u0E1B"), /* @__PURE__ */ React.createElement("option", { value: "VIP" }, "VIP"), /* @__PURE__ */ React.createElement("option", { value: "Corporate" }, "\u0E19\u0E34\u0E15\u0E34\u0E1A\u0E38\u0E04\u0E04\u0E25"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2A\u0E16\u0E32\u0E19\u0E30 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" }, /* @__PURE__ */ React.createElement("option", { value: "Active" }, "\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E1B\u0E01\u0E15\u0E34"), /* @__PURE__ */ React.createElement("option", { value: "Inactive" }, "\u0E23\u0E30\u0E07\u0E31\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23\u0E1B\u0E23\u0E30\u0E0A\u0E32\u0E0A\u0E19 / \u0E40\u0E25\u0E02\u0E1C\u0E39\u0E49\u0E40\u0E2A\u0E35\u0E22\u0E20\u0E32\u0E29\u0E35"), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, placeholder: "1-xxxx-xxxxx-xx-x", className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sky-600 border-b border-slate-100 pb-4 mb-5" }, /* @__PURE__ */ React.createElement(MapPin, { className: "w-5 h-5" }), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-[16px]" }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), placeholder: "08X-XXX-XXXX", className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2D\u0E35\u0E40\u0E21\u0E25"), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, placeholder: "example@email.com", className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48"), /* @__PURE__ */ React.createElement("textarea", { disabled: isViewOnly, placeholder: "\u0E1A\u0E49\u0E32\u0E19\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48, \u0E0B\u0E2D\u0E22, \u0E16\u0E19\u0E19, \u0E15\u0E33\u0E1A\u0E25, \u0E2D\u0E33\u0E40\u0E20\u0E2D, \u0E08\u0E31\u0E07\u0E2B\u0E27\u0E31\u0E14, \u0E23\u0E2B\u0E31\u0E2A\u0E44\u0E1B\u0E23\u0E29\u0E13\u0E35\u0E22\u0E4C...", className: "w-full h-[88px] p-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" }))))), /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "h-[44px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95" }, isViewOnly ? "\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07" : "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"), !isViewOnly && /* @__PURE__ */ React.createElement("button", { onClick: handleSave, className: "h-[44px] px-6 text-[14px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-4 h-4" }), " \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25")))), /* @__PURE__ */ React.createElement(ConfirmAlert, { isOpen: confirmDelete.isOpen, onCancel: () => setConfirmDelete({ isOpen: false, id: null }), onConfirm: handleDelete, title: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E25\u0E1A", text: "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49\u0E43\u0E0A\u0E48\u0E44\u0E2B\u0E21" }));
}
function ProductModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, productData, setProductData }) {
  const products = productData || [];
  const [isFetchingTable, setIsFetchingTable] = useState(productData === null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: "", name: "", category: "\u0E17\u0E2D\u0E07\u0E41\u0E14\u0E07", unit: "\u0E01\u0E01.", buyPrice: "", sellPrice: "", status: "Active", note: "" });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  useStickyScroll(headerRef, filterRef);
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };
  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (p.id || "").toLowerCase().includes(q) || (p.name || "").toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q);
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";
    if (sortConfig.key === "buyPrice" || sortConfig.key === "sellPrice") {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    }
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredProducts.length > visibleCount) setVisibleCount((prev) => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById("scroll-sentinel-product");
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);
  useEffect(() => {
    setIsFetchingTable(productData === null);
  }, [productData]);
  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI("GET_DATA", "Products");
    if (response.status === "success") setProductData(response.data);
    else setProductData([]);
    setIsFetchingTable(false);
  };
  const openModal = (product = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (product) {
      setFormData(product);
      setEditingId(product.id);
    } else {
      setFormData({ id: "AUTO", name: "", category: "\u0E17\u0E2D\u0E07\u0E41\u0E14\u0E07", unit: "\u0E01\u0E01.", buyPrice: "", sellPrice: "", status: "Active", note: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setLoadingMsg("\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25...");
    setIsLoading(true);
    const payload = { ...formData, _editingId: editingId };
    const response = await requestAPI("SAVE_DATA", "Products", payload);
    if (response.status === "success") {
      addToast(editingId ? "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E21\u0E48\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08", "success");
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };
  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI("DELETE_DATA", "Products", { id: idToDelete });
    if (response.status === "success") {
      addToast("\u0E25\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27", "success");
      loadData();
    }
    setIsLoading(false);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5" }, /* @__PURE__ */ React.createElement("div", { ref: headerRef, className: "sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "w-full pointer-events-auto sticky-header-bg shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "font-display font-bold text-slate-800 tracking-tight sticky-header-title" }, "\u0E23\u0E30\u0E1A\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-500 sticky-header-desc text-[15px]" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 \u0E42\u0E25\u0E2B\u0E30\u0E21\u0E35\u0E04\u0E48\u0E32 \u0E41\u0E25\u0E30\u0E23\u0E32\u0E04\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D")), /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(), className: "flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto" }, /* @__PURE__ */ React.createElement(Plus, { className: "w-5 h-5" }), " ", /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E21\u0E48"))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600" }, /* @__PURE__ */ React.createElement(PackagePlus, { className: "w-5 h-5" })), "\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-slate-800 leading-none" }, products.length)), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500" }, /* @__PURE__ */ React.createElement(Box, { className: "w-5 h-5" })), "\u0E2B\u0E21\u0E27\u0E14\u0E17\u0E2D\u0E07\u0E41\u0E14\u0E07"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-amber-600 leading-none" }, products.filter((p) => p.category === "\u0E17\u0E2D\u0E07\u0E41\u0E14\u0E07").length)), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500" }, /* @__PURE__ */ React.createElement(Box, { className: "w-5 h-5" })), "\u0E2B\u0E21\u0E27\u0E14\u0E2D\u0E25\u0E39\u0E21\u0E34\u0E40\u0E19\u0E35\u0E22\u0E21"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-sky-600 leading-none" }, products.filter((p) => p.category === "\u0E2D\u0E25\u0E39\u0E21\u0E34\u0E40\u0E19\u0E35\u0E22\u0E21").length)))), /* @__PURE__ */ React.createElement("div", { ref: filterRef, className: "w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto pointer-events-none relative h-[56px] z-50" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E0A\u0E37\u0E48\u0E2D, \u0E23\u0E2B\u0E31\u0E2A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32, \u0E2B\u0E23\u0E37\u0E2D\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48...", className: "w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" }))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse whitespace-nowrap min-w-[800px]" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50/50 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("id"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E23\u0E2B\u0E31\u0E2A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 ", sortConfig.key === "id" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("name"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 ", sortConfig.key === "name" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("buyPrice"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E23\u0E32\u0E04\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D ", sortConfig.key === "buyPrice" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E2A\u0E16\u0E32\u0E19\u0E30"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-50" }, isFetchingTable ? Array(5).fill(0).map((_, i) => /* @__PURE__ */ React.createElement("tr", { key: `skeleton-${i}`, className: "animate-pulse" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-16" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-32" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-24" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-20 ml-auto" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-6 bg-slate-200 rounded-full w-20" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5 flex justify-end gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "h-8 bg-slate-200 rounded w-24" })))) : filteredProducts.slice(0, visibleCount).map((p, index) => /* @__PURE__ */ React.createElement("tr", { key: `${p.id}-${index}`, onClick: () => openModal(p, true), className: "hover:bg-slate-50/70 transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 font-mono-code text-[15px] font-bold text-sky-500" }, p.id), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-slate-800 font-medium" }, p.name), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-slate-600" }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-[13px] font-medium text-slate-600" }, /* @__PURE__ */ React.createElement(Tag, { className: "w-3.5 h-3.5" }), " ", p.category)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-slate-800 font-bold text-right" }, p.buyPrice ? `${Number(p.buyPrice).toLocaleString()} \u0E3F` : "-", " ", /* @__PURE__ */ React.createElement("span", { className: "text-[13px] font-normal text-slate-500" }, "/", p.unit)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-[13px] font-medium border ${p.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-500 border-slate-200"}` }, p.status === "Active" ? "\u2714 \u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19" : "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 flex justify-end gap-1", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(p, true), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E14\u0E39\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" }, /* @__PURE__ */ React.createElement(Info, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(p, false), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E41\u0E01\u0E49\u0E44\u0E02" }, /* @__PURE__ */ React.createElement(Edit, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmDelete({ isOpen: true, id: p.id }), className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors", title: "\u0E25\u0E1A" }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-[18px] h-[18px]" }))))), !isFetchingTable && filteredProducts.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "6", className: "text-center p-12 text-slate-400 text-[15px]" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A"))))), !isFetchingTable && visibleCount < filteredProducts.length && /* @__PURE__ */ React.createElement("div", { id: "scroll-sentinel-product", className: "h-16 flex items-center justify-center text-sky-500" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-6 h-6 animate-spin" })))), isModalOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-200" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Info, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-display text-[20px] font-bold text-slate-800 leading-tight" }, isViewOnly ? "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32" : editingId ? "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E43\u0E2B\u0E21\u0E48"), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-slate-500" }, isViewOnly ? "\u0E14\u0E39\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E02\u0E2D\u0E07\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E41\u0E25\u0E30\u0E23\u0E32\u0E04\u0E32" : "\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E41\u0E25\u0E30\u0E23\u0E32\u0E04\u0E32\u0E02\u0E2D\u0E07\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32"))), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors" }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("div", { className: "p-6 overflow-y-auto bg-slate-50/50 space-y-6 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sky-600 border-b border-slate-100 pb-4 mb-5" }, /* @__PURE__ */ React.createElement(Box, { className: "w-5 h-5" }), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-[16px]" }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E1E\u0E37\u0E49\u0E19\u0E10\u0E32\u0E19")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E23\u0E2B\u0E31\u0E2A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { value: formData.id, readOnly: true, className: "w-full h-[44px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-500 outline-none" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-3" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" }, /* @__PURE__ */ React.createElement("option", { value: "\u0E17\u0E2D\u0E07\u0E41\u0E14\u0E07" }, "\u0E17\u0E2D\u0E07\u0E41\u0E14\u0E07"), /* @__PURE__ */ React.createElement("option", { value: "\u0E2D\u0E25\u0E39\u0E21\u0E34\u0E40\u0E19\u0E35\u0E22\u0E21" }, "\u0E2D\u0E25\u0E39\u0E21\u0E34\u0E40\u0E19\u0E35\u0E22\u0E21"), /* @__PURE__ */ React.createElement("option", { value: "\u0E17\u0E2D\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07" }, "\u0E17\u0E2D\u0E07\u0E40\u0E2B\u0E25\u0E37\u0E2D\u0E07"), /* @__PURE__ */ React.createElement("option", { value: "\u0E2A\u0E41\u0E15\u0E19\u0E40\u0E25\u0E2A" }, "\u0E2A\u0E41\u0E15\u0E19\u0E40\u0E25\u0E2A"), /* @__PURE__ */ React.createElement("option", { value: "\u0E40\u0E2B\u0E25\u0E47\u0E01" }, "\u0E40\u0E2B\u0E25\u0E47\u0E01"), /* @__PURE__ */ React.createElement("option", { value: "\u0E40\u0E28\u0E29\u0E40\u0E2B\u0E25\u0E47\u0E01" }, "\u0E40\u0E28\u0E29\u0E40\u0E2B\u0E25\u0E47\u0E01"), /* @__PURE__ */ React.createElement("option", { value: "\u0E2D\u0E37\u0E48\u0E19\u0E46" }, "\u0E2D\u0E37\u0E48\u0E19\u0E46"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2A\u0E16\u0E32\u0E19\u0E30 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: formData.status, onChange: (e) => setFormData({ ...formData, status: e.target.value }), className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" }, /* @__PURE__ */ React.createElement("option", { value: "Active" }, "\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E1B\u0E01\u0E15\u0E34"), /* @__PURE__ */ React.createElement("option", { value: "Inactive" }, "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01/\u0E44\u0E21\u0E48\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-emerald-600 border-b border-slate-100 pb-4 mb-5" }, /* @__PURE__ */ React.createElement(CircleDollarSign, { className: "w-5 h-5" }), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-[16px]" }, "\u0E23\u0E32\u0E04\u0E32\u0E41\u0E25\u0E30\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E31\u0E1A")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E31\u0E1A ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("select", { disabled: isViewOnly, value: formData.unit, onChange: (e) => setFormData({ ...formData, unit: e.target.value }), className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" }, /* @__PURE__ */ React.createElement("option", { value: "\u0E01\u0E01." }, "\u0E01\u0E34\u0E42\u0E25\u0E01\u0E23\u0E31\u0E21 (\u0E01\u0E01.)"), /* @__PURE__ */ React.createElement("option", { value: "\u0E15\u0E31\u0E19" }, "\u0E15\u0E31\u0E19"), /* @__PURE__ */ React.createElement("option", { value: "\u0E0A\u0E34\u0E49\u0E19" }, "\u0E0A\u0E34\u0E49\u0E19"), /* @__PURE__ */ React.createElement("option", { value: "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07" }, "\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E23\u0E32\u0E04\u0E32\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D (\u0E1A\u0E32\u0E17) ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "number", value: formData.buyPrice, onChange: (e) => setFormData({ ...formData, buyPrice: e.target.value }), placeholder: "0.00", className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E23\u0E32\u0E04\u0E32\u0E02\u0E32\u0E22\u0E1B\u0E23\u0E30\u0E40\u0E21\u0E34\u0E19 (\u0E1A\u0E32\u0E17)"), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "number", value: formData.sellPrice, onChange: (e) => setFormData({ ...formData, sellPrice: e.target.value }), placeholder: "0.00", className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" }))))), /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "h-[44px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95" }, isViewOnly ? "\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07" : "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"), !isViewOnly && /* @__PURE__ */ React.createElement("button", { onClick: handleSave, className: "h-[44px] px-6 text-[14px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-4 h-4" }), " \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25")))), /* @__PURE__ */ React.createElement(ConfirmAlert, { isOpen: confirmDelete.isOpen, onCancel: () => setConfirmDelete({ isOpen: false, id: null }), onConfirm: handleDelete, title: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E25\u0E1A", text: "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E19\u0E35\u0E49\u0E43\u0E0A\u0E48\u0E44\u0E2B\u0E21" }));
}
function StockModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, stockData, setStockData, productData }) {
  const stocks = stockData || [];
  const [isFetchingTable, setIsFetchingTable] = useState(stockData === null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ id: "", refId: "", date: "", name: "", category: "", quantity: "", unit: "", status: "Active", note: "" });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const [searchQuery, setSearchQuery] = useState("");
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const dropdownRef = useRef(null);
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  useStickyScroll(headerRef, filterRef);
  useEffect(() => {
    if (!editingId && formData.date && isModalOpen) {
      const newId = generateDocId("ADJ", stocks, formData.date);
      if (formData.id !== newId) setFormData((prev) => ({ ...prev, id: newId, refId: newId }));
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
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };
  const filteredStocks = stocks.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (s.refId || s.id || "").toLowerCase().includes(q) || (s.name || "").toLowerCase().includes(q) || (s.category || "").toLowerCase().includes(q);
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";
    if (sortConfig.key === "quantity") {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    }
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredStocks.length > visibleCount) setVisibleCount((prev) => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById("scroll-sentinel-stock");
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredStocks.length]);
  useEffect(() => {
    setIsFetchingTable(stockData === null);
  }, [stockData]);
  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI("GET_DATA", "Stock");
    if (response.status === "success") setStockData(response.data);
    else setStockData([]);
    setIsFetchingTable(false);
  };
  const openModal = (stock = null, viewOnly = false) => {
    setIsViewOnly(viewOnly);
    if (stock) {
      setFormData({ ...stock, date: stock.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] });
      setEditingId(stock.id);
      setProductSearch(stock.name || "");
    } else {
      setFormData({ id: "", refId: "", date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0], productId: "", name: "", category: "", quantity: "", unit: "", status: "Active", note: "" });
      setEditingId(null);
      setProductSearch("");
    }
    setIsModalOpen(true);
    setIsProductDropdownOpen(false);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name && !formData.productId) return addToast("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32", "error");
    if (formData.quantity === "") return addToast("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38\u0E1B\u0E23\u0E34\u0E21\u0E32\u0E13", "error");
    setLoadingMsg("\u0E01\u0E33\u0E25\u0E31\u0E07\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E15\u0E4A\u0E2D\u0E01...");
    setIsLoading(true);
    const payload = { ...formData, refId: formData.id || editingId, _editingId: editingId };
    const response = await requestAPI("SAVE_DATA", "Stock", payload);
    if (response.status === "success") {
      addToast(editingId ? "\u0E1B\u0E23\u0E31\u0E1A\u0E1B\u0E23\u0E38\u0E07\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08", "success");
      loadData();
      setIsModalOpen(false);
    }
    setIsLoading(false);
  };
  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    const response = await requestAPI("DELETE_DATA", "Stock", { id: idToDelete });
    if (response.status === "success") {
      addToast("\u0E25\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E2D\u0E2D\u0E01\u0E41\u0E25\u0E49\u0E27 (\u0E22\u0E2D\u0E14\u0E08\u0E30\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19)", "success");
      loadData();
    }
    setIsLoading(false);
  };
  const activeProducts = (productData || []).filter((p) => p.status === "Active");
  const summaryCards = activeProducts.map((product) => {
    const productStocks = stocks.filter((s) => s.productId === product.id || s.name === product.name);
    const totalQty = productStocks.filter((s) => s.status === "Active").reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      unit: product.unit || "\u0E01\u0E01.",
      totalQty
    };
  }).sort((a, b) => b.totalQty - a.totalQty);
  const formatDateTh = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear() + 543;
    if (dateStr.includes("T") && dateStr.length > 10) {
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      return `${d}/${m}/${y} ${hh}:${mm}:${ss}`;
    }
    return `${d}/${m}/${y}`;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5" }, /* @__PURE__ */ React.createElement("div", { ref: headerRef, className: "sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "w-full pointer-events-auto sticky-header-bg shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "font-display font-bold text-slate-800 tracking-tight sticky-header-title" }, "\u0E23\u0E30\u0E1A\u0E1A\u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-500 sticky-header-desc text-[15px]" }, "\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E1B\u0E23\u0E34\u0E21\u0E32\u0E13\u0E04\u0E07\u0E04\u0E25\u0E31\u0E07 \u0E41\u0E25\u0E30\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E04\u0E27\u0E32\u0E21\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27")), /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(), className: "flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto" }, /* @__PURE__ */ React.createElement(Plus, { className: "w-5 h-5" }), " ", /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "\u0E1B\u0E23\u0E31\u0E1A\u0E22\u0E2D\u0E14\u0E2A\u0E15\u0E4A\u0E2D\u0E01"))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4" }, summaryCards.length > 0 ? summaryCards.map((item) => /* @__PURE__ */ React.createElement("div", { key: item.id, className: "bg-white px-4 py-4 rounded-[16px] border border-slate-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col gap-1 transition-transform hover:-translate-y-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-[13px] font-medium text-slate-500 truncate", title: item.name }, item.name), /* @__PURE__ */ React.createElement("div", { className: `text-[24px] font-display font-bold leading-none ${item.totalQty < 0 ? "text-[#ff2152]" : "text-sky-500"}` }, item.totalQty.toLocaleString(), " ", /* @__PURE__ */ React.createElement("span", { className: "text-[12px] font-normal text-slate-400 ml-0.5" }, item.unit)))) : /* @__PURE__ */ React.createElement("div", { className: "col-span-full bg-white p-6 rounded-[24px] border border-slate-100 text-slate-400 text-[15px] w-full text-center" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E34\u0E14\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E43\u0E19\u0E23\u0E30\u0E1A\u0E1A"))), /* @__PURE__ */ React.createElement("div", { ref: filterRef, className: "w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto pointer-events-none relative h-[56px] z-50" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32, \u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E1A\u0E34\u0E25/\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07...", className: "w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" }))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse whitespace-nowrap min-w-[800px]" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50/50 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("date"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48/\u0E40\u0E27\u0E25\u0E32 ", sortConfig.key === "date" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("id"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 (\u0E1A\u0E34\u0E25) ", sortConfig.key === "id" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("name"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 ", sortConfig.key === "name" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17/\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("quantity"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E08\u0E33\u0E19\u0E27\u0E19 (\u0E40\u0E02\u0E49\u0E32/\u0E2D\u0E2D\u0E01) ", sortConfig.key === "quantity" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-50" }, isFetchingTable ? Array(5).fill(0).map((_, i) => /* @__PURE__ */ React.createElement("tr", { key: `skeleton-${i}`, className: "animate-pulse" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-24" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-20" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-32" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-28" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-6 bg-slate-200 rounded-full w-20 ml-auto" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5 flex justify-end gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "h-8 bg-slate-200 rounded w-24" })))) : filteredStocks.slice(0, visibleCount).map((s, index) => {
    const fallbackProduct = (productData || []).find((p) => p.id === s.productId || p.name === s.name);
    const displayUnit = s.unit || (fallbackProduct ? fallbackProduct.unit : "\u0E01\u0E01.");
    const isPositive = Number(s.quantity) > 0;
    const isNegative = Number(s.quantity) < 0;
    return /* @__PURE__ */ React.createElement("tr", { key: `${s.id}-${index}`, onClick: () => openModal(s, true), className: "hover:bg-slate-50/70 transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[14px] text-slate-600" }, formatDateTh(s.date)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 font-mono-code text-[15px] font-bold text-sky-500" }, s.refId || s.id), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-slate-800 font-medium" }, s.name), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[14px] text-slate-600 truncate max-w-[200px]", title: s.note }, s.note || "-"), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] font-bold text-right" }, /* @__PURE__ */ React.createElement("span", { className: `px-3 py-1.5 rounded-lg font-mono-code ${isPositive ? "bg-emerald-50 text-emerald-600" : isNegative ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"}` }, isPositive ? "+" : "", s.quantity ? Number(s.quantity).toLocaleString() : "0"), /* @__PURE__ */ React.createElement("span", { className: "text-[13px] font-normal text-slate-500 ml-1.5 inline-block w-6 text-left" }, displayUnit)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 flex justify-end gap-1", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(s, true), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E14\u0E39\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" }, /* @__PURE__ */ React.createElement(Info, { className: "w-[18px] h-[18px]" })), !(s.refId && (s.refId.startsWith("REC") || s.refId.startsWith("INV"))) && /* @__PURE__ */ React.createElement("button", { onClick: () => openModal(s, false), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23" }, /* @__PURE__ */ React.createElement(Edit, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmDelete({ isOpen: true, id: s.id }), className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors", title: "\u0E25\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49" }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-[18px] h-[18px]" }))));
  }), !isFetchingTable && filteredStocks.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "6", className: "text-center p-12 text-slate-400 text-[15px]" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27\u0E2A\u0E15\u0E4A\u0E2D\u0E01"))))), !isFetchingTable && visibleCount < filteredStocks.length && /* @__PURE__ */ React.createElement("div", { id: "scroll-sentinel-stock", className: "h-16 flex items-center justify-center text-sky-500" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-6 h-6 animate-spin" })))), isModalOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 flex justify-between items-center bg-white border-b border-slate-100 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center" }, isViewOnly ? /* @__PURE__ */ React.createElement(Info, { className: "w-6 h-6" }) : /* @__PURE__ */ React.createElement(Box, { className: "w-6 h-6" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-display text-[20px] font-bold text-slate-800 leading-tight" }, isViewOnly ? "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E32\u0E23\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27" : editingId ? "\u0E41\u0E01\u0E49\u0E44\u0E02\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E31\u0E1A\u0E22\u0E2D\u0E14" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E2A\u0E15\u0E4A\u0E2D\u0E01 (\u0E41\u0E21\u0E19\u0E19\u0E27\u0E25)"), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-slate-500" }, isViewOnly ? "\u0E14\u0E39\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32-\u0E2D\u0E2D\u0E01\u0E02\u0E2D\u0E07\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E19\u0E35\u0E49" : "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E22\u0E2D\u0E14\u0E40\u0E02\u0E49\u0E32 (+) \u0E2B\u0E23\u0E37\u0E2D\u0E25\u0E1A\u0E22\u0E2D\u0E14\u0E2D\u0E2D\u0E01 (-) \u0E14\u0E49\u0E27\u0E22\u0E15\u0E31\u0E27\u0E40\u0E2D\u0E07"))), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "w-10 h-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors" }, /* @__PURE__ */ React.createElement(X, { className: "w-5 h-5" }))), /* @__PURE__ */ React.createElement("div", { className: "p-6 overflow-y-auto bg-slate-50/50 space-y-6 flex-1 flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "bg-sky-50 border border-sky-100 rounded-[16px] p-4 flex gap-3 items-start shrink-0" }, /* @__PURE__ */ React.createElement(Info, { className: "w-5 h-5 text-sky-500 mt-0.5 shrink-0" }), /* @__PURE__ */ React.createElement("div", { className: "text-[13px] text-sky-800 leading-relaxed" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "\u0E23\u0E30\u0E1A\u0E1A\u0E1A\u0E31\u0E0D\u0E0A\u0E35 Transaction:"), " \u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14\u0E17\u0E33\u0E07\u0E32\u0E19\u0E41\u0E1A\u0E1A\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E40\u0E02\u0E49\u0E32-\u0E2D\u0E2D\u0E01", /* @__PURE__ */ React.createElement("br", null), "\u0E2B\u0E32\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E43\u0E2B\u0E49\u0E43\u0E2A\u0E48\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E1B\u0E01\u0E15\u0E34 (\u0E40\u0E0A\u0E48\u0E19 ", /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "10"), ") \u0E2B\u0E32\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E2B\u0E31\u0E01\u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E43\u0E2B\u0E49\u0E43\u0E2A\u0E48\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07\u0E2B\u0E21\u0E32\u0E22\u0E25\u0E1A\u0E19\u0E33\u0E2B\u0E19\u0E49\u0E32 (\u0E40\u0E0A\u0E48\u0E19 ", /* @__PURE__ */ React.createElement("span", { className: "font-bold" }, "-10"), ")")), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sky-600 border-b border-slate-100 pb-4 mb-5" }, /* @__PURE__ */ React.createElement(Box, { className: "w-5 h-5" }), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-[16px]" }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { disabled: isViewOnly, type: "date", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }), className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 (\u0E1A\u0E34\u0E25) ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("input", { value: formData.refId || formData.id, readOnly: true, className: "w-full h-[44px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] font-mono-code text-[14px] text-slate-500 outline-none cursor-not-allowed", placeholder: "\u0E2D\u0E31\u0E15\u0E42\u0E19\u0E21\u0E31\u0E15\u0E34" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2", ref: dropdownRef }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E0A\u0E37\u0E48\u0E2D\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 / \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      disabled: isViewOnly || editingId,
      type: "text",
      value: productSearch,
      onChange: (e) => {
        setProductSearch(e.target.value);
        setIsProductDropdownOpen(true);
        if (e.target.value !== formData.name) setFormData({ ...formData, productId: "", name: e.target.value, category: "", unit: "" });
      },
      onFocus: () => setIsProductDropdownOpen(true),
      className: "w-full h-[44px] px-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
      placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E01\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25..."
    }
  ), isProductDropdownOpen && !isViewOnly && !editingId && /* @__PURE__ */ React.createElement("ul", { className: "absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-h-60 overflow-y-auto" }, (productData || []).filter((p) => (p.name || "").toLowerCase().includes(productSearch.toLowerCase()) || (p.id || "").toLowerCase().includes(productSearch.toLowerCase())).length > 0 ? (productData || []).filter((p) => (p.name || "").toLowerCase().includes(productSearch.toLowerCase()) || (p.id || "").toLowerCase().includes(productSearch.toLowerCase())).map((p) => /* @__PURE__ */ React.createElement(
    "li",
    {
      key: p.id,
      className: "px-4 py-3 hover:bg-sky-50 cursor-pointer text-[14px] text-slate-700 border-b border-slate-50 flex items-center gap-2",
      onClick: () => {
        setFormData({ ...formData, productId: p.id, name: p.name, category: p.category, unit: p.unit });
        setProductSearch(p.name);
        setIsProductDropdownOpen(false);
      }
    },
    /* @__PURE__ */ React.createElement("span", { className: "font-mono-code text-[13px] text-sky-500 font-bold bg-sky-50 px-2 py-0.5 rounded-md" }, "[", p.id, "]"),
    /* @__PURE__ */ React.createElement("span", null, p.name)
  )) : /* @__PURE__ */ React.createElement("li", { className: "px-4 py-4 text-[14px] text-slate-400 text-center" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32 \u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E0A\u0E37\u0E48\u0E2D\u0E2D\u0E34\u0E2A\u0E23\u0E30\u0E44\u0E14\u0E49")))), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48"), /* @__PURE__ */ React.createElement("input", { disabled: true, value: formData.category || "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48", className: "w-full h-[44px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-slate-500 outline-none cursor-not-allowed" })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-slate-200/60 rounded-[20px] p-6 shadow-sm shrink-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-indigo-600 border-b border-slate-100 pb-4 mb-5" }, /* @__PURE__ */ React.createElement(Warehouse, { className: "w-5 h-5" }), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-[16px]" }, "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E40\u0E04\u0E25\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E2B\u0E27")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E25\u0E35\u0E48\u0E22\u0E19\u0E41\u0E1B\u0E25\u0E07 (\u0E40\u0E02\u0E49\u0E32 +, \u0E2D\u0E2D\u0E01 -) ", /* @__PURE__ */ React.createElement("span", { className: "text-rose-500" }, "*")), /* @__PURE__ */ React.createElement(
    "input",
    {
      disabled: isViewOnly || formData.refId && (formData.refId.startsWith("REC") || formData.refId.startsWith("INV")),
      type: "number",
      value: formData.quantity,
      onChange: (e) => setFormData({ ...formData, quantity: e.target.value }),
      placeholder: "\u0E40\u0E0A\u0E48\u0E19 15 \u0E2B\u0E23\u0E37\u0E2D -5",
      className: "w-full h-[48px] px-4 bg-sky-50/50 border border-sky-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-[12px] font-mono-code font-bold text-[18px] text-sky-700 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2B\u0E19\u0E48\u0E27\u0E22\u0E19\u0E31\u0E1A"), /* @__PURE__ */ React.createElement("input", { disabled: true, value: formData.unit || "\u0E01\u0E01.", className: "w-full h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-[12px] text-[14px] text-slate-500 outline-none cursor-not-allowed" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 md:col-span-3" }, /* @__PURE__ */ React.createElement("label", { className: "text-[13px] font-medium text-slate-600" }, "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38 / \u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25"), /* @__PURE__ */ React.createElement("textarea", { disabled: isViewOnly, value: formData.note, onChange: (e) => setFormData({ ...formData, note: e.target.value }), placeholder: "\u0E40\u0E0A\u0E48\u0E19 \u0E22\u0E2D\u0E14\u0E22\u0E01\u0E21\u0E32, \u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E0A\u0E33\u0E23\u0E38\u0E14\u0E15\u0E31\u0E14\u0E2D\u0E2D\u0E01...", className: "w-full h-[88px] p-4 bg-white border border-slate-200 rounded-[12px] text-[14px] text-slate-700 outline-none focus:border-sky-500 transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed" }))))), /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 bg-white border-t border-slate-100 flex justify-end gap-3 shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setIsModalOpen(false), className: "h-[48px] px-6 text-[14px] font-medium text-slate-600 bg-white border border-slate-200 rounded-[12px] hover:bg-slate-50 transition-colors active:scale-95" }, isViewOnly ? "\u0E1B\u0E34\u0E14\u0E2B\u0E19\u0E49\u0E32\u0E15\u0E48\u0E32\u0E07" : "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01"), !isViewOnly && /* @__PURE__ */ React.createElement("button", { onClick: handleSave, className: "h-[48px] px-8 text-[15px] font-medium text-white bg-sky-500 rounded-[12px] hover:bg-sky-600 transition-colors active:scale-95 flex items-center gap-2 shadow-[0_4px_12px_rgba(14,165,233,0.25)]" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "w-5 h-5" }), " \u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34")))), /* @__PURE__ */ React.createElement(ConfirmAlert, { isOpen: confirmDelete.isOpen, onCancel: () => setConfirmDelete({ isOpen: false, id: null }), onConfirm: handleDelete, title: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E25\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23", text: "\u0E22\u0E2D\u0E14\u0E23\u0E27\u0E21\u0E02\u0E2D\u0E07\u0E2A\u0E34\u0E19\u0E04\u0E49\u0E32\u0E19\u0E35\u0E49\u0E08\u0E30\u0E16\u0E39\u0E01\u0E2B\u0E31\u0E01\u0E25\u0E1A/\u0E04\u0E37\u0E19\u0E04\u0E48\u0E32\u0E15\u0E32\u0E21\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E19\u0E35\u0E49 \u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E43\u0E0A\u0E48\u0E44\u0E2B\u0E21?" }));
}
function BillingModule({ setIsLoading, setLoadingMsg, addToast, requestAPI, billingData, setBillingData, customerData, productData, dailyPriceData, stockData, setStockData, openBillModal }) {
  const bills = billingData || [];
  const [isFetchingTable, setIsFetchingTable] = useState(billingData === null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, id: null });
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  useStickyScroll(headerRef, filterRef);
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };
  const filteredBills = bills.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (b.id || "").toLowerCase().includes(q) || (b.customerName || "").toLowerCase().includes(q) || (b.type === "BUY" ? "\u0E0B\u0E37\u0E49\u0E2D" : "\u0E02\u0E32\u0E22").includes(q);
  }).sort((a, b) => {
    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";
    if (sortConfig.key === "grandTotal") {
      aValue = Number(aValue) || 0;
      bValue = Number(bValue) || 0;
    }
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && filteredBills.length > visibleCount) setVisibleCount((prev) => prev + 20);
    }, { threshold: 0.1 });
    const sentinel = document.getElementById("scroll-sentinel-billing");
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredBills.length]);
  useEffect(() => {
    setIsFetchingTable(billingData === null);
  }, [billingData]);
  const loadData = async () => {
    setIsFetchingTable(true);
    const response = await requestAPI("GET_DATA", "Billing");
    if (response.status === "success") setBillingData(response.data);
    else setBillingData([]);
    setIsFetchingTable(false);
  };
  const handleDelete = async () => {
    const idToDelete = confirmDelete.id;
    setConfirmDelete({ isOpen: false, id: null });
    setIsLoading(true);
    setLoadingMsg("\u0E01\u0E33\u0E25\u0E31\u0E07\u0E25\u0E1A\u0E1A\u0E34\u0E25\u0E41\u0E25\u0E30\u0E22\u0E49\u0E2D\u0E19\u0E01\u0E25\u0E31\u0E1A\u0E22\u0E2D\u0E14\u0E2A\u0E15\u0E4A\u0E2D\u0E01...");
    const response = await requestAPI("DELETE_DATA", "Billing", { id: idToDelete });
    if (response.status === "success") {
      const relatedStocks = (stockData || []).filter((s) => s.refId === idToDelete);
      let stockUpdated = false;
      for (let s of relatedStocks) {
        const stockRes = await requestAPI("DELETE_DATA", "Stock", { id: s.id });
        if (stockRes.status === "success") stockUpdated = true;
      }
      if (stockUpdated) {
        const newStockData = await requestAPI("GET_DATA", "Stock");
        if (newStockData.status === "success") setStockData(newStockData.data);
      }
      addToast("\u0E25\u0E1A\u0E1A\u0E34\u0E25\u0E41\u0E25\u0E30\u0E22\u0E49\u0E2D\u0E19\u0E22\u0E2D\u0E14\u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E04\u0E37\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27", "success");
      loadData();
    }
    setIsLoading(false);
  };
  const formatDateTh = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear() + 543;
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${d}/${m}/${y} ${hh}:${mm}:${ss}`;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col font-body pb-10 min-h-full w-full gap-4 md:gap-5" }, /* @__PURE__ */ React.createElement("div", { ref: headerRef, className: "sticky top-0 z-30 w-full pointer-events-none transition-all duration-300 ease-in-out flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "w-full pointer-events-auto sticky-header-bg shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto px-4 md:px-8 flex flex-row justify-between items-center gap-2 sm:gap-4 sticky-header-inner" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "font-display font-bold text-slate-800 tracking-tight sticky-header-title" }, "\u0E1A\u0E34\u0E25\u0E0B\u0E37\u0E49\u0E2D/\u0E02\u0E32\u0E22"), /* @__PURE__ */ React.createElement("p", { className: "text-slate-500 sticky-header-desc text-[15px]" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23\u0E1B\u0E23\u0E30\u0E27\u0E31\u0E15\u0E34\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D\u0E41\u0E25\u0E30\u0E02\u0E32\u0E22\u0E2D\u0E2D\u0E01\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14")), /* @__PURE__ */ React.createElement("button", { onClick: () => openBillModal && openBillModal(null, false), className: "flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl font-semibold shadow-sm transition-transform active:scale-95 shrink-0 bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-4 py-2 sm:px-6 sm:py-3 pointer-events-auto" }, /* @__PURE__ */ React.createElement(Plus, { className: "w-5 h-5" }), " ", /* @__PURE__ */ React.createElement("span", { className: "hidden sm:inline" }, "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E1A\u0E34\u0E25\u0E43\u0E2B\u0E21\u0E48"))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600" }, /* @__PURE__ */ React.createElement(FileText, { className: "w-5 h-5" })), "\u0E1A\u0E34\u0E25\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 (\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23)"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-slate-800 leading-none" }, bills.length)), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500" }, /* @__PURE__ */ React.createElement(ArrowDownCircle, { className: "w-5 h-5" })), "\u0E1A\u0E34\u0E25\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D (\u0E23\u0E32\u0E22\u0E08\u0E48\u0E32\u0E22)"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-sky-600 leading-none" }, bills.filter((b) => b.type === "BUY").length)), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-[15px] font-medium text-slate-500" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-[12px] bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500" }, /* @__PURE__ */ React.createElement(ArrowUpCircle, { className: "w-5 h-5" })), "\u0E1A\u0E34\u0E25\u0E02\u0E32\u0E22\u0E2D\u0E2D\u0E01 (\u0E23\u0E32\u0E22\u0E23\u0E31\u0E1A)"), /* @__PURE__ */ React.createElement("div", { className: "text-[40px] font-display font-bold text-emerald-600 leading-none" }, bills.filter((b) => b.type === "SELL").length)))), /* @__PURE__ */ React.createElement("div", { ref: filterRef, className: "w-full pointer-events-none sticky z-20 transition-all duration-300 ease-in-out top-[64px] md:top-[72px]" }, /* @__PURE__ */ React.createElement("div", { className: "w-full mx-auto pointer-events-none relative h-[56px] z-50" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 -translate-y-1/2 left-0 right-0 mx-auto pointer-events-auto origin-top sticky-filter-inner flex flex-row items-center transition-all" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-full" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E1A\u0E34\u0E25 \u0E2B\u0E23\u0E37\u0E2D\u0E0A\u0E37\u0E48\u0E2D\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32...", className: "w-full h-[48px] pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[15px] text-slate-700 placeholder:text-slate-400 font-body focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-colors shadow-inner" }))))), /* @__PURE__ */ React.createElement("div", { className: "w-full px-4 md:px-8 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-[24px] border border-slate-100/60 shadow-[0_2px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse whitespace-nowrap min-w-[800px]" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-slate-50/50 border-b border-slate-100" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("date"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48/\u0E40\u0E27\u0E25\u0E32 ", sortConfig.key === "date" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("id"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E1A\u0E34\u0E25 ", sortConfig.key === "id" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px]" }, "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("customerName"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32/\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07 ", sortConfig.key === "customerName" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { onClick: () => requestSort("grandTotal"), className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right cursor-pointer hover:bg-slate-200 transition-colors select-none" }, "\u0E22\u0E2D\u0E14\u0E23\u0E27\u0E21 (\u0E1A\u0E32\u0E17) ", sortConfig.key === "grandTotal" ? sortConfig.direction === "asc" ? "\u2191" : "\u2193" : "\u21C5"), /* @__PURE__ */ React.createElement("th", { className: "px-6 py-4 font-medium text-slate-500 text-[14px] text-right" }, "\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-slate-50" }, isFetchingTable ? Array(5).fill(0).map((_, i) => /* @__PURE__ */ React.createElement("tr", { key: `skeleton-${i}`, className: "animate-pulse" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-24" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-20" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-16" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-32" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "h-4 bg-slate-200 rounded w-20 ml-auto" })), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-5 flex justify-end gap-1" }, /* @__PURE__ */ React.createElement("div", { className: "h-8 bg-slate-200 rounded w-24" })))) : filteredBills.slice(0, visibleCount).map((b, index) => /* @__PURE__ */ React.createElement("tr", { key: `${b.id}-${index}`, onClick: () => openBillModal && openBillModal(b, true), className: "hover:bg-slate-50/70 transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[14px] text-slate-600" }, formatDateTh(b.date)), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 font-mono-code text-[15px] font-bold text-sky-500" }, b.id), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[13px] font-bold
                          ${b.type === "BUY" ? "bg-sky-50 text-sky-600" : "bg-emerald-50 text-emerald-600"}
                        ` }, b.type === "BUY" ? /* @__PURE__ */ React.createElement(ArrowDownCircle, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ React.createElement(ArrowUpCircle, { className: "w-3.5 h-3.5" }), b.type === "BUY" ? "\u0E23\u0E31\u0E1A\u0E0B\u0E37\u0E49\u0E2D (\u0E08\u0E48\u0E32\u0E22)" : "\u0E02\u0E32\u0E22\u0E2D\u0E2D\u0E01 (\u0E23\u0E31\u0E1A)")), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[15px] text-slate-800 font-medium" }, b.customerName), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 text-[16px] font-mono-code font-bold text-slate-800 text-right" }, Number(b.grandTotal).toLocaleString()), /* @__PURE__ */ React.createElement("td", { className: "px-6 py-4 flex justify-end gap-1", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("button", { className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E1A\u0E34\u0E25" }, /* @__PURE__ */ React.createElement(Printer, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => openBillModal && openBillModal(b, false), className: "p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-[12px] transition-colors", title: "\u0E41\u0E01\u0E49\u0E44\u0E02" }, /* @__PURE__ */ React.createElement(Edit, { className: "w-[18px] h-[18px]" })), /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmDelete({ isOpen: true, id: b.id }), className: "p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[12px] transition-colors", title: "\u0E25\u0E1A" }, /* @__PURE__ */ React.createElement(Trash2, { className: "w-[18px] h-[18px]" }))))), !isFetchingTable && filteredBills.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "6", className: "text-center p-12 text-slate-400 text-[15px]" }, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1A\u0E34\u0E25"))))), !isFetchingTable && visibleCount < filteredBills.length && /* @__PURE__ */ React.createElement("div", { id: "scroll-sentinel-billing", className: "h-16 flex items-center justify-center text-sky-500" }, /* @__PURE__ */ React.createElement(Loader2, { className: "w-6 h-6 animate-spin" })))), /* @__PURE__ */ React.createElement(ConfirmAlert, { isOpen: confirmDelete.isOpen, onCancel: () => setConfirmDelete({ isOpen: false, id: null }), onConfirm: handleDelete, title: "\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E25\u0E1A", text: "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E25\u0E1A\u0E1A\u0E34\u0E25\u0E41\u0E25\u0E30\u0E04\u0E37\u0E19\u0E04\u0E48\u0E32\u0E22\u0E2D\u0E14\u0E2A\u0E15\u0E4A\u0E2D\u0E01\u0E43\u0E0A\u0E48\u0E44\u0E2B\u0E21" }));
}
