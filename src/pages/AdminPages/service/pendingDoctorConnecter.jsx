const BASE_URL = import.meta.env.VITE_API_URL + "/api/pendingdoctor";

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

export async function deletePendingDoctor(doctorId) {
  const res = await fetch(
    `${BASE_URL}/delete/${doctorId}`,
    {
      method: "DELETE",
    }
  );
  return handleResponse(res);
}

export async function acceptDocter(doctorId){
  const res = await fetch(
    `${BASE_URL}/accept/${doctorId}`,
    {
      method:"POST"
    }
  );
  return handleResponse(res);

}