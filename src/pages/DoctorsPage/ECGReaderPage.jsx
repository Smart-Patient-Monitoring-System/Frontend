import React, { useState, useEffect } from "react";
import { Activity, Upload, FileText, Brain, Heart, Zap, Clock, User } from "lucide-react";
import UploadModal from "./componants/UploadModal";
import ECGGraph from "./componants/ECGGraph";
import axios from "axios";

const API_BASE = "http://localhost:8088";

function ECGReaderPage({ doctorId }) {
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!doctorId) return;
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/doctor/${doctorId}/patients/ecg-history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
        if (res.data && res.data.length > 0) {
          setAnalysis(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching ECG history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [doctorId]);

  const isNormal = analysis?.status?.toLowerCase() === "normal" || analysis?.prediction?.toLowerCase() === "normal";

  const getRiskColor = (prediction) => {
    const p = prediction?.toLowerCase() || "";
    if (p === "normal") return "bg-green-100 text-green-700 border-green-200";
    if (p === "abnormal" || p.includes("premature")) return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  return (
    <div className="space-y-6">

      {/* ── Header Card ── */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-sm border border-gray-100
                      flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600
                          flex items-center justify-center shadow-lg shadow-red-200">
            <Activity size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">ECG Reader</h3>
            <p className="text-gray-400 text-sm">
              12-Lead ECG Analysis &amp; Historical AI Interpretation
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm
                     shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300
                     hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
        >
          <Upload size={16} />
          Upload New ECG
        </button>
      </div>

      {/* ── Upload Modal ── */}
      <UploadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAnalyze={(data) => {
          setAnalysis(data);
          setOpenModal(false);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-0 duration-500">

        {/* ── Left Sidebar: History List ── */}
        <div className="lg:col-span-1 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 p-5 h-[700px] overflow-y-auto">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-800">Patients' ECG History</h2>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10">
              <Heart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No historical ECG records found for your patients.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((reading) => (
                <div
                  key={reading.id}
                  onClick={() => setAnalysis(reading)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 group
                              ${analysis?.id === reading.id
                      ? 'border-indigo-400 bg-indigo-50 shadow-sm'
                      : 'border-gray-100 bg-gray-50/50 hover:border-indigo-200 hover:bg-white'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-800 text-sm">
                      {new Date(reading.recordedAt).toLocaleDateString()}
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getRiskColor(reading.prediction || reading.status)}`}>
                      {reading.prediction || reading.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-100/50 px-2 py-1 rounded w-fit">
                      <User size={12} />
                      {reading.patientName || `Patient #${reading.patientId}`}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">
                      {new Date(reading.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Conf: {reading.probability ? (reading.probability * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Main Viewer (Graph + Metrics) ── */}
        <div className="lg:col-span-2">
          {!analysis ? (
            <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-gray-200 h-full flex flex-col justify-center items-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
                <FileText size={28} className="text-indigo-300" />
              </div>
              <h4 className="text-gray-500 font-bold text-lg">No Analysis Selected</h4>
              <p className="text-gray-400 text-sm mt-1 max-w-sm">
                Select a historical record from the sidebar or upload new <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">.dat</span> + <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">.hea</span> files.
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-in slide-in-from-right-4 duration-500 fade-in pb-10">

              {/* ── Status Banner ── */}
              <div className={`rounded-2xl p-5 border flex items-center justify-between gap-4
                  ${isNormal
                    ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
                    : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                      ${isNormal ? "bg-emerald-500/15" : "bg-red-500/15 animate-pulse"}`}
                  >
                    <Heart size={24} className={isNormal ? "text-emerald-600" : "text-red-600"} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isNormal ? "text-emerald-800" : "text-red-800"}`}>
                      {analysis.prediction || analysis.status}
                    </h3>
                    <p className="text-sm font-medium mt-0.5" style={{ color: isNormal ? '#059669' : '#dc2626' }}>
                      Confidence: {((analysis.probability || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {analysis.patientName && (
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs uppercase tracking-wider font-bold opacity-60">Patient</span>
                    <span className="font-bold text-lg">{analysis.patientName}</span>
                  </div>
                )}
              </div>

              {/* ── ECG Waveform Graph ── */}
              <ECGGraph
                waveform={analysis.waveform || (analysis.waveformJson ? JSON.parse(analysis.waveformJson) : [])}
                fs={analysis.fs || 500}
              />

              {/* ── Metrics Grid ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm transition-all hover:bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart size={14} className="text-red-400" />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Mean HR</span>
                  </div>
                  <p className="text-2xl font-black text-gray-800">
                    {analysis.meanHR || 0}
                    <span className="text-sm font-bold text-gray-400 ml-1">bpm</span>
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm transition-all hover:bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={14} className="text-yellow-500" />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">SDNN</span>
                  </div>
                  <p className="text-2xl font-black text-gray-800">
                    {typeof analysis.sdnn !== "undefined" ? analysis.sdnn.toFixed(1) : analysis.SDNN || 0}
                    <span className="text-sm font-bold text-gray-400 ml-1">ms</span>
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm transition-all hover:bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity size={14} className="text-blue-400" />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">RMSSD</span>
                  </div>
                  <p className="text-2xl font-black text-gray-800">
                    {typeof analysis.rmssd !== "undefined" ? analysis.rmssd.toFixed(1) : analysis.RMSSD || 0}
                    <span className="text-sm font-bold text-gray-400 ml-1">ms</span>
                  </p>
                </div>

                <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm transition-all hover:bg-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart size={14} className="text-purple-400" />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Beats</span>
                  </div>
                  <p className="text-2xl font-black text-gray-800">
                    {analysis.beats || 0}
                    <span className="text-sm font-bold text-gray-400 ml-1">detected</span>
                  </p>
                </div>
              </div>

              {/* ── AI Interpretation ── */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600
                                  flex items-center justify-center shadow-lg shadow-indigo-200">
                    <Brain size={20} className="text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">AI Medical Rationale</h4>
                </div>

                <div className={`rounded-xl p-5 border ${isNormal
                      ? "bg-emerald-50/50 border-emerald-100"
                      : "bg-red-50/50 border-red-100"
                    }`}
                >
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
                    {analysis.rationale || "No detailed rationale provided by AI model."}
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ECGReaderPage;
