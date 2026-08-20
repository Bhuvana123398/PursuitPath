import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import JobSearch from './pages/JobSearch';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import PostJob from './pages/PostJob'; // <--- ADD THIS LINE!
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar user={user} setUser={setUser} />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<JobSearch />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile /> : <Navigate to="/login" />} 
            />
            {/* This will now work because PostJob is imported */}
            <Route 
              path="/post-job" 
              element={user && user.role === 'recruiter' ? <PostJob /> : <Navigate to="/" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;