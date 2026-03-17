import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../api";
import gtMark from "../../assets/images/gtMark.png";
import heart from "../../assets/images/heart.png";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetSessionIdFromUrl = searchParams.get("resetSessionId") || "";
  const roleFromUrl = searchParams.get("role") || "";

  const [resetSessionId, setResetSessionId] = useState(resetSessionIdFromUrl);
  const [role, setRole] = useState(roleFromUrl);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resetSessionIdFromUrl) {
      setResetSessionId(resetSessionIdFromUrl);
    }
    if (roleFromUrl) {
      setRole(roleFromUrl.toUpperCase());
    }
  }, [resetSessionIdFromUrl, roleFromUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!resetSessionId.trim()) {
      setError("Reset session is required. Please restart the forgot password process.");
      return;
    }

    if (!newPassword.trim()) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetSessionId: resetSessionId.trim(),
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to reset password");
        setLoading(false);
        return;
      }

      // Get role from response or URL parameter
      const userRole = (data.role || role || "").toUpperCase();
      
      setSuccess("Password has been reset successfully! Redirecting to login...");
      
      // Determine redirect path based on role
      let redirectPath = "/patientLogin"; // Default fallback
      if (userRole === "DOCTOR") {
        redirectPath = "/doctorLogin";
      } else if (userRole === "PATIENT") {
        redirectPath = "/patientLogin";
      } else if (userRole === "ADMIN") {
        redirectPath = "/adminLogin";
      }
      
      // Redirect to appropriate login page after 2 seconds
      setTimeout(() => {
        navigate(redirectPath);
      }, 2000);
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F8FBFF] to-[#EEF6FF] flex items-center justify-center px-4">
      <div className="w-full max-w-[600px]">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="relative w-[120px] h-[42px] rounded-full 
            bg-gradient-to-r from-[#057EF8] to-[#0DC0BD]
            flex items-center justify-center pl-9
            hover:scale-105 transition-all shadow-md mb-8"
        >
          <img
            src={gtMark}
            alt="Home"
            className="absolute left-1 top-1 w-[34px] h-[34px] rounded-full"
          />
          <span className="text-white font-semibold">HOME</span>
        </button>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10">
          <div className="flex items-center justify-center mb-6">
            <div className="w-[100px] h-[100px] rounded-3xl 
              bg-gradient-to-tr from-[#0DC0BD] to-[#057EF8] 
              shadow-xl flex items-center justify-center">
              <img src={heart} alt="Heart" className="w-[70px]" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Choose a new password
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="font-semibold text-gray-700">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-[52px] mt-2 mb-5 px-4 rounded-xl border focus:border-[#057EF8] outline-none"
            />

            <label className="font-semibold text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[52px] mt-2 mb-8 px-4 rounded-xl border focus:border-[#057EF8] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#057EF8] to-[#0DC0BD]
                text-white font-semibold text-lg hover:scale-105 transition
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                // Navigate to appropriate login based on role from URL
                const userRole = (role || "").toUpperCase();
                let loginPath = "/patientLogin";
                if (userRole === "DOCTOR") {
                  loginPath = "/doctorLogin";
                } else if (userRole === "ADMIN") {
                  loginPath = "/adminLogin";
                }
                navigate(loginPath);
              }}
              className="text-sm text-[#057EF8] hover:text-[#0DC0BD] hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
