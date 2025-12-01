import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage.jsx';
import SignInpage from './pages/Login,SignIn/signInpage.jsx';
import Loginpage from './pages/Login,SignIn/loginpage.jsx'; 
import DocDashboard from './pages/DoctorsPage/DocDashboard.jsx';
import NavLinks from './pages/DoctorsPage/NavLinks.jsx';




function App() {

  return (
    <>
  
     <Router> 
       <div> <NavLinks /></div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInpage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/DocDashboard" element={<DocDashboard />} />
        </Routes>
     </Router>
   
    </>
  )
}

export default App
