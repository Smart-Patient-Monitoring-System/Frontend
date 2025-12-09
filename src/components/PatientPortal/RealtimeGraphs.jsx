import { useEffect, useState, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Activity, Thermometer, Heart } from "lucide-react";

const BACKEND_URL = "https://perfect-wholeness-production-2240.up.railway.app";

// Reusable Graph Component
function GraphCard({ data, dataKey, label, color, icon: Icon, gradient }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className={`bg-gradient-to-r ${gradient} p-6`}>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            {Icon && <Icon className="w-6 h-6 text-white" />}
          </div>
          <h2 className="text-xl font-bold text-white">{label}</h2>
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis 
              dataKey="receivedAt"
              tickFormatter={(v) =>
                new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />

            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />

            <Tooltip 
              contentStyle={{
                backgroundColor: "white",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelFormatter={(v) => new Date(v).toLocaleString()}
            />

            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
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
  const [loading, setLoading] = useState(true);

  // fetchHistory wrapped in useCallback (PREVENTS re-creation each render)
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/sensordata`);
      if (res.ok) {
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("❌ Error fetching sensor history:", error);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading real-time graphs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 shadow-lg">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Real-Time Sensor Graphs</h1>
          </div>
          <p className="text-gray-600 ml-16">Live monitoring of environmental and biometric data</p>
        </div>

        {/* Graph Cards */}
        <div className="grid grid-cols-1 gap-6">
          
          <GraphCard
            data={history}
            dataKey="roomTemp"
            label="Room Temperature Over Time"
            color="#3b82f6"
            icon={Thermometer}
            gradient="from-blue-500 to-blue-600"
          />

          <GraphCard
            data={history}
            dataKey="waterTempC"
            label="Body Temperature Over Time"
            color="#ef4444"
            icon={Thermometer}
            gradient="from-red-500 to-red-600"
          />

          <GraphCard
            data={history}
            dataKey="avgBpm"
            label="Heart Rate Over Time"
            color="#10b981"
            icon={Heart}
            gradient="from-green-500 to-green-600"
          />

        </div>

        {/* Footer */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">Live - Updates every 5 seconds</span>
            </div>
            <div className="text-gray-500 text-sm">
              {history.length > 0 && `${history.length} data points collected`}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RealtimeGraphs;
