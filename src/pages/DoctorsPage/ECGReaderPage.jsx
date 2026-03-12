import React, { useState } from "react";
import ECGheader from "./componants/ECGheader";
import ECGGraph from "./componants/ECGGraph";
import AnalysisDetails from "./componants/AnalysisDetails";
import AIInterpretation from "./componants/AIInterpretation";
import PatientProfile from "./componants/PatientProfile";

function ECGReaderPage() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="p-6 space-y-6">

      <ECGheader onAnalyze={setAnalysis} />

      {!analysis && (
        <p className="text-center text-gray-500">
          Upload ECG (.dat + .hea) files to analyze
        </p>
      )}

      {analysis && (
        <>
          {/* Patient Profile Card */}
          {analysis.patient && (
            <PatientProfile patient={analysis.patient} />
          )}

          {/* ECG Waveform Graph */}
          <ECGGraph waveform={analysis.waveform} fs={analysis.fs} />

          {/* Analysis Details */}
          <AnalysisDetails
            meanHR={analysis.meanHR}
            sdnn={analysis.SDNN}
            rmssd={analysis.RMSSD}
            beats={analysis.beats}
            status={analysis.status} />

          {/* AI CNN Interpretation */}
          <AIInterpretation
            diagnosis={analysis.prediction}
            rationale={analysis.rationale}
            confidence={
              analysis.prediction === "Abnormal"
                ? Math.round(analysis.probability * 100)
                : Math.round((1 - analysis.probability) * 100)
            } />
        </>
      )}
    </div>
  );
}

export default ECGReaderPage;
