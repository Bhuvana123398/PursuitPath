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
        <div className="min-h-screen bg-slate-50 w-full">
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar user={user} setUser={setUser} />
          <main className="w-full"> 
            <Routes>
              <Route path="/" element={<JobSearch />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/post-job" element={<PostJob />} />
            </Routes>
          </main>
        </div>
      </Router>
    );
}

export default App;