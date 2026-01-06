import { Calendar, Clock, Video, Phone, Building } from "lucide-react";

const AppointmentCard = ({ appointment, activeView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    if (type === "Video Call")
      return <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    if (type === "Phone Call")
      return <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    return <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <img
          src={appointment.avatar}
          alt={appointment.doctorName}
          className="w-12 h-12 rounded-full border-2 border-blue-200"
        />
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <div>
              <h3 className="font-bold">{appointment.doctorName}</h3>
              <p className="text-gray-600 text-sm">{appointment.specialty}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-s font-semibold border ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              {formatDate(appointment.date)}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              {appointment.time} ({appointment.duration})
            </div>
            <div className="flex items-center gap-2">
              {getTypeIcon(appointment.type)}
              {appointment.type}
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              {appointment.location}
            </div>
          </div>

          <div className="bg-blue-50 p-2 rounded mb-2 text-gray-700">
            <span className="font-semibold">Reason: </span>
            {appointment.reason}
          </div>

          {activeView === "upcoming" ? (
            <div className="flex gap-2">
              {appointment.type === "Video Call" && (
                <button className="flex-1 bg-blue-600 text-white rounded px-3 py-2 flex items-center justify-center gap-2">
                  <Video className="w-4 h-4" /> Join Call
                </button>
              )}
              <button className="flex-1 border-2 border-gray-300 rounded px-3 py-2 text-gray-700">
                Reschedule
              </button>
              <button className="border-2 border-red-300 rounded px-3 py-2 text-red-600">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white rounded px-3 py-2">
                Book Again
              </button>
              <button className="flex-1 border-2 border-gray-300 rounded px-3 py-2 text-gray-700">
                View Summary
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
