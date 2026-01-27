import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDoctors,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../../api/api";

import DoctorForm from "./SpecialDoctorAddingForm";
import DoctorTable from "./SpecialDoctorsTable";
import DoctorAvailabilityModal from "./DoctorAvailabilityModal";
import { saveAvailability } from "../../../api/api";

export default function DoctorAdmin() {
  const navigate = useNavigate(); // ✅ NEW

  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Fetch all doctors from backend
  const fetchDoctors = async () => {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Handle add or update
  const handleSave = async (formData) => {
    try {
      if (editingDoctor) {
        const updated = await updateDoctor(editingDoctor.id, formData);
        setDoctors((prev) =>
          prev.map((doc) => (doc.id === updated.id ? updated : doc)),
        );
      } else {
        const newDoctor = await addDoctor(formData);
        setDoctors((prev) => [...prev, newDoctor]);
      }
      setShowForm(false);
      setEditingDoctor(null);
    } catch (err) {
      console.error("Error saving doctor:", err);
    }
  };

  // Handle edit
  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await deleteDoctor(id);
        setDoctors((prev) => prev.filter((doc) => doc.id !== id));
      } catch (err) {
        console.error("Error deleting doctor:", err);
      }
    }
  };

  // Handle "More" button click
  const handleMore = (doctor) => {
    setSelectedDoctor(doctor);
  };

  // Handle saving availability from modal
  const handleSaveAvailability = async (doctorId, slots) => {
    try {
      await saveAvailability(doctorId, slots);
      setSelectedDoctor(null);
      fetchDoctors();
    } catch (err) {
      console.error("Error saving availability:", err);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER WITH NAV BUTTON */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin - Manage Special Doctors</h1>

        {/* ✅ NEW BUTTON */}
        <button
          onClick={() => navigate("/admin/confirm-appointments")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Confirm Appointments
        </button>
      </div>

      {/* Toggle Form Button */}
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => {
          setShowForm(!showForm);
          setEditingDoctor(null);
        }}
      >
        {showForm ? "Close Form" : "Add New Special Doctor"}
      </button>

      {/* Doctor Form */}
      {showForm && <DoctorForm doctor={editingDoctor} onSave={handleSave} />}

      {/* Doctor Table */}
      <DoctorTable
        doctors={doctors}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMore={handleMore}
      />

      {/* Availability Modal */}
      {selectedDoctor && (
        <DoctorAvailabilityModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSave={handleSaveAvailability}
        />
      )}
    </div>
  );
}
