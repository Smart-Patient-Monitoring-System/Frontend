import React, { useState } from "react";
import { Upload, Database, Download, Activity } from "lucide-react";
import UploadModal from "./UploadModal";

function ECGheader({ onFileUpload }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="w-full bg-white p-5 rounded-3xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-6">

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

        <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">

          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 transition rounded-2xl flex items-center gap-2 w-full md:w-auto"
          >
            <Upload size={18} /> Import XML/CSV
          </button>

          <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 transition rounded-2xl flex items-center gap-2 w-full md:w-auto">
            <Database size={18} /> PhysioNet Data
          </button>

          <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 transition rounded-2xl flex items-center gap-2 w-full md:w-auto">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <UploadModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onFileUpload={onFileUpload}
      />
    </>
  );
}

export default ECGheader;
