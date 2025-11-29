import React, { useState } from "react";

const Dashboard = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Vitals History",
    "ECG Readings",
    "Profile",
    "Emergency Panel",
    "Medical Records",
    "Messaging",
    "AI Health Assistant",
    "Bookings"
  ];

  // Notify parent when tab changes
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="w-full px-6 py-4 bg-white">
      <div className="flex gap-2 items-center justify-between">

        {/* Left side tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right side Manual Entry button */}
        <button
          onClick={() => onTabChange("manual-entry")}
          className="px-6 py-2 rounded-full bg-green-500 text-white font-medium text-sm shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Manual Entry +
        </button>

      </div>
    </div>
  );
};

export default Dashboard;
