import React, { useEffect, useState } from 'react';

const GraphCard = () => {
  const [data, setData] = useState([]);

  // Backend API URL 
  const API_URL = "https://iot-test-red.vercel.app/api/ecg"; 
  // Change this to your actual backend endpoint

  useEffect(() => {
    const timer = setInterval(() => {
      fetch(API_URL)
        .then(res => res.json())
        .then(result => {
          if (result?.ecg) {
            setData(result.ecg);
          }
        })
        .catch(err => console.log("ECG Fetch Error:", err));
    }, 1000); // Fetch every 1 sec

    return () => clearInterval(timer);
  }, []);

  // Convert data → polyline points
  const points = data
    .map((value, index) => `${index * 30},${50 - value}`)
    .join(" ");

  return (
    <div className="glass-card p-4 rounded-xl shadow-sm border border-gray-100 col-span-1 sm:col-span-2">

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Live ECG</p>
          <p className="text-lg font-semibold text-gray-800">Realtime</p>
        </div>
        <div className="text-sm text-gray-500">Last 10 sec</div>
      </div>

      <div className="mt-4">
        <svg viewBox="0 0 300 50" className="w-full h-20">
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="2"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

    </div>
  );
};

export default GraphCard;
