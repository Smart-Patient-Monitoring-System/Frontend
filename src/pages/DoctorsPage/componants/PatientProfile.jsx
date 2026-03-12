import { User, Droplets, Phone, Mail, Heart, Pill, AlertCircle } from "lucide-react";

function PatientProfile({ patient }) {
    if (!patient) return null;

    // Calculate age from date of birth
    const calcAge = (dob) => {
        if (!dob) return "N/A";
        const birth = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    };

    return (
        <div className="bg-white rounded-3xl p-5 shadow-md">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500 text-white p-2.5 rounded-2xl">
                    <User size={22} />
                </div>
                <div>
                    <h3 className="font-bold text-lg">{patient.name || "Unknown"}</h3>
                    <p className="text-gray-500 text-sm">Patient ID: {patient.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoItem icon={<User size={16} />} label="Age" value={`${calcAge(patient.dateOfBirth)} yrs`} />
                <InfoItem icon={<User size={16} />} label="Gender" value={patient.gender || "N/A"} />
                <InfoItem icon={<Droplets size={16} />} label="Blood Type" value={patient.bloodType || "N/A"} color="text-red-600" />
                <InfoItem icon={<Phone size={16} />} label="Contact" value={patient.contactNo || "N/A"} />
            </div>

            {(patient.medicalConditions || patient.allergies || patient.currentMedications) && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {patient.medicalConditions && (
                        <DetailCard icon={<Heart size={16} />} title="Medical Conditions" text={patient.medicalConditions} color="blue" />
                    )}
                    {patient.allergies && (
                        <DetailCard icon={<AlertCircle size={16} />} title="Allergies" text={patient.allergies} color="amber" />
                    )}
                    {patient.currentMedications && (
                        <DetailCard icon={<Pill size={16} />} title="Current Medications" text={patient.currentMedications} color="purple" />
                    )}
                </div>
            )}
        </div>
    );
}

function InfoItem({ icon, label, value, color = "text-gray-800" }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-400">{icon}</span>
            <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className={`font-medium text-sm ${color}`}>{value}</p>
            </div>
        </div>
    );
}

function DetailCard({ icon, title, text, color }) {
    const colorMap = {
        blue: "bg-blue-50 border-blue-200 text-blue-700",
        amber: "bg-amber-50 border-amber-200 text-amber-700",
        purple: "bg-purple-50 border-purple-200 text-purple-700",
    };

    return (
        <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.blue}`}>
            <div className="flex items-center gap-1.5 mb-1">
                {icon}
                <p className="font-semibold text-xs">{title}</p>
            </div>
            <p className="text-xs">{text}</p>
        </div>
    );
}

export default PatientProfile;
