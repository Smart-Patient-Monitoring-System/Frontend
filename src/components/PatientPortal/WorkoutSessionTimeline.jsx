import React, { useState } from 'react';
import { Clock, Edit2, Trash2, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import WorkoutMetadataModal from './WorkoutMetadataModal';

const WorkoutSessionTimeline = ({ sessions, selectedSessionId, onSelect, onEdit, onDelete }) => {
    const [expandedSessions, setExpandedSessions] = useState(new Set());
    const [editingSession, setEditingSession] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const toggleExpand = (sessionId) => {
        const newExpanded = new Set(expandedSessions);
        if (newExpanded.has(sessionId)) {
            newExpanded.delete(sessionId);
        } else {
            newExpanded.add(sessionId);
        }
        setExpandedSessions(newExpanded);
    };

    const handleEditClick = (session) => {
        setEditingSession(session);
        setShowEditModal(true);
    };

    const handleEditConfirm = (metadata) => {
        if (editingSession && onEdit) {
            onEdit(editingSession.id, metadata);
        }
        setShowEditModal(false);
        setEditingSession(null);
    };

    const handleDeleteClick = (session) => {
        if (window.confirm(`Are you sure you want to delete "${session.name}"?`)) {
            onDelete(session.id);
        }
    };

    const handleSessionClick = (sessionId) => {
        if (onSelect) {
            onSelect(sessionId);
        }
    };

    if (!sessions || sessions.length === 0) {
        return null;
    }

    // Sort sessions by date (most recent first)
    const sortedSessions = [...sessions].sort((a, b) =>
        new Date(b.uploadDate) - new Date(a.uploadDate)
    );

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Workout Sessions</h3>
            <p className="text-sm text-gray-500 mb-6">
                {sessions.length} session{sessions.length !== 1 ? 's' : ''} uploaded • Click to view
            </p>

            <div className="space-y-3">
                {sortedSessions.map((session, index) => {
                    const isExpanded = expandedSessions.has(session.id);
                    const isLatest = index === 0;
                    const isSelected = selectedSessionId === session.id || (!selectedSessionId && isLatest);

                    return (
                        <div
                            key={session.id}
                            onClick={() => handleSessionClick(session.id)}
                            className={`border rounded-xl transition-all cursor-pointer ${isSelected
                                ? 'border-blue-400 bg-blue-50 shadow-sm'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-gray-900">{session.name}</h4>
                                            {isSelected && (
                                                <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full font-medium">
                                                    Viewing
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{new Date(session.uploadDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-3.5 h-3.5" />
                                                <span>{session.source}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditClick(session);
                                            }}
                                            className="p-2 hover:bg-white rounded-lg transition-colors"
                                            title="Edit session"
                                        >
                                            <Edit2 className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(session);
                                            }}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete session"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleExpand(session.id);
                                            }}
                                            className="p-2 hover:bg-white rounded-lg transition-colors"
                                        >
                                            {isExpanded ? (
                                                <ChevronUp className="w-4 h-4 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Workouts</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {session.healthData.workouts?.length || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Steps</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {session.healthData.steps?.reduce((sum, s) => sum + s.value, 0).toLocaleString() || 0}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Heart Rate</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {session.healthData.heartRate?.length ?
                                                    `${Math.round(session.healthData.heartRate.reduce((sum, h) => sum + h.value, 0) / session.healthData.heartRate.length)} bpm` :
                                                    'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">SPO2</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                {session.healthData.spo2?.length ?
                                                    `${Math.round(session.healthData.spo2.reduce((sum, s) => sum + s.value, 0) / session.healthData.spo2.length)}%` :
                                                    'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {editingSession && (
                <WorkoutMetadataModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setEditingSession(null);
                    }}
                    onConfirm={handleEditConfirm}
                    fileName={editingSession.name}
                />
            )}
        </div>
    );
};

export default WorkoutSessionTimeline;
