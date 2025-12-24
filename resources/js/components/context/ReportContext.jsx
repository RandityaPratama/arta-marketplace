// components/context/ReportContext.js
import React, { createContext, useContext, useState } from "react";

const ReportContext = createContext();

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};

export const ReportProvider = ({ children }) => {
  // ✅ Data dummy: laporan awal
  const [reports, setReports] = useState([
    {
      id: 1712345678,
      type: "iklan",
      productId: 1,
      productName: "Samsung S24 Ultra",
      sellerName: "Randitya Pratama",
      reason: "Harga tidak sesuai pasar",
      status: "Menunggu",
      reportedAt: "22 Des 2025, 10:30"
    }
  ]);

  // ❌ Hapus localStorage

  const submitReport = (reportData) => {
    const newReport = {
      ...reportData,
      id: Date.now(),
      reportedAt: new Date().toLocaleString("id-ID"),
    };
    setReports(prev => [newReport, ...prev]);
  };

  return (
    <ReportContext.Provider value={{ reports, submitReport }}>
      {children}
    </ReportContext.Provider>
  );
};