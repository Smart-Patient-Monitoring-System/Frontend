import { useEffect, useState, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine
} from "recharts";
import { Activity, Thermometer, Heart, Droplet, Wind, Waves, RefreshCw, WifiOff } from "lucide-react";

const BACKEND_URL = (import.meta.env.VITE_IOT_URL || "http://localhost:8088").replace(/\/$/, "");

// Gets patientId stored during login: localStorage.setItem("patientId", data.patientId)
const getPatientId = () =>
  localStorage.getItem("patientId") ||
  localStorage.getItem("userId") ||
  "1"; // fallback for demo

function MetricCard({ icon: Icon, label, value, unit, status, statusColor, stale }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-teal-100">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/90 rounded-lg p-2.5">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-sm font-semibold text-white uppercase tracking-wide">{label}</span>
          {stale && (
            <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
              cached
            </span>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl sm:text-5xl font-bold ${stale ? "text-gray-400" : "text-gray-800"}`}>
              {value ?? 0}
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
            <span className="ml-auto text-xs text-teal-100">{data.length} pts</span>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {data.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-gray-400 text-sm">
            No data yet — waiting for sensor readings…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="receivedAt"
                tickFormatter={(v) => new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                stroke="#9ca3af" style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "white", border: "1px solid #14b8a6", borderRadius: "8px" }}
                labelFormatter={(v) => new Date(v).toLocaleString()}
                formatter={(value) => [`${value} ${unit}`, label]}
              />
              {refLines?.map((r) => (
                <ReferenceLine key={r.y} y={r.y} stroke={r.color} strokeDasharray="4 2"
                  label={{ value: r.label, fill: r.color, fontSize: 10 }} />
              ))}
              <Line type="monotone" dataKey={dataKey} stroke="#14b8a6"
                strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default function RealtimeGraphs() {
  const [history, setHistory]   = useState([]);
  const [current, setCurrent]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [isStale, setIsStale]   = useState(false); // true = showing cached DB data
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError]       = useState(null);
  const pollerRef = useRef(null);

  const patientId = getPatientId();

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/sensordata/patient/${patientId}/latest/50`
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const sorted = Array.isArray(data) ? [...data].reverse() : [];

      if (sorted.length > 0) {
        setHistory(sorted);
        const latest = sorted[sorted.length - 1];
        setCurrent(latest);
        setLastUpdate(new Date(latest.receivedAt));

        // Check if data is stale (older than 30 seconds = sensor not sending live)
        const ageSeconds = (Date.now() - new Date(latest.receivedAt).getTime()) / 1000;
        setIsStale(ageSeconds > 30);
      }
      setError(null);
    } catch (e) {
      console.error("Fetch error:", e);
      setError("Cannot reach IoT service — showing last known data");
      // Don't clear existing data — keep showing whatever we have
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchData();
    pollerRef.current = setInterval(fetchData, 5000); // poll every 5s
    return () => clearInterval(pollerRef.current);
  }, [fetchData]);

  const hrStatus = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 60)  return { text: "Low",    color: "bg-yellow-100 text-yellow-700" };
    if (v > 100) return { text: "High",   color: "bg-red-100 text-red-700" };
    return             { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };
  const spo2Status = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 95) return { text: "Low",    color: "bg-orange-100 text-orange-700" };
    return           { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };
  const tempStatus = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 36.1) return { text: "Low",    color: "bg-blue-100 text-blue-700" };
    if (v > 37.2) return { text: "High",   color: "bg-red-100 text-red-700" };
    return              { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mb-4" />
        <p className="text-gray-600 text-lg font-medium">Loading patient monitoring…</p>
      </div>
    </div>
  );

  const hr = hrStatus(current?.avgBpm);
  const sp = spo2Status(current?.spo2);
  const bt = tempStatus(current?.waterTempC);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

        {/* Stale data banner */}
        {isStale && !error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
            <RefreshCw className="w-4 h-4 flex-shrink-0" />
            Sensor not sending live data — showing last recorded readings from database
            {lastUpdate && <span className="ml-auto text-amber-600">Last: {lastUpdate.toLocaleTimeString()}</span>}
          </div>
        )}

        {/* Error banner — but still shows data */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            {error}
            {history.length > 0 && <span className="ml-auto">Showing {history.length} cached readings</span>}
          </div>
        )}

        {/* No data at all */}
        {!loading && history.length === 0 && (
          <div className="mb-6 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl px-4 py-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">No sensor data found for this patient</p>
            <p className="text-sm mt-1">Make sure the ESP32 is powered on and connected to WiFi</p>
          </div>
        )}

        {/* Vital Signs */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-teal-500 rounded-lg p-2">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Patient Vital Signs</h2>
            {isStale && <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">Cached data</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <MetricCard icon={Heart}  label="Heart Rate"       value={current?.avgBpm}              unit="BPM" status={hr.text} statusColor={hr.color} stale={isStale} />
            <MetricCard icon={Wind}   label="Blood Oxygen"     value={current?.spo2}                unit="%"   status={sp.text} statusColor={sp.color} stale={isStale} />
            <MetricCard icon={Waves}  label="Body Temperature" value={current?.waterTempC?.toFixed(1) ?? 0} unit="°C"  status={bt.text} statusColor={bt.color} stale={isStale} />
          </div>
        </section>

        {/* Environmental */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-teal-500 rounded-lg p-2">
              <Thermometer className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Environmental Conditions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <MetricCard icon={Thermometer} label="Room Temperature" value={current?.roomTemp?.toFixed(1) ?? 0} unit="°C" stale={isStale} />
            <MetricCard icon={Droplet}     label="Room Humidity"    value={current?.humidity?.toFixed(1) ?? 0} unit="%" stale={isStale} />
          </div>
        </section>

        {/* Graphs */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-teal-500 rounded-lg p-2">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Real-Time Monitoring</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <GraphCard data={history} dataKey="avgBpm"    label="Heart Rate Monitor"  icon={Heart}  unit="BPM"
              refLines={[{ y: 60, color: "#f59e0b", label: "Low" }, { y: 100, color: "#ef4444", label: "High" }]} />
            <GraphCard data={history} dataKey="spo2"      label="Blood Oxygen (SpO2)" icon={Wind}   unit="%"
              refLines={[{ y: 95, color: "#f97316", label: "Low" }]} />
            <div className="lg:col-span-2">
              <GraphCard data={history} dataKey="waterTempC" label="Body Temperature"  icon={Waves}  unit="°C"
                refLines={[{ y: 36.1, color: "#3b82f6", label: "Low" }, { y: 37.2, color: "#ef4444", label: "High" }]} />
            </div>
          </div>
        </section>

        {/* Reference ranges */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-teal-100 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" /> Health Reference Ranges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            {[
              { icon: Heart,       label: "Heart Rate (BPM)",      items: [{ dot: "bg-teal-500", text: "Normal: 60–100" }, { dot: "bg-yellow-500", text: "Low: <60" }, { dot: "bg-red-500", text: "High: >100" }] },
              { icon: Wind,        label: "SpO2 (%)",               items: [{ dot: "bg-teal-500", text: "Normal: 95–100%" }, { dot: "bg-orange-500", text: "Low: 90–94%" }, { dot: "bg-red-500", text: "Critical: <90%" }] },
              { icon: Waves,       label: "Body Temperature (°C)",  items: [{ dot: "bg-teal-500", text: "Normal: 36.1–37.2" }, { dot: "bg-blue-500", text: "Low: <36.1" }, { dot: "bg-red-500", text: "High: >37.2" }] },
              { icon: Droplet,     label: "Room Humidity (%)",      items: [{ dot: "bg-teal-500", text: "Optimal: 30–60%" }, { dot: "bg-yellow-500", text: "Dry: <30%" }, { dot: "bg-blue-500", text: "Humid: >60%" }] },
            ].map(({ icon: Ic, label, items }) => (
              <div key={label}>
                <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Ic className="w-4 h-4 text-teal-600" /> {label}
                </p>
                <ul className="space-y-2 text-gray-600">
                  {items.map(({ dot, text }) => (
                    <li key={text} className="flex items-center gap-2">
                      <span className={`w-2 h-2 ${dot} rounded-full flex-shrink-0`} />{text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Status footer */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-teal-100">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">
                <span className={`w-2 h-2 rounded-full ${isStale ? "bg-amber-400" : "bg-teal-500 animate-pulse"}`} />
                {isStale ? "Showing cached data" : "Live — polling every 5s"}
              </span>
              <span className="text-gray-500 text-xs">{history.length} readings loaded</span>
            </div>
            {lastUpdate && (
              <span className="text-gray-500 text-xs">Last reading: {lastUpdate.toLocaleTimeString()}</span>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
