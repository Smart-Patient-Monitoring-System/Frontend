import React, { useMemo, useRef, useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

const API_BASE = "http://localhost:8080";

const rangeToDays = (range) => {
  if (range === "24H") return 1;
  if (range === "7D") return 7;
  return 30;
};

const formatTimeLabel = (date, range) => {
  const d = new Date(date);
  if (range === "24H") {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  // 7D/30D -> show date
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

export default function GraphCard({ patientId }) {
  const [timeRange, setTimeRange] = useState("24H");
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const token = useMemo(() => localStorage.getItem("token"), []);

  const [data, setData] = useState([]); // points for chart
  const [loading, setLoading] = useState(false);

  // Resize observer (better than window resize only)
  useEffect(() => {
    if (!svgRef.current) return;

    const el = svgRef.current;
    const resizeObserver = new ResizeObserver(() => {
      setDimensions({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    });

    resizeObserver.observe(el);
    setDimensions({
      width: el.clientWidth,
      height: el.clientHeight,
    });

    return () => resizeObserver.disconnect();
  }, []);

  const fetchVitals = async () => {
    if (!patientId || !token) return;

    setLoading(true);
    try {
      const days = rangeToDays(timeRange);

      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - days);

      // Query format: YYYY-MM-DD
      const toStr = to.toISOString().slice(0, 10);
      const fromStr = from.toISOString().slice(0, 10);

      const res = await fetch(
        `${API_BASE}/api/patients/${patientId}/medical-events?from=${fromStr}&to=${toStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        setData([]);
        return;
      }

      const events = await res.json();

      // Keep only VITALS events, sort by recordedAt
      const vitals = (Array.isArray(events) ? events : [])
        .filter((e) => e.type === "VITALS")
        .sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));

      // Convert to chart points
      const points = vitals.map((e) => {
        const payload = e.payload || e; // support both formats
        return {
          time: formatTimeLabel(e.recordedAt, timeRange),
          recordedAt: e.recordedAt,
          heartRate: payload.heartRate != null ? Number(payload.heartRate) : null,
          spo2: payload.spo2 != null ? Number(payload.spo2) : null,
          sugarLevel: payload.sugarLevel != null ? Number(payload.sugarLevel) : null,
        };
      });

      setData(points);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, timeRange]);

  /* ---------------- CHART SCALES ---------------- */
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const width = dimensions.width || 0;
  const height = dimensions.height || 0;

  const innerWidth = Math.max(0, width - padding.left - padding.right);
  const innerHeight = Math.max(0, height - padding.top - padding.bottom);

  const xScale = (index) => {
    if (data.length <= 1) return padding.left;
    return padding.left + (index / (data.length - 1)) * innerWidth;
  };

  // Dynamic min/max for HR
  const hrValues = data.map((d) => d.heartRate).filter((v) => v != null);
  const hrMin = hrValues.length ? Math.min(...hrValues) : 60;
  const hrMax = hrValues.length ? Math.max(...hrValues) : 100;
  const hrPad = 5;
  const hrDomainMin = Math.floor((hrMin - hrPad) / 5) * 5;
  const hrDomainMax = Math.ceil((hrMax + hrPad) / 5) * 5;

  const yScaleHR = (value) => {
    if (value == null) return null;
    const t = (value - hrDomainMin) / (hrDomainMax - hrDomainMin || 1);
    return padding.top + innerHeight - t * innerHeight;
  };

  // SpO2 usually 90-100
  const yScaleSpo2 = (value) => {
    if (value == null) return null;
    const spo2Min = 90;
    const spo2Max = 100;
    const t = (value - spo2Min) / (spo2Max - spo2Min || 1);
    return padding.top + innerHeight - t * innerHeight;
  };

  // Path builder (skips null points)
  const makePath = (key, yScaleFn) => {
    let started = false;
    let path = "";

    data.forEach((d, i) => {
      const y = yScaleFn(d[key]);
      if (y == null) {
        started = false;
        return;
      }
      const x = xScale(i);
      path += `${started ? "L" : "M"} ${x} ${y} `;
      started = true;
    });

    return path.trim();
  };

  const heartRatePath = makePath("heartRate", yScaleHR);
  const spo2Path = makePath("spo2", yScaleSpo2);
  // const sugarPath = makePath("sugarLevel", yScaleSugar); // if you add sugar chart scale

  // Y axis ticks for HR (like screenshot)
  const hrTicks = [];
  for (let v = hrDomainMin; v <= hrDomainMax; v += 10) hrTicks.push(v);

  const xLabelStep = timeRange === "24H" ? 4 : timeRange === "7D" ? 1 : 2;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Vitals Trends</h2>
            <p className="text-sm text-gray-500">Historical monitoring data</p>
          </div>
        </div>

        <div className="flex gap-2">
          {["24H", "7D", "30D"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                timeRange === range
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}
      <div className="relative w-full overflow-hidden h-64 sm:h-72 md:h-80 lg:h-96">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* If no size yet, skip drawing */}
          {width > 0 && height > 0 && (
            <>
              {/* Loading / empty */}
              {loading && (
                <text
                  x={width / 2}
                  y={height / 2}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="14"
                >
                  Loading...
                </text>
              )}

              {!loading && data.length === 0 && (
                <text
                  x={width / 2}
                  y={height / 2}
                  textAnchor="middle"
                  fill="#9ca3af"
                  fontSize="14"
                >
                  No vitals data
                </text>
              )}

              {/* Y GRID + HR labels */}
              {hrTicks.map((val) => (
                <React.Fragment key={val}>
                  <line
                    x1={padding.left}
                    y1={yScaleHR(val)}
                    x2={width - padding.right}
                    y2={yScaleHR(val)}
                    stroke="#e5e7eb"
                  />
                  <text
                    x={padding.left - 10}
                    y={yScaleHR(val)}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    {val}
                  </text>
                </React.Fragment>
              ))}

              {/* X labels */}
              {data.map((d, i) =>
                i % xLabelStep === 0 ? (
                  <text
                    key={i}
                    x={xScale(i)}
                    y={height - padding.bottom + 20}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize="11"
                  >
                    {d.time}
                  </text>
                ) : null
              )}

              {/* LINES */}
              {/* SpO2 (green like your screenshot) */}
              <path
                d={spo2Path}
                fill="none"
                stroke="#14b8a6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Heart Rate (blue like your screenshot) */}
              <path
                d={heartRatePath}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>

        {/* LEGEND */}
        <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-600">Heart Rate (bpm)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full" />
            <span className="text-sm text-gray-600">SpO₂ (%)</span>
          </div>

          {/* enable if you add sugar line */}
          {/* <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-sm text-gray-600">Sugar (mg/dL)</span>
          </div> */}
        </div>
      </div>
    </div>
  );
}
