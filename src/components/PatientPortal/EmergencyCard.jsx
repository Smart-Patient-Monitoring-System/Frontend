import React, { useEffect, useMemo, useState } from "react";
import { Phone, MapPin, Clock, AlertTriangle } from "lucide-react";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || "http://10.170.27.47:8080";

export default function EmergencyCard() {
  const [panelData, setPanelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);
  const [error, setError] = useState("");

  const userId = useMemo(() => {
    const raw = localStorage.getItem("userId");
    return raw ? Number(raw) : null;
  }, []);

  const token = useMemo(() => localStorage.getItem("token"), []);

  const authHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  useEffect(() => {
    if (!userId) {
      setError("User ID not found. Please login again.");
      setLoading(false);
      return;
    }
    fetchPanelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchPanelData = async () => {
    setLoading(true);
    setError("");

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(
              `${API_BASE}/api/emergency/panel/${userId}?latitude=${latitude}&longitude=${longitude}`,
              { method: "GET", headers: { ...authHeaders() } }
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
          } catch {
            setError("Network error while fetching panel data.");
            setLoading(false);
          }
        },
        async () => {
          // location blocked -> fetch without location
          await fetchPanelDataWithoutLocation();
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch {
      setError("Unexpected error while fetching panel data.");
      setLoading(false);
    }
  };

  const fetchPanelDataWithoutLocation = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/emergency/panel/${userId}`, {
        method: "GET",
        headers: { ...authHeaders() },
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
    } catch {
      setError("Network error while fetching panel data (no location).");
      setLoading(false);
    }
  };

  const callAmbulance = async () => {
    if (calling) return;
    setCalling(true);
    setError("");

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
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

            await fetchPanelData();
            window.location.href = "tel:1990";
          } catch {
            setError("Network error while creating alert.");
          } finally {
            setCalling(false);
          }
        },
        () => {
          // allow dialing even without location
          window.location.href = "tel:1990";
          setCalling(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch {
      setError("Unexpected error while calling ambulance.");
      setCalling(false);
    }
  };

  const nearestName = panelData?.nearestHospital?.hospital?.name;
  const nearestDistance = panelData?.nearestHospital?.distance;
  const nearestEta = panelData?.nearestHospital?.eta;
  const contacts = panelData?.emergencyContacts || [];

  return (
    <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl w-full">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-7 h-7" />
          <h2 className="text-xl font-bold">Emergency</h2>
        </div>

        <button
          onClick={callAmbulance}
          disabled={calling || !token || !userId}
          className="bg-white text-red-600 rounded-xl py-2.5 px-4 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Phone className="w-5 h-5" />
          {calling ? "Calling..." : "1990"}
        </button>
      </div>

      {loading && <p className="text-red-50 mb-3">Loading...</p>}
      {error && (
        <div className="bg-white/20 border border-white/30 rounded-xl p-3 mb-3 text-red-50 text-sm">
          {error}
        </div>
      )}

      <div className="bg-red-400/30 rounded-xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-50">
          <MapPin className="w-5 h-5" />
          <span className="font-semibold">
            {nearestDistance ? nearestDistance : "Nearest: —"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-red-50">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">{nearestEta ? nearestEta : "ETA: —"}</span>
        </div>
      </div>

      {nearestName && (
        <p className="text-red-50 mb-2 text-sm">
          <span className="font-semibold">Hospital:</span> {nearestName}
        </p>
      )}

      <div className="space-y-1 text-left text-sm">
        <p className="font-semibold mb-1">Contacts:</p>
        {contacts.length > 0 ? (
          contacts.slice(0, 2).map((c, idx) => (
            <p key={idx} className="text-red-50">
              • {c.relationship}: {c.phoneNumber}
            </p>
          ))
        ) : (
          <p className="text-red-50">No contacts</p>
        )}
      </div>
    </div>
  );
}
