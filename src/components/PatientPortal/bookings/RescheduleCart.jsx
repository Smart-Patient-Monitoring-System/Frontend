import { useState } from "react";

export default function RescheduleCart({
  appointment,
  availableSlots,
  onSubmit,
  onCancel,
}) {
  const [bookingDate, setBookingDate] = useState(appointment.bookingDate);
  const [bookingTime, setBookingTime] = useState(appointment.bookingTime);
  const [reason, setReason] = useState(appointment.reason || "");

  // Get available times for the selected date
  const timesForDate =
    availableSlots.find((slot) => slot.date === bookingDate)?.times || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      appointmentId: appointment.appointmentId,
      bookingDate,
      bookingTime,
      reason,
    });
  };

  return (
    <div className="border rounded p-4 shadow-md bg-white flex flex-col gap-2 mt-2">
      <h2 className="text-xl font-bold">Reschedule Appointment</h2>

      {/* Read-only fields */}
      <p>
        <strong>Doctor:</strong> {appointment.doctorName}
      </p>
      <p>
        <strong>Specialty:</strong> {appointment.specialty}
      </p>
      <p>
        <strong>Payment Amount:</strong> Rs.{appointment.consultationFee}
      </p>

      {/* Editable fields */}
      <div>
        <label className="block font-semibold">Reason / Notes:</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="border rounded p-1 w-full"
        />
      </div>

      {/* Date Selector */}
      <div>
        <label className="block font-semibold">Select Date:</label>
        <select
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="border rounded p-1 w-full"
        >
          {availableSlots.map((slot) => (
            <option key={slot.date} value={slot.date}>
              {slot.date}
            </option>
          ))}
        </select>
      </div>

      {/* Time Selector */}
      <div>
        <label className="block font-semibold">Select Time:</label>
        <select
          value={bookingTime}
          onChange={(e) => setBookingTime(e.target.value)}
          className="border rounded p-1 w-full"
        >
          {timesForDate.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={handleSubmit}
        >
          Confirm Reschedule
        </button>
        <button
          className="bg-gray-400 text-white px-3 py-1 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
