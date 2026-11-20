import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, LogOut, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - MedGuide */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Med<span className="text-teal-600">Guide</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text.xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-medium text-xs">
                Prescription & Health Assistant
              </span>
            </div>
          </Link>

          {/* User Section / Actions */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/upload"
                className="hidden md:inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Upload Prescription
              </Link>

              <Link
                to="/profile"
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs border border-teal-200">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <span className="hidden sm:inline-block text-sm font-semibold text-slate-800">{user?.name || 'Patient'}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
