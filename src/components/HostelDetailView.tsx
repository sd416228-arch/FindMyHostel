import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Room } from '../types';
import {
  MapPin,
  ShieldCheck,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Shirt,
  Phone,
  Mail,
  Calendar,
  Clock,
  ArrowLeft,
  CheckCircle2,
  BedDouble,
  Bath,
  Tv,
  Wind,
  Share2,
  Heart,
  MessageSquare,
  AlertCircle,
  X,
} from 'lucide-react';

interface HostelDetailViewProps {
  hostelId: string;
  onBack: () => void;
  onOpenAuth: (mode: 'student-login') => void;
}

export const HostelDetailView: React.FC<HostelDetailViewProps> = ({
  hostelId,
  onBack,
  onOpenAuth,
}) => {
  const {
    getHostel,
    getHostelRooms,
    currentUser,
    createBooking,
    createReservation,
    reviews,
    addReview,
    addToast,
  } = useApp();

  const hostel = getHostel(hostelId);
  const rooms = getHostelRooms(hostelId);
  const hostelReviews = reviews.filter((r) => r.hostel_id === hostelId);

  // Gallery image selection
  const [selectedImage, setSelectedImage] = useState<string>(
    hostel?.cover_image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'
  );

  // Booking Modal State
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [stayMonths, setStayMonths] = useState<number>(1);
  const [guestName, setGuestName] = useState<string>(currentUser?.username || '');
  const [guestPhone, setGuestPhone] = useState<string>(currentUser?.phone || '984XXXXXXX');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Inquiry / Schedule Visit Form State
  const [inquiryName, setInquiryName] = useState<string>(currentUser?.username || '');
  const [inquiryPhone, setInquiryPhone] = useState<string>(currentUser?.phone || '');
  const [inquiryMessage, setInquiryMessage] = useState<string>('Hello, I am interested in viewing available rooms this weekend.');

  // Review Form State
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');

  if (!hostel) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Hostel not found</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Back to Hostels
        </button>
      </div>
    );
  }

  const galleryList = [
    hostel.cover_image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    ...(hostel.gallery_images || []),
  ].filter(Boolean);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRoom) return;

    if (!currentUser) {
      addToast('Please sign in or select Student persona to book a room', 'info');
      onOpenAuth('student-login');
      return;
    }

    const res = createBooking({
      room_id: bookingRoom.id,
      starting_date: bookingDate,
      total_nights: stayMonths * 30,
      number_of_guests: 1,
      guest_name: guestName || currentUser.username,
      guest_phone: guestPhone || '98XXXXXXXX',
      special_requests: specialRequests,
    });

    if (res.success) {
      setBookingRoom(null);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addToast('Please sign in as a student to schedule an inquiry', 'info');
      onOpenAuth('student-login');
      return;
    }

    const res = createReservation({
      hostel_id: hostel.id,
      guest_name: inquiryName || currentUser.username,
      guest_phone: inquiryPhone || '98XXXXXXXX',
      message: inquiryMessage,
    });

    if (res.success) {
      setInquiryMessage('');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addToast('Please sign in to leave a review', 'info');
      onOpenAuth('student-login');
      return;
    }

    if (!reviewComment.trim()) {
      addToast('Please write a short review comment', 'warning');
      return;
    }

    const res = addReview({
      hostel_id: hostel.id,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    if (res.success) {
      setReviewComment('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hostels</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: hostel.name, url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                addToast('Hostel link copied to clipboard!', 'success');
              }
            }}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Share Hostel"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Hostel Header */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Gallery / Image Showcase */}
        <div className="p-4 sm:p-6 bg-slate-900">
          <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden relative shadow-inner">
            <img
              src={selectedImage}
              alt={hostel.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              {hostel.is_verified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Property
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 text-white text-xs font-medium backdrop-blur-sm">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {hostel.city}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {galleryList.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {galleryList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImage === img ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title & Overview Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {hostel.name}
            </h1>
            <p className="text-sm text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span>{hostel.location}, {hostel.city}, Nepal</span>
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600 pt-1">
              <span className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold">{hostel.rating.toFixed(1)}</span>
                <span>({hostel.reviews_count} student reviews)</span>
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Phone className="w-3.5 h-3.5" />
                <span>+977 {hostel.phone}</span>
              </span>
              <span className="flex items-center gap-1 text-slate-500">
                <Mail className="w-3.5 h-3.5" />
                <span>{hostel.email}</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-right flex md:flex-col justify-between items-center md:items-end">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Monthly Starting Rate</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                NPR {hostel.monthly_rent.toLocaleString()}
                <span className="text-xs text-slate-500 font-normal"> / mo</span>
              </div>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
              Inclusive of 4-time meals & utilities
            </span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
          {/* Left 2 Cols: Details & Rooms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">About this Hostel</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {hostel.description}
              </p>
            </div>

            {/* Key Amenities Grid */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Included Facilities & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { key: 'wifi', label: 'High-Speed Wi-Fi', active: hostel.wifi, icon: <Wifi className="w-4 h-4 text-blue-600" /> },
                  { key: 'kitchen', label: 'Mess (4 Meals Daily)', active: hostel.kitchen, icon: <Utensils className="w-4 h-4 text-amber-600" /> },
                  { key: 'laundry', label: 'Weekly Laundry', active: hostel.laundry, icon: <Shirt className="w-4 h-4 text-indigo-600" /> },
                  { key: 'parking', label: 'Bike / Scooter Parking', active: hostel.parking, icon: <Car className="w-4 h-4 text-emerald-600" /> },
                  { key: 'gym', label: 'Fitness & Gym', active: hostel.gym, icon: <Dumbbell className="w-4 h-4 text-purple-600" /> },
                  { key: 'power', label: '24/7 Inverter Backup', active: true, icon: <Wind className="w-4 h-4 text-cyan-600" /> },
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold ${
                      item.active
                        ? 'bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60 line-through'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Room Options */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Available Rooms & Beds</h2>
                <span className="text-xs text-slate-500 font-medium">
                  {rooms.filter((r) => r.is_available).length} of {rooms.length} vacant
                </span>
              </div>

              {rooms.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500">
                  No rooms catalogued for this hostel yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-base">
                            Room {room.room_number}
                          </span>
                          <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            {room.room_type} ({room.capacity} {room.capacity === 1 ? 'Seater' : 'Seater'})
                          </span>
                          {room.is_available ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Vacant Bed
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                              Fully Occupied
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500">{room.description}</p>

                        <div className="flex flex-wrap gap-3 text-xs text-slate-600 pt-1">
                          {room.has_bathroom && (
                            <span className="flex items-center gap-1 text-slate-700">
                              <Bath className="w-3.5 h-3.5 text-blue-600" />
                              Attached Bath
                            </span>
                          )}
                          {room.has_ac && (
                            <span className="flex items-center gap-1 text-slate-700">
                              <Wind className="w-3.5 h-3.5 text-cyan-600" />
                              AC Equipped
                            </span>
                          )}
                          {room.has_balcony && (
                            <span className="flex items-center gap-1 text-slate-700">
                              <BedDouble className="w-3.5 h-3.5 text-amber-600" />
                              Balcony View
                            </span>
                          )}
                          {room.has_tv && (
                            <span className="flex items-center gap-1 text-slate-700">
                              <Tv className="w-3.5 h-3.5 text-indigo-600" />
                              TV
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block sm:inline mr-1">Monthly</span>
                          <span className="text-lg font-black text-slate-900">
                            NPR {room.monthly_rent.toLocaleString()}
                          </span>
                        </div>
                        <button
                          disabled={!room.is_available}
                          onClick={() => setBookingRoom(room)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                            room.is_available
                              ? 'bg-[#1a56db] hover:bg-[#0f3a8e] text-white'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {room.is_available ? 'Book Room' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Student Reviews */}
            <div className="pt-6 border-t border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Verified Student Reviews</h2>
                  <p className="text-xs text-slate-500">
                    Experiences shared by students who stayed at this property.
                  </p>
                </div>
              </div>

              {/* Review Input Box */}
              <form
                onSubmit={handleReviewSubmit}
                className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Leave a Student Review</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="Share details about mess food quality, water timing, study environment, and warden friendliness..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-600"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Submit Review
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="space-y-3">
                {hostelReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {rev.user_name[0]}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{rev.user_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Direct Inquiry / Schedule Visit Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-1">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>Schedule a Physical Visit</span>
              </div>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Connect directly with the hostel manager. Schedule an in-person room inspection or meal trial.
              </p>

              <form onSubmit={handleInquirySubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sujan Shrestha"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Mobile Phone (Nepal)
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="98XXXXXXXX"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Inquiry Message / Visit Date
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-lg border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1a56db] hover:bg-[#0f3a8e] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Send Inquiry to Warden
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-200 text-center space-y-1">
                <span className="text-[11px] text-slate-500 block">Or call directly:</span>
                <a
                  href={`tel:${hostel.phone}`}
                  className="text-sm font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+977 {hostel.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Booking Modal */}
      {bookingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-[#1a56db] to-[#0f3a8e] text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Reserve Room {bookingRoom.room_number}</h3>
                <p className="text-xs text-white/80">{hostel.name} • {bookingRoom.room_type}</p>
              </div>
              <button
                onClick={() => setBookingRoom(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Monthly Rate</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    NPR {bookingRoom.monthly_rent.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Capacity</span>
                  <span className="font-bold text-slate-800">
                    {bookingRoom.capacity} Seater
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Move-in Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Intended Stay Duration (Months)
                </label>
                <select
                  value={stayMonths}
                  onChange={(e) => setStayMonths(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value={1}>1 Month (Trial)</option>
                  <option value={3}>3 Months (Semester)</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>1 Year (Academic Year)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Contact Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Special Requests / Dietary Preferences (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian mess meals, ground floor preference"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Total Estimated Amount</span>
                  <span className="text-base font-black text-blue-600">
                    NPR {(bookingRoom.monthly_rent * stayMonths).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingRoom(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1a56db] hover:bg-[#0f3a8e] text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    Confirm Bed Reservation
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
