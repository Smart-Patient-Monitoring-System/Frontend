import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../api";

function IotDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/sensordata/devices`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      let data = [];

      try {
        data = text ? JSON.parse(text) : [];
      } catch {
        data = [];
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch devices");
      }

      setDevices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load IoT devices");
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const q = search.toLowerCase();

      return (
        String(device.deviceId || "").toLowerCase().includes(q) ||
        String(device.status || "").toLowerCase().includes(q) ||
        String(device.userId || "").toLowerCase().includes(q)
      );
    });
  }, [devices, search]);

  const getStatusStyle = (status) => {
    switch ((status || "").toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INACTIVE":
        return "bg-red-100 text-red-700";
      case "UNASSIGNED":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const maskToken = (token) => {
    if (!token) return "-";
    if (token.length <= 6) return token;
    return `${token.slice(0, 3)}***${token.slice(-3)}`;
  };

  const totalDevices = devices.length;
  const activeDevices = devices.filter(
    (d) => String(d.status || "").toUpperCase() === "ACTIVE"
  ).length;
  const assignedDevices = devices.filter((d) => d.userId !== null && d.userId !== undefined).length;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">IoT Devices</h3>
          <p className="text-sm text-gray-500">
            Monitor device assignment and status
          </p>
        </div>

        <button
          onClick={fetchDevices}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Total Devices</p>
          <p className="text-2xl font-bold text-blue-700">{totalDevices}</p>
        </div>

        <div className="bg-green-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Active Devices</p>
          <p className="text-2xl font-bold text-green-700">{activeDevices}</p>
        </div>

        <div className="bg-purple-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">Assigned Devices</p>
          <p className="text-2xl font-bold text-purple-700">{assignedDevices}</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search by device ID, status, or patient ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
      />

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading && <p className="text-sm text-gray-500">Loading devices...</p>}

      {!loading && filteredDevices.length === 0 && (
        <p className="text-sm text-gray-500">No IoT devices found</p>
      )}

      {!loading && filteredDevices.length > 0 && (
        <div className="space-y-3">
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              className="bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">
                  {device.deviceId || "-"}
                </p>
                <p className="text-sm text-gray-500">
                  Token: {maskToken(device.deviceToken)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 text-sm">
                <div>
                  <p className="text-gray-500">Patient ID</p>
                  <p className="font-medium text-gray-800">
                    {device.userId ?? "Unassigned"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      device.status
                    )}`}
                  >
                    {device.status || "UNKNOWN"}
                  </span>
                </div>

                <div>
                  <p className="text-gray-500">Device Row ID</p>
                  <p className="font-medium text-gray-800">{device.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default IotDevices;