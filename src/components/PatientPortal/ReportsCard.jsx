import React from 'react';

const ReportsCard = () => {
  const reports = [
    { id: 1, name: 'Blood Test - Nov 20', date: 'Nov 20' },
    { id: 2, name: 'X-Ray Report - Nov 15', date: 'Nov 15' },
    { id: 3, name: 'ECG Report - Nov 10', date: 'Nov 10' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800">Recent Reports</h2>
      </div>

      <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl py-3 px-4 font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all mb-6">
        Upload New Report
      </button>

      <div className="space-y-3">
        {reports.map(report => (
          <div key={report.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <span className="text-gray-700">{report.name}</span>
            <button className="text-blue-500 hover:text-blue-600">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsCard;
