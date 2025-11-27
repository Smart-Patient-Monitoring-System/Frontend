import React from 'react'


const MedicationsCard = () => {
const meds = [
{ id: 1, name: 'Aspirin', dose: '100 mg', time: '08:00' },
{ id: 2, name: 'Metformin', dose: '500 mg', time: '12:00' },
]


return (
<div className="glass-card p-4 rounded-xl shadow-sm border border-gray-100">
<div className="flex items-center justify-between">
<div>
<p className="text-sm text-gray-500">Medications</p>
<p className="text-lg font-semibold text-gray-800">Upcoming</p>
</div>
<div className="text-sm text-gray-500">Manage</div>
</div>


<ul className="mt-4 space-y-3">
{meds.map(m => (
<li key={m.id} className="flex items-center justify-between">
<div>
<p className="text-sm text-gray-700">{m.name} • {m.dose}</p>
<p className="text-xs text-gray-400">Next: {m.time}</p>
</div>
<div className="text-sm text-gray-500">Taken</div>
</li>
))}
</ul>
</div>
)
}


export default MedicationsCard