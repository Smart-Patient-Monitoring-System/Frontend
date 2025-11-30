import { User, Mail, Phone, MapPin, Calendar, Heart, Pill, AlertCircle } from "lucide-react";

const ProfileTab = () => {
  const personalInfo = {
    fullName: "Sarah Johnson",
    patientId: "P-2024-001",
    age: 34,
    bloodType: "A+",
    room: "204-B",
    admission: "Nov 1, 2025",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    emergencyContact: "John Johnson",
    emergencyPhone: "+1 (555) 987-6543",
    relationship: "Spouse"
  };

  const medicalHistory = {
    allergies: ["Penicillin"],
    currentMedications: [
      { name: "Aspirin 100mg", frequency: "Once daily" },
      { name: "Lisinopril 10mg", frequency: "Once daily" }
    ],
    chronicConditions: ["Hypertension"],
    pastSurgeries: [
      { name: "Appendectomy", date: "2018" },
      { name: "Wisdom Teeth Removal", date: "2015" }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Full Name</span>
              <span className="text-gray-800 font-semibold">{personalInfo.fullName}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Patient ID</span>
              <span className="text-gray-800 font-semibold">{personalInfo.patientId}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Age</span>
              <span className="text-gray-800 font-semibold">{personalInfo.age} years</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Blood Type</span>
              <span className="text-gray-800 font-semibold">{personalInfo.bloodType}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Room</span>
              <span className="text-gray-800 font-semibold">{personalInfo.room}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Admission</span>
              <span className="text-gray-800 font-semibold">{personalInfo.admission}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex items-start py-3 border-b border-gray-200">
              <Mail className="w-5 h-5 text-gray-500 mr-3 mt-1" />
              <div className="flex-1">
                <span className="text-gray-600 font-medium block mb-1">Email</span>
                <span className="text-gray-800">{personalInfo.email}</span>
              </div>
            </div>
            
            <div className="flex items-start py-3 border-b border-gray-200">
              <Phone className="w-5 h-5 text-gray-500 mr-3 mt-1" />
              <div className="flex-1">
                <span className="text-gray-600 font-medium block mb-1">Phone</span>
                <span className="text-gray-800">{personalInfo.phone}</span>
              </div>
            </div>
            
            <div className="flex items-start py-3 border-b border-gray-200">
              <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-1" />
              <div className="flex-1">
                <span className="text-gray-600 font-medium block mb-1">Address</span>
                <span className="text-gray-800">{personalInfo.address}</span>
              </div>
            </div>
            
            <div className="flex items-start py-3 border-b border-gray-200">
              <User className="w-5 h-5 text-gray-500 mr-3 mt-1" />
              <div className="flex-1">
                <span className="text-gray-600 font-medium block mb-1">Emergency Contact</span>
                <span className="text-gray-800">{personalInfo.emergencyContact}</span>
                <span className="text-gray-500 text-sm block">({personalInfo.relationship})</span>
              </div>
            </div>
            
            <div className="flex items-start py-3 border-b border-gray-200">
              <Phone className="w-5 h-5 text-gray-500 mr-3 mt-1" />
              <div className="flex-1">
                <span className="text-gray-600 font-medium block mb-1">Emergency Phone</span>
                <span className="text-gray-800">{personalInfo.emergencyPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical History Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Medical History</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Allergies */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                Allergies
              </h3>
              <div className="space-y-2">
                {medicalHistory.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Pill className="w-5 h-5 text-blue-500 mr-2" />
                Current Medications
              </h3>
              <div className="space-y-3">
                {medicalHistory.currentMedications.map((med, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-800">{med.name}</p>
                    <p className="text-sm text-gray-600">{med.frequency}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Chronic Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Heart className="w-5 h-5 text-purple-500 mr-2" />
                Chronic Conditions
              </h3>
              <div className="space-y-2">
                {medicalHistory.chronicConditions.map((condition, index) => (
                  <div key={index} className="bg-purple-50 px-4 py-2 rounded-lg">
                    <p className="text-gray-800">{condition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Surgeries */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Calendar className="w-5 h-5 text-teal-500 mr-2" />
                Past Surgeries
              </h3>
              <div className="space-y-3">
                {medicalHistory.pastSurgeries.map((surgery, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-800">{surgery.name}</p>
                    <p className="text-sm text-gray-600">{surgery.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;