import React from 'react'
import { AlertTriangle, Clock } from 'lucide-react'


const AlertsCard = () => {
const alerts = [
{ id: 1, text: 'High temperature detected', time: '2m ago' },
{ id: 2, text: 'Irregular heartbeat', time: '12m ago' },
]


return (
<div className="glass-card p-4 rounded-xl shadow-sm border border-gray-100">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="bg-red-100 p-2 rounded-md">
<AlertTriangle className="w-5 h-5 text-red-600" />
</div>
<div>
<p className="text-sm text-gray-500">Recent Alerts</p>
<p className="text-lg font-semibold text-gray-800">{alerts.length} New</p>
</div>
</div>
<div className="text-sm text-gray-500">View all</div>
</div>


<ul className="mt-4 space-y-3">
{alerts.map(a => (
<li key={a.id} className="flex items-center justify-between">
<div>
<p className="text-sm text-gray-700">{a.text}</p>
<p className="text-xs text-gray-400">{a.time}</p>
</div>
<div className="text-gray-300"><Clock className="w-4 h-4" /></div>
</li>
))}
</ul>
</div>
)
}


export default AlertsCard;