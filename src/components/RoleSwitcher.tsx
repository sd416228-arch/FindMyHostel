import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, User, Building, LogOut, Check } from 'lucide-react';
import { UserRole } from '../types';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole, currentTab, setCurrentTab, logout } = useApp();

  const handleRoleClick = (role: UserRole) => {
    // Switches persona and instantly redirects to corresponding dashboard view
    switchRole(role, true);
    if (role === 'student') {
      setCurrentTab('student-dashboard');
    } else if (role === 'owner') {
      setCurrentTab('owner-dashboard');
    } else if (role === 'admin') {
      setCurrentTab('admin-dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStudentActive = currentUser?.role === 'student';
  const isOwnerActive = currentUser?.role === 'owner';
  const isAdminActive = currentUser?.role === 'admin';

  const isStudentTabOpen = currentTab === 'student-dashboard' || currentTab === 'bookings' || currentTab === 'reservations';
  const isOwnerTabOpen = currentTab === 'owner-dashboard';
  const isAdminTabOpen = currentTab === 'admin-dashboard';

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-inner">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
          Demo Persona & Dashboard:
        </span>
        <div className="flex items-center gap-1.5 bg-slate-800/90 px-2.5 py-1 rounded-full text-slate-200 border border-slate-700/60">
          {currentUser ? (
            <>
              <span
                className={`w-2 h-2 rounded-full ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-400 animate-pulse'
                    : currentUser.role === 'owner'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="font-medium">{currentUser.username || currentUser.email}</span>
              <span
                className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  currentUser.role === 'admin'
                    ? 'bg-purple-900/60 text-purple-300'
                    : currentUser.role === 'owner'
                    ? 'bg-amber-900/60 text-amber-300'
                    : 'bg-emerald-900/60 text-emerald-300'
                }`}
              >
                {currentUser.role}
              </span>
            </>
          ) : (
            <span className="text-slate-400 italic">Guest (Not logged in)</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-400 font-medium mr-1 hidden md:inline text-[11px]">
          Click to switch dashboard:
        </span>

        {/* Student button */}
        <button
          onClick={() => handleRoleClick('student')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
            isStudentActive
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50 shadow-emerald-900/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
          title="Switch to Student Persona & Open Student Dashboard"
        >
          <User className="w-3.5 h-3.5 text-emerald-300" />
          <span>Student</span>
          {isStudentTabOpen && isStudentActive && (
            <span className="ml-1 text-[9px] bg-emerald-800/80 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> Dashboard
            </span>
          )}
        </button>

        {/* Hostel Owner button */}
        <button
          onClick={() => handleRoleClick('owner')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
            isOwnerActive
              ? 'bg-blue-600 text-white ring-2 ring-blue-400/50 shadow-blue-900/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
          title="Switch to Hostel Owner Persona & Open Owner Dashboard"
        >
          <Building className="w-3.5 h-3.5 text-amber-300" />
          <span>Hostel Owner</span>
          {isOwnerTabOpen && isOwnerActive && (
            <span className="ml-1 text-[9px] bg-blue-800/80 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-blue-100 flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> Dashboard
            </span>
          )}
        </button>

        {/* Website Admin button */}
        <button
          onClick={() => handleRoleClick('admin')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
            isAdminActive
              ? 'bg-purple-600 text-white ring-2 ring-purple-400/50 shadow-purple-900/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
          }`}
          title="Switch to Website Admin Persona & Open Admin Dashboard"
        >
          <Shield className="w-3.5 h-3.5 text-purple-300" />
          <span>Admin</span>
          {isAdminTabOpen && isAdminActive && (
            <span className="ml-1 text-[9px] bg-purple-800/80 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-purple-100 flex items-center gap-0.5">
              <Check className="w-2.5 h-2.5" /> Dashboard
            </span>
          )}
        </button>

        {currentUser && (
          <button
            onClick={logout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-red-950/50 text-red-400 hover:text-red-300 transition-all ml-1 border border-red-900/40 text-xs"
            title="Log Out to Guest"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        )}
      </div>
    </div>
  );
};
