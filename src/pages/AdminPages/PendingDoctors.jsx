import React, { useEffect, useState } from "react";
import { acceptDocter, deletePendingDoctor, fetchPendingDoctor } from "./service/pendingDoctorConnecter";

function PendingDoctors() {
  const [pendingdoctors, setPendingDoctor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");


  useEffect(() => {
    async function load() {
      try {
        const data = await fetchPendingDoctor();
        setPendingDoctor(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  const filteredPendingDoctors = pendingdoctors.filter((pendingdoc) =>
    pendingdoc.name?.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleDelete = async (doctorId) => {
  if (!window.confirm("Reject this doctor?")) return;

  try {
    await deletePendingDoctor(doctorId);

    setPendingDoctor((prev) =>
      prev.filter((doc) => doc.Id !== doctorId)
    );

    alert("Doctor rejected successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to reject doctor");
  }
};

const handleAccept = async (doctorId) => {
  if (!window.confirm("Accept this doctor?")) return;

  try {
    await acceptDocter(doctorId);

    // remove accepted doctor from pending list
    setPendingDoctor((prev) =>
      prev.filter((doc) => doc.Id !== doctorId)
    );

    alert("Doctor accepted successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to accept doctor");
  }
};


  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Pending Doctors</h3>
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

        {!loading && filteredPendingDoctors.length === 0 && (
          <p className="text-sm text-gray-500">No doctors found</p>
        )}

        {filteredPendingDoctors.map((pendingdoctor) => (
          <div
            key={pendingdoctor.id}
            className="flex justify-between items-start bg-gray-50 p-4 rounded-xl"
          >
            {/* LEFT SIDE – Doctor Info */}
            <div className="space-y-1">
              <p className="font-medium text-gray-800">
                {pendingdoctor.name}
              </p>

              <p className="text-sm text-gray-500">
                {pendingdoctor.position} · {pendingdoctor.doctorRegNo}
              </p>

              <p className="text-sm text-gray-500">
                {pendingdoctor.hospital}
              </p>

              <p className="text-sm text-gray-500">
                📧 {pendingdoctor.email}
              </p>

              <p className="text-sm text-gray-500">
                📞 {pendingdoctor.contactNo}
              </p>

              <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {pendingdoctor.gender}
              </span>
            </div>

            

            {/* RIGHT SIDE – ACTION BUTTONS */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleAccept(pendingdoctor.Id)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-1.5 rounded-full"
              >
                Accept
              </button>

              <button
                    onClick={() => handleDelete(pendingdoctor.Id)}
                    className="bg-red-500 text-white text-sm px-4 py-1.5 rounded-full"
              >
              Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PendingDoctors;
