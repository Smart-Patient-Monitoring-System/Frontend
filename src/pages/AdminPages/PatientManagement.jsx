import React, { useEffect, useState } from "react";
import {
  fetchPatient,
  deletePatient,
  updatePatient,
} from "./service/patientconnecter";
import { API_BASE_URL } from "../../api";

function PatientManagement() {
  const [patients, setPatient] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // ✅ hospitals dropdown data
  const [hospitals, setHospitals] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    address: "",
    email: "",
    nicNo: "",
    gender: "",
    contactNo: "",
    guardiansName: "",
    guardiansContactNo: "",
    username: "",
    password: "",
    bloodType: "",
    city: "",
    district: "",
    dispostalCodet: "",

    // ✅ added
    hospital: "",

    guardianRelationship: "",
    guardianEmail: "",
    medicalConditions: "",
    allergies: "",
    currentMedications: "",
    pastSurgeries: "",
    emergencyNotes: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    dateOfBirth: "",
    address: "",
    email: "",
    nicNo: "",
    gender: "",
    contactNo: "",
    guardiansName: "",
    guardiansContactNo: "",
    username: "",
    password: "",
    bloodType: "",
    city: "",
    district: "",
    dispostalCodet: "",

    // ✅ added
    hospital: "",

    guardianRelationship: "",
    guardianEmail: "",
    medicalConditions: "",
    allergies: "",
    currentMedications: "",
    pastSurgeries: "",
    emergencyNotes: "",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPatient();
        setPatient(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // ✅ load hospitals list
  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/public/hospitals`);
        const data = await res.json();
        setHospitals(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log("Failed to load hospitals", e);
        setHospitals([]);
      }
    };

    loadHospitals();
  }, []);

  // search bar
  const filteredPatients = patients.filter((pt) =>
    pt.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (PatientId) => {
    if (!window.confirm("Reject this Patient?")) return;

    try {
      await deletePatient(PatientId);

      setPatient((prev) => prev.filter((pt) => pt.Id !== PatientId));

      alert("Patient rejected successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to reject Patient");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (patient) => {
    setEditPatientId(patient.id || patient.Id);

    setEditFormData({
      name: patient.name || "",
      dateOfBirth: patient.dateOfBirth || "",
      address: patient.address || "",
      email: patient.email || "",
      nicNo: patient.nicNo || "",
      gender: patient.gender || "",
      contactNo: patient.contactNo || "",

      // ✅ added
      hospital: patient.hospital || "",
    });

    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.address ||
      !formData.dateOfBirth ||
      !formData.allergies ||
      !formData.nicNo ||
      !formData.gender ||
      !formData.contactNo ||
      !formData.bloodType ||
      !formData.city ||
      !formData.currentMedications ||
      !formData.dispostalCodet ||
      !formData.district ||
      !formData.guardianEmail ||
      !formData.guardianRelationship ||
      !formData.guardiansContactNo ||
      !formData.guardiansName ||
      !formData.medicalConditions ||
      !formData.hospital // ✅ added
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/patient/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Failed to create Patient");
        setSubmitting(false);
        return;
      }

      // Reset form and close modal
      setFormData({
        name: "",
        dateOfBirth: "",
        address: "",
        email: "",
        nicNo: "",
        gender: "",
        contactNo: "",
        guardiansName: "",
        guardiansContactNo: "",
        username: "",
        password: "",
        bloodType: "",
        city: "",
        district: "",
        dispostalCodet: "",

        // ✅ added
        hospital: "",

        guardianRelationship: "",
        guardianEmail: "",
        medicalConditions: "",
        allergies: "",
        currentMedications: "",
        pastSurgeries: "",
        emergencyNotes: "",
        createdAt: "",
        updatedAt: "",
      });

      setShowModal(false);
      setError("");

      const data = await fetchPatient();
      setPatient(data || []);
    } catch (e) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();

    try {
      await updatePatient(editPatientId, editFormData);

      const data = await fetchPatient();
      setPatient(data || []);
      setShowEditModal(false);

      alert("Patient updated successfully");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update Patient");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Patients</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-4 py-1.5 rounded-full hover:shadow-lg transition"
        >
          Add Patient
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Patients....."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
      />

      <div className="space-y-3">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}

        {!loading && filteredPatients.length === 0 && (
          <p className="text-sm text-gray-500">No Patient found</p>
        )}

        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="flex justify-between items-start bg-gray-50 p-4 rounded-xl"
          >
            {/* Patient Info */}
            <div className="space-y-1">
              <p className="font-medium text-gray-800">{patient.name}</p>

              <p className="text-sm text-gray-500">{patient.dateOfBirth}</p>

              <p className="text-sm text-gray-500">{patient.address}</p>

              <p className="text-sm text-gray-500">📧 {patient.email}</p>

              <p className="font-medium text-gray-800">{patient.nicNo}</p>

              <p className="text-sm text-gray-500">📞 {patient.contactNo}</p>

              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {patient.gender}
              </span>
            </div>

            {/* RIGHT SIDE – ACTION BUTTONS */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(patient)}
                className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(patient.Id)}
                className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create New Patient
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    setFormData({
                      name: "",
                      dateOfBirth: "",
                      address: "",
                      email: "",
                      nicNo: "",
                      gender: "",
                      contactNo: "",
                      guardiansName: "",
                      guardiansContactNo: "",
                      username: "",
                      password: "",
                      bloodType: "",
                      city: "",
                      district: "",
                      dispostalCodet: "",

                      // ✅ added
                      hospital: "",

                      guardianRelationship: "",
                      guardianEmail: "",
                      medicalConditions: "",
                      allergies: "",
                      currentMedications: "",
                      pastSurgeries: "",
                      emergencyNotes: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleCreatePatient} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    NIC No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nicNo"
                    value={formData.nicNo}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-6 h-10">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        checked={formData.gender === "MALE"}
                        onChange={handleInputChange}
                        required
                        className="accent-blue-500"
                      />
                      Male
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        checked={formData.gender === "FEMALE"}
                        onChange={handleInputChange}
                        required
                        className="accent-blue-500"
                      />
                      Female
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Contact No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Guardians Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="guardiansName"
                    value={formData.guardiansName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Guardians ContactNo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="guardiansContactNo"
                    value={formData.guardiansContactNo}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Blood Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    District Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dispostalCodet"
                    value={formData.dispostalCodet}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                {/* ✅ Hospital dropdown (added) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Hospital <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hospital"
                    value={formData.hospital}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select hospital</option>
                    {hospitals.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Guardian Relationship <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="guardianRelationship"
                    value={formData.guardianRelationship}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Guardian Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="guardianEmail"
                    value={formData.guardianEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Medical Conditions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Allergies <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Current Medications <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="currentMedications"
                    value={formData.currentMedications}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                    setFormData({
                      name: "",
                      dateOfBirth: "",
                      address: "",
                      email: "",
                      nicNo: "",
                      gender: "",
                      contactNo: "",
                      guardiansName: "",
                      guardiansContactNo: "",
                      username: "",
                      password: "",
                      bloodType: "",
                      city: "",
                      district: "",
                      dispostalCodet: "",

                      // ✅ added
                      hospital: "",

                      guardianRelationship: "",
                      guardianEmail: "",
                      medicalConditions: "",
                      allergies: "",
                      currentMedications: "",
                      pastSurgeries: "",
                      emergencyNotes: "",
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  {submitting ? "Creating..." : "Create Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Edit Patient</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdatePatient} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Name"
                />

                <input
                  type="date"
                  name="dateOfBirth"
                  value={editFormData.dateOfBirth}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                />

                <input
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Address"
                />

                <input
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Email"
                />

                <input
                  name="nicNo"
                  value={editFormData.nicNo}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="NIC"
                />

                <input
                  name="contactNo"
                  value={editFormData.contactNo}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Contact No"
                />

                <select
                  name="gender"
                  value={editFormData.gender}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  name="contactNo"
                  value={editFormData.contactNo}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Contact Number"
                />

                <input
                  name="guardiansName"
                  value={editFormData.guardiansName}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Guardian's Name"
                />

                <input
                  name="guardiansContactNo"
                  value={editFormData.guardiansContactNo}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Guardian's Contact Number"
                />

                <input
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Username"
                />

                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Password"
                />

                <input
                  name="bloodType"
                  value={editFormData.bloodType}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Blood Type"
                />

                <input
                  name="city"
                  value={editFormData.city}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="City"
                />

                <input
                  name="district"
                  value={editFormData.district}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="District"
                />

                <input
                  name="dispostalCodet"
                  value={editFormData.dispostalCodet}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Postal Code"
                />

                {/* ✅ Hospital dropdown (added) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Hospital
                  </label>
                  <select
                    name="hospital"
                    value={editFormData.hospital}
                    onChange={handleEditInputChange}
                    className="w-full h-10 px-3 rounded-lg border bg-white"
                  >
                    <option value="">Select hospital</option>
                    {hospitals.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  name="guardianRelationship"
                  value={editFormData.guardianRelationship}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Guardian Relationship"
                />

                <input
                  type="email"
                  name="guardianEmail"
                  value={editFormData.guardianEmail}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Guardian Email"
                />

                <textarea
                  name="medicalConditions"
                  value={editFormData.medicalConditions}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 rounded-lg border"
                  placeholder="Medical Conditions"
                />

                <textarea
                  name="allergies"
                  value={editFormData.allergies}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 rounded-lg border"
                  placeholder="Allergies"
                />

                <textarea
                  name="currentMedications"
                  value={editFormData.currentMedications}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 rounded-lg border"
                  placeholder="Current Medications"
                />

                <textarea
                  name="pastSurgeries"
                  value={editFormData.pastSurgeries}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 rounded-lg border"
                  placeholder="Past Surgeries"
                />

                <textarea
                  name="emergencyNotes"
                  value={editFormData.emergencyNotes}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 rounded-lg border"
                  placeholder="Emergency Notes"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientManagement;
