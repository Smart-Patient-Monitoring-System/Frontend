import { useState } from "react";

import Header from "../../components/PatientPortal/Header";
import PatientInfoCard from "../../components/PatientPortal/PatientInfoCard";
import AppointmentsCard from "../../components/PatientPortal/AppointmentsCard";
import ReportsCard from "../../components/PatientPortal/ReportsCard";
import HealthRiskCard from "../../components/PatientPortal/HealthRiskCard";
import EmergencyCard from "../../components/PatientPortal/EmergencyCard";
import VitalCard from "../../components/PatientPortal/VitalCard";
import GraphCard from "../../components/PatientPortal/GraphCard";
import MedicationsCard from "../../components/PatientPortal/MedicationsCard";
import ECGMonitor from "../../components/PatientPortal/ECGMonitor";
import Dashboard from "../../components/PatientPortal/Dashboard";
import ManualEntryForm from "../../components/PatientPortal/ManualEntryForm";
import BookingPage from "../../components/PatientPortal/bookings/BookingPage";
import EmergencyPanel from "../../components/PatientPortal/EmergencyPanel";
import MessagingDashboard from "../../components/PatientPortal/MessagingDashboard";
import FloatingChatbot from "../../components/PatientPortal/FloatingChatbot";
import ProfileTab from "../../components/PatientPortal/ProfileTab";
import HealthTipsCard from "../../components/PatientPortal/HealthTipsCard";
import RealtimeGraphs from "../../components/PatientPortal/RealtimeGraphs";
import HealthDataTab from "../../components/PatientPortal/HealthDataTab";

const PatientPortal = () => {
  const [currentTab, setCurrentTab] = useState("Overview");
  const [showManualEntry, setShowManualEntry] = useState(false);

  const patientId = localStorage.getItem("patientId");

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
      {/* Header */}
      <Header patientName="Sarah" />

      {/* Patient Info - Responsive padding */}
      <div className="w-full bg-gray-100 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <PatientInfoCard
          name="Sarah Johnson"
          patientId="P-2024-001"
          room="Room 204-B"
          age={34}
          bloodType="A+"
          imageUrl="https://i.pravatar.cc/300?img=12"
        />
      </div>

      {/* Dashboard (Tabs + Manual Entry Button) */}
      <div className="min-h-screen bg-gray-100">
        <Dashboard
          onTabChange={(tab) => {
            if (tab === "manual-entry") {
              setShowManualEntry(true);
            } else {
              setCurrentTab(tab);
            }
          }}
        />

        {/* Manual Entry Form */}
        {showManualEntry && (
          <ManualEntryForm onClose={() => setShowManualEntry(false)} />
        )}

        {/* Main Content - Responsive padding */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-6">
          {/* Overview Tab */}
          {currentTab === "Overview" && (
            <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
              {/* Vitals - Responsive grid 
                  Mobile: 1 column
                  Small mobile (>480px): 2 columns
                  Tablet: 2 columns
                  Laptop+: 4 columns
              */}
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {vitals.map((vital, index) => (
                  <VitalCard key={index} {...vital} />
                ))}
              </div>

              {/* Graph + Health Risk 
                  Mobile/Tablet: Stack vertically
                  Laptop+: 2:1 ratio
              */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                <div className="lg:col-span-2">
                  <GraphCard />
                </div>
                <div>
                  <HealthRiskCard />
                </div>
              </div>

              {/* ECG + Health Tips 
                  Mobile/Tablet: Stack vertically
                  Laptop+: 2:1 ratio
              */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                <div className="lg:col-span-2">
                  <ECGMonitor />
                </div>
                <div>
                  <HealthTipsCard />
                </div>
              </div>

              {/* Appointments + Emergency AND Medications + Reports 
                  Mobile: All stack vertically
                  Tablet+: 2 columns
              */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {/* Column 1 — Appointments + Reports */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <AppointmentsCard />
                  <ReportsCard  patientId={patientId}/>
                </div>

                {/* Column 2 — Medications + Emergency */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <MedicationsCard />
                  <EmergencyCard />
                </div>
              </div>
            </div>
          )}

          {/* Vitals History */}
          {currentTab === "Real-Time Vitals" && <RealtimeGraphs />}

          {/* Full-page ECG */}
          {currentTab === "ECG Readings" && <ECGMonitor isFullPage={true} />}

          {/* Profile */}
          {currentTab === "Profile" && <ProfileTab />}

          {/* Bookings */}
          {currentTab === "Bookings" && <BookingPage />}

          {/* Emergency Panel */}
          {currentTab === "Emergency Panel" && <EmergencyPanel />}

          {/* Messaging */}
          {currentTab === "Messaging" && <MessagingDashboard />}

          {/* Medical Records */}
          {currentTab === "Medical Records" && (
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <ReportsCard  patientId={patientId}/>
            </div>
          )}

          {/* Health Data */}
          {currentTab === "Health Data from smart watch" && <HealthDataTab />}

          {/* AI Assistant - Responsive height */}
          {currentTab === "AI Health Assistant" && (
            <div className="w-full h-[calc(100vh-200px)] sm:h-[calc(100vh-240px)] md:h-[calc(100vh-260px)] lg:h-[calc(100vh-280px)] max-w-7xl mx-auto">
              <FloatingChatbot isFullScreen={true} />
            </div>
          )}
        </div>
      </div>

      {/* Floating Chatbot */}
      {currentTab !== "AI Health Assistant" && <FloatingChatbot />}
    </>
  );
};

export default PatientPortal;
