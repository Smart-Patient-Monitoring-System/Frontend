import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

const pad2 = (n) => String(n).padStart(2, "0");
const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const to12h = (time24) => {
  // expects "HH:mm" or "HH:mm:ss"
  if (!time24) return "N/A";
  const [hh, mm] = time24.split(":");
  let h = Number(hh);
  const m = mm ?? "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
};

const pickColor = (taken) => (taken ? "green" : "orange");

export default function MedicationsCard({ patientId, refreshKey = 0 }) {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [loading, setLoading] = useState(false);
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState(null);

  const fetchMedications = async () => {
    if (!patientId || !token) return;

    setLoading(true);
    setError(null);

    try {
      // Pull events for a safe range (today only)
      const t = todayKey();
      const url = `${API_BASE}/api/patients/${patientId}/medical-events?from=${t}&to=${t}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`Failed to load medications (${res.status})`);

      const events = await res.json();

      const meds = (Array.isArray(events) ? events : [])
        .filter((e) => (e?.type || "").toUpperCase() === "MEDICATION")
        .map((e) => {
          const p = e.payload || {};

          // These keys come from your ReportsCard MEDICATION payload:
          // { name, dose, frequency, durationDays }
          // Add these optional keys if you want:
          // { timeOfDay: "08:00", taken: true/false, takenAt: "2026-02-07T09:10:00" }

          return {
            id: e.id,
            name: p.name || "Unknown",
            dosage: p.dose || "N/A",
            time: p.timeOfDay ? to12h(p.timeOfDay) : "N/A",
            taken: Boolean(p.taken),
            takenAt: p.takenAt || null,
            color: pickColor(Boolean(p.taken)),
          };
        })
        // sort by time (if exists)
        .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

      setMedications(meds);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load medications");
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, refreshKey]);

  // OPTIONAL: If you create a backend endpoint to mark taken
  // PUT /api/patients/{patientId}/medical-events/{eventId}/mark-taken
  const markTaken = async (eventId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/patients/${patientId}/medical-events/${eventId}/mark-taken`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taken: true }),
        }
      );

      if (!res.ok) throw new Error("Failed to mark as taken");
      fetchMedications();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex-1">
          Today&apos;s Medications
        </h2>
      </div>

      {/* States */}
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && (
        <div className="mb-3 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* List */}
      {!loading && medications.length === 0 ? (
        <p className="text-sm text-gray-500">No medications added for today.</p>
      ) : (
        <div className="space-y-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="bg-gray-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Icon */}
              <div
                className={`${
                  med.color === "green" ? "bg-green-500" : "bg-orange-500"
                } rounded-lg p-3 flex-shrink-0 flex items-center justify-center`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{med.name}</h3>
                <p className="text-gray-600 text-sm truncate">
                  {med.dosage} • {med.time}
                </p>

                {med.takenAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Taken at: {new Date(med.takenAt).toLocaleTimeString()}
                  </p>
                )}
              </div>

              {/* Status / Action */}
              {med.taken ? (
                <span className="text-green-500 text-sm font-semibold flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle className="w-4 h-4" />
                  Taken
                </span>
              ) : (
                // If you don’t have markTaken endpoint, remove this button
                <button
                  onClick={() => markTaken(med.id)}
                  className="px-3 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 whitespace-nowrap"
                >
                  Mark Taken
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
