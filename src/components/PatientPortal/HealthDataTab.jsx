import React, { useState, useEffect } from 'react';
import { Footprints, Heart, Droplets, Flame, Moon, Activity, TrendingUp, Weight, Layers } from 'lucide-react';
import HealthDataUpload from './HealthDataUpload';
import ActivityRings from './ActivityRings';
import HealthMetricCard from './HealthMetricCard';
import ChallengesSection from './ChallengesSection';
import { parseAppleHealthData, parseGoogleFitData, parseCustomHealthData, aggregateHealthData } from '../../utils/HealthDataParser';
import * as healthDataApi from '../../services/healthDataApi';
import WorkoutSessionTimeline from './WorkoutSessionTimeline';

// Parse healthData from backend based on source (Apple Health, Google Fit, or Custom)
const parseSessionHealthData = (session) => {
    const raw = session.healthData;
    if (!raw) return null;
    try {
        if (session.source === 'Apple Health' && raw.data) {
            return parseAppleHealthData(raw);
        }
        if (session.source === 'Google Fit' && raw.bucket) {
            return parseGoogleFitData(raw);
        }
        // Custom or fallback: inner data object or full object
        const data = raw.data != null ? raw.data : raw;
        return parseCustomHealthData(data);
    } catch (err) {
        console.warn('Failed to parse health data for session', session.id, err);
        return null;
    }
};

// Empty health data shape so UI doesn't break when parse fails
const emptyHealthData = () => ({
    steps: [], heartRate: [], spo2: [], sleep: [], calories: [], distance: [],
    workouts: [], flights: [], weight: [],
    activityRings: { move: { current: 0, goal: 600 }, exercise: { current: 0, goal: 30 }, stand: { current: 0, goal: 12 } }
});

