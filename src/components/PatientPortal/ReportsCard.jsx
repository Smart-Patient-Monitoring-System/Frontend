import React, { useEffect, useState } from "react";

const ReportsCard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [reportName, setReportName] = useState("");
  const [error, setError] = useState(null);

  const [showUploadForm, setShowUploadForm] = useState(false);

  // ✅ Fetch reports
  const fetchReports = () => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:8080/api/reports")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reports");
        return res.json();
      })
      .then((data) => setReports(data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setError("Failed to load reports");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Download report
  const downloadReport = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reports/${id}/download`);
      
      if (!res.ok) {
        throw new Error(`Download failed: ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Extract filename from Content-Disposition header
      const disposition = res.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `report_${id}`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report: " + err.message);
    }
  };

  // ✅ Upload report
  const handleUpload = async () => {
    if (!file || !reportName.trim()) {
      alert("Please select a file and enter a report name");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("reportName", reportName);

    try {
      console.log("Uploading:", reportName, file.name);
      
      const res = await fetch("http://localhost:8080/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(errorData.error || `Upload failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("Upload success:", data);
      
      alert("Report uploaded successfully!");
      
      // Reset form
      setFile(null);
      setReportName("");
      
      // Reset file input
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";
      
      // Refresh reports list
      fetchReports();
      
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + err.message);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header with icon */}
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-800">Recent Reports</h2>
      </div>

      {/* Upload Button - Gradient Blue */}
      {!showUploadForm && (
        <button
          onClick={() => setShowUploadForm(true)}
          className="w-full mb-6 py-4 rounded-xl text-white font-medium text-center"
          style={{
            background: 'linear-gradient(90deg, #4A90E2 0%, #56CCF2 100%)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.01)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Upload New Report
        </button>
      )}

      {/* Upload Form - Inline */}
      {showUploadForm && (
        <div className="mb-6 p-5 border-2 border-blue-200 rounded-xl bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Upload New Report</h3>
            <button
              onClick={() => {
                setShowUploadForm(false);
                setFile(null);
                setReportName("");
                setError(null);
                const fileInput = document.getElementById("file-input");
                if (fileInput) fileInput.value = "";
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Report name (e.g., X-ray report)"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={uploading}
            />
            <input
              id="file-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 px-3 py-2 rounded-md bg-white"
              disabled={uploading}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            {file && (
              <p className="text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              onClick={async () => {
                await handleUpload();
                if (!error) {
                  setShowUploadForm(false);
                }
              }}
              disabled={uploading || !file || !reportName.trim()}
              className={`w-full px-4 py-2 rounded-md text-white font-medium ${
                uploading || !file || !reportName.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Report"}
            </button>
          </div>
        </div>
      )}

      {/* Reports List */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading reports...</div>
      ) : error && reports.length === 0 ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No reports available</div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{report.reportName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(report.uploadedAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button
                onClick={() => downloadReport(report.id)}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsCard;