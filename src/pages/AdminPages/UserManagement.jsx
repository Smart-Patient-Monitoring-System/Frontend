import React, { useEffect, useState } from "react";
import { fetchDoctor } from "./service/docter";

function UserManagement() {
  const [doctors, setDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  // ✅ THIS WAS MISSING
  const filteredDoctors = doctors.filter((doc) =>
    doc.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Doctors</h3>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-4 py-1.5 rounded-full">
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
        onClick={() => console.log("Edit", doctor.id)}
        className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
      >
        Edit
      </button>

      <button
        onClick={() => console.log("Delete", doctor.id)}
        className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
      >
        Delete
      </button>
    </div>
  </div>
))}

      </div>
    </div>
  );
}

export default UserManagement;
