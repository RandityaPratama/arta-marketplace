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