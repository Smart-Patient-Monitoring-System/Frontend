import React, { useEffect, useState } from "react";
import {
  getAllAppointments,
  confirmAppointment,
  updateAppointmentDate,
} from "../../../api/api";

export default function AdminConfirmAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [dates, setDates] = useState({});
  const [times, setTimes] = useState({});
  const [locations, setLocations] = useState({});

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAllAppointments();
      console.log("Appointments from backend:", data);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load appointments:", err);
    }
  };

  const confirm = async (appointment) => {
    const appointmentId = appointment.id || appointment.appointmentId;
    if (!appointmentId) {
      alert("Appointment ID is missing");
      return;
    }

    const value = locations[appointmentId];
    if (!value) {
      alert(
        appointment.appointmentType === "Physical"
          ? "Please enter a location"
          : "Please enter a meeting link",
      );
      return;
    }

    const params =
      appointment.appointmentType === "Physical"
        ? { physicalLocation: value }
        : { zoomLink: value };

    try {
      await confirmAppointment(appointmentId, params);
      loadAppointments();
      setLocations((prev) => ({ ...prev, [appointmentId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to confirm appointment. Check console for details.");
    }
  };

  const updateDate = async (appointment) => {
    const appointmentId = appointment.id || appointment.appointmentId;

    if (!appointmentId) {
      alert("Appointment ID is missing");
      return;
    }

    const dateValue = dates[appointmentId];
    const timeValue = times[appointmentId];

    if (!dateValue && !timeValue) {
      alert("Please change date or time");
      return;
    }

    try {
      await updateAppointmentDate(appointmentId, dateValue, timeValue);
      loadAppointments();

      setDates((prev) => ({ ...prev, [appointmentId]: "" }));
      setTimes((prev) => ({ ...prev, [appointmentId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment. Check console for details.");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Admin Appointment Management
      </h1>

      <div className="grid gap-6">
        {appointments.map((a) => {
          const appointmentId = a.id || a.appointmentId;

          return (
            <div
              key={appointmentId}
              className="bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition"
            >
              {/* Doctor Info */}
              <div className="grid md:grid-cols-2 gap-4 text-gray-700">
                <p>
                  <span className="font-semibold">Doctor:</span> {a.doctorName}
                </p>

                <p>
                  <span className="font-semibold">Specialty:</span>{" "}
                  {a.specialty}
                </p>

                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {a.appointmentType}
                </p>

                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {a.appointmentStatus}
                </p>

                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {a.paymentStatus}
                </p>

                <p>
                  <span className="font-semibold">Location / Link:</span>{" "}
                  {a.locationOrLink}
                </p>
              </div>

              {/* Date + Time */}
              <div className="grid md:grid-cols-3 gap-4 mt-5 items-center">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Date
                  </label>

                  <input
                    type="date"
                    className="border w-full px-3 py-2 rounded-md mt-1"
                    value={dates[appointmentId] || a.bookingDate}
                    onChange={(e) =>
                      setDates((prev) => ({
                        ...prev,
                        [appointmentId]: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Time
                  </label>

                  <input
                    type="time"
                    className="border w-full px-3 py-2 rounded-md mt-1"
                    value={times[appointmentId] || a.bookingTime}
                    onChange={(e) =>
                      setTimes((prev) => ({
                        ...prev,
                        [appointmentId]: e.target.value,
                      }))
                    }
                  />
                </div>

                {(dates[appointmentId] || times[appointmentId]) && (
                  <div className="mt-5 md:mt-6">
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      onClick={() => updateDate(a)}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Confirm Section */}
              {a.appointmentStatus === "PENDING" &&
                a.paymentStatus === "SUCCESS" && (
                  <div className="mt-6 border-t pt-4">
                    <input
                      className="border w-full px-3 py-2 rounded-md mb-3"
                      placeholder={
                        a.appointmentType === "Physical"
                          ? "Enter location"
                          : "Enter meeting link"
                      }
                      value={locations[appointmentId] || ""}
                      onChange={(e) =>
                        setLocations((prev) => ({
                          ...prev,
                          [appointmentId]: e.target.value,
                        }))
                      }
                    />

                    <button
                      className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
                      onClick={() => confirm(a)}
                    >
                      Confirm Appointment
                    </button>
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
