import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Briefcase, PlusCircle, Search, Layout, User, BarChart3 } from 'lucide-react';

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
        
        {/* Logo - Clicking this takes Candidates to Search, Recruiters to Stats */}
        <Link to={user?.role === 'recruiter' ? "/dashboard" : "/"} className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <Briefcase size={22} />
          <span>PursuitPath</span>
        </Link>

        {/* Dynamic Buttons based on Role */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <>
              {user.role === 'recruiter' ? (
                /* RECRUITER ONLY ICONS */
                <>
                  <Link title="Recruitment Stats" to="/dashboard" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                    <BarChart3 size={20}/>
                  </Link>
                  <Link title="Post a New Job" to="/post-job" className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all flex items-center gap-1 font-bold border border-indigo-100">
                    <PlusCircle size={20}/>
                    <span className="hidden sm:inline text-xs uppercase tracking-wider">Post Job</span>
                  </Link>
                </>
              ) : (
                /* CANDIDATE ONLY ICONS */
                <>
                  <Link title="Search Jobs" to="/" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                    <Search size={20}/>
                  </Link>
                  <Link title="My Pursuit Board" to="/dashboard" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                    <Layout size={20}/>
                  </Link>
                </>
              )}

              {/* Shared Profile Icon */}
              <Link title="Profile" to="/profile" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors">
                <User size={20}/>
              </Link>

              <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>

              {/* Logout button */}
              <button onClick={handleLogout} className="text-red-500 font-bold text-sm px-3 py-1 hover:bg-red-50 rounded-lg transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;