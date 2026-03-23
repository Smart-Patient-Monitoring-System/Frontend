import React, { useState, useEffect } from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({
  profileName: profileNameProp,
  isDoctorView = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();


  const [profileName, setProfileName] = useState("Patient");

  // where to return (from navigate state)
  const returnTo = location.state?.returnTo || "/DocDashboard";

  useEffect(() => {
    if (profileNameProp) {
      setProfileName(profileNameProp);
      return;
    }

    const name =
      location.state?.patientName ||
      localStorage.getItem("profilePatientName") ||
      localStorage.getItem("patientName");

    if (name) setProfileName(name);
  }, [profileNameProp, location.state]);

  const handleBack = () => {
    // go back to the dashboard that opened this view
    navigate(returnTo);
  };

  const title = isDoctorView ? "Patient Profile" : "Patient Portal";
  const subtitle = isDoctorView
    ? `Viewing ${profileName}'s profile`
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
          {/* GO BACK */}
          {isDoctorView && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Go Back</span>
            </button>
          )}


        </div>
      </div>
    </header>
  );
};

export default Header;
