import React from 'react';
import { Heart, Bell, Settings, LogOut } from 'lucide-react';

const Header = ({ patientName }) => (
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
      <div className="flex items-center gap-3">
        {/* Toggle, Bell, Settings, Logout */}
      </div>
    </div>
  </header>
);

export default Header;