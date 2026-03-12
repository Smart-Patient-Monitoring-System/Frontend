import React, { useState } from "react";

const Dashboard = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Real-Time Vitals",
    "ECG Readings",
    "Profile",
    "Emergency Panel",
    "Medical Records",
    "Doctor Notes",
    "AI Health Assistant",
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="w-full bg-white">
      {/* Top navigation row */}
      <div className="flex items-center justify-between gap-4 px-4 xl:px-6 py-4">
        {/* Tabs container (separated group like the image) */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={[
                    "px-4 xl:px-5 py-2 rounded-xl whitespace-nowrap",
                    "text-xs xl:text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-white hover:text-gray-900",
                  ].join(" ")}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Entry button (separated like the image) */}
        <button
          onClick={() => onTabChange && onTabChange("manual-entry")}
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-white text-xs xl:text-sm font-semibold shadow-sm hover:bg-green-600 transition"
        >
          <span className="text-base leading-none">+</span>
          Manual Entry
        </button>
      </div>

      {/* Subtle divider like dashboards */}
      <div className="border-b border-gray-200" />
    </div>
  );
};

export default Dashboard;
