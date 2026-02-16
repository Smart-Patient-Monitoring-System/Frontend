import { AlertTriangle, CheckCircle } from "lucide-react";

function AIInterpretation({ diagnosis, rationale, confidence }) {
  if (!diagnosis) return null;

  const isAbnormal = diagnosis === "Abnormal";

  return (
    <div className="bg-white rounded-3xl p-5 shadow-md">
      <h3 className="font-bold text-lg mb-3">🤖 AI ECG Interpretation (CNN)</h3>

      <div
        className={`p-4 rounded-xl mb-3 border ${isAbnormal
            ? "bg-red-50 border-red-300"
            : "bg-green-50 border-green-300"
          }`}
      >
        <div className="flex items-center gap-2 mb-1">
          {isAbnormal ? (
            <AlertTriangle className="text-red-600" size={20} />
          ) : (
            <CheckCircle className="text-green-600" size={20} />
          )}
          <p
            className={`font-semibold text-lg ${isAbnormal ? "text-red-700" : "text-green-700"
              }`}
          >
            {diagnosis}
          </p>
        </div>

        {confidence !== undefined && confidence !== null && (
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className={isAbnormal ? "text-red-600" : "text-green-600"}>
                Confidence
              </span>
              <span className={`font-medium ${isAbnormal ? "text-red-700" : "text-green-700"}`}>
                {confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${isAbnormal ? "bg-red-500" : "bg-green-500"
                  }`}
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{rationale}</p>
    </div>
  );
}

export default AIInterpretation;
