import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Heart, 
  Bell, 
  Settings, 
  Activity,
  AlertTriangle,
  FileText,
  Search,
  User,
  Clock,
  Thermometer,
  Droplets,
  Eye,
  LogOut,
  Users,
  UserCircle,
  AlertCircle,
  Tablet,
  TrendingUp,
  Wifi
} from "lucide-react";
import admin from "../../assets/images/admin.png";


function AdminDashboard() {
    const [analysis, setAnalysis] = useState(null);
    const [hasNotification, setHasNotification] = useState(true);
    const navigate = useNavigate();
    const handleLogout = () => {
      console.log('Logging out...');
        navigate('/');};

return( 
    <div className="min-h-screen bg-[#F0F6FF] transition-colors">
          {/* Header - Full width */}
          <header className="bg-white shadow-sm w-full">
            <div className="max-w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                {/* Left: Logo and Title */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div 
                      className="rounded-lg p-2 sm:p-2.5 shadow-xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(45deg, #00BAC5 0%, #0090EE 100%)'
                        }}
                    >
                        <img
                            src={admin}
                            alt="Admin Logo"
                            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                        />
                        </div>

                  <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-left">
                      Admin Portal
                    </h1>
                    <p className="hidden sm:block text-xs sm:text-sm text-gray-600">
                      Welcome, <span className="font-semibold">Section 7</span> Janith
                    </p>
                  </div>
                </div>
    
                {/* Right: Controls */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  {/* Notification Bell */}
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative" 
                    aria-label="Notifications"
                    onClick={() => setHasNotification(false)}
                  >
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                    {hasNotification && (
                      <span className="absolute top-1 right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full"></span>
                    )}
                  </button>
    
                  {/* Settings */}
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-black" />
                  </button>
    
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="rounded-lg px-4 py-2 shadow-xl text-white font-medium"
                    style={{
                      background: 'linear-gradient(45deg, #BE1111 0%, #260303 100%)'
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </header>
        </div>
    );
} 

export default AdminDashboard;


