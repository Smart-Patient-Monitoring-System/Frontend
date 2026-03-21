import React, { useState, useEffect } from "react";
import AlertCard from "./componants/AlertCard";
import { AlertTriangle, RefreshCw, Shield } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL;

/* ── JWT helpers ── */
const getToken = () => localStorage.getItem("token");

const getEmailFromToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(
      decodeURIComponent(escape(window.atob(base64)))
    );
    return payload.sub; // email
  } catch {
    return null;
  }
};

/* ── Fetch doctor ID by email ── */
const fetchDoctorId = async () => {
  const token = getToken();
  const email = getEmailFromToken();
  if (!token || !email) return null;

  const res = await fetch(`${API_BASE}/api/doctor/get`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return null;
  const doctors = await res.json();
  if (!Array.isArray(doctors)) return null;

  const me = doctors.find(
    (d) => (d?.email || "").toLowerCase() === email.toLowerCase()
  );

  console.log("Found doctor record:", me);
  return me?.id || me?.Id || null;
};

const parseDateStr = (dateVal) => {
  if (!dateVal) return 0;
  if (Array.isArray(dateVal)) {
    const [y, m, d, h = 0, min = 0, s = 0] = dateVal;
    return new Date(y, m - 1, d, h, min, s).getTime();
  }
  return new Date(dateVal).getTime();
};

const formatAlertDate = (dateVal) => {
  if (!dateVal) return "";
  let d;
  if (Array.isArray(dateVal)) {
    const [y, m, day, h = 0, min = 0, s = 0] = dateVal;
    d = new Date(y, m - 1, day, h, min, s);
  } else {
    d = new Date(dateVal);
  }
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

function CriticalAlertPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const doctorId = await fetchDoctorId();
      if (!doctorId) {
        setError("Could not identify logged-in doctor");
        setLoading(false);
        return;
      }

      const token = getToken();
      const res = await fetch(
        `${API_BASE}/api/doctor/critical-alerts/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to load alerts");

      const data = await res.json();
      const rawAlerts = Array.isArray(data) ? data : [];
      rawAlerts.sort((a, b) => parseDateStr(b.recordedAt) - parseDateStr(a.recordedAt));
      setAlerts(rawAlerts);
      setLastRefresh(new Date());
    } catch (e) {
      setError(e.message || "Error loading alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = alerts.filter(
    (a) => a.severity === "CRITICAL"
  ).length;
  const highCount = alerts.filter((a) => a.severity === "HIGH").length;
  const mediumCount = alerts.filter((a) => a.severity === "MEDIUM").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${criticalCount > 0
              ? "bg-red-500/20 animate-pulse"
              : "bg-emerald-500/20"
              }`}
          >
            <AlertTriangle
              size={22}
              className={
                criticalCount > 0 ? "text-red-500" : "text-emerald-500"
              }
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Critical Alerts
            </h2>
            <p className="text-xs text-gray-400">
              {lastRefresh
                ? `Last updated ${lastRefresh.toLocaleTimeString()}`
                : "Loading…"}
            </p>
          </div>
        </div>

        <button
          onClick={loadAlerts}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 
                     border border-gray-200 text-gray-600 text-sm font-medium
                     hover:bg-white hover:shadow-md transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Severity summary badges */}
      {alerts.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-200">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-semibold text-red-700">
                {criticalCount} Critical
              </span>
            </div>
          )}
          {highCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 border border-orange-200">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-sm font-semibold text-orange-700">
                {highCount} High
              </span>
            </div>
          )}
          {mediumCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-200">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="text-sm font-semibold text-yellow-700">
                {mediumCount} Medium
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Loading state */}
      {loading && alerts.length === 0 && (
        <div className="text-center py-12">
          <RefreshCw
            size={28}
            className="animate-spin text-gray-400 mx-auto mb-3"
          />
          <p className="text-gray-500">Loading alerts…</p>
        </div>
      )}

      {/* No alerts state */}
      {!loading && alerts.length === 0 && !error && (
        <div className="text-center py-12 bg-white/50 rounded-2xl border border-gray-100">
          <Shield size={40} className="text-emerald-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">All Clear</h3>
          <p className="text-gray-400 text-sm mt-1">
            No abnormal vitals detected for your patients
          </p>
        </div>
      )}

      {/* Alert cards */}
      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <AlertCard
            key={`${alert.patientId}-${alert.alertTitle}-${idx}`}
            title={alert.alertTitle}
            patient={alert.patientName}
            description={alert.description}
            currentValue={alert.currentValue}
            normalRange={alert.normalRange}
            severity={alert.severity}
            room={alert.room}
            time={formatAlertDate(alert.recordedAt)}
          />
        ))}
      </div>
    </div>
  );
}

export default CriticalAlertPage;
