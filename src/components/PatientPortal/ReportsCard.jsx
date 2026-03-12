// ReportsCard.jsx (UPDATED)
// Adds sugar level field (already in your code)
//  Adds callback prop: onMedicalEventAdded (so PatientPortal can refresh vitals cards)
// Keeps everything else the same

import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:8080";

/* Convert ISO -> datetime-local value: YYYY-MM-DDTHH:mm */
const toDateTimeLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const ReportsCard = ({ patientId, onMedicalEventAdded }) => {
  // Existing reports state
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [reportName, setReportName] = useState("");

  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // New medical events state
  const [activeTab, setActiveTab] = useState("overview");
  const [medicalSummary, setMedicalSummary] = useState(null);
  const [medicalEvents, setMedicalEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  // Event form state
  const [eventType, setEventType] = useState("VITALS");
  const [recordedAt, setRecordedAt] = useState(
    toDateTimeLocal(new Date().toISOString())
  );
  const [eventPayload, setEventPayload] = useState({});

  // Date range for timeline/report
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  /* -------------------- AUTH FETCH (adds JWT) -------------------- */
  const authFetch = async (url, options = {}) => {
    const headers = new Headers(options.headers || {});

    // If body is FormData, do NOT set Content-Type
    const isFormData = options.body instanceof FormData;

    if (!isFormData) {
      if (!headers.has("Content-Type"))
        headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, { ...options, headers });

    // Helpful error message
    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      try {
        const t = await res.text();
        if (t) msg += `: ${t}`;
      } catch (e) {}
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return res;
  };

  const requirePatientId = () => {
    if (!patientId) {
      setError(
        "Patient ID is required. Please open the portal with a valid patient."
      );
      return false;
    }
    return true;
  };

  const requireToken = () => {
    if (!token) {
      setError("Login token missing. Please login again.");
      return false;
    }
    return true;
  };

  /* -------------------- FETCH REPORTS -------------------- */
  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    if (!requirePatientId() || !requireToken()) {
      setReports([]);
      setLoading(false);
      return;
    }

    try {
      const endpoint = `${API_BASE}/api/patients/${patientId}/reports`;
      const res = await authFetch(endpoint);
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch reports error:", err);
      if (err.status === 403)
        setError(
          "403 Forbidden: You are not allowed to view reports (check JWT/role)."
        );
      else setError("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- FETCH MEDICAL SUMMARY -------------------- */
  const fetchMedicalSummary = async () => {
    if (!requirePatientId() || !requireToken()) return;

    setEventsLoading(true);
    setError(null);

    try {
      const res = await authFetch(
        `${API_BASE}/api/patients/${patientId}/medical-summary`
      );
      const data = await res.json();
      setMedicalSummary(data);
    } catch (err) {
      console.error("Summary fetch error:", err);
      if (err.status === 403)
        setError(
          "403 Forbidden: Cannot load medical summary (check JWT/role)."
        );
      else setError("Failed to load medical summary.");
    } finally {
      setEventsLoading(false);
    }
  };

  /* -------------------- FETCH MEDICAL EVENTS -------------------- */
  const fetchMedicalEvents = async () => {
    if (!requirePatientId() || !requireToken()) return;

    setEventsLoading(true);
    setError(null);

    try {
      let url = `${API_BASE}/api/patients/${patientId}/medical-events`;
      const params = new URLSearchParams();
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await authFetch(url);
      const data = await res.json();
      setMedicalEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Events fetch error:", err);
      if (err.status === 403)
        setError("403 Forbidden: Cannot load events (check JWT/role).");
      else setError("Failed to load medical events.");
    } finally {
      setEventsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    if (patientId) {
      fetchMedicalSummary();
      fetchMedicalEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  /* -------------------- DOWNLOAD REPORT -------------------- */
  const downloadReport = async (id) => {
    try {
      if (!requireToken()) return;

      const res = await authFetch(`${API_BASE}/api/reports/${id}/download`, {
        method: "GET",
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const disposition = res.headers.get("Content-Disposition");
      const filenameMatch = disposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `report_${id}`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report: " + err.message);
    }
  };

  /* -------------------- UPLOAD REPORT -------------------- */
  const handleUpload = async () => {
    if (!file || !reportName.trim()) {
      alert("Please select a file and enter a report name");
      return;
    }
    if (!requirePatientId() || !requireToken()) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("reportName", reportName);
    formData.append("patientId", patientId);

    try {
      const endpoint = `${API_BASE}/api/patients/${patientId}/reports/upload`;

      await authFetch(endpoint, {
        method: "POST",
        body: formData,
      });

      alert("Report uploaded successfully!");
      setFile(null);
      setReportName("");

      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";

      await fetchReports();
      setShowUploadForm(false);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + err.message);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  /* -------------------- ADD MEDICAL EVENT -------------------- */
  const handleAddEvent = async () => {
    if (!requirePatientId() || !requireToken()) return;

    try {
      await authFetch(`${API_BASE}/api/patients/${patientId}/medical-events`, {
        method: "POST",
        body: JSON.stringify({
          type: eventType,
          recordedAt: recordedAt.length === 16 ? `${recordedAt}:00` : recordedAt,
          payload: eventPayload, //  includes sugarLevel automatically
        }),
      });

      alert("Medical event added successfully!");
      setEventPayload({});
      setRecordedAt(toDateTimeLocal(new Date().toISOString()));
      setShowEventForm(false);

      await fetchMedicalSummary();
      await fetchMedicalEvents();

      // IMPORTANT: tell PatientPortal to refresh the vitals cards
      onMedicalEventAdded?.();
    } catch (err) {
      console.error("Add event error:", err);
      alert("Failed to add event: " + err.message);
    }
  };

  /* -------------------- GENERATE PDF REPORT -------------------- */
  const generateReport = async () => {
    if (!requirePatientId() || !requireToken()) return;

    try {
      let url = `${API_BASE}/api/patients/${patientId}/report.pdf`;
      const params = new URLSearchParams();
      if (dateFrom) params.append("from", dateFrom);
      if (dateTo) params.append("to", dateTo);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await authFetch(url, { method: "GET" });
      const blob = await res.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `patient_${patientId}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Report generation error:", err);
      alert("Failed to generate report: " + err.message);
    }
  };

  /* -------------------- HELPERS -------------------- */
  const renderEventPayload = (type, payload = {}) => {
    switch (type) {
      case "VITALS":
        return `BP: ${payload.bp || "N/A"}, SpO2: ${payload.spo2 || "N/A"}${
          payload.sugarLevel ? `, Sugar: ${payload.sugarLevel} mg/dL` : ""
        }${payload.temp ? `, Temp: ${payload.temp}°C` : ""}${
          payload.heartRate ? `, HR: ${payload.heartRate} bpm` : ""
        }`;

      case "MEDICATION":
        return `${payload.name || "N/A"} - ${payload.dose || ""} ${
          payload.frequency || ""
        }`.trim();
      case "DIAGNOSIS":
        return payload.condition || payload.text || "N/A";
      case "ALLERGY":
        return `${payload.allergen || "N/A"}${
          payload.severity ? ` (${payload.severity})` : ""
        }`;
      case "LAB_RESULT":
        return payload.testName || payload.text || "N/A";
      case "NOTE":
        return payload.text || "N/A";
      default:
        return JSON.stringify(payload);
    }
  };

  const renderEventForm = () => {
    switch (eventType) {
      case "VITALS":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Blood Pressure (e.g., 120/80)"
              value={eventPayload.bp || ""}
              onChange={(e) =>
                setEventPayload({ ...eventPayload, bp: e.target.value })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />

            <input
              type="number"
              placeholder="SpO2 (%)"
              value={eventPayload.spo2 || ""}
              onChange={(e) =>
                setEventPayload({ ...eventPayload, spo2: e.target.value })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />

            {/*  Sugar Level */}
            <input
              type="number"
              step="0.1"
              placeholder="Sugar Level (mg/dL)"
              value={eventPayload.sugarLevel || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  sugarLevel: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />

            <input
              type="number"
              step="0.1"
              placeholder="Temperature (°C)"
              value={eventPayload.temp || ""}
              onChange={(e) =>
                setEventPayload({ ...eventPayload, temp: e.target.value })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />

            <input
              type="number"
              placeholder="Heart Rate (bpm)"
              value={eventPayload.heartRate || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  heartRate: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>
        );

      case "MEDICATION":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Medication Name"
              value={eventPayload.name || ""}
              onChange={(e) =>
                setEventPayload({ ...eventPayload, name: e.target.value })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Dose (e.g., 500mg)"
              value={eventPayload.dose || ""}
              onChange={(e) =>
                setEventPayload({ ...eventPayload, dose: e.target.value })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Frequency (e.g., 3 times/day)"
              value={eventPayload.frequency || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  frequency: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Duration (days)"
              value={eventPayload.durationDays || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  durationDays: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
  type="time"
  value={eventPayload.timeOfDay || ""}
  onChange={(e) => setEventPayload({ ...eventPayload, timeOfDay: e.target.value })}
  className="w-full border border-gray-300 px-3 py-2 rounded-md"
/>

          </div>
        );

      case "DIAGNOSIS":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Condition/Diagnosis"
              value={eventPayload.condition || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  condition: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <textarea
              placeholder="Notes"
              value={eventPayload.notes || ""}
              onChange={(e) =>
                setEventPayload({ ...eventPayload, notes: e.target.value })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              rows="3"
            />
          </div>
        );

      case "ALLERGY":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Allergen"
              value={eventPayload.allergen || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  allergen: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <select
              value={eventPayload.severity || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  severity: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="">Select Severity</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
            <textarea
              placeholder="Reaction/Notes"
              value={eventPayload.reaction || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  reaction: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              rows="2"
            />
          </div>
        );

      case "LAB_RESULT":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Test Name"
              value={eventPayload.testName || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  testName: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Result"
              value={eventPayload.result || ""}
              onChange={(e) =>
                setEventPayload({ ...eventPayload, result: e.target.value })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="text"
              placeholder="Reference Range"
              value={eventPayload.referenceRange || ""}
              onChange={(e) =>
                setEventPayload({
                  ...eventPayload,
                  referenceRange: e.target.value,
                })
              }
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
            />
          </div>
        );

      case "NOTE":
        return (
          <textarea
            placeholder="Medical Note"
            value={eventPayload.text || ""}
            onChange={(e) =>
              setEventPayload({ ...eventPayload, text: e.target.value })
            }
            className="w-full border border-gray-300 px-3 py-2 rounded-md"
            rows="4"
          />
        );

      default:
        return null;
    }
  };

  /* -------------------- UI -------------------- */
  if (!patientId) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Patient Medical Records
        </h2>
        <p className="mt-3 text-red-600">
          Patient ID is required. Please open this page from a selected patient
          profile (or pass patientId prop).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <svg
          className="w-5 h-5 text-gray-700"
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
        <h2 className="text-xl font-semibold text-gray-800">
          Patient Medical Records
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {["overview", "timeline", "reports", "generate"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Global error */}
      {error && (
        <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {!showEventForm && (
            <button
              onClick={() => setShowEventForm(true)}
              className="w-full py-4 rounded-xl text-white font-medium"
              style={{
                background: "linear-gradient(90deg, #4A90E2 0%, #56CCF2 100%)",
              }}
            >
              Add Medical Event
            </button>
          )}

          {showEventForm && (
            <div className="p-5 border-2 border-blue-200 rounded-xl bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Add Medical Event</h3>
                <button
                  onClick={() => {
                    setShowEventForm(false);
                    setEventPayload({});
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <select
                  value={eventType}
                  onChange={(e) => {
                    setEventType(e.target.value);
                    setEventPayload({});
                  }}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                >
                  <option value="VITALS">Vitals</option>
                  <option value="MEDICATION">Medication</option>
                  <option value="DIAGNOSIS">Diagnosis</option>
                  <option value="ALLERGY">Allergy</option>
                  <option value="LAB_RESULT">Lab Result</option>
                  <option value="NOTE">Note</option>
                </select>

                <input
                  type="datetime-local"
                  value={recordedAt}
                  onChange={(e) => setRecordedAt(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />

                {renderEventForm()}

                <button
                  onClick={handleAddEvent}
                  className="w-full px-4 py-2 rounded-md text-white font-medium bg-blue-500 hover:bg-blue-600"
                >
                  Add Event
                </button>
              </div>
            </div>
          )}

          {eventsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading summary...</div>
          ) : medicalSummary ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 text-lg">
                Current Medical Summary
              </h3>

              {medicalSummary.latestVitals && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Latest Vitals
                  </h4>
                  <p className="text-sm text-gray-600">
                    {renderEventPayload("VITALS", medicalSummary.latestVitals)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(
                      medicalSummary.latestVitals.recordedAt ||
                        medicalSummary.latestVitalsDate
                    ).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No medical summary available
            </div>
          )}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md"
            />
            <button
              onClick={fetchMedicalEvents}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Filter
            </button>
          </div>

          {eventsLoading ? (
            <div className="text-center py-8 text-gray-500">Loading timeline...</div>
          ) : medicalEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No medical events found</div>
          ) : (
            <div className="space-y-3">
              {medicalEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {event.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(event.recordedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-800">
                    {renderEventPayload(event.type, event.payload)}
                  </p>
                  {event.createdBy && (
                    <p className="text-xs text-gray-500 mt-2">
                      Added by: {event.createdBy}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div>
          {!showUploadForm && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="w-full mb-6 py-4 rounded-xl text-white font-medium"
              style={{
                background: "linear-gradient(90deg, #4A90E2 0%, #56CCF2 100%)",
              }}
            >
              Upload New Report
            </button>
          )}

          {showUploadForm && (
            <div className="mb-6 p-5 border-2 border-blue-200 rounded-xl bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Upload New Report</h3>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    setFile(null);
                    setReportName("");
                    setError(null);
                    const fileInput = document.getElementById("file-input");
                    if (fileInput) fileInput.value = "";
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Report name (e.g., X-ray report)"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  disabled={uploading}
                />

                <input
                  id="file-input"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md bg-white"
                  disabled={uploading}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />

                {file && (
                  <p className="text-sm text-gray-600">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading || !file || !reportName.trim()}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium ${
                    uploading || !file || !reportName.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {uploading ? "Uploading..." : "Upload Report"}
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No reports available</div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{report.reportName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(report.uploadedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadReport(report.id)}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Generate Tab */}
      {activeTab === "generate" && (
        <div className="space-y-6">
          <div className="p-5 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4">
              Generate Medical Report
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate a PDF report including patient information, medical summary,
              timeline, and uploaded reports.
            </p>

            <div className="space-y-3 mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Date Range (Optional)
              </label>
              <div className="flex gap-3">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
            </div>

            <button
              onClick={generateReport}
              className="w-full py-3 rounded-lg text-white font-medium"
              style={{
                background: "linear-gradient(90deg, #4A90E2 0%, #56CCF2 100%)",
              }}
            >
              Generate PDF Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsCard;
