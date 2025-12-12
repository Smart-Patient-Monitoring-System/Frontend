import React from "react";
import { Phone, MapPin, Clock, AlertTriangle, Info, User, CheckCircle } from "lucide-react";

const EmergencyPanel = () => {
  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      
      {/* Top Call Ambulance Card - Responsive */}
      <div className="bg-red-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold">Emergency Services</h2>
        </div>
        <button className="w-full sm:w-auto bg-white text-red-600 rounded-lg sm:rounded-xl py-2.5 px-5 sm:py-3 sm:px-6 font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 hover:bg-red-50 transition-colors shadow-lg">
          <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
          Call Ambulance
        </button>
      </div>

      {/* Grid for other emergency info - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">

        {/* Nearest Hospital Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Nearest Hospital</h3>
          </div>
          <p className="text-sm sm:text-base text-gray-700 mb-2">City Hospital, 2.3 km away</p>
          <p className="text-sm sm:text-base text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            ETA: 8 mins
          </p>
        </div>

        {/* Emergency Contacts Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Emergency Contacts</h3>
          </div>
          <ul className="text-sm sm:text-base text-gray-700 space-y-1">
            <li>• Family: +1 (555) 123-4567</li>
            <li>• Hospital: +1 (555) 911-0000</li>
            <li>• Friend: +1 (555) 987-6543</li>
          </ul>
        </div>

        {/* Emergency Tips Card */}
        <div className="bg-yellow-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            <h3 className="text-base sm:text-lg font-bold text-yellow-800">Emergency Tips</h3>
          </div>
          <ul className="text-xs sm:text-sm md:text-base text-yellow-900 list-disc list-inside space-y-1 sm:space-y-1.5">
            <li>Stay calm and call the ambulance immediately.</li>
            <li>Know your nearest hospital location.</li>
            <li>Keep emergency contacts updated.</li>
            <li>Follow first aid if trained.</li>
          </ul>
        </div>

        {/* Safe Actions Card */}
        <div className="bg-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <h3 className="text-base sm:text-lg font-bold text-green-800">Safe Actions</h3>
          </div>
          <ul className="text-xs sm:text-sm md:text-base text-green-900 list-disc list-inside space-y-1 sm:space-y-1.5">
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