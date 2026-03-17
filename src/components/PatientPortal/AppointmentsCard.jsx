import { useEffect, useState } from "react";
import { Activity, Video, User } from "lucide-react";
import BookingModal from "../../components/PatientPortal/bookings/BookingPage";
import { getUserAppointments, confirmAppointmentDoctor } from "../../api/api.js";

const AppointmentsCard = ({ isDoctorView = false }) => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState({});

  const handleLinkChange = (id, value) => {
    setLinks((prev) => ({ ...prev, [id]: value }));
  };

  const handleConfirm = async (apt) => {
    try {
      const linkValue = links[apt.appointmentId];
      if (!linkValue) return alert("Please enter a link or location");

      const params =
        apt.appointmentType === "Physical"
          ? { physicalLocation: linkValue }
          : { zoomLink: linkValue };

      await confirmAppointmentDoctor(apt.appointmentId, params);
      alert("Appointment confirmed and link sent!");
      fetchAppointments();
    } catch (err) {
      console.error("Confirm error:", err);
      alert("Failed to confirm appointment");
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getUserAppointments(); // backend call
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // when booking is successful, add to list instantly
  const handleBookingSuccess = (newAppointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const formatDateTime = (bookingDate, bookingTime) => {
    if (!bookingDate) return "—";

    // bookingDate: "2024-12-05"
    // bookingTime: "10:30:00"
    const time = bookingTime ? bookingTime.slice(0, 5) : "00:00";
    const dt = new Date(`${bookingDate}T${time}:00`);

    if (Number.isNaN(dt.getTime())) {
      // fallback if parsing fails
      return `${bookingDate}${bookingTime ? ` at ${time}` : ""}`;
    }

    return dt.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getIconType = (appointmentType) => {
    // Online => video icon, Physical => user icon
    return String(appointmentType || "").toLowerCase() === "online" ? "video" : "user";
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
            <span className="hidden sm:inline">Upcoming Appointments</span>
            <span className="sm:hidden">Appointments</span>
          </h2>
        </div>

        {/* + button (hidden for doctors) */}
        {!isDoctorView && (
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-500 hover:text-blue-600 p-1 sm:p-0"
            aria-label="Book Appointment"
            type="button"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <BookingModal setShowModal={setShowModal} onBookingSuccess={handleBookingSuccess} />
      )}

      {/* Body */}
      {loading ? (
        <p className="text-sm text-gray-500">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-sm text-gray-500">No appointments found.</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {appointments.map((apt) => {
            const icon = getIconType(apt.appointmentType);
            const dateText = formatDateTime(apt.bookingDate, apt.bookingTime);

            return (
              <div
                key={apt.appointmentId}
                className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4"
              >
                <div className="bg-blue-500 rounded-lg p-2 sm:p-2.5 md:p-3 flex-shrink-0 flex items-center justify-center">
                  {icon === "video" ? (
                    <Video className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-gray-800 mb-1 truncate">
                    {apt.doctorName || "Doctor"}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">
                    {apt.specialty || "—"}
                    {apt.appointmentType ? ` • ${apt.appointmentType}` : ""}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{dateText}</p>

                  {/* Zoom Link Display for Patient / Admin */}
                  {apt.locationOrLink && (
                    <div className="mt-2">
                      <a
                        href={apt.locationOrLink.startsWith("http") ? apt.locationOrLink : `https://${apt.locationOrLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md text-xs font-semibold"
                      >
                        {apt.appointmentType === "Physical" ? "View Location" : "Join Zoom"}
                      </a>
                    </div>
                  )}

                  {/* Doctor Confirmation Input */}
                  {isDoctorView &&
                    apt.appointmentStatus === "PENDING" &&
                    apt.paymentStatus === "SUCCESS" && (
                      <div className="mt-3 flex flex-col gap-2 relative z-10">
                        <input
                          type="text"
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                          placeholder={
                            apt.appointmentType === "Physical"
                              ? "Enter location"
                              : "Enter meeting link (Zoom, Meet)"
                          }
                          value={links[apt.appointmentId] || ""}
                          onChange={(e) =>
                            handleLinkChange(apt.appointmentId, e.target.value)
                          }
                        />
                        <button
                          onClick={() => handleConfirm(apt)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs w-fit transition-colors"
                        >
                          Confirm & Send Link
                        </button>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentsCard;
