import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

function UploadModal({ open, onClose, onAnalyze }) {
  if (!open) return null;

  const [patientId, setPatientId] = useState("");
  const [datFile, setDatFile] = useState(null);
  const [heaFile, setHeaFile] = useState(null);
  const [loading, setLoading] = useState(false);

 const handleSubmit = async () => {
  if (!patientId || !datFile || !heaFile) {
    alert("Please fill all fields");
    return;
  }

  const formData = new FormData();
  formData.append("dat_file", datFile);
  formData.append("hea_file", heaFile);

  try {
    setLoading(true);

    const res = await axios.post(
      `http://localhost:8081/api/ecg/analyze?patientId=${patientId}`,
      formData
    );

    onAnalyze(res.data);
    onClose();
  } catch (err) {
    console.error(err);
    alert("ECG analysis failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] p-6 rounded-3xl shadow-xl relative">

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
          <X />
        </button>

        <h2 className="text-xl font-bold mb-4">Upload ECG</h2>

        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2 text-sm font-medium">ECG .dat file</label>
        <input type="file" accept=".dat" onChange={(e) => setDatFile(e.target.files[0])} />

        <label className="block mb-2 mt-3 text-sm font-medium">ECG .hea file</label>
        <input type="file" accept=".hea" onChange={(e) => setHeaFile(e.target.files[0])} />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>
    </div>
  );
}

export default UploadModal;
