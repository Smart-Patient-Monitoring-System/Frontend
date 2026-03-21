import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  Heart,
  RefreshCw,
  Waves,
  WifiOff,
  Wind,
  Thermometer,
  Droplets,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BACKEND_URL = import.meta.env.VITE_IOT_URL || "http://localhost:8088";

function MetricCard({ icon: Icon, label, value, unit, status, statusColor, stale }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
      <div
        className={`p-4 ${
          stale
            ? "bg-gradient-to-r from-gray-400 to-gray-500"
            : "bg-gradient-to-r from-teal-500 to-teal-600"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/90 rounded-lg p-2.5">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
          <span className="text-sm font-semibold text-white uppercase tracking-wide">
            {label}
          </span>
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
                tickFormatter={(v) =>
                  new Date(v + "Z").toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
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
                }}
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

export default function RealtimeGraphs({ patientId: propPatientId }) {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const pollerRef = useRef(null);

  const patientId = propPatientId || localStorage.getItem("patientId");

  const fetchData = useCallback(async () => {
    if (!patientId) {
      setError("No patient ID found");
      setLoading(false);
      return;
    }

    try {
      const url = `${BACKEND_URL}/api/sensordata/patient/${patientId}/latest/50`;
      console.log("Fetching IoT data from:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const latest = data[0];
        const chartData = [...data].reverse();

        setHistory(chartData);
        setCurrent(latest);

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
      setError("Cannot reach IoT service — showing last known patient data");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchData();
    pollerRef.current = setInterval(fetchData, 5000);
    return () => clearInterval(pollerRef.current);
  }, [fetchData]);

  const hrStatus = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 60) return { text: "Low", color: "bg-yellow-100 text-yellow-700" };
    if (v > 100) return { text: "High", color: "bg-red-100 text-red-700" };
    return { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };

  const spo2Status = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 95) return { text: "Low", color: "bg-orange-100 text-orange-700" };
    return { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };

  const tempStatus = (v) => {
    if (!v || v === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (v < 36.1) return { text: "Low", color: "bg-blue-100 text-blue-700" };
    if (v > 37.2) return { text: "High", color: "bg-red-100 text-red-700" };
    return { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };

  const roomTempStatus = (v) => {
    if (v === null || v === undefined || v === 0) {
      return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    }
    if (v < 20) return { text: "Cold", color: "bg-blue-100 text-blue-700" };
    if (v > 32) return { text: "Hot", color: "bg-red-100 text-red-700" };
    return { text: "Comfort", color: "bg-teal-100 text-teal-700" };
  };

  const humidityStatus = (v) => {
    if (v === null || v === undefined || v === 0) {
      return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    }
    if (v < 30) return { text: "Dry", color: "bg-yellow-100 text-yellow-700" };
    if (v > 70) return { text: "Humid", color: "bg-blue-100 text-blue-700" };
    return { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };

  if (loading) {
    return <div className="p-6">Loading patient monitoring…</div>;
  }

  const hr = hrStatus(current?.avgBpm);
  const sp = spo2Status(current?.spo2);
  const bt = tempStatus(current?.waterTempC);
  const rt = roomTempStatus(current?.roomTemp);
  const hm = humidityStatus(current?.humidity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      <main className="max-w-7xl mx-auto px-4 py-6">
        {isStale && !error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
            <RefreshCw className="w-4 h-4 flex-shrink-0" />
            Sensor not sending live data — showing last recorded readings from database
            {lastUpdate && (
              <span className="ml-auto text-amber-600">
                Last: {lastUpdate.toLocaleTimeString()}
              </span>
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
            <p className="font-medium">No sensor data found for this patient</p>
            <p className="text-sm mt-1">Make sure the device is assigned and sending data</p>
          </div>
        )}

        <section className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              icon={Heart}
              label="Heart Rate"
              value={current?.avgBpm}
              unit="BPM"
              status={hr.text}
              statusColor={hr.color}
              stale={isStale}
            />

            <MetricCard
              icon={Wind}
              label="Blood Oxygen"
              value={current?.spo2}
              unit="%"
              status={sp.text}
              statusColor={sp.color}
              stale={isStale}
            />

            <MetricCard
              icon={Waves}
              label="Body Temperature"
              value={current?.waterTempC?.toFixed(1) ?? 0}
              unit="°C"
              status={bt.text}
              statusColor={bt.color}
              stale={isStale}
            />

            <MetricCard
              icon={Thermometer}
              label="Room Temperature"
              value={current?.roomTemp?.toFixed(1) ?? 0}
              unit="°C"
              status={rt.text}
              statusColor={rt.color}
              stale={isStale}
            />

            <MetricCard
              icon={Droplets}
              label="Humidity"
              value={current?.humidity ?? 0}
              unit="%"
              status={hm.text}
              statusColor={hm.color}
              stale={isStale}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <GraphCard
            data={history}
            dataKey="avgBpm"
            label="Heart Rate Trend"
            icon={Heart}
            unit="BPM"
          />

          <GraphCard
            data={history}
            dataKey="spo2"
            label="Blood Oxygen Trend"
            icon={Wind}
            unit="%"
          />

          <GraphCard
            data={history}
            dataKey="waterTempC"
            label="Body Temperature Trend"
            icon={Waves}
            unit="°C"
          />

          <GraphCard
            data={history}
            dataKey="roomTemp"
            label="Room Temperature Trend"
            icon={Thermometer}
            unit="°C"
          />

          <GraphCard
            data={history}
            dataKey="humidity"
            label="Humidity Trend"
            icon={Droplets}
            unit="%"
          />
        </div>
      </main>
    </div>
  );
}