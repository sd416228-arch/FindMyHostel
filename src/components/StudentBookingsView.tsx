import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  BookmarkCheck,
  Building,
  Clock,
  MapPin,
  AlertCircle,
  XCircle,
  CheckCircle2,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { BookingStatus, ReservationStatus } from '../types';

interface StudentBookingsViewProps {
  onNavigateHostels: () => void;
  onSelectHostel: (hostelId: string) => void;
  initialTab?: 'bookings' | 'reservations';
}

export const StudentBookingsView: React.FC<StudentBookingsViewProps> = ({
  onNavigateHostels,
  onSelectHostel,
  initialTab = 'bookings',
}) => {
  const {
    currentUser,
    getUserBookings,
    getUserReservations,
    cancelBooking,
    hostels,
    rooms,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookings' | 'reservations'>(initialTab);

  const bookings = getUserBookings(currentUser?.id);
  const reservations = getUserReservations(currentUser?.id);

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
      addToast('Booking cancelled', 'info');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Confirmed</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending Approval</span>;
      case 'checked_in':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Checked In</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Cancelled</span>;
    }
  };

  const getReservationBadge = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Visit Scheduled</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Pending Review</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Declined</span>;
    }
  };

  const confirmedBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A365D] via-[#0F2942] to-[#0d3464] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student Dashboard • {currentUser?.username || currentUser?.email || 'Student Account'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Student Dashboard & Portal
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Manage your hostel room reservations, scheduled physical visits, and student stay requests.
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex bg-white/10 p-1.5 rounded-xl backdrop-blur-sm border border-white/20">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-blue-600" />
              <span>Room Bookings ({bookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'reservations' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span>Hostel Visits ({reservations.length})</span>
            </button>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <p className="text-slate-300 text-[11px] font-medium">Total Bookings</p>
            <p className="text-xl font-bold text-white mt-0.5">{bookings.length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <p className="text-slate-300 text-[11px] font-medium">Confirmed Stays</p>
            <p className="text-xl font-bold text-emerald-300 mt-0.5">{confirmedBookingsCount}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <p className="text-slate-300 text-[11px] font-medium">Visit Inquiries</p>
            <p className="text-xl font-bold text-amber-300 mt-0.5">{reservations.length}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-[11px] font-medium">Account Status</p>
              <p className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </p>
            </div>
            <button
              onClick={onNavigateHostels}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold transition-all"
            >
              + Find Hostel
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No hostel bookings yet</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Explore student accommodations in Kathmandu and Pokhara to reserve your room.
              </p>
              <button
                onClick={onNavigateHostels}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Browse Hostels</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bookings.map((b) => {
                const hostel = hostels.find((h) => h.id === b.hostel_id);
                const room = rooms.find((r) => r.id === b.room_id);

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(b.status)}
                        <span className="text-xs text-slate-400">
                          Ref: #{b.id.slice(-6)}
                        </span>
                      </div>

                      <h3
                        onClick={() => hostel && onSelectHostel(hostel.id)}
                        className="text-lg font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        {hostel?.name || 'Partner Hostel'}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{hostel?.location}, {hostel?.city}</span>
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                        <span className="font-semibold text-slate-800">
                          Room: {room?.room_number || 'Standard'} ({room?.room_type || 'Bed'})
                        </span>
                        <span>
                          Starting Date: <strong className="text-slate-800">{b.starting_date}</strong>
                        </span>
                        <span>
                          Duration: <strong className="text-slate-800">{Math.round(b.total_nights / 30)} Months</strong>
                        </span>
                      </div>

                      {b.special_requests && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                          Note: "{b.special_requests}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <span className="text-xs text-slate-400 block font-medium">Total Booking Value</span>
                        <div className="text-lg font-black text-slate-900">
                          NPR {b.total_price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => hostel && onSelectHostel(hostel.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
                        >
                          View Hostel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Reservations / Inquiries Tab */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                <BookmarkCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No physical visit requests</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Schedule free visits to inspect rooms and meet wardens before committing.
              </p>
              <button
                onClick={onNavigateHostels}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Find Hostels to Visit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reservations.map((res) => {
                const hostel = hostels.find((h) => h.id === res.hostel_id);

                return (
                  <div
                    key={res.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getReservationBadge(res.status)}
                        <span className="text-xs text-slate-400">
                          Sent: {new Date(res.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h3
                        onClick={() => hostel && onSelectHostel(hostel.id)}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                      >
                        {hostel?.name || 'Hostel Visit'}
                      </h3>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                        "{res.message}"
                      </p>

                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span>Contact: <strong>{res.guest_name}</strong></span>
                        <span>Phone: <strong>+977 {res.guest_phone}</strong></span>
                      </div>
                    </div>

                    <div>
                      {hostel && (
                        <button
                          onClick={() => onSelectHostel(hostel.id)}
                          className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
