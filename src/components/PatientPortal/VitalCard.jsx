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
    <div className={`${bgColor} rounded-3xl p-6 shadow-lg backdrop-blur-sm w-[320px]`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconColor} p-4 rounded-2xl shadow-md`}>
          <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex items-center gap-2 bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-700">NORMAL</span>
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2 tracking-wide uppercase">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-gray-800">{value}</span>
          <span className="text-xl text-gray-500 font-light">{unit}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200/50 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm">{trend}</span>
          </div>
          <span className="text-sm text-gray-600 font-medium">{status}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-600 font-medium">LIVE</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-200/40 rounded-full h-2 overflow-hidden">
        <div className={`${barColor} h-full rounded-full`} style={{ width: '75%' }}></div>
      </div>
    </div>
  );
};

export default VitalCard;