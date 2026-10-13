import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hostel, Room, RoomType, BookingStatus, ReservationStatus } from '../types';
import {
  Building,
  Plus,
  BedDouble,
  Users,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Edit,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  MapPin,
  X,
} from 'lucide-react';

interface OwnerDashboardViewProps {
  onSelectHostel: (hostelId: string) => void;
}

export const OwnerDashboardView: React.FC<OwnerDashboardViewProps> = ({
  onSelectHostel,
}) => {
  const {
    currentUser,
    hostels,
    rooms,
    bookings,
    reservations,
    createHostel,
    updateHostel,
    deleteHostel,
    toggleHostelStatus,
    createRoom,
    toggleRoomAvailability,
    deleteRoom,
    updateBookingStatus,
    updateReservationStatus,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'hostels' | 'rooms' | 'bookings' | 'inquiries'>('hostels');

  // Filter only owner's properties
  const myHostels = hostels.filter((h) => h.owner_id === currentUser?.id || currentUser?.role === 'admin');
  const myHostelIds = myHostels.map((h) => h.id);
  const myRooms = rooms.filter((r) => myHostelIds.includes(r.hostel_id));
  const myBookings = bookings.filter((b) => myHostelIds.includes(b.hostel_id));
  const myReservations = reservations.filter((res) => myHostelIds.includes(res.hostel_id));

  // Add Hostel Modal State
  const [showAddHostel, setShowAddHostel] = useState(false);
  const [newHostelName, setNewHostelName] = useState('');
  const [newHostelLocation, setNewHostelLocation] = useState('New Baneshwor');
  const [newHostelCity, setNewHostelCity] = useState('Kathmandu');
  const [newHostelRent, setNewHostelRent] = useState(12000);
  const [newHostelPhone, setNewHostelPhone] = useState('9841504206');
  const [newHostelDesc, setNewHostelDesc] = useState('Spacious student accommodation with clean mess food, 24/7 security, study hall, and fast WiFi.');
  const [newHostelWifi, setNewHostelWifi] = useState(true);
  const [newHostelLaundry, setNewHostelLaundry] = useState(true);
  const [newHostelKitchen, setNewHostelKitchen] = useState(true);
  const [newHostelParking, setNewHostelParking] = useState(true);

  // Add Room Modal State
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [selectedHostelId, setSelectedHostelId] = useState<string>(myHostels[0]?.id || '');
  const [newRoomNumber, setNewRoomNumber] = useState('201');
  const [newRoomType, setNewRoomType] = useState<RoomType>('double');
  const [newRoomRent, setNewRoomRent] = useState(11500);
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomHasAC, setNewRoomHasAC] = useState(false);
  const [newRoomHasBath, setNewRoomHasBath] = useState(true);
  const [newRoomHasBalcony, setNewRoomHasBalcony] = useState(false);

  const handleCreateHostelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    createHostel({
      owner_id: currentUser.id,
      owner_email: currentUser.email,
      name: newHostelName.trim(),
      description: newHostelDesc.trim(),
      location: newHostelLocation.trim(),
      city: newHostelCity,
      country: 'Nepal',
      phone: newHostelPhone.trim(),
      email: currentUser.email,
      monthly_rent: Number(newHostelRent),
      wifi: newHostelWifi,
      laundry: newHostelLaundry,
      kitchen: newHostelKitchen,
      parking: newHostelParking,
      gym: false,
      is_active: true,
      is_verified: false,
      cover_image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    });

    setShowAddHostel(false);
    setNewHostelName('');
  };

  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHostelId) {
      addToast('Please select a hostel first', 'warning');
      return;
    }

    createRoom({
      hostel_id: selectedHostelId,
      room_number: newRoomNumber.trim(),
      room_type: newRoomType,
      capacity: Number(newRoomCapacity),
      monthly_rent: Number(newRoomRent),
      description: `${newRoomType.toUpperCase()} room with student study desk and cupboards.`,
      has_ac: newRoomHasAC,
      has_bathroom: newRoomHasBath,
      has_tv: false,
      has_balcony: newRoomHasBalcony,
      is_available: true,
    });

    setShowAddRoom(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
            <Building className="w-3.5 h-3.5" />
            <span>Hostel Management Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser?.username || 'Hostel Owner'}
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Manage your properties, inspect room occupancy, and process incoming student reservations.
          </p>
        </div>

        <div className="flex gap-2.5">
          <button
            onClick={() => setShowAddHostel(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>List New Hostel</span>
          </button>
          <button
            onClick={() => {
              if (myHostels.length > 0) {
                setSelectedHostelId(myHostels[0].id);
                setShowAddRoom(true);
              } else {
                addToast('Please create a hostel before adding rooms', 'warning');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <BedDouble className="w-4 h-4" />
            <span>Add Room</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">My Hostels</span>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myHostels.length}</div>
          <span className="text-[11px] text-slate-400">Total properties</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Rooms</span>
            <BedDouble className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myRooms.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {myRooms.filter((r) => r.is_available).length} beds available
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Bookings</span>
            <CalendarCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myBookings.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold">
            {myBookings.filter((b) => b.status === 'pending').length} pending approval
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Visit Inquiries</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myReservations.length}</div>
          <span className="text-[11px] text-purple-600 font-semibold">Prospective students</span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'hostels', label: `My Hostels (${myHostels.length})` },
          { id: 'rooms', label: `Rooms & Beds (${myRooms.length})` },
          { id: 'bookings', label: `Student Bookings (${myBookings.length})` },
          { id: 'inquiries', label: `Visit Requests (${myReservations.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#1a56db] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: My Hostels */}
      {activeTab === 'hostels' && (
        <div className="space-y-4">
          {myHostels.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900">No hostels listed yet</h3>
              <button
                onClick={() => setShowAddHostel(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Add Your First Hostel
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myHostels.map((hostel) => (
                <div
                  key={hostel.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-lg">{hostel.name}</h3>
                        {hostel.is_verified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{hostel.location}, {hostel.city}</span>
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        hostel.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {hostel.is_active ? 'Active' : 'Unpublished'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{hostel.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Monthly Rent</span>
                      <span className="font-black text-slate-900">
                        NPR {hostel.monthly_rent.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleHostelStatus(hostel.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                      >
                        {hostel.is_active ? 'Pause Listing' : 'Activate'}
                      </button>
                      <button
                        onClick={() => onSelectHostel(hostel.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold"
                      >
                        Public Page
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Rooms Management */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Rooms & Beds Catalog</h3>
              <p className="text-xs text-slate-500">Toggle room vacancy and set monthly rates.</p>
            </div>
            <button
              onClick={() => setShowAddRoom(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              + Add Room
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">Room #</th>
                  <th className="p-3">Hostel</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Rent / Mo</th>
                  <th className="p-3">Features</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myRooms.map((room) => {
                  const h = hostels.find((item) => item.id === room.hostel_id);
                  return (
                    <tr key={room.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">#{room.room_number}</td>
                      <td className="p-3 truncate max-w-[140px]">{h?.name}</td>
                      <td className="p-3 uppercase font-semibold text-blue-700">{room.room_type}</td>
                      <td className="p-3">{room.capacity} Seater</td>
                      <td className="p-3 font-bold text-slate-900">NPR {room.monthly_rent.toLocaleString()}</td>
                      <td className="p-3">
                        {room.has_bathroom && <span className="mr-1">🚿 Bath</span>}
                        {room.has_ac && <span className="mr-1">❄️ AC</span>}
                        {room.has_balcony && <span>🌅 Balcony</span>}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleRoomAvailability(room.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            room.is_available
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {room.is_available ? 'Vacant Bed' : 'Occupied'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteRoom(room.id)}
                          className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                          title="Delete Room"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Student Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Student Booking Applications</h3>
          {myBookings.length === 0 ? (
            <p className="text-xs text-slate-500">No booking applications received yet.</p>
          ) : (
            <div className="space-y-3">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{b.guest_name}</span>
                      <span className="text-xs text-slate-500">({b.guest_phone})</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Move-in Date: <strong>{b.starting_date}</strong> • Total Value: NPR {b.total_price.toLocaleString()}
                    </p>
                    {b.special_requests && (
                      <p className="text-xs text-slate-500 italic">"{b.special_requests}"</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            updateBookingStatus(b.id, 'confirmed');
                            addToast('Booking accepted & confirmed', 'success');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            updateBookingStatus(b.id, 'cancelled');
                            addToast('Booking declined', 'info');
                          }}
                          className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          updateBookingStatus(b.id, 'checked_in');
                          addToast('Student checked in', 'success');
                        }}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                      >
                        Check-in Student
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Visit Inquiries */}
      {activeTab === 'inquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Physical Visit Inquiries</h3>
          {myReservations.length === 0 ? (
            <p className="text-xs text-slate-500">No visit requests received yet.</p>
          ) : (
            <div className="space-y-3">
              {myReservations.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{res.guest_name}</span>
                      <span className="text-xs text-slate-500">({res.guest_phone})</span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {res.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">"{res.message}"</p>
                  </div>

                  <div className="flex gap-2">
                    {res.status === 'pending' && (
                      <>
                        <button
                          onClick={() => {
                            updateReservationStatus(res.id, 'confirmed');
                            addToast('Visit confirmed', 'success');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                        >
                          Accept Visit
                        </button>
                        <button
                          onClick={() => {
                            updateReservationStatus(res.id, 'cancelled');
                            addToast('Visit cancelled', 'info');
                          }}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Hostel Modal */}
      {showAddHostel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-[#1a56db] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">List a New Student Hostel</h3>
              <button onClick={() => setShowAddHostel(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHostelSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Hostel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sagarmatha Boys Hostel"
                  value={newHostelName}
                  onChange={(e) => setNewHostelName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <select
                    value={newHostelCity}
                    onChange={(e) => setNewHostelCity(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Chitwan">Chitwan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area / Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Baneshwor"
                    value={newHostelLocation}
                    onChange={(e) => setNewHostelLocation(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Starting Rent (NPR/mo)</label>
                  <input
                    type="number"
                    required
                    value={newHostelRent}
                    onChange={(e) => setNewHostelRent(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Owner Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={newHostelPhone}
                    onChange={(e) => setNewHostelPhone(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newHostelDesc}
                  onChange={(e) => setNewHostelDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                />
              </div>

              <div className="space-y-1 pt-2">
                <span className="block font-bold text-slate-700">Facilities Available:</span>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHostelWifi}
                      onChange={(e) => setNewHostelWifi(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>High-Speed Wi-Fi</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHostelKitchen}
                      onChange={(e) => setNewHostelKitchen(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Mess / 4 Times Food</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHostelLaundry}
                      onChange={(e) => setNewHostelLaundry(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Laundry Service</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newHostelParking}
                      onChange={(e) => setNewHostelParking(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Bike Parking</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddHostel(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Publish Hostel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#1a56db] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">Add Room / Bed Listing</h3>
              <button onClick={() => setShowAddRoom(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoomSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Hostel</label>
                <select
                  value={selectedHostelId}
                  onChange={(e) => setSelectedHostelId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                >
                  {myHostels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 102"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Type</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="single">Single Room</option>
                    <option value="double">Double Sharing</option>
                    <option value="dorm">Dormitory (3-4 Seater)</option>
                    <option value="deluxe">Deluxe Room</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity (Beds)</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Monthly Rent (NPR)</label>
                  <input
                    type="number"
                    required
                    value={newRoomRent}
                    onChange={(e) => setNewRoomRent(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="block font-bold text-slate-700">In-Room Amenities:</span>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoomHasBath}
                      onChange={(e) => setNewRoomHasBath(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Attached Bathroom</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoomHasAC}
                      onChange={(e) => setNewRoomHasAC(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Air Conditioner (AC)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newRoomHasBalcony}
                      onChange={(e) => setNewRoomHasBalcony(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Balcony View</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddRoom(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
