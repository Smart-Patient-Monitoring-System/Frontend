import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sup from "../../assets/images/sup.jpg";
import FormRow from "../../components/signup/FormRow";
import { API_BASE_URL } from "../../api";

export default function SignupPageDoctor() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [nicNo, setNicNo] = useState("");
  const [gender, setGender] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [doctorRegNo, setDoctorRegNo] = useState("");
  const [position, setPosition] = useState("");
  const [hospital, setHospital] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");

    if (!name || !email || !username || !password || !confirmPassword || !doctorRegNo ||
        !dateOfBirth || !address || !nicNo || !gender || !contactNo || 
        !position || !hospital) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctor/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dateOfBirth,
          address,
          email,
          nicNo,
          gender,
          contactNo,
          doctorRegNo,
          position,
          hospital,
          username,
          password,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Signup failed");
        setLoading(false);
        return;
      }

      // After successful signup, send doctor to login page
      navigate("/doctorLogin");
    } catch (e) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundImage: `url(${sup})` }}
    >
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1600px] flex flex-col lg:flex-row gap-6 items-stretch">

        {/* LEFT CARD */}
        <div className="
          w-full lg:w-1/2
          h-full
          bg-white/20 backdrop-blur-xl
          border border-white/30
          shadow-[0_8px_40px_rgba(0,0,0,0.25)]
          rounded-[36px] lg:rounded-[56px]
          p-6 sm:p-8 md:p-10
          flex flex-col
        ">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-8 tracking-wide text-white">
            Doctor’s Sign Up
          </h1>

          <div className="flex flex-col gap-5 w-full">
            <FormRow label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <FormRow label="Date of Birth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
            <FormRow label="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <FormRow label="E-Mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <FormRow label="NIC No" value={nicNo} onChange={(e) => setNicNo(e.target.value)} required />

            {/* Gender */}
            <FormRow label="Gender">
              <div className="flex items-center gap-6 h-11">
                <label className="flex items-center gap-2 text-white/80">
                  <input
                    type="radio"
                    name="gender"
                    className="accent-[#00BAC5]"
                    checked={gender === "MALE"}
                    onChange={() => setGender("MALE")}
                    required
                  />
                  Male
                </label>
                <label className="flex items-center gap-2 text-white/80">
                  <input
                    type="radio"
                    name="gender"
                    className="accent-[#00BAC5]"
                    checked={gender === "FEMALE"}
                    onChange={() => setGender("FEMALE")}
                    required
                  />
                  Female
                </label>
              </div>
            </FormRow>

            <FormRow label="Contact No" value={contactNo} onChange={(e) => setContactNo(e.target.value)} required />
            
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="
          w-full lg:w-1/2
          h-full
          bg-white/20 backdrop-blur-xl
          border border-white/30
          shadow-[0_8px_40px_rgba(0,0,0,0.25)]
          rounded-[36px] lg:rounded-[56px]
          p-6 sm:p-8 md:p-10
          flex flex-col justify-between
        ">
          {/* Form content */}
          <div className="flex flex-col gap-5">
            <FormRow label="Doctor’s ID" value={doctorRegNo} onChange={(e) => setDoctorRegNo(e.target.value)} required />
            <FormRow label="Doctor’s Position" value={position} onChange={(e) => setPosition(e.target.value)} required />
            <FormRow label="Hospital" value={hospital} onChange={(e) => setHospital(e.target.value)} required />
            <FormRow label="User Name" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <FormRow label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <FormRow label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            
          </div>

          {/* Actions */}
          <div className="flex flex-col items-center mt-6 gap-4">
            {error && (
              <div className="mb-2 w-full text-center text-red-200 text-sm">
                {error}
              </div>
            )}
            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="
              w-full sm:w-2/3 lg:w-[260px]
              h-12 sm:h-[58px]
              bg-gradient-to-r from-[#0090EE] to-[#00BAC5]
              rounded-full shadow-lg
              transition-all duration-300
              hover:scale-[1.04] hover:shadow-xl
              text-white text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed
            "
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-sm text-white/80">
              Already have an account?{" "}
              <Link
                to="/doctorLogin"
                className="text-[#7DDFFF] font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
