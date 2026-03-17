const BASE_URL = import.meta.env.VITE_API_URL + "/api/doctor";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}

export async function fetchDoctor() {
  const res = await fetch(`${BASE_URL}/get`);
  return handleResponse(res);
}

export async function deleteDoctor(doctorId) {
  const res = await fetch(`${BASE_URL}/delete/${doctorId}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

export async function updateDoctor(doctorId, data) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/update/${doctorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}