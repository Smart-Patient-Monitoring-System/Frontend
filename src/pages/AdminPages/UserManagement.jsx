import React from "react";

function UserManagement(){
    return (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Left Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Doctors & Staff</h3>
                <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full">
                    Add Doctor
                </button>
                </div>

                <input
                type="text"
                placeholder="Search Doctors..."
                className="w-full mb-4 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
                />

                <div className="space-y-3">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <div>
                    <p className="font-medium">Dr. Michael Chen</p>
                    <p className="text-sm text-gray-500">Cardiology · D-001</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    active
                    </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
                    <div>
                    <p className="font-medium">Dr. Michael Chen</p>
                    <p className="text-sm text-gray-500">Cardiology · D-002</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    active
                    </span>
                </div>
                </div>
            </div>

             {/* Right Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Doctors & Staff</h3>
                <button className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full">
                    Add Doctor
                </button>
                </div>

                <input
                type="text"
                placeholder="Search Doctors..."
                className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm outline-none"
                />
            </div>
         </div>
    );
}