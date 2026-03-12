import { useMemo, useState } from "react";
import { MessageSquare, Paperclip } from "lucide-react";

const DoctorNotesCard = ({ notes = [], onSave }) => {
  const [newNote, setNewNote] = useState("");

  const isDoctor = useMemo(() => {
    const role = localStorage.getItem("userRole");
    return role === "DOCTOR";
  }, []);

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;

    // if parent passed API save function
    if (onSave) {
      await onSave(newNote);
    } else {
      console.log("Saving note:", newNote);
    }

    setNewNote("");
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case "CLINICAL OBSERVATION":
        return "text-blue-600 bg-blue-50";
      case "FOLLOW-UP REQUIRED":
        return "text-orange-600 bg-orange-50";
      case "NOTE":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Doctor's Notes</h3>

        {/* Optional icon: show only doctor */}
        {isDoctor && (
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Notes List */}
      <div className="px-5 py-4 space-y-4 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-500">No notes yet</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getTypeStyles(note.type)}`}>
                  {note.type}
                </span>
                <span className="text-xs text-gray-500">{note.time}</span>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>

              {note.author && <p className="text-xs text-gray-500 italic">— {note.author}</p>}
            </div>
          ))
        )}
      </div>

      {/* Edit area only for doctors */}
      {isDoctor && (
        <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              New Observation
            </label>

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type your notes here..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows={3}
            />

            <div className="flex items-center justify-between">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </button>

              <button
                onClick={handleSaveNote}
                disabled={!newNote.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorNotesCard;
