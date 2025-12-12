import React from 'react';
import { Phone, MapPin, Clock, AlertTriangle } from 'lucide-react';

const EmergencyCard = () => {
  return (
    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 lg:p-8 text-white shadow-xl w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Emergency Services</h2>
        </div>
        <button className="w-full lg:w-auto bg-white text-red-600 rounded-xl py-3 px-6 font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-50 transition-colors shadow-lg">
          <Phone className="w-6 h-6" />
          Call Ambulance
        </button>
      </div>

      <div className="bg-red-400/30 rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <div className="flex items-center gap-2 text-red-50">
          <MapPin className="w-5 h-5" />
          <span className="font-semibold">Nearest: 2.3 km</span>
        </div>
        <div className="flex items-center gap-2 text-red-50">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">ETA: 8 mins</span>
        </div>
      </div>

      <div className="space-y-1 text-left">
        <p className="font-semibold mb-2">Emergency Contacts:</p>
        <p className="text-red-50">• Family: +1 (555) 123-4567</p>
        <p className="text-red-50">• Hospital: +1 (555) 911-0000</p>
      </div>
    </div>
  );
};

export default EmergencyCard;
