import React, { useEffect, useMemo, useState } from "react";
import VitalCard from "./VitalCard";

const API_BASE = "http://localhost:8080";

export default function VitalsDashboard({ patientId, refreshKey = 0 }) {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [latestVitals, setLatestVitals] = useState(null);

  const fetchLatestVitals = async () => {
    if (!patientId || !token) return;

    const res = await fetch(`${API_BASE}/api/patients/${patientId}/medical-summary`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data = await res.json();
    setLatestVitals(data?.latestVitals || null);
  };

  useEffect(() => {
    fetchLatestVitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, refreshKey]);

  const hr = latestVitals?.heartRate ?? "--";
  const temp = latestVitals?.temp ?? "--";
  const spo2 = latestVitals?.spo2 ?? "--";
  const bp = latestVitals?.bp ?? "--";

  // optional (if you add sugarLevel into payload)
  const sugar = latestVitals?.sugarLevel ?? null;

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

  // If you want sugar card as 5th (optional)
  if (sugar !== null) {
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

  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {cards.map((c, idx) => (
        <VitalCard key={idx} {...c} />
      ))}
    </div>
  );
}
