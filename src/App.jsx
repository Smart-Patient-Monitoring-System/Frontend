

import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPageAdmin from './pages/Login_Signup/loginPageAdmin'
import LoginPageDoctor from './pages/Login_Signup/loginPageDoctor';
import SignupPageDoctor from './pages/Login_Signup/signupPageDoctor';
import LoginPageNurse from './pages/Login_Signup/loginPageNurse';

import RoleSelect from './pages/Login_Signup/roleSelectionpage';
import LoginPagePatient from './pages/Login_Signup/loginPagePatient';
import SignupPageNurse from './pages/Login_Signup/signupPageNurse';
import SignupPageAdmin from './pages/Login_Signup/signupPageAdmin';
import SignupPagePatient from './pages/Login_Signup/signupPagePatient';

import DoctorDashboard from './pages/DoctorsPage/DocDashboard';
import AdminDashboard from './components/AdminPortal/AdminDashboard';

function App() {


  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/doctorLogin" element={<DoctorDashboard />} />
        <Route path="/nurseLogin" element={<LoginPageNurse />} />
        <Route path="/adminLogin" element={<AdminDashboard />} />
        <Route path="/patientLogin" element={<LoginPagePatient />} />

        <Route path="/doctorSignup" element={<SignupPageDoctor />} />
        <Route path="/nurseSignup" element={<SignupPageNurse />} />
        <Route path="/adminSignup" element={<SignupPageAdmin />} />
        <Route path="/patientSignup" element={<SignupPagePatient />} />


      </Routes>
    </BrowserRouter>

  )
}
// hello
export default App;
