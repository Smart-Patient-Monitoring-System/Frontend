import React from 'react';
import { CheckCircle, AlertTriangle, Brain, TrendingUp } from 'lucide-react';

const HealthRiskCard = () => {
  const healthPredictions = [
    {
      id: 1,
      title: 'Cardiac Event',
      risk: '5%',
      status: 'Normal',
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      title: 'Arrhythmia',
      risk: '8%',
      status: 'Normal',
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      title: 'Hypertension',
      risk: '35%',
      status: 'Monitor',
      icon: AlertTriangle,
      color: 'orange',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            AI Health Predictions <span className="text-purple-600">✨</span>
          </h2>
          <p className="text-sm text-gray-500">ML-powered risk analysis</p>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="space-y-3 mb-6">
        {healthPredictions.map((prediction) => {
          const Icon = prediction.icon;
          return (
            <div
              key={prediction.id}
              className={`${prediction.bgColor} rounded-xl p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${prediction.iconColor}`} />
                  <h3 className="font-semibold text-gray-900">{prediction.title}</h3>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{prediction.risk}</div>
                  <div className="text-xs text-gray-500">Risk</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${prediction.textColor}`}>
                  Status: {prediction.status}
                </span>

                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      prediction.color === 'green' ? 'bg-green-500' : 'bg-orange-500'
                    }`}
                    style={{ width: prediction.risk }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Overall Health Score Block --- */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-lg font-semibold text-gray-900">Overall Health Score</p>
          <div className="flex items-center gap-1 text-green-600 font-semibold">
            <TrendingUp className="w-4 h-4" />
            92/100
          </div>
        </div>

        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: "92%" }}
          ></div>
        </div>
      </div>

      {/* --- AI Analysis Info Block --- */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
        <Brain className="w-6 h-6 text-blue-600 flex-shrink-0" />
        <p className="text-sm text-blue-700 leading-snug">
          AI analysis based on 24h vitals monitoring, historical trends, and clinical data patterns
        </p>
      </div>

    </div>
  );
};

export default HealthRiskCard;
