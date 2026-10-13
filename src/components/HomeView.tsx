import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Hostel } from '../types';
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  Shirt,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Building,
  Heart,
} from 'lucide-react';

interface HomeViewProps {
  onSelectHostel: (hostelId: string) => void;
  onNavigateHostels: (filters?: { city?: string; search?: string }) => void;
  onOpenOwnerRegister: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectHostel,
  onNavigateHostels,
  onOpenOwnerRegister,
}) => {
  const { hostels, testimonials } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const featuredHostels = hostels.filter((h) => h.is_active).slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateHostels({
      city: selectedCity || undefined,
      search: searchTerm || undefined,
    });
  };

  const cities = [
    { name: 'Kathmandu', count: '85+ Hostels', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80', desc: 'Baneshwor, Kirtipur, Putalisadak' },
    { name: 'Lalitpur', count: '45+ Hostels', image: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=600&q=80', desc: 'Pulchowk, Kupondole, Lagankhel' },
    { name: 'Pokhara', count: '30+ Hostels', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', desc: 'Lakeside, Bagar, Zero KM' },
    { name: 'Bhaktapur', count: '20+ Hostels', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=600&q=80', desc: 'Sallaghari, Suryabinayak, Kamalbinayak' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0F2942] via-[#1A365D] to-[#0A192F] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl shadow-xl">
        {/* Decorative backdrop elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Nepal's Premier Student Accommodation Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            Find Your Ideal Student Hostel in <span className="text-amber-400">Nepal</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Verified boys, girls, and co-ed hostels across Kathmandu, Lalitpur, Pokhara & Bhaktapur. Safe environments, nutritious meals, high-speed WiFi, and 100% transparent pricing.
          </p>

          {/* Search Bar Container */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-2.5 sm:p-4 rounded-2xl shadow-2xl text-slate-800 max-w-3xl mx-auto border border-white/20 flex flex-col sm:flex-row gap-3 items-center"
          >
            <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full border-b sm:border-b-0 sm:border-r border-slate-200">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search area (e.g. Baneshwor, Pulchowk)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm font-medium outline-none bg-transparent placeholder:text-slate-400"
              />
            </div>

            <div className="flex-1 flex items-center gap-3 px-3 py-2 w-full">
              <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-sm font-medium outline-none bg-transparent text-slate-700 cursor-pointer"
              >
                <option value="">All Nepal Cities</option>
                <option value="Kathmandu">Kathmandu</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
                <option value="Pokhara">Pokhara</option>
                <option value="Chitwan">Chitwan</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#1a56db] hover:bg-[#0f3a8e] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>Search Hostels</span>
            </button>
          </form>

          {/* Key metrics strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10 text-white/90">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300">150+</div>
              <div className="text-xs sm:text-sm text-slate-300">Verified Hostels</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300">3,500+</div>
              <div className="text-xs sm:text-sm text-slate-300">Happy Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300">Zero</div>
              <div className="text-xs sm:text-sm text-slate-300">Brokerage Fees</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">24/7</div>
              <div className="text-xs sm:text-sm text-slate-300">Student Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Educational Hubs in Nepal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Top Locations
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore Hostels by City
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hostels located conveniently close to major TU, KU, and PU engineering, medical, and IT campuses.
            </p>
          </div>
          <button
            onClick={() => onNavigateHostels()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
          >
            <span>View all locations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cities.map((city) => (
            <div
              key={city.name}
              onClick={() => onNavigateHostels({ city: city.name })}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer bg-slate-900 h-64 flex flex-col justify-end p-5"
            >
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="relative z-10 text-white">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600/90 text-white mb-2">
                  {city.count}
                </span>
                <h3 className="text-xl font-bold">{city.name}</h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{city.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Hostels Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Handpicked Accommodations
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured Verified Hostels
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Inspected for safety, hygienic mess food, continuous electricity, and peaceful study atmosphere.
            </p>
          </div>
          <button
            onClick={() => onNavigateHostels()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 group"
          >
            <span>See all {hostels.length} hostels</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {featuredHostels.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} onSelect={onSelectHostel} />
          ))}
        </div>
      </section>

      {/* Why Choose FindMyHostel */}
      <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Student-First Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Why Nepali Students Trust FindMyHostel
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Say goodbye to walking for days finding hostels in Kathmandu's alleys. Compare rooms, food menus, and prices from home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Physical Verification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every hostel listing is verified for actual room conditions, clean water availability, hygienic mess kitchen, and security measures.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Transparent Monthly NPR Pricing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct owner pricing with no hidden broker commissions, booking fees, or surprise utility surcharges. What you see is what you pay.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Direct Owner Inquiry & Booking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect directly with wardens and property managers. Schedule room visits or lock in your bed before college semesters begin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Student Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Voices from Campus & Hostels
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Real feedback from engineering, medical, and CA students residing in our partner hostels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed mb-6">
                  "{item.content}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {item.user_name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.user_name}</h4>
                  <p className="text-xs text-slate-500">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hostel Owner CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
              <Building className="w-3.5 h-3.5" />
              <span>For Hostel Owners in Nepal</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Fill Your Vacant Hostel Rooms Fast
            </h3>
            <p className="text-slate-200 text-sm sm:text-base mt-2 leading-relaxed">
              List your property on FindMyHostel to connect with verified students from across Nepal. Enjoy dedicated owner dashboard, room availability management, and direct student inquiries.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenOwnerRegister}
              className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md text-center"
            >
              List Your Hostel For Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export const HostelCard: React.FC<{
  hostel: Hostel;
  onSelect: (id: string) => void;
}> = ({ hostel, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(hostel.id)}
      className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
    >
      {/* Image with badges */}
      <div className="relative h-52 bg-slate-100 overflow-hidden">
        <img
          src={hostel.cover_image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'}
          alt={hostel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {hostel.is_verified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600/95 text-white text-[11px] font-bold shadow-md backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[11px] font-semibold backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-amber-400" />
            {hostel.city}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition-colors"
            title="Save hostel"
          >
            <Heart className="w-4 h-4 hover:text-red-500" />
          </button>
        </div>

        <div className="absolute bottom-3 right-3 bg-white/95 px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 text-xs font-bold text-slate-800">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{hostel.rating.toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({hostel.reviews_count})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
            {hostel.name}
          </h3>
          <p className="text-slate-500 text-xs flex items-center gap-1 mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{hostel.location}, {hostel.city}</span>
          </p>

          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4">
            {hostel.description}
          </p>

          {/* Amenities icons */}
          <div className="flex items-center gap-2 text-slate-400 py-2 border-y border-slate-100 text-xs">
            {hostel.wifi && (
              <span className="flex items-center gap-1" title="High-Speed Wi-Fi">
                <Wifi className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[11px] text-slate-600">WiFi</span>
              </span>
            )}
            {hostel.laundry && (
              <span className="flex items-center gap-1 ml-2" title="Laundry Service">
                <Shirt className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[11px] text-slate-600">Laundry</span>
              </span>
            )}
            {hostel.kitchen && (
              <span className="flex items-center gap-1 ml-2" title="Nutritious Mess Food">
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px] text-slate-600">Mess</span>
              </span>
            )}
            {hostel.parking && (
              <span className="flex items-center gap-1 ml-2" title="Bike/Car Parking">
                <Car className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] text-slate-600">Parking</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Starts from</span>
            <div className="text-slate-900 font-extrabold text-base">
              NPR {hostel.monthly_rent.toLocaleString()}
              <span className="text-xs text-slate-500 font-normal"> / mo</span>
            </div>
          </div>
          <button
            onClick={() => onSelect(hostel.id)}
            className="px-4 py-2 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-700 group-hover:text-white font-bold text-xs transition-all flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
