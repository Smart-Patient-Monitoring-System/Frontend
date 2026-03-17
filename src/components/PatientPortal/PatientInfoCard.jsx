import React, { useState, useEffect } from 'react';
import { HeartPulse } from 'lucide-react';

const PatientInfoCard = () => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Get the logged-in patient's ID from localStorage
        const patientId = localStorage.getItem('patientId');
        
        if (!patientId) {
          setError('No patient ID found. Please log in again.');
          setLoading(false);
          return;
        }

        // Fetch patient data from your backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/patient/get/${patientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
            // Add authorization header if you're using JWT
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const data = await response.json();
        setPatientData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to load patient information');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Generate patient ID format
  const formatPatientId = (id, createdAt) => {
    if (!id) return 'N/A';
    const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
    return `P-${year}-${String(id).padStart(3, '0')}`;
  };

  // Determine health status based on medical conditions
  const getHealthStatus = (medicalConditions, allergies) => {
    if (!medicalConditions && !allergies) return 'Excellent';
    if (medicalConditions || allergies) return 'Good';
    return 'Excellent';
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'P';
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return name[0];
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-md p-6 mb-6 border border-gray-100 w-full animate-pulse">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 w-full">
            <div className="w-24 h-24 bg-gray-200 rounded-2xl"></div>
            <div className="flex-1">
              <div className="h-7 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 h-16 bg-gray-200 rounded"></div>
            <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 rounded-3xl shadow-md p-6 mb-6 border border-red-200 w-full">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!patientData) {
    return null;
  }

  const age = calculateAge(patientData.dateOfBirth);
  const patientId = formatPatientId(patientData.id, patientData.createdAt);
  const room = patientData.city ? `Room ${patientData.city}` : 'Room 204-B';
  const healthStatus = getHealthStatus(patientData.medicalConditions, patientData.allergies);
  const initials = getInitials(patientData.name);

  return (
    <div className="bg-white rounded-3xl shadow-md p-6 mb-6 border border-gray-100 w-full">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {/* Avatar with initials */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white text-2xl font-bold">{initials}</span>
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 bg-green-500 rounded-full p-2 border-2 border-white shadow">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome, {patientData.name}
            </h2>
            <p className="text-gray-600 mb-2">
              {patientId} • {room}
            </p>
            <p className="text-gray-500 text-sm">
              Age: {age} &nbsp;&nbsp; Blood Type: {patientData.bloodType || 'N/A'}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Health Status</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                healthStatus === 'Excellent' ? 'bg-green-500' : 
                healthStatus === 'Good' ? 'bg-blue-500' : 
                'bg-yellow-500'
              }`}></div>
              <span className={`font-semibold ${
                healthStatus === 'Excellent' ? 'text-green-600' : 
                healthStatus === 'Good' ? 'text-blue-600' : 
                'text-yellow-600'
              }`}>
                {healthStatus}
              </span>
            </div>
          </div>
          <div className={`p-4 rounded-2xl shadow-md ${
            healthStatus === 'Excellent' ? 'bg-green-500' : 
            healthStatus === 'Good' ? 'bg-blue-500' : 
            'bg-yellow-500'
          }`}>
            <HeartPulse className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;