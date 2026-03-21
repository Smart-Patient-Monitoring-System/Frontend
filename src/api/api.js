import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
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

export const getAllSlots = async (doctorId, date) => {
  const res = await API.get(`/availability/doctor/${doctorId}/all`, {
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
  const res = await API.post("/appointments/book", data);
  return res.data;
};

export const getAppointmentTypes = async () => {
  const res = await API.get("/appointment-types");
  return res.data;
};

// GET appointments for logged-in patient
export const getUserAppointments = async () => {
  try {
    const response = await API.get("/appointments/user/success");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user appointments:", err);
    throw err;
  }
};

export const rescheduleAppointment = async ({ appointmentId, newDate, newTime }) => {
  const res = await API.put(`/appointments/reschedule/${appointmentId}`, {
    bookingDate: newDate,
    bookingTime: newTime,
  });
  return res.data;
};

/* =========================
   ADMIN – APPOINTMENTS
========================= */
export const getAllAppointments = async () => {
  const res = await API.get("/admin/appointments");
  return res.data;
};

export const updateAppointmentDate = async (appointmentId, bookingDate, bookingTime) => {
  if (!appointmentId) throw new Error("Appointment ID is required");

  const res = await API.put(
    `/admin/appointments/update-date/${appointmentId}`,
    {
      bookingDate,
      bookingTime
    }
  );

  return res.data;
};

export const confirmAppointment = async (appointmentId, data) => {
  if (!appointmentId) throw new Error("Appointment ID is required");

  // Send data in JSON body
  const res = await API.post(
    `/admin/appointments/confirm/${appointmentId}`,
    data
  );
  return res.data;
};
export default API;

