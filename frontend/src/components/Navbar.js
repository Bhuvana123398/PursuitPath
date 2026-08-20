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

        <div className="flex items-center justify-center gap-4 md:gap-8">
          {user ? (
            <>
              <Link to="/" className="p-2 text-slate-600 hover:text-indigo-600 flex items-center gap-1.5">
                <Search size={20} />
                <span className="hidden md:inline font-medium">Search</span>
              </Link>
              
              <Link to="/dashboard" className="p-2 text-slate-600 hover:text-indigo-600 flex items-center gap-1.5">
                <Layout size={20} />
                <span className="hidden md:inline font-medium">Board</span>
              </Link>

              {/* Logout button needs to be visible on mobile */}
              <button onClick={handleLogout} className="text-red-500 font-bold text-sm ml-2">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold">
              Login
            </Link>
          )}
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