import React from "react";

export default function DoctorTable({ doctors, onEdit, onDelete, onMore }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-blue-50">
          <tr>
            <th className="border-b px-4 py-2 text-left text-gray-700">Name</th>
            <th className="border-b px-4 py-2 text-left text-gray-700">
              Specialty
            </th>
            <th className="border-b px-4 py-2 text-left text-gray-700">
              Fee (Rs.)
            </th>
            <th className="border-b px-4 py-2 text-left text-gray-700">
              Phone
            </th>
            <th className="border-b px-4 py-2 text-left text-gray-700">
              Email
            </th>
            <th className="border-b px-4 py-2 text-left text-gray-700">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {doctors.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
              <td className="border-b px-4 py-2">{doc.name}</td>
              <td className="border-b px-4 py-2">{doc.specialty}</td>
              <td className="border-b px-4 py-2">{doc.consultationFee}</td>
              <td className="border-b px-4 py-2">{doc.phoneNumber}</td>
              <td className="border-b px-4 py-2">{doc.email}</td>

              <td className="border-b px-4 py-2 space-x-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => onMore(doc)}
                >
                  More
                </button>

                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                  onClick={() => onEdit(doc)}
                >
                  Edit
                </button>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  onClick={() => onDelete(doc.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
