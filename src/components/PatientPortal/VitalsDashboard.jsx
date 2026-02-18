import React, { useEffect, useMemo, useState } from "react";
import VitalCard from "./VitalCard";

const API_BASE = import.meta.env.VITE_API_URL; 

export default function VitalsDashboard({ patientId, refreshKey = 0 }) {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [latestVitals, setLatestVitals] = useState(null);

  const fetchLatestVitals = async () => {
    if (!patientId || !token) return;

    const res = await fetch(
      `${API_BASE}/api/patients/${patientId}/medical-summary`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) return;

    const data = await res.json();

    //  IMPORTANT: sometimes backend puts data in payload, sometimes flattened
    // we support BOTH to avoid undefined issues
    const raw = data?.latestVitals || null;
    const payload = raw?.payload || raw || null;

    setLatestVitals(payload);
  };

  useEffect(() => {
    fetchLatestVitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, refreshKey]);

  const hr = latestVitals?.heartRate ?? "--";
  const temp = latestVitals?.temp ?? "--";
  const spo2 = latestVitals?.spo2 ?? "--";
  const bp = latestVitals?.bp ?? "--";
  const sugar = latestVitals?.sugarLevel ?? "--";

  //  If sugar is "--" (not available), don't show it.
  const showSugar = sugar !== "--" && sugar !== null && sugar !== undefined && sugar !== "";

  const cards = [
    {
      title: "Heart Rate",
      value: hr,
      unit: "bpm",
      status: "Stable",
      trend: "−",
      iconName: "heart",
      bgColor: "bg-blue-100",
      iconColor: "bg-blue-500",
      barColor: "bg-blue-500",
    },
    {
      title: "Temperature",
      value: temp,
      unit: "°C",
      status: "Stable",
      trend: "−",
      iconName: "thermometer",
      bgColor: "bg-orange-100",
      iconColor: "bg-orange-600",
      barColor: "bg-orange-500",
    },
    {
      title: "SPO₂",
      value: spo2,
      unit: "%",
      status: "Up",
      trend: "↗",
      iconName: "droplets",
      bgColor: "bg-teal-100",
      iconColor: "bg-teal-600",
      barColor: "bg-teal-500",
    },
    {
      title: "Blood Pressure",
      value: bp,
      unit: "mmHg",
      status: "Stable",
      trend: "−",
      iconName: "activity",
      bgColor: "bg-purple-100",
      iconColor: "bg-purple-600",
      barColor: "bg-purple-500",
    },
  ];

  // Sugar level card (5th)
  if (showSugar) {
    cards.push({
      title: "Sugar Level",
      value: sugar,
      unit: "mg/dL",
      status: "Stable",
      trend: "−",
      iconName: "droplets",
      bgColor: "bg-yellow-100",
      iconColor: "bg-yellow-600",
      barColor: "bg-yellow-500",
    });
  }

  // IMPORTANT:
  // If you show 5 cards, grid-cols-4 will wrap nicely into next row.
  // If you want all 5 in one row on large screens, change lg:grid-cols-4 -> lg:grid-cols-5
  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {cards.map((c, idx) => (
        <VitalCard key={idx} {...c} />
      ))}
    </div>
  );
}
