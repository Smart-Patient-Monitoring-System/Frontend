import React from 'react'
import {Link} from 'react-router-dom'

function NavLinks() {
  return (
    <div>
        <nav style={{ padding: "20px", display: "flex", gap: "20px" }}>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/signin">Sign In</Link>
      <Link to="/DocDashboard">DocDashboard</Link>
    </nav>
    </div>
  )
}

export default NavLinks