import React, { useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

const formatDate = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const GraphCard = ({ patientId, refreshKey = 0 }) => {
  const [timeRange, setTimeRange] = useState("24H");
  const [points, setPoints] = useState([]); // { label, hr, spo2, sugar }
  const [loading, setLoading] = useState(false);

  const token = useMemo(() => localStorage.getItem("token"), []);

  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        setDimensions({
          width: svgRef.current.clientWidth,
          height: svgRef.current.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const buildRange = () => {
    const now = new Date();
    const to = new Date(now);

    let from = new Date(now);
    if (timeRange === "24H") from.setDate(from.getDate() - 1);
    if (timeRange === "7D") from.setDate(from.getDate() - 7);
    if (timeRange === "30D") from.setDate(from.getDate() - 30);

    // backend supports date-only (LocalDate.parse)
    return { from: formatDate(from), to: formatDate(to) };
  };

  const safeNum = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const fetchVitalsSeries = async () => {
    if (!patientId || !token) {
      setPoints([]);
      return;
    }

    const { from, to } = buildRange();
    const url = `${API_BASE}/api/patients/${patientId}/medical-events?from=${from}&to=${to}`;

    setLoading(true);
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        setPoints([]);
        return;
      }

      const events = await res.json();

      const vitals = (Array.isArray(events) ? events : [])
        .filter((e) => (e?.type || "").toUpperCase() === "VITALS")
        .map((e) => {
          const dt = new Date(e.recordedAt);
          const p = e.payload || {};
          return {
            dt,
            hr: safeNum(p.heartRate),
            spo2: safeNum(p.spo2),
            sugar: safeNum(p.sugarLevel),
          };
        })
        .filter((x) => x.dt instanceof Date && !isNaN(x.dt.getTime()))
        .sort((a, b) => a.dt - b.dt);

      // Build labels:
      // 24H -> HH:00 labels
      // 7D/30D -> YYYY-MM-DD labels
      const mapped = vitals.map((v) => {
        let label = "";
        if (timeRange === "24H") {
          label = `${String(v.dt.getHours()).padStart(2, "0")}:00`;
        } else {
          label = formatDate(v.dt);
        }
        return { label, hr: v.hr, spo2: v.spo2, sugar: v.sugar };
      });

      setPoints(mapped);
    } catch (e) {
      setPoints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitalsSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, timeRange, refreshKey]);

  // ---------------- CHART MATH ----------------
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = Math.max(0, dimensions.width - padding.left - padding.right);
  const innerHeight = Math.max(0, dimensions.height - padding.top - padding.bottom);

  const xScale = (i) => padding.left + (i / Math.max(1, points.length - 1)) * innerWidth;

  const getMinMax = (arr) => {
    const vals = arr.filter((v) => v !== null && v !== undefined);
    if (vals.length === 0) return { min: 0, max: 1 };
    let min = vals[0], max = vals[0];
    for (const v of vals) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
    // add small padding
    const pad = (max - min) * 0.15 || 5;
    return { min: min - pad, max: max + pad };
  };

  const hrRange = getMinMax(points.map((p) => p.hr));
  const spo2Range = getMinMax(points.map((p) => p.spo2));
  const sugarRange = getMinMax(points.map((p) => p.sugar));

  const yScale = (value, range) => {
    if (value === null || value === undefined) return null;
    const { min, max } = range;
    const t = (value - min) / (max - min || 1);
    return padding.top + innerHeight - t * innerHeight;
  };

  const buildPath = (key, range) => {
    let d = "";
    points.forEach((p, i) => {
      const y = yScale(p[key], range);
      if (y === null) return;
      const x = xScale(i);
      d += `${d ? " L" : "M"} ${x} ${y}`;
    });
    return d;
  };

  const hrPath = buildPath("hr", hrRange);
  const spo2Path = buildPath("spo2", spo2Range);
  const sugarPath = buildPath("sugar", sugarRange);

  const hasAnyData =
    points.some((p) => p.hr !== null) ||
    points.some((p) => p.spo2 !== null) ||
    points.some((p) => p.sugar !== null);

  // basic ticks for HR axis display (just for grid)
  const hrTicks = [0, 1, 2, 3, 4].map((i) => {
    const t = i / 4;
    return hrRange.min + t * (hrRange.max - hrRange.min);
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-full">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Vitals Trends</h2>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : "Historical monitoring data"}
            </p>
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

      <div className="relative w-full overflow-hidden h-64 sm:h-72 md:h-80 lg:h-96">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid + HR tick labels */}
          {hrTicks.map((val, idx) => {
            const y = yScale(val, hrRange);
            return (
              <React.Fragment key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={dimensions.width - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                />
                <text
                  x={padding.left - 10}
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fill="#9ca3af"
                  fontSize="11"
                >
                  {Math.round(val)}
                </text>
              </React.Fragment>
            );
          })}

          {/* X labels */}
          {points.map((p, i) =>
            points.length <= 1 ? null : i % Math.ceil(points.length / 6) === 0 ? (
              <text
                key={i}
                x={xScale(i)}
                y={dimensions.height - padding.bottom + 20}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="11"
              >
                {p.label}
              </text>
            ) : null
          )}

          {/* Lines */}
          {spo2Path && (
            <path
              d={spo2Path}
              fill="none"
              stroke="#14b8a6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {hrPath && (
            <path
              d={hrPath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Sugar (optional line) */}
          {sugarPath && (
            <path
              d={sugarPath}
              fill="none"
              stroke="#eab308"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Empty label */}
          {!loading && !hasAnyData && (
            <text
              x={dimensions.width / 2}
              y={dimensions.height / 2}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="14"
            >
              No vitals data
            </text>
          )}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-gray-600">Heart Rate (bpm)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full" />
            <span className="text-sm text-gray-600">SpO₂ (%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-sm text-gray-600">Sugar (mg/dL)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphCard;
