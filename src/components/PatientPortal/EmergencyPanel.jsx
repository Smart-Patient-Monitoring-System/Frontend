import React from "react";
import { Phone, MapPin, Clock, AlertTriangle, Info, User, CheckCircle } from "lucide-react";

const EmergencyPanel = () => {
  return (
    <div className="space-y-6">
      
      {/* Top Call Ambulance Card */}
      <div className="bg-red-600 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Emergency Services</h2>
        </div>
        <button className="w-full sm:w-auto bg-white text-red-600 rounded-xl py-3 px-6 font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-50 transition-colors shadow-lg">
          <Phone className="w-6 h-6" />
          Call Ambulance
        </button>
      </div>

      {/* Grid for other emergency info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Nearest Hospital Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-bold text-gray-900">Nearest Hospital</h3>
          </div>
          <p className="text-gray-700 mb-2">City Hospital, 2.3 km away</p>
          <p className="text-gray-700 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            ETA: 8 mins
          </p>
        </div>

        {/* Emergency Contacts Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-bold text-gray-900">Emergency Contacts</h3>
          </div>
          <ul className="text-gray-700 space-y-1">
            <li>• Family: +1 (555) 123-4567</li>
            <li>• Hospital: +1 (555) 911-0000</li>
            <li>• Friend: +1 (555) 987-6543</li>
          </ul>
        </div>

        {/* Emergency Tips Card */}
        <div className="bg-yellow-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Info className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-bold text-yellow-800">Emergency Tips</h3>
          </div>
          <ul className="text-yellow-900 list-disc list-inside space-y-1">
            <li>Stay calm and call the ambulance immediately.</li>
            <li>Know your nearest hospital location.</li>
            <li>Keep emergency contacts updated.</li>
            <li>Follow first aid if trained.</li>
          </ul>
        </div>

        {/* Safe Actions Card */}
        <div className="bg-green-100 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-green-800">Safe Actions</h3>
          </div>
          <ul className="text-green-900 list-disc list-inside space-y-1">
            <li>Do not panic, stay calm.</li>
            <li>Move to a safe area if danger exists.</li>
            <li>Provide clear information to emergency responders.</li>
            <li>Help others only if safe to do so.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default EmergencyPanel;
