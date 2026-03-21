import React, { useMemo } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Brain, TrendingUp, TrendingDown } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Helper: parse the systolic value out of "120/80" or just "120"
───────────────────────────────────────────────────────────── */
const parseSystolic = (bp) => {
  if (!bp) return null;
  const s = String(bp).split('/')[0];
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
};

/* ─────────────────────────────────────────────────────────────
   computeRisks(vitals)
   Returns array of { title, riskPct (0–100), status, ... }
───────────────────────────────────────────────────────────── */
const computeRisks = (vitals) => {
  if (!vitals) return null;

  const hr      = parseFloat(vitals.heartRate);
  const systolic = parseSystolic(vitals.bp);
  const spo2    = parseFloat(vitals.spo2);
  const temp    = parseFloat(vitals.temp);
  const sugar   = parseFloat(vitals.sugarLevel);

  const risks = [];

  // ── Cardiac Event (based on HR + BP) ──────────────────────
  if (!isNaN(hr) || systolic !== null) {
    let riskPct = 5;
    if (!isNaN(hr)) {
      if (hr < 50 || hr > 120) riskPct += 35;
      else if (hr < 60 || hr > 100) riskPct += 15;
    }
    if (systolic !== null) {
      if (systolic > 160) riskPct += 35;
      else if (systolic > 140) riskPct += 20;
      else if (systolic > 130) riskPct += 10;
    }
    riskPct = Math.min(riskPct, 99);
    risks.push({
      id: 'cardiac',
      title: 'Cardiac Event',
      riskPct,
      status: riskPct >= 40 ? 'High Risk' : riskPct >= 20 ? 'Monitor' : 'Normal',
    });
  }

  // ── Arrhythmia (HR-based) ──────────────────────────────────
  if (!isNaN(hr)) {
    let riskPct = 5;
    if (hr < 50 || hr > 120) riskPct = 55;
    else if (hr < 60 || hr > 100) riskPct = 25;
    riskPct = Math.min(riskPct, 99);
    risks.push({
      id: 'arrhythmia',
      title: 'Arrhythmia',
      riskPct,
      status: riskPct >= 40 ? 'High Risk' : riskPct >= 20 ? 'Monitor' : 'Normal',
    });
  }

  // ── Hypertension (BP-based) ────────────────────────────────
  if (systolic !== null) {
    let riskPct = 5;
    if (systolic > 160) riskPct = 75;
    else if (systolic > 140) riskPct = 50;
    else if (systolic > 130) riskPct = 30;
    riskPct = Math.min(riskPct, 99);
    risks.push({
      id: 'hypertension',
      title: 'Hypertension',
      riskPct,
      status: riskPct >= 40 ? 'High Risk' : riskPct >= 20 ? 'Monitor' : 'Normal',
    });
  }

  // ── Hypoxia (SpO2-based) ───────────────────────────────────
  if (!isNaN(spo2)) {
    let riskPct = 3;
    if (spo2 < 90) riskPct = 70;
    else if (spo2 < 95) riskPct = 35;
    riskPct = Math.min(riskPct, 99);
    risks.push({
      id: 'hypoxia',
      title: 'Hypoxia (Low SpO₂)',
      riskPct,
      status: riskPct >= 40 ? 'High Risk' : riskPct >= 20 ? 'Monitor' : 'Normal',
    });
  }

  // ── Fever (temp-based) ────────────────────────────────────
  if (!isNaN(temp)) {
    let riskPct = 5;
    if (temp >= 39.5) riskPct = 60;
    else if (temp >= 38.5) riskPct = 35;
    else if (temp >= 37.5) riskPct = 18;
    riskPct = Math.min(riskPct, 99);
    risks.push({
      id: 'fever',
      title: 'Fever / Infection',
      riskPct,
      status: riskPct >= 40 ? 'High Risk' : riskPct >= 20 ? 'Monitor' : 'Normal',
    });
  }

  // ── Diabetes Risk (sugar-based) ────────────────────────────
  if (!isNaN(sugar)) {
    let riskPct = 5;
    if (sugar > 250 || sugar < 55) riskPct = 70;
    else if (sugar > 200 || sugar < 70) riskPct = 45;
    else if (sugar > 140) riskPct = 20;
    riskPct = Math.min(riskPct, 99);
    risks.push({
      id: 'diabetes',
      title: 'Diabetes Risk',
      riskPct,
      status: riskPct >= 40 ? 'High Risk' : riskPct >= 20 ? 'Monitor' : 'Normal',
    });
  }

  return risks;
};

