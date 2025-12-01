import React from 'react';
import { CheckCircle } from 'lucide-react';

const MedicationsCard = () => {
  const medications = [
    { id: 1, name: 'Aspirin', dosage: '100mg', time: '08:00 AM', color: 'green', taken: true },
    { id: 2, name: 'Metformin', dosage: '500mg', time: '01:00 PM', color: 'orange', taken: false },
    { id: 3, name: 'Lisinopril', dosage: '10mg', time: '08:00 PM', color: 'orange', taken: false }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Today's Medications</h2>
      </div>

      <div className="space-y-4">
        {medications.map((med) => (
          <div key={med.id} className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
            <div className={`${med.color === 'green' ? 'bg-green-500' : 'bg-orange-500'} rounded-lg p-3 flex-shrink-0`}>
              {/* You can replace this svg with a medicine/pill icon if you want */}
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-1">{med.name}</h3>
              <p className="text-gray-600 text-sm">{med.dosage} • {med.time}</p>
            </div>

            {med.taken && (
              <span className="text-green-500 text-sm font-semibold flex items-center gap-1 whitespace-nowrap">
                <CheckCircle className="w-4 h-4" />
                Taken
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationsCard;
