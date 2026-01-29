import { useState, useEffect } from "react";
import { getDoctors } from "../../../api/api";

export default function DoctorSelect({ selectedDoctor, setSelectedDoctor }) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors()
      .then((data) => setDoctors(data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const doctor = doctors.find((d) => d.id === Number(e.target.value));
    setSelectedDoctor(doctor || null);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Select Doctor
      </label>
      <select
        value={selectedDoctor?.id || ""}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">-- Choose a doctor --</option>
        {doctors.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      {selectedDoctor && (
        <div className="mt-2 text-m text-gray-600">
          <p>
            <strong>Specialty:</strong> {selectedDoctor.specialty}
          </p>
          <p>
            <strong>Consultation Fee:</strong> Rs.
            {selectedDoctor.consultationFee}
          </p>
        </div>
      )}
    </div>
  );
}
