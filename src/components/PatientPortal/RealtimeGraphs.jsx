import { useEffect, useState, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine
} from "recharts";
import {
  Activity, Thermometer, Heart, Droplet,
  Wind, Waves, Wifi, WifiOff, RefreshCw
} from "lucide-react";

// ─── URL helper ───────────────────────────────────────────────────────────────
// Works for localhost AND hosted deployments automatically.
// Set VITE_IOT_URL in your .env for local dev.
// In production (Azure / Vercel / etc.) set the same env var to your hosted gateway URL.
const BACKEND_URL = (import.meta.env.VITE_IOT_URL || "").replace(/\/$/, "");

// ─── Token helper — reads from whatever key your auth stores it ───────────────
const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  sessionStorage.getItem("token") ||
  "";

// ─── Authenticated fetch wrapper ─────────────────────────────────────────────
const authFetch = (url, options = {}) => {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
};

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value, unit, status, statusColor, pulse }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-teal-100">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/90 rounded-lg p-2.5">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-sm font-semibold text-white uppercase tracking-wide">{label}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl sm:text-5xl font-bold text-gray-800 transition-all duration-500 ${
                pulse ? "scale-110 text-teal-600" : "scale-100"
              }`}
            >
              {value}
            </span>
            <span className="text-xl sm:text-2xl text-gray-500 font-medium">{unit}</span>
          </div>
          {status && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor}`}>
              {status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Graph Card ───────────────────────────────────────────────────────────────
function GraphCard({ data, dataKey, label, icon: Icon, unit, refLines }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/90 rounded-lg p-2">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white">{label}</h3>
          {data.length > 0 && (
            <span className="ml-auto text-xs text-teal-100 font-medium">
              {data.length} readings
            </span>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {data.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-gray-400 text-sm">
            Waiting for sensor data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="receivedAt"
                tickFormatter={(v) =>
                  new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
                stroke="#9ca3af"
                style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #14b8a6",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelFormatter={(v) => new Date(v).toLocaleString()}
                formatter={(value) => [`${value} ${unit}`, label]}
              />
              {refLines?.map((r) => (
                <ReferenceLine
                  key={r.y}
                  y={r.y}
                  stroke={r.color}
                  strokeDasharray="4 2"
                  label={{ value: r.label, fill: r.color, fontSize: 10 }}
                />
              ))}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#14b8a6"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─── Connection badge ─────────────────────────────────────────────────────────
function ConnectionBadge({ mode }) {
  if (mode === "sse")
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
        <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
        Live stream
      </span>
    );
  if (mode === "polling")
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
        <RefreshCw className="w-3 h-3 animate-spin" />
        Polling 5s
      </span>
    );
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
      <WifiOff className="w-3 h-3" />
      Offline
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
function RealtimeGraphs() {
  const [history, setHistory]     = useState([]);
  const [currentData, setCurrent] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [connMode, setConnMode]   = useState("polling"); // "sse" | "polling" | "offline"
  const [pulse, setPulse]         = useState(false);
  const [error, setError]         = useState(null);

  const readerRef = useRef(null);
  const pollerRef = useRef(null);

  // ── Append one new reading to history (keep last 100 points) ──────────────
  const appendReading = useCallback((reading) => {
    setHistory((prev) => {
      const next = [...prev, reading];
      return next.slice(-100);
    });
    setCurrent(reading);
    setPulse(true);
    setTimeout(() => setPulse(false), 600);
  }, []);

  // ── Fetch history (REST) — used as initial load + polling fallback ─────────
  const fetchHistory = useCallback(async () => {
    try {
      const res = await authFetch(
        `${BACKEND_URL}/api/sensordata/latest/50`
      );
      if (res.status === 401) {
        setError("Session expired — please log in again.");
        setConnMode("offline");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const sorted = Array.isArray(data) ? [...data].reverse() : [];
      setHistory(sorted.slice(-100));
      if (sorted.length > 0) setCurrent(sorted[sorted.length - 1]);
      setError(null);
    } catch (e) {
      console.error("Fetch error:", e);
      setConnMode("offline");
      setError("Cannot reach server. Check your connection.");
    }
  }, []);

  // ── SSE stream (real-time push from backend) ───────────────────────────────
  const startSseStream = useCallback(async () => {
    const token = getToken();
    if (!token) return false; // no token — fall back to polling

    try {
      const res = await fetch(`${BACKEND_URL}/api/sensordata/stream`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok || !res.body) return false;

      setConnMode("sse");
      const reader = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();

      // Read stream in a loop
      (async () => {
        let buffer = "";
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            // SSE messages are separated by double newlines
            const parts = buffer.split("\n\n");
            buffer = parts.pop() || "";

            for (const part of parts) {
              const dataLine = part.split("\n").find((l) => l.startsWith("data:"));
              if (!dataLine) continue;
              const jsonStr = dataLine.slice(5).trim();
              if (!jsonStr || jsonStr === "ping") continue;
              try {
                const reading = JSON.parse(jsonStr);
                appendReading(reading);
              } catch (_) {}
            }
          }
        } catch (_) {
          // Stream broke — fall back to polling
        }
        setConnMode("polling");
        startPolling();
      })();

      return true;
    } catch (_) {
      return false;
    }
  }, [appendReading]);

  // ── Polling fallback (every 5s) ────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (pollerRef.current) clearInterval(pollerRef.current);
    setConnMode("polling");
    pollerRef.current = setInterval(fetchHistory, 5000);
  }, [fetchHistory]);

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    (async () => {
      await fetchHistory();
      if (cancelled) return;
      setLoading(false);

      const gotStream = await startSseStream();
      if (!gotStream && !cancelled) {
        startPolling();
      }
    })();

    return () => {
      cancelled = true;
      readerRef.current?.cancel();
      clearInterval(pollerRef.current);
    };
  }, [fetchHistory, startSseStream, startPolling]);

  // ── Status helpers ─────────────────────────────────────────────────────────
  const hrStatus = (bpm) => {
    if (!bpm || bpm === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (bpm < 60)  return { text: "Low",    color: "bg-yellow-100 text-yellow-700" };
    if (bpm > 100) return { text: "High",   color: "bg-red-100 text-red-700" };
    return              { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };
  const spo2Status = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 95) return { text: "Low",    color: "bg-orange-100 text-orange-700" };
    return          { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };
  const tempStatus = (t) => {
    if (!t || t === 0)  return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (t < 36.1) return { text: "Low",    color: "bg-blue-100 text-blue-700" };
    if (t > 37.2) return { text: "High",   color: "bg-red-100 text-red-700" };
    return             { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };

  const hr   = hrStatus(currentData?.avgBpm);
  const sp   = spo2Status(currentData?.spo2);
  const bt   = tempStatus(currentData?.waterTempC);

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mb-4" />
          <p className="text-gray-600 text-base sm:text-lg font-medium">
            Loading patient monitoring…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Patient Vital Signs */}
        <section className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="bg-teal-500 rounded-lg p-2">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Patient Vital Signs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <MetricCard
              icon={Heart}
              label="Heart Rate"
              value={currentData?.avgBpm ?? "—"}
              unit="BPM"
              status={hr.text}
              statusColor={hr.color}
              pulse={pulse}
            />
            <MetricCard
              icon={Wind}
              label="Blood Oxygen"
              value={currentData?.spo2 ?? "—"}
              unit="%"
              status={sp.text}
              statusColor={sp.color}
              pulse={pulse}
            />
            <MetricCard
              icon={Waves}
              label="Body Temperature"
              value={currentData?.waterTempC?.toFixed(1) ?? "—"}
              unit="°C"
              status={bt.text}
              statusColor={bt.color}
              pulse={pulse}
            />
          </div>
        </section>

        {/* Environmental */}
        <section className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="bg-teal-500 rounded-lg p-2">
              <Thermometer className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Environmental Conditions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <MetricCard
              icon={Thermometer}
              label="Room Temperature"
              value={currentData?.roomTemp?.toFixed(1) ?? "—"}
              unit="°C"
              pulse={pulse}
            />
            <MetricCard
              icon={Droplet}
              label="Room Humidity"
              value={currentData?.humidity?.toFixed(1) ?? "—"}
              unit="%"
              pulse={pulse}
            />
          </div>
        </section>

        {/* Real-time graphs */}
        <section className="mb-8 sm:mb-10">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <div className="bg-teal-500 rounded-lg p-2">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Real-Time Monitoring</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <GraphCard
              data={history}
              dataKey="avgBpm"
              label="Heart Rate Monitor"
              icon={Heart}
              unit="BPM"
              refLines={[
                { y: 60,  color: "#f59e0b", label: "Low" },
                { y: 100, color: "#ef4444", label: "High" },
              ]}
            />
            <GraphCard
              data={history}
              dataKey="spo2"
              label="Blood Oxygen (SpO2)"
              icon={Wind}
              unit="%"
              refLines={[{ y: 95, color: "#f97316", label: "Low" }]}
            />
            <div className="lg:col-span-2">
              <GraphCard
                data={history}
                dataKey="waterTempC"
                label="Body Temperature"
                icon={Waves}
                unit="°C"
                refLines={[
                  { y: 36.1, color: "#3b82f6", label: "Low" },
                  { y: 37.2, color: "#ef4444", label: "High" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Reference ranges */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-teal-100 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Health Reference Ranges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-sm">
            {[
              {
                icon: Heart, label: "Heart Rate (BPM)",
                items: [
                  { dot: "bg-teal-500",   text: "Normal: 60–100" },
                  { dot: "bg-yellow-500", text: "Low: <60" },
                  { dot: "bg-red-500",    text: "High: >100" },
                ],
              },
              {
                icon: Wind, label: "SpO2 (%)",
                items: [
                  { dot: "bg-teal-500",   text: "Normal: 95–100%" },
                  { dot: "bg-orange-500", text: "Low: 90–94%" },
                  { dot: "bg-red-500",    text: "Critical: <90%" },
                ],
              },
              {
                icon: Waves, label: "Body Temperature (°C)",
                items: [
                  { dot: "bg-teal-500", text: "Normal: 36.1–37.2" },
                  { dot: "bg-blue-500", text: "Low: <36.1" },
                  { dot: "bg-red-500",  text: "High: >37.2" },
                ],
              },
              {
                icon: Droplet, label: "Room Humidity (%)",
                items: [
                  { dot: "bg-teal-500",   text: "Optimal: 30–60%" },
                  { dot: "bg-yellow-500", text: "Dry: <30%" },
                  { dot: "bg-blue-500",   text: "Humid: >60%" },
                ],
              },
            ].map(({ icon: Ic, label, items }) => (
              <div key={label}>
                <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Ic className="w-4 h-4 text-teal-600" />
                  {label}
                </p>
                <ul className="space-y-2 text-gray-600">
                  {items.map(({ dot, text }) => (
                    <li key={text} className="flex items-center gap-2">
                      <span className={`w-2 h-2 ${dot} rounded-full flex-shrink-0`} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Status footer */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-teal-100">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <ConnectionBadge mode={connMode} />
              <span className="text-gray-500 text-xs sm:text-sm">
                {history.length} readings loaded
              </span>
            </div>
            {currentData?.receivedAt && (
              <span className="text-gray-500 text-xs sm:text-sm">
                Last update: {new Date(currentData.receivedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

export default RealtimeGraphs;
