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
    <nav className="bg-white border-b border-slate-200 px-4 py-4 shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link 
            to={user?.role === 'recruiter' ? "/dashboard" : "/"} 
            className="flex items-center gap-2 text-indigo-600 font-bold text-xl"
          >
            <Briefcase size={22} />
            <span>PursuitPath</span>
          </Link>
          {user && (
            <span className="md:hidden bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              {user.name}
            </span>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {user ? (
            <>
              <div className="flex items-center justify-center gap-5 md:gap-8 border-b md:border-none pb-2 md:pb-0 w-full md:w-auto">
                
                {user.role === 'recruiter' ? (
                  <>
                    <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                      <BarChart3 size={20} />
                      <span className="hidden sm:inline font-medium">Recruitment Stats</span>
                    </Link>
                    <Link to="/post-job" className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 font-bold transition-colors">
                      <PlusCircle size={20} />
                      <span className="hidden sm:inline">Post a Job</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                      <Search size={20} />
                      <span className="hidden sm:inline font-medium">Search Jobs</span>
                    </Link>
                    <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                      <Layout size={20} />
                      <span className="hidden sm:inline font-medium">My Board</span>
                    </Link>
                    {/* Profile link ONLY for candidates */}
                    <Link to="/profile" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
                      <User size={20} />
                      <span className="hidden sm:inline font-medium">Profile</span>
                    </Link>
                  </>
                )}
              </div>

              {/* LOGOUT & DESKTOP BADGE */}
              <div className="flex items-center justify-center gap-4 w-full md:w-auto">
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 text-red-500 font-bold text-sm bg-red-50 md:bg-transparent px-4 py-2 md:px-0 md:py-0 rounded-xl hover:text-red-600 transition-all"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
                
                <span className="hidden md:inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md shadow-indigo-100">
                  {user.role}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              {window.location.pathname !== '/login' && (
                <Link to="/login" className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;