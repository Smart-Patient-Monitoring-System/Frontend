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
        return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'low':
        return <Bell className="w-4 h-4 sm:w-5 sm:h-5" />;
      default:
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const dismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-5 md:p-6 border border-gray-200 w-full max-w-full sm:max-w-lg md:max-w-md lg:max-w-md xl:max-w-lg">
      {/* Header - Responsive layout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-gradient-to-br from-red-400 to-red-500 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl shadow-md">
            <AlertTriangle className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Recent Alerts</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
            </p>
          </div>
        </div>
        <button className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 self-end sm:self-auto">
          View all
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Alerts List - Responsive spacing */}
      <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto mb-2 sm:mb-3" />
            <p className="text-sm sm:text-base text-gray-600 font-medium">No active alerts</p>
            <p className="text-xs sm:text-sm text-gray-400">You're all set!</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const colors = getSeverityColor(alert.severity);
            return (
              <div
                key={alert.id}
                className={`relative ${colors.bg} border ${colors.border} rounded-lg sm:rounded-xl p-3 sm:p-3.5 md:p-4 transition-all hover:shadow-md ${
                  !alert.read ? 'ring-1 sm:ring-2 ring-offset-1 sm:ring-offset-2 ring-blue-200' : ''
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  {/* Icon - Responsive sizing */}
                  <div className={`${colors.iconBg} p-1.5 sm:p-2 rounded-md sm:rounded-lg ${colors.icon} flex-shrink-0`}>
                    {getSeverityIcon(alert.severity)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-16 sm:pr-20">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                        <span className="line-clamp-1">{alert.text}</span>
                        {!alert.read && (
                          <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${colors.dot} rounded-full animate-pulse flex-shrink-0`} />
                        )}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-1.5 sm:mb-2 line-clamp-2">{alert.details}</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{alert.time}</span>
                    </div>
                  </div>

                  {/* Dismiss Button - Mobile positioned */}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Severity Badge - Responsive positioning and sizing */}
                <div className="absolute top-3 right-8 sm:top-3.5 sm:right-10 md:top-4 md:right-12">
                  <span className={`hidden sm:inline-block px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${colors.icon} ${colors.iconBg} border ${colors.border}`}>
                    {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                  </span>
                  {/* Mobile: Show only first letter */}
                  <span className={`inline-block sm:hidden w-6 h-6 rounded-full text-xs font-bold ${colors.icon} ${colors.iconBg} border ${colors.border} flex items-center justify-center`}>
                    {alert.severity.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats - Responsive grid */}
      {alerts.length > 0 && (
        <div className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 border-t border-gray-200 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-red-600">
              {alerts.filter(a => a.severity === 'high').length}
            </p>
            <p className="text-xs text-gray-500">High Priority</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.severity === 'medium').length}
            </p>
            <p className="text-xs text-gray-500">Medium</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
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