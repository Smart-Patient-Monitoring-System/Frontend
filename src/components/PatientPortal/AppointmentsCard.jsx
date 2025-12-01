import React from 'react';
import { Activity, Video, User } from 'lucide-react';

const AppointmentsCard = () => {
  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Williams',
      specialty: 'Cardiologist',
      date: 'Dec 5, 2024 at 10:30 AM',
      icon: 'video'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Physician',
      date: 'Dec 12, 2024 at 02:00 PM',
      icon: 'user'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-gray-700" />
          <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
        </div>
        <button className="text-blue-500 hover:text-blue-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-gray-50 rounded-xl p-4 flex items-start gap-4">
            <div className="bg-blue-500 rounded-lg p-3 flex-shrink-0 flex items-center justify-center">
              {apt.icon === 'video' ? (
                <Video className="w-6 h-6 text-white" />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">{apt.doctor}</h3>
              <p className="text-gray-600 text-sm mb-1">{apt.specialty}</p>
              <p className="text-gray-500 text-sm">{apt.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsCard;
