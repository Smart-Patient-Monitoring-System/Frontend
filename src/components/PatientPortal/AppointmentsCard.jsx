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
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
            <span className="hidden sm:inline">Upcoming Appointments</span>
            <span className="sm:hidden">Appointments</span>
          </h2>
        </div>
        <button className="text-blue-500 hover:text-blue-600 p-1 sm:p-0">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
            <div className="bg-blue-500 rounded-lg p-2 sm:p-2.5 md:p-3 flex-shrink-0 flex items-center justify-center">
              {apt.icon === 'video' ? (
                <Video className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-1 truncate">{apt.doctor}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">{apt.specialty}</p>
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{apt.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsCard;