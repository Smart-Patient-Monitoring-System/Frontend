import { useState } from "react";
import { Calendar, Clock, User, MapPin, Video, Phone, Building, ChevronRight, Plus, Filter, Search, X } from "lucide-react";

const BookingsTab = () => {
  const [activeView, setActiveView] = useState("upcoming");
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample appointments data
  const appointments = {
    upcoming: [
      {
        id: 1,
        doctorName: "Dr. Emily Chen",
        specialty: "Cardiologist",
        date: "2024-12-05",
        time: "10:00 AM",
        duration: "30 min",
        type: "In-Person",
        location: "Cardiology Department, Floor 3",
        reason: "Follow-up Consultation",
        status: "confirmed",
        avatar: "https://i.pravatar.cc/150?img=45"
      },
      {
        id: 2,
        doctorName: "Dr. Michael Torres",
        specialty: "General Physician",
        date: "2024-12-08",
        time: "02:30 PM",
        duration: "20 min",
        type: "Video Call",
        location: "Online",
        reason: "Routine Checkup",
        status: "confirmed",
        avatar: "https://i.pravatar.cc/150?img=33"
      },
      {
        id: 3,
        doctorName: "Dr. Sarah Williams",
        specialty: "Endocrinologist",
        date: "2024-12-12",
        time: "11:00 AM",
        duration: "45 min",
        type: "In-Person",
        location: "Endocrinology Wing, Room 205",
        reason: "Diabetes Management",
        status: "pending",
        avatar: "https://i.pravatar.cc/150?img=47"
      }
    ],
    past: [
      {
        id: 4,
        doctorName: "Dr. Emily Chen",
        specialty: "Cardiologist",
        date: "2024-11-15",
        time: "09:00 AM",
        duration: "30 min",
        type: "In-Person",
        location: "Cardiology Department, Floor 3",
        reason: "ECG Reading Review",
        status: "completed",
        avatar: "https://i.pravatar.cc/150?img=45"
      },
      {
        id: 5,
        doctorName: "Dr. James Anderson",
        specialty: "Neurologist",
        date: "2024-11-02",
        time: "03:00 PM",
        duration: "40 min",
        type: "In-Person",
        location: "Neurology Department",
        reason: "Headache Consultation",
        status: "completed",
        avatar: "https://i.pravatar.cc/150?img=52"
      }
    ]
  };

  const AppointmentCard = ({ appointment }) => {
    const getStatusColor = (status) => {
      switch(status) {
        case "confirmed": return "bg-green-100 text-green-700 border-green-200";
        case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "completed": return "bg-gray-100 text-gray-700 border-gray-200";
        case "cancelled": return "bg-red-100 text-red-700 border-red-200";
        default: return "bg-gray-100 text-gray-700 border-gray-200";
      }
    };

    const getTypeIcon = (type) => {
      if (type === "Video Call") return <Video size={16} />;
      if (type === "Phone Call") return <Phone size={16} />;
      return <Building size={16} />;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-4">
          {/* Doctor Avatar */}
          <div className="flex-shrink-0">
            <img 
              src={appointment.avatar} 
              alt={appointment.doctorName}
              className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{appointment.doctorName}</h3>
                <p className="text-sm text-gray-600">{appointment.specialty}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(appointment.status)}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar size={16} className="text-blue-600" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock size={16} className="text-blue-600" />
                <span>{appointment.time} ({appointment.duration})</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-700">
                {getTypeIcon(appointment.type)}
                <span>{appointment.type}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin size={16} className="text-blue-600" />
                <span className="truncate">{appointment.location}</span>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Reason: </span>
                {appointment.reason}
              </p>
            </div>

            {/* Actions */}
            {activeView === "upcoming" && (
              <div className="flex gap-3">
                {appointment.type === "Video Call" && (
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Video size={16} />
                    Join Call
                  </button>
                )}
                <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Reschedule
                </button>
                <button className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                  Cancel
                </button>
              </div>
            )}

            {activeView === "past" && (
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Book Again
                </button>
                <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  View Summary
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const NewBookingModal = () => {
    const [bookingData, setBookingData] = useState({
      specialty: "",
      doctor: "",
      date: "",
      time: "",
      type: "In-Person",
      reason: ""
    });

    const specialties = [
      "Cardiology",
      "General Medicine",
      "Endocrinology",
      "Neurology",
      "Orthopedics",
      "Dermatology",
      "Pediatrics"
    ];

    const availableTimes = [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
    ];

    const handleChange = (e) => {
      const { name, value } = e.target;
      setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
      console.log("Booking data:", bookingData);
      alert("Appointment request submitted successfully!");
      setShowNewBooking(false);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Book New Appointment</h2>
              <p className="text-blue-100 text-sm mt-1">Schedule your next visit</p>
            </div>
            <button
              onClick={() => setShowNewBooking(false)}
              className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-5">
            {/* Specialty Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Specialty
              </label>
              <select
                name="specialty"
                value={bookingData.specialty}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a specialty...</option>
                {specialties.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Doctor (Optional)
              </label>
              <select
                name="doctor"
                value={bookingData.doctor}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!bookingData.specialty}
              >
                <option value="">Any available doctor</option>
                <option value="dr-chen">Dr. Emily Chen</option>
                <option value="dr-torres">Dr. Michael Torres</option>
                <option value="dr-williams">Dr. Sarah Williams</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                name="date"
                value={bookingData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Time
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setBookingData(prev => ({ ...prev, time }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      bookingData.time === time
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Appointment Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["In-Person", "Video Call", "Phone Call"].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBookingData(prev => ({ ...prev, type }))}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      bookingData.type === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type === "In-Person" && <Building size={16} />}
                    {type === "Video Call" && <Video size={16} />}
                    {type === "Phone Call" && <Phone size={16} />}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Visit
              </label>
              <textarea
                name="reason"
                value={bookingData.reason}
                onChange={handleChange}
                placeholder="Describe your symptoms or reason for booking..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowNewBooking(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredAppointments = appointments[activeView].filter(apt =>
    apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    apt.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your medical appointments</p>
        </div>
        
        <button
          onClick={() => setShowNewBooking(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Book New Appointment
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by doctor, specialty, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveView("upcoming")}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeView === "upcoming"
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Upcoming
          {activeView === "upcoming" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveView("past")}
          className={`px-6 py-3 font-semibold transition-colors relative ${
            activeView === "past"
              ? "text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Past Appointments
          {activeView === "past" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? "Try adjusting your search" : "You don't have any appointments scheduled"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowNewBooking(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Book Your First Appointment
              </button>
            )}
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      {showNewBooking && <NewBookingModal />}
    </div>
  );
};

export default BookingsTab;