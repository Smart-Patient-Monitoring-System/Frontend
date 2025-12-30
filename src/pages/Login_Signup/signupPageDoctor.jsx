import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import sup from "../../assets/images/sup.jpg";
import FormRow from '../../components/signup/FormRow';

const API_URL = "http://localhost:5000/api";

export default function SignupPageDoctor() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    address: '',
    email: '',
    nic: '',
    gender: '',
    contactNo: '',
    specialty: '',
    licenseNumber: '',
    department: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const requiredFields = ['name', 'email', 'username', 'password', 'confirmPassword'];
    const missingFields = requiredFields.filter(field => !formData[field]?.trim());
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: 'doctor',
        name: formData.name.trim(),
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address.trim() || undefined,
        nic: formData.nic.trim() || undefined,
        gender: formData.gender || undefined,
        contactNo: formData.contactNo.trim() || undefined,
        specialty: formData.specialty.trim() || undefined,
        licenseNumber: formData.licenseNumber.trim() || undefined,
        department: formData.department.trim() || undefined,
      });

      setSuccess('Registration successful! Redirecting to login...');
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      setTimeout(() => {
        navigate('/doctorLogin');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        setError(err.response.data?.message || `Error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        setError('Cannot connect to server. Please make sure the backend is running on http://localhost:5000');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center p-4 sm:p-6"
      style={{ backgroundImage: `url(${sup})` }}
    >
      {/* LEFT CARD */}
      <div className="
          w-full sm:w-[90%] md:w-[85%] lg:w-[48%]
          bg-[#D9D9D9]
          rounded-[32px] sm:rounded-[48px] md:rounded-[64px] lg:rounded-[80px]
          opacity-80
          p-8 sm:p-10 md:p-12 lg:p-16
          m-1
          flex flex-col
          h-full lg:h-[820px]
        ">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight mb-6 sm:mb-8">
          Doctor's Sign Up
        </h1>

        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full">
          <FormRow 
            label="Name" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormRow 
            label="Date of Birth" 
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <FormRow 
            label="Address" 
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <FormRow 
            label="E-Mail" 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormRow 
            label="NIC No" 
            name="nic"
            value={formData.nic}
            onChange={handleChange}
          />

          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-lg sm:text-xl md:text-2xl font-bold w-full sm:w-auto">Gender</span>
            <label className="flex items-center gap-2 text-sm sm:text-lg md:text-xl text-bold">
              <input 
                type="radio" 
                name="gender" 
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                className="w-5 h-5 sm:w-6 sm:h-6" 
              />
              Male
            </label>
            <label className="flex items-center gap-2 text-sm sm:text-lg md:text-xl text-bold">
              <input 
                type="radio" 
                name="gender" 
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
                className="w-5 h-5 sm:w-6 sm:h-6" 
              />
              Female
            </label>
          </div>

          <FormRow 
            label="Contact No" 
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
          />
          <FormRow 
            label="Doctor's ID" 
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="
          w-full sm:w-[90%] md:w-[85%] lg:w-[48%]
          bg-[#D9D9D9]
          rounded-[32px] sm:rounded-[48px] md:rounded-[64px] lg:rounded-[80px]
          opacity-80
          p-8 sm:p-10 md:p-12 lg:p-16
          m-1
          flex flex-col justify-between
          h-full lg:h-[820px]
        ">

        {/* TOP SCROLL CONTENT */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 md:gap-6 w-full overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <FormRow 
            label="Doctor's Position" 
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
          />
          <FormRow 
            label="Hospital" 
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
          <FormRow 
            label="User Name" 
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <FormRow 
            label="Password" 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FormRow 
            label="Confirm Password" 
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <FormRow 
            label="Contact No" 
            name="contactNo"
            value={formData.contactNo}
            onChange={handleChange}
          />

          {/* BUTTON AT BOTTOM ALWAYS */}
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={loading}
              className="
                w-full sm:w-2/3 lg:w-[273px]
                h-12 sm:h-[65px]
                bg-gradient-to-r from-[#0090EE] to-[#00BAC5]
                rounded-full shadow-md
                flex items-center justify-center
                transform transition-transform duration-200 ease-in-out
                hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <span className="text-white text-lg sm:text-2xl md:text-3xl font-semibold text-center">
                {loading ? 'Signing Up...' : 'Sign Up'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
