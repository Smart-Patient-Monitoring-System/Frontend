import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip);

function ECGGraph({ waveform, fs }) {
  if (!waveform || waveform.length === 0) {
    return (
      <div className="bg-gray-900 rounded-2xl p-8 text-center">
        <p className="text-gray-500 text-sm">No waveform data to display</p>
      </div>
    );
  }

  const labels = waveform.map((_, i) => (i / fs).toFixed(2));

  const data = {
    labels,
    datasets: [
      {
        label: "ECG Signal (mV)",
        data: waveform,
        borderColor: "#22c55e",
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.15,
        fill: {
          target: "origin",
          above: "rgba(34, 197, 94, 0.05)",
          below: "rgba(34, 197, 94, 0.05)",
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: "easeOutQuart" },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          title: (ctx) => `Time: ${ctx[0].label}s`,
          label: (ctx) => `Amplitude: ${ctx.parsed.y.toFixed(4)} mV`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: "rgba(255,255,255,0.06)",
          drawTicks: false,
        },
        ticks: {
          color: "rgba(255,255,255,0.3)",
          font: { size: 9 },
          maxTicksLimit: 12,
          callback: (val, idx) => {
            const t = parseFloat(labels[idx]);
            return t % 1 === 0 ? `${t}s` : "";
          },
        },
        border: { display: false },
      },
      y: {
        display: true,
        grid: {
          color: "rgba(255,255,255,0.06)",
          drawTicks: false,
        },
        ticks: {
          color: "rgba(255,255,255,0.3)",
          font: { size: 9 },
          maxTicksLimit: 6,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800
                    rounded-2xl p-5 shadow-xl border border-gray-800 relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400/80 text-xs font-medium tracking-wider uppercase">
            ECG Waveform
          </span>
        </div>
        <span className="text-gray-500 text-xs">
          {fs} Hz · {(waveform.length / fs).toFixed(1)}s
        </span>
      </div>

      {/* Graph */}
      <div className="relative z-10" style={{ height: "280px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default ECGGraph;
