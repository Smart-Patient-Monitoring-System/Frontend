import { useState, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, Calendar, Heart,
  Pill, AlertCircle, Pencil, X, Save, Loader2,
} from "lucide-react";
import { API_BASE_URL } from "../../api";

/* ── helpers ─────────────────────────────────────────────────────── */
const parseList = (str) => {
  if (!str || typeof str !== "string") return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
};

const parseMedications = (str) => {
  const items = parseList(str);
  return items.map((item) => {
    const dash = item.indexOf(" - ");
    if (dash > 0) return { name: item.slice(0, dash).trim(), frequency: item.slice(dash + 3).trim() };
    return { name: item, frequency: "" };
  });
};

const parseSurgeries = (str) => {
  const items = parseList(str);
  return items.map((item) => {
    const match = item.match(/^(.+?)\s*\((\d{4})\)\s*$/);
    if (match) return { name: match[1].trim(), date: match[2] };
    return { name: item, date: "" };
  });
};

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const formatPatientId = (id) => {
  if (!id) return "N/A";
  return `P-${new Date().getFullYear()}-${String(id).padStart(3, "0")}`;
};

const formatAddress = (address, city, district, postalCode) => {
  const parts = [address, city, district, postalCode].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
};

/* ── MedSection: read-only chip/card display ────────────────────── */
const ChipList = ({ items, color }) =>
  items.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`inline-block ${color} px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium`}>
          {item}
        </span>
      ))}
    </div>
  ) : (
    <span className="text-gray-400 text-sm">None recorded</span>
  );

