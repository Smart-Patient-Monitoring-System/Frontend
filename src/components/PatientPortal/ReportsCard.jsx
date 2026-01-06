import React, { useEffect, useState } from "react";

const ReportsCard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [reportName, setReportName] = useState("");

  // ✅ Fetch reports
  const fetchReports = () => {
    setLoading(true);
    fetch("http://localhost:8080/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ Download report
  const downloadReport = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/reports/${id}/download`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const disposition = res.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "report";

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Upload report
  const handleUpload = async () => {
    if (!file || !reportName) return alert("Select file and enter report name");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("reportName", reportName);

    try {
      const res = await fetch("http://localhost:8080/api/reports/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      alert("Report uploaded successfully");
      setFile(null);
      setReportName("");
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg w-full">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
          Recent Reports
        </h2>
      </div>

      {/* Upload */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Report Name"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          className="border px-2 py-1 rounded-md flex-1"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border px-2 py-1 rounded-md"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-3 py-1 rounded-md"
        >
          Upload
        </button>
      </div>

      {/* Reports list */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 text-sm">No reports available</p>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-700 text-sm sm:text-base">
                {report.reportName}
              </span>
              <button
                onClick={() => downloadReport(report.id)}
                className="mt-1 sm:mt-0 text-blue-500 hover:text-blue-600 text-sm sm:text-base"
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
