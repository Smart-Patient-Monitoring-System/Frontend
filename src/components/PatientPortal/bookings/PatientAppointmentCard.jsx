import { useState } from "react";
import RescheduleCart from "./RescheduleCart"; // Import the reschedule cart we created

export default function AppointmentCard({
  appointment,
  availableSlots,
  onRemove,
  onReschedule,
}) {
  const [error, setError] = useState("");
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [rescheduleMode, setRescheduleMode] = useState(false);

  // Open Zoom link
  const handleZoomClick = () => {
    if (appointment.locationOrLink?.startsWith("https://")) {
      window.open(appointment.locationOrLink, "_blank");
      setError("");
    } else {
      setError("Zoom link is invalid or not available. Please contact us.");
    }
  };

  // Cancel appointment confirmation
  const handleCancelClick = () => {
    setCancelConfirm(true);
  };

  const confirmCancel = () => {
    if (onRemove) {
      onRemove(appointment.appointmentId);
    }
    setCancelConfirm(false);
  };

  return (
    <div className="border rounded p-4 shadow-md bg-white flex flex-col gap-2">
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

      {/* Zoom Button */}
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

      {/* Cancel & Reschedule Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          className="bg-yellow-500 text-white px-2 py-1 rounded"
          onClick={handleCancelClick}
        >
          Cancel Appointment
        </button>
        <button
          className="bg-green-500 text-white px-2 py-1 rounded"
          onClick={() => setRescheduleMode(true)}
        >
          Reschedule Appointment
        </button>
      </div>

      {/* Cancel Confirmation */}
      {cancelConfirm && (
        <div className="mt-2 p-2 border rounded bg-red-50">
          <p className="text-red-600 font-semibold">
            We understand plans can change. You can reschedule your appointment
            at no additional cost. Cancelling the appointment will not refund
            your payment.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={confirmCancel}
            >
              Yes, Cancel
            </button>
            <button
              className="bg-gray-400 text-white px-3 py-1 rounded"
              onClick={() => {
                setCancelConfirm(false);
                setRescheduleMode(true);
              }}
            >
              Reschedule Appointment
            </button>
          </div>
        </div>
      )}

      {/* Reschedule Cart */}
      {rescheduleMode && (
        <RescheduleCart
          appointment={appointment}
          availableSlots={availableSlots}
          onSubmit={onReschedule}
          onCancel={() => setRescheduleMode(false)}
        />
      )}
    </div>
  );
}
