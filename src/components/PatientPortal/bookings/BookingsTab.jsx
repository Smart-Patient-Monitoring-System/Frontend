import { useState } from "react";
import AppointmentCard from "./AppointmentCard";
import NewBookingModal from "./NewBookingModal";
import SearchBar from "./SearchBar";
import ViewTabs from "./ViewTabs";

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
        avatar: "https://i.pravatar.cc/150?img=45",
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
        avatar: "https://i.pravatar.cc/150?img=33",
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
        avatar: "https://i.pravatar.cc/150?img=47",
      },
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
        avatar: "https://i.pravatar.cc/150?img=45",
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
        avatar: "https://i.pravatar.cc/150?img=52",
      },
    ],
  };

  // Filter appointments based on search
  const filteredAppointments = appointments[activeView].filter(
    (apt) =>
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Appointments
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your medical appointments
          </p>
        </div>

        <button
          onClick={() => setShowNewBooking(true)}
          className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <span className="hidden sm:inline">Book New Appointment</span>
          <span className="sm:hidden">Book Appointment</span>
        </button>
      </div>

      {/* Search */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Tabs */}
      <ViewTabs activeView={activeView} setActiveView={setActiveView} />

      {/* Appointments List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              activeView={activeView}
            />
          ))
        ) : (
          <div className="text-center py-12 sm:py-16 bg-white rounded-lg sm:rounded-xl border border-gray-200">
            <p className="text-gray-600">
              {searchQuery
                ? "No results found. Try adjusting your search."
                : "You don't have any appointments scheduled."}
            </p>
          </div>
        )}
      </div>

      {/* New Booking Modal */}
      {showNewBooking && (
        <NewBookingModal setShowNewBooking={setShowNewBooking} />
      )}
    </div>
  );
};

export default BookingsTab;
