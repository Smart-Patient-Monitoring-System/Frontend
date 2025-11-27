import './App.css'
import Header from './components/PatientPortal/Header'
import PatientInfoCard from './components/PatientPortal/PatientInfoCard'
import React from 'react';
import VitalCard from './components/PatientPortal/VitalCard';
import GraphCard from './components/PatientPortal/GraphCard';
import AlertsCard from './components/PatientPortal/AlertsCard';
import MedicationsCard from './components/PatientPortal/MedicationsCard';

function App() {
  

  return (
    <>
      <div>
      <Header patientName="Jenny" />
    </div>
    <div className="p-10 bg-gray-100 min-h-screen">
      <PatientInfoCard
        name="Sarah Johnson"
        patientId="P-2024-001"
        room="Room 204-B"
        age={34}
        bloodType="A+"
        imageUrl="https://i.pravatar.cc/300?img=12"
      />
    </div>
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
<div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
<VitalCard title="Heart Rate" value="78 bpm" sub="Avg 82" iconName="heart" />
<VitalCard title="Temperature" value="36.6 °C" sub="Stable" iconName="thermometer" />
<VitalCard title="SpO₂" value="98%" sub="Normal" iconName="moon" />
<VitalCard title="BP" value="118/76" sub="Normal" iconName="activity" />


<GraphCard />
</div>


<div className="flex flex-col gap-6">
<AlertsCard />
<MedicationsCard />
</div>
</div>
    </>
  )
}

export default App