/* ─────────────────────────────────────────────────────────────
   computeHealthScore(risks) → 0-100
───────────────────────────────────────────────────────────── */
const computeHealthScore = (risks) => {
  if (!risks || risks.length === 0) return null;
  const avg = risks.reduce((sum, r) => sum + r.riskPct, 0) / risks.length;
  return Math.round(100 - avg);
};

/* ─────────────────────────────────────────────────────────────
   Styling helpers
───────────────────────────────────────────────────────────── */
const statusStyle = (status) => {
  switch (status) {
    case 'High Risk':
      return {
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        iconColor: 'text-red-600',
        barColor: 'bg-red-500',
        Icon: XCircle,
      };
    case 'Monitor':
      return {
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        iconColor: 'text-orange-600',
        barColor: 'bg-orange-500',
        Icon: AlertTriangle,
      };
    default:
      return {
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        iconColor: 'text-green-600',
        barColor: 'bg-green-500',
        Icon: CheckCircle,
      };
  }
};

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
const HealthRiskCard = ({ medicalSummary }) => {
  const vitals = medicalSummary?.latestVitals ?? null;

  const risks = useMemo(() => computeRisks(vitals), [vitals]);
  const healthScore = useMemo(() => computeHealthScore(risks), [risks]);

  const scoreColor =
    healthScore === null ? 'text-gray-400'
    : healthScore >= 80 ? 'text-green-600'
    : healthScore >= 60 ? 'text-orange-500'
    : 'text-red-600';

  const scoreBarColor =
    healthScore === null ? 'bg-gray-300'
    : healthScore >= 80 ? 'bg-green-500'
    : healthScore >= 60 ? 'bg-orange-500'
    : 'bg-red-500';

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-full max-w-full">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
            AI Health Predictions <span className="text-purple-600">✨</span>
          </h2>
          <p className="text-sm text-gray-500">
            {vitals ? `Based on vitals recorded at ${new Date(vitals.recordedAt).toLocaleString()}` : 'ML-powered risk analysis'}
          </p>
        </div>
      </div>

      {/* No data state */}
      {!risks || risks.length === 0 ? (
        <div className="py-10 text-center text-gray-400">
          <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No vitals data available</p>
          <p className="text-sm mt-1">Add a <strong>VITALS</strong> medical event in Medical Records to see AI predictions.</p>
        </div>
      ) : (
        <>
          {/* Prediction Cards */}
          <div className="space-y-3 mb-6">
            {risks.map((r) => {
              const { bgColor, textColor, iconColor, barColor, Icon } = statusStyle(r.status);
              return (
                <div key={r.id} className={`${bgColor} rounded-xl p-4 transition-all hover:shadow-md`}>
                  <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
                      <h3 className="font-semibold text-gray-900 truncate">{r.title}</h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl font-bold text-gray-900">{r.riskPct}%</div>
                      <div className="text-xs text-gray-500">Risk</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className={`text-sm ${textColor}`}>Status: {r.status}</span>
                    <div className="flex-1 min-w-[80px] h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} transition-all duration-700`}
                        style={{ width: `${r.riskPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Health Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <p className="text-lg font-semibold text-gray-900">Overall Health Score</p>
              <div className={`flex items-center gap-1 font-semibold flex-shrink-0 ${scoreColor}`}>
                {healthScore >= 80 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {healthScore}/100
              </div>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${scoreBarColor} transition-all duration-700`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {healthScore >= 80 ? 'Your vitals look great! Keep it up.' : healthScore >= 60 ? 'Some metrics need attention.' : 'Please consult your doctor.'}
            </p>
          </div>
        </>
      )}

      {/* AI Analysis Info */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 flex-wrap">
        <Brain className="w-6 h-6 text-blue-600 flex-shrink-0" />
        <p className="text-sm text-blue-700 leading-snug flex-1 min-w-0">
          AI analysis based on your latest vitals. Add regular VITALS events in Medical Records for more accurate predictions.
        </p>
      </div>

    </div>
  );
};

export default HealthRiskCard;
