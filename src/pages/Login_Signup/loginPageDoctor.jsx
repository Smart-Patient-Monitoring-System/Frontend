import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";

import gtMark from "../../assets/images/gtMark.png";
import heart from "../../assets/images/heart.png";
import doctor from "../../assets/images/doctor.png";

export default function LoginPageDoctor() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      const data = await response.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.username,
          role: data.role?.toLowerCase() || "doctor",
        })
      );

      navigate("/DocDashboard");
    } catch (err) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F8FBFF] to-[#EEF6FF] flex items-center justify-center px-4">
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 items-center">

        {/* ================= LEFT SECTION ================= */}
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

          {/* SIGN UP */}
          <button
            onClick={() => navigate("/doctorSignup")}
            className="w-full max-w-[420px] h-[52px] bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <span className="font-semibold text-gray-700">Sign Up</span>
          </button>
        </div>

        {/* ================= DIVIDER ================= */}
        <div className="hidden lg:flex justify-center">
          <div className="w-[1px] h-[70vh] bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="flex justify-center items-center">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl p-8 sm:p-10"
          >
            <h2 className="text-3xl font-bold text-gray-800">Login</h2>
            <p className="text-gray-600 mb-8">
              Enter your credentials to continue
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <label className="font-semibold text-gray-700">User Name</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-[52px] mt-2 mb-5 px-4 rounded-xl border focus:border-[#057EF8] outline-none"
            />

            <label className="font-semibold text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[52px] mt-2 mb-8 px-4 rounded-xl border focus:border-[#057EF8] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#057EF8] to-[#0DC0BD]
              text-white font-semibold text-lg hover:scale-105 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
