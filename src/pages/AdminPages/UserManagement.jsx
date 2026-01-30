import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api";
import { fetchDoctor, deleteDoctor, updateDoctor } from "./service/docter";

function UserManagement() {
  const [doctors, setDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editDoctorId, setEditDoctorId] = useState(null);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadDoctors() {
      try {
        const data = await fetchDoctor();
        setDoctor(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= HANDLERS ================= */

  const handleView = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
  };

  const handleEdit = (doctor) => {
    setEditDoctorId(doctor.Id || doctor.id);
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

  const handleDelete = async (doctorId) => {
    if (!window.confirm("Reject this doctor?")) return;
    try {
      await deleteDoctor(doctorId);
      setDoctor((prev) => prev.filter((d) => d.Id !== doctorId));
      alert("Doctor rejected successfully");
    } catch {
      alert("Failed to reject doctor");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      await updateDoctor(editDoctorId, editFormData);
      const data = await fetchDoctor();
      setDoctor(data || []);
      setShowEditModal(false);
      alert("Doctor updated successfully");
    } catch {
      alert("Failed to update doctor");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Doctors</h3>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full"
        >
          Add Doctor
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Doctors..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-gray-100 rounded-full text-sm"
      />

      {loading && <p className="text-sm text-gray-500">Loading...</p>}

      {!loading &&
        filteredDoctors.map((doctor) => (
          <div
            key={doctor.Id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-2"
          >
            <div>
              <p className="font-medium text-gray-800">{doctor.name}</p>
              <p className="text-sm text-gray-500">{doctor.position}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleView(doctor)}
                className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700"
              >
                View
              </button>
              <button
                onClick={() => handleEdit(doctor)}
                className="text-xs px-3 py-1 rounded bg-yellow-100 text-yellow-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(doctor.Id)}
                className="text-xs px-3 py-1 rounded bg-red-100 text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      {/* ================= VIEW MODAL ================= */}
      {showViewModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Doctor Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-xl text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <Detail label="Name" value={selectedDoctor.name} />
              <Detail label="Doctor Reg No" value={selectedDoctor.doctorRegNo} />
              <Detail label="Position" value={selectedDoctor.position} />
              <Detail label="Hospital" value={selectedDoctor.hospital} />
              <Detail label="Email" value={selectedDoctor.email} />
              <Detail label="Contact No" value={selectedDoctor.contactNo} />
              <Detail label="Gender" value={selectedDoctor.gender} />
              <Detail label="Date of Birth" value={selectedDoctor.dateOfBirth} />
              <div className="md:col-span-2">
                <Detail label="Address" value={selectedDoctor.address} />
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT MODAL (unchanged layout) ================= */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Edit Doctor</h2>
            <form onSubmit={handleUpdateDoctor} className="grid grid-cols-2 gap-4">
              {Object.keys(editFormData).map((key) => (
                <input
                  key={key}
                  name={key}
                  value={editFormData[key]}
                  onChange={handleEditInputChange}
                  placeholder={key}
                  className="border rounded px-3 py-2"
                />
              ))}
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SMALL HELPER ================= */

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value || "-"}</p>
  </div>
);

export default UserManagement;
