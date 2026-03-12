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

      // Step 1: Send files directly to VitalReports for ECG analysis
      const ecgRes = await axios.post(
        "http://localhost:8083/api/ecg/analyze",
        formData
      );

      // Step 2: Fetch patient data from MainService
      let patientData = null;
      try {
        const token = localStorage.getItem("token");
        const patientRes = await axios.get(
          `http://localhost:8080/api/patient/get/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        patientData = patientRes.data;
      } catch (patientErr) {
        console.warn("Could not fetch patient data:", patientErr.message);
      }

      // Combine ECG results + patient info
      const combined = {
        ...ecgRes.data,
        ...(patientData ? { patient: patientData } : {}),
      };

      onAnalyze(combined);

      // Step 3: If ECG is abnormal, create a critical alert
      if (ecgRes.data.status === "Abnormal") {
        try {
          const token = localStorage.getItem("token");
          await axios.post(
            "http://localhost:8080/api/doctor/critical-alerts",
            {
              patientId: parseInt(patientId),
              patientName: patientData?.name || `Patient #${patientId}`,
              alertType: "ECG Abnormal",
              heartRate: ecgRes.data.meanHR || 0,
              triageLevel: "HIGH",
              severity: "RED",
              description: ecgRes.data.rationale || "Abnormal ECG detected by CNN model",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (alertErr) {
          console.warn("Could not create critical alert:", alertErr.message);
        }
      }

      onClose();
    } catch (err) {
      console.error("Full error:", err);
      console.error("Response data:", err.response?.data);
      const msg = err.response?.data?.error
        || err.response?.data?.message
        || (typeof err.response?.data === 'string' ? err.response.data : null)
        || err.message
        || "Unknown error";
      alert("ECG analysis failed: " + msg);
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
        <input
          type="file"
          accept=".dat"
          onChange={(e) => setDatFile(e.target.files[0])}
          className="mb-4"
        />

        <label className="block mb-2 text-sm font-medium">ECG .hea file</label>
        <input
          type="file"
          accept=".hea"
          onChange={(e) => setHeaFile(e.target.files[0])}
          className="mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </div>
    </div>
  );
}

export default UploadModal;
