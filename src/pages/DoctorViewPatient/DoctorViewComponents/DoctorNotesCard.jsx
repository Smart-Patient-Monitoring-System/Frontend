import { useMemo, useState, useEffect } from "react";
import { MessageSquare, Clock, User, Loader2, Plus } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8084";

const DoctorNotesCard = ({ patientId }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isDoctor = useMemo(() => {
    const role = localStorage.getItem("userRole");
    return role === "DOCTOR";
  }, []);

  // ── Load notes from backend ──────────────────────────────
  useEffect(() => {
    if (!patientId) { setLoading(false); return; }
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/doctor-notes/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotes(res.data);
      } catch (err) {
        console.error("Failed to load notes:", err);
        setError("Failed to load notes.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [patientId]);

  // ── Save a new note ──────────────────────────────────────
  const handleSaveNote = async () => {
    if (!newNote.trim() || !patientId) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/api/doctor-notes/patient/${patientId}`,
        { content: newNote.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(prev => [res.data, ...prev]);
      setNewNote("");
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Doctor's Notes</h3>
            <p className="text-xs text-gray-400">{notes.length} note{notes.length !== 1 ? "s" : ""} recorded</p>
          </div>
        </div>

        {isDoctor && (
          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
            Dr. View
          </span>
        )}
      </div>

      {/* Notes List */}
      <div className="px-5 py-4 space-y-4 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm text-center">{error}</p>
        ) : notes.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No notes recorded yet</p>
            {isDoctor && (
              <p className="text-xs text-gray-400 mt-1">Add your first observation below.</p>
            )}
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="group relative bg-gradient-to-br from-blue-50/60 to-indigo-50/30 rounded-xl p-4 border border-blue-100/60">
              <p className="text-sm text-gray-800 leading-relaxed font-medium mb-3">
                {note.content}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1.5 font-semibold text-blue-600">
                  <User className="w-3.5 h-3.5" />
                  {note.author}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {note.createdAt}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write area only visible to doctors */}
      {isDoctor && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Add Observation
            </label>

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type your clinical notes here..."
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm shadow-sm transition-all hover:border-blue-300"
              rows={3}
            />

            <div className="flex items-center justify-end">
              <button
                onClick={handleSaveNote}
                disabled={!newNote.trim() || saving}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MessageSquare className="w-4 h-4" />
                )}
                {saving ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorNotesCard;
