import React from "react";
import { AlertTriangle } from "lucide-react";

export default function AlertCard({title,patient,hr,normalRange,time,level = "medium"}) {
  const colors = {
    high: "bg-red-100 border-red-300 text-red-700",
    medium: "bg-yellow-100 border-yellow-300 text-yellow-700",
    low: "bg-blue-100 border-blue-300 text-blue-700",
  };

  return (
    <div
      className={`${colors[level]} 
        border rounded-3xl p-5 mb-4 flex justify-between items-start 
        shadow-[0_4px_12px_rgba(0,0,0,0.08)]
        hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]
        backdrop-blur-sm
        transition-all duration-300 
        hover:scale-[1.01]
      `}
    >
      <div className="flex gap-4">

        <div
          className={`
            w-12 h-12 rounded-2xl flex items-center justify-center 
            shadow-md 
            ${level === "high" ? "bg-red-500/20" : ""}
            ${level === "medium" ? "bg-yellow-500/20" : ""}
            ${level === "low" ? "bg-blue-500/20" : ""}
            animate-pulse
          `}
        >
          <AlertTriangle
            className={`
              ${level === "high" ? "text-red-600" : ""}
              ${level === "medium" ? "text-yellow-600" : ""}
              ${level === "low" ? "text-blue-600" : ""}
            `}
            size={26}
          />
        </div>

        <div>
          <h3 className="font-bold text-xl leading-tight">{title}</h3>

          <p className="text-gray-800 mt-1 text-base">
            <span className="font-semibold">Patient:</span> {patient}
          </p>

          <p className="text-gray-600 text-sm mt-1">
            Heart Rate:{" "}
            <span
              className={`
                font-bold 
                ${level === "high" ? "text-red-700" : ""}
                ${level === "medium" ? "text-yellow-700" : ""}
                ${level === "low" ? "text-blue-700" : ""}
              `}
            >
              {hr} bpm
            </span>{" "}
            <span className="text-gray-500"> (Normal: {normalRange})</span>
          </p>
        </div>
      </div>

      <p className="text-gray-600 text-sm font-medium">{time}</p>
    </div>
  );
}
