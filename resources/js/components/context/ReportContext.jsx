import React, { createContext, useContext, useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

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
  const [reportReasons, setReportReasons] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const fetchReportReasons = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/report-reasons`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        setReportReasons(result.data);
      }
    } catch (error) {
      console.error("Error fetching report reasons:", error);
    }
  }, []);

  const submitReport = useCallback(async (productId, reportReasonId, transactionId = null, reportType = 'iklan', evidenceFiles = []) => {
    const token = getToken();
    if (!token) {
      throw new Error("Anda harus login terlebih dahulu");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('report_reason_id', reportReasonId);
      if (transactionId) {
        formData.append('transaction_id', transactionId);
      }
      if (reportType) {
        formData.append('report_type', reportType);
      }
      if (Array.isArray(evidenceFiles) && evidenceFiles.length > 0) {
        evidenceFiles.forEach((file) => {
          formData.append('evidence_images[]', file);
        });
      }

      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formData
      });

      const result = await response.json();

      if (!result.success) {
        const errors = result?.errors || {};
        const firstError = Object.values(errors).flat()?.[0];
        throw new Error(firstError || result.message || 'Gagal mengirim laporan');
      }

      return result;
    } catch (error) {
      console.error("Error submitting report:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyReports = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/my-reports`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        setReports(result.data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ReportContext.Provider value={{ 
      reports, 
      reportReasons,
      loading,
      submitReport,
      fetchReportReasons,
      fetchMyReports
    }}>
      {children}
    </ReportContext.Provider>
  );
};
