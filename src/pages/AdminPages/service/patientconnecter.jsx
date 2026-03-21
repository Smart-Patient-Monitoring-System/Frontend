import { API_BASE_URL } from "../../../api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function fetchPatient() {
  const response = await fetch(`${API_BASE_URL}/api/patient/get`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  return response.json();
}

export async function createPatient(payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/patient/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to create patient");
  }

  return response.json();
}

export async function updatePatient(patientId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/patient/update/${patientId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to update patient");
  }

  return response.json();
}

export async function deletePatient(patientId) {
  const response = await fetch(`${API_BASE_URL}/api/patient/delete/${patientId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to delete patient");
  }

  return response.text();
}