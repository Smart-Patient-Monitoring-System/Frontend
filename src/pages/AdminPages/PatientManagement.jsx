import React, { useEffect, useState } from "react";
import {
  fetchPatient,
  deletePatient,
  updatePatient,
  createPatient,
} from "./service/patientconnecter";

function PatientManagement() {
  const [patients, setPatient] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatientId, setEditPatientId] = useState(null);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const initialFormData = {
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
    postalCode: "",
    guardianRelationship: "",
    guardianEmail: "",
    medicalConditions: "",
    allergies: "",
    currentMedications: "",
    pastSurgeries: "",
    emergencyNotes: "",
    deviceId: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [editFormData, setEditFormData] = useState(initialFormData);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      setLoading(true);
      const data = await fetchPatient();
      setPatient(data || []);
    } catch (err) {
      console.error(err);
      setPatient([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredPatients = patients.filter((patient) =>
    patient.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
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
      password: "",
      bloodType: patient.bloodType || "",
      city: patient.city || "",
      district: patient.district || "",
      postalCode: patient.postalCode || "",
      guardianRelationship: patient.guardianRelationship || "",
      guardianEmail: patient.guardianEmail || "",
      medicalConditions: patient.medicalConditions || "",
      allergies: patient.allergies || "",
      currentMedications: patient.currentMedications || "",
      pastSurgeries: patient.pastSurgeries || "",
      emergencyNotes: patient.emergencyNotes || "",
      deviceId: patient.deviceId || "",
    });

    setShowEditModal(true);
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm("Delete this patient?")) return;

    try {
      await deletePatient(patientId);
      setPatient((prev) => prev.filter((p) => (p.id || p.Id) !== patientId));
      alert("Patient deleted successfully");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete patient");
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
      !formData.dateOfBirth ||
      !formData.address ||
      !formData.nicNo ||
      !formData.gender ||
      !formData.contactNo
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await createPatient(formData);
      setShowModal(false);
      setFormData(initialFormData);
      await loadPatients();
      alert("Patient created successfully");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create patient");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePatient = async (e) => {
    e.preventDefault();

    try {
      await updatePatient(editPatientId, editFormData);
      setShowEditModal(false);
      await loadPatients();
      alert("Patient updated successfully");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update patient");
    }
  };

  const resetCreateModal = () => {
    setShowModal(false);
    setError("");
    setFormData(initialFormData);
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
        placeholder="Search Patients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
      />

      <div className="space-y-3">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}

        {!loading && filteredPatients.length === 0 && (
          <p className="text-sm text-gray-500">No patients found</p>
        )}

        {filteredPatients.map((patient) => (
          <div
            key={patient.id || patient.Id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-xl"
          >
            <div className="space-y-1">
              <p className="font-medium text-gray-800">{patient.name}</p>
              <p className="text-sm text-gray-500">
                {patient.email || "No email"}
              </p>
              <p className="text-xs text-gray-500">
                Device: {patient.deviceId || "Not assigned"}
              </p>
            </div>

            <div className="flex gap-2">
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
                onClick={() => handleDelete(patient.id || patient.Id)}
                className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col border border-gray-200">
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
                <InfoItem label="Date of Birth" value={selectedPatient.dateOfBirth} />
                <InfoItem label="Gender" value={selectedPatient.gender} />
                <InfoItem label="NIC Number" value={selectedPatient.nicNo} />
                <InfoItem label="Contact Number" value={selectedPatient.contactNo} />
                <InfoItem label="Blood Type" value={selectedPatient.bloodType} />
                <InfoItem label="Guardian Name" value={selectedPatient.guardiansName} />
                <InfoItem label="Guardian Contact" value={selectedPatient.guardiansContactNo} />
                <InfoItem label="Guardian Relationship" value={selectedPatient.guardianRelationship} />
                <InfoItem label="Guardian Email" value={selectedPatient.guardianEmail} />
                <InfoItem label="Device ID" value={selectedPatient.deviceId || "Not assigned"} />

                <div className="md:col-span-2">
                  <InfoItem label="Address" value={selectedPatient.address} />
                </div>

                <InfoItem label="City" value={selectedPatient.city} />
                <InfoItem label="District" value={selectedPatient.district} />
                <InfoItem label="Postal Code" value={selectedPatient.postalCode} />
                <InfoItem label="Medical Conditions" value={selectedPatient.medicalConditions} />
                <InfoItem label="Allergies" value={selectedPatient.allergies} />
                <InfoItem label="Current Medications" value={selectedPatient.currentMedications} />
                <InfoItem label="Past Surgeries" value={selectedPatient.pastSurgeries} />

                <div className="md:col-span-2">
                  <InfoItem label="Emergency Notes" value={selectedPatient.emergencyNotes} />
                </div>
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Create New Patient</h2>
                <button
                  onClick={resetCreateModal}
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
                <Field label="Name *">
                  <input name="name" value={formData.name} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Date of Birth *">
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Address *">
                  <input name="address" value={formData.address} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Email *">
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="NIC No *">
                  <input name="nicNo" value={formData.nicNo} onChange={handleInputChange} className="input" />
                </Field>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender *</label>
                  <div className="flex items-center gap-6 h-10">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        checked={formData.gender === "MALE"}
                        onChange={handleInputChange}
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
                        className="accent-blue-500"
                      />
                      Female
                    </label>
                  </div>
                </div>

                <Field label="Contact No *">
                  <input name="contactNo" value={formData.contactNo} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Guardian Name">
                  <input name="guardiansName" value={formData.guardiansName} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Guardian Contact">
                  <input name="guardiansContactNo" value={formData.guardiansContactNo} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Guardian Relationship">
                  <input name="guardianRelationship" value={formData.guardianRelationship} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Guardian Email">
                  <input name="guardianEmail" value={formData.guardianEmail} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Blood Type">
                  <input name="bloodType" value={formData.bloodType} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Username *">
                  <input name="username" value={formData.username} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Password *">
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="City">
                  <input name="city" value={formData.city} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="District">
                  <input name="district" value={formData.district} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Postal Code">
                  <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Device ID">
                  <input
                    name="deviceId"
                    value={formData.deviceId}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Assign IoT device ID"
                  />
                </Field>

                <Field label="Medical Conditions">
                  <input name="medicalConditions" value={formData.medicalConditions} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Allergies">
                  <input name="allergies" value={formData.allergies} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Current Medications">
                  <input name="currentMedications" value={formData.currentMedications} onChange={handleInputChange} className="input" />
                </Field>

                <Field label="Past Surgeries">
                  <input name="pastSurgeries" value={formData.pastSurgeries} onChange={handleInputChange} className="input" />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Emergency Notes">
                    <textarea
                      name="emergencyNotes"
                      value={formData.emergencyNotes}
                      onChange={handleInputChange}
                      className="w-full min-h-[100px] px-3 py-2 rounded-lg border focus:border-blue-500 outline-none"
                    />
                  </Field>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetCreateModal}
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
          <div className="bg-white rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
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
                <input name="name" value={editFormData.name} onChange={handleEditInputChange} className="input" placeholder="Name" />
                <input type="date" name="dateOfBirth" value={editFormData.dateOfBirth} onChange={handleEditInputChange} className="input" />
                <input name="address" value={editFormData.address} onChange={handleEditInputChange} className="input" placeholder="Address" />
                <input name="email" value={editFormData.email} onChange={handleEditInputChange} className="input" placeholder="Email" />
                <input name="nicNo" value={editFormData.nicNo} onChange={handleEditInputChange} className="input" placeholder="NIC" />
                <input name="gender" value={editFormData.gender} onChange={handleEditInputChange} className="input" placeholder="Gender" />
                <input name="contactNo" value={editFormData.contactNo} onChange={handleEditInputChange} className="input" placeholder="Contact No" />
                <input name="guardiansName" value={editFormData.guardiansName} onChange={handleEditInputChange} className="input" placeholder="Guardian Name" />
                <input name="guardiansContactNo" value={editFormData.guardiansContactNo} onChange={handleEditInputChange} className="input" placeholder="Guardian Contact" />
                <input name="guardianRelationship" value={editFormData.guardianRelationship} onChange={handleEditInputChange} className="input" placeholder="Guardian Relationship" />
                <input name="guardianEmail" value={editFormData.guardianEmail} onChange={handleEditInputChange} className="input" placeholder="Guardian Email" />
                <input name="bloodType" value={editFormData.bloodType} onChange={handleEditInputChange} className="input" placeholder="Blood Type" />
                <input name="city" value={editFormData.city} onChange={handleEditInputChange} className="input" placeholder="City" />
                <input name="district" value={editFormData.district} onChange={handleEditInputChange} className="input" placeholder="District" />
                <input name="postalCode" value={editFormData.postalCode} onChange={handleEditInputChange} className="input" placeholder="Postal Code" />
                <input
                  name="deviceId"
                  value={editFormData.deviceId}
                  onChange={handleEditInputChange}
                  className="input"
                  placeholder="Device ID"
                />
                <input name="medicalConditions" value={editFormData.medicalConditions} onChange={handleEditInputChange} className="input" placeholder="Medical Conditions" />
                <input name="allergies" value={editFormData.allergies} onChange={handleEditInputChange} className="input" placeholder="Allergies" />
                <input name="currentMedications" value={editFormData.currentMedications} onChange={handleEditInputChange} className="input" placeholder="Current Medications" />
                <input name="pastSurgeries" value={editFormData.pastSurgeries} onChange={handleEditInputChange} className="input" placeholder="Past Surgeries" />

                <div className="md:col-span-2">
                  <textarea
                    name="emergencyNotes"
                    value={editFormData.emergencyNotes}
                    onChange={handleEditInputChange}
                    className="w-full min-h-[100px] px-3 py-2 rounded-lg border focus:border-blue-500 outline-none"
                    placeholder="Emergency Notes"
                  />
                </div>
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

      <style>{`
        .input {
          width: 100%;
          height: 40px;
          padding-left: 12px;
          padding-right: 12px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
        }
      `}</style>
    </div>
  );
}

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs text-gray-500 font-semibold mb-1">{label}</p>
    <p className="text-gray-800 font-medium">{value || "-"}</p>
  </div>
);

export default PatientManagement;