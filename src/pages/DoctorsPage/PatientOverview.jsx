import React from "react";
import {
  Search,
  Users,
  AlertCircle,
  TrendingUp,
  Wifi,
  Activity,
  Clock,
  Thermometer,
  Droplets,
  Eye,
} from "lucide-react";

function PatientOverview({
  searchQuery,
  setSearchQuery,
  statsData,
  patients,
}) {
  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Patients by Name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-3xl shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Statistics Boxes Section */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-sm text-gray-500 font-medium">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <div style={{ color: stat.color }}>{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Table Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Patient Overview
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Detailed patient monitoring data
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Heart Rate
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Temp
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  SpO₂
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {patients.map((patient, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">
                      {patient.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {patient.id} - {patient.age}
                    </div>
                  </td>

                  <td className="py-4 px-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    {patient.room}
                  </td>

                  <td className="py-4 px-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span
                      className={`font-medium ${
                        patient.heartRate.includes("145")
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}
                    >
                      {patient.heartRate}
                    </span>
                  </td>

                  <td className="py-4 px-4 flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    {patient.temp}
                  </td>

                  <td className="py-4 px-4 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    {patient.spO2}
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      patient.riskLevel === "High"
                        ? "bg-red-100 text-red-800"
                        : patient.riskLevel === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {patient.riskLevel}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      patient.status === "Critical"
                        ? "bg-red-100 text-red-800"
                        : patient.status === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {patient.status}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PatientOverview;
