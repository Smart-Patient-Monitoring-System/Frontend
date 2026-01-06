import { useEffect, useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Activity, Thermometer, Heart, Droplet, Wind, Waves } from "lucide-react";

const BACKEND_URL = "http://172.30.21.47:8080";

// Metric Card Component
function MetricCard({ icon: Icon, label, value, unit, status, statusColor }) {
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
            <span className="text-4xl sm:text-5xl font-bold text-gray-800">{value}</span>
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

// Graph Card Component
function GraphCard({ data, dataKey, label, icon: Icon, unit }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-teal-100">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/90 rounded-lg p-2">
            <Icon className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-white">{label}</h3>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="receivedAt"
              tickFormatter={(v) =>
                new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
              stroke="#9ca3af"
              style={{ fontSize: "11px" }}
            />

            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: "11px" }}
            />

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

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#14b8a6"
              strokeWidth={2.5}
              dot={false}
              fill={`url(#gradient-${dataKey})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RealtimeGraphs() {
  const [history, setHistory] = useState([]);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/sensordata/latest/50`);
      if (res.ok) {
        const data = await res.json();
        const reversed = Array.isArray(data) ? [...data].reverse() : [];
        setHistory(reversed);
        if (reversed.length > 0) {
          setCurrentData(reversed[reversed.length - 1]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadInitial = async () => {
      await fetchHistory();
      if (active) setLoading(false);
    };

    loadInitial();
    const interval = setInterval(fetchHistory, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg font-medium">Loading patient monitoring...</p>
        </div>
      </div>
    );
  }

  const getHeartRateStatus = (bpm) => {
    if (!bpm || bpm === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (bpm < 60) return { text: "Low", color: "bg-yellow-100 text-yellow-700" };
    if (bpm > 100) return { text: "High", color: "bg-red-100 text-red-700" };
    return { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };

  const getSpo2Status = (spo2) => {
    if (!spo2 || spo2 === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (spo2 < 95) return { text: "Low", color: "bg-orange-100 text-orange-700" };
    return { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };

  const getBodyTempStatus = (temp) => {
    if (!temp || temp === 0) return { text: "No Data", color: "bg-gray-100 text-gray-600" };
    if (temp < 36.1) return { text: "Low", color: "bg-blue-100 text-blue-700" };
    if (temp > 37.2) return { text: "High", color: "bg-red-100 text-red-700" };
    return { text: "Normal", color: "bg-teal-100 text-teal-700" };
  };

  const hrStatus = currentData ? getHeartRateStatus(currentData.avgBpm) : { text: "No Data", color: "bg-gray-100 text-gray-600" };
  const spo2Status = currentData ? getSpo2Status(currentData.spo2) : { text: "No Data", color: "bg-gray-100 text-gray-600" };
  const bodyTempStatus = currentData ? getBodyTempStatus(currentData.waterTempC) : { text: "No Data", color: "bg-gray-100 text-gray-600" };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

        {/* Patient Vital Signs */}
        <div className="mb-8 sm:mb-10">
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
              value={currentData?.avgBpm || "0"}
              unit="BPM"
              status={hrStatus.text}
              statusColor={hrStatus.color}
            />

            <MetricCard
              icon={Wind}
              label="Blood Oxygen"
              value={currentData?.spo2 || "0"}
              unit="%"
              status={spo2Status.text}
              statusColor={spo2Status.color}
            />

            <MetricCard
              icon={Waves}
              label="Body Temperature"
              value={currentData?.waterTempC?.toFixed(1) || "0.0"}
              unit="°C"
              status={bodyTempStatus.text}
              statusColor={bodyTempStatus.color}
            />

          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="mb-8 sm:mb-10">
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
              value={currentData?.roomTemp?.toFixed(1) || "0.0"}
              unit="°C"
            />

            <MetricCard
              icon={Droplet}
              label="Room Humidity"
              value={currentData?.humidity?.toFixed(1) || "0.0"}
              unit="%"
            />

          </div>
        </div>

        {/* Real-Time Monitoring Graphs */}
        <div className="mb-8 sm:mb-10">
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
            />

            <GraphCard
              data={history}
              dataKey="spo2"
              label="Blood Oxygen (SpO2)"
              icon={Wind}
              unit="%"
            />

            <div className="lg:col-span-2">
              <GraphCard
                data={history}
                dataKey="waterTempC"
                label="Body Temperature"
                icon={Waves}
                unit="°C"
              />
            </div>

          </div>
        </div>

        {/* Health Reference Ranges */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-teal-100 mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Health Reference Ranges
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-sm">

            <div>
              <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-teal-600" />
                Heart Rate (BPM)
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></span>
                  <span>Normal: 60-100</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  <span>Low: &lt;60</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                  <span>High: &gt;100</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-600" />
                SpO2 (%)
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></span>
                  <span>Normal: 95-100%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                  <span>Low: 90-94%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                  <span>Critical: &lt;90%</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Waves className="w-4 h-4 text-teal-600" />
                Body Temperature (°C)
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></span>
                  <span>Normal: 36.1-37.2</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>Low: &lt;36.1</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                  <span>High: &gt;37.2</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-teal-600" />
                Room Humidity (%)
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0"></span>
                  <span>Optimal: 30-60%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                  <span>Dry: &lt;30%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>Humid: &gt;60%</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Status Footer */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-teal-100">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-teal-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">24/7 Monitoring Active</span>
            </div>
            {currentData && (
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