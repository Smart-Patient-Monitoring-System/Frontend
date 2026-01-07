const BASE_URL = "http://localhost:8080/api/doctor";

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

export async function fetchPendingDoctor() {
  const res = await fetch(`${BASE_URL}/get`);
  return handleResponse(res);
}