/* ── main component ─────────────────────────────────────────────── */
const ProfileTab = ({ patientId: propPatientId }) => {
  const [patient, setPatient]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  /* edit-mode state */
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm]         = useState({
    allergies: "",
    currentMedications: "",
    pastSurgeries: "",
    chronicConditions: "",
  });

  /* ── fetch profile ── */
  const fetchProfile = async () => {
    try {
      const id    = propPatientId || localStorage.getItem("patientId");
      const token = localStorage.getItem("token");
      if (!id) { setError("Please log in again."); setLoading(false); return; }
      const res = await fetch(`${API_BASE_URL}/api/patient/get/${id}`, {
        headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      });
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setPatient(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, [propPatientId]);

  /* ── open edit form ── */
  const handleEditClick = () => {
    setForm({
      allergies:          patient?.allergies          || "",
      currentMedications: patient?.currentMedications || "",
      pastSurgeries:      patient?.pastSurgeries       || "",
      chronicConditions:  patient?.chronicConditions   || "",
    });
    setSaveError("");
    setEditing(true);
  };

  /* ── save edits ── */
  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const id    = propPatientId || localStorage.getItem("patientId");
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/patient/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      const updated = await res.json();
      setPatient((prev) => ({ ...prev, ...updated }));
      setEditing(false);
    } catch (err) {
      setSaveError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  /* ── loading / error states ── */
  if (loading) return (
    <div className="space-y-6 w-full">
      <div className="bg-white rounded-xl shadow-md p-6 w-full animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map((i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 rounded-xl shadow-md p-6 w-full border border-red-200">
      <p className="text-red-700 font-medium">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Retry</button>
    </div>
  );

  if (!patient) return null;

  /* ── derived display values ── */
  const age              = calculateAge(patient.dateOfBirth);
  const patientIdFmt     = formatPatientId(patient.id || patient.Id);
  const addressFull      = formatAddress(patient.address, patient.city, patient.district, patient.postalCode);
  const allergiesList    = parseList(patient.allergies);
  const medsList         = parseMedications(patient.currentMedications);
  const chronicList      = parseList(patient.chronicConditions);   // ← correct field
  const surgeriesList    = parseSurgeries(patient.pastSurgeries);

  /* shared textarea style */
  const taClass = "w-full border border-gray-300 rounded-xl px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none";

  return (
    <div className="space-y-6 w-full">

      {/* ══════════════ Personal Information ══════════════ */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left column */}
          <div className="space-y-3 sm:space-y-4">
            {[
              ["Full Name",  patient.name],
              ["Patient ID", patientIdFmt],
              ["Age",        age != null ? `${age} years` : "—"],
              ["Blood Type", patient.bloodType],
              ["NIC No",     patient.nicNo],
              ["Gender",     patient.gender],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium text-sm sm:text-base">{label}</span>
                <span className="text-gray-800 font-semibold text-sm sm:text-base">{val || "—"}</span>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div className="space-y-3 sm:space-y-4">
            {[
              [Mail,    "Email",           patient.email,              true],
              [Phone,   "Phone",           patient.contactNo,          false],
              [MapPin,  "Address",         addressFull,                true],
              [User,    "Emergency Contact", patient.guardiansName,    false],
              [Phone,   "Emergency Phone", patient.guardiansContactNo, false],
            ].map(([Icon, label, val, wrap]) => (
              <div key={label} className="flex items-start py-2 sm:py-3 border-b border-gray-200">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 mt-1 shrink-0" />
                <div className={`flex-1 ${wrap ? "min-w-0" : ""}`}>
                  <span className="text-gray-600 font-medium text-sm sm:text-base block mb-1">{label}</span>
                  <span className={`text-gray-800 text-sm sm:text-base ${wrap ? "break-words" : ""}`}>{val || "—"}</span>
                  {label === "Emergency Contact" && patient.guardianRelationship && (
                    <span className="text-gray-500 text-xs sm:text-sm block">({patient.guardianRelationship})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════ Medical History ══════════════ */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full">

        {/* Header + Edit / Save / Cancel buttons */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Medical History</h2>
          {!editing ? (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>

        {saveError && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {saveError}
          </div>
        )}

        {/* ── Read-only view ── */}
        {!editing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left column */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" /> Allergies
                </h3>
                <ChipList items={allergiesList} color="bg-red-100 text-red-700" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                  <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2" /> Current Medications
                </h3>
                {medsList.length > 0 ? (
                  <div className="space-y-2">
                    {medsList.map((med, i) => (
                      <div key={i} className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{med.name}</p>
                        {med.frequency && <p className="text-gray-600 text-xs sm:text-sm">{med.frequency}</p>}
                      </div>
                    ))}
                  </div>
                ) : <span className="text-gray-400 text-sm">None recorded</span>}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mr-2" /> Chronic Conditions
                </h3>
                <ChipList items={chronicList} color="bg-purple-100 text-purple-700" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mr-2" /> Past Surgeries
                </h3>
                {surgeriesList.length > 0 ? (
                  <div className="space-y-2">
                    {surgeriesList.map((s, i) => (
                      <div key={i} className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">{s.name}</p>
                        {s.date && <p className="text-gray-600 text-xs sm:text-sm">{s.date}</p>}
                      </div>
                    ))}
                  </div>
                ) : <span className="text-gray-400 text-sm">None recorded</span>}
              </div>
            </div>
          </div>
        )}

        {/* ── Edit form ── */}
        {editing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-red-500" /> Allergies
                  <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
                </label>
                <textarea
                  rows={3}
                  className={taClass}
                  placeholder="e.g. Penicillin, Peanuts"
                  value={form.allergies}
                  onChange={(e) => setForm((f) => ({ ...f, allergies: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Pill className="w-4 h-4 text-blue-500" /> Current Medications
                  <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
                </label>
                <textarea
                  rows={3}
                  className={taClass}
                  placeholder="e.g. Metformin - twice daily, Aspirin"
                  value={form.currentMedications}
                  onChange={(e) => setForm((f) => ({ ...f, currentMedications: e.target.value }))}
                />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Heart className="w-4 h-4 text-purple-500" /> Chronic Conditions
                  <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
                </label>
                <textarea
                  rows={3}
                  className={taClass}
                  placeholder="e.g. Diabetes, Hypertension"
                  value={form.chronicConditions}
                  onChange={(e) => setForm((f) => ({ ...f, chronicConditions: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-teal-500" /> Past Surgeries
                  <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
                </label>
                <textarea
                  rows={3}
                  className={taClass}
                  placeholder="e.g. Appendectomy (2018), Knee replacement (2021)"
                  value={form.pastSurgeries}
                  onChange={(e) => setForm((f) => ({ ...f, pastSurgeries: e.target.value }))}
                />
              </div>
            </div>

            <p className="md:col-span-2 text-xs text-gray-400 mt-1">
              Tip: separate multiple items with commas. For medications you can write <em>Name - frequency</em>. For surgeries you can write <em>Name (year)</em>.
            </p>
          </div>
        )}

        {patient.emergencyNotes && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-base font-semibold text-gray-700 mb-2">Emergency Notes</h3>
            <p className="text-gray-800 text-sm sm:text-base bg-amber-50 p-3 rounded-lg">{patient.emergencyNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileTab;
