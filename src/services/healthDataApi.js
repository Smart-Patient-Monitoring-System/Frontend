import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/health-data';

// Upload a workout session
export const uploadWorkoutSession = async (patientId, name, file) => {
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('name', name);
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/workout-sessions`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Get all workout sessions for a patient
export const getWorkoutSessions = async (patientId) => {
    const response = await axios.get(`${API_BASE_URL}/workout-sessions/${patientId}`);
    return response.data;
};

// Update workout session name
export const updateWorkoutSession = async (sessionId, name) => {
    const response = await axios.put(`${API_BASE_URL}/workout-sessions/${sessionId}`, { name });
    return response.data;
};

// Delete workout session
export const deleteWorkoutSession = async (sessionId, patientId) => {
    const response = await axios.delete(`${API_BASE_URL}/workout-sessions/${sessionId}`, {
        params: { patientId }
    });
    return response.data;
};
