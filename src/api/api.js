import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});


/* =========================
   Attach JWT token (if exists)
========================= */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* =========================
   SPECIAL DOCTOR CRUD (ADMIN)
========================= */
export const getDoctors = async () => {
  const res = await API.get("/doctors");
  return res.data;
};

export const addDoctor = async (doctorData) => {
  const res = await API.post("/doctors", doctorData);
  return res.data;
};

export const updateDoctor = async (doctorId, doctorData) => {
  const res = await API.put(`/doctors/${doctorId}`, doctorData);
  return res.data;
};

export const deleteDoctor = async (doctorId) => {
  const res = await API.delete(`/doctors/${doctorId}`);
  return res.data;
};

/* =========================
   DOCTOR AVAILABILITY
   (Assumes you have AvailabilityController paths like these)
========================= */
export const getAvailableSlots = async (doctorId, date) => {
  const res = await API.get(`/availability/doctor/${doctorId}`, {
    params: { date },
  });
  return res.data;
};

export const saveAvailability = async ({ doctorId, date, times }) => {
  const res = await API.post("/availability", {
    doctorId,
    date,
    times,
  });
  return res.data;
};

export const updateAvailabilitySlot = async (id, slotData) => {
  const res = await API.put(`/availability/${id}`, slotData);
  return res.data;
};

export const deleteAvailabilitySlot = async (id) => {
  const res = await API.delete(`/availability/${id}`);
  return res.data;
};

/* =========================
   APPOINTMENTS
========================= */
export const bookAppointment = async (data) => {
  // POST /api/appointments/book
  const res = await API.post("/appointments/book", data);
  return res.data;
};

export const getAppointmentTypes = async () => {
  // GET /api/appointment-types
  const res = await API.get("/appointment-types");
  return res.data;
};

// This matches your current backend controller:
// GET /api/appointments/user/success
export const getUserAppointments = async () => {
  try {
    const res = await API.get("/appointments/user/success");
    return res.data;
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return [];
  }
};

/* =========================
   ADMIN – APPOINTMENTS
========================= */

// This matches AdminAppointmentController:
// GET /api/admin/appointments
export const getAllAppointments = async () => {
  const res = await API.get("/admin/appointments");
  return res.data;
};

// This matches AdminAppointmentController:
// POST /api/admin/appointments/confirm/{id}?physicalLocation=... OR ?zoomLink=...
export const confirmAppointment = async (appointmentId, params) => {
  const res = await API.post(
    `/admin/appointments/confirm/${appointmentId}`,
    null,
    { params } // axios will convert this to query string
  );
  return res.data;
};

export default API;
