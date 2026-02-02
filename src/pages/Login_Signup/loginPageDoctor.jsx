import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";

import gtMark from "../../assets/images/gtMark.png";
import heart from "../../assets/images/heart.png";
import doctor from "../../assets/images/doctor.png";

export default function LoginPageDoctor() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("CREDENTIALS"); // CREDENTIALS | OTP
  const [loginSessionId, setLoginSessionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "DOCTOR" }),
      });

      if (!response.ok) {
        let errorMessage = "Invalid email or password";
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          // If response is not JSON, use default message
        }
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();

      // 🔍 DIAGNOSTIC: Log the entire API response
      console.log("===========================================");
      console.log("🔍 FULL API RESPONSE FROM LOGIN:");
      console.log(JSON.stringify(data, null, 2));
      console.log("===========================================");
      console.log("Available fields:", Object.keys(data));
      console.log("===========================================");

      if (data.otpRequired) {
        setLoginSessionId(data.loginSessionId);
        setStep("OTP");
        setLoading(false);
        return;
      }

      // Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "DOCTOR");

      // 🔍 Try ALL possible ID field names
      const possibleIdFields = [
        'doctorId', 'id', 'userId', 'user_id', 'doctor_id', 
        'user', 'doctorID', 'userID', 'ID', 'Id'
      ];
      
      let foundId = null;
      for (const field of possibleIdFields) {
        if (data[field] !== undefined && data[field] !== null) {
          foundId = data[field];
          console.log(`✅ Found ID in field "${field}":`, foundId);
          
          // If it's an object (like data.user), try to extract ID from it
          if (typeof foundId === 'object' && foundId !== null) {
            const nestedId = foundId.id || foundId.doctorId || foundId.userId;
            if (nestedId !== undefined && nestedId !== null) {
              console.log(`✅ Found nested ID:`, nestedId);
              foundId = nestedId;
            }
          }
          break;
        }
      }

      if (foundId) {
        localStorage.setItem("userId", foundId.toString());
        console.log("✅ Stored userId:", foundId);
      } else {
        console.error("❌ Could not find doctor ID in any known field!");
        console.error("Available data:", data);
      }

      // 🔍 Try ALL possible name field names
      const possibleNameFields = [
        'name', 'username', 'doctorName', 'fullName', 'full_name',
        'doctor_name', 'userName', 'user_name', 'displayName'
      ];
      
      let foundName = null;
      for (const field of possibleNameFields) {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
          foundName = data[field];
          console.log(`✅ Found name in field "${field}":`, foundName);
          
          // If it's an object (like data.user), try to extract name from it
          if (typeof foundName === 'object' && foundName !== null) {
            const nestedName = foundName.name || foundName.username || foundName.fullName;
            if (nestedName !== undefined && nestedName !== null && nestedName !== '') {
              console.log(`✅ Found nested name:`, nestedName);
              foundName = nestedName;
            }
          }
          break;
        }
      }

      if (foundName) {
        localStorage.setItem("userName", foundName);
        console.log("✅ Stored userName:", foundName);
      } else {
        console.warn("⚠️ Could not find doctor name - using default");
        localStorage.setItem("userName", "Doctor");
      }

      // Store user object for compatibility
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: foundName || data.username || "Doctor",
          role: "doctor",
        })
      );

      console.log("===========================================");
      console.log("✅ FINAL LOCALSTORAGE VALUES:");
      console.log("Token:", localStorage.getItem("token")?.substring(0, 30) + "...");
      console.log("User ID:", localStorage.getItem("userId"));
      console.log("User Name:", localStorage.getItem("userName"));
      console.log("User Role:", localStorage.getItem("userRole"));
      console.log("===========================================");

      navigate("/DocDashboard");
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp.trim()) {
      setError("Please enter the OTP sent to your email");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ loginSessionId, otp }),
      });

      if (!response.ok) {
        let errorMessage = "Invalid or expired OTP";
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {}
        setError(errorMessage);
        setLoading(false);
        return;
      }

      const data = await response.json();

      // 🔍 DIAGNOSTIC: Log the entire API response
      console.log("===========================================");
      console.log("🔍 FULL API RESPONSE FROM OTP VERIFICATION:");
      console.log(JSON.stringify(data, null, 2));
      console.log("===========================================");
      console.log("Available fields:", Object.keys(data));
      console.log("===========================================");

      // Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "DOCTOR");

      // 🔍 Try ALL possible ID field names
      const possibleIdFields = [
        'doctorId', 'id', 'userId', 'user_id', 'doctor_id', 
        'user', 'doctorID', 'userID', 'ID', 'Id'
      ];
      
      let foundId = null;
      for (const field of possibleIdFields) {
        if (data[field] !== undefined && data[field] !== null) {
          foundId = data[field];
          console.log(`✅ Found ID in field "${field}":`, foundId);
          
          // If it's an object (like data.user), try to extract ID from it
          if (typeof foundId === 'object' && foundId !== null) {
            const nestedId = foundId.id || foundId.doctorId || foundId.userId;
            if (nestedId !== undefined && nestedId !== null) {
              console.log(`✅ Found nested ID:`, nestedId);
              foundId = nestedId;
            }
          }
          break;
        }
      }

      if (foundId) {
        localStorage.setItem("userId", foundId.toString());
        console.log("✅ Stored userId:", foundId);
      } else {
        console.error("❌ Could not find doctor ID in any known field!");
        console.error("Available data:", data);
      }

      // 🔍 Try ALL possible name field names
      const possibleNameFields = [
        'name', 'username', 'doctorName', 'fullName', 'full_name',
        'doctor_name', 'userName', 'user_name', 'displayName'
      ];
      
      let foundName = null;
      for (const field of possibleNameFields) {
        if (data[field] !== undefined && data[field] !== null && data[field] !== '') {
          foundName = data[field];
          console.log(`✅ Found name in field "${field}":`, foundName);
          
          // If it's an object (like data.user), try to extract name from it
          if (typeof foundName === 'object' && foundName !== null) {
            const nestedName = foundName.name || foundName.username || foundName.fullName;
            if (nestedName !== undefined && nestedName !== null && nestedName !== '') {
              console.log(`✅ Found nested name:`, nestedName);
              foundName = nestedName;
            }
          }
          break;
        }
      }

      if (foundName) {
        localStorage.setItem("userName", foundName);
        console.log("✅ Stored userName:", foundName);
      } else {
        console.warn("⚠️ Could not find doctor name - using default");
        localStorage.setItem("userName", "Doctor");
      }

      // Store user object for compatibility
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: foundName || data.username || "Doctor",
          role: "doctor",
        })
      );

      console.log("===========================================");
      console.log("✅ FINAL LOCALSTORAGE VALUES:");
      console.log("Token:", localStorage.getItem("token")?.substring(0, 30) + "...");
      console.log("User ID:", localStorage.getItem("userId"));
      console.log("User Name:", localStorage.getItem("userName"));
      console.log("User Role:", localStorage.getItem("userRole"));
      console.log("===========================================");

      navigate("/DocDashboard");
    } catch (err) {
      console.error("❌ OTP verification error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F8FBFF] to-[#EEF6FF] flex items-center justify-center px-4">
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 items-center">

        {/* === LEFT SECTION === */}
        <div className="flex flex-col items-center lg:items-start gap-6">

          {/* HOME BUTTON */}
          <button
            onClick={() => navigate("/")}
            className="relative w-[120px] h-[42px] rounded-full 
            bg-gradient-to-r from-[#057EF8] to-[#0DC0BD]
            flex items-center justify-center pl-9
            hover:scale-105 transition-all shadow-md"
          >
            <img
              src={gtMark}
              alt="Home"
              className="absolute left-1 top-1 w-[34px] h-[34px] rounded-full"
            />
            <span className="text-white font-semibold">HOME</span>
          </button>

          {/* ICON */}
          <div className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-3xl 
          bg-gradient-to-tr from-[#0DC0BD] to-[#057EF8] 
          shadow-xl flex items-center justify-center">
            <img src={heart} alt="Heart" className="w-[100px] sm:w-[130px]" />
          </div>

          {/* TEXT */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-light text-gray-800">
              WELCOME!
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {/* ROLE CARD */}
          <div className="w-full max-w-[420px] bg-[#E9FCF9] rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-[64px] h-[64px] rounded-full bg-[#00A696] flex items-center justify-center shadow-md">
                <img src={doctor} alt="Doctor" className="w-[34px] filter invert" />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-800">Doctor</p>
                <p className="text-sm text-gray-600">
                  Monitor patients and manage care
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* === DIVIDER === */}
        <div className="hidden lg:flex justify-center">
          <div className="w-[1px] h-[70vh] bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
        </div>

        {/* === RIGHT SECTION === */}
        <div className="flex justify-center items-center">
          <form
            onSubmit={step === "OTP" ? handleVerifyOtp : handleLogin}
            className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl p-8 sm:p-10"
          >
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-600 mb-8">
              {step === "OTP"
                ? "Enter the verification code we sent to your email"
                : "Enter your credentials to continue"}
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {step !== "OTP" ? (
              <>
                <label className="font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] mt-2 mb-5 px-4 rounded-xl border focus:border-[#057EF8] outline-none"
                />

                <label className="font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] mt-2 mb-2 px-4 rounded-xl border focus:border-[#057EF8] outline-none"
                />
              </>
            ) : (
              <>
                <label className="font-semibold text-gray-700">OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full h-[52px] mt-2 mb-2 px-4 rounded-xl border focus:border-[#057EF8] outline-none"
                />

                <div className="mb-4 text-right">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("CREDENTIALS");
                      setOtp("");
                      setLoginSessionId("");
                    }}
                    className="text-sm text-[#057EF8] hover:text-[#0DC0BD] hover:underline transition"
                  >
                    Back to login
                  </button>
                </div>
              </>
            )}

            {/* Forgot Password Link */}
            {step !== "OTP" && (
              <div className="mb-6 text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password?role=DOCTOR")}
                  className="text-sm text-[#057EF8] hover:text-[#0DC0BD] hover:underline transition"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#057EF8] to-[#0DC0BD]
              text-white font-semibold text-lg hover:scale-105 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : step === "OTP" ? "Verify OTP" : "Log In"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}