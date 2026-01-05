const ViewTabs = ({ activeView, setActiveView }) => {
  return (
    <div className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto">
      {/* Upcoming Tab */}
      <button
        onClick={() => setActiveView("upcoming")}
        className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
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

      {/* Past Appointments Tab */}
      <button
        onClick={() => setActiveView("past")}
        className={`px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold transition-colors relative whitespace-nowrap ${
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
  );
};

export default ViewTabs;
