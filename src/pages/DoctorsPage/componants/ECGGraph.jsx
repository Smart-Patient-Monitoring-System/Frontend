import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function ECGGraph({ waveform, fs }) {
  if (!waveform || waveform.length === 0)
    return <p className="text-gray-500">Upload an ECG file to display graph.</p>;

  const labels = waveform.map((_, i) => (i / fs).toFixed(2)); // time in seconds

  const data = {
    labels: labels,
    datasets: [
      {
        label: "ECG Signal",
        data: waveform,
        borderColor: "#32CD32",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.2, // smooth line
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="bg-[#0d1b2a] rounded-3xl p-5 shadow-lg w-full">
      <Line data={data} options={options} />
    </div>
  );
}

export default ECGGraph;
