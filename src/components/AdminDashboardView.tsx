import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Building,
  Users,
  CheckCircle2,
  XCircle,
  Star,
  Trash2,
  ShieldCheck,
  Eye,
  MessageSquare,
  MapPin,
} from 'lucide-react';
import { UserRole } from '../types';

interface AdminDashboardViewProps {
  onSelectHostel: (hostelId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onSelectHostel,
}) => {
  const {
    hostels,
    users,
    bookings,
    testimonials,
    toggleHostelVerified,
    toggleHostelStatus,
    deleteHostel,
    toggleUserVerified,
    updateUserRole,
    deleteUser,
    toggleTestimonial,
    deleteTestimonial,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hostels' | 'users' | 'testimonials'>('hostels');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>FindMyHostel Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Platform Master Admin
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Supervise hostel safety certifications, verify legitimate property owners, and audit student bookings.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Platform Hostels</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{hostels.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {hostels.filter((h) => h.is_verified).length} verified inspected
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Accounts</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{users.length}</div>
          <span className="text-[11px] text-slate-500 font-semibold">
            {users.filter((u) => u.role === 'student').length} students, {users.filter((u) => u.role === 'owner').length} owners
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Bookings</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{bookings.length}</div>
          <span className="text-[11px] text-slate-400">Processed stay contracts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Homepage Testimonials</span>
            <MessageSquare className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{testimonials.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold">
            {testimonials.filter((t) => t.is_active).length} published live
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('hostels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hostels'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Hostel Verification & Moderation ({hostels.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          User Accounts Directory ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'testimonials'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Student Testimonials ({testimonials.length})
        </button>
      </div>

      {/* Tab: Hostels */}
      {activeTab === 'hostels' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Hostel Listings Verification</h3>
            <span className="text-xs text-slate-500">
              Grant "Verified" badges to hostels matching Nepal safety standards.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Hostel Name</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Rent / Mo</th>
                  <th className="p-3">Owner Contact</th>
                  <th className="p-3">Verification Badge</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hostels.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{h.name}</div>
                      <div className="text-[10px] text-slate-400">Rating: {h.rating} ({h.reviews_count} reviews)</div>
                    </td>
                    <td className="p-3">
                      <div>{h.location}</div>
                      <div className="text-[10px] text-slate-400">{h.city}</div>
                    </td>
                    <td className="p-3 font-semibold text-slate-900">
                      NPR {h.monthly_rent.toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div>{h.phone}</div>
                      <div className="text-[10px] text-slate-400">{h.email}</div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          toggleHostelVerified(h.id);
                          addToast(h.is_verified ? 'Hostel unverified' : 'Hostel verified!', 'info');
                        }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          h.is_verified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{h.is_verified ? 'Verified' : 'Click to Verify'}</span>
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleHostelStatus(h.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          h.is_active ? 'bg-blue-50 text-blue-700' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {h.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectHostel(h.id)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg"
                          title="View Hostel Page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${h.name}?`)) {
                              deleteHostel(h.id);
                              addToast('Hostel removed', 'info');
                            }
                          }}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"
                          title="Delete Hostel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Registered Users & Roles</h3>
            <span className="text-xs text-slate-500">Manage user personas and permissions.</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Verified Phone</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">
                      {u.username || 'Unnamed'}
                    </td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => {
                          updateUserRole(u.id, e.target.value as UserRole);
                          addToast(`Role changed to ${e.target.value}`, 'success');
                        }}
                        className={`px-2 py-1 rounded text-[11px] font-bold outline-none cursor-pointer ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'owner'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <option value="student">Student</option>
                        <option value="owner">Hostel Owner</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleUserVerified(u.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {u.is_verified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete user ${u.email}?`)) {
                            deleteUser(u.id);
                            addToast('User deleted', 'info');
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Testimonials */}
      {activeTab === 'testimonials' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Student Testimonials Moderation</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div key={t.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{t.user_name}</span>
                    <span className="text-xs text-slate-500">({t.role})</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic">"{t.content}"</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <button
                    onClick={() => {
                      toggleTestimonial(t.id);
                      addToast(t.is_active ? 'Hidden from homepage' : 'Shown on homepage', 'info');
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      t.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {t.is_active ? 'Visible on Home' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => {
                      deleteTestimonial(t.id);
                      addToast('Testimonial removed', 'info');
                    }}
                    className="p-1 hover:bg-red-50 text-red-500 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
