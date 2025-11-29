import { useState } from "react";

import Header from "../../components/PatientPortal/Header";
import PatientInfoCard from "../../components/PatientPortal/PatientInfoCard";
import AppointmentsCard from "../../components/PatientPortal/AppointmentsCard";
import ReportsCard from "../../components/PatientPortal/ReportsCard";
import HealthRiskCard from "../../components/PatientPortal/HealthRiskCard";
import EmergencyCard from "../../components/PatientPortal/EmergencyCard";
import VitalCard from "../../components/PatientPortal/VitalCard";
import GraphCard from "../../components/PatientPortal/GraphCard";
import AlertsCard from "../../components/PatientPortal/AlertsCard";
import MedicationsCard from "../../components/PatientPortal/MedicationsCard";
import ECGMonitor from "../../components/PatientPortal/ECGMonitor";
import Dashboard from "../../components/PatientPortal/Dashboard";

const PatientPortal = () => {
  const [currentTab, setCurrentTab] = useState("Overview");

  const vitals = [
    {
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "Stable",
      trend: "−",
      iconName: "heart",
      bgColor: "bg-blue-100",
      iconColor: "bg-blue-500",
      barColor: "bg-blue-500",
    },
    {
      title: "Temperature",
      value: "98.2",
      unit: "°F",
      status: "Stable",
      trend: "−",
      iconName: "thermometer",
      bgColor: "bg-orange-100",
      iconColor: "bg-orange-600",
      barColor: "bg-orange-500",
    },
    {
      title: "SPO₂",
      value: "98",
      unit: "%",
      status: "Up",
      trend: "↗",
      iconName: "droplets",
      bgColor: "bg-teal-100",
      iconColor: "bg-teal-600",
      barColor: "bg-teal-500",
    },
    {
      title: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      status: "Stable",
      trend: "−",
      iconName: "activity",
      bgColor: "bg-purple-100",
      iconColor: "bg-purple-600",
      barColor: "bg-purple-500",
    },
  ];

  return (
    <>
      {/* Full Header */}
      <Header patientName="Sarah" />

      {/* Patient Info Section */}
      <div className="w-full bg-gray-100 px-6 py-8">
        <PatientInfoCard
          name="Sarah Johnson"
          patientId="P-2024-001"
          room="Room 204-B"
          age={34}
          bloodType="A+"
          imageUrl="https://i.pravatar.cc/300?img=12"
        />
      </div>

      {/* Tabs Section */}
      <div className="min-h-screen bg-gray-100">
        <Dashboard onTabChange={setCurrentTab} />

        <div className="p-6">
          {/* ===========================
              OVERVIEW TAB CONTENT
          ============================== */}
          {currentTab === "Overview" && (
            <div className="space-y-10">

              {/* Vitals Cards */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {vitals.map((vital, index) => (
                  <VitalCard key={index} {...vital} />
                ))}
              </div>

              {/* Graphs */}
              <div className="space-y-6">
                <GraphCard />
                <ECGMonitor />
              </div>

              {/* Alerts */}
              <AlertsCard />

              {/* Health & Emergency & Appointments */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <HealthRiskCard />
                  <EmergencyCard />
                </div>

                <div className="space-y-6">
                  <AppointmentsCard />
                  <MedicationsCard />
                  <ReportsCard />
                </div>
              </div>
            </div>
          )}

          {/* ===========================
                OTHER TABS
          ============================== */}
          {currentTab === "Vitals History" && <div>Vitals History Content here…</div>}
          {currentTab === "ECG Readings" && <div>ECG Readings Content here…</div>}
          {currentTab === "Profile" && <div>Profile Content here…</div>}
        </div>
      </div>
    </>
  );
};

export default PatientPortal;
