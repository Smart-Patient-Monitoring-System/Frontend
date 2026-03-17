import { useState } from "react";

export default function AppointmentCard({ appointment, onRemove }) {
  const [error, setError] = useState("");

  const handleZoomClick = () => {
    if (
      appointment.locationOrLink &&
      appointment.locationOrLink.startsWith("https://")
    ) {
      // Open the link in a new tab
      window.open(appointment.locationOrLink, "_blank");
      setError(""); // Clear any previous error
    } else {
      setError("Zoom link is invalid or not available.Please contact us ");
    }
  };

  return (
    <div className="border rounded p-4 shadow-md bg-white flex flex-col gap-1">
      <h3 className="text-lg font-bold">{appointment.doctorName}</h3>
      <p>
        <strong>Specialty:</strong> {appointment.specialty}
      </p>
      <p>
        <strong>Type:</strong> {appointment.appointmentType}
      </p>
      <p>
        <strong>Consultation Fee:</strong> Rs.{appointment.consultationFee}
      </p>
      <p>
        <strong>Date:</strong> {appointment.bookingDate}
      </p>
      <p>
        <strong>Time:</strong> {appointment.bookingTime}
      </p>
      <p>
        <strong>Reason:</strong> {appointment.reason}
      </p>
      <p>
        <strong>Payment Status:</strong> {appointment.paymentStatus}
      </p>
      <p>
        <strong>Appointment Status:</strong> {appointment.appointmentStatus}
      </p>

      {/* Zoom Link / Location */}
      {appointment.locationOrLink ? (
        <button
          onClick={handleZoomClick}
          className="inline-block mt-1 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Join Zoom
        </button>
      ) : (
        <p>
          <strong>Location / Link:</strong> N/A
        </p>
      )}

      {error && <p className="text-red-500 mt-1">{error}</p>}

      {onRemove && (
        <button
          className="mt-2 bg-red-500 text-white px-2 py-1 rounded w-fit"
          onClick={() => onRemove(appointment.appointmentId)}
        >
          Remove
        </button>
      )}
    </div>
  );
}
