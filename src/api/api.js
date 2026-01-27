import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

/* =========================
   Specail DOCTOR CRUD (ADMIN)
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
========================= */
export const getAvailableSlots = async (doctorId, date) => {
  const res = await API.get(
    `/availability/doctor/${doctorId}?date=${date}`
  );
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
  const res = await API.post("/appointments/book", data);
  return res.data;
};

export const getAppointmentTypes = async () => {
  const res = await API.get("/appointment-types");
  return res.data;
};

/* =========================
   ADMIN – APPOINTMENTS
========================= */

// 🔹 Pending appointments
export const getPendingAppointments = async () => {
  const res = await API.get("/admin/appointments/pending");
  return res.data;
};

// ------------------------
// Admin – Get All Appointments
// ------------------------



//Get user appointments (only successful payments)
export const getUserAppointments = async () => {
  try {
    const res = await API.get("/appointments/user/success");
    return res.data;
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return [];
  }
};


export const getAllAppointments = async () => {
  const res = await API.get("/admin/appointments");
  return res.data;
};

export const confirmAppointment = async (id, params) => {
  const query = new URLSearchParams(params).toString();
  return API.post(`/admin/appointments/confirm/${id}?${query}`);
};




export default API;
