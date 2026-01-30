import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sup from "../../assets/images/sup.jpg";
import FormRow from "../../components/signup/formRow";
import { API_BASE_URL } from "../../api";

export default function SignupPagePatient() {
  const navigate = useNavigate();

  // BASIC
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(""); // ✅ added
  const [district, setDistrict] = useState(""); // ✅ added
  const [postalCode, setPostalCode] = useState(""); // ✅ added
  const [hospital, setHospital] = useState(""); // ✅ added (NOT NULL in DB)

  const [email, setEmail] = useState("");
  const [nicNo, setNicNo] = useState("");
  const [gender, setGender] = useState("");
  const [contactNo, setContactNo] = useState("");

  // GUARDIAN
  const [guardianType, setGuardianType] = useState("");
  const [guardianRelationship, setGuardianRelationship] = useState(""); // ✅ added
  const [guardianName, setGuardianName] = useState("");
  const [guardianContactNo, setGuardianContactNo] = useState("");
  const [guardianEmail, setGuardianEmail] = useState(""); // ✅ added

  // AUTH
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // MEDICAL
  const [bloodType, setBloodType] = useState("");
  const [currentAllergies, setCurrentAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [pastSurgeries, setPastSurgeries] = useState("");
  const [medicalConditions, setMedicalConditions] = useState(""); // ✅ added
  const [emergencyNotes, setEmergencyNotes] = useState(""); // ✅ added

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");

    //  include required hospital + other required fields if your backend expects them
    if (
      !name ||
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !dateOfBirth ||
      !address ||
      !city ||
      !district ||
      !postalCode ||
      !hospital ||
      !nicNo ||
      !gender ||
      !contactNo ||
      !guardianType ||
      !guardianName ||
      !guardianContactNo ||
      !bloodType
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // AUTH
          username,
          password,
          role: "PATIENT",

          // BASIC
          name,
          email,
          dateOfBirth,
          nicNo,
          gender,
          contactNo,
          address,
          city,
          district,
          postalCode,
          hospital, // IMPORTANT (fixes your error)

          // GUARDIAN
          guardianType,
          guardianRelationship: guardianRelationship || guardianType, // fallback
          guardianName,
          guardianContactNo,
          guardianEmail,

          // MEDICAL
          bloodType,
          currentAllergies,
          currentMedications,
          pastSurgeries,
          medicalConditions,
          emergencyNotes,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Signup failed");
        setLoading(false);
        return;
      }

      navigate("/patientLogin");
    } catch (e) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const guardianLabel =
    guardianType === "SPOUSE"
      ? "Spouse Name"
      : guardianType === "PARENT"
      ? "Parent Name"
      : guardianType === "CHILD"
      ? "Child Name"
      : "Guardian’s Name";

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundImage: `url(${sup})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>

      <div className="relative z-10 w-full max-w-[1600px] flex flex-col lg:flex-row gap-6 items-stretch">
        {/* LEFT CARD */}
        <div className="w-full lg:w-1/2 h-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.25)] rounded-[36px] lg:rounded-[56px] p-6 sm:p-8 md:p-10 flex flex-col">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light mb-8 tracking-wide text-white">
            Patient’s Sign Up
          </h1>

          <div className="flex flex-col gap-5 w-full">
            <FormRow label="Name" value={name} onChange={(e) => setName(e.target.value)} required />

            <FormRow
              label="Date of Birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />

            <FormRow label="E-Mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <FormRow label="NIC No" value={nicNo} onChange={(e) => setNicNo(e.target.value)} required />

            <FormRow label="Contact No" type="tel" value={contactNo} onChange={(e) => setContactNo(e.target.value)} required />

            <FormRow label="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />

            {/*  Added */}
            <FormRow label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
            <FormRow label="District" value={district} onChange={(e) => setDistrict(e.target.value)} required />
            <FormRow label="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
            <FormRow label="Hospital" value={hospital} onChange={(e) => setHospital(e.target.value)} required />

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

            <FormRow label="Current Allergies">
              <textarea
                value={currentAllergies}
                onChange={(e) => setCurrentAllergies(e.target.value)}
                rows={2}
                className="w-full bg-white/35 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/40 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAC5]/50"
              />
            </FormRow>

            <FormRow label="Current Medications">
              <textarea
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                rows={2}
                className="w-full bg-white/35 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/40 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAC5]/50"
              />
            </FormRow>

            <FormRow label="Past Surgeries">
              <textarea
                value={pastSurgeries}
                onChange={(e) => setPastSurgeries(e.target.value)}
                rows={2}
                className="w-full bg-white/35 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/40 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAC5]/50"
              />
            </FormRow>

            {/* ✅ Added */}
            <FormRow label="Medical Conditions">
              <textarea
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                rows={2}
                className="w-full bg-white/35 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/40 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAC5]/50"
              />
            </FormRow>

            <FormRow label="Emergency Notes">
              <textarea
                value={emergencyNotes}
                onChange={(e) => setEmergencyNotes(e.target.value)}
                rows={2}
                className="w-full bg-white/35 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/40 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAC5]/50"
              />
            </FormRow>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="w-full lg:w-1/2 h-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.25)] rounded-[36px] lg:rounded-[56px] p-6 sm:p-8 md:p-10 flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <FormRow label="Guardian Type">
              <select
                value={guardianType}
                onChange={(e) => setGuardianType(e.target.value)}
                required
                className="w-full h-11 bg-white/35 backdrop-blur-md rounded-full px-5 border border-white/40 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#00BAC5]/50"
              >
                <option value="">Select guardian type</option>
                <option value="SPOUSE">Spouse</option>
                <option value="PARENT">Parent</option>
                <option value="CHILD">Child</option>
              </select>
            </FormRow>

            {/* ✅ Added */}
            <FormRow
              label="Guardian Relationship (text)"
              value={guardianRelationship}
              onChange={(e) => setGuardianRelationship(e.target.value)}
              placeholder="e.g., Mother, Father, Spouse"
            />

            <FormRow label={guardianLabel} value={guardianName} onChange={(e) => setGuardianName(e.target.value)} required />

            <FormRow
              label="Guardian’s Contact No"
              type="tel"
              value={guardianContactNo}
              onChange={(e) => setGuardianContactNo(e.target.value)}
              required
            />

            {/*  Added */}
            <FormRow
              label="Guardian Email"
              type="email"
              value={guardianEmail}
              onChange={(e) => setGuardianEmail(e.target.value)}
            />

            <FormRow label="User Name" value={username} onChange={(e) => setUsername(e.target.value)} required />

            <FormRow label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <FormRow
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <FormRow label="Blood Type">
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                required
                className="w-full h-11 bg-white/35 backdrop-blur-md rounded-full px-5 border border-white/40 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#00BAC5]/50"
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </FormRow>
          </div>

          <div className="flex flex-col items-center mt-6 gap-4">
            {error && <div className="mb-2 w-full text-center text-red-200 text-sm">{error}</div>}

            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="w-full sm:w-2/3 lg:w-[260px] h-12 sm:h-[58px] bg-gradient-to-r from-[#0090EE] to-[#00BAC5] rounded-full shadow-lg transition-all duration-300 hover:scale-[1.04] hover:shadow-xl text-white text-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            <p className="text-sm text-white/80">
              Already have an account?{" "}
              <Link to="/patientLogin" className="text-[#7DDFFF] font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
