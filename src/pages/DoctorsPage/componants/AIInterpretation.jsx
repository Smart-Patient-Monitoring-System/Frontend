function AIInterpretation({ diagnosis, rationale, confidence }) {
  if (!diagnosis) return null;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-md">
      <h3 className="font-bold text-lg mb-2">AI ECG Interpretation</h3>

      <div className="bg-green-50 border border-green-300 p-3 rounded-xl mb-3">
        <p className="text-green-700 font-semibold">{diagnosis}</p>
        {confidence && (
          <p className="text-green-600 text-sm">{confidence}% confidence</p>
        )}
      </div>

      <p className="text-gray-600">{rationale}</p>
    </div>
  );
}

export default AIInterpretation;
