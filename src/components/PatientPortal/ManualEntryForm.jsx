import { useState } from "react";
import { X, Heart, Thermometer, Activity, Droplet, Scale, Calendar } from "lucide-react";

const ManualEntryForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    bloodSugar: "",
    temperature: "",
    heartRate: "",
    weight: "",
    spo2: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    const hasAnyVital =
      formData.bloodPressureSystolic ||
      formData.bloodSugar ||
      formData.temperature ||
      formData.heartRate ||
      formData.weight ||
      formData.spo2;

    if (!hasAnyVital) newErrors.general = "Please enter at least one vital sign measurement";

    if (formData.bloodPressureSystolic && !formData.bloodPressureDiastolic)
      newErrors.bloodPressureDiastolic = "Please enter diastolic value";
    if (formData.bloodPressureDiastolic && !formData.bloodPressureSystolic)
      newErrors.bloodPressureSystolic = "Please enter systolic value";

    if (formData.bloodPressureSystolic && (formData.bloodPressureSystolic < 70 || formData.bloodPressureSystolic > 200))
      newErrors.bloodPressureSystolic = "Value should be between 70-200";
    if (formData.bloodPressureDiastolic && (formData.bloodPressureDiastolic < 40 || formData.bloodPressureDiastolic > 130))
      newErrors.bloodPressureDiastolic = "Value should be between 40-130";
    if (formData.bloodSugar && (formData.bloodSugar < 40 || formData.bloodSugar > 600))
      newErrors.bloodSugar = "Value should be between 40-600 mg/dL";
    if (formData.temperature && (formData.temperature < 95 || formData.temperature > 107))
      newErrors.temperature = "Value should be between 95-107°F";
    if (formData.heartRate && (formData.heartRate < 40 || formData.heartRate > 200))
      newErrors.heartRate = "Value should be between 40-200 bpm";
    if (formData.spo2 && (formData.spo2 < 70 || formData.spo2 > 100))
      newErrors.spo2 = "Value should be between 70-100%";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    setErrors({});

    try {
      // Prepare data for API
      const apiData = {
        bloodPressureSystolic: formData.bloodPressureSystolic ? parseInt(formData.bloodPressureSystolic) : null,
        bloodPressureDiastolic: formData.bloodPressureDiastolic ? parseInt(formData.bloodPressureDiastolic) : null,
        bloodSugar: formData.bloodSugar ? parseFloat(formData.bloodSugar) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        spo2: formData.spo2 ? parseInt(formData.spo2) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        date: formData.date,
        time: formData.time,
        notes: formData.notes || null,
      };

      console.log("Submitting vital signs:", apiData);

      const response = await fetch("http://localhost:8080/api/vital-signs/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(errorData.error || `Submission failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submission successful:", result);

      alert("Health data submitted successfully!");
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
      
      onClose();
      
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ general: error.message || "Failed to submit data. Please try again." });
      alert("Failed to submit: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex flex-wrap justify-between items-center gap-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold truncate">Manual Health Data Entry</h2>
            <p className="text-blue-100 text-sm mt-1 truncate">Enter your vital signs measured at home</p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* General Error */}
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={16} className="mr-2 text-blue-600" /> Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
                required
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={submitting}
                required
              />
            </div>
          </div>

          {/* Vital Inputs (BP, Sugar, Temp, etc.) */}
          <div className="space-y-4">
            {/* Blood Pressure */}
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Activity size={18} className="mr-2 text-purple-600" />
                Blood Pressure (mmHg)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    name="bloodPressureSystolic"
                    value={formData.bloodPressureSystolic}
                    onChange={handleChange}
                    placeholder="Systolic (120)"
                    disabled={submitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.bloodPressureSystolic ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.bloodPressureSystolic && <p className="text-red-600 text-xs mt-1">{errors.bloodPressureSystolic}</p>}
                </div>
                <div>
                  <input
                    type="number"
                    name="bloodPressureDiastolic"
                    value={formData.bloodPressureDiastolic}
                    onChange={handleChange}
                    placeholder="Diastolic (80)"
                    disabled={submitting}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.bloodPressureDiastolic ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.bloodPressureDiastolic && <p className="text-red-600 text-xs mt-1">{errors.bloodPressureDiastolic}</p>}
                </div>
              </div>
            </div>

            {/* Blood Sugar */}
            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Droplet size={18} className="mr-2 text-red-600" />
                Blood Sugar (mg/dL)
              </label>
              <input
                type="number"
                name="bloodSugar"
                value={formData.bloodSugar}
                onChange={handleChange}
                placeholder="e.g., 100"
                disabled={submitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.bloodSugar ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.bloodSugar && <p className="text-red-600 text-xs mt-1">{errors.bloodSugar}</p>}
            </div>

            {/* Temperature */}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Thermometer size={18} className="mr-2 text-orange-600" />
                Body Temperature (°F)
              </label>
              <input
                type="number"
                step="0.1"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="e.g., 98.6"
                disabled={submitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.temperature ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.temperature && <p className="text-red-600 text-xs mt-1">{errors.temperature}</p>}
            </div>

            {/* Heart Rate */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Heart size={18} className="mr-2 text-blue-600" />
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                name="heartRate"
                value={formData.heartRate}
                onChange={handleChange}
                placeholder="e.g., 72"
                disabled={submitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.heartRate ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.heartRate && <p className="text-red-600 text-xs mt-1">{errors.heartRate}</p>}
            </div>

            {/* SpO2 */}
            <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Droplet size={18} className="mr-2 text-teal-600" />
                Blood Oxygen (SpO₂) %
              </label>
              <input
                type="number"
                name="spo2"
                value={formData.spo2}
                onChange={handleChange}
                placeholder="e.g., 98"
                disabled={submitting}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${errors.spo2 ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.spo2 && <p className="text-red-600 text-xs mt-1">{errors.spo2}</p>}
            </div>

            {/* Weight */}
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Scale size={18} className="mr-2 text-green-600" />
                Weight (lbs)
              </label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 150"
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any symptoms, activities, or relevant information..."
                rows="3"
                disabled={submitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Data"}
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            Your data is securely stored and will be reviewed by your healthcare provider
          </p>
        </form>
      </div>
    </div>
  );
};

export default ManualEntryForm;