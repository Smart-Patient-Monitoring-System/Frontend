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

const HealthDataTab = ({ patientId: propPatientId, isDoctorView = false }) => {
    const [workoutSessions, setWorkoutSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [aggregatedData, setAggregatedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    // 'normal' | 'exercise' | 'heart-patient'
    const [hrMode, setHrMode] = useState('normal');

    // Load sessions from backend on mount and when returning to tab (e.g. after refresh)
    useEffect(() => {
        let cancelled = false;
        const loadSessions = async () => {
            const patientIdToFetch = propPatientId || localStorage.getItem('patientId');
            const token = localStorage.getItem('token');
            if (!patientIdToFetch || !token) {
                setLoading(false);
                setLoadError('Please log in to view your health data.');
                setWorkoutSessions([]);
                return;
            }
            setLoadError(null);
            setLoading(true);
            try {
                const sessions = await healthDataApi.getWorkoutSessions(patientIdToFetch);
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
    }, [propPatientId]); // Added propPatientId to dependencies

    // Get the selected session or most recent session for display
    const currentSession = selectedSessionId
        ? workoutSessions.find(s => s.id === selectedSessionId)
        : (workoutSessions.length > 0 ? workoutSessions[0] : null);
    const healthData = currentSession?.healthData || null;
    const dataSource = currentSession?.source || '';

    // Previous session for trend comparison
    const currentSessionIndex = currentSession
        ? workoutSessions.findIndex(s => s.id === currentSession.id)
        : -1;
    const prevSession = currentSessionIndex >= 0 && currentSessionIndex < workoutSessions.length - 1
        ? workoutSessions[currentSessionIndex + 1]
        : null;
    const prevAggregatedData = prevSession ? aggregateHealthData(prevSession.healthData) : null;

    // Helper: compute % trend between current and previous value
    const calcTrend = (current, previous) => {
        if (!prevAggregatedData || !previous || previous === 0) {
            return { trend: 'neutral', trendValue: 'No prev data' };
        }
        const pct = Math.round(((current - previous) / previous) * 100);
        if (pct === 0) return { trend: 'neutral', trendValue: 'No change' };
        return {
            trend: pct > 0 ? 'up' : 'down',
            trendValue: `${pct > 0 ? '+' : ''}${pct}%`,
        };
    };

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
        } catch (error) {
            console.error('Error processing health data:', error);
            const msg = error.response?.data?.message || error.response?.data?.error || error.message || 'Error processing health data. Please check the file format.';
            // We re-throw so the child component can show the error state
            throw new Error(msg);
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

            {!loading && !isDoctorView && <HealthDataUpload onDataUploaded={handleDataUploaded} />}

            {workoutSessions.length > 0 && (
                <WorkoutSessionTimeline
                    sessions={workoutSessions}
                    selectedSessionId={selectedSessionId}
                    onSelect={handleSelectSession}
                    onEdit={isDoctorView ? undefined : handleEditSession}
                    onDelete={isDoctorView ? undefined : handleDeleteSession}
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

                        {/* ─── Heart Rate Mode Selector ─── */}
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className="text-sm font-semibold text-gray-600">Mode:</span>
                            {[
                                { id: 'normal',        label: '🧍 Normal',        tip: 'Resting / daily activity' },
                                { id: 'exercise',      label: '🏃 Exercising',    tip: 'During a workout session' },
                                { id: 'heart-patient', label: '❤️‍🩹 Heart Patient', tip: 'Cardiac condition / post-surgery' },
                            ].map(m => (
                                <button
                                    key={m.id}
                                    title={m.tip}
                                    onClick={() => setHrMode(m.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                        hrMode === m.id
                                            ? 'bg-blue-600 text-white border-blue-600 shadow'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                                    }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* ─── Critical Heart Rate Warning ─── */}
                        {(() => {
                            const avgHR = aggregatedData.today.avgHeartRate;
                            if (!avgHR) return null;

                            // Thresholds per mode
                            const thresholds = {
                                'normal':        { warn: 100, critical: 120 },
                                'exercise':      { warn: 150, critical: 170 },
                                'heart-patient': { warn: 110, critical: 120 },
                            };
                            const { warn, critical } = thresholds[hrMode];

                            if (avgHR <= warn) return null;

                            const isCritical = avgHR > critical;

                            const messages = {
                                normal: {
                                    warn:     'Your resting heart rate is elevated. Rest and avoid exertion. Consult your doctor if this persists.',
                                    critical: 'Critical resting heart rate! Stop any activity and seek medical attention immediately.',
                                },
                                exercise: {
                                    warn:     `Heart rate is high for exercise (${avgHR} bpm). Slow down and catch your breath — you're approaching your limit.`,
                                    critical: `Heart rate is dangerously high during exercise (${avgHR} bpm). Stop immediately, rest, and seek help if discomfort occurs.`,
                                },
                                'heart-patient': {
                                    warn:     `Heart rate exceeds your safe limit (${avgHR} bpm). Stop activity, rest, and take prescribed medication if needed.`,
                                    critical: `Critical! Heart rate is ${avgHR} bpm — far above the safe range for cardiac patients. Seek immediate medical attention.`,
                                },
                            };

                            const msg = isCritical ? messages[hrMode].critical : messages[hrMode].warn;

                            return (
                                <div className={`flex items-start gap-4 mb-6 p-4 rounded-2xl border-2 shadow-md
                                    ${isCritical ? 'bg-red-50 border-red-400' : 'bg-orange-50 border-orange-400'}`}>
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl
                                        ${isCritical ? 'bg-red-100' : 'bg-orange-100'}`}>
                                        {isCritical ? '🚨' : '⚠️'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-lg font-bold ${isCritical ? 'text-red-700' : 'text-orange-700'}`}>
                                            {isCritical ? 'Critical Heart Rate Detected!' : 'Elevated Heart Rate'}
                                        </p>
                                        <p className={`text-sm mt-1 ${isCritical ? 'text-red-600' : 'text-orange-600'}`}>
                                            Avg HR: <strong>{avgHR} bpm</strong> — {msg}
                                        </p>
                                        <p className="text-xs mt-2 text-gray-500">
                                            Safe range ({hrMode === 'normal' ? 'resting' : hrMode === 'exercise' ? 'exercise' : 'cardiac'}):
                                            {' '}<strong>60–{warn} bpm</strong>
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <HealthMetricCard
                                title="Steps"
                                value={aggregatedData.today.steps.toLocaleString()}
                                unit="steps"
                                icon={Footprints}
                                {...calcTrend(aggregatedData.today.steps, prevAggregatedData?.today.steps)}
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
                                {...calcTrend(aggregatedData.today.avgHeartRate, prevAggregatedData?.today.avgHeartRate)}
                                bgGradient="bg-gradient-to-br from-red-100 to-pink-200"
                                iconBg="bg-red-500"
                                chartData={generateChartData(healthData.heartRate)}
                                subtitle={`Avg across session: ${aggregatedData.today.avgHeartRate} bpm`}
                            />

                            <HealthMetricCard
                                title="Blood Oxygen (SPO2)"
                                value={aggregatedData.today.avgSpo2 || 98}
                                unit="%"
                                icon={Droplets}
                                {...calcTrend(aggregatedData.today.avgSpo2, prevAggregatedData?.today.avgSpo2)}
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
                                {...calcTrend(aggregatedData.today.calories, prevAggregatedData?.today.calories)}
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
                                {...calcTrend(aggregatedData.today.distance, prevAggregatedData?.today.distance)}
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
                                {...calcTrend(aggregatedData.today.workouts, prevAggregatedData?.today.workouts)}
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
                            {isDoctorView
                                ? "This patient has not uploaded any Apple Watch or Android Health activity data yet."
                                : "Upload your health data from Apple Watch or Android Health to see your activity rings, health metrics, and personalized challenges."
                            }
                        </p>

                        {!isDoctorView && (
                            <div className="bg-white rounded-2xl p-4 text-left space-y-2">
                                <h4 className="font-semibold text-gray-900 mb-2">How to export:</h4>
                                <div className="text-sm text-gray-700 space-y-1">
                                    <p><strong>Apple Health:</strong> Health app → Profile → Export All Health Data</p>
                                    <p><strong>Google Fit:</strong> Google Takeout → Select Fit → Export JSON</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthDataTab;
