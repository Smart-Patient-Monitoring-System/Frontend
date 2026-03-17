import { useState, useEffect } from "react";
import BookingModal from "./BookingForm.jsx";
import AppointmentCard from "./PatientAppointmentCard.jsx";
import { getUserAppointments } from "../../../api/api.js";

export default function BookingsTab() {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchAppointments = async () => {
    try {
      const data = await getUserAppointments();
      setAppointments(data); // set state
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBookingSuccess = (appointment) => {
    // Add new appointment to list
    setAppointments((prev) => [...prev, appointment]);
  };

  const handleRemove = (id) => {
    setAppointments((prev) => prev.filter((a) => a.appointmentId !== id));
  };

  return (
    <div className="p-4">
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Book Appointment
      </button>

      {showModal && (
        <BookingModal
          setShowModal={setShowModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.appointmentId}
              appointment={appointment}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
