import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

const DoctorPatientView = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("Overview");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Store original patient ID to restore later
  const [originalPatientId] = useState(() => localStorage.getItem('patientId'));

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

  // Fetch patient data and set localStorage for components that need it
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Set the patient ID in localStorage so HealthDataTab and other components use it
        localStorage.setItem('patientId', patientId);

        const response = await fetch(`http://localhost:8080/api/patient/get/${patientId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setPatient(data);
          // Also set patient name for Header component
          localStorage.setItem('patientName', data.name || 'Patient');
        }
      } catch (err) {
        console.error('Error fetching patient:', err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }

    // Cleanup: restore original patient ID when leaving
    return () => {
      if (originalPatientId) {
        localStorage.setItem('patientId', originalPatientId);
      }
    };
  }, [patientId, originalPatientId]);

  // Calculate age from date of birth
  const calculateAge = (dateString) => {
    if (!dateString) return 'N/A';
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  const patientName = patient?.name || 'Patient';
  const patientFirstName = patientName.split(' ')[0];

  return (
    <>
      {/* Back to Doctor Dashboard Button */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2">
        <button
          onClick={() => navigate('/DocDashboard')}
          className="flex items-center gap-2 text-white hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Doctor Dashboard</span>
        </button>
      </div>

      {/* Header - Same as Patient Portal */}
      <Header patientName={patientFirstName} />

      {/* Patient Info - Same as Patient Portal */}
      <div className="w-full bg-gray-100 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8">
        <PatientInfoCard
          name={patientName}
          patientId={`P-${patientId}`}
          room={patient?.room || "Room 204-B"}
          age={calculateAge(patient?.dateOfBirth)}
          bloodType={patient?.bloodType || "N/A"}
          imageUrl={patient?.imageUrl || "https://i.pravatar.cc/300?img=12"}
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
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {vitals.map((vital, index) => (
                  <VitalCard key={index} {...vital} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                <div className="lg:col-span-2">
                  <GraphCard />
                </div>
                <div>
                  <HealthRiskCard />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                <div className="lg:col-span-2">
                  <ECGMonitor />
                </div>
                <div>
                  <HealthTipsCard />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <AppointmentsCard />
                  <ReportsCard />
                </div>
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
              <ReportsCard />
            </div>
          )}

          {/* Health Data - This will use patientId from localStorage */}
          {currentTab === "Health Data" && <HealthDataTab />}

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

export default DoctorPatientView;