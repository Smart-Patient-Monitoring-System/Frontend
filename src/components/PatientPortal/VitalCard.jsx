import React from 'react';
import { Heart, Thermometer, Droplets, Activity } from 'lucide-react';

const VitalCard = ({ title, value, unit, status, trend, iconName, bgColor, iconColor, barColor }) => {
  const iconMap = {
    heart: Heart,
    thermometer: Thermometer,
    droplets: Droplets,
    activity: Activity,
  };
  
  const Icon = iconMap[iconName];
  
  return (
    <div className={`${bgColor} rounded-3xl p-4 sm:p-6 shadow-lg backdrop-blur-sm w-full sm:w-[320px]`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0">
        <div className={`${iconColor} p-3 sm:p-4 rounded-2xl shadow-md`}>
          <Icon className="w-6 sm:w-7 h-6 sm:h-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs sm:text-sm font-medium text-gray-700">NORMAL</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 tracking-wide uppercase">{title}</h3>
        <div className="flex items-baseline gap-1 sm:gap-2">
          <span className="text-3xl sm:text-5xl font-bold text-gray-800">{value}</span>
          <span className="text-sm sm:text-xl text-gray-500 font-light">{unit}</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2 sm:gap-0">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200/50 rounded-full flex items-center justify-center">
            <span className="text-xs sm:text-sm text-gray-600">{trend}</span>
          </div>
          <span className="text-xs sm:text-sm text-gray-600 font-medium">{status}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span className="text-xs sm:text-xs text-gray-600 font-medium">LIVE</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200/40 rounded-full h-1.5 sm:h-2 overflow-hidden">
        <div className={`${barColor} h-full rounded-full`} style={{ width: '75%' }}></div>
      </div>
    </div>
  );
};

export default VitalCard;
