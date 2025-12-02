import React from "react";
import { Heart, Droplets, Zap, Lightbulb } from "lucide-react";

const HealthTipsCard = () => {
  const tips = [
    {
      id: 1,
      title: "Heart Rate",
      description: "Your heart rate is within normal range. Continue regular activity.",
      icon: Heart,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      title: "Hydration",
      description: "Stay hydrated. Aim for 8 glasses of water daily.",
      icon: Droplets,
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      id: 3,
      title: "Activity",
      description: "Light exercise recommended. 20-30 minutes daily walk is ideal.",
      icon: Zap,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <Lightbulb className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Health Tips</h2>
          <p className="text-gray-500 text-sm">Personalized recommendations</p>
        </div>
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className={`${tip.iconBg} rounded-full p-3 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${tip.iconColor}`} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default HealthTipsCard;