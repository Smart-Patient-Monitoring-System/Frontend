import { useState } from "react";
import { 
  Calendar, Clock, Video, MapPin, 
  CreditCard, Stethoscope, AlertCircle, 
  Trash2, ExternalLink 
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
    } else {
      setError("Zoom link is invalid or not available. Please contact support.");
    }
  };

  const isOnline = appointment.appointmentType?.toLowerCase() === "online";
  
  const statusColor = 
    appointment.appointmentStatus?.toUpperCase() === 'CONFIRMED' ? 'text-green-700 bg-green-50 border-green-200' :
    appointment.appointmentStatus?.toUpperCase() === 'COMPLETED' ? 'text-blue-700 bg-blue-50 border-blue-200' :
    'text-orange-700 bg-orange-50 border-orange-200';

  const paymentColor = 
    appointment.paymentStatus?.toUpperCase() === 'SUCCESS' ? 'text-green-700 bg-green-50 border-green-200' :
    'text-orange-700 bg-orange-50 border-orange-200';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
      {/* Header: Doctor Info & Type */}
      <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50/80 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <Stethoscope className="w-6 h-6 shrink-0" />
          </div>
          <div>
            <h3 className="text-[1.1rem] font-bold text-gray-900 leading-tight tracking-tight">
              {appointment.doctorName}
            </h3>
            <p className="text-[13px] font-medium text-gray-500 mt-0.5">
              {appointment.specialty}
            </p>
          </div>
        </div>
        
        <span className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${isOnline ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
          {isOnline ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
          {appointment.appointmentType}
        </span>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-[13.5px] text-gray-700 mb-5 flex-grow">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gray-50 rounded-md text-gray-400"><Calendar className="w-4 h-4" /></div>
          <span className="font-semibold text-gray-900">{appointment.bookingDate}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-gray-50 rounded-md text-gray-400"><Clock className="w-4 h-4" /></div>
          <span className="font-semibold text-gray-900">{appointment.bookingTime?.substring(0, 5)}</span>
        </div>
        
        <div className="flex items-center gap-2.5 col-span-2">
          <div className="p-1.5 bg-gray-50 rounded-md text-gray-400"><AlertCircle className="w-4 h-4" /></div>
          <span className="text-gray-700 line-clamp-1 truncate pr-2" title={appointment.reason}>
            <span className="text-gray-400 mr-1.5 text-xs font-medium uppercase tracking-wider">Reason:</span>
            {appointment.reason || 'N/A'}
          </span>
        </div>
        <div className="flex items-center gap-2.5 col-span-2">
          <div className="p-1.5 bg-gray-50 rounded-md text-gray-400"><CreditCard className="w-4 h-4" /></div>
          <span className="text-gray-700">
            <span className="text-gray-400 mr-1.5 text-xs font-medium uppercase tracking-wider">Fee:</span>
            <span className="font-bold text-gray-900">Rs. {appointment.consultationFee}</span>
          </span>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${statusColor}`}>
          Appt: {appointment.appointmentStatus}
        </span>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${paymentColor}`}>
          Pay: {appointment.paymentStatus}
        </span>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-gray-50">
        {onRemove ? (
          <button
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            onClick={() => onRemove(appointment.appointmentId)}
            title="Cancel Appointment"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        ) : <div />}
        
        <div className="flex-1 flex justify-end">
          {isOnline ? (
            appointment.locationOrLink && appointment.locationOrLink.startsWith("http") ? (
              <button
                onClick={handleZoomClick}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-[0_2px_10px_rgb(59,130,246,0.3)] hover:shadow-[0_4px_15px_rgb(59,130,246,0.4)] transition-all active:scale-[0.98]"
              >
                <ExternalLink className="w-4 h-4" />
                Join Zoom
              </button>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-gray-50 text-gray-500 text-sm font-medium rounded-xl border border-gray-200/60">
                <Clock className="w-4 h-4 opacity-70" />
                Link Pending
              </span>
            )
          ) : (
            <div className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200/60">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[150px]" title={appointment.locationOrLink || "Physical Visit"}>
                {appointment.locationOrLink || "Physical"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
           <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
           <p className="text-red-700 text-[13px] font-medium leading-tight">{error}</p>
        </div>
      )}
    </div>
  );
}
