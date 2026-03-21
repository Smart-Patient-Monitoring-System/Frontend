import { API_BASE_URL } from "../../../api";

// Fallback: try mainservice directly if gateway fails
const MAINSERVICE_URL = import.meta.env.VITE_MAINSERVICE_URL || "http://localhost:8080";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

async function fetchWithFallback(path) {
  // Try via apigateway first
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (response.ok) return response.json();
    // If gateway returns 404/503, fall through to direct call
    if (response.status !== 404 && response.status !== 503 && response.status !== 502) {
      throw new Error(`Request failed: ${response.status}`);
    }
  } catch (e) {
    // Network error or gateway down - try direct
  }

  // Fallback: call mainservice directly
  const directResponse = await fetch(`${MAINSERVICE_URL}${path}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!directResponse.ok) throw new Error(`Failed to fetch ${path}: ${directResponse.status}`);
  return directResponse.json();
}

export async function fetchAssignableDoctors() {
  return fetchWithFallback("/api/doctor-assignments/doctors");
}

export async function fetchAssignablePatients() {
  return fetchWithFallback("/api/doctor-assignments/patients");
}

export async function fetchDoctorAssignments() {
  return fetchWithFallback("/api/doctor-assignments");
}

export async function assignDoctorToPatient(doctorId, patientId) {
  // Try gateway first, then direct
  const urls = [
    `${API_BASE_URL}/api/doctor-assignments/assign`,
    `${MAINSERVICE_URL}/api/doctor-assignments/assign`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ doctorId, patientId }),
      });
      if (response.ok) return response.json();
      if (response.status !== 404 && response.status !== 503 && response.status !== 502) {
        const text = await response.text();
        throw new Error(text || `Failed: ${response.status}`);
      }
    } catch (e) {
      if (url === urls[urls.length - 1]) throw e;
    }
  }
}

export async function unassignDoctorFromPatient(patientId) {
  const urls = [
    `${API_BASE_URL}/api/doctor-assignments/unassign/${patientId}`,
    `${MAINSERVICE_URL}/api/doctor-assignments/unassign/${patientId}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) return response.json();
      if (response.status !== 404 && response.status !== 503 && response.status !== 502) {
        const text = await response.text();
        throw new Error(text || `Failed: ${response.status}`);
      }
    } catch (e) {
      if (url === urls[urls.length - 1]) throw e;
    }
  }
}
