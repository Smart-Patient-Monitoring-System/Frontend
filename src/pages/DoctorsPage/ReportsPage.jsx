import React, { useState, useEffect, useMemo } from "react";
import { Search, FileText, Download, User, Calendar, Activity, Eye, File } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8084";

function ReportsPage({ doctorId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      if (!doctorId) {
        // If doctorId is still null (loading), just return
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/doctor/${doctorId}/patients/reports`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReports(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError("Could not load medical reports. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [doctorId]);

  const filteredReports = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return reports;

    return reports.filter(r => 
      (r.reportName || "").toLowerCase().includes(q) ||
      (r.patientName || "").toLowerCase().includes(q) ||
      String(r.patientId || "").includes(q)
    );
  }, [reports, searchQuery]);

  const handleDownload = async (reportId, filename) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/api/reports/${reportId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Ensure the download filename has a .pdf extension if it's a PDF
      let downloadName = filename || `report_${reportId}`;
      if (!downloadName.toLowerCase().endsWith('.pdf')) {
        downloadName += '.pdf';
      }
      
      link.setAttribute('download', downloadName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report.");
    }
  };

  const getReportIcon = (name) => {
    const lower = (name || "").toLowerCase();
    if (lower.includes("ecg") || lower.includes("heart") || lower.includes("cardio")) {
      return <Activity size={28} className="text-red-500" />;
    }
    if (lower.includes("xray") || lower.includes("x-ray") || lower.includes("scan") || lower.includes("mri")) {
      return <Eye size={28} className="text-blue-600" />;
    }
    return <FileText size={28} className="text-blue-600" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading reports history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Search Header ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search reports by patient name, ID, or report title..."
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {error ? (
        <div className="p-8 bg-red-50 rounded-2xl border border-red-100 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No Reports Found</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            {searchQuery 
              ? `We couldn't find any reports matching "${searchQuery}"`
              : "There are currently no medical reports uploaded by your patients."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map((report) => (
            <div 
              key={report.id}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center transition-transform group-hover:scale-110">
                  {getReportIcon(report.reportName)}
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {report.reportName}
                  </h4>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      <User size={14} />
                      {report.patientName} (ID: {report.patientId})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(report.uploadedAt).toLocaleDateString()} at {new Date(report.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(report.id, report.reportName)}
                  className="p-3 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-500 rounded-xl transition-all duration-300 flex items-center gap-2 group/btn"
                >
                  <Download size={18} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                  <span className="font-semibold text-sm hidden sm:inline">Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
