import React from "react";
import {
  AlertTriangle,
  Heart,
  Wind,
  Thermometer,
  Gauge,
} from "lucide-react";

/* Map alert title keywords to icons */
const getIcon = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("heart")) return Heart;
  if (t.includes("oxygen") || t.includes("spo")) return Wind;
  if (t.includes("temp") || t.includes("fever") || t.includes("hypothermia"))
    return Thermometer;
  if (t.includes("blood pressure") || t.includes("hypertensive"))
    return Gauge;
  return AlertTriangle;
};

/* Severity-based styling */
const styles = {
  CRITICAL: {
    bg: "bg-gradient-to-r from-red-50 to-red-100/60",
    border: "border-red-300",
    accent: "bg-red-500",
    iconBg: "bg-red-500/15",
    iconColor: "text-red-600",
    titleColor: "text-red-800",
    badge: "bg-red-500 text-white",
    valueBg: "bg-red-100 text-red-700",
  },
  HIGH: {
    bg: "bg-gradient-to-r from-orange-50 to-amber-50/60",
    border: "border-orange-300",
    accent: "bg-orange-500",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-600",
    titleColor: "text-orange-800",
    badge: "bg-orange-500 text-white",
    valueBg: "bg-orange-100 text-orange-700",
  },
  MEDIUM: {
    bg: "bg-gradient-to-r from-yellow-50 to-amber-50/40",
    border: "border-yellow-300",
    accent: "bg-yellow-500",
    iconBg: "bg-yellow-500/15",
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-800",
    badge: "bg-yellow-500 text-white",
    valueBg: "bg-yellow-100 text-yellow-700",
  },
};

export default function AlertCard({
  title,
  patient,
  description,
  currentValue,
  normalRange,
  severity = "MEDIUM",
  room,
  time,
}) {
  const s = styles[severity] || styles.MEDIUM;
  const Icon = getIcon(title);

  return (
    <div
      className={`${s.bg} ${s.border}
        border rounded-2xl p-4 flex items-start gap-4 relative overflow-hidden
        shadow-[0_2px_10px_rgba(0,0,0,0.06)]
        hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]
        transition-all duration-300 hover:scale-[1.005]`}
    >
      {/* Severity accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${s.accent} rounded-l-2xl`}
      />

      {/* Icon */}
      <div
        className={`${s.iconBg} w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ml-1
          ${severity === "CRITICAL" ? "animate-pulse" : ""}`}
      >
        <Icon className={s.iconColor} size={22} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`font-bold text-base ${s.titleColor}`}>{title}</h3>
          <span
            className={`${s.badge} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider`}
          >
            {severity}
          </span>
        </div>

        <p className="text-gray-700 text-sm mt-1">
          <span className="font-semibold">Patient:</span> {patient}
          {room && (
            <span className="text-gray-400 ml-2">
              · Room {room}
            </span>
          )}
        </p>

        <p className="text-gray-500 text-xs mt-1">{description}</p>

        <div className="flex items-center gap-3 mt-2">
          <span
            className={`${s.valueBg} text-xs font-bold px-2.5 py-1 rounded-lg`}
          >
            {currentValue}
          </span>
          <span className="text-gray-400 text-xs">
            Normal: {normalRange}
          </span>
        </div>
      </div>

      {/* Timestamp */}
      {time && (
        <div className="text-gray-400 text-[11px] font-medium whitespace-nowrap shrink-0">
          {time}
        </div>
      )}
    </div>
  );
}
