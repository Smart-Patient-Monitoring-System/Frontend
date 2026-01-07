import React, { useEffect, useState } from "react";
import { fetchPatient } from "./service/patientconnecter";

function PatientManagement() {
  const [patients, setPatient] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Patients</h3>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-4 py-1.5 rounded-full">
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

      <p className="font-medium text-gray-800">
        {patient.guardiansName}.{patient.guardiansContactNo}
      </p>

    
      <p className="text-sm text-gray-500">
        📞 {patient.contactNo}
      </p>

      <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
        {patient.gender}
      </span>

      <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
        {patient.bloodType}
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
    </div>
  );
}

export default PatientManagement;
