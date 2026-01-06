import { useState, useEffect } from "react";
import { X, Video, Phone, Building } from "lucide-react";

// Doctor fees
const doctorFees = {
  "dr-chen": 2500,
  "dr-torres": 3000,
  "dr-williams": 2800,
};

// Doctor-specific time slots
const doctorTimeSlots = {
  "dr-chen": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM"],
  "dr-torres": ["02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM"],
  "dr-williams": ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
};

const NewBookingModal = ({ setShowNewBooking }) => {
  const [bookingData, setBookingData] = useState({
    specialty: "",
    doctor: "",
    date: "",
    time: "",
    type: "In-Person",
    reason: "",

    // Payment-related fields
    consultationFee: 0,
    serviceFee: 0,
    totalAmount: 0,
    paymentStatus: "PENDING",
  });

  const [availableTimes, setAvailableTimes] = useState([]);

  const specialties = [
    "Cardiology",
    "General Medicine",
    "Endocrinology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  // Update payment summary based on doctor & type
  useEffect(() => {
    if (bookingData.doctor) {
      const consultationFee = doctorFees[bookingData.doctor] || 0;
      const serviceFee = bookingData.type === "In-Person" ? 0 : 300;
      const total = consultationFee + serviceFee;

      setBookingData((prev) => ({
        ...prev,
        consultationFee,
        serviceFee,
        totalAmount: total,
      }));
    } else {
      setBookingData((prev) => ({
        ...prev,
        consultationFee: 0,
        serviceFee: 0,
        totalAmount: 0,
      }));
    }
  }, [bookingData.doctor, bookingData.type]);

  // Update available time slots based on doctor
  useEffect(() => {
    if (bookingData.doctor) {
      setAvailableTimes(doctorTimeSlots[bookingData.doctor] || []);
    } else {
      setAvailableTimes([]);
    }
  }, [bookingData.doctor]);

  const handleSubmit = () => {
    console.log("Booking data:", bookingData);
    alert("Appointment request submitted successfully!");
    setShowNewBooking(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-5 flex justify-between items-center rounded-t-xl sm:rounded-t-2xl">
          <h2 className="text-xl sm:text-2xl font-bold">
            Book New Appointment
          </h2>
          <button
            onClick={() => setShowNewBooking(false)}
            className="p-2 rounded-full hover:bg-blue-800 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
          {/* Specialty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialty
            </label>
            <select
              name="specialty"
              value={bookingData.specialty}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select specialty...</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Doctor (Optional)
            </label>
            <select
              name="doctor"
              value={bookingData.doctor}
              onChange={handleChange}
              disabled={!bookingData.specialty}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Any available doctor</option>
              <option value="dr-chen">Dr. Emily Chen</option>
              <option value="dr-torres">Dr. Michael Torres</option>
              <option value="dr-williams">Dr. Sarah Williams</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={bookingData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Time
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      setBookingData((prev) => ({ ...prev, time }))
                    }
                    className={`px-2 py-2 rounded text-sm ${
                      bookingData.time === time
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                ))
              ) : (
                <p className="text-gray-400 text-sm col-span-full">
                  Select a doctor to see available times
                </p>
              )}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {["In-Person", "Video Call", "Phone Call"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setBookingData((prev) => ({ ...prev, type }))}
                  className={`px-3 py-2 rounded text-sm flex items-center gap-1 ${
                    bookingData.type === type
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {type === "In-Person" && <Building className="w-4 h-4" />}
                  {type === "Video Call" && <Video className="w-4 h-4" />}
                  {type === "Phone Call" && <Phone className="w-4 h-4" />}
                  <span>{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason
            </label>
            <textarea
              name="reason"
              value={bookingData.reason}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded px-3 py-2"
              placeholder="Describe your reason..."
            />
          </div>

          {/* Payment Summary (only if doctor selected) */}
          {bookingData.doctor && (
            <div className="border-t pt-4">
              <h3 className="text-md font-bold text-gray-800 mb-3">
                Payment Summary
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-semibold">
                    LKR {bookingData.consultationFee}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold">
                    LKR {bookingData.serviceFee}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">
                    LKR {bookingData.totalAmount}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Payment Status</span>
                  <span>{bookingData.paymentStatus}</span>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewBooking(false)}
              className="flex-1 border px-3 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white rounded px-3 py-2"
            >
              Pay Now & Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBookingModal;
