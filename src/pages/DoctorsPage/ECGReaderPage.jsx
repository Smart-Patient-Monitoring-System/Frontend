import React, { useState } from "react";
import ECGheader from "./componants/ECGheader";

function ECGReaderPage() {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (file) => {
    console.log("📤 File received in ECGReaderPage:", file);
    setUploadedFile(file);
  };

  return (
    <div className="p-6">

      {/* Header */}
      <ECGheader onFileUpload={handleFileUpload} />

      {/* Show output */}
      {!uploadedFile ? (
        <p className="text-center text-gray-500 mt-10">
          Upload an ECG file to display graph.
        </p>
      ) : (
        <div className="mt-10 text-center bg-green-100 text-green-800 p-4 rounded-xl">
          <h3 className="font-bold text-lg">File Uploaded Successfully ✔</h3>
          <p className="mt-2">{uploadedFile.name}</p>
        </div>
      )}

    </div>
  );
}

export default ECGReaderPage;
