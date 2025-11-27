import React from "react";
import { HeartPulse } from "lucide-react";

const PatientInfoCard = ({
  name,
  patientId,
  room,
  age,
  bloodType,
  statusText = "Excellent",
  statusColor = "text-green-600",
  statusDot = "bg-green-500",
  imageUrl,
}) => {
  return (
    <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex items-center justify-between backdrop-blur-md"
         style={{ background: "linear-gradient(135deg, #f7faff 0%, #eef5ff 100%)" }}
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-5">
        {/* Profile Image + Status Icon */}
        <div className="relative">
          <img
            src={imageUrl}
            alt="patient"
            className="w-20 h-20 rounded-2xl object-cover shadow-md"
          />
          
          {/* Heart Status Badge */}
          <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full shadow-lg">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Text Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Good Morning, {name}</h2>

          <p className="text-gray-600 mt-1">
            {patientId} • {room}
          </p>

          <div className="flex gap-6 mt-2 text-gray-700">
            <p>Age: {age}</p>
            <p>Blood Type: {bloodType}</p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-gray-500 text-sm">Health Status</p>

          <div className="flex items-center gap-2 mt-1">
            <span className={`w-3 h-3 rounded-full ${statusDot}`}></span>
            <span className={`font-medium ${statusColor}`}>{statusText}</span>
          </div>
        </div>

        {/* Status Icon Box */}
        <div className="bg-green-500 p-4 rounded-xl shadow-lg">
          <HeartPulse className="w-7 h-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default PatientInfoCard;
