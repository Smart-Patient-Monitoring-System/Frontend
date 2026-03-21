import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Activity,
  UserCircle,
  TrendingUp,
} from "lucide-react";
import admin from "../../assets/images/admin.png";
import UserManagement from "../../pages/AdminPages/UserManagement";
import PatientManagement from "../../pages/AdminPages/PatientManagement";
import AssignDoctors from "../../pages/AdminPages/AssignDoctors";
import AdminManagement from "../../pages/AdminPages/AdminManagement";
import IotDevices from "../../pages/AdminPages/IotDevices";
import Analytics from "../../pages/AdminPages/Analytics";
import SecurityLogs from "../../pages/AdminPages/SecurityLogs";
import SpecialDoctorAdminPage from "../PatientPortal/bookings/SpecialDoctorAdminPage";
import { API_BASE_URL } from "../../api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [doctorCount, setDoctorCount] = useState(null);
  const [patientCount, setPatientCount] = useState(null);
  const [deviceCount, setDeviceCount] = useState(null);
  const [adminData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || { name: "Admin" };
    } catch (e) {
      return { name: "Admin" };
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function loadDashboardCounts() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/dashboard/counts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard counts");
        }

        const data = await response.json();
        setDoctorCount(data?.doctorCount ?? 0);
        setPatientCount(data?.patientCount ?? 0);
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        setDoctorCount(0);
        setPatientCount(0);
      }
    }

    async function loadDeviceCount() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sensordata/devices`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch IoT devices");
        }

        const data = await response.json();
        setDeviceCount(Array.isArray(data) ? data.length : 0);
      } catch (error) {
        console.error("Error fetching IoT devices:", error);
        setDeviceCount(0);
      }
    }

    loadDashboardCounts();
    loadDeviceCount();
  }, []);

  return (
    <div className="min-h-screen bg-[#F0F6FF] transition-colors">
      <header className="bg-white shadow-sm w-full">
        <div className="max-w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="rounded-lg p-2.5 shadow-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(45deg, #00BAC5 0%, #0090EE 100%)",
                }}
              >
                <img
                  src={admin}
                  alt="Admin Logo"
                  className="w-6 h-6 object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome,{" "}
                  <span className="font-semibold">
                    {adminData.name || "..."}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="rounded-lg px-4 py-2 shadow-xl text-white font-medium"
                style={{
                  background:
                    "linear-gradient(45deg, #BE1111 0%, #260303 100%)",
                }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#E9FBF6] rounded-2xl p-5 shadow-md flex justify-between items-center">
            <div>
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mb-3">
                <UserCircle className="text-white w-5 h-5" />
              </div>
              <p className="text-sm text-gray-600">Active Doctors</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              {doctorCount ?? "..."}
            </h2>
          </div>

          <div className="bg-[#F5F0FF] rounded-2xl p-5 shadow-md flex justify-between items-center">
            <div>
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                <Activity className="text-white w-5 h-5" />
              </div>
              <p className="text-sm text-gray-600">Active Patients</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              {patientCount ?? "..."}
            </h2>
          </div>

          <div className="bg-[#E9FBF6] rounded-2xl p-5 shadow-md flex justify-between items-center">
            <div>
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <p className="text-sm text-gray-600">IOT Devices</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              {deviceCount ?? "..."}
            </h2>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <div className="bg-white rounded-3xl shadow-md p-2 flex gap-3 w-fit">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all ${
              activeTab === "users"
                ? "text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={
              activeTab === "users"
                ? { background: "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)" }
                : {}
            }
          >
            Doctor Management
          </button>

            {/*
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all ${
              activeTab === "logs"
                ? "text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={
              activeTab === "logs"
                ? { background: "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)" }
                : {}
            }
          >
            Special Doctors
          </button>   */}

          <button
            onClick={() => setActiveTab("patients")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all ${
              activeTab === "patients"
                ? "text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={
              activeTab === "patients"
                ? { background: "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)" }
                : {}
            }
          >
            Patient Management
          </button>

          <button
            onClick={() => setActiveTab("iot")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all ${
              activeTab === "iot"
                ? "text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={
              activeTab === "iot"
                ? { background: "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)" }
                : {}
            }
          >
            IOT Devices
          </button>

          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${
                activeTab === "assign"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            style={
              activeTab === "assign"
                ? { background: "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)" }
                : {}
            }
          >
            Assign Doctors
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all ${
              activeTab === "admins"
                ? "text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            style={
              activeTab === "admins"
                ? {
                    background:
                      "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)",
                  }
                : {}
            }
          >
            Admin Management
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${
                activeTab === "security"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            style={
              activeTab === "security"
                ? {
                    background:
                      "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)",
                  }
                : {}
            }
          >
            Security Logs
          </button>

          <button
            onClick={() => setActiveTab("booking")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${
                activeTab === "booking"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            style={
              activeTab === "booking"
                ? {
                    background:
                      "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)",
                  }
                : {}
            }
          >
            Booking
          </button>
        </div>
      </div>

      <div className="px-6 py-8">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "patients" && <PatientManagement />}
        {activeTab === "iot" && <IotDevices />}
        {activeTab === "assign" && <AssignDoctors />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "admins" && <AdminManagement />}
        {activeTab === "security" && <SecurityLogs />}
        {activeTab === "booking" && <SpecialDoctorAdminPage />}
      </div>
    </div>
  );
}

export default AdminDashboard;
