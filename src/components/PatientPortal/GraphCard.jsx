import React, { useState, useRef, useEffect } from "react";
import { TrendingUp } from "lucide-react";

const GraphCard = () => {
  const [timeRange, setTimeRange] = useState("24H");
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [data] = useState(() => {
    const temp = [];
    for (let i = 0; i < 24; i++) {
      const hr = 70 + Math.sin(i / 3) * 5 + Math.random() * 3;
      const spo2 = 98 + Math.sin(i / 4) * 1.5 + Math.random() * 0.5;
      temp.push({
        time: `${i}:00`,
        heartRate: parseFloat(hr.toFixed(1)),
        spo2: parseFloat(spo2.toFixed(1)),
      });
    }
    return temp;
  });

  // Update dimensions on mount and resize
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

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = dimensions.width - padding.left - padding.right || 0;
  const innerHeight = dimensions.height - padding.top - padding.bottom || 0;

  const xScale = (index) =>
    padding.left + (index / (data.length - 1)) * innerWidth;

  const yScaleHR = (value) =>
    padding.top + innerHeight - ((value - 60) / 40) * innerHeight;

  const yScaleSpo2 = (value) =>
    padding.top + innerHeight - ((value - 95) / 5) * innerHeight;

  const heartRatePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScaleHR(d.heartRate)}`)
    .join(" ");

  const spo2Path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScaleSpo2(d.spo2)}`)
    .join(" ");

  const hrTicks = [60, 70, 80, 90, 100];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Vitals Trends
            </h2>
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
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Y-AXIS GRID */}
          {hrTicks.map((val) => (
            <React.Fragment key={val}>
              <line
                x1={padding.left}
                y1={yScaleHR(val)}
                x2={dimensions.width - padding.right}
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

          {/* X LABELS */}
          {data.map((d, i) =>
            i % 4 === 0 ? (
              <text
                key={i}
                x={xScale(i)}
                y={dimensions.height - padding.bottom + 20}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="11"
              >
                {d.time}
              </text>
            ) : null
          )}

          {/* LINES */}
          <path
            d={spo2Path}
            fill="none"
            stroke="#14b8a6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={heartRatePath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
        </div>
      </div>
    </div>
  );
};

export default GraphCard;
