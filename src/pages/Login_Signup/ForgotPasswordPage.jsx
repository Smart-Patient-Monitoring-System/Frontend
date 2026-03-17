import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../api";
import gtMark from "../../assets/images/gtMark.png";
import heart from "../../assets/images/heart.png";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "PATIENT";

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("EMAIL"); // EMAIL | OTP
  const [resetSessionId, setResetSessionId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!emailOrUsername.trim()) {
      setError("Please enter your email or username");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/request-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrUsername: emailOrUsername.trim(),
          role: role.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send reset link");
        setLoading(false);
        return;
      }

      setResetSessionId(data.resetSessionId);
      setStep("OTP");
      setSuccess("OTP has been sent to your email. Please check your inbox.");
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetSessionId,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid or expired OTP");
        setLoading(false);
        return;
      }

      setSuccess("OTP verified. Redirecting...");
      setTimeout(() => {
        navigate(`/reset-password?resetSessionId=${encodeURIComponent(resetSessionId)}&role=${role.toUpperCase()}`);
      }, 500);
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
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
            Forgot Password?
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Enter your email or username to receive a password reset link
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
              <p className="font-semibold mb-2">{success}</p>
            </div>
          )}

          <form onSubmit={step === "OTP" ? handleSubmitOtp : handleSubmitEmail}>
              <label className="font-semibold text-gray-700">
                Email or Username
              </label>
              <input
                type="text"
                placeholder="Enter your email or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                disabled={step === "OTP"}
                className="w-full h-[52px] mt-2 mb-6 px-4 rounded-xl border focus:border-[#057EF8] outline-none"
              />

              {step === "OTP" && (
                <>
                  <label className="font-semibold text-gray-700">OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full h-[52px] mt-2 mb-6 px-4 rounded-xl border focus:border-[#057EF8] outline-none"
                  />

                  <div className="mb-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("EMAIL");
                        setOtp("");
                        setResetSessionId("");
                        setSuccess("");
                        setError("");
                      }}
                      className="text-sm text-[#057EF8] hover:text-[#0DC0BD] hover:underline transition"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#057EF8] to-[#0DC0BD]
                  text-white font-semibold text-lg hover:scale-105 transition
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Please wait..." : step === "OTP" ? "Verify OTP" : "Send OTP"}
              </button>
            </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (role === "PATIENT") navigate("/patientLogin");
                else if (role === "DOCTOR") navigate("/doctorLogin");
                else if (role === "ADMIN") navigate("/adminLogin");
                else navigate("/");
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
