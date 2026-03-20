import React, { useEffect, useState } from "react";
import { fetchPatient, deletePatient, updatePatient } from "./service/patientconnecter";
import { API_BASE_URL } from "../../api";

function PatientManagement() {
  const [patients, setPatient] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    guardianRelationship: "",
    guardianEmail: "",
    medicalConditions: "",
    allergies: "",
    currentMedications: "",
    pastSurgeries: "",
    emergencyNotes: "",
    deviceId: "", // NEW
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
    guardianRelationship: "",
    guardianEmail: "",
    medicalConditions: "",
    allergies: "",
    currentMedications: "",
    pastSurgeries: "",
    emergencyNotes: "",
  });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // NEW: assign device modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignPatientId, setAssignPatientId] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");

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

  const reloadPatients = async () => {
    try {
      const data = await fetchPatient();
      setPatient(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPatients = patients.filter((pt) =>
    pt.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (PatientId) => {
    if (!window.confirm("Reject this Patient?")) return;

    try {
      await deletePatient(PatientId);

      setPatient((prev) =>
        prev.filter((pt) => (pt.id || pt.Id) !== PatientId)
      );

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
      guardiansName: patient.guardiansName || "",
      guardiansContactNo: patient.guardiansContactNo || "",
      username: patient.username || "",
      password: patient.password || "",
      bloodType: patient.bloodType || "",
      city: patient.city || "",
      district: patient.district || "",
      dispostalCodet: patient.dispostalCodet || "",
      guardianRelationship: patient.guardianRelationship || "",
      guardianEmail: patient.guardianEmail || "",
      medicalConditions: patient.medicalConditions || "",
      allergies: patient.allergies || "",
      currentMedications: patient.currentMedications || "",
      pastSurgeries: patient.pastSurgeries || "",
      emergencyNotes: patient.emergencyNotes || "",
    });

    setShowEditModal(true);
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // NEW
  const openAssignModal = (patient) => {
    setAssignPatientId(patient.id || patient.Id);
    setDeviceId("");
    setAssignError("");
    setShowAssignModal(true);
  };

  // NEW
  const handleAssignDevice = async (e) => {
    e.preventDefault();
    setAssignError("");

    if (!deviceId.trim()) {
      setAssignError("Please enter a device ID");
      return;
    }

    try {
      setAssigning(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/sensordata/devices/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deviceId: deviceId.trim(),
          userId: assignPatientId,
        }),
      });

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = { message: text };
      }

      if (!response.ok) {
        setAssignError(data.message || "Failed to assign device");
        return;
      }

      alert("Device assigned successfully");
      setShowAssignModal(false);
      setDeviceId("");
      setAssignError("");
    } catch (err) {
      console.error(err);
      setAssignError("Unable to connect to server");
    } finally {
      setAssigning(false);
    }
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
      !formData.medicalConditions
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

      const text = await response.text();
      let createdPatient = null;

      try {
        createdPatient = text ? JSON.parse(text) : null;
      } catch {
        createdPatient = null;
      }

      if (!response.ok) {
        setError(text || "Failed to create Patient");
        setSubmitting(false);
        return;
      }

      // OPTIONAL auto assignment if deviceId is entered during create
      if (formData.deviceId && createdPatient?.id) {
        try {
          await fetch(`${API_BASE_URL}/api/sensordata/devices/assign`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              deviceId: formData.deviceId.trim(),
              userId: createdPatient.id,
            }),
          });
        } catch (assignErr) {
          console.error("Device assignment failed after create:", assignErr);
        }
      }

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
        guardianRelationship: "",
        guardianEmail: "",
        medicalConditions: "",
        allergies: "",
        currentMedications: "",
        pastSurgeries: "",
        emergencyNotes: "",
        deviceId: "",
      });

      setShowModal(false);
      setError("");
      await reloadPatients();
    } catch (e) {
      console.error(e);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();

    try {
      await updatePatient(editPatientId, editFormData);
      await reloadPatients();
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
            key={patient.id || patient.Id}
            className="flex justify-between items-start bg-gray-50 p-4 rounded-xl"
          >
            <div className="space-y-1">
              <p className="font-medium text-gray-800">{patient.name}</p>
              <p className="text-xs text-gray-500">ID: {patient.id || patient.Id}</p>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => handleView(patient)}
                className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                View
              </button>

              <button
                onClick={() => handleEdit(patient)}
                className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              >
                Edit
              </button>

              <button
                onClick={() => openAssignModal(patient)}
                className="text-xs px-3 py-1 rounded-full bg-teal-100 text-teal-700 hover:bg-teal-200"
              >
                Assign Device
              </button>

              <button
                onClick={() => handleDelete(patient.id || patient.Id)}
                className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800">Patient Profile</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-500 hover:text-white transition"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <InfoItem label="Full Name" value={selectedPatient.name} />
                <InfoItem label="Email" value={selectedPatient.email} />
                <InfoItem label="Contact Number" value={selectedPatient.contactNo} />
                <InfoItem label="NIC Number" value={selectedPatient.nicNo} />
                <InfoItem label="Gender" value={selectedPatient.gender} />
                <InfoItem label="Date of Birth" value={selectedPatient.dateOfBirth} />
                <InfoItem label="Blood Type" value={selectedPatient.bloodType} />
                <InfoItem label="Address" value={selectedPatient.address} />
                <InfoItem label="City" value={selectedPatient.city} />
                <InfoItem label="District" value={selectedPatient.district} />
                <InfoItem label="Postal Code" value={selectedPatient.dispostalCodet} />
                <InfoItem label="Guardian Name" value={selectedPatient.guardiansName} />
                <InfoItem label="Guardian Contact Number" value={selectedPatient.guardiansContactNo} />
                <InfoItem label="Guardian Relationship" value={selectedPatient.guardianRelationship} />
                <InfoItem label="Guardian Email" value={selectedPatient.guardianEmail} />
                <InfoItem label="Medical Conditions" value={selectedPatient.medicalConditions} />
                <InfoItem label="Allergies" value={selectedPatient.allergies} />
                <InfoItem label="Current Medications" value={selectedPatient.currentMedications} />
                <InfoItem label="Past Surgeries" value={selectedPatient.pastSurgeries} />
                <InfoItem label="Emergency Notes" value={selectedPatient.emergencyNotes} />
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Device Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Assign Device</h2>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignError("");
                  setDeviceId("");
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAssignDevice} className="p-6">
              {assignError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {assignError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={assignPatientId || ""}
                    disabled
                    className="w-full h-10 px-3 rounded-lg border bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Device ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    placeholder="ESP32_001"
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignModal(false);
                    setAssignError("");
                    setDeviceId("");
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assigning}
                  className="px-6 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  {assigning ? "Assigning..." : "Assign Device"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Patient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Create New Patient</h2>
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
                      guardianRelationship: "",
                      guardianEmail: "",
                      medicalConditions: "",
                      allergies: "",
                      currentMedications: "",
                      pastSurgeries: "",
                      emergencyNotes: "",
                      deviceId: "",
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

                {/* NEW optional device field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Device ID <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleInputChange}
                    placeholder="ESP32_001"
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
                      guardianRelationship: "",
                      guardianEmail: "",
                      medicalConditions: "",
                      allergies: "",
                      currentMedications: "",
                      pastSurgeries: "",
                      emergencyNotes: "",
                      deviceId: "",
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

      {/* Edit Patient Modal */}
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

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs text-gray-500 font-semibold mb-1">{label}</p>
    <p className="text-gray-800 font-medium">{value || "-"}</p>
  </div>
);

export default PatientManagement;