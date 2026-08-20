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
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
        <Briefcase size={24} />
        <span>PursuitPath</span>
      </Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            {/* --- RECRUITER LINKS --- */}
            {user.role === 'recruiter' ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-medium">
                  <BarChart3 size={18} /> Recruitment Stats
                </Link>
                <Link to="/post-job" className="bg-indigo-600 text-white px-5 py-2 rounded-xl flex items-center gap-1 font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  <PlusCircle size={18} /> Post a Job
                </Link>
              </>
            ) : (
              /* --- CANDIDATE LINKS --- */
              <>
                <Link to="/" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-medium">
                  <Search size={18} /> Search Jobs
                </Link>
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-medium">
                  <Layout size={18} /> My Pursuit Board
                </Link>
                <Link to="/profile" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1 font-medium">
                  <User size={18} /> My Profile
                </Link>
              </>
            )}
            <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-600 flex items-center gap-1 font-medium">
              <LogOut size={18} /> Logout
            </button>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-200">
              {user.role}: {user.name}
            </span>
          </>
        ) : (
          /* --- LOGGED OUT --- */
          <>
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium">Browse Jobs</Link>
            <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;