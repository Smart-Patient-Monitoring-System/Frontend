import React, { useState } from "react";
import { X, Upload } from "lucide-react";

function UploadModal({ open, onClose, onFileUpload }) {
  if (!open) return null;

  const [highlight, setHighlight] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setHighlight(false);

    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const prevent = (e) => e.preventDefault();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[90%] md:w-[450px] p-6 rounded-3xl shadow-xl relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-2">Upload ECG File</h2>
        <p className="text-gray-500 text-sm mb-4">
          Drop your ECG file here or browse (XML, CSV supported)
        </p>

        <label
          onDragEnter={(e) => {
            prevent(e);
            setHighlight(true);
          }}
          onDragLeave={(e) => {
            prevent(e);
            setHighlight(false);
          }}
          onDragOver={prevent}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition 
            ${highlight ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          `}
        >
          <Upload size={36} className="text-blue-500 mb-2" />

          <span className="text-gray-600">
            {selectedFile ? selectedFile.name : "Drag & Drop ECG File"}
          </span>

          <input
            type="file"
            className="hidden"
            accept=".xml,.csv,.hea,.dat"
            onChange={handleFileSelect}
          />
        </label>

        <button
          onClick={() => {
            if (!selectedFile) return alert("Select a file!");
            onFileUpload(selectedFile);
            onClose();
          }}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-xl"
        >
          Upload & Process
        </button>
      </div>
    </div>
  );
}

export default UploadModal;
