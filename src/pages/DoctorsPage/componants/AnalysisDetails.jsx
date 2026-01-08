function AnalysisDetails({ meanHR, sdnn, rmssd, beats, status }) {
  if (!meanHR) return null;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-md">

      <h3 className="font-bold text-lg mb-4">Analysis Details</h3>

      <p><strong>Mean HR:</strong> {meanHR} bpm</p>
      <p><strong>SDNN:</strong> {sdnn} ms</p>
      <p><strong>RMSSD:</strong> {rmssd} ms</p>
      <p><strong>Beats Detected:</strong> {beats}</p>

      <p className="mt-3">
        <strong>Status:</strong> {status}
      </p>
    </div>
    
  );
}

export default AnalysisDetails;
