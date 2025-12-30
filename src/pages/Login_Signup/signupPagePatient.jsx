import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import sup from "../../assets/images/sup.jpg";
import FormRow from '../../components/signup/FormRow';

const API_URL = "http://localhost:5000/api";

export default function SignupPagePatient() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        dateOfBirth: '',
        address: '',
        email: '',
        nic: '',
        gender: '',
        contactNo: '',
        guardianName: '',
        guardianContactNo: '',
        username: '',
        password: '',
        confirmPassword: '',
        bloodType: ''
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

        // Validation
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
            // Build request payload, only including non-empty fields
            const payload = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: 'patient',
                name: formData.name.trim(),
            };

            // Add optional fields only if they have values
            if (formData.dateOfBirth) payload.dateOfBirth = formData.dateOfBirth;
            if (formData.address?.trim()) payload.address = formData.address.trim();
            if (formData.nic?.trim()) payload.nic = formData.nic.trim();
            if (formData.gender) payload.gender = formData.gender;
            if (formData.contactNo?.trim()) payload.contactNo = formData.contactNo.trim();
            if (formData.guardianName?.trim()) payload.guardianName = formData.guardianName.trim();
            if (formData.guardianContactNo?.trim()) payload.guardianContactNo = formData.guardianContactNo.trim();
            if (formData.bloodType) payload.bloodType = formData.bloodType;

            console.log('Sending registration request to:', `${API_URL}/auth/register`);
            console.log('Payload:', { ...payload, password: '***' }); // Don't log password

            const response = await axios.post(`${API_URL}/auth/register`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000, // 10 second timeout
            });

            setSuccess('Registration successful! Redirecting to login...');
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            setTimeout(() => {
                navigate('/patientLogin');
            }, 2000);
        } catch (err) {
            console.error('Registration error:', err);
            
            if (err.response) {
                // Server responded with error
                setError(err.response.data?.message || `Error: ${err.response.status} - ${err.response.statusText}`);
            } else if (err.request) {
                // Request was made but no response received
                setError('Cannot connect to server. Please make sure the backend is running on http://localhost:5000');
            } else {
                // Something else happened
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
            {/* Left Card */}
            <div className="
                w-full sm:w-[90%] md:w-[85%] lg:w-[48%] 
                bg-[#D9D9D9] 
                rounded-[32px] sm:rounded-[48px] md:rounded-[64px] lg:rounded-[80px]  /* uniform radius */
                opacity-80 
                p-8 sm:p-10 md:p-12 lg:p-16 
                m-1  /* reduced gap */
                flex flex-col
                h-full lg:h-[820px]   /* equal height */
            ">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight mb-6 sm:mb-8">
                    Patient’s Sign Up
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
                        <label className="flex items-center gap-2 text-sm sm:text-lg md:text-xl font-bold">
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
                        <label className="flex items-center gap-2 text-sm sm:text-lg md:text-xl font-bold">
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
                        label="Guardian's Name" 
                        name="guardianName"
                        value={formData.guardianName}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Right Card */}
            <div className="
                w-full sm:w-[90%] md:w-[85%] lg:w-[48%] 
                bg-[#D9D9D9] 
                rounded-[32px] sm:rounded-[48px] md:rounded-[64px] lg:rounded-[80px]  /* uniform radius */
                opacity-80 
                p-8 sm:p-10 md:p-12 lg:p-16 
                m-1  /* reduced gap */
                flex flex-col justify-between
                h-full lg:h-[820px]   /* equal height */
            ">
                {/* Scrollable content */}
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
                        label="Guardian's Contact No" 
                        name="guardianContactNo"
                        value={formData.guardianContactNo}
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                        <span className="font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] w-full sm:w-[30%] md:w-[28%] lg:w-[26%] text-left">
                            Blood type
                        </span>
                        <select
                            name="bloodType"
                            value={formData.bloodType}
                            onChange={handleChange}
                            className="w-full sm:w-[65%] md:w-[70%] lg:w-[78%] xl:w-[74%] h-10 md:h-11 lg:h-12 bg-white rounded-full px-4 border border-[#D9D9D9]"
                        >
                            <option value="">Select blood type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    {/* Sign Up Button at bottom */}
                    <div className="flex justify-center mt-6 sm:mt-8 w-full">
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
