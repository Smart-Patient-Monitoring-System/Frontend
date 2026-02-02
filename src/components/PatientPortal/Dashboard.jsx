import React, { useState } from "react";

const Dashboard = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Real-Time Vitals",
    "ECG Readings",
    "Profile",
    "Bookings",
    "Emergency Panel",
    "Medical Records",
    "Health Data",
    "Messaging",
    "AI Health Assistant",
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="font-semibold text-gray-900">{activeTab}</span>
        </div>
        <button
          onClick={() => onTabChange("manual-entry")}
          className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium shadow-md hover:bg-green-600 transition-all"
        >
          + Entry
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-2 space-y-1 max-h-[60vh] overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all ${activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tablet/Desktop Navigation */}
      <div className="hidden lg:flex items-center justify-between px-4 xl:px-6 py-3">
        {/* Scrollable tabs container */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-4 xl:px-6 py-2 rounded-full font-medium text-xs xl:text-sm transition-all duration-200 whitespace-nowrap ${activeTab === tab
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-transparent text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {tab}
              </button>
            ))}
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

      {/* Tablet Horizontal Scroll */}
      <div className="hidden md:flex lg:hidden items-center gap-2 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-full font-medium text-xs transition-all whitespace-nowrap ${activeTab === tab
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-transparent text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => onTabChange("manual-entry")}
          className="ml-2 px-4 py-2 rounded-full bg-green-500 text-white font-medium text-xs shadow-md hover:bg-green-600 transition-all whitespace-nowrap"
        >
          + Entry
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
