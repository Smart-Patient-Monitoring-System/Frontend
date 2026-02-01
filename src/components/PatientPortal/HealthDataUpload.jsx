import React, { useState } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle, X, Loader } from 'lucide-react';
import WorkoutMetadataModal from './WorkoutMetadataModal';

const HealthDataUpload = ({ onDataUploaded }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [pendingFile, setPendingFile] = useState(null);
    const [showMetadataModal, setShowMetadataModal] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    };

    const handleFileInput = (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
        // Reset input to allow re-uploading the same file
        e.target.value = '';
    };

    const handleFileSelection = (file) => {
        // Check both MIME type and file extension for better compatibility
        const isJsonMime = file.type === 'application/json';
        const isJsonExtension = file.name.toLowerCase().endsWith('.json');

        if (!isJsonMime && !isJsonExtension) {
            setUploadStatus('error');
            setErrorMessage('Please upload a JSON file (.json)');
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            setUploadStatus('error');
            setErrorMessage('File size must be less than 50MB');
            return;
        }

        // Store file and show metadata modal
        setPendingFile(file);
        setShowMetadataModal(true);
    };

    const handleMetadataConfirm = async (metadata) => {
        if (!pendingFile) return;

        setUploading(true);
        setUploadStatus(null);
        setErrorMessage('');
        setShowMetadataModal(false); // Close modal

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);

                    if (onDataUploaded) {
                        await onDataUploaded(jsonData, pendingFile.name, metadata);
                    }
                    setUploadStatus('success');
                    setPendingFile(null);
                } catch (error) {
                    console.error("Upload error:", error);
                    setUploadStatus('error');
                    setErrorMessage(error.message || 'Error processing file');
                    setPendingFile(null);
                } finally {
                    setUploading(false);
                }
            };

            reader.onerror = () => {
                setUploadStatus('error');
                setErrorMessage('Error reading file. Please try again.');
                setUploading(false);
                setPendingFile(null);
            };

            reader.readAsText(pendingFile);
        } catch (error) {
            setUploadStatus('error');
            setErrorMessage(error.message);
            setUploading(false);
            setPendingFile(null);
        }
    };

    const handleMetadataCancel = () => {
        setPendingFile(null);
        setShowMetadataModal(false);
    };

    const resetUpload = () => {
        setUploadStatus(null);
        setErrorMessage('');
        setPendingFile(null);
        setShowMetadataModal(false);
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Health Data</h3>
            <p className="text-gray-600 mb-6">
                Upload your health data from Apple Watch or Android Health in JSON format
            </p>

            {uploadStatus === 'success' ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-green-900 mb-2">Upload Successful!</h4>
                    <p className="text-green-700 mb-4">Your health data has been processed and visualized below.</p>
                    <button
                        onClick={resetUpload}
                        className="px-6 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors"
                    >
                        Upload Another File
                    </button>
                </div>
            ) : uploadStatus === 'error' ? (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-red-900 mb-2">Upload Failed</h4>
                    <p className="text-red-700 mb-4">{errorMessage}</p>
                    <button
                        onClick={resetUpload}
                        className="px-6 py-2 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all ${isDragging
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
                        }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center">
                            <Loader className="w-16 h-16 text-blue-500 mb-4 animate-spin" />
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Processing...</h4>
                            <p className="text-gray-600">Analyzing your health data</p>
                        </div>
                    ) : (
                        <>
                            <FileJson className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                                Drag & Drop your JSON file here
                            </h4>
                            <p className="text-gray-600 mb-4">or</p>
                            <label className="inline-block">
                                <input
                                    type="file"
                                    accept=".json,application/json"
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                                <span className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl">
                                    <Upload className="w-5 h-5" />
                                    Choose File
                                </span>
                            </label>
                            <p className="text-xs text-gray-500 mt-4">
                                Supported formats: Apple HealthKit Export, Google Fit Export (Max 50MB)
                            </p>
                        </>
                    )}
                </div>
            )}

            <WorkoutMetadataModal
                isOpen={showMetadataModal}
                onClose={handleMetadataCancel}
                onConfirm={handleMetadataConfirm}
                fileName={pendingFile?.name || ''}
            />
        </div>
    );
};

export default HealthDataUpload;
