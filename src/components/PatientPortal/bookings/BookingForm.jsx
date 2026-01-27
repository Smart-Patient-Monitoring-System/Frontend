import { useState, useEffect } from "react";
import DoctorSelect from "./BookingDoctorSelect.jsx";
import TimeSlotPicker from "./SpecialTimeSlotPicker.jsx";
import { getAppointmentTypes, bookAppointment } from "../../../api/api.js";

export default function BookingModal({ setShowModal, onBookingSuccess }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTypeId, setSelectedTypeId] = useState(null);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [reason, setReason] = useState("");
  const [appointmentId, setAppointmentId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getAppointmentTypes();
        setAppointmentTypes(types);
        if (types.length > 0) setSelectedTypeId(types[0].id);
      } catch (err) {
        console.error("Failed to fetch appointment types:", err);
      }
    };
    fetchTypes();
  }, []);

  const handleBooking = async () => {
    if (!selectedDoctor || !date || !selectedTime || !reason) {
      return alert("Please fill all fields");
    }

    const appointmentData = {
      doctorId: selectedDoctor.id,
      appointmentTypeId: selectedTypeId,
      bookingDate: date,
      bookingTime: selectedTime,
      reason,
    };

    try {
      const response = await bookAppointment(appointmentData);
      const id = response.id || response.appointmentId;
      if (!id) return alert("Backend did not return appointment ID");

      setAppointmentId(id);
      setPaymentStatus("PENDING");

      onBookingSuccess({
        appointmentId: id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        consultationFee: selectedDoctor.consultationFee,
        appointmentType: appointmentTypes.find((t) => t.id === selectedTypeId)
          ?.typeName,
        bookingDate: date,
        bookingTime: selectedTime,
        reason,
        paymentStatus: "PENDING",
      });

      alert("Appointment booked successfully! Click 'Pay Now' to pay.");
    } catch (err) {
      console.error(err);
      alert("Error booking appointment");
    }
  };

  const handlePayNow = () => {
    if (!appointmentId) return alert("Please book first!");
    const fee = Number(selectedDoctor.consultationFee || 0).toFixed(2);
    window.location.href = `http://localhost:8080/api/payments/pay/${appointmentId}?amount=${fee}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-xl p-6">
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

        <DoctorSelect
          selectedDoctor={selectedDoctor}
          setSelectedDoctor={setSelectedDoctor}
        />

        <input
          type="date"
          className="w-full border p-2 mt-3"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
        />

        <TimeSlotPicker
          doctorId={selectedDoctor?.id}
          date={date}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        <select
          className="w-full border p-2 mt-3"
          value={selectedTypeId || ""}
          onChange={(e) => setSelectedTypeId(Number(e.target.value))}
        >
          {appointmentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.typeName}
            </option>
          ))}
        </select>

        <textarea
          className="w-full border p-2 mt-3"
          rows="3"
          placeholder="Reason for visit"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        {appointmentId && (
          <p className="mt-2 font-medium">
            Payment Status:{" "}
            <span
              className={
                paymentStatus === "SUCCESS" ? "text-green-600" : "text-red-600"
              }
            >
              {paymentStatus}
            </span>
          </p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          {!appointmentId ? (
            <button
              onClick={handleBooking}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Book
            </button>
          ) : (
            <button
              onClick={handlePayNow}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
