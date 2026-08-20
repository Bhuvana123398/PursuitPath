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
      {/* Container: Stacks on mobile (col), Row on laptop (md:flex-row) */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* LOGO SECTION */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Briefcase size={22} />
            <span>PursuitPath</span>
          </Link>
          
          {/* Mobile Name Tag (Visible only on phone) */}
          {user && (
            <span className="md:hidden bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
              {user.name}
            </span>
          )}
        </div>

        {/* NAVIGATION & ACTIONS */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {user ? (
            <>
              {/* Navigation Icons Row */}
              <div className="flex items-center justify-center gap-6 md:gap-8 border-b md:border-none pb-2 md:pb-0 w-full md:w-auto">
                {user.role === 'recruiter' ? (
                  <>
                    <Link title="Stats" to="/dashboard" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1">
                      <BarChart3 size={20} />
                      <span className="hidden lg:inline text-sm font-medium">Stats</span>
                    </Link>
                    <Link title="Post Job" to="/post-job" className="text-indigo-600 flex items-center gap-1 font-bold">
                      <PlusCircle size={20} />
                      <span className="hidden lg:inline text-sm">Post a Job</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link title="Search" to="/" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1">
                      <Search size={20} />
                      <span className="hidden lg:inline text-sm font-medium">Search</span>
                    </Link>
                    <Link title="Board" to="/dashboard" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1">
                      <Layout size={20} />
                      <span className="hidden lg:inline text-sm font-medium">Board</span>
                    </Link>
                  </>
                )}
                <Link title="Profile" to="/profile" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1">
                  <User size={20} />
                  <span className="hidden lg:inline text-sm font-medium">Profile</span>
                </Link>
              </div>

              {/* Logout & Role Badge Row */}
              <div className="flex items-center justify-center gap-4 w-full md:w-auto">
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-1 text-red-500 font-bold text-sm bg-red-50 md:bg-transparent px-4 py-2 md:px-0 rounded-xl hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
                
                {/* Role Badge (Visible on Laptop) */}
                <span className="hidden md:inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-200">
                  {user.role}
                </span>
              </div>
            </>
          ) : (
            /* Logged Out View */
            <div className="flex items-center gap-4">
              <Link to="/login" className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;