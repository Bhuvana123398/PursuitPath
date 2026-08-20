import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Search, LogOut, Briefcase, PlusCircle, User, BarChart3 } from 'lucide-react';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 w-full sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Briefcase size={22} />
            <span>PursuitPath</span>
          </Link>
          <span className="md:hidden bg-slate-100 text-slate-500 px-2 py-1 rounded text-[10px] font-bold uppercase">
            {user?.name}
          </span>
        </div>

        {/* Navigation Area */}
        {user && (
          <div className="flex flex-col items-center w-full md:w-auto gap-4 md:flex-row">
            {/* Icon Links: Grid of 3 on mobile */}
            <div className="flex items-center justify-center gap-8 md:gap-6 border-b md:border-none pb-3 md:pb-0 w-full md:w-auto">
              {user.role === 'recruiter' ? (
                <>
                  <Link to="/dashboard" className="text-slate-600"><BarChart3 size={24} /></Link>
                  <Link to="/post-job" className="text-indigo-600"><PlusCircle size={24} /></Link>
                </>
              ) : (
                <>
                  <Link to="/" className="text-slate-600"><Search size={24} /></Link>
                  <Link to="/dashboard" className="text-slate-600"><Layout size={24} /></Link>
                </>
              )}
              <Link to="/profile" className="text-slate-600"><User size={24} /></Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4 w-full md:w-auto">
              <button 
                onClick={handleLogout} 
                className="text-red-500 font-bold text-sm bg-red-50 px-6 py-2 rounded-2xl md:bg-transparent md:px-0"
              >
                Logout
              </button>
              <span className="hidden md:inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;