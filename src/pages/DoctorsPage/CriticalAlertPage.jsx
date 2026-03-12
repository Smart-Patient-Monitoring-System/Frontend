import React from 'react'
import AlertCard from './componants/AlertCard'

function CriticalAlertPage() {

  const alerts = [
    { id: 1, hr: 77, title: "High Heart Rate", patient: "Anupa", normalRange: "60-100 bpm", time: "10:32" ,level:"high"},
    { id: 2, hr: 72, title: "Low Oxygen Level", patient: "Ravi", normalRange: "60-100 bpm", time: "11:15" ,level:"low"},
    { id: 3, hr: 67, title: "High Blood Pressure", patient: "Sita", normalRange: "60-100 bpm", time: "12:05",level:"high" },
    { id: 4, hr: 77, title: "Irregular Heartbeat", patient: "Mohan", normalRange: "60-100 bpm", time: "12:45",level:"medium" },
  ];

  return (
    <div className='p-6 bg-white rounded-3xl shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>Critical Alerts</h2>

      {alerts.map((item) => (
        <AlertCard
          key={item.id}
          title={item.title}
          patient={item.patient}
          hr={item.hr}
          normalRange={item.normalRange}
          time={item.time}
            level={item.level}
        />
      ))}
    </div>
  )
}

export default CriticalAlertPage
