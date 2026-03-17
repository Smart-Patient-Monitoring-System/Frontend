import React, { useState, useEffect } from "react";

export default function DoctorForm({ doctor, onSave }) {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    name: "",
    specialty: "",
    consultationFee: "",
    description: "",
    qualification: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        registrationNumber: doctor.registrationNumber || "",
        name: doctor.name || "",
        specialty: doctor.specialty || "",
        consultationFee: doctor.consultationFee || "",
        description: doctor.description || "",
        qualification: doctor.qualification || "",
        phoneNumber: doctor.phoneNumber || "",
        email: doctor.email || "",
      });
    } else {
      setFormData({
        registrationNumber: "",
        name: "",
        specialty: "",
        consultationFee: "",
        description: "",
        qualification: "",
        phoneNumber: "",
        email: "",
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      className="mb-6 p-6 border rounded-lg shadow-md space-y-4 bg-white max-w-lg mx-auto"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {doctor ? "Update Doctor" : "Add New Doctor"}
      </h2>

      <input
        type="text"
        name="registrationNumber"
        placeholder="Registration Number"
        value={formData.registrationNumber}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="text"
        name="name"
        placeholder="Doctor Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="text"
        name="specialty"
        placeholder="Specialty"
        value={formData.specialty}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="number"
        name="consultationFee"
        placeholder="Consultation Fee (Rs.)"
        value={formData.consultationFee}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      <input
        type="text"
        name="qualification"
        placeholder="Qualification"
        value={formData.qualification}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="text"
        name="phoneNumber"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        {doctor ? "Update Doctor" : "Add Doctor"}
      </button>
    </form>
  );
}
