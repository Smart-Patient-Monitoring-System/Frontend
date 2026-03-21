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
        setAppointmentTypes(types || []);
        if (types?.length) setSelectedTypeId(types[0].id);
      } catch (err) {
        console.error("Failed to fetch appointment types:", err);
      }
    };
    fetchTypes();
  }, []);

  const handleBooking = async () => {
    if (
      !selectedDoctor ||
      !date ||
      !selectedTime ||
      !reason ||
      !selectedTypeId
    ) {
      return alert("Please fill all fields (including appointment type)");
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
      console.log("BOOKING ERROR FULL:", err);
      console.log("BOOKING ERROR DATA:", err.response?.data);
      alert(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Error booking appointment",
      );
    }
  };

  const handlePayNow = () => {
    if (!appointmentId) return alert("Please book first!");
    const fee = Number(selectedDoctor.consultationFee || 0).toFixed(2);
    window.location.href = `http://localhost:8080/api/payments/pay/${appointmentId}?amount=${fee}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      {/* Modal */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 border border-gray-200">
        <h2 className="text-xl md:text-2xl font-semibold mb-5 text-gray-800">
          Book Appointment
        </h2>

        <div className="space-y-4">
          {/* Doctor Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select Doctor
            </label>
            <DoctorSelect
              selectedDoctor={selectedDoctor}
              setSelectedDoctor={setSelectedDoctor}
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Choose Date
            </label>

            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Choose Time
            </label>

            <TimeSlotPicker
              doctorId={selectedDoctor?.id}
              date={date}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
            />
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Appointment Type
            </label>

            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              value={selectedTypeId ?? ""}
              onChange={(e) => setSelectedTypeId(Number(e.target.value))}
            >
              <option value="" disabled>
                -- Choose appointment type --
              </option>

              {appointmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.typeName}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Reason for Visit
            </label>

            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
              rows="3"
              placeholder="Describe your reason for visit"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Payment Status */}
          {appointmentId && (
            <p className="mt-2 font-medium text-gray-700">
              Payment Status:{" "}
              <span
                className={
                  paymentStatus === "SUCCESS"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {paymentStatus}
              </span>
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={() => setShowModal(false)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          {!appointmentId ? (
            <button
              onClick={handleBooking}
              className="w-full sm:w-auto bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Book
            </button>
          ) : (
            <button
              onClick={handlePayNow}
              className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
