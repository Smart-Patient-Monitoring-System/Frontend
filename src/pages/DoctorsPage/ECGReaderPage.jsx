import React, { useState } from "react";
import { Activity, Upload, FileText, Brain, Heart, Zap } from "lucide-react";
import UploadModal from "./componants/UploadModal";
import ECGGraph from "./componants/ECGGraph";

function ECGReaderPage() {
  const [analysis, setAnalysis] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  /* Classify severity */
  const isNormal = analysis?.status?.toLowerCase() === "normal";

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
              12-Lead ECG Analysis &amp; AI Interpretation
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm
                     shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300
                     hover:-translate-y-0.5 transition-all duration-300"
        >
          <Upload size={16} />
          Upload ECG Files
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

      {/* ── Placeholder when no analysis ── */}
      {!analysis && (
        <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-gray-300" />
          </div>
          <h4 className="text-gray-500 font-semibold text-lg">
            No ECG Data Yet
          </h4>
          <p className="text-gray-400 text-sm mt-1">
            Upload ECG <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">.dat</span> +{" "}
            <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">.hea</span> files to analyze
          </p>
        </div>
      )}

      {/* ══════════════ RESULTS ══════════════ */}
      {analysis && (
        <div className="space-y-5 animate-in fade-in-0 duration-500">

          {/* ── Status Banner ── */}
          <div
            className={`rounded-2xl p-5 border flex items-center gap-4
              ${isNormal
                ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200"
                : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
              }`}
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center
                ${isNormal ? "bg-emerald-500/15" : "bg-red-500/15 animate-pulse"}`}
            >
              <Heart
                size={24}
                className={isNormal ? "text-emerald-600" : "text-red-600"}
              />
            </div>
            <div>
              <h3
                className={`text-lg font-bold ${isNormal ? "text-emerald-800" : "text-red-800"
                  }`}
              >
                {analysis.prediction || analysis.status}
              </h3>
              <p className="text-sm text-gray-500">
                Confidence:{" "}
                <span className="font-semibold">
                  {(analysis.probability * 100).toFixed(1)}%
                </span>
                {" · "}
                {analysis.beats} beats analyzed
              </p>
            </div>
          </div>

          {/* ── ECG Waveform Graph ── */}
          <ECGGraph waveform={analysis.waveform} fs={analysis.fs} />

          {/* ── Metrics Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Mean HR */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={14} className="text-red-400" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Mean HR
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {analysis.meanHR}
                <span className="text-sm font-normal text-gray-400 ml-1">bpm</span>
              </p>
            </div>

            {/* SDNN */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-yellow-500" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  SDNN
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {typeof analysis.sdnn !== "undefined"
                  ? analysis.sdnn
                  : analysis.SDNN}
                <span className="text-sm font-normal text-gray-400 ml-1">ms</span>
              </p>
            </div>

            {/* RMSSD */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} className="text-blue-400" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  RMSSD
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {typeof analysis.rmssd !== "undefined"
                  ? analysis.rmssd
                  : analysis.RMSSD}
                <span className="text-sm font-normal text-gray-400 ml-1">ms</span>
              </p>
            </div>

            {/* Beats */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={14} className="text-purple-400" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  Beats
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {analysis.beats}
                <span className="text-sm font-normal text-gray-400 ml-1">detected</span>
              </p>
            </div>
          </div>

          {/* ── AI Interpretation ── */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600
                              flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
              <h4 className="font-bold text-gray-800">AI Interpretation</h4>
            </div>

            <div
              className={`rounded-xl p-4 border ${isNormal
                  ? "bg-emerald-50/50 border-emerald-200"
                  : "bg-red-50/50 border-red-200"
                }`}
            >
              <p
                className={`font-semibold text-sm ${isNormal ? "text-emerald-700" : "text-red-700"
                  }`}
              >
                Diagnosis: {analysis.status}
              </p>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {analysis.rationale}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ECGReaderPage;
