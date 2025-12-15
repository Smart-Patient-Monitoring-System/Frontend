
import React, { useState } from 'react';
import CriticalAlertPage from './CriticalAlertPage';
import ECGReaderPage from './ECGReaderPage';
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
  Users
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
          {activeTab === 'patient-overview' && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Table Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Patient Overview</h2>
                <p className="text-gray-600 text-sm mt-1">Detailed patient monitoring data</p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Heart Rate</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Temp</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SpO₂</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Level</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">{patient.id} - {patient.age}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{patient.room}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <span className={`font-medium ${
                              patient.heartRate.includes('145') ? 'text-red-600' : 'text-gray-700'
                            }`}>
                              {patient.heartRate}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="text-gray-700">{patient.temp}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-cyan-500" />
                            <span className="text-gray-700">{patient.spO2}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            patient.riskLevel === 'High' 
                              ? 'bg-red-100 text-red-800' 
                              : patient.riskLevel === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {patient.riskLevel}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'Critical' 
                              ? 'bg-red-100 text-red-800' 
                              : patient.status === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {patients.length} of 42 patients
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded-lg">
                      Previous
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg">
                      1
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded-lg">
                      2
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded-lg">
                      3
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-white rounded-lg">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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