import React, { useEffect, useState } from "react";
import { getAllAppointments } from "../../../api/api";
import AppointmentsTable from "./AppointmentsTable";

export default function AdminConfirmAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#F0F6FF] min-h-[calc(100vh-80px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Confirm Appointments</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review all system bookings across all doctors and manually set locations or meeting links.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading system appointments...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-1">
          <AppointmentsTable
            appointments={appointments}
            isAdminView={true}
            isDoctorView={false}
            refreshData={load}
          />
        </div>
      )}
    </div>
  );
}
