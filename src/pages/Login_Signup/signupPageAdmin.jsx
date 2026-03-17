import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";
import gtMark from "../../assets/images/gtMark.png";
import heart from "../../assets/images/heart.png";
import admin from "../../assets/images/admin.png";

export default function SignupPageAdmin() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !username || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          username,
          password,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = text;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || text;
        } catch (e) {
          // Use text as is
        }
        setError(errorMessage || "Failed to create admin account");
        setLoading(false);
        return;
      }

      // After successful signup, redirect to admin login
      navigate("/adminLogin");
    } catch (e) {
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
              bg-gradient-to-tr from-[#A538FF] to-[#C066FF] 
              shadow-xl flex items-center justify-center">
              <img src={admin} alt="Admin" className="w-[70px] filter invert" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Create Admin Account
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Register a new administrator
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup}>
            <label className="font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-[52px] mt-2 mb-5 px-4 rounded-xl border focus:border-[#A538FF] outline-none"
            />

            <label className="font-semibold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-[52px] mt-2 mb-5 px-4 rounded-xl border focus:border-[#A538FF] outline-none"
            />

            <label className="font-semibold text-gray-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full h-[52px] mt-2 mb-5 px-4 rounded-xl border focus:border-[#A538FF] outline-none"
            />

            <label className="font-semibold text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Enter password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full h-[52px] mt-2 mb-5 px-4 rounded-xl border focus:border-[#A538FF] outline-none"
            />

            <label className="font-semibold text-gray-700">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-[52px] mt-2 mb-5 px-4 rounded-xl border focus:border-[#A538FF] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[56px] rounded-full bg-gradient-to-r from-[#A538FF] to-[#C066FF]
                text-white font-semibold text-lg hover:scale-105 transition
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Admin Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/adminAccess")}
              className="text-sm text-[#A538FF] hover:text-[#C066FF] hover:underline"
            >
              Back to Admin Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
