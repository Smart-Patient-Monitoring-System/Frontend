import React, { useMemo } from "react";
import { Heart, Droplets, Zap, Lightbulb, Info, Thermometer, Activity } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   Helper: parse systolic from "120/80" or "120"
───────────────────────────────────────────────────────────── */
const parseSystolic = (bp) => {
  if (!bp) return null;
  const n = parseFloat(String(bp).split('/')[0]);
  return isNaN(n) ? null : n;
};

/* ─────────────────────────────────────────────────────────────
   generateTips(vitals) → array of tip objects
───────────────────────────────────────────────────────────── */
const generateTips = (vitals) => {
  if (!vitals) {
    return [
      { id: 'default-hr', title: 'Heart Rate', description: 'Add a VITALS event to see personalized heart rate tips.', icon: Heart, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
      { id: 'default-hydration', title: 'Hydration', description: 'Stay hydrated. Aim for 8 glasses of water daily.', icon: Droplets, iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
      { id: 'default-activity', title: 'Activity', description: 'Light exercise recommended. A 20–30 minute daily walk is ideal.', icon: Zap, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    ];
  }

  const tips = [];
  const hr       = parseFloat(vitals.heartRate);
  const systolic = parseSystolic(vitals.bp);
  const spo2     = parseFloat(vitals.spo2);
  const temp     = parseFloat(vitals.temp);
  const sugar    = parseFloat(vitals.sugarLevel);

  // Heart Rate tip
  if (!isNaN(hr)) {
    if (hr > 100) {
      tips.push({ id: 'hr', title: 'Heart Rate', description: `Your heart rate is elevated (${hr} bpm). Rest, avoid caffeine and stress. If persistent, consult your doctor.`, icon: Heart, iconBg: 'bg-red-100', iconColor: 'text-red-600' });
    } else if (hr < 60) {
      tips.push({ id: 'hr', title: 'Heart Rate', description: `Your heart rate is low (${hr} bpm). Monitor closely and consult your doctor if you feel dizzy or fatigued.`, icon: Heart, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' });
    } else {
      tips.push({ id: 'hr', title: 'Heart Rate', description: `Your heart rate is in the normal range (${hr} bpm). Great job — keep up your routine!`, icon: Heart, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' });
    }
  }

  // Blood Pressure tip
  if (systolic !== null) {
    if (systolic > 140) {
      tips.push({ id: 'bp', title: 'Blood Pressure', description: `Your BP is high (${vitals.bp} mmHg). Reduce salt intake, avoid stress, and follow up with your doctor.`, icon: Activity, iconBg: 'bg-red-100', iconColor: 'text-red-600' });
    } else if (systolic > 130) {
      tips.push({ id: 'bp', title: 'Blood Pressure', description: `Your BP is slightly elevated (${vitals.bp}). Monitor it daily and reduce sodium intake.`, icon: Activity, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' });
    } else {
      tips.push({ id: 'bp', title: 'Blood Pressure', description: `Your blood pressure looks good (${vitals.bp} mmHg). Keep monitoring regularly.`, icon: Activity, iconBg: 'bg-green-100', iconColor: 'text-green-600' });
    }
  }

  // SpO2 tip
  if (!isNaN(spo2)) {
    if (spo2 < 90) {
      tips.push({ id: 'spo2', title: 'Oxygen Level', description: `SpO₂ is critically low (${spo2}%). Seek immediate medical attention.`, icon: Droplets, iconBg: 'bg-red-100', iconColor: 'text-red-600' });
    } else if (spo2 < 95) {
      tips.push({ id: 'spo2', title: 'Oxygen Level', description: `SpO₂ is slightly low (${spo2}%). Practice slow deep breathing exercises and avoid strenuous activity.`, icon: Droplets, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' });
    } else {
      tips.push({ id: 'spo2', title: 'Oxygen Level', description: `Your oxygen saturation is excellent (${spo2}%). Keep breathing easy!`, icon: Droplets, iconBg: 'bg-teal-100', iconColor: 'text-teal-600' });
    }
  }

  // Temperature tip
  if (!isNaN(temp)) {
    if (temp >= 38.5) {
      tips.push({ id: 'temp', title: 'Temperature', description: `You have a fever (${temp}°C). Rest, stay hydrated, and take prescribed medication. See a doctor if it persists.`, icon: Thermometer, iconBg: 'bg-red-100', iconColor: 'text-red-600' });
    } else if (temp >= 37.5) {
      tips.push({ id: 'temp', title: 'Temperature', description: `Slightly elevated temperature (${temp}°C). Stay hydrated and rest. Monitor for further increases.`, icon: Thermometer, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' });
    } else {
      tips.push({ id: 'temp', title: 'Temperature', description: `Your temperature is normal (${temp}°C). Keep staying comfortable and well-rested.`, icon: Thermometer, iconBg: 'bg-green-100', iconColor: 'text-green-600' });
    }
  }

  // Sugar tip
  if (!isNaN(sugar)) {
    if (sugar > 200 || sugar < 70) {
      tips.push({ id: 'sugar', title: 'Blood Sugar', description: `Blood sugar out of range (${sugar} mg/dL). Eat appropriately and consult your doctor immediately.`, icon: Zap, iconBg: 'bg-red-100', iconColor: 'text-red-600' });
    } else if (sugar > 140) {
      tips.push({ id: 'sugar', title: 'Blood Sugar', description: `Blood sugar slightly elevated (${sugar} mg/dL). Avoid sugary foods, follow your diet plan, and take your medication as prescribed.`, icon: Zap, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' });
    } else {
      tips.push({ id: 'sugar', title: 'Blood Sugar', description: `Blood sugar is in a healthy range (${sugar} mg/dL). Excellent — maintain your dietary habits!`, icon: Zap, iconBg: 'bg-green-100', iconColor: 'text-green-600' });
    }
  }

  // Add a general hydration tip if we have less than 2 tips
  if (tips.length < 2) {
    tips.push({ id: 'hydration', title: 'Hydration', description: 'Stay hydrated. Aim for at least 8 glasses of water daily.', icon: Droplets, iconBg: 'bg-teal-100', iconColor: 'text-teal-600' });
  }

  return tips;
};

/* ─────────────────────────────────────────────────────────────
   computeHealthScore — same formula as HealthRiskCard
───────────────────────────────────────────────────────────── */
const computeHealthScore = (vitals) => {
  if (!vitals) return null;
  const hr       = parseFloat(vitals.heartRate);
  const systolic = parseSystolic(vitals.bp);
  const spo2     = parseFloat(vitals.spo2);
  const temp     = parseFloat(vitals.temp);
  const sugar    = parseFloat(vitals.sugarLevel);

  const scores = [];
  if (!isNaN(hr))       scores.push(hr >= 60 && hr <= 100 ? 100 : hr >= 50 && hr <= 120 ? 65 : 30);
  if (systolic !== null) scores.push(systolic <= 130 ? 100 : systolic <= 140 ? 70 : systolic <= 160 ? 45 : 20);
  if (!isNaN(spo2))     scores.push(spo2 >= 95 ? 100 : spo2 >= 90 ? 60 : 20);
  if (!isNaN(temp))     scores.push(temp < 37.5 ? 100 : temp < 38.5 ? 70 : 30);
  if (!isNaN(sugar))    scores.push(sugar >= 70 && sugar <= 140 ? 100 : sugar <= 200 && sugar >= 55 ? 65 : 25);

  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

/* ─────────────────────────────────────────────────────────────
   Medication reminder string
───────────────────────────────────────────────────────────── */
const buildReminder = (medications) => {
  if (!medications || medications.length === 0) return null;
  const med = medications[0]; // most recent
  const name = med.name || 'your medication';
  const dose = med.dose ? ` ${med.dose}` : '';
  const time = med.timeOfDay ? ` at ${med.timeOfDay}` : '';
  const freq = med.frequency ? ` (${med.frequency})` : '';
  return `Remember to take ${name}${dose}${time}${freq}.`;
};

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
const HealthTipsCard = ({ medicalSummary }) => {
  const vitals      = medicalSummary?.latestVitals ?? null;
  const medications = medicalSummary?.medications ?? [];

  const tips         = useMemo(() => generateTips(vitals), [vitals]);
  const healthScore  = useMemo(() => computeHealthScore(vitals), [vitals]);
  const reminder     = useMemo(() => buildReminder(medications), [medications]);

  const scoreLabel =
    healthScore === null ? { text: 'No Data', bg: 'bg-gray-200', color: 'text-gray-600' }
    : healthScore >= 80  ? { text: 'Excellent', bg: 'bg-green-200', color: 'text-green-800' }
    : healthScore >= 60  ? { text: 'Fair', bg: 'bg-orange-200', color: 'text-orange-800' }
    : { text: 'Poor', bg: 'bg-red-200', color: 'text-red-800' };

  const scoreBarColor =
    healthScore === null ? 'bg-gray-300'
    : healthScore >= 80 ? 'bg-green-500'
    : healthScore >= 60 ? 'bg-orange-500'
    : 'bg-red-500';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-full">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-800 truncate">Health Tips</h2>
          <p className="text-gray-500 text-sm truncate">
            {vitals ? 'Personalised from your latest vitals' : 'General recommendations'}
          </p>
        </div>
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex-wrap"
            >
              <div className={`${tip.iconBg} rounded-full p-3 flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${tip.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-gray-200" />

      {/* Reminders Section */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <h3 className="text-md font-semibold text-gray-800 truncate">Reminders</h3>
        </div>

        {reminder ? (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-xl border border-blue-100 text-sm">
            {reminder}
          </div>
        ) : (
          <div className="bg-gray-50 text-gray-500 p-4 rounded-xl border border-gray-200 text-sm">
            No medication reminders — add a <strong>MEDICATION</strong> event in Medical Records.
          </div>
        )}
      </div>

      {/* Daily Health Score */}
      <div className="bg-green-50 rounded-xl p-5 border border-green-100">
        <h3 className="text-md font-semibold text-gray-800 mb-3 truncate">Daily Health Score</h3>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className="text-lg font-bold text-gray-900 flex-shrink-0">
            {healthScore !== null ? healthScore : '--'}
            <span className="text-gray-500 text-sm"> /100</span>
          </p>
          <span className={`px-3 py-1 ${scoreLabel.bg} ${scoreLabel.color} rounded-full text-sm font-medium flex-shrink-0`}>
            {scoreLabel.text}
          </span>
        </div>

        <div className="w-full mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${scoreBarColor} rounded-full transition-all duration-700`}
            style={{ width: healthScore !== null ? `${healthScore}%` : '0%' }}
          />
        </div>

        {healthScore === null && (
          <p className="text-xs text-gray-400 mt-2">Add vitals in Medical Records to calculate your score.</p>
        )}
      </div>
    </div>
  );
};

export default HealthTipsCard;
