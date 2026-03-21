import React, { useEffect, useMemo, useState } from "react";
import {
  assignDoctorToPatient,
  fetchAssignableDoctors,
  fetchAssignablePatients,
  fetchDoctorAssignments,
  unassignDoctorFromPatient,
} from "./service/doctorAssignmentConnecter";

function AssignDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [doctorData, patientData, assignmentData] = await Promise.all([
        fetchAssignableDoctors(),
        fetchAssignablePatients(),
        fetchDoctorAssignments(),
      ]);
      setDoctors(Array.isArray(doctorData) ? doctorData : []);
      setPatients(Array.isArray(patientData) ? patientData : []);
      setAssignments(Array.isArray(assignmentData) ? assignmentData : []);
    } catch (error) {
      console.error(error);
      alert("Failed to load doctor assignment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const assignedPatientIds = useMemo(
    () => new Set(assignments.map((item) => item.patientId)),
    [assignments]
  );

  const availablePatients = useMemo(
    () => patients.filter((patient) => !assignedPatientIds.has(patient.Id || patient.id)),
    [patients, assignedPatientIds]
  );

  const filteredAssignments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter(
      (item) =>
        (item.patientName || "").toLowerCase().includes(q) ||
        (item.doctorName || "").toLowerCase().includes(q) ||
        String(item.patientId || "").includes(q) ||
        String(item.doctorId || "").includes(q)
    );
  }, [assignments, search]);

  const handleAssign = async () => {
    if (!selectedDoctorId || !selectedPatientId) {
      alert("Please select both a doctor and a patient");
      return;
    }

    try {
      setActionLoading(true);
      await assignDoctorToPatient(Number(selectedDoctorId), Number(selectedPatientId));
      setSelectedDoctorId("");
      setSelectedPatientId("");
      await loadData();
      alert("Doctor assigned successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to assign doctor");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnassign = async (patientId) => {
    if (!window.confirm("Unassign this patient from the doctor?")) return;

    try {
      setActionLoading(true);
      await unassignDoctorFromPatient(patientId);
      await loadData();
      alert("Doctor unassigned successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to unassign doctor");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Assign Doctors</h2>
        <p className="text-sm text-gray-500 mt-1">
          Assign registered doctors to registered patients without affecting the rest of the portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select
          value={selectedDoctorId}
          onChange={(e) => setSelectedDoctorId(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.Id || doctor.id} value={doctor.Id || doctor.id}>
              {doctor.name} {doctor.position ? `- ${doctor.position}` : ""}
            </option>
          ))}
        </select>

        <select
          value={selectedPatientId}
          onChange={(e) => setSelectedPatientId(e.target.value)}
          className="border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Patient</option>
          {availablePatients.map((patient) => (
            <option key={patient.Id || patient.id} value={patient.Id || patient.id}>
              {patient.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleAssign}
          disabled={actionLoading}
          className="rounded-2xl px-4 py-3 text-white font-medium disabled:opacity-60"
          style={{ background: "linear-gradient(45deg, #007CFC 0%, #11C2BA 100%)" }}
        >
          {actionLoading ? "Processing..." : "Assign Doctor"}
        </button>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search assignments by patient or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Current Assignments</h3>
        </div>

        {loading ? (
          <div className="px-5 py-6 text-gray-500">Loading assignments...</div>
        ) : filteredAssignments.length === 0 ? (
          <div className="px-5 py-6 text-gray-500">No doctor assignments found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Patient</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Doctor</th>
                  <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((item) => (
                  <tr key={item.patientId} className="border-b last:border-b-0 border-gray-100">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">{item.patientName}</div>
                      <div className="text-sm text-gray-500">Patient ID: {item.patientId}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">{item.doctorName}</div>
                      <div className="text-sm text-gray-500">Doctor ID: {item.doctorId}</div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleUnassign(item.patientId)}
                        disabled={actionLoading}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        Unassign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignDoctors;
