import React, { useEffect, useState } from "react";
import { fetchPatient } from "./service/patientconnecter";
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
    });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

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

  // search bar
  const filteredPatients = patients.filter((pt) =>
    pt.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
            "Authorization": `Bearer ${token}`,
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
        {loading && (
          <p className="text-sm text-gray-500">Loading...</p>
        )}

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
      <p className="font-medium text-gray-800">
        {patient.name}
      </p>

      <p className="text-sm text-gray-500">
        {patient.dateOfBirth} 
      </p>

      <p className="text-sm text-gray-500">
        {patient.address}
      </p>

      <p className="text-sm text-gray-500">
        📧 {patient.email}
      </p>

      <p className="font-medium text-gray-800">
        {patient.nicNo}
      </p>
    
      <p className="text-sm text-gray-500">
        📞 {patient.contactNo}
      </p>

      <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
        {patient.gender}
      </span>

    </div>

    {/* RIGHT SIDE – ACTION BUTTONS */}
    <div className="flex flex-col gap-2">
      <button
        onClick={() => console.log("Edit", patient.id)}
        className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      >
        Edit
      </button>

      <button
        onClick={() => console.log("Delete", patient.id)}
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
                    District Postal Codet <span className="text-red-500">*</span>
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
                    Allergies  <span className="text-red-500">*</span>
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
                    Current Medications  <span className="text-red-500">*</span>
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
    </div>
  );
}

export default PatientManagement;
