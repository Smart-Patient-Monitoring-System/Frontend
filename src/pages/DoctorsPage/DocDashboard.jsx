import React, { useState, useEffect, useMemo } from "react";
import CriticalAlertPage from "./CriticalAlertPage";
import ECGReaderPage from "./ECGReaderPage";

import DoctorMessagesPanel from "../../pages/DoctorViewPatient/DoctorViewComponents/DoctorMessagingDashboard"; 


import { useNavigate } from "react-router-dom";
import {
  Heart,
  Bell,
  Settings,
  Activity,
  AlertTriangle,
  FileText,
  Search,
  Eye,
  Users,
  AlertCircle,
  TrendingUp,
  Wifi,
  MessageSquare, // NEW ICON for Messaging
} from "lucide-react";

/* ===================== Config ===================== */
const API_BASE = import.meta.env.VITE_API_URL; 

/* ===================== Helpers ===================== */
const toTitle = (s = "") =>
  s
    .toLowerCase()
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const guessFirstNameFromEmail = (email = "") => {
  if (!email || !email.includes("@")) return "Doctor";
  const username = email.split("@")[0];
  const first = username.split(/[._\-]/)[0];
  return toTitle(first) || "Doctor";
};

const calcAge = (dobString) => {
  // dobString: "YYYY-MM-DD"
  const dob = new Date(dobString);
  if (Number.isNaN(dob.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

/* ===================== JWT Helper ===================== */
const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
    return {
      role: payload.role,
      email: payload.sub,
    };
  } catch (e) {
    console.log("Invalid token", e);
    return null;
  }
};

/* ===================== API: Doctor name from backend ===================== */
const fetchDoctorNameByEmail = async (doctorEmail) => {
  const token = localStorage.getItem("token");
  if (!token || !doctorEmail) return null;

  // you currently use /api/doctor/get which returns List<DoctorDTO>
  const res = await fetch(`${API_BASE}/api/doctor/get`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;

  const doctors = await res.json();
  if (!Array.isArray(doctors)) return null;

  const me = doctors.find(
    (d) => (d?.email || "").toLowerCase() === doctorEmail.toLowerCase()
  );

  return me?.name || null;
};

/* ===================== API: My patients ===================== */
const fetchMyPatients = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/api/doctor/patients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load patients");
  return res.json(); // List<Patient>
};

function DocDashboard() {
  const [hasNotification, setHasNotification] = useState(true);
  const [activeTab, setActiveTab] = useState("patient-overview");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Doctor Info (Header)
  const [doctorInfo, setDoctorInfo] = useState({
    name: "Doctor",
    role: "",
  });

  // Patients (from backend)
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [patientsError, setPatientsError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      const user = getUserFromToken();
      if (!user) return;

      const dbName = await fetchDoctorNameByEmail(user.email);

      setDoctorInfo({
        name: dbName ? toTitle(dbName) : guessFirstNameFromEmail(user.email),
        role: user.role || "",
      });
    };

    loadDoctor();
  }, []);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setPatientsError("");
        setLoadingPatients(true);

        const data = await fetchMyPatients();

        // Map backend Patient -> UI row format
        const mapped = (Array.isArray(data) ? data : []).map((p) => {
          const ageNum = p?.dateOfBirth ? calcAge(p.dateOfBirth) : "";
          return {
            // backend
            rawId: p?.id,
            name: p?.name || "Unknown",
            id: p?.id ? `P-${p.id}` : "-", // display id
            age: ageNum ? `${ageNum}y` : "-",

            // hospital/location you DO have
            hospital: p?.hospital || "-",
            city: p?.city || "-",
            district: p?.district || "-",

            // placeholders until vitals table exists
            room: "-",
            heartRate: "-",
            temp: "-",
            spO2: "-",
            riskLevel: "Low",
            status: "stable",
          };
        });

        setPatients(mapped);
      } catch (e) {
        console.log(e);
        setPatientsError("Could not load patients");
      } finally {
        setLoadingPatients(false);
      }
    };

    loadPatients();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Optional: filter patients by searchQuery (name or id)
  const filteredPatients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.id || "").toLowerCase().includes(q)
    );
  }, [patients, searchQuery]);

  // Stats boxes (you can compute total from backend later)
  const statsData = [
    {
      title: "Total Patients",
      value: String(patients.length),
      icon: <Users className="w-6 h-6" />,
      color: "#ffffffff",
      bgColor: "#1A65FE",
    },
    {
      title: "Critical Alerts",
      value: "2",
      icon: <AlertCircle className="w-6 h-6" />,
      color: "#ffffffff",
      bgColor: "#F41D2A",
    },
    {
      title: "IoT Devices",
      value: "48",
      icon: <Wifi className="w-6 h-6" />,
      color: "#ffffffff",
      bgColor: "#00AD42",
    },
    {
      title: "Avg Health Score",
      value: "87",
      suffix: "%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "#ffffffff",
      bgColor: "#00AC9B",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F6FF] transition-colors">
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="max-w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div
                className="rounded-lg p-2 sm:p-2.5 shadow-xl"
                style={{
                  background: "linear-gradient(45deg, #00BAC5 0%, #0090EE 100%)",
                }}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>

              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-left">
                  Doctor Portal
                </h1>

                <p className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  Welcome, <span className="font-semibold">Dr. {doctorInfo.name}</span>
                  {doctorInfo.role ? (
                    <span className="ml-2 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {doctorInfo.role}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Notifications"
                onClick={() => setHasNotification(false)}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                {hasNotification && (
                  <span className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full" />
                )}
              </button>

              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
              </button>

              <button
                onClick={handleLogout}
                className="rounded-lg px-4 py-2 shadow-xl text-white font-medium"
                style={{
                  background: "linear-gradient(45deg, #BE1111 0%, #260303 100%)",
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="bg-white shadow-lg w-64 border-r border-gray-200 flex flex-col h-[calc(100vh-80px)] sticky top-0">
          <div className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("patient-overview")}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                  activeTab === "patient-overview"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Patient Overview</span>
              </button>

              <button
                onClick={() => setActiveTab("ecg-reader")}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                  activeTab === "ecg-reader"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="font-medium">ECG Reader</span>
              </button>

              <button
                onClick={() => setActiveTab("critical-alerts")}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                  activeTab === "critical-alerts"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Critical Alerts</span>
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  2
                </span>
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                  activeTab === "reports"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Reports</span>
              </button>

              {/*  UPDATED: Messaging button + icon */}
              <button
                onClick={() => setActiveTab("messaging")}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                  activeTab === "messaging"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">Messaging</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assigned</span>
                  <span className="text-lg font-bold text-gray-800">
                    {patients.length}
                  </span>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Critical</span>
                  <span className="text-lg font-bold text-red-600">—</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stable</span>
                  <span className="text-lg font-bold text-green-600">—</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-80px)] bg-[#F0F6FF]">
          {(activeTab === "patient-overview" || activeTab === "reports") && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Patients by Name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-3xl shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === "patient-overview" && (
            <>
              {/* Stats */}
              <div className="mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {statsData.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-500 font-medium mb-1">
                            {stat.title}
                          </p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-800">
                              {stat.value}
                            </span>
                            {stat.suffix && (
                              <span className="text-sm text-gray-500 font-medium">
                                {stat.suffix}
                              </span>
                            )}
                          </div>
                        </div>
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: stat.bgColor }}
                        >
                          <div style={{ color: stat.color }}>{stat.icon}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Patient Overview</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Assigned patients list (vitals will show once IoT data is connected)
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Hospital
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          City
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          District
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Blood Type
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {loadingPatients && (
                        <tr>
                          <td className="py-4 px-4 text-sm text-gray-600" colSpan={6}>
                            Loading patients...
                          </td>
                        </tr>
                      )}

                      {patientsError && (
                        <tr>
                          <td className="py-4 px-4 text-sm text-red-600" colSpan={6}>
                            {patientsError}
                          </td>
                        </tr>
                      )}

                      {!loadingPatients && !patientsError && filteredPatients.length === 0 && (
                        <tr>
                          <td className="py-4 px-4 text-sm text-gray-600" colSpan={6}>
                            No patients assigned to you yet.
                          </td>
                        </tr>
                      )}

                      {filteredPatients.map((patient, index) => (
                        <tr key={patient.rawId ?? index} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{patient.name}</div>
                              <div className="text-sm text-gray-500">
                                {patient.id} - {patient.age}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-gray-700">{patient.hospital}</td>
                          <td className="py-4 px-4 text-gray-700">{patient.city}</td>
                          <td className="py-4 px-4 text-gray-700">{patient.district}</td>
                          <td className="py-4 px-4 text-gray-700">{patient.bloodType || "-"}</td>

                          <td className="py-4 px-4">
                            <button
  className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
  onClick={() => {
    // save for refresh-safety
    localStorage.setItem("profilePatientId", String(patient.rawId || ""));
    localStorage.setItem("profilePatientName", patient.name || "");

    // navigate with state (best way)
    navigate("/DocViewPatient", {
      state: {
        patientId: patient.rawId,
        patientName: patient.name,
        returnTo: "/DocDashboard",
      },
    });
  }}
>
  <Eye className="w-4 h-4" />
  View
</button>

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "ecg-reader" && <ECGReaderPage />}
          {activeTab === "critical-alerts" && <CriticalAlertPage />}

          {/* NEW: Messaging tab renders here */}
          {activeTab === "messaging" && <DoctorMessagesPanel />}
        </main>
      </div>
    </div>
  );
}

export default DocDashboard;
