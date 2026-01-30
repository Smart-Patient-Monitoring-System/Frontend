import React, { useEffect, useState } from "react";

const API = "http://localhost:8080";

export default function AssignPatients() {
  const [hospital, setHospital] = useState("Ruhuna Hospital");
  const [unassigned, setUnassigned] = useState([]);

  const token = localStorage.getItem("token");

  const loadUnassigned = async () => {
    // you need an endpoint for unassigned list (simple to add)
    const res = await fetch(`${API}/api/admin/unassigned?hospital=${encodeURIComponent(hospital)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUnassigned(Array.isArray(data) ? data : []);
  };

  const assignRR = async (patientId) => {
    await fetch(
      `${API}/api/admin/patients/${patientId}/assign-round-robin?hospital=${encodeURIComponent(hospital)}`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    loadUnassigned();
  };

  const assignNext = async () => {
    await fetch(
      `${API}/api/admin/patients/assign-next?hospital=${encodeURIComponent(hospital)}`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    );
    loadUnassigned();
  };

  useEffect(() => {
    loadUnassigned();
  }, [hospital]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Assign Patients (Round Robin)</h2>

      <div style={{ margin: "12px 0" }}>
        <label>Hospital: </label>
        <input value={hospital} onChange={(e) => setHospital(e.target.value)} />
        <button onClick={assignNext} style={{ marginLeft: 10 }}>
          Assign Next Unassigned
        </button>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Patient</th>
            <th>NIC</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {unassigned.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.nicNo}</td>
              <td>
                <button onClick={() => assignRR(p.id)}>Assign (RR)</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
