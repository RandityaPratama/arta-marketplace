// src/context/ReportContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const ReportContext = createContext();

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("product_reports");
    if (saved) {
      setReports(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("product_reports", JSON.stringify(reports));
  }, [reports]);

  // ✅ Tambahkan evidenceImages
  const submitReport = (productId, productName, reason, evidenceImages = []) => {
    const newReport = {
      id: Date.now(),
      productId,
      productName,
      reason,
      evidenceImages, // ✅ Simpan array URL foto
      reportedAt: new Date().toLocaleString("id-ID"),
      status: "Menunggu",
    };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  return (
    <ReportContext.Provider value={{ reports, submitReport }}>
      {children}
    </ReportContext.Provider>
  );
};