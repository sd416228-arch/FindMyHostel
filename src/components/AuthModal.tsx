import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Building, Shield, Lock, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

export type AuthMode = 'student-login' | 'student-register' | 'owner-login' | 'owner-register' | 'admin-login';

interface AuthModalProps {
  mode: AuthMode | null;
  onClose: () => void;
  onSwitchMode: (mode: AuthMode) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onSwitchMode }) => {
  const { login, register, switchRole, addToast } = useApp();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('Password123'); // Preset for demo ease
  const [error, setError] = useState<string | null>(null);

  if (!mode) return null;

  const isLogin = mode === 'student-login' || mode === 'owner-login' || mode === 'admin-login';
  const targetRole: UserRole = mode.includes('owner') ? 'owner' : mode.includes('admin') ? 'admin' : 'student';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      const res = login(email.trim(), targetRole);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Login failed. Please check your credentials.');
      }
    } else {
      if (!email.trim() || !username.trim()) {
        setError('Please fill in all required fields');
        return;
      }
      const res = register({
        email: email.trim(),
        username: username.trim(),
        role: targetRole,
        phone: phone.trim() || undefined,
      });
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Registration failed.');
      }
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    switchRole(role);
    addToast(`Signed in as demo ${role}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a56db] to-[#0f3a8e] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
              {targetRole === 'owner' ? (
                <Building className="w-5 h-5 text-amber-300" />
              ) : targetRole === 'admin' ? (
                <Shield className="w-5 h-5 text-purple-300" />
              ) : (
                <User className="w-5 h-5 text-emerald-300" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">
                {mode === 'student-login' && 'Student Login'}
                {mode === 'student-register' && 'Create Student Account'}
                {mode === 'owner-login' && 'Hostel Owner Login'}
                {mode === 'owner-register' && 'Register as Hostel Owner'}
                {mode === 'admin-login' && 'Portal Administration Login'}
              </h3>
              <p className="text-xs text-white/80">
                {targetRole === 'student' && 'Access student bookings & saved hostels'}
                {targetRole === 'owner' && 'Manage your listings, rooms & inquiries'}
                {targetRole === 'admin' && 'Verify hostels and moderate platform'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Login Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            ⚡ Quick Demo 1-Click Access:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('student')}
              className="text-xs px-2.5 py-1 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium transition-colors flex items-center gap-1"
            >
              <User className="w-3 h-3" />
              <span>Student Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('owner')}
              className="text-xs px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium transition-colors flex items-center gap-1"
            >
              <Building className="w-3 h-3" />
              <span>Owner Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="text-xs px-2.5 py-1 rounded-md bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium transition-colors flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name / Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder={targetRole === 'owner' ? 'e.g., Rajesh Sharma' : 'e.g., Aayush KC'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder={
                  targetRole === 'owner'
                    ? 'owner@example.com'
                    : targetRole === 'admin'
                    ? 'admin@findmyhostel.com'
                    : 'student@example.com'
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone (Nepal)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#1a56db] hover:bg-[#0f3a8e] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              {isLogin ? 'Sign In to Account' : 'Complete Registration'}
            </span>
          </button>
        </form>

        {/* Footer switch */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center text-xs text-slate-600">
          {targetRole === 'student' && (
            isLogin ? (
              <p>
                Don't have a student account?{' '}
                <button
                  onClick={() => onSwitchMode('student-register')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => onSwitchMode('student-login')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Log in
                </button>
              </p>
            )
          )}

          {targetRole === 'owner' && (
            isLogin ? (
              <p>
                Want to list a new hostel?{' '}
                <button
                  onClick={() => onSwitchMode('owner-register')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Register as Owner
                </button>
              </p>
            ) : (
              <p>
                Already registered owner?{' '}
                <button
                  onClick={() => onSwitchMode('owner-login')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Owner Sign In
                </button>
              </p>
            )
          )}

          {targetRole === 'admin' && (
            <p className="text-slate-400">
              FindMyHostel administrative portal access.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
