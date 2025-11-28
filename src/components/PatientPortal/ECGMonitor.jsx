import React, { useState, useEffect, useRef } from 'react';
import { Activity, Heart, Moon, Pause, Play, Download } from 'lucide-react';

const ECGMonitor = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const offsetRef = useRef(0);

  // ECG waveform data points (normalized -1 to 1)
  const ecgPattern = [
    0, 0.05, 0.1, 0.15, 0.1, 0.05, 0, -0.05, -0.1, -0.05, 0,
    0, 0, 0, 0, 0.1, 0.3, 0.6, 1, 0.5, 0, -0.2, -0.1, 0,
    0, 0, 0, 0, 0, 0.05, 0.15, 0.25, 0.3, 0.25, 0.15, 0.05, 0,
    -0.05, -0.1, -0.05, 0, 0, 0, 0, 0, 0, 0, 0
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
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

      // Clear with fade effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw ECG line
      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      const pointsPerPixel = 0.5;
      const speed = 2;

      for (let x = 0; x < width; x++) {
        const dataIndex = Math.floor((x + offsetRef.current) * pointsPerPixel) % ecgPattern.length;
        const y = centerY - ecgPattern[dataIndex] * amplitude;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      offsetRef.current += speed;
      if (offsetRef.current > ecgPattern.length / pointsPerPixel) {
        offsetRef.current = 0;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    // Simulate heart rate variation
    const hrInterval = setInterval(() => {
      if (!isPaused) {
        setHeartRate(prev => {
          const variation = Math.random() * 4 - 2;
          return Math.round(Math.max(60, Math.min(90, prev + variation)));
        });
      }
    }, 2000);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearInterval(hrInterval);
    };
  }, [isPaused]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-2xl p-4 shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">ECG Monitor</h1>
              <p className="text-gray-500">Real-time electrocardiogram</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
              <Moon className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={togglePause}
              className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-gray-600" />
              ) : (
                <Pause className="w-5 h-5 text-gray-600" />
              )}
              <span className="font-semibold text-gray-700">
                {isPaused ? 'Resume' : 'Pause'}
              </span>
            </button>
            <button className="p-3 rounded-xl hover:bg-gray-100 transition-colors">
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* ECG Display */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg"
            style={{ background: '#0f172a' }}
          />
          
          {/* BPM Badge */}
          <div className="absolute top-8 right-8 bg-slate-800/80 backdrop-blur-sm rounded-full px-5 py-3 flex items-center gap-2 shadow-lg border border-slate-700">
            <Heart className="w-5 h-5 text-red-400" fill="currentColor" />
            <span className="text-white font-bold text-lg">{heartRate} BPM</span>
          </div>

          {isPaused && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="bg-white/90 rounded-xl px-6 py-3 flex items-center gap-2">
                <Pause className="w-5 h-5 text-gray-700" />
                <span className="font-semibold text-gray-700">Paused</span>
              </div>
            </div>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">Heart Rate</p>
            <p className="text-2xl font-bold text-gray-800">{heartRate} bpm</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">Rhythm</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-green-600">Normal Sinus</p>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">QRS Duration</p>
            <p className="text-2xl font-bold text-gray-800">92 ms</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">QT Interval</p>
            <p className="text-2xl font-bold text-gray-800">380 ms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECGMonitor;