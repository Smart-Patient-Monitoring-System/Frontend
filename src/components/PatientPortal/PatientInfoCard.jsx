import React from "react";
import { HeartPulse } from "lucide-react";

const PatientInfoCard = ({
  name,
  patientId,
  room,
  age,
  bloodType,
  healthStatus = "Excellent",
  imageUrl,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-6 mb-6 border border-gray-100 w-full">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={imageUrl}
              alt="Patient"
              className="w-24 h-24 rounded-2xl object-cover shadow-md"
            />

            <div className="absolute -bottom-1.5 -right-1.5 bg-green-500 rounded-full p-2 border-2 border-white shadow">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Good Morning, {name}
            </h2>

            <p className="text-gray-600 mb-2">
              {patientId} • {room}
            </p>

            <p className="text-gray-500 text-sm">
              Age: {age} &nbsp;&nbsp; Blood Type: {bloodType}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Health Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-600 font-semibold">{healthStatus}</span>
            </div>
          </div>

          <div className="bg-green-500 p-4 rounded-2xl shadow-md">
            <HeartPulse className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientInfoCard;
