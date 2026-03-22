import React, { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  Save,
  CheckCircle,
  ExternalLink,
  Loader2,
  UserCircle
} from "lucide-react";
import { confirmAppointmentDoctor, confirmAppointment } from "../../../api/api.js";

export default function AppointmentsTable({ appointments, isAdminView, isDoctorView, refreshData }) {
  const [links, setLinks] = useState({});
  const [loadingIds, setLoadingIds] = useState(new Set());

  const handleLinkChange = (id, value) => {
    setLinks((prev) => ({ ...prev, [id]: value }));
  };

  const handleConfirm = async (apt) => {
    try {
      // If it's already confirmed, they might just be updating the link
      const linkValue = links[apt.appointmentId] || apt.locationOrLink;
      if (!linkValue) return alert("Please enter a link or location");

      // Set loading state for this specific row
      setLoadingIds(prev => new Set(prev).add(apt.appointmentId));

      const params =
        apt.appointmentType === "Physical"
          ? { physicalLocation: linkValue }
          : { zoomLink: linkValue };

      if (isAdminView) {
        // use admin API
        await confirmAppointment(apt.appointmentId, params);
      } else {
        // use doctor API
        await confirmAppointmentDoctor(apt.appointmentId, params);
      }
      
      refreshData();
    } catch (err) {
      console.error("Confirm error:", err);
      alert("Failed to confirm appointment");
    } finally {
      // Remove loading state
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(apt.appointmentId);
        return next;
      });
    }
  };

  if (!appointments || appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-900 font-medium text-lg mb-1">No appointments found</h3>
        <p className="text-gray-500 text-sm">When bookings are made, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Patient Details</th>
              {isAdminView && <th className="px-6 py-4">Doctor</th>}
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 min-w-[250px]">Link / Location</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((apt, index) => {
              const dateObj = new Date(apt.bookingDate);
              const formattedDate = !Number.isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString("en-CA") // YYYY-MM-DD
                : apt.bookingDate;

              const timeText = apt.bookingTime ? apt.bookingTime.slice(0, 5) : "—";
              const isOnline = String(apt.appointmentType || "").toLowerCase() === "online";
              const isPending = apt.appointmentStatus === "PENDING";
              
              const currentLinkValue = links[apt.appointmentId] !== undefined 
                ? links[apt.appointmentId] 
                : (apt.locationOrLink || "");

              const isLoading = loadingIds.has(apt.appointmentId);

              return (
                <tr key={apt.appointmentId || apt.id} className="hover:bg-gray-50 transition-colors">
                  {/* Index */}
                  <td className="px-6 py-5 text-gray-500">{index + 1}</td>

                  {/* Patient Info */}
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <UserCircle className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">
                          {apt.patientName || "Unknown Patient"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-[150px]" title={apt.reason}>
                          {apt.reason || "No reason"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Doctor Info (Admin View Only) */}
                  {isAdminView && (
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-800">{apt.doctorName || "—"}</p>
                      <p className="text-xs text-gray-500">{apt.specialty}</p>
                    </td>
                  )}

                  {/* Date */}
                  <td className="px-6 py-5 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formattedDate}
                    </div>
                  </td>

                  {/* Time */}
                  <td className="px-6 py-5 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {timeText}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-5">
                    <span 
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                        ${isOnline 
                          ? "bg-purple-50 text-purple-700 border border-purple-100" 
                          : "bg-blue-50 text-blue-700 border border-blue-100"}`}
                    >
                      {isOnline ? <Video className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      {apt.appointmentType}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span 
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium 
                        ${isPending 
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-100" 
                          : "bg-green-50 text-green-700 border border-green-100"}`}
                    >
                      {isPending ? <Clock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      {apt.appointmentStatus}
                    </span>
                  </td>

                  {/* Link / Location Input */}
                  <td className="px-6 py-5">
                    {apt.paymentStatus !== "SUCCESS" && isPending ? (
                      <p className="text-xs text-gray-400 italic">Waiting for Payment</p>
                    ) : (
                      <div className="flex flex-col gap-1.5 w-full max-w-[280px]">
                        {!isPending && apt.locationOrLink && (
                          <div className="flex items-center justify-between mb-1">
                            <a 
                              href={apt.locationOrLink.startsWith("http") ? apt.locationOrLink : `https://${apt.locationOrLink}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              {isOnline ? "Open Link" : "View Location"}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={isOnline ? "Paste Zoom/Meet link..." : "Enter location..."}
                            value={currentLinkValue}
                            onChange={(e) => handleLinkChange(apt.appointmentId, e.target.value)}
                            className="flex-1 min-w-[180px] bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          />
                          <button 
                            onClick={() => handleConfirm(apt)}
                            title="Save Link"
                            className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-center">
                    {(isPending || apt.locationOrLink !== currentLinkValue) ? (
                      <button
                        onClick={() => handleConfirm(apt)}
                        disabled={isLoading || apt.paymentStatus !== "SUCCESS"}
                        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all
                          ${apt.paymentStatus !== "SUCCESS" 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : "bg-white border border-green-200 text-green-600 hover:bg-green-50 shadow-sm"}`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            {isPending ? "Confirm" : "Update"}
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-sm font-medium text-green-600 flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Confirmed
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
