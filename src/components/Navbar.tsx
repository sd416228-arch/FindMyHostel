import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  CalendarCheck,
  BookmarkCheck,
  User,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAuth: (mode: 'student-login' | 'student-register' | 'owner-login' | 'owner-register' | 'admin-login') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAuth }) => {
  const { currentUser, logout } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isOwner = currentUser?.role === 'owner';
  const isAdmin = currentUser?.role === 'admin';

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bg-gradient-to-r from-[#1a56db] to-[#0f3a8e] text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Brand Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 text-white font-extrabold text-xl tracking-tight focus:outline-none group"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors shadow-sm">
              <MapPin className="w-5 h-5 text-white" />
            </span>
            <span className="text-xl font-black">FindMyHostel</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'home' ? 'bg-white/20 text-white' : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('hostels')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                currentTab === 'hostels' ? 'bg-white/20 text-white' : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              Hostels
            </button>

            {/* Role-specific Links */}
            {currentUser && !isOwner && !isAdmin && (
              <>
                <button
                  onClick={() => navigateTo('student-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    currentTab === 'student-dashboard' || currentTab === 'bookings'
                      ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-300" />
                  <span>Student Dashboard</span>
                </button>
                <button
                  onClick={() => navigateTo('bookings')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    currentTab === 'bookings' ? 'bg-white/20 text-white' : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>My Bookings</span>
                </button>
                <button
                  onClick={() => navigateTo('reservations')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    currentTab === 'reservations' ? 'bg-white/20 text-white' : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Visits</span>
                </button>
              </>
            )}

            {isOwner && (
              <button
                onClick={() => navigateTo('owner-dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentTab === 'owner-dashboard'
                    ? 'bg-amber-500/30 text-white shadow-sm ring-1 ring-amber-300/40'
                    : 'text-white/85 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-300" />
                <span>Owner Dashboard</span>
              </button>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={() => navigateTo('admin-dashboard')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    currentTab === 'admin-dashboard'
                      ? 'bg-purple-800/80 text-white shadow-sm ring-1 ring-purple-300/40'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-purple-300" />
                  <span>Admin Dashboard</span>
                </button>
                <button
                  onClick={() => navigateTo('owner-dashboard')}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-white/75 hover:text-white hover:bg-white/10"
                >
                  Owner View
                </button>
              </>
            )}
          </div>

          {/* User Auth / Profile Actions */}
          <div className="hidden md:flex items-center gap-2">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 transition-all text-sm font-semibold border border-white/20"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xs uppercase">
                    {currentUser.username ? currentUser.username[0] : currentUser.email[0]}
                  </div>
                  <span className="max-w-[140px] truncate">{currentUser.email}</span>
                  <ChevronDown className="w-4 h-4 opacity-75" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 text-slate-800 border border-slate-100 animate-in fade-in slide-in-from-top-1">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {currentUser.role}
                      </span>
                    </div>

                    {!isOwner && !isAdmin && (
                      <>
                        <button
                          onClick={() => navigateTo('bookings')}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <CalendarCheck className="w-4 h-4 text-slate-400" />
                          <span>My Bookings</span>
                        </button>
                        <button
                          onClick={() => navigateTo('reservations')}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <BookmarkCheck className="w-4 h-4 text-slate-400" />
                          <span>My Reservations</span>
                        </button>
                      </>
                    )}

                    {isOwner && (
                      <button
                        onClick={() => navigateTo('owner-dashboard')}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        <span>Hostel Dashboard</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => navigateTo('admin-dashboard')}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-600" />
                        <span>Website Management</span>
                      </button>
                    )}

                    <button
                      onClick={() => navigateTo('profile')}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile & Settings</span>
                    </button>

                    <div className="my-1 border-t border-slate-100"></div>

                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('student-login')}
                  className="px-4 py-2 rounded-lg text-sm font-bold border border-white/40 hover:bg-white/10 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('student-register')}
                  className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-[#1a56db] hover:bg-slate-100 transition-all shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/15 space-y-2 animate-in fade-in">
            <button
              onClick={() => navigateTo('home')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/10"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('hostels')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/10"
            >
              Browse Hostels
            </button>

            {currentUser && !isOwner && !isAdmin && (
              <>
                <button
                  onClick={() => navigateTo('student-dashboard')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-500/20 text-emerald-200 flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-emerald-300" /> Student Dashboard
                </button>
                <button
                  onClick={() => navigateTo('bookings')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 flex items-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4" /> My Bookings
                </button>
                <button
                  onClick={() => navigateTo('reservations')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 flex items-center gap-2"
                >
                  <BookmarkCheck className="w-4 h-4" /> My Reservations
                </button>
              </>
            )}

            {isOwner && (
              <button
                onClick={() => navigateTo('owner-dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-amber-500/20 text-amber-200 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Owner Portal
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-purple-500/20 text-purple-200 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" /> Admin Console
              </button>
            )}

            {currentUser ? (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <button
                  onClick={() => navigateTo('profile')}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Profile ({currentUser.email})
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-300 hover:bg-red-500/20 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('student-login');
                  }}
                  className="flex-1 py-2 rounded-lg text-sm font-bold border border-white/40 text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('student-register');
                  }}
                  className="flex-1 py-2 rounded-lg text-sm font-bold bg-white text-blue-700 text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
