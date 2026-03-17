import { Users, MessageCircle } from "lucide-react";

const AssignedCareTeamCard = () => {
  const careTeam = [
    {
      id: 1,
      name: "Dr. Miller",
      role: "Lead Physician",
      avatar: "https://i.pravatar.cc/150?img=33",
      status: "online",
    },
    {
      id: 2,
      name: "Nurse Jessica",
      role: "Staff Nurse",
      avatar: "https://i.pravatar.cc/150?img=44",
      status: "online",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-700 flex items-center gap-2">
        <Users className="w-5 h-5 text-red-400" />
        <h3 className="text-lg font-semibold text-white">Assigned Care Team</h3>
      </div>

      {/* Team Members */}
      <div className="px-5 py-4 space-y-3">
        {careTeam.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {member.status === "online" && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {member.name}
                </p>
                <p className="text-xs text-gray-400">{member.role}</p>
              </div>
            </div>
            
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedCareTeamCard;