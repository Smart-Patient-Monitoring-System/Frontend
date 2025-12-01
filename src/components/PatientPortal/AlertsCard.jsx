import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, AlertCircle, Bell, X, ChevronRight } from 'lucide-react';

const AlertsCard = () => {
  const [alerts, setAlerts] = useState([
    { 
      id: 1, 
      text: 'High temperature detected', 
      time: '2m ago', 
      severity: 'high',
      details: 'Temperature reached 101.2°F',
      read: false
    },
    { 
      id: 2, 
      text: 'Irregular heartbeat', 
      time: '12m ago', 
      severity: 'medium',
      details: 'Heart rate fluctuated between 45-110 bpm',
      read: false
    },
    { 
      id: 3, 
      text: 'Blood pressure elevated', 
      time: '1h ago', 
      severity: 'medium',
      details: 'BP reading: 145/95 mmHg',
      read: true
    },
    { 
      id: 4, 
      text: 'Medication reminder', 
      time: '2h ago', 
      severity: 'low',
      details: 'Time to take Aspirin 100mg',
      read: true
    },
  ]);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          iconBg: 'bg-red-100',
          dot: 'bg-red-500'
        };
      case 'medium':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          iconBg: 'bg-orange-100',
          dot: 'bg-orange-500'
        };
      case 'low':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
          dot: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'text-gray-600',
          iconBg: 'bg-gray-100',
          dot: 'bg-gray-500'
        };
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5" />;
      case 'low':
        return <Bell className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const dismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 max-w-md ml-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-400 to-red-500 p-3 rounded-xl shadow-md">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recent Alerts</h2>
            <p className="text-sm text-gray-500">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
        </div>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
          View all
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No active alerts</p>
            <p className="text-sm text-gray-400">You're all set!</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const colors = getSeverityColor(alert.severity);
            return (
              <div
                key={alert.id}
                className={`relative ${colors.bg} border ${colors.border} rounded-xl p-4 transition-all hover:shadow-md ${
                  !alert.read ? 'ring-2 ring-offset-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`${colors.iconBg} p-2 rounded-lg ${colors.icon} flex-shrink-0`}>
                    {getSeverityIcon(alert.severity)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        {alert.text}
                        {!alert.read && (
                          <span className={`w-2 h-2 ${colors.dot} rounded-full animate-pulse`} />
                        )}
                      </h3>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{alert.details}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>

                {/* Severity Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.icon} ${colors.iconBg} border ${colors.border}`}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      {alerts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.severity === 'high').length}
            </p>
            <p className="text-xs text-gray-500">High Priority</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.severity === 'medium').length}
            </p>
            <p className="text-xs text-gray-500">Medium</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {alerts.filter(a => a.severity === 'low').length}
            </p>
            <p className="text-xs text-gray-500">Low Priority</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsCard;