import React, { useEffect, useMemo, useState } from "react";
import {
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  Info,
  User,
  CheckCircle,
  FileText,
} from "lucide-react";

/**
 * IMPORTANT FOR MOBILE:
 * - On phone, http://localhost:8080 won't work.
 * - Use your PC LAN IP like: http://192.168.1.25:8080
 * - Or use ngrok public URL.
 */
const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || "http://10.170.27.47:8080";

export default function EmergencyPanel() {
  const [panelData, setPanelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);
  const [error, setError] = useState("");

  //  Get actual logged userId (your earlier logs showed userId null sometimes)
  const userId = useMemo(() => {
    const raw = localStorage.getItem("userId");
    return raw ? Number(raw) : null;
  }, []);

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    if (!userId) {
      setError("User ID not found. Please login again.");
      setLoading(false);
      return;
    }
    fetchPanelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchPanelData = async () => {
    setLoading(true);
    setError("");

    try {
      // Try with location first
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(
              `${API_BASE}/api/emergency/panel/${userId}?latitude=${latitude}&longitude=${longitude}`,
              {
                method: "GET",
                headers: {
                  ...authHeaders(),
                },
              }
            );

            if (!res.ok) {
              const txt = await res.text();
              setError(`Panel fetch failed: ${res.status} ${txt}`);
              setPanelData(null);
              setLoading(false);
              return;
            }

            const data = await res.json();
            setPanelData(data);
            setLoading(false);
          } catch (e) {
            setError("Network error while fetching panel data.");
            setLoading(false);
          }
        },
        async () => {
          // Location blocked → fetch without location
          await fetchPanelDataWithoutLocation();
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch (e) {
      setError("Unexpected error while fetching panel data.");
      setLoading(false);
    }
  };

  const fetchPanelDataWithoutLocation = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/emergency/panel/${userId}`, {
        method: "GET",
        headers: {
          ...authHeaders(),
        },
      });

      if (!res.ok) {
        const txt = await res.text();
        setError(`Panel fetch failed: ${res.status} ${txt}`);
        setPanelData(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setPanelData(data);
      setLoading(false);
    } catch (e) {
      setError("Network error while fetching panel data (no location).");
      setLoading(false);
    }
  };

  const handleCallAmbulance = async () => {
    if (calling) return;
    setCalling(true);
    setError("");

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // ✅ Create emergency alert first
            const alertRes = await fetch(
              `${API_BASE}/api/emergency/alert/${userId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...authHeaders(),
                },
                body: JSON.stringify({
                  alertType: "MEDICAL_EMERGENCY",
                  description: "Emergency ambulance requested",
                  latitude,
                  longitude,
                  ambulanceCalled: true,
                  contactsNotified: true,
                }),
              }
            );

            if (!alertRes.ok) {
              const txt = await alertRes.text();
              setError(`Creating alert failed: ${alertRes.status} ${txt}`);
              setCalling(false);
              return;
            }

            // ✅ refresh data
            await fetchPanelData();

            // ✅ Open REAL mobile dialer
            window.location.href = "tel:1990";
          } catch (e) {
            setError("Network error while creating alert.");
          } finally {
            setCalling(false);
          }
        },
        () => {
          // Even without location, allow dial + create alert without coords
          // (Optional: you can block if you want)
          window.location.href = "tel:1990";
          setCalling(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch (e) {
      setError("Unexpected error while calling ambulance.");
      setCalling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading emergency panel...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-800 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Top Call Ambulance Card */}
      <div className="bg-red-600 text-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold">Emergency Services</h2>
        </div>

        <button
          onClick={handleCallAmbulance}
          disabled={calling || !token || !userId}
          className="w-full lg:w-auto bg-white text-red-600 rounded-xl py-3 px-6 font-bold text-lg flex items-center justify-center gap-3 hover:bg-red-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Phone className="w-6 h-6" />
          {calling ? "Calling..." : "Call Ambulance (1990)"}
        </button>
      </div>

      {/* ✅ Patient Emergency Info (from registration details) */}
      {panelData?.patientInfo && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Patient Emergency Info (Registration)
            </h3>
          </div>

          <div className="text-sm sm:text-base text-gray-700 space-y-1">
            <p>
              <b>Name:</b> {panelData.patientInfo.name || "N/A"}
            </p>
            <p>
              <b>Blood Type:</b> {panelData.patientInfo.bloodType || "N/A"}
            </p>
            <p>
              <b>Allergies:</b> {panelData.patientInfo.allergies || "N/A"}
            </p>
            <p>
              <b>Medical Conditions:</b>{" "}
              {panelData.patientInfo.medicalConditions || "N/A"}
            </p>
            <p>
              <b>Current Medications:</b>{" "}
              {panelData.patientInfo.currentMedications || "N/A"}
            </p>
            <p>
              <b>Past Surgeries:</b> {panelData.patientInfo.pastSurgeries || "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Grid for other emergency info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* Nearest Hospital */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Nearest Hospital
            </h3>
          </div>

          {panelData?.nearestHospital?.hospital ? (
            <>
              <p className="text-sm sm:text-base text-gray-700 mb-2">
                {panelData.nearestHospital.hospital.name}
              </p>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                {panelData.nearestHospital.distance}
              </p>
              <p className="text-sm sm:text-base text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                ETA: {panelData.nearestHospital.eta}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Enable location to see nearest hospital
            </p>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Emergency Contacts
            </h3>
          </div>

          {panelData?.emergencyContacts?.length > 0 ? (
            <ul className="text-sm sm:text-base text-gray-700 space-y-1">
              {panelData.emergencyContacts.map((c, idx) => (
                <li key={idx}>
                  • {c.relationship}: {c.phoneNumber}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No emergency contacts found</p>
          )}
        </div>

        {/* Emergency Tips */}
        <div className="bg-yellow-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            <h3 className="text-base sm:text-lg font-bold text-yellow-800">
              Emergency Tips
            </h3>
          </div>
          <ul className="text-xs sm:text-sm md:text-base text-yellow-900 list-disc list-inside space-y-1 sm:space-y-1.5">
            <li>Stay calm and call the ambulance immediately.</li>
            <li>Know your nearest hospital location.</li>
            <li>Keep emergency contacts updated.</li>
            <li>Follow first aid if trained.</li>
          </ul>
        </div>

        {/* Safe Actions */}
        <div className="bg-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            <h3 className="text-base sm:text-lg font-bold text-green-800">
              Safe Actions
            </h3>
          </div>
          <ul className="text-xs sm:text-sm md:text-base text-green-900 list-disc list-inside space-y-1 sm:space-y-1.5">
            <li>Do not panic, stay calm.</li>
            <li>Move to a safe area if danger exists.</li>
            <li>Provide clear information to emergency responders.</li>
            <li>Help others only if safe to do so.</li>
          </ul>
        </div>
      </div>

      {/* Active Alert Indicator */}
      {panelData?.activeAlert && (
        <div className="bg-orange-100 border-2 border-orange-500 rounded-xl p-4 sm:p-5">
          <h3 className="text-lg font-bold text-orange-800 mb-2">
            Active Emergency Alert
          </h3>
          <p className="text-sm text-orange-700">
            Type: {panelData.activeAlert.alertType} | Status:{" "}
            {panelData.activeAlert.status} | Created:{" "}
            {new Date(panelData.activeAlert.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
