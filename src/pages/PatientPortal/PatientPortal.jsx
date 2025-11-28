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


const PatientPortal = () => {
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
      <Header patientName="Jenny" />

      {/* Patient Info */}
      <div className="p-10 bg-gray-100">
        <PatientInfoCard
          name="Sarah Johnson"
          patientId="P-2024-001"
          room="Room 204-B"
          age={34}
          bloodType="A+"
          imageUrl="https://i.pravatar.cc/300?img=12"
        />
      </div>

      {/* Vitals Section */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex gap-6 overflow-x-auto pb-4">
            {vitals.map((vital, index) => (
              <VitalCard key={index} {...vital} />
            ))}
          </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="px-10">
        <GraphCard />
        <ECGMonitor />
      </div>

      {/* Alerts & Medications Section */}
      <div className="flex flex-col gap-6 p-10">
        <AlertsCard />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 p-10">
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
    </>
  );
};

export default PatientPortal;
