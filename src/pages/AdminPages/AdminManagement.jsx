import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../api";

function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/list`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.name?.toLowerCase().includes(search.toLowerCase()) ||
    admin.email?.toLowerCase().includes(search.toLowerCase()) ||
    admin.username?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.username || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = text;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || text;
        } catch (e) {}
        setError(errorMessage);
        setSubmitting(false);
        return;
      }

      resetForm();
      setShowModal(false);
      setError("");
      loadAdmins();
    } catch (e) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.username) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/${editingAdmin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = text;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || text;
        } catch (e) {}
        setError(errorMessage);
        setSubmitting(false);
        return;
      }

      resetForm();
      setShowModal(false);
      setEditingAdmin(null);
      setError("");
      loadAdmins();
    } catch (e) {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/admin/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = text;
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.message || text;
        } catch (e) {}
        alert(errorMessage);
        return;
      }

      loadAdmins();
    } catch (e) {
      alert("Unable to connect to server. Please try again.");
    }
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      username: admin.username,
      password: "", // Don't pre-fill password
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
    });
    setEditingAdmin(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">Admin Accounts</h3>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-4 py-1.5 rounded-full hover:shadow-lg transition"
        >
          Add Admin
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Admins..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
      />

      <div className="space-y-3">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}

        {!loading && filteredAdmins.length === 0 && (
          <p className="text-sm text-gray-500">No admins found</p>
        )}

        {filteredAdmins.map((admin) => (
          <div
            key={admin.id}
            className="flex justify-between items-start bg-gray-50 p-4 rounded-xl"
          >
            <div className="space-y-1">
              <p className="font-medium text-gray-800">{admin.name}</p>
              <p className="text-sm text-gray-500">📧 {admin.email}</p>
              <p className="text-sm text-gray-500">👤 {admin.username}</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleEdit(admin)}
                className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAdmin(admin.id)}
                className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingAdmin ? "Edit Admin" : "Create New Admin"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                    setError("");
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form
              onSubmit={editingAdmin ? handleUpdateAdmin : handleCreateAdmin}
              className="p-6"
            >
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-3 rounded-lg border focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Password {!editingAdmin && <span className="text-red-500">*</span>}
                    {editingAdmin && (
                      <span className="text-gray-500 text-xs">(Leave blank to keep current password)</span>
                    )}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingAdmin}
                    minLength={6}
                    className="w-full h-10 px-3 rounded-lg border focus:border-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                    setError("");
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
                >
                  {submitting
                    ? editingAdmin
                      ? "Updating..."
                      : "Creating..."
                    : editingAdmin
                    ? "Update Admin"
                    : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagement;
