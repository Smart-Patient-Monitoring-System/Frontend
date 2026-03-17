import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Video,
  MapPin,
  CheckCircle,
  AlertCircle,
  Link2,
  Save,
  ExternalLink,
} from "lucide-react";

const API_BASE = "http://localhost:8088";

export default function DoctorBookingsPage({ doctorEmail }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingLink, setEditingLink] = useState({}); // { appointmentId: "link" }

  useEffect(() => {
    if (!doctorEmail) return;
    fetchAppointments();
  }, [doctorEmail]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/doctor/appointments/by-email?email=${encodeURIComponent(
          doctorEmail
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to load appointments");
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Could not load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLink = async (appointmentId) => {
    const link = editingLink[appointmentId];
    if (!link || !link.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/doctor/appointments/${appointmentId}/link`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ link: link.trim() }),
        }
      );
      if (!res.ok) throw new Error("Failed to save link");
      // Refresh
      await fetchAppointments();
      setEditingLink((prev) => {
        const copy = { ...prev };
        delete copy[appointmentId];
        return copy;
      });
    } catch (e) {
      alert("Error saving meeting link: " + e.message);
    }
  };

  const handleConfirm = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/doctor/appointments/${appointmentId}/confirm`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to confirm");
      await fetchAppointments();
    } catch (e) {
      alert("Error confirming appointment: " + e.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Confirmed
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  const getTypeBadge = (type) => {
    const isOnline = type?.toLowerCase() === "online";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isOnline
            ? "bg-purple-100 text-purple-700 border border-purple-200"
            : "bg-blue-100 text-blue-700 border border-blue-200"
        }`}
      >
        {isOnline ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
        {isOnline ? "Online" : "Physical"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">My Appointments</h2>
            <p className="text-gray-500 text-sm mt-1">
              View and manage patient bookings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-500">Total</span>
              <span className="ml-2 text-lg font-bold text-blue-600">
                {appointments.length}
              </span>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-500">Confirmed</span>
              <span className="ml-2 text-lg font-bold text-green-600">
                {
                  appointments.filter(
                    (a) => a.appointmentStatus?.toUpperCase() === "CONFIRMED"
                  ).length
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">{error}</div>
      )}

      {appointments.length === 0 && !error && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No Appointments Yet</h3>
          <p className="text-gray-400 text-sm mt-2">
            Appointments booked by patients will appear here.
          </p>
        </div>
      )}

      {/* Appointments Table */}
      {appointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Meeting Link
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {appointments.map((appt, index) => {
                  const isOnline =
                    appt.appointmentType?.toLowerCase() === "online";
                  const hasLink =
                    appt.locationOrLink &&
                    appt.locationOrLink.startsWith("http");

                  return (
                    <tr key={appt.appointmentId} className="hover:bg-gray-50">
                      {/* # */}
                      <td className="py-4 px-4 text-gray-500 font-medium">
                        {index + 1}
                      </td>

                      {/* Patient */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {appt.patientName || "Unknown Patient"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {appt.reason || "-"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {appt.bookingDate || "-"}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {appt.bookingTime
                            ? appt.bookingTime.substring(0, 5)
                            : "-"}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4">
                        {getTypeBadge(appt.appointmentType)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {getStatusBadge(appt.appointmentStatus)}
                      </td>

                      {/* Meeting Link */}
                      <td className="py-4 px-4">
                        {isOnline ? (
                          <div className="flex flex-col gap-2">
                            {hasLink ? (
                              <a
                                href={appt.locationOrLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Open Link
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400 italic">
                                No link set
                              </span>
                            )}

                            {/* Link input */}
                            <div className="flex items-center gap-1">
                              <input
                                type="url"
                                placeholder="Paste Zoom/Meet link..."
                                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={
                                  editingLink[appt.appointmentId] ??
                                  appt.locationOrLink ??
                                  ""
                                }
                                onChange={(e) =>
                                  setEditingLink((prev) => ({
                                    ...prev,
                                    [appt.appointmentId]: e.target.value,
                                  }))
                                }
                              />
                              <button
                                onClick={() =>
                                  handleSaveLink(appt.appointmentId)
                                }
                                className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                                title="Save Link"
                              >
                                <Save className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {appt.locationOrLink || "Physical Visit"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4">
                        {appt.appointmentStatus?.toUpperCase() !== "CONFIRMED" &&
                          appt.appointmentStatus?.toUpperCase() !== "COMPLETED" && (
                            <button
                              onClick={() => handleConfirm(appt.appointmentId)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm font-medium"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Confirm
                            </button>
                          )}
                        {appt.appointmentStatus?.toUpperCase() === "CONFIRMED" && (
                          <span className="text-sm text-green-600 font-medium">
                            ✓ Confirmed
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
      )}
    </div>
  );
}
