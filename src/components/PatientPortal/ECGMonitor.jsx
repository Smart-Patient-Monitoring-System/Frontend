import React, { useState, useEffect, useRef } from 'react';
import { Activity, Heart, Moon, Pause, Play, Download, Brain, AlertTriangle, CheckCircle, TrendingUp, Calendar, Clock } from 'lucide-react';

const ECGMonitor = ({ isFullPage = false }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const offsetRef = useRef(0);

  const ecgPattern = [
    0, 0.05, 0.1, 0.15, 0.1, 0.05, 0, -0.05, -0.1, -0.05, 0,
    0, 0, 0, 0, 0.1, 0.3, 0.6, 1, 0.5, 0, -0.2, -0.1, 0,
    0, 0, 0, 0, 0, 0.05, 0.15, 0.25, 0.3, 0.25, 0.15, 0.05, 0,
    -0.05, -0.1, -0.05, 0, 0, 0, 0, 0, 0, 0, 0
  ];

  const aiPredictions = [
    { title: "Risk Assessment", risk: "Low", confidence: 94, color: "green", description: "Current ECG patterns indicate normal cardiac function with no immediate concerns." },
    { title: "Arrhythmia Detection", risk: "None Detected", confidence: 96, color: "green", description: "No irregular heart rhythms detected." },
    { title: "Heart Rate Variability", risk: "Normal", confidence: 92, color: "green", description: "HRV analysis shows healthy autonomic function." },
    { title: "Ischemia Indicators", risk: "Not Detected", confidence: 89, color: "green", description: "No signs of reduced blood flow." }
  ];

  const recentReadings = [
    { date: "Today, 10:30 AM", hr: 72, status: "Normal", interpretation: "Regular sinus rhythm" },
    { date: "Today, 08:15 AM", hr: 68, status: "Normal", interpretation: "Regular sinus rhythm" },
    { date: "Yesterday, 9:45 PM", hr: 75, status: "Normal", interpretation: "Regular sinus rhythm" },
    { date: "Yesterday, 2:20 PM", hr: 70, status: "Normal", interpretation: "Regular sinus rhythm" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      if (isPaused) return;

      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;
      const amplitude = height * 0.35;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;

      const pointsPerPixel = 0.5;
      const speed = 2;

      for (let x = 0; x < width; x++) {
        const dataIndex = Math.floor((x + offsetRef.current) * pointsPerPixel) % ecgPattern.length;
        const y = centerY - ecgPattern[dataIndex] * amplitude;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();

      offsetRef.current += speed;

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const hrInterval = setInterval(() => {
      if (!isPaused) {
        setHeartRate(prev => {
          const variation = Math.random() * 4 - 2;
          return Math.round(Math.max(60, Math.min(90, prev + variation)));
        });
      }
    }, 2000);

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearInterval(hrInterval);
    };
  }, [isPaused]);

  const togglePause = () => setIsPaused(!isPaused);

  const getRiskColor = (color) => {
    const colors = {
      green: "bg-green-100 text-green-700 border-green-200",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
      red: "bg-red-100 text-red-700 border-red-200"
    };
    return colors[color];
  };

  return (
    <div className={isFullPage ? "space-y-4 sm:space-y-5 md:space-y-6" : "bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6"}>

      {/* ECG CARD - Responsive */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-lg">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">ECG Monitor</h2>
              <p className="text-gray-500 text-xs sm:text-sm">Real-time electrocardiogram</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button onClick={togglePause} className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg sm:rounded-xl hover:bg-gray-100 text-sm">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="font-semibold text-sm">{isPaused ? "Resume" : "Pause"}</span>
            </button>
            <button className="p-2 rounded-lg sm:rounded-xl hover:bg-gray-100">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 shadow-xl">
          <canvas ref={canvasRef} className="w-full h-32 sm:h-40 md:h-48 rounded-lg" style={{ background: "#0f172a" }} />

          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 bg-slate-800/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
            <span className="text-white font-bold text-sm sm:text-base">{heartRate} BPM</span>
          </div>

          {isPaused && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
              <div className="bg-white/90 rounded-xl px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-2">
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">Paused</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <p className="text-gray-500 text-xs">Heart Rate</p>
            <p className="text-lg sm:text-xl font-bold">{heartRate} bpm</p>
          </div>

          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <p className="text-gray-500 text-xs">Rhythm</p>
            <div className="flex items-center gap-2">
              <p className="font-bold text-green-600 text-sm sm:text-base">Normal Sinus</p>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <p className="text-gray-500 text-xs">QRS Duration</p>
            <p className="text-lg sm:text-xl font-bold">92 ms</p>
          </div>

          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <p className="text-gray-500 text-xs">QT Interval</p>
            <p className="text-lg sm:text-xl font-bold">380 ms</p>
          </div>
        </div>
      </div>

      {/* AI INTERPRETATION - Responsive */}
      <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100">
        <div className="flex items-start gap-2 sm:gap-3">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">AI ECG Interpretation</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li className="flex items-center gap-2 text-xs sm:text-sm text-blue-800">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" /> 
                Normal sinus rhythm detected
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-blue-800">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" /> 
                No arrhythmias detected
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-blue-800">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" /> 
                Healthy heart rate variability
              </li>
              <li className="flex items-center gap-2 text-xs sm:text-sm text-blue-800">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" /> 
                No ST segment abnormalities
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Full Page Extra Sections - Responsive */}
      {isFullPage && (
        <>
          {/* Predictions */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">AI Cardiac Analysis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {aiPredictions.map((p, i) => (
                <div key={i} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-sm sm:text-base">{p.title}</h3>
                    <span className={`self-start px-2.5 py-1 sm:px-3 text-xs rounded-full border ${getRiskColor(p.color)}`}>
                      {p.risk}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 mb-3">{p.description}</p>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <span className="text-xs text-gray-500">AI Confidence</span>
                    <div className="flex items-center gap-2">
                      <div className="w-full sm:w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${p.confidence}%` }} />
                      </div>
                      <span className="font-semibold text-xs sm:text-sm whitespace-nowrap">{p.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Readings - Responsive */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent ECG Readings</h2>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {recentReadings.map((r, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-white rounded-lg p-2 shadow-sm flex-shrink-0">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">{r.interpretation}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{r.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                    <div className="text-left sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-500">Heart Rate</p>
                      <p className="text-base sm:text-lg font-bold">{r.hr} bpm</p>
                    </div>

                    <span className="px-2.5 py-1 sm:px-3 bg-green-100 text-green-700 rounded-full text-xs border whitespace-nowrap">
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations - Responsive */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Health Recommendations</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="font-semibold text-sm sm:text-base mb-1">Continue Current Treatment</h3>
                <p className="text-xs sm:text-sm text-gray-600">Your rhythm is stable, continue medications.</p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="font-semibold text-sm sm:text-base mb-1">Regular Monitoring</h3>
                <p className="text-xs sm:text-sm text-gray-600">Schedule follow-up ECG in 30 days.</p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="font-semibold text-sm sm:text-base mb-1">Lifestyle Factors</h3>
                <p className="text-xs sm:text-sm text-gray-600">Maintain exercise and heart-healthy diet.</p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
                <h3 className="font-semibold text-sm sm:text-base mb-1">Alert Settings</h3>
                <p className="text-xs sm:text-sm text-gray-600">Real-time alerts enabled for abnormalities.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ECGMonitor;