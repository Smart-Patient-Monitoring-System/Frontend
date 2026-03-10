import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Settings,
  Activity,
  Users,
  UserCircle,
  TrendingUp,
} from "lucide-react";
import admin from "../../assets/images/admin.png";
import UserManagement from "../../pages/AdminPages/UserManagement";
import PatientManagement from "../../pages/AdminPages/PatientManagement";
import PendingDoctors from "../../pages/AdminPages/PendingDoctors";
import AdminManagement from "../../pages/AdminPages/AdminManagement";
import IotDevices from "../../pages/AdminPages/IotDevices";
import Analytics from "../../pages/AdminPages/Analytics";
import SecurityLogs from "../../pages/AdminPages/SecurityLogs";
import SpecialDoctorAdminPage from "../PatientPortal/bookings/SpecialDoctorAdminPage";

function AdminDashboard() {
  const [hasNotification, setHasNotification] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate to homepage
    navigate("/");
  };
  const [activeTab, setActiveTab] = useState("users");
  const [doctorCount, setDoctorCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);


  return (
    <div className="min-h-screen bg-[#F0F6FF] transition-colors">
      {/* === HEADER === */}
      <header className="bg-white shadow-sm w-full">
        <div className="max-w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left */}
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
                  Welcome, <span className="font-semibold">Section 7</span>{" "}
                  Janith
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">

              {/* Logout */}
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

      {/* ================= STATS CARDS ================= */}
        <div className="px-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Active Doctors */}
          <div className="bg-[#E9FBF6] rounded-2xl p-5 shadow-md flex justify-between items-center">
            
            <div>
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center mb-3">
                <UserCircle className="text-white w-5 h-5" />
              </div>
              <p className="text-sm text-gray-600">Active Doctors</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">24</h2>
          </div>

          {/* Active Patients */}
          <div className="bg-[#F5F0FF] rounded-2xl p-5 shadow-md flex justify-between items-center">
            
            <div>
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                <Activity className="text-white w-5 h-5" />
              </div>
              <p className="text-sm text-gray-600">Active Patients</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">48</h2>
          </div>

          {/* IoT Devices */}
          <div className="bg-[#E9FBF6] rounded-2xl p-5 shadow-md flex justify-between items-center">
            
            <div>
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <p className="text-sm text-gray-600">IOT Devices</p>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">23</h2>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM NAVIGATION ================= */}
      <div className="px-6 mt-8">
        <div className="bg-white rounded-3xl shadow-md p-2 flex gap-3 w-fit">

                  

          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${
                activeTab === "users"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            style={
              activeTab === "users"
                ? {
                    background:
                      "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)",
                  }
                : {}
            }
          >
            Doctor Management
          </button>

          <button
            onClick={() => setActiveTab("patients")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${
                activeTab === "patients"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            style={
              activeTab === "patients"
                ? {
                    background:
                      "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)",
                  }
                : {}
            }
          >
            Patient Management
          </button>

          <button
            onClick={() => setActiveTab("iot")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${
                activeTab === "iot"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            style={
              activeTab === "iot"
                ? {
                    background:
                      "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)",
                  }
                : {}
            }
          >
            IOT Devices
          </button>

          <button
            onClick={() => setActiveTab("accept")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${activeTab === "accept"
                ? "text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"}`}
            style={
              activeTab === "accept"
                ? {
                    background: "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)"
                  }
                : {}
            }
          >
            Pending Doctors
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${
                activeTab === "analytics"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            style={
              activeTab === "analytics"
                ? {
                    background:
                      "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)",
                  }
                : {}
            }
          >
            Analytics
          </button>

          <button
            onClick={() => setActiveTab("admins")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${
                activeTab === "admins"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            style={
              activeTab === "admins"
                ? {
                    background: "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)"
                  }
                : {}
            }
          >
            Admin Management
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-2 rounded-3xl text-sm font-medium transition-all
              ${
                activeTab === "logs"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            style={
              activeTab === "logs"
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
      <div className="px-6 mt-6">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "accept" && <PendingDoctors />}
        {activeTab === "patients" && <PatientManagement />}
        {activeTab === "admins" && <AdminManagement />}
        {activeTab === "iot" && <IotDevices />}
        {activeTab === "analytics" && <Analytics />}
        {activeTab === "logs" && <SecurityLogs />}
        {activeTab === "booking" && <SpecialDoctorAdminPage />}
      </div>
    </div>
  );
}

export default AdminDashboard;
