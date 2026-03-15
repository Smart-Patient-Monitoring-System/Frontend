import React, { useState, useEffect, useRef } from 'react';
import {
    Activity, Heart, Pause, Play, Download, Brain, CheckCircle,
    TrendingUp, Clock, AlertCircle
} from 'lucide-react';

const ECGMonitor = ({ isFullPage = false, patientId }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [history, setHistory] = useState([]);
    const [selectedReading, setSelectedReading] = useState(null);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const offsetRef = useRef(0);

    // Generic pattern if waveform is missing
    const genericPattern = [
        0, 0.05, 0.1, 0.15, 0.1, 0.05, 0, -0.05, -0.1, -0.05, 0,
        0, 0, 0, 0, 0.1, 0.3, 0.6, 1, 0.5, 0, -0.2, -0.1, 0,
        0, 0, 0, 0, 0, 0.05, 0.15, 0.25, 0.3, 0.25, 0.15, 0.05, 0,
        -0.05, -0.1, -0.05, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    useEffect(() => {
        const fetchHistory = async () => {
            if (!patientId) {
                setLoading(false);
                return;
            }
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:8088/api/patient/ecg/history/${patientId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                    if (data.length > 0) {
                        setSelectedReading(data[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching ECG history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [patientId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !selectedReading) return;

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        let pattern = genericPattern;
        try {
            if (selectedReading.waveformJson) {
                const parsed = JSON.parse(selectedReading.waveformJson);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    pattern = parsed;
                }
            }
        } catch (e) { }

        const draw = () => {
            if (isPaused) return;
            const width = rect.width;
            const height = rect.height;
            const centerY = height / 2;
            const amplitude = height * 0.35;

            ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.fillRect(0, 0, width, height);

            ctx.beginPath();
            // Color depends on status: green for normal, red for abnormal
            ctx.strokeStyle = selectedReading.prediction === "Normal" ? '#10b981' : '#ef4444';
            ctx.lineWidth = 2;

            // Adjust speed and points to make waveform look good
            const pointsPerPixel = pattern.length > 100 ? 0.3 : 0.5;
            const speed = pattern.length > 100 ? 1 : 2;

            for (let x = 0; x < width; x++) {
                const dataIndex = Math.floor((x + offsetRef.current) * pointsPerPixel) % pattern.length;
                let val = pattern[dataIndex];

                // Dynamic amplitude scaling based on raw data to prevent it going off screen
                // Neural net predictions often come back with weird scales. Let's just limit it manually.
                const y = centerY - val * amplitude;

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.stroke();
            offsetRef.current += speed;
            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => cancelAnimationFrame(animationRef.current);
    }, [isPaused, selectedReading]);

    const togglePause = () => setIsPaused(!isPaused);

    const downloadECGImage = () => {
        const sourceCanvas = canvasRef.current;
        if (!sourceCanvas) return;
        const reportCanvas = document.createElement("canvas");
        const ctx = reportCanvas.getContext("2d");
        const width = sourceCanvas.width;
        const height = sourceCanvas.height + 160;

        reportCanvas.width = width;
        reportCanvas.height = height;

        ctx.fillStyle = "#020617";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px Arial";
        ctx.fillText("AI ECG REPORT: " + (selectedReading?.prediction || "Unknown"), 20, 35);

        ctx.font = "16px Arial";
        ctx.fillText(`Date: ${new Date(selectedReading?.recordedAt).toLocaleString()}`, 20, 65);
        ctx.fillText(`Notes: AI Prediction Confidence ${(selectedReading?.probability || 0).toFixed(1)}%`, 20, 95);
        ctx.fillText(`Heart Rate: ${selectedReading?.meanHR} bpm`, 380, 65);

        ctx.strokeStyle = selectedReading?.prediction === "Normal" ? "#10b981" : "#ef4444";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 150);
        ctx.lineTo(width, 150);
        ctx.stroke();

        ctx.drawImage(sourceCanvas, 0, 160);

        const image = reportCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `ECG_Report_${new Date().toISOString()}.png`;
        link.click();
    };

    const getRiskColor = (risk) => {
        if (risk === "Low" || risk === "Normal") return "bg-green-100 text-green-700 border-green-200";
        if (risk === "High" || risk === "Abnormal") return "bg-red-100 text-red-700 border-red-200";
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 text-base sm:text-lg font-medium">Loading ECG history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={isFullPage ? "space-y-4 sm:space-y-5 md:space-y-6" : "bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6"}>

            {history.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">No ECG Readings Yet</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">Your doctor has not uploaded any AI-analyzed ECG readings to your profile yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* History List (Left Sidebar on Desktop) */}
                    <div className="lg:col-span-1 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 h-[600px] overflow-y-auto border border-gray-100">
                        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Reading History</h2>
                        </div>

                        <div className="space-y-3">
                            {history.map((reading) => (
                                <div
                                    key={reading.id}
                                    onClick={() => setSelectedReading(reading)}
                                    className={`cursor-pointer p-4 rounded-xl border transition-all ${selectedReading?.id === reading.id
                                            ? 'border-blue-500 bg-blue-50 shadow-sm'
                                            : 'border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-semibold text-gray-800">
                                            {new Date(reading.recordedAt).toLocaleDateString()}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(reading.prediction)}`}>
                                            {reading.prediction}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-1 font-medium">
                                        {new Date(reading.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-xs text-gray-500 line-clamp-2">
                                        {reading.rationale}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Viewer (Right col on Desktop) */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* ECG CARD */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-5">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-lg ${selectedReading.prediction === "Normal"
                                            ? 'bg-gradient-to-br from-green-400 to-green-500'
                                            : 'bg-gradient-to-br from-red-400 to-red-500'
                                        }`}>
                                        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                                            Record: {new Date(selectedReading.recordedAt).toLocaleDateString()}
                                        </h2>
                                        <p className="text-gray-500 text-xs sm:text-sm font-medium">Historical AI ECG Analysis</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <button onClick={togglePause} className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg sm:rounded-xl hover:bg-gray-100 text-sm transition-colors border border-gray-200">
                                        {isPaused ? <Play className="w-4 h-4 text-blue-600" /> : <Pause className="w-4 h-4 text-blue-600" />}
                                        <span className="font-semibold text-gray-700">{isPaused ? "Resume" : "Pause"}</span>
                                    </button>
                                    <button onClick={downloadECGImage} className="p-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl hover:bg-blue-50 text-blue-600 transition-colors border border-blue-100 flex items-center gap-2" title="Download Report">
                                        <Download className="w-4 h-4" />
                                        <span className="font-semibold hidden sm:block">Export</span>
                                    </button>
                                </div>
                            </div>

                            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 shadow-inner ring-1 ring-slate-700/50">
                                <canvas ref={canvasRef} className="w-full h-32 sm:h-40 md:h-56 rounded-lg" style={{ background: "#0f172a" }} />
                                {isPaused && (
                                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                                        <div className="bg-white shadow-xl rounded-xl px-4 py-2 flex items-center gap-2 transform scale-105 transition-transform">
                                            <Pause className="w-4 h-4 text-blue-600" />
                                            <span className="font-bold text-gray-800">Paused</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Data Cards Row */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                                    <p className="text-gray-500 font-medium text-xs mb-1">Heart Rate</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-800">{selectedReading.meanHR} <span className="text-sm font-medium text-gray-500">bpm</span></p>
                                </div>
                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                                    <p className="text-gray-500 font-medium text-xs mb-1">AI Prediction</p>
                                    <p className={`text-lg sm:text-xl font-bold ${selectedReading.prediction === "Normal" ? "text-green-600" : "text-red-600"}`}>
                                        {selectedReading.prediction}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                                    <p className="text-gray-500 font-medium text-xs mb-1">Confidence</p>
                                    <p className="text-lg sm:text-2xl font-bold text-blue-600">{selectedReading.probability.toFixed(1)}<span className="text-sm font-medium text-blue-400">%</span></p>
                                </div>
                                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                                    <p className="text-gray-500 font-medium text-xs mb-1">Beats Analyzed</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-800">{selectedReading.beats}</p>
                                </div>
                            </div>
                        </div>

                        {/* AI Details */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 border border-blue-100">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-blue-700" />
                                </div>
                                <h2 className="text-lg font-bold text-blue-900">AI Medical Rationale</h2>
                            </div>
                            <p className="text-sm sm:text-base text-blue-800 leading-relaxed mb-6 bg-white/50 p-4 rounded-xl">
                                {selectedReading.rationale}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-3 shadow-sm border border-blue-50 flex items-center justify-between">
                                    <span className="text-xs text-blue-500 uppercase font-bold tracking-wider">SDNN</span>
                                    <span className="text-sm font-bold text-blue-900">{selectedReading.sdnn.toFixed(2)} ms</span>
                                </div>
                                <div className="bg-white rounded-xl p-3 shadow-sm border border-blue-50 flex items-center justify-between">
                                    <span className="text-xs text-blue-500 uppercase font-bold tracking-wider">RMSSD</span>
                                    <span className="text-sm font-bold text-blue-900">{selectedReading.rmssd.toFixed(2)} ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ECGMonitor;
