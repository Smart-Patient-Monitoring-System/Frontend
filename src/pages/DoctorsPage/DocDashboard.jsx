import React from 'react'
import CriticalAlertPage from './CriticalAlertPage'
import ECGReaderPage from './ECGReaderPage'
import ECGGraph from './componants/ECGGraph'

function DocDashboard() {
  return (
    <>
    
    <div>DocDashboard</div>
    
    <div><ECGReaderPage/></div>
    <div className=""><ECGGraph/></div>
    </>
    
  )
}

export default DocDashboard