import React, { useState } from "react";
import { X, Upload, FileText, AlertCircle } from "lucide-react";
import axios from "axios";

function UploadModal({ open, onClose, onAnalyze }) {
  const [patientId, setPatientId] = useState("");
  const [datFile, setDatFile] = useState(null);
  const [heaFile, setHeaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState(""); // "", "success", "error"

  if (!open) return null;

  const handleSubmit = async () => {
    if (!patientId || !datFile || !heaFile) {
      setError("Please fill all fields and select both files");
      return;
    }

    setError("");
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("dat_file", datFile);
    formData.append("hea_file", heaFile);

    try {
      setLoading(true);
      setSaveStatus("");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vital/ecg/analyze`,
        formData
      );

      // Extract numeric ID only (handles "P-12", "Patient-12", or "12")
      const rawId = patientId.trim();
      const numericIdMatch = rawId.match(/\d+/);
      const numericId = numericIdMatch ? parseInt(numericIdMatch[0], 10) : null;

      if (!numericId) {
        throw new Error("Could not extract a valid numeric patient ID. Please use a format like 'P-12' or just '12'.");
      }

      // Save result to MainService for persistent history
      try {
        await axios.post(
          "http://localhost:8088/api/doctor/ecg/save",
          {
            patientId: numericId,
            prediction: res.data.prediction || res.data.status || "Unknown",
            probability: res.data.probability || 0,
            meanHR: res.data.meanHR || 0,
            sdnn: res.data.SDNN !== undefined ? res.data.SDNN : (res.data.sdnn || 0),
            rmssd: res.data.RMSSD !== undefined ? res.data.RMSSD : (res.data.rmssd || 0),
            beats: res.data.beats || 0,
            status: res.data.status || "Unknown",
            rationale: res.data.rationale || "No rationale provided.",
            waveformJson: JSON.stringify(res.data.waveform || []),
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setSaveStatus("success");
      } catch (saveErr) {
        console.error("Failed to save ECG reading to history:", saveErr);
        setSaveStatus("error");
        // We don't throw here because analysis itself succeeded
      }

      // Short delay to show success state before closing
      setTimeout(() => {
        onAnalyze(res.data);
      }, 1500);
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        "ECG analysis failed. Make sure the VitalReports-AI service is running.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl relative
                    animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600
                            flex items-center justify-center">
              <Upload size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Upload ECG</h2>
              <p className="text-xs text-gray-400">
                PhysioNet .dat + .hea format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Patient ID */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Patient ID
            </label>
            <input
              type="text"
              placeholder="e.g. P-12"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
                         transition-all"
            />
          </div>

          {/* .dat File */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              ECG Data File (.dat)
            </label>
            <label
              className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer
                          transition-all hover:border-blue-400 hover:bg-blue-50/30
                          ${datFile ? "border-emerald-300 bg-emerald-50/30" : "border-gray-200"}`}
            >
              <FileText
                size={18}
                className={datFile ? "text-emerald-500" : "text-gray-400"}
              />
              <span className="text-sm text-gray-600 truncate">
                {datFile ? datFile.name : "Choose .dat file…"}
              </span>
              <input
                type="file"
                accept=".dat"
                className="hidden"
                onChange={(e) => setDatFile(e.target.files[0])}
              />
            </label>
          </div>

          {/* .hea File */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              ECG Header File (.hea)
            </label>
            <label
              className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer
                          transition-all hover:border-blue-400 hover:bg-blue-50/30
                          ${heaFile ? "border-emerald-300 bg-emerald-50/30" : "border-gray-200"}`}
            >
              <FileText
                size={18}
                className={heaFile ? "text-emerald-500" : "text-gray-400"}
              />
              <span className="text-sm text-gray-600 truncate">
                {heaFile ? heaFile.name : "Choose .hea file…"}
              </span>
              <input
                type="file"
                accept=".hea"
                className="hidden"
                onChange={(e) => setHeaFile(e.target.files[0])}
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 pt-0">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white
                       bg-gradient-to-r from-blue-500 to-indigo-600
                       shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300
                       hover:-translate-y-0.5 transition-all duration-300
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                {saveStatus === "" && (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing ECG…
                  </>
                )}
                {saveStatus === "success" && (
                  <>
                    <CheckCircle size={18} className="text-emerald-300" />
                    Saved Successfully!
                  </>
                )}
                {saveStatus === "error" && (
                  <>
                    <AlertCircle size={18} className="text-orange-300" />
                    Analysis OK, Save Failed
                  </>
                )}
              </span>
            ) : (
              "Upload & Analyze"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
