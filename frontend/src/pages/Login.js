import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../config';
const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      alert("Login failed");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" placeholder="Email" className="w-full p-3 border rounded-lg"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" className="w-full p-3 border rounded-lg"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <button className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold">Login</button>
            <p className="mt-6 text-center text-slate-500">
                Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign Up</Link>
            </p>
      </form>
    </div>
  );
};
export default Login;