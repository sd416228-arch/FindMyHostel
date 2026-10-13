import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { HostelCard } from './HomeView';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  MapPin,
  ShieldCheck,
  Building,
  RotateCcw,
} from 'lucide-react';

interface HostelsListViewProps {
  onSelectHostel: (hostelId: string) => void;
  initialCity?: string;
  initialSearch?: string;
}

export const HostelsListView: React.FC<HostelsListViewProps> = ({
  onSelectHostel,
  initialCity = '',
  initialSearch = '',
}) => {
  const { hostels, rooms } = useApp();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [amenities, setAmenities] = useState({
    wifi: false,
    laundry: false,
    kitchen: false,
    parking: false,
    gym: false,
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter hostels
  const filteredHostels = useMemo(() => {
    return hostels
      .filter((hostel) => {
        // Active filter
        if (!hostel.is_active) return false;

        // Search text
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = hostel.name.toLowerCase().includes(term);
          const matchLoc = hostel.location.toLowerCase().includes(term);
          const matchCity = hostel.city.toLowerCase().includes(term);
          const matchDesc = hostel.description.toLowerCase().includes(term);
          if (!matchName && !matchLoc && !matchCity && !matchDesc) return false;
        }

        // City filter
        if (cityFilter && hostel.city.toLowerCase() !== cityFilter.toLowerCase()) {
          return false;
        }

        // Price filter
        if (hostel.monthly_rent > maxPrice) {
          return false;
        }

        // Verified filter
        if (verifiedOnly && !hostel.is_verified) {
          return false;
        }

        // Amenities
        if (amenities.wifi && !hostel.wifi) return false;
        if (amenities.laundry && !hostel.laundry) return false;
        if (amenities.kitchen && !hostel.kitchen) return false;
        if (amenities.parking && !hostel.parking) return false;
        if (amenities.gym && !hostel.gym) return false;

        // Room Type check
        if (roomTypeFilter !== 'all') {
          const hostelRooms = rooms.filter((r) => r.hostel_id === hostel.id);
          const hasRoomType = hostelRooms.some((r) => r.room_type === roomTypeFilter && r.is_available);
          if (!hasRoomType) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.monthly_rent - b.monthly_rent;
        if (sortBy === 'price-desc') return b.monthly_rent - a.monthly_rent;
        if (sortBy === 'rating') return b.rating - a.rating;
        // default featured
        if (a.is_verified && !b.is_verified) return -1;
        if (!a.is_verified && b.is_verified) return 1;
        return b.rating - a.rating;
      });
  }, [hostels, rooms, searchTerm, cityFilter, roomTypeFilter, maxPrice, verifiedOnly, amenities, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setRoomTypeFilter('all');
    setMaxPrice(25000);
    setVerifiedOnly(false);
    setSortBy('featured');
    setAmenities({
      wifi: false,
      laundry: false,
      kitchen: false,
      parking: false,
      gym: false,
    });
  };

  const hasActiveFilters =
    searchTerm || cityFilter || roomTypeFilter !== 'all' || maxPrice < 25000 || verifiedOnly || Object.values(amenities).some(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search */}
      <div className="bg-gradient-to-r from-[#1A365D] to-[#0F2942] text-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Explore Student Hostels in Nepal
        </h1>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          Browse verified hostels across Kathmandu, Lalitpur, Bhaktapur & Pokhara. Filter by room availability, rent budget, and amenities.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by hostel name, area, college (e.g. Pulchowk, New Baneshwor)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none shadow-sm"
            />
          </div>

          <div className="sm:w-56">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 text-sm font-medium outline-none shadow-sm cursor-pointer"
            >
              <option value="">All Nepal Cities</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
              <option value="Pokhara">Pokhara</option>
              <option value="Chitwan">Chitwan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between pb-2">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none shadow-sm"
          >
            <option value="featured">Featured / Verified</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Sidebar Filters (Desktop & Mobile Drawer) */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 h-fit`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Verified Only */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Hostels Only
              </span>
            </label>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Room Category
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'all', label: 'All Room Types' },
                { id: 'single', label: 'Single Private Room' },
                { id: 'double', label: 'Double Sharing' },
                { id: 'dorm', label: 'Dormitory (3-4 Seater)' },
                { id: 'deluxe', label: 'Deluxe / Attached Bath' },
              ].map((type) => (
                <label key={type.id} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="radio"
                    name="roomType"
                    checked={roomTypeFilter === type.id}
                    onChange={() => setRoomTypeFilter(type.id)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Max Monthly Rent */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              <span>Max Monthly Rent</span>
              <span className="text-blue-600 font-extrabold normal-case">
                NPR {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={7000}
              max={25000}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>NPR 7,000</span>
              <span>NPR 25,000+</span>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Required Amenities
            </label>
            <div className="space-y-2">
              {[
                { key: 'wifi', label: 'High-speed Wi-Fi' },
                { key: 'kitchen', label: 'Mess / 4 Times Food' },
                { key: 'laundry', label: 'Laundry Service' },
                { key: 'parking', label: 'Bike/Car Parking' },
                { key: 'gym', label: 'Fitness / Gym' },
              ].map((amenity) => (
                <label key={amenity.key} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={(amenities as any)[amenity.key]}
                    onChange={(e) =>
                      setAmenities({ ...amenities, [amenity.key]: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>{amenity.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Results Bar */}
          <div className="hidden lg:flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
            <div>
              Showing <span className="font-bold text-slate-900">{filteredHostels.length}</span> properties
              {cityFilter && (
                <span>
                  {' '}in <span className="font-semibold text-blue-600">{cityFilter}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-semibold outline-none cursor-pointer"
              >
                <option value="featured">Featured & Verified</option>
                <option value="price-asc">Rent: Low to High</option>
                <option value="price-desc">Rent: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Hostels Grid */}
          {filteredHostels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHostels.map((hostel) => (
                <HostelCard key={hostel.id} hostel={hostel} onSelect={onSelectHostel} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No hostels match your filters</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Try widening your price range, clearing specific amenities, or selecting "All Nepal Cities".
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
