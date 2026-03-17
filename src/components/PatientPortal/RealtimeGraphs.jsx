import { useEffect, useState, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine
} from "recharts";
import { Activity, Thermometer, Heart, Droplet, Wind, Waves, RefreshCw, WifiOff } from "lucide-react";

// Set VITE_IOT_URL=http://localhost:8082 in your .env file
const BACKEND_URL = (import.meta.env.VITE_IOT_URL || "http://localhost:8082").replace(/\/$/, "");

function MetricCard({ icon: Icon, label, value, unit, status, statusColor, stale }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-teal-100">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/90 rounded-lg p-2.5">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-sm font-semibold text-white uppercase tracking-wide">{label}</span>
          {stale && <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">cached</span>}
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
          {status && <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor}`}>{status}</span>}
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
          {data.length > 0 && <span className="ml-auto text-xs text-teal-100">{data.length} pts</span>}
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
                tickFormatter={(v) => new Date(v + "Z").toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                stroke="#9ca3af"
                style={{ fontSize: "11px" }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "white", border: "1px solid #14b8a6", borderRadius: "8px" }}
                labelFormatter={(v) => new Date(v + "Z").toLocaleString()}
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

export default function RealtimeGraphs() {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const pollerRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const url = `${BACKEND_URL}/api/sensordata/latest/50`;
      console.log("Fetching IoT data from:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        // FIX: Backend returns DESC (newest first).
        // - current = data[0]  (most recent reading)
        // - chart   = [...data].reverse() so x-axis goes oldest → newest
        const latest = data[0];
        const chartData = [...data].reverse();

        setHistory(chartData);
        setCurrent(latest);

        // FIX: Append "Z" so JS parses LocalDateTime as UTC, not local time.
        // Without this, timezone differences cause false "stale" warnings.
        const receivedAtUTC = new Date(latest.receivedAt + "Z");
        setLastUpdate(receivedAtUTC);

        const ageSeconds = (Date.now() - receivedAtUTC.getTime()) / 1000;
        setIsStale(ageSeconds > 30);
      } else {
        setHistory([]);
        setCurrent(null);
        setLastUpdate(null);
        setIsStale(false);
      }

      setError(null);
    } catch (e) {
      console.error("Fetch error:", e);
      setError("Cannot reach IoT service — showing last known data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    pollerRef.current = setInterval(fetchData, 5000);
    return () => clearInterval(pollerRef.current);
  }, [fetchData]);

  const hrStatus = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 60)        return { text: "Low",     color: "bg-yellow-100 text-yellow-700" };
    if (v > 100)       return { text: "High",    color: "bg-red-100 text-red-700" };
    return               { text: "Normal",  color: "bg-teal-100 text-teal-700" };
  };

  const spo2Status = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 95)        return { text: "Low",     color: "bg-orange-100 text-orange-700" };
    return               { text: "Normal",  color: "bg-teal-100 text-teal-700" };
  };

  const tempStatus = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 36.1)      return { text: "Low",     color: "bg-blue-100 text-blue-700" };
    if (v > 37.2)      return { text: "High",    color: "bg-red-100 text-red-700" };
    return               { text: "Normal",  color: "bg-teal-100 text-teal-700" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading patient monitoring…</p>
        </div>
      </div>
    );
  }

  const hr = hrStatus(current?.avgBpm);
  const sp = spo2Status(current?.spo2);
  const bt = tempStatus(current?.waterTempC);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

        {isStale && !error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
            <RefreshCw className="w-4 h-4 flex-shrink-0" />
            Sensor not sending live data — showing last recorded readings from database
            {lastUpdate && (
              <span className="ml-auto text-amber-600">Last: {lastUpdate.toLocaleTimeString()}</span>
            )}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            {error}
            {history.length > 0 && (
              <span className="ml-auto">Showing {history.length} cached readings</span>
            )}
          </div>
        )}

        {!loading && history.length === 0 && (
          <div className="mb-6 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl px-4 py-8 text-center">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="font-medium">No sensor data found</p>
            <p className="text-sm mt-1">Make sure the ESP32 is powered on and connected to WiFi</p>
          </div>
        )}

        {/* Patient Vital Signs */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-teal-500 rounded-lg p-2">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Patient Vital Signs</h2>
            {isStale && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-full">
                Cached data
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <MetricCard
              icon={Heart}   label="Heart Rate"       value={current?.avgBpm}
              unit="BPM"     status={hr.text}          statusColor={hr.color} stale={isStale}
            />
            <MetricCard
              icon={Wind}    label="Blood Oxygen"      value={current?.spo2}
              unit="%"       status={sp.text}          statusColor={sp.color} stale={isStale}
            />
            <MetricCard
              icon={Waves}   label="Body Temperature"  value={current?.waterTempC?.toFixed(1) ?? 0}
              unit="°C"      status={bt.text}          statusColor={bt.color} stale={isStale}
            />
          </div>
        </section>

        {/* Environmental Conditions */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-teal-500 rounded-lg p-2">
              <Thermometer className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Environmental Conditions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <MetricCard
              icon={Thermometer} label="Room Temperature"
              value={current?.roomTemp?.toFixed(1) ?? 0} unit="°C" stale={isStale}
            />
            <MetricCard
              icon={Droplet}     label="Room Humidity"
              value={current?.humidity?.toFixed(1) ?? 0} unit="%" stale={isStale}
            />
          </div>
        </section>

        {/* Real-Time Charts */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-teal-500 rounded-lg p-2">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Real-Time Monitoring</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <GraphCard
              data={history} dataKey="avgBpm" label="Heart Rate Monitor"
              icon={Heart} unit="BPM"
              refLines={[
                { y: 60,  color: "#f59e0b", label: "Low"  },
                { y: 100, color: "#ef4444", label: "High" }
              ]}
            />
            <GraphCard
              data={history} dataKey="spo2" label="Blood Oxygen (SpO2)"
              icon={Wind} unit="%"
              refLines={[{ y: 95, color: "#f97316", label: "Low" }]}
            />
            <div className="lg:col-span-2">
              <GraphCard
                data={history} dataKey="waterTempC" label="Body Temperature"
                icon={Waves} unit="°C"
                refLines={[
                  { y: 36.1, color: "#3b82f6", label: "Low"  },
                  { y: 37.2, color: "#ef4444", label: "High" }
                ]}
              />
            </div>
          </div>
        </section>

        {/* Status bar */}
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
              <span className="text-gray-500 text-xs">
                Last reading: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}