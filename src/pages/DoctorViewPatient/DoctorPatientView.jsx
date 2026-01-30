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
import EmergencyPanel from "../../components/PatientPortal/EmergencyPanel";
import MessagingDashboard from "../../components/PatientPortal/MessagingDashboard";
import FloatingChatbot from "../../components/PatientPortal/FloatingChatbot";
import ProfileTab from "../../components/PatientPortal/ProfileTab";
import HealthTipsCard from "../../components/PatientPortal/HealthTipsCard";
import RealtimeGraphs from "../../components/PatientPortal/RealtimeGraphs";
import DoctorNotesCard from "../../pages/DoctorViewPatient/DoctorViewComponents/DoctorNotesCard";
import AssignedCareTeamCard from "../../pages/DoctorViewPatient/DoctorViewComponents/AssignedCareTeamCard";

const DoctorPatientView = () => {
  const [currentTab, setCurrentTab] = useState("Overview");
  const [showManualEntry, setShowManualEntry] = useState(false);

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
          {/* Overview Tab - Simplified to match screenshot */}
          {currentTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              
              {/* Left Column - Vitals and Graph */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-5 md:space-y-6">
                {/* Vitals Grid */}
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                  {vitals.map((vital, index) => (
                    <VitalCard key={index} {...vital} />
                  ))}
                </div>

                {/* Vital Trends Graph */}
                <GraphCard />
              </div>

              {/* Right Column - Doctor's Notes and Care Team */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <DoctorNotesCard />
                <AssignedCareTeamCard />
              </div>
            </div>
          )}

          {/* Real-Time Vitals Tab */}
          {currentTab === "Real-Time Vitals" && (
            <RealtimeGraphs />
          )}

          {/* ECG Readings Tab */}
          {currentTab === "ECG Readings" && (
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <ECGMonitor isFullPage={true} />
            </div>
          )}

          {/* Medical Records Tab */}
          {currentTab === "Medical Records" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <ReportsCard />
              <MedicationsCard />
            </div>
          )}

          {/* Health Insights Tab */}
          {currentTab === "Health Insights" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              <div className="lg:col-span-2">
                <HealthRiskCard />
              </div>
              <div>
                <HealthTipsCard />
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {currentTab === "Appointments" && (
            <div className="max-w-4xl">
              <AppointmentsCard />
            </div>
          )}

          {/* Emergency Panel Tab */}
          {currentTab === "Emergency Panel" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <EmergencyPanel />
              <EmergencyCard />
            </div>
          )}

          {/* Messaging Tab */}
          {currentTab === "Messaging" && <MessagingDashboard />}

          {/* Profile Tab */}
          {currentTab === "Profile" && <ProfileTab />}

          {/* AI Health Assistant - Responsive height */}
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

export default DoctorPatientView;