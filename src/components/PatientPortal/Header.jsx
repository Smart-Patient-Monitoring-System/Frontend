import React, { useState } from 'react';
import { Heart, Bell, Settings, LogOut } from 'lucide-react';
import AlertsCard from "../../components/PatientPortal/AlertsCard";
import { useNavigate } from "react-router-dom";


const Header = ({ patientName }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  const handleLogout = () => {
    // later: clear auth data if needed
    // localStorage.clear();

    navigate("/"); //  go back to Home page
  };

  return (
    <header className="bg-white w-full shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
      
      {/* MAIN FLEX */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded-full p-2.5">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Patient Portal
            </h1>
            <p className="text-sm text-gray-600 truncate max-w-[180px] sm:max-w-none">
              Welcome back, {patientName}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">

          {/* DARK MODE (YOU CAN REMOVE IF NOT NEEDED) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transition-transform ${
                isDarkMode ? 'translate-x-6 sm:translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>

          {/* BELL ICON */}
          <div className="relative">
            <button
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* DROPDOWN */}
            {showAlerts && (
              <div className="absolute right-0 mt-3 z-50 w-[260px] sm:w-auto">
                <AlertsCard />
              </div>
            )}
          </div>

          {/* SETTINGS */}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="w-5 h-5 text-gray-700" />
          </button>

          {/* LOGOUT BUTTON */}
<button
  onClick={handleLogout}
  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors"
>
  <LogOut className="w-5 h-5 text-gray-700" />
  <span className="hidden sm:block text-sm font-medium text-gray-700">
    Logout
  </span>
</button>

        </div>
      </div>
    </header>
  );
};

export default Header;
