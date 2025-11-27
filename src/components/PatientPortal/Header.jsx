import React, { useState } from 'react';
import { Heart, Bell, Settings, LogOut } from 'lucide-react';

const Header = ({ patientName }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 rounded-full p-2.5">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Patient Portal</h1>
            <p className="text-sm text-gray-600">Welcome back, {patientName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative w-14 h-7 rounded-full transition-colors ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isDarkMode ? 'translate-x-8' : 'translate-x-1'}`}></div>
          </button>
          
          <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;