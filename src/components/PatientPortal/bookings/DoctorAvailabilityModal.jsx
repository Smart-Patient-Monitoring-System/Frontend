import React, { useEffect, useState } from "react";
import {
  saveAvailability,
  getAvailableSlots,
  deleteAvailabilitySlot,
} from "../../../api/api";

// Generate 30-min slots between 8:00 AM to 11:00 PM
const generateSlots = () => {
  const slots = [];
  let start = 8 * 60; // 8:00 AM in minutes
  const end = 23 * 60; // 11:00 PM in minutes

  while (start <= end) {
    const h = String(Math.floor(start / 60)).padStart(2, "0");
    const m = String(start % 60).padStart(2, "0");
    slots.push(`${h}:${m}`);
    start += 30;
  }

  return slots;
};

// Helper to normalize backend time (remove seconds if present)
const normalizeTime = (time) => time.slice(0, 5);

export default function DoctorAvailabilityModal({ doctor, onClose }) {
  const [date, setDate] = useState("");
  const [slots] = useState(generateSlots());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [savedSlots, setSavedSlots] = useState([]);

  // Toggle slot selection
  const toggleSlot = (time) => {
    setSelectedSlots((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  // Load saved slots from backend
  const loadSavedSlots = async () => {
    if (!doctor?.id || !date) return;

    try {
      const res = await getAvailableSlots(doctor.id, date);
      const normalized = res.map((s) => ({
        ...s,
        availableTime: normalizeTime(s.availableTime),
      }));
      setSavedSlots(normalized);
    } catch (err) {
      console.error(err);
      setSavedSlots([]);
    }
  };

  // Save selected slots
  const handleSave = async () => {
    if (!date || selectedSlots.length === 0) {
      alert("Please select a date and at least one time slot.");
      return;
    }

    try {
      await saveAvailability({
        doctorId: doctor.id,
        date,
        times: selectedSlots,
      });
      alert("Availability saved!");
      setSelectedSlots([]);
      loadSavedSlots();
    } catch (err) {
      console.error(err);
      alert("Failed to save availability");
    }
  };

  // Delete a slot
  const handleDelete = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    try {
      await deleteAvailabilitySlot(slotId);
      alert("Slot deleted!");
      loadSavedSlots();
    } catch (err) {
      console.error(err);
      alert("Failed to delete slot");
    }
  };

  // Load slots whenever date or doctor changes
  useEffect(() => {
    loadSavedSlots();
  }, [doctor, date]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-[900px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Availability – {doctor.name}</h2>

        {/* DATE PICKER */}
        <input
          type="date"
          className="border p-2 mb-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* TIME SLOTS */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {slots.map((time) => {
            const isSelected = selectedSlots.includes(time);
            const isSaved = savedSlots.some((s) => s.availableTime === time);

            return (
              <button
                key={time}
                onClick={() => toggleSlot(time)}
                disabled={isSaved}
                className={`border rounded p-2 text-sm 
                  ${isSaved ? "bg-gray-300 cursor-not-allowed" : ""}
                  ${
                    isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  }`}
              >
                {time}
              </button>
            );
          })}
        </div>

        {/* SAVED SLOTS TABLE */}
        <h3 className="font-semibold mb-2">Saved Slots</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {savedSlots.length > 0 ? (
              savedSlots.map((s) => (
                <tr key={s.id}>
                  <td className="border p-2">{s.availableDate}</td>
                  <td className="border p-2">{s.availableTime}</td>
                  <td className="border p-2">
                    <button
                      className="px-2 py-1 bg-red-500 rounded text-white text-sm"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center p-3 text-gray-500">
                  No availability saved
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end mt-4 gap-2">
          <button className="px-4 py-1 bg-gray-400 rounded" onClick={onClose}>
            Close
          </button>
          <button
            className="px-4 py-1 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save Selected Slots
          </button>
        </div>
      </div>
    </div>
  );
}
