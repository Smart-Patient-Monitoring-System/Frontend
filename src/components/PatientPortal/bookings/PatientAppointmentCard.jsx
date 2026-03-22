import { useState } from "react";
import { 
  Stethoscope, 
  Video, 
  User, 
  Calendar, 
  Clock, 
  Info, 
  CreditCard, 
  Trash2, 
  ExternalLink 
} from "lucide-react";

export default function AppointmentCard({ appointment, onRemove }) {
  const [error, setError] = useState("");

  const handleZoomClick = () => {
    if (
      appointment.locationOrLink &&
      appointment.locationOrLink.startsWith("http")
    ) {
      window.open(appointment.locationOrLink, "_blank");
      setError("");
    } else if (appointment.locationOrLink) {
      window.open(`https://${appointment.locationOrLink}`, "_blank");
      setError("");
    } else {
      setError("Zoom link is invalid or not available.");
    }
  };

  const isOnline = String(appointment.appointmentType || "").toLowerCase() === "online";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow">
      {/* Header: Doctor Info & Type Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-gray-900 font-bold text-lg leading-tight">
              {appointment.doctorName || "Unknown Doctor"}
            </h3>
            <p className="text-gray-500 text-sm">{appointment.specialty || "General"}</p>
          </div>
        </div>

        {/* Online / Physical Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${isOnline ? 'bg-purple-50 text-purple-700' : 'bg-orange-50 text-orange-700'}`}>
          {isOnline ? <Video className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
          {appointment.appointmentType || "Online"}
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-3 mb-6">
        {/* Date & Time Row */}
        <div className="flex items-center text-sm text-gray-700">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 flex justify-center"><Calendar className="w-4 h-4 text-gray-400" /></div>
            <span className="font-medium text-gray-900">{appointment.bookingDate || "—"}</span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 flex justify-center"><Clock className="w-4 h-4 text-gray-400" /></div>
            <span className="font-medium text-gray-900">{appointment.bookingTime ? appointment.bookingTime.slice(0, 5) : "—"}</span>
          </div>
        </div>

        {/* Reason Row */}
        <div className="flex items-center text-sm text-gray-700">
          <div className="w-6 flex items-center justify-center"><Info className="w-4 h-4 text-gray-400" /></div>
          <span className="text-gray-500 ml-2 uppercase text-xs tracking-wider">REASON:</span>
          <span className="ml-1 text-gray-800">{appointment.reason || "N/A"}</span>
        </div>

        {/* Fee Row */}
        <div className="flex items-center text-sm text-gray-700">
          <div className="w-6 flex items-center justify-center"><CreditCard className="w-4 h-4 text-gray-400" /></div>
          <span className="text-gray-500 ml-2 uppercase text-xs tracking-wider">FEE:</span>
          <span className="ml-1 text-gray-900 font-bold">Rs. {appointment.consultationFee || "0"}</span>
        </div>
      </div>

      {/* Status Badges Row */}
      <div className="flex gap-2 mb-6">
        <div className={`px-2.5 py-1 text-xs font-bold rounded border ${
          appointment.appointmentStatus === 'PENDING' ? 'border-orange-200 text-orange-700 bg-orange-50/50' : 
          appointment.appointmentStatus === 'CONFIRMED' ? 'border-green-200 text-green-700 bg-green-50/50' : 
          'border-gray-200 text-gray-700 bg-gray-50/50'
        }`}>
          APPT: {appointment.appointmentStatus || "PENDING"}
        </div>
        
        <div className={`px-2.5 py-1 text-xs font-bold rounded border ${
          appointment.paymentStatus === 'SUCCESS' ? 'border-green-200 text-green-700 bg-green-50/50' : 
          appointment.paymentStatus === 'FAILED' ? 'border-red-200 text-red-700 bg-red-50/50' : 
          'border-orange-200 text-orange-700 bg-orange-50/50'
        }`}>
          PAY: {appointment.paymentStatus || "PENDING"}
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex items-center justify-between mt-auto pt-2">
        {onRemove ? (
          <button 
            onClick={() => onRemove(appointment.appointmentId)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove Appointment"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        ) : (
          <div /> /* Spacer */
        )}

        {appointment.locationOrLink ? (
          <button
            onClick={handleZoomClick}
            className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            {isOnline ? "Join Zoom" : "View Location"}
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-500 font-medium rounded-lg bg-gray-50 text-sm">
            <Clock className="w-4 h-4" />
            Link Pending
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}
