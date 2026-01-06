import React, { useState } from "react";
import ECGheader from "./componants/ECGheader";
import ECGGraph from "./componants/ECGGraph";
import AnalysisDetails from "./componants/AnalysisDetails";
import AIInterpretation from "./componants/AIInterpretation";

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
          <ECGGraph waveform={analysis.waveform} fs={analysis.fs} />

          <AnalysisDetails
            meanHR={analysis.meanHR}
            sdnn={analysis.SDNN}
            rmssd={analysis.RMSSD}
            status={analysis.status}/>

          <AIInterpretation
            diagnosis={analysis.status}
            rationale={analysis.rationale}/>
        </>
      )}
    </div>
  );
}

export default ECGReaderPage;
