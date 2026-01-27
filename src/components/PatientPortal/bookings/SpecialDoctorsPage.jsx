import React, { useEffect, useState } from "react";
import DoctorTable from "./SpecialDoctorsTable";
import DoctorAvailabilityModal from "./DoctorAvailabilityModal";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch doctors (example)
  useEffect(() => {
    // fetch("http://localhost:8080/api/doctors")
    //   .then(res => res.json())
    //   .then(data => setDoctors(data));

    // TEMP DATA
    setDoctors([
      {
        id: 1,
        name: "Dr. Silva",
        specialty: "Cardiology",
        consultationFee: 2000,
        phoneNumber: "0771234567",
        email: "drsilva@gmail.com",
      },
    ]);
  }, []);

  // 🔹 This is your handleMore
  const handleMore = (doctor) => {
    setSelectedDoctor(doctor);
  };

  // 🔹 This is your saveAvailability
  const saveAvailability = (doctorId, slots) => {
    console.log("Doctor ID:", doctorId);
    console.log("Slots:", slots);

    // BACKEND CALL (later)
    // fetch("http://localhost:8080/api/availability", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ doctorId, availability: slots }),
    // });
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Doctors</h1>

      <DoctorTable
        doctors={doctors}
        onEdit={(doc) => console.log("Edit", doc)}
        onDelete={(id) => console.log("Delete", id)}
        onMore={handleMore}
      />

      {/* 🔹 MODAL GOES HERE */}
      {selectedDoctor && (
        <DoctorAvailabilityModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSave={saveAvailability}
        />
      )}
    </div>
  );
}
