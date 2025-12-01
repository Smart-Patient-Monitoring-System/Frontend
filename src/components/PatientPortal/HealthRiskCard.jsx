import React from 'react';
import { Activity, Heart, Phone, MapPin, Clock, AlertTriangle, CheckCircle, AlertCircle, Info } from 'lucide-react';

const HealthRiskCard = () => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8" />
        <h2 className="text-2xl font-bold">AI Health Risk Analysis</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-blue-100 text-sm mb-2">Predicted Condition</p>
          <h3 className="text-3xl font-bold mb-1">Low Risk</h3>
          <p className="text-blue-100">Cardiovascular Health</p>
        </div>

        <div>
          <p className="text-blue-100 text-sm mb-2">Confidence Level</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/20 rounded-full h-3 overflow-hidden">
              <div className="bg-green-400 h-full rounded-full" style={{ width: '92%' }}></div>
            </div>
            <span className="text-2xl font-bold">92%</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold mb-4">AI Recommendations:</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
            <p className="text-blue-50">Maintain current exercise routine - 30 mins daily walking</p>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
            <p className="text-blue-50">Schedule cholesterol test in next 2 weeks</p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
            <p className="text-blue-50">Consider consultation with nutritionist for diet optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRiskCard;  
