import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Heart, Pill, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "../../api";

// Parse comma-separated string into array of trimmed non-empty strings
const parseList = (str) => {
  if (!str || typeof str !== "string") return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
};

// Parse medications: "Name - frequency" or just "Name"
const parseMedications = (str) => {
  const items = parseList(str);
  return items.map((item) => {
    const dash = item.indexOf(" - ");
    if (dash > 0) {
      return { name: item.slice(0, dash).trim(), frequency: item.slice(dash + 3).trim() };
    }
    return { name: item, frequency: "" };
  });
};

// Parse past surgeries: "Name (year)" or just "Name"
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
  const year = new Date().getFullYear();
  return `P-${year}-${String(id).padStart(3, "0")}`;
};

const formatAddress = (address, city, district, postalCode) => {
  const parts = [address, city, district, postalCode].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
};

const ProfileTab = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const patientId = localStorage.getItem("patientId");
        const token = localStorage.getItem("token");
        if (!patientId) {
          setError("Please log in again.");
          setLoading(false);
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/patient/get/${patientId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!response.ok) throw new Error("Failed to load profile");
        const data = await response.json();
        setPatient(data);
        setError(null);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div className="bg-white rounded-xl shadow-md p-6 w-full animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 w-full animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-40 mb-6" />
          <div className="space-y-4">
            <div className="h-20 bg-gray-100 rounded" />
            <div className="h-20 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl shadow-md p-6 w-full border border-red-200">
        <p className="text-red-700 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!patient) return null;

  const age = calculateAge(patient.dateOfBirth);
  const patientIdFormatted = formatPatientId(patient.id);
  const addressFull = formatAddress(patient.address, patient.city, patient.district, patient.postalCode);
  const allergiesList = parseList(patient.allergies);
  const medicationsList = parseMedications(patient.currentMedications);
  const chronicConditionsList = parseList(patient.medicalConditions);
  const pastSurgeriesList = parseSurgeries(patient.pastSurgeries);

  return (
    <div className="space-y-6 w-full">
      {/* Personal Information Card */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium text-sm sm:text-base">Full Name</span>
              <span className="text-gray-800 font-semibold text-sm sm:text-base">{patient.name || "—"}</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium text-sm sm:text-base">Patient ID</span>
              <span className="text-gray-800 font-semibold text-sm sm:text-base">{patientIdFormatted}</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium text-sm sm:text-base">Age</span>
              <span className="text-gray-800 font-semibold text-sm sm:text-base">
                {age != null ? `${age} years` : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium text-sm sm:text-base">Blood Type</span>
              <span className="text-gray-800 font-semibold text-sm sm:text-base">{patient.bloodType || "—"}</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium text-sm sm:text-base">NIC No</span>
              <span className="text-gray-800 font-semibold text-sm sm:text-base">{patient.nicNo || "—"}</span>
            </div>
            <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium text-sm sm:text-base">Gender</span>
              <span className="text-gray-800 font-semibold text-sm sm:text-base">{patient.gender || "—"}</span>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start py-2 sm:py-3 border-b border-gray-200">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-gray-600 font-medium text-sm sm:text-base block mb-1">Email</span>
                <span className="text-gray-800 text-sm sm:text-base break-words">{patient.email || "—"}</span>
              </div>
            </div>
            <div className="flex items-start py-2 sm:py-3 border-b border-gray-200">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 mt-1 shrink-0" />
              <div className="flex-1">
                <span className="text-gray-600 font-medium text-sm sm:text-base block mb-1">Phone</span>
                <span className="text-gray-800 text-sm sm:text-base">{patient.contactNo || "—"}</span>
              </div>
            </div>
            <div className="flex items-start py-2 sm:py-3 border-b border-gray-200">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-gray-600 font-medium text-sm sm:text-base block mb-1">Address</span>
                <span className="text-gray-800 text-sm sm:text-base break-words">{addressFull}</span>
              </div>
            </div>
            <div className="flex items-start py-2 sm:py-3 border-b border-gray-200">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 mt-1 shrink-0" />
              <div className="flex-1">
                <span className="text-gray-600 font-medium text-sm sm:text-base block mb-1">Emergency Contact</span>
                <span className="text-gray-800 text-sm sm:text-base">{patient.guardiansName || "—"}</span>
                {patient.guardianRelationship && (
                  <span className="text-gray-500 text-xs sm:text-sm block">({patient.guardianRelationship})</span>
                )}
              </div>
            </div>
            <div className="flex items-start py-2 sm:py-3 border-b border-gray-200">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mr-2 sm:mr-3 mt-1 shrink-0" />
              <div className="flex-1">
                <span className="text-gray-600 font-medium text-sm sm:text-base block mb-1">Emergency Phone</span>
                <span className="text-gray-800 text-sm sm:text-base">{patient.guardiansContactNo || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History Card */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Medical History</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" />
                Allergies
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {allergiesList.length > 0 ? (
                  allergiesList.map((allergy, index) => (
                    <span
                      key={index}
                      className="inline-block bg-red-100 text-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {allergy}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None recorded</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2" />
                Current Medications
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {medicationsList.length > 0 ? (
                  medicationsList.map((med, index) => (
                    <div key={index} className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">{med.name}</p>
                      {med.frequency && <p className="text-gray-600 text-xs sm:text-sm">{med.frequency}</p>}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None recorded</span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mr-2" />
                Chronic Conditions
              </h3>
              <div className="space-y-1 sm:space-y-2">
                {chronicConditionsList.length > 0 ? (
                  chronicConditionsList.map((condition, index) => (
                    <div key={index} className="bg-purple-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base">
                      <p className="text-gray-800">{condition}</p>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None recorded</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 mr-2" />
                Past Surgeries
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {pastSurgeriesList.length > 0 ? (
                  pastSurgeriesList.map((surgery, index) => (
                    <div key={index} className="bg-gray-50 p-2 sm:p-3 rounded-lg text-sm sm:text-base">
                      <p className="font-semibold text-gray-800">{surgery.name}</p>
                      {surgery.date && <p className="text-gray-600 text-xs sm:text-sm">{surgery.date}</p>}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">None recorded</span>
                )}
              </div>
            </div>
          </div>
        </div>

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