const HealthDataTab = () => {
    const [workoutSessions, setWorkoutSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [aggregatedData, setAggregatedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // Load sessions from backend on mount and when returning to tab (e.g. after refresh)
    useEffect(() => {
        let cancelled = false;
        const loadSessions = async () => {
            const patientId = localStorage.getItem('patientId');
            const token = localStorage.getItem('token');
            if (!patientId || !token) {
                setLoading(false);
                setLoadError('Please log in to view your health data.');
                setWorkoutSessions([]);
                return;
            }
            setLoadError(null);
            setLoading(true);
            try {
                const sessions = await healthDataApi.getWorkoutSessions(patientId);
                if (cancelled) return;
                const list = Array.isArray(sessions) ? sessions : [];
                const formattedSessions = list.map(session => {
                    const healthData = parseSessionHealthData(session) || emptyHealthData();
                    return {
                        id: String(session.id),
                        name: session.name || 'Untitled',
                        uploadDate: session.uploadDate,
                        healthData,
                        source: session.source || 'Custom Health Data'
                    };
                });
                setWorkoutSessions(formattedSessions);
                if (formattedSessions.length > 0) {
                    setAggregatedData(aggregateHealthData(formattedSessions[0].healthData));
                } else {
                    setAggregatedData(null);
                }
            } catch (error) {
                if (cancelled) return;
                console.error('Error loading workout sessions:', error);
                setLoadError(error?.response?.status === 401
                    ? 'Session expired. Please log in again.'
                    : 'Failed to load health data. Please try again.');
                setWorkoutSessions([]);
                setAggregatedData(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        loadSessions();
        return () => { cancelled = true; };
    }, []);

    // Get the selected session or most recent session for display
    const currentSession = selectedSessionId
        ? workoutSessions.find(s => s.id === selectedSessionId)
        : (workoutSessions.length > 0 ? workoutSessions[0] : null);
    const healthData = currentSession?.healthData || null;
    const dataSource = currentSession?.source || '';

    const handleDataUploaded = async (jsonData, fileName, metadata) => {
        try {
            let parsedData;
            let source = '';
            let workoutDate = new Date(); // Default to today

            if (jsonData.data && jsonData.data.metrics) {
                // Apple Health format with metrics array
                parsedData = parseAppleHealthData(jsonData);
                source = 'Apple Health';
            } else if (jsonData.bucket) {
                // Google Fit format
                parsedData = parseGoogleFitData(jsonData);
                source = 'Google Fit';
            } else if (jsonData.data && typeof jsonData.data === 'object') {
                // Custom format with data object (e.g., workouts, steps, etc.)
                parsedData = parseCustomHealthData(jsonData.data);
                source = 'Custom Health Data';

                // Extract workout date from the JSON
                if (jsonData.data.workouts && jsonData.data.workouts.length > 0) {
                    const firstWorkout = jsonData.data.workouts[0];
                    if (firstWorkout.start) {
                        workoutDate = new Date(firstWorkout.start);
                    } else if (firstWorkout.end) {
                        workoutDate = new Date(firstWorkout.end);
                    } else if (firstWorkout.startDate) {
                        workoutDate = new Date(firstWorkout.startDate);
                    }
                }
            } else {
                // Provide detailed error message about the JSON structure
                const foundKeys = Object.keys(jsonData).join(', ');
                console.error('Unrecognized JSON structure. Found keys:', foundKeys);
                console.log('Full JSON structure:', jsonData);

                // Additional diagnostics for 'data' key
                let additionalInfo = '';
                if (jsonData.data) {
                    const dataType = Array.isArray(jsonData.data) ? 'array' : typeof jsonData.data;
                    additionalInfo = `\n\nYour file has a "data" key, but it's a ${dataType} instead of an object with "metrics".\n`;

                    if (Array.isArray(jsonData.data)) {
                        additionalInfo += `The "data" array has ${jsonData.data.length} items.\n`;
                        if (jsonData.data.length > 0) {
                            const firstItemKeys = Object.keys(jsonData.data[0] || {}).join(', ');
                            additionalInfo += `First item keys: ${firstItemKeys}`;
                        }
                    } else if (typeof jsonData.data === 'object') {
                        const dataKeys = Object.keys(jsonData.data).join(', ');
                        additionalInfo += `Keys inside "data": ${dataKeys}`;
                    }
                }

                throw new Error(
                    `Unrecognized health data format.\n\n` +
                    `Expected format:\n` +
                    `• Apple Health: { "data": { "metrics": [...] } }\n` +
                    `• Google Fit: { "bucket": [...] }\n\n` +
                    `Found keys in your file: ${foundKeys}${additionalInfo}\n\n` +
                    `Please check the browser console (F12) for the full JSON structure.`
                );
            }

            // Save to backend
            try {
                const patientIdFromStorage = localStorage.getItem('patientId');
                if (!patientIdFromStorage) {
                    throw new Error('Patient ID not found. Please login again.');
                }
                const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
                const file = new File([blob], fileName, { type: 'application/json' });

                const response = await healthDataApi.uploadWorkoutSession(patientIdFromStorage, metadata.name, file);
                const backendSession = response.session;

                const newSession = {
                    id: backendSession.id.toString(),
                    name: backendSession.name,
                    uploadDate: backendSession.uploadDate,
                    healthData: parsedData,
                    source: backendSession.source
                };

                setWorkoutSessions(prev => [newSession, ...prev]);
                const aggregated = aggregateHealthData(parsedData);
                setAggregatedData(aggregated);
            } catch (apiError) {
                console.error('Backend error:', apiError);
                // Fallback to local storage
                const newSession = {
                    id: Date.now().toString(),
                    name: metadata.name,
                    uploadDate: workoutDate.toISOString().split('T')[0],
                    healthData: parsedData,
                    source: source
                };
                setWorkoutSessions(prev => [newSession, ...prev]);
                const aggregated = aggregateHealthData(parsedData);
                setAggregatedData(aggregated);
            }
        } catch (error) {
            console.error('Error processing health data:', error);
            alert(error.message || 'Error processing health data. Please check the file format.');
        }
    };

    const handleEditSession = async (sessionId, metadata) => {
        try {
            await healthDataApi.updateWorkoutSession(parseInt(sessionId), metadata.name);
        } catch (error) {
            console.error('Error updating session:', error);
        }
        setWorkoutSessions(prev => prev.map(session =>
            session.id === sessionId
                ? { ...session, name: metadata.name }
                : session
        ));
    };

    const handleDeleteSession = async (sessionId) => {
        try {
            const patientIdFromStorage = localStorage.getItem('patientId');
            if (!patientIdFromStorage) {
                throw new Error('Patient ID not found. Please login again.');
            }
            await healthDataApi.deleteWorkoutSession(parseInt(sessionId), patientIdFromStorage);
        } catch (error) {
            console.error('Error deleting session:', error);
        }
        setWorkoutSessions(prev => {
            const updated = prev.filter(session => session.id !== sessionId);

            // If deleted session was selected, clear selection
            if (selectedSessionId === sessionId) {
                setSelectedSessionId(null);
            }

            // Update aggregated data if there are remaining sessions
            if (updated.length > 0) {
                const nextSession = selectedSessionId && selectedSessionId !== sessionId
                    ? updated.find(s => s.id === selectedSessionId)
                    : updated[0];
                const aggregated = aggregateHealthData(nextSession.healthData);
                setAggregatedData(aggregated);
            } else {
                setAggregatedData(null);
            }
            return updated;
        });
    };

    const handleSelectSession = (sessionId) => {
        setSelectedSessionId(sessionId);
        const session = workoutSessions.find(s => s.id === sessionId);
        if (session) {
            const aggregated = aggregateHealthData(session.healthData);
            setAggregatedData(aggregated);
        }
    };

    const generateChartData = (dataArray, maxPoints = 12) => {
        if (!dataArray || dataArray.length === 0) return [];

        // Sort by date and take the last maxPoints entries
        const sortedData = [...dataArray].sort((a, b) => {
            const dateA = new Date(a.date || a.startDate);
            const dateB = new Date(b.date || b.startDate);
            return dateA - dateB;
        });

        // Take last maxPoints or all if less
        const recentData = sortedData.slice(-maxPoints);

        return recentData.map(item => ({
            label: new Date(item.date || item.startDate).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            value: Math.round(item.value || 0)
        }));
    };

    return (
        <div className="space-y-6">
            {loading && (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-gray-600 font-medium">Loading your health data...</p>
                </div>
            )}

            {loadError && !loading && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                    <p className="text-amber-800 font-medium mb-3">{loadError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!loading && <HealthDataUpload onDataUploaded={handleDataUploaded} />}

            {workoutSessions.length > 0 && (
                <WorkoutSessionTimeline
                    sessions={workoutSessions}
                    selectedSessionId={selectedSessionId}
                    onSelect={handleSelectSession}
                    onEdit={handleEditSession}
                    onDelete={handleDeleteSession}
                />
            )}

            {healthData && aggregatedData && (
                <>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                        <p className="text-blue-900 font-medium">
                            📊 Showing data from latest session: <span className="font-bold">{currentSession.name}</span> ({dataSource})
                        </p>
                    </div>

                    <ActivityRings
                        moveData={healthData.activityRings.move}
                        exerciseData={healthData.activityRings.exercise}
                        standData={healthData.activityRings.stand}
                    />

                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Health Metrics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <HealthMetricCard
                                title="Steps"
                                value={aggregatedData.today.steps.toLocaleString()}
                                unit="steps"
                                icon={Footprints}
                                trend="up"
                                trendValue="+12%"
                                bgGradient="bg-gradient-to-br from-blue-100 to-blue-200"
                                iconBg="bg-blue-500"
                                chartData={generateChartData(healthData.steps)}
                                subtitle={`Weekly avg: ${aggregatedData.week.avgSteps.toLocaleString()}`}
                            />

                            <HealthMetricCard
                                title="Heart Rate"
                                value={aggregatedData.today.avgHeartRate}
                                unit="bpm"
                                icon={Heart}
                                trend="down"
                                trendValue="-2 bpm"
                                bgGradient="bg-gradient-to-br from-red-100 to-pink-200"
                                iconBg="bg-red-500"
                                chartData={generateChartData(healthData.heartRate)}
                                subtitle={`Resting: ${aggregatedData.today.avgHeartRate} bpm`}
                            />

                            <HealthMetricCard
                                title="Blood Oxygen (SPO2)"
                                value={aggregatedData.today.avgSpo2 || 98}
                                unit="%"
                                icon={Droplets}
                                trend="up"
                                trendValue="+1%"
                                bgGradient="bg-gradient-to-br from-teal-100 to-cyan-200"
                                iconBg="bg-teal-500"
                                chartData={generateChartData(healthData.spo2)}
                                subtitle={`Weekly avg: ${aggregatedData.week.avgSpo2 || 98}%`}
                            />

                            <HealthMetricCard
                                title="Active Calories"
                                value={aggregatedData.today.calories.toLocaleString()}
                                unit="cal"
                                icon={Flame}
                                trend="up"
                                trendValue="+8%"
                                bgGradient="bg-gradient-to-br from-orange-100 to-red-200"
                                iconBg="bg-orange-500"
                                chartData={generateChartData(healthData.calories)}
                                subtitle={`Weekly total: ${aggregatedData.week.totalCalories.toLocaleString()} cal`}
                            />

                            <HealthMetricCard
                                title="Distance"
                                value={aggregatedData.today.distance.toFixed(1)}
                                unit="km"
                                icon={TrendingUp}
                                trend="up"
                                trendValue="+5%"
                                bgGradient="bg-gradient-to-br from-purple-100 to-indigo-200"
                                iconBg="bg-purple-500"
                                chartData={generateChartData(healthData.distance)}
                                subtitle={`Weekly total: ${aggregatedData.week.totalDistance.toFixed(1)} km`}
                            />

                            <HealthMetricCard
                                title="Workouts"
                                value={aggregatedData.today.workouts}
                                unit="sessions"
                                icon={Activity}
                                trend="neutral"
                                bgGradient="bg-gradient-to-br from-green-100 to-emerald-200"
                                iconBg="bg-green-500"
                                chartData={healthData.workouts.slice(-7).map((workout, i) => ({
                                    label: `W${i + 1}`,
                                    value: Math.round(workout.duration || 0)
                                }))}
                                subtitle={`Weekly total: ${aggregatedData.week.totalWorkouts} workouts`}
                            />

                            {healthData.sleep.length > 0 && (
                                <HealthMetricCard
                                    title="Sleep"
                                    value={healthData.sleep[healthData.sleep.length - 1]?.duration ?
                                        Math.round(healthData.sleep[healthData.sleep.length - 1].duration / 60) : 0}
                                    unit="hours"
                                    icon={Moon}
                                    trend="neutral"
                                    bgGradient="bg-gradient-to-br from-indigo-100 to-purple-200"
                                    iconBg="bg-indigo-500"
                                    chartData={healthData.sleep.slice(-7).map((sleep, i) => ({
                                        label: `D${i + 1}`,
                                        value: Math.round((sleep.duration || 0) / 60)
                                    }))}
                                    subtitle="Last night's sleep"
                                />
                            )}

                            {healthData.weight.length > 0 && (
                                <HealthMetricCard
                                    title="Weight"
                                    value={healthData.weight[healthData.weight.length - 1]?.value.toFixed(1) || 0}
                                    unit={healthData.weight[0]?.unit || 'kg'}
                                    icon={Weight}
                                    trend="down"
                                    trendValue="-0.5kg"
                                    bgGradient="bg-gradient-to-br from-yellow-100 to-amber-200"
                                    iconBg="bg-yellow-500"
                                    chartData={healthData.weight.slice(-7).map((w, i) => ({
                                        label: `D${i + 1}`,
                                        value: Math.round(w.value * 10) / 10
                                    }))}
                                    subtitle="Latest measurement"
                                />
                            )}

                            {healthData.flights.length > 0 && (
                                <HealthMetricCard
                                    title="Flights Climbed"
                                    value={healthData.flights.filter(f => {
                                        const today = new Date().toDateString();
                                        return new Date(f.date).toDateString() === today;
                                    }).reduce((sum, f) => sum + f.value, 0)}
                                    unit="floors"
                                    icon={Layers}
                                    trend="up"
                                    trendValue="+3"
                                    bgGradient="bg-gradient-to-br from-gray-100 to-slate-200"
                                    iconBg="bg-gray-500"
                                    chartData={generateChartData(healthData.flights)}
                                    subtitle="Today's climbs"
                                />
                            )}
                        </div>
                    </div>

                    <ChallengesSection />
                </>
            )}

            {!healthData && !loadError && !loading && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 text-center border-2 border-dashed border-blue-200">
                    <div className="max-w-md mx-auto">
                        <Activity className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            No Health Data Yet
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Upload your health data from Apple Watch or Android Health to see your activity rings,
                            health metrics, and personalized challenges.
                        </p>
                        <div className="bg-white rounded-2xl p-4 text-left space-y-2">
                            <h4 className="font-semibold text-gray-900 mb-2">How to export:</h4>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p><strong>Apple Health:</strong> Health app → Profile → Export All Health Data</p>
                                <p><strong>Google Fit:</strong> Google Takeout → Select Fit → Export JSON</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthDataTab;
