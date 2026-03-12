import React, { useEffect, useMemo, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";

const API_BASE = "http://localhost:8080";

const pad2 = (n) => String(n).padStart(2, "0");
const formatDate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const safeNum = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const buildRange = (timeRange) => {
  const now = new Date();
  const to = new Date(now);
  const from = new Date(now);

  if (timeRange === "24H") from.setDate(from.getDate() - 1);
  if (timeRange === "7D") from.setDate(from.getDate() - 7);
  if (timeRange === "30D") from.setDate(from.getDate() - 30);

  return { from: formatDate(from), to: formatDate(to) };
};

const getMinMax = (vals) => {
  const v = vals.filter((x) => x !== null && x !== undefined);
  if (v.length === 0) return { min: 0, max: 1 };
  let min = v[0], max = v[0];
  for (const x of v) {
    if (x < min) min = x;
    if (x > max) max = x;
  }
  const pad = (max - min) * 0.15 || 5;
  return { min: min - pad, max: max + pad };
};

function LineChart({ title, subtitle, legend, color, points, getValue, fixedTicks }) {
  const svgRef = useRef(null);
  const [dim, setDim] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => {
      if (svgRef.current) {
        setDim({
          width: svgRef.current.clientWidth,
          height: svgRef.current.clientHeight,
        });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerW = Math.max(0, dim.width - padding.left - padding.right);
  const innerH = Math.max(0, dim.height - padding.top - padding.bottom);

  const values = points.map((p) => getValue(p));
  const range = getMinMax(values);

  const xScale = (i) => padding.left + (i / Math.max(1, points.length - 1)) * innerW;
  const yScale = (val) => {
    if (val === null || val === undefined) return null;
    const t = (val - range.min) / (range.max - range.min || 1);
    return padding.top + innerH - t * innerH;
  };

  const path = (() => {
    let d = "";
    points.forEach((p, i) => {
      const y = yScale(getValue(p));
      if (y === null) return;
      const x = xScale(i);
      d += `${d ? " L" : "M"} ${x} ${y}`;
    });
    return d;
  })();

  const hasData = values.some((v) => v !== null);

  // ticks: use fixed ticks for nicer axis (spo2), otherwise auto
  const ticks =
    fixedTicks?.length
      ? fixedTicks
      : [0, 1, 2, 3, 4].map((i) => range.min + (i / 4) * (range.max - range.min));

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm text-gray-600">{legend}</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden h-56 sm:h-64 md:h-72">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${dim.width} ${dim.height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* GRID + Y LABELS */}
          {ticks.map((val, idx) => {
            const y = yScale(val);
            return (
              <React.Fragment key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={dim.width - padding.right}
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

          {/* X LABELS */}
          {points.map((p, i) =>
            points.length <= 1 ? null : i % Math.ceil(points.length / 6) === 0 ? (
              <text
                key={i}
                x={xScale(i)}
                y={dim.height - padding.bottom + 20}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="11"
              >
                {p.label}
              </text>
            ) : null
          )}

          {/* LINE */}
          {path && (
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {!hasData && (
            <text
              x={dim.width / 2}
              y={dim.height / 2}
              textAnchor="middle"
              fill="#9ca3af"
              fontSize="14"
            >
              No data
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}

export default function VitalsTrends3Charts({ patientId, refreshKey = 0 }) {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [timeRange, setTimeRange] = useState("24H");
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState([]); // { label, hr, spo2, sugar }

  const fetchVitals = async () => {
    if (!patientId || !token) {
      setPoints([]);
      return;
    }

    const { from, to } = buildRange(timeRange);
    const url = `${API_BASE}/api/patients/${patientId}/medical-events?from=${from}&to=${to}`;

    setLoading(true);
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
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

      const mapped = vitals.map((v) => {
        let label = "";
        if (timeRange === "24H") label = `${pad2(v.dt.getHours())}:00`;
        else label = formatDate(v.dt);
        return { label, hr: v.hr, spo2: v.spo2, sugar: v.sugar };
      });

      setPoints(mapped);
    } catch {
      setPoints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, timeRange, refreshKey]);

  const hasSugar = points.some((p) => p.sugar !== null && p.sugar !== undefined);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-full">
      {/* Header + Range */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Vitals Trends</h2>
          <p className="text-sm text-gray-500">
            {loading ? "Loading..." : "Historical monitoring data"}
          </p>
        </div>

        <div className="flex gap-2">
          {["24H", "7D", "30D"].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                timeRange === r
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Separate Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <LineChart
          title="Heart Rate"
          subtitle="bpm over time"
          legend="Heart Rate (bpm)"
          color="#3b82f6"
          points={points}
          getValue={(p) => p.hr}
        />

        <LineChart
          title="SpO₂"
          subtitle="% over time"
          legend="SpO₂ (%)"
          color="#14b8a6"
          points={points}
          getValue={(p) => p.spo2}
          fixedTicks={[90, 92, 94, 96, 98, 100]}
        />

        {hasSugar && (
          <LineChart
            title="Sugar Level"
            subtitle="mg/dL over time"
            legend="Sugar (mg/dL)"
            color="#eab308"
            points={points}
            getValue={(p) => p.sugar}
          />
        )}
      </div>
    </div>
  );
}
