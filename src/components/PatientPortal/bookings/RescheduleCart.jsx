import React from "react";

export default function RescheduleCart({ appointment, onCancel }) {
  return (
    <div className="border p-4 rounded bg-gray-50 mt-2">
      <h3 className="text-lg font-semibold mb-3">Reschedule Appointment</h3>

      <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-3 rounded">
        <p className="font-medium">
          To reschedule your appointment, please contact the hospital.
        </p>

        <p className="mt-2">
          📞 Phone: <span className="font-semibold">011-2345678</span>
        </p>

        <p className="mt-1 text-sm">
          Our staff will help you select a new available time slot.
        </p>
      </div>

      <div className="mt-4">
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-400 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
