import { useEffect, useState } from "react";
import { getAvailableSlots } from "../../../api/api";

const normalizeTime = (time) => {
  if (!time) return "";
  if (Array.isArray(time)) {
    const hours = String(time[0] ?? "0").padStart(2, "0");
    const minutes = String(time[1] ?? "0").padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  if (typeof time !== "string") {
    const raw = String(time);
    const numericParts = raw.match(/\d+/g);
    if (numericParts && numericParts.length >= 2) {
      const hours = String(numericParts[0]).padStart(2, "0");
      const minutes = String(numericParts[1]).padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return raw;
  }

  const delimiter = time.includes(":") ? ":" : ",";
  const parts = time.split(delimiter);
  const hours = String(parts[0] ?? "0").padStart(2, "0");
  const minutes = String(parts[1] ?? "0").padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function TimeSlotPicker({
  doctorId,
  date,
  selectedTime,
  setSelectedTime,
}) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctorId || !date) return; // don't fetch if doctor or date not selected

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const data = await getAvailableSlots(doctorId, date);
        // data = [{id, availableDate, availableTime}]
        // map to string "HH:mm" for buttons
        setSlots(data.map((slot) => normalizeTime(slot.availableTime)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctorId, date]);

  if (!doctorId || !date)
    return <p className="text-gray-500">Select doctor & date first</p>;
  if (loading) return <p className="text-gray-500">Loading time slots...</p>;
  if (slots.length === 0)
    return <p className="text-gray-500">No slots available</p>;

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((time) => (
        <button
          key={time}
          onClick={() => setSelectedTime(time)}
          className={`px-3 py-1 rounded border ${
            selectedTime === time ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          {time}
        </button>
      ))}
    </div>
  );
}
