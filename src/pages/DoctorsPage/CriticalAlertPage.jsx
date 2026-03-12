import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertCard from './componants/AlertCard';

const API_BASE_URL = 'http://localhost:8080';

function CriticalAlertPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Not authenticated. Please login again.');
          navigate('/doctorLogin');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/doctor/critical-alerts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please login again.');
            navigate('/doctorLogin');
            return;
          }
          throw new Error(`Failed to fetch alerts: ${response.statusText}`);
        }

        const data = await response.json();

        // Transform API data to match AlertCard props
        const transformedAlerts = data.map(alert => ({
          id: alert.id || `${alert.patientId}-${alert.timestamp}`,
          title: alert.alertType,
          patient: alert.patientName,
          hr: alert.heartRate || 0,
          normalRange: getNormalRange(alert.alertType),
          time: formatTime(alert.timestamp),
          level: getAlertLevel(alert.triageLevel, alert.severity),
          description: alert.description || null
        }));

        setAlerts(transformedAlerts);
        setError(null);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();

    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Helper function to get normal range based on alert type
  const getNormalRange = (alertType) => {
    const ranges = {
      'High Heart Rate': '60-100 bpm',
      'Low Heart Rate': '60-100 bpm',
      'High Blood Pressure': '90-120 mmHg',
      'Low Blood Pressure': '90-120 mmHg',
      'Low Oxygen Level': '95-100%',
      'High Temperature': '36.1-37.2°C',
      'Low Temperature': '36.1-37.2°C',
      'ECG Abnormal': 'Normal sinus rhythm'
    };
    return ranges[alertType] || '—';
  };

  // Helper function to format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // Helper function to determine alert level for styling
  const getAlertLevel = (triageLevel, severity) => {
    if (triageLevel === 'EMERGENCY' || severity === 'RED') return 'high';
    if (triageLevel === 'HIGH' || severity === 'ORANGE') return 'medium';
    return 'low';
  };

  return (
    <div className='p-6 bg-white rounded-3xl shadow-md'>
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-2xl font-bold'>Critical Alerts</h2>
        {!loading && (
          <span className="text-sm text-gray-500">
            {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading alerts...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && alerts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">✓</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">All Clear!</h3>
          <p className="text-gray-500">No critical alerts at this time.</p>
        </div>
      )}

      {/* Alerts List */}
      {!loading && !error && alerts.length > 0 && (
        alerts.map((item) => (
          <AlertCard
            key={item.id}
            title={item.title}
            patient={item.patient}
            hr={item.hr}
            normalRange={item.normalRange}
            time={item.time}
            level={item.level}
            description={item.description}
          />
        ))
      )}
    </div>
  );
}

export default CriticalAlertPage;
