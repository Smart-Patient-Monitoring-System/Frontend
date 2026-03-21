import { API_BASE_URL } from "../../../api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function fetchAssignableDoctors() {
  const response = await fetch(`${API_BASE_URL}/api/admin/doctor-assignments/doctors`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch doctors");
  return response.json();
}

export async function fetchAssignablePatients() {
  const response = await fetch(`${API_BASE_URL}/api/admin/doctor-assignments/patients`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch patients");
  return response.json();
}

export async function fetchDoctorAssignments() {
  const response = await fetch(`${API_BASE_URL}/api/admin/doctor-assignments`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch assignments");
  return response.json();
}

export async function assignDoctorToPatient(doctorId, patientId) {
  const response = await fetch(`${API_BASE_URL}/api/admin/doctor-assignments/assign`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ doctorId, patientId }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to assign doctor");
  }

  return response.json();
}

export async function unassignDoctorFromPatient(patientId) {
  const response = await fetch(`${API_BASE_URL}/api/admin/doctor-assignments/unassign/${patientId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to unassign doctor");
  }

  return response.json();
}
