import React, { useState } from 'react';
import CriticalAlertPage from './CriticalAlertPage';
import ECGReaderPage from './ECGReaderPage';
import PatientOwerview from './PatientOwerview';
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


function DocDashboard() {
  // State hooks
  const [hasNotification, setHasNotification] = useState(true);
  const [activeTab, setActiveTab] = useState('patient-overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Event handler for logout
  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Patient data
  const patients = [
    {
      name: 'Sarah Johnson',
      id: 'P-2024-001',
      age: '34y',
      room: '204-B',
      heartRate: '72 bpm',
      temp: '98.2°F',
      spO2: '98%',
      riskLevel: 'Low',
      status: 'stable'
    },
    {
      name: 'Sarah Johnson',
      id: 'P-2024-001',
      age: '34y',
      room: '204-B',
      heartRate: '145 bpm',
      temp: '98.2°F',
      spO2: '98%',
      riskLevel: 'High',
      status: 'Critical'
    },
    {
      name: 'Sarah Johnson',
      id: 'P-2024-001',
      age: '34y',
      room: '204-B',
      heartRate: '90 bpm',
      temp: '98.2°F',
      spO2: '98%',
      riskLevel: 'Medium',
      status: 'Medium'
    }
  ];

  // Statistics data for the 4 boxes
  const statsData = [
    {
      title: 'Total Patients',
      value: '24',
      icon: <Users className="w-6 h-6" />,
      color: '#ffffffff',
      bgColor: '#1A65FE',
      
    },
    {
      title: 'Critical Alerts',
      value: '2',
      icon: <AlertCircle className="w-6 h-6" />,
      color: '#ffffffff',
      bgColor: '#F41D2A',
      
    },
    {
      title: 'IoT Devices',
      value: '48',
      icon: <Wifi className="w-6 h-6" />,
      color: '#ffffffff',
      bgColor: '#00AD42',
      
    },
    {
      title: 'Avg Health Score',
      value: '87',
      suffix: '%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: '#ffffffff',
      bgColor: '#00AC9B',
      
    }
  ];

  return (
    <div className="min-h-screen bg-[#F0F6FF] transition-colors">
      {/* Header - Full width */}
      <header className="bg-white shadow-sm w-full">
        <div className="max-w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div 
                className="rounded-lg p-2 sm:p-2.5 shadow-xl"
                style={{
                  background: 'linear-gradient(45deg, #00BAC5 0%, #0090EE 100%)'
                }}
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-left">
                  Doctor Portal
                </h1>
                <p className="hidden sm:block text-xs sm:text-sm text-gray-600">
                  Welcome, <span className="font-semibold">Section 7</span> Jpā Supul
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

      {/* Main Content Area */}
      <div className="flex">
        {/* Left Sidebar Dashboard */}
        <aside className="bg-white shadow-lg w-64 border-r border-gray-200 flex flex-col h-[calc(100vh-80px)] sticky top-0">
          {/* Navigation Tabs */}
          <div className="p-4">
            <div className="space-y-2">
              {/* Patient Overview Tab */}
              <button
                onClick={() => setActiveTab('patient-overview')}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                  activeTab === 'patient-overview' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Patient Overview</span>
              </button>

              {/* ECG Reader Tab */}
              <button
                onClick={() => setActiveTab('ecg-reader')}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                  activeTab === 'ecg-reader' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="font-medium">ECG Reader</span>
              </button>

              {/* Critical Alerts Tab */}
              <button
                onClick={() => setActiveTab('critical-alerts')}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                  activeTab === 'critical-alerts' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Critical Alerts</span>
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">2</span>
              </button>

              {/* Reports Tab */}
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-colors text-left ${
                  activeTab === 'reports' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Reports</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Patients</span>
                  <span className="text-lg font-bold text-gray-800">42</span>
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Critical</span>
                  <span className="text-lg font-bold text-red-600">22</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stable</span>
                  <span className="text-lg font-bold text-green-600">20</span>
                </div>
              </div>
            </div>
          </div>

          
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-80px)] bg-[#F0F6FF]">
          {/* Search Bar - Show only for Patient Overview and Reports */}
          {(activeTab === 'patient-overview' || activeTab === 'reports') && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Patients by Name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          
          {/* Patient Overview Tab Content */}
          {activeTab === 'patient-overview' && <ECGReaderPage/>}

          {/* ECG Reader Tab Content */}
          {activeTab === 'ecg-reader' && <ECGReaderPage />}
          
          {/* Critical Alerts Tab Content */}
          {activeTab === 'critical-alerts' && <CriticalAlertPage />}
          
          
        </main>
      </div>
    </div>
  );

}

export default DocDashboard;