import { useState, useEffect } from "react";
import { getDoctors } from "../../../api/api";

export default function DoctorSelect({ selectedDoctor, setSelectedDoctor }) {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  useEffect(() => {
    getDoctors()
      .then((data) => {
        setDoctors(data || []);

        // Extract unique specialties
        const uniqueSpecialties = [
          ...new Set((data || []).map((d) => d.specialty)),
        ];
        setSpecialties(uniqueSpecialties);
      })
      .catch((err) => console.error("Failed to load doctors:", err));
  }, []);

  // Filter doctors based on selected specialty
  const filteredDoctors = doctors.filter(
    (d) => d.specialty === selectedSpecialty,
  );

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
    setSelectedDoctor(null); // reset doctor when specialty changes
  };

  const handleDoctorChange = (e) => {
    const doctor = doctors.find((d) => d.id === Number(e.target.value));
    setSelectedDoctor(doctor || null);
  };

  return (
    <div>
      {/* SPECIALTY DROPDOWN */}
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Select Specialty
      </label>
      <select
        value={selectedSpecialty}
        onChange={handleSpecialtyChange}
        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Choose Specialty --</option>
        {specialties.map((spec, index) => (
          <option key={index} value={spec}>
            {spec}
          </option>
        ))}
      </select>

      {/* DOCTOR DROPDOWN */}
      <label className="block text-sm font-semibold text-gray-700 mt-3 mb-1">
        Select Doctor
      </label>
      <select
        value={selectedDoctor?.id || ""}
        onChange={handleDoctorChange}
        disabled={!selectedSpecialty}
        className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      >
        <option value="">-- Choose Doctor --</option>
        {filteredDoctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
      </select>

      {/* SHOW CONSULTATION FEE */}
      {selectedDoctor && (
        <div className="mt-3 text-gray-600">
          <p>
            <strong>Consultation Fee:</strong> Rs.
            {selectedDoctor.consultationFee}
          </p>
        </div>
      )}
    </div>
  );
}
