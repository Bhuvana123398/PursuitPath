import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'candidate' // Default is candidate
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      toast.success("Account Created! Please Login.");
      navigate('/login');
    } catch (err) {
      toast.error("Registration failed. Email might be taken.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100">
      <h2 className="text-3xl font-bold mb-2 text-slate-800">Join PursuitPath</h2>
      <p className="text-slate-500 mb-8">Create an account to start your journey.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400" required
          onChange={(e) => setFormData({...formData, name: e.target.value})} />
        
        <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400" required
          onChange={(e) => setFormData({...formData, email: e.target.value})} />
        
        <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400" required
          onChange={(e) => setFormData({...formData, password: e.target.value})} />

        {/* --- NEW ROLE SELECTION --- */}
        <div className="py-2">
          <label className="text-xs font-bold text-slate-400 uppercase ml-1">I am a:</label>
          <select 
            className="w-full p-4 mt-1 bg-slate-100 rounded-2xl font-bold text-indigo-600 outline-none border-2 border-transparent focus:border-indigo-400"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="candidate">Candidate (Looking for Jobs)</option>
            <option value="recruiter">Recruiter (Posting Jobs)</option>
          </select>
        </div>

        <button className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all active:scale-95">
          Create Account
        </button>
      </form>

      <p className="mt-6 text-center text-slate-500">
        Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Login</Link>
      </p>
    </div>
  );
};

export default Register;