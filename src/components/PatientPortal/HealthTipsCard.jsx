import React from "react";
import { Heart, Droplets, Zap, Lightbulb, Info } from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-full">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-800 truncate">Health Tips</h2>
          <p className="text-gray-500 text-sm truncate">Personalized recommendations</p>
        </div>
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex-wrap"
            >
              <div className={`${tip.iconBg} rounded-full p-3 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${tip.iconColor}`} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 mb-1 truncate">{tip.title}</h3>
                <p className="text-sm text-gray-600 truncate">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200"></div>

      {/* Reminders Section */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <h3 className="text-md font-semibold text-gray-800 truncate">Reminders</h3>
        </div>

        <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 text-sm">
          Remember to take your medication at <span className="font-medium">2:00 PM</span>
        </div>
      </div>

      {/* Daily Health Score */}
      <div className="bg-green-50 rounded-xl p-5 border border-green-100">
        <h3 className="text-md font-semibold text-gray-800 mb-3 truncate">
          Daily Health Score
        </h3>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-lg font-bold text-gray-900 flex-shrink-0">
            8.5 <span className="text-gray-500 text-sm">/10</span>
          </p>

          <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium flex-shrink-0">
            Excellent
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default HealthTipsCard;
