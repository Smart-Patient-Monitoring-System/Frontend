import React, { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';

const WorkoutMetadataModal = ({ isOpen, onClose, onConfirm, fileName }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Pre-fill with filename (without .json extension)
            const defaultName = fileName.replace('.json', '');
            setName(defaultName);
        }
    }, [isOpen, fileName]);

    const handleConfirm = () => {
        if (!name.trim()) {
            alert('Please enter a workout name');
            return;
        }

        onConfirm({
            name: name.trim()
        });

        // Reset form
        setName('');
    };

    const handleCancel = () => {
        setName('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Workout Details</h3>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Workout Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="e.g., Morning Run, Evening Walk"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Note:</span> Workout date and duration will be automatically extracted from the file.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutMetadataModal;
