import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api";
import { fetchDoctor, deleteDoctor, updateDoctor } from "./service/docter";

function UserManagement() {
  const [doctors, setDoctor] = useState([]);
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
    doctorRegNo: "",
    position: "",
    hospital: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    dateOfBirth: "",
    address: "",
    email: "",
    nicNo: "",
    gender: "",
    contactNo: "",
    doctorRegNo: "",
    position: "",
    hospital: "",
  });


  useEffect(() => {
    async function load() {
      try {
        const data = await fetchDoctor();
        setDoctor(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.name?.toLowerCase().includes(search.toLowerCase())
  );

  

  const handleDelete = async (doctorId) => {
    if (!window.confirm("Reject this doctor?")) return;
  
    try {
      await deleteDoctor(doctorId);
  
      setDoctor((prev) =>
        prev.filter((doc) => doc.Id !== doctorId)
      );
  
      alert("Doctor rejected successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to reject doctor")}
    };

  const handleEdit = (doctor) => {
    setEditDoctorId(doctor.id || doctor.Id);

    setEditFormData({
      name: doctor.name || "",
      dateOfBirth: doctor.dateOfBirth || "",
      address: doctor.address || "",
      email: doctor.email || "",
      nicNo: doctor.nicNo || "",
      gender: doctor.gender || "",
      contactNo: doctor.contactNo || "",
      doctorRegNo: doctor.doctorRegNo || "",
      position: doctor.position || "",
      hospital: doctor.hospital || "",
    });

    setShowEditModal(true);
  }; 
  
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.username || !formData.password || 
        !formData.doctorRegNo || !formData.dateOfBirth || !formData.address || 
        !formData.nicNo || !formData.gender || !formData.contactNo || 
        !formData.position || !formData.hospital) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/doctor/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text || "Failed to create doctor");
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
        doctorRegNo: "",
        position: "",
        hospital: "",
        username: "",
        password: "",
      });
      setShowModal(false);
      setError("");

      // Refresh doctor list
      const data = await fetchDoctor();
      setDoctor(data || []);
    } catch (e) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setSubmitting(false);

    }
  };

    const handleUpdateDoctor = async (e) => {
    e.preventDefault();

    try {
      await updateDoctor(editDoctorId, editFormData);

      const data = await fetchDoctor();
      setDoctor(data || []);
      setShowEditModal(false);

      alert("Doctor updated successfully");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update doctor");
    }
  };



  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Doctors</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-4 py-1.5 rounded-full hover:shadow-lg transition"
        >
          Add Doctor
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Doctors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
      />

      <div className="space-y-3">
        {loading && (
          <p className="text-sm text-gray-500">Loading...</p>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <p className="text-sm text-gray-500">No doctors found</p>
        )}

        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex justify-between items-start bg-gray-50 p-4 rounded-xl"
          >
            {/* LEFT SIDE – Doctor Info */}
            <div className="space-y-1">
              <p className="font-medium text-gray-800">
                {doctor.name}
              </p>

              <p className="text-sm text-gray-500">
                {doctor.position} · {doctor.doctorRegNo}
              </p>

              <p className="text-sm text-gray-500">
                {doctor.hospital}
              </p>

              <p className="text-sm text-gray-500">
                📧 {doctor.email}
              </p>

              <p className="text-sm text-gray-500">
                📞 {doctor.contactNo}
              </p>

              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {doctor.gender}
              </span>
            </div>

            {/* RIGHT SIDE – ACTION BUTTONS */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(doctor)}
                className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              >
                Edit
              </button>

              <button
                  onClick={() => handleDelete(doctor.Id)}
                  className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
              >
              Delete
              </button>
            </div>
          </div>
))}

      </div>

      {/* Create Doctor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Create New Doctor</h2>
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
                      doctorRegNo: "",
                      position: "",
                      hospital: "",
                      username: "",
                      password: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateDoctor} className="p-6">
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
                    Doctor's ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="doctorRegNo"
                    value={formData.doctorRegNo}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Hospital <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hospital"
                    value={formData.hospital}
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
                      doctorRegNo: "",
                      position: "",
                      hospital: "",
                      username: "",
                      password: "",
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
                  {submitting ? "Creating..." : "Create Doctor"}
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
              <h2 className="text-2xl font-bold text-gray-800">Edit Doctor</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateDoctor} className="p-6">
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

                <input
                  name="doctorRegNo"
                  value={editFormData.doctorRegNo}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Doctor Reg No"
                />

                <input
                  name="position"
                  value={editFormData.position}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Position"
                />

                <input
                  name="hospital"
                  value={editFormData.hospital}
                  onChange={handleEditInputChange}
                  className="w-full h-10 px-3 rounded-lg border"
                  placeholder="Hospital"
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
                  Update Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserManagement;
