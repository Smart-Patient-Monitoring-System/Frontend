import { useState } from "react";
import { MessageSquare, Paperclip, Send } from "lucide-react";

const DoctorNotesCard = () => {
  const [newNote, setNewNote] = useState("");

  const notes = [
    {
      id: 1,
      type: "CLINICAL OBSERVATION",
      time: "2 hrs ago",
      content: "Patient exhibits stable vitals post-morning medication. Reported slight dizziness around 09:00, but cleared within 15 minutes.",
      author: "Dr. Miller",
    },
    {
      id: 2,
      type: "FOLLOW-UP REQUIRED",
      time: "Yesterday",
      content: "Monitor SpO2 levels during sleep cycles. Adjust oxygen flow if levels dip below 94% consistently.",
      author: "Dr. Sarah Chen (On-call)",
    },
    {
      id: 3,
      type: "NOTE",
      time: "Oct 24",
      content: "Initial intake assessment completed. No known allergies to Penicillin.",
      author: "",
    },
  ];

  const handleSaveNote = () => {
    if (newNote.trim()) {
      console.log("Saving note:", newNote);
      setNewNote("");
    }
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
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MessageSquare className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Notes List */}
      <div className="px-5 py-4 space-y-4 max-h-96 overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${getTypeStyles(
                  note.type
                )}`}
              >
                {note.type}
              </span>
              <span className="text-xs text-gray-500">{note.time}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {note.content}
            </p>
            {note.author && (
              <p className="text-xs text-gray-500 italic">— {note.author}</p>
            )}
          </div>
        ))}
      </div>

      {/* New Observation Input */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 uppercase tracking-wide">
              New Observation
            </label>
          </div>
          
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
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorNotesCard;