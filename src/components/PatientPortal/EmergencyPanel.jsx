import React, { useState, useEffect } from "react";
import { Phone, MapPin, Clock, AlertTriangle, Info, User, CheckCircle } from "lucide-react";

const EmergencyPanel = () => {
  const [panelData, setPanelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);
  const userId = 1; // Replace with actual authenticated user ID

  useEffect(() => {
    fetchPanelData();
  }, []);

  const fetchPanelData = async () => {
    try {
      // Get user's current location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          const response = await fetch(
            `http://localhost:8080/api/patient/emergency-panel/${userId}?latitude=${latitude}&longitude=${longitude}`
          );
          
          if (response.ok) {
            const data = await response.json();
            setPanelData(data);
          }
          setLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          // Fetch without location - will use patient's stored address
          fetchPanelDataWithoutLocation();
        }
      );
    } catch (error) {
      console.error('Error fetching panel data:', error);
      setLoading(false);
    }
  };

  const fetchPanelDataWithoutLocation = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/patient/emergency-panel/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPanelData(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleCallAmbulance = async () => {
    if (calling) return;
    
    setCalling(true);
    
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Create emergency alert
          const alertResponse = await fetch(`http://localhost:8080/api/emergency/alert/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              alertType: 'MEDICAL_EMERGENCY',
              description: 'Emergency ambulance requested',
              latitude,
              longitude,
              ambulanceCalled: true,
              contactsNotified: true
            })
          });
          
          if (alertResponse.ok) {
            const alertData = await alertResponse.json();
            alert('Emergency alert sent! Ambulance has been notified and your emergency contacts have been informed.');
            
            // Open 1990 website
            window.open("https://www.1990.lk/", "_blank");
            
            // Refresh panel data
            fetchPanelData();
          }
          
          setCalling(false);
        },
        (error) => {
          console.error('Location error:', error);
          alert('Unable to get your location. Please enable location services and try again.');
          setCalling(false);
        }
      );
    } catch (error) {
      console.error('Error creating alert:', error);
      alert('Failed to create emergency alert. Please try again.');
      setCalling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading emergency panel...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      
      {/* Top Call Ambulance Card */}
      <div className="bg-red-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold">Emergency Services</h2>
        </div>
        <button
          onClick={handleCallAmbulance}
          disabled={calling}
          className="w-full lg:w-auto bg-white text-red-600 rounded-xl py-3 px-6 font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Phone className="w-6 h-6" />
          {calling ? 'Calling...' : 'Call Ambulance (1990)'}
        </button>
      </div>

      {/* Grid for other emergency info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">

        {/* Nearest Hospital Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Nearest Hospital</h3>
          </div>
          {panelData?.nearestHospital ? (
            <>
              <p className="text-sm sm:text-base text-gray-700 mb-2">
                {panelData.nearestHospital.hospital.name}
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                {panelData.nearestHospital.distance}
              </p>
              <p className="text-sm sm:text-base text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                ETA: {panelData.nearestHospital.eta}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">Enable location to see nearest hospital</p>
          )}
        </div>

        {/* Emergency Contacts Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">Emergency Contacts</h3>
          </div>
          {panelData?.emergencyContacts && panelData.emergencyContacts.length > 0 ? (
            <ul className="text-sm sm:text-base text-gray-700 space-y-1">
              {panelData.emergencyContacts.map((contact, index) => (
                <li key={index}>
                  • {contact.relationship}: {contact.phoneNumber}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No emergency contacts found</p>
          )}
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

      {/* Active Alert Indicator */}
      {panelData?.activeAlert && (
        <div className="bg-orange-100 border-2 border-orange-500 rounded-xl p-4 sm:p-5">
          <h3 className="text-lg font-bold text-orange-800 mb-2">Active Emergency Alert</h3>
          <p className="text-sm text-orange-700">
            Type: {panelData.activeAlert.alertType} | 
            Status: {panelData.activeAlert.status} | 
            Created: {new Date(panelData.activeAlert.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmergencyPanel;