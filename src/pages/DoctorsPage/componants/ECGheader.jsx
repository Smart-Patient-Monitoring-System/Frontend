import React, { useState } from "react";
import { Upload, Database, Download, Activity } from "lucide-react";
import UploadModal from "./UploadModal";

function ECGheader({ onAnalyze }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="w-full bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">
          <div className="bg-red-500 text-white p-3 rounded-2xl shadow-md">
            <Activity size={26} />
          </div>

          <div>
            <h3 className="text-xl font-bold">ECG Reader</h3>
            <p className="text-gray-500 text-sm">
              12-Lead ECG Analysis & Interpretation
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-2xl flex items-center gap-2"
          >
            <Upload size={18} /> Import XML/CSV
          </button>

          <button className="px-4 py-2 bg-blue-50 rounded-2xl flex items-center gap-2">
            <Database size={18} /> PhysioNet Data
          </button>

          <button className="px-4 py-2 bg-blue-50 rounded-2xl flex items-center gap-2">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <UploadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAnalyze={onAnalyze}   // 🔥 CORRECT PROP
      />
    </>
  );
}

export default ECGheader;
