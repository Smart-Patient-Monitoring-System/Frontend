import React, { useState, useEffect } from "react";
import { Heart, Bell, ArrowLeft } from "lucide-react";
import AlertsCard from "../../../components/PatientPortal/AlertsCard";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({
  profileName: profileNameProp,
  isDoctorView = true,
  // ✅ your real route in App.jsx
  backPath = "/DocDashboard",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [profileName, setProfileName] = useState("Patient");

  useEffect(() => {
    if (profileNameProp) {
      setProfileName(profileNameProp);
      return;
    }

    const name =
      localStorage.getItem("profilePatientName") ||
      localStorage.getItem("patientName");

    if (name) setProfileName(name);
  }, [profileNameProp]);

  // ✅ best back logic: use state.returnTo if available, else go back, else default dashboard
  const handleBack = () => {
    const returnTo = location.state?.returnTo;

    if (returnTo) {
      navigate(returnTo);
      return;
    }

    // if user came from another page, go back
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    // fallback
    navigate(backPath);
  };

  const title = isDoctorView ? "Patient Profile" : "Patient Portal";
  const subtitle = isDoctorView
    ? `Welcome to ${profileName}'s profile`
    : `Welcome back, ${profileName}`;

  return (
    <header className="bg-white w-full shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded-full p-2.5">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>

          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              {title}
            </h1>
            <p className="text-sm text-gray-600 truncate max-w-[220px] sm:max-w-none">
              {subtitle}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-end">
          {isDoctorView && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
              title="Back to Doctor Dashboard"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Go Back</span>
            </button>
          )}

          {/* DARK MODE (UI only) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-colors ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
            aria-label="Toggle dark mode"
            type="button"
          >
            <div
              className={`absolute top-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transition-transform ${
                isDarkMode ? "translate-x-6 sm:translate-x-8" : "translate-x-1"
              }`}
            />
          </button>

          {/* ALERTS */}
          <div className="relative">
            <button
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowAlerts(!showAlerts)}
              aria-label="Alerts"
              type="button"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {showAlerts && (
              <div className="absolute right-0 mt-3 z-50 w-[260px] sm:w-auto">
                <AlertsCard />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
