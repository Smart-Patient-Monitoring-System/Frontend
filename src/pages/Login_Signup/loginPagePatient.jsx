import React, { useState } from "react";
import axios from "axios";
import gtMark from "../../assets/images/gtMark.png";
import heart from "../../assets/images/heart.png";
import patient from "../../assets/images/patient.png";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

export default function LoginPagePatient() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validate inputs
        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                username: username.trim(),
                password: password.trim(),
            });

            // Store token and user data
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // Check if user role is patient
            if (response.data.user.role === "patient") {
                navigate("/patient-portal");
            } else {
                setError("Access denied. This is for patients only.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message || 
                "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="w-full min-h-screen bg-[#F8FBFF] flex justify-center items-center p-4">
            <div className="w-full max-w-[1800px] grid grid-cols-1 lg:grid-cols-2 gap-10">

                <div className="flex flex-col items-center lg:items-start gap-10 p-4">

                    <button
  onClick={() => navigate("/")}
  className="relative w-[140px] h-[48px] sm:w-[160px] sm:h-[51px] rounded-full 
  bg-gradient-to-r from-[#057EF8] to-[#0DC0BD] flex items-center justify-center pl-10
  scale-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
>
  <img
    src={gtMark}
    alt="gt mark"
    className="absolute left-0 w-[45px] h-[45px]"
  />
  <span className="text-white font-medium text-lg sm:text-2xl">
    HOME
  </span>
</button>

                    <div className="w-[150px] h-[150px] sm:w-[215px] sm:h-[205px] rounded-3xl bg-gradient-to-tr from-[#0DC0BD] to-[#057EF8] shadow-[0_0_8px_8px_#0090EE40] flex justify-center items-center">
                        <img src={heart} alt="heart" className="w-[120px] sm:w-[162px]" />
                    </div>

                    <div className="text-center lg:text-left">
                        <p className="text-4xl sm:text-6xl font-extralight">WELCOME!</p>
                        <p className="text-xl sm:text-3xl font-extralight mt-2">
                            Sign in to access your dashboard
                        </p>
                    </div>

                    <div className="w-full max-w-[520px] bg-[#EBF3FE] rounded-3xl shadow-xl p-6 relative">
                        <div className="flex items-center gap-6">
                            <div className="w-[85px] h-[85px] rounded-full bg-[#2273FF] shadow-[0_0_20px_rgba(0,0,0,0.25)] flex items-center justify-center">
                                <img src={patient} alt="Patient" className="w-[45px] h-[45px]" />
                            </div>
                            <div>
                                <p className="text-3xl font-medium text-center md:text-left">Patient</p>
                                <p className="text-lg font-light">
                                    System management and analytics
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => navigate("/patientSignup")} className="w-full max-w-[520px] h-[50px] bg-[#F5F1F1] rounded-2xl shadow-md flex items-center justify-center
      scale-100 hover:scale-105 transition-transform duration-300 cursor-pointer p-0 border-none">
                        <span className="text-xl font-semibold">SignUp</span>
                    </button>
                </div>

                <hr
                    className="
    hidden
    lg:block
    absolute left-1/2 top-1/2 
    w-[1102px] 
    border-t border-black 
    rotate-90 
    -translate-x-1/2 -translate-y-1/2
  "
                />

                <div className="flex justify-center p-4">
                    <form onSubmit={handleLogin} className="w-full max-w-[650px] bg-white rounded-[40px] shadow-2xl p-8 sm:p-10">
                        <h1 className="text-3xl sm:text-4xl font-normal mb-3 text-left">Login</h1>
                        <p className="text-lg font-light mb-20 text-left">
                            Enter your credentials to continue
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <label className="text-xl font-medium text-left block">
                            User Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-[60px] bg-[#F3F3F5] border border-[#7D7D7D] rounded-xl px-4 mt-2 mb-10 outline-none"
                            required
                            disabled={loading}
                        />

                        <label className="text-xl font-medium text-left block">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-[60px] bg-[#F3F3F5] border border-[#7D7D7D] rounded-xl px-4 mt-2 mb-10 outline-none"
                            required
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-[65px] rounded-full bg-gradient-to-r from-[#057EF8] to-[#0DC0BD] 
                            flex items-center justify-center 
                            scale-100 hover:scale-105 
                            transition-transform duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="text-white text-xl font-medium">
                                {loading ? "Logging in..." : "Log In"}
                            </span>
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}
