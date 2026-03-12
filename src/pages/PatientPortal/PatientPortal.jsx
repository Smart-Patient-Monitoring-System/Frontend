import { useState } from "react";

import Header from "../../components/PatientPortal/Header";
import PatientInfoCard from "../../components/PatientPortal/PatientInfoCard";
import AppointmentsCard from "../../components/PatientPortal/AppointmentsCard";
import ReportsCard from "../../components/PatientPortal/ReportsCard";
import HealthRiskCard from "../../components/PatientPortal/HealthRiskCard";
import EmergencyCard from "../../components/PatientPortal/EmergencyCard";
import VitalsTrends3Charts from "../../components/PatientPortal/VitalsTrends3Charts";

// UPDATED: Use VitalsDashboard (not single VitalCard)
import VitalsDashboard from "../../components/PatientPortal/VitalsDashboard";

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
import DoctorNotesCard from "../DoctorViewPatient/DoctorViewComponents/DoctorNotesCard";

const PatientPortal = () => {
  const [currentTab, setCurrentTab] = useState("Overview");
  const [showManualEntry, setShowManualEntry] = useState(false);

  // NEW: used to trigger vitals refresh after adding a new medical event
  const [vitalsRefreshKey, setVitalsRefreshKey] = useState(0);

  const patientId = localStorage.getItem("patientId");

  return (
    <>
      {/* Header */}
      <Header patientName="Sarah" />

      {/* Patient Info */}
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

      {/* Dashboard */}
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

        {/* Main Content */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-6">
          {/* Overview Tab */}
          {currentTab === "Overview" && (
            <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
              {/*  UPDATED: Dynamic vitals cards from backend (latestVitals) */}
              <VitalsDashboard patientId={patientId} refreshKey={vitalsRefreshKey} />

              {/* Graph + Health Risk */}
              <div className="lg:col-span-2">
  <VitalsTrends3Charts patientId={patientId} />
</div>


              {/* ECG + Health Tips */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                <div className="lg:col-span-2">
                  <HealthRiskCard />
                </div>
                <div>
                  <HealthTipsCard />
                </div>
              </div>

              {/* Appointments + Reports  |  Medications + Emergency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {/* Column 1 */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <AppointmentsCard />

                  {/*  UPDATED: when an event is added, refresh vitals cards */}
                  <ReportsCard
                    patientId={patientId}
                    onMedicalEventAdded={() =>
                      setVitalsRefreshKey((k) => k + 1)
                    }
                  />
                </div>

                {/* Column 2 */}
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <MedicationsCard patientId={patientId} />
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
              <ReportsCard
                patientId={patientId}
                onMedicalEventAdded={() =>
                  setVitalsRefreshKey((k) => k + 1)
                }
              />
            </div>
          )}

          {/* Health Data */}
          {currentTab === "Health Data from smart watch" && <HealthDataTab />}

          {/* Doctor Consultations */}
          {currentTab === "Doctor Consultations" && <DoctorNotesCard />}

          {/* AI Assistant */}
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
