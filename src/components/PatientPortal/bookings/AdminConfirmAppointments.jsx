import React, { useEffect, useState } from "react";
import { getAllAppointments, confirmAppointment } from "../../../api/api";

export default function AdminConfirmAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [input, setInput] = useState({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getAllAppointments();
    setAppointments(Array.isArray(data) ? data : []);
  };

  const confirm = async (a) => {
    const params =
      a.appointmentType === "Physical"
        ? { physicalLocation: input[a.appointmentId] }
        : { zoomLink: input[a.appointmentId] };

    await confirmAppointment(a.appointmentId, params);
    load();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Confirm Appointments</h1>

      {appointments.map((a) => (
        <div key={a.appointmentId} className="border p-4 mb-4 rounded shadow">
          <p>
            <b>Doctor:</b> {a.doctorName}
          </p>
          <p>
            <b>Specialty:</b> {a.specialty}
          </p>
          <p>
            <b>Type:</b> {a.appointmentType}
          </p>
          <p>
            <b>Date:</b> {a.bookingDate}
          </p>
          <p>
            <b>Time:</b> {a.bookingTime}
          </p>
          <p>
            <b>Status:</b> {a.appointmentStatus}
          </p>
          <p>
            <b>Payment:</b> {a.paymentStatus}
          </p>
          <p>
            <b>Location / Link:</b> {a.locationOrLink}
          </p>

          {a.appointmentStatus === "PENDING" &&
            a.paymentStatus === "SUCCESS" && (
              <>
                <input
                  className="border p-2 w-full my-2"
                  placeholder={
                    a.appointmentType === "Physical"
                      ? "Enter location"
                      : "Enter meeting link"
                  }
                  onChange={(e) =>
                    setInput({ ...input, [a.appointmentId]: e.target.value })
                  }
                />
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={() => confirm(a)}
                >
                  Confirm
                </button>
              </>
            )}
        </div>
      ))}
    </div>
  );
}
