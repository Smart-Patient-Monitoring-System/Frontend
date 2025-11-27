import React from 'react'


const GraphCard = () => {
// simple sparkline svg
const points = "0,40 30,10 60,30 90,5 120,20 150,12 180,25 210,8 240,18";
return (
<div className="glass-card p-4 rounded-xl shadow-sm border border-gray-100 col-span-1 sm:col-span-2">
<div className="flex items-center justify-between">
<div>
<p className="text-sm text-gray-500">Live ECG</p>
<p className="text-lg font-semibold text-gray-800">Realtime</p>
</div>
<div className="text-sm text-gray-500">Last 10 min</div>
</div>


<div className="mt-4">
<svg viewBox="0 0 260 50" className="w-full h-20">
<polyline fill="none" stroke="#4f46e5" strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
</svg>
</div>
</div>
)
}


export default GraphCard