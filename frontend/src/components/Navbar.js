import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Briefcase, Search, Layout } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Briefcase size={22} />
          <span>PursuitPath</span>
        </Link>

        {/* Right Side: Dynamic Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/" className="p-2 text-slate-600"><Search size={20}/></Link>
              <Link to="/dashboard" className="p-2 text-slate-600"><Layout size={20}/></Link>
              <button onClick={handleLogout} className="text-red-500 font-bold text-sm ml-2">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;