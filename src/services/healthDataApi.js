import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/health-data`;


// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to get patient ID from localStorage
export const getPatientId = () => {
    const patientId = localStorage.getItem('patientId');
    if (!patientId) {
        throw new Error('Patient ID not found. Please login again.');
    }
    return patientId;
};

// Upload a workout session
export const uploadWorkoutSession = async (patientId, name, file) => {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('name', name);
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/workout-sessions`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders()
        }
    });
    return response.data;
};

// Get all workout sessions for a patient
export const getWorkoutSessions = async (patientId) => {
    const response = await axios.get(`${API_BASE_URL}/workout-sessions/${patientId}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Update workout session name
export const updateWorkoutSession = async (sessionId, name) => {
    const response = await axios.put(`${API_BASE_URL}/workout-sessions/${sessionId}`, { name }, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Delete workout session
export const deleteWorkoutSession = async (sessionId, patientId) => {
    const response = await axios.delete(`${API_BASE_URL}/workout-sessions/${sessionId}`, {
        params: { patientId },
        headers: getAuthHeaders()
    });
    return response.data;
};
