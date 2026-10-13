import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Hostel,
  Room,
  Booking,
  BookingStatus,
  Reservation,
  ReservationStatus,
  Review,
  Testimonial,
} from '../types';
import {
  SEED_USERS,
  SEED_HOSTELS,
  SEED_ROOMS,
  SEED_BOOKINGS,
  SEED_RESERVATIONS,
  SEED_REVIEWS,
  SEED_TESTIMONIALS,
} from '../data/seedData';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  hostels: Hostel[];
  rooms: Room[];
  bookings: Booking[];
  reservations: Reservation[];
  reviews: Review[];
  testimonials: Testimonial[];
  toasts: Toast[];

  // Toast
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Navigation State
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  navigateToRoleDashboard: (role: UserRole) => void;

  // Auth & Profile
  login: (email: string, role?: UserRole) => { success: boolean; error?: string };
  register: (data: { email: string; username: string; role: UserRole; phone?: string }) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (role: UserRole | 'guest', targetDashboard?: boolean) => void;
  updateUserProfile: (data: Partial<User>) => void;

  // Hostels
  getHostel: (id: string) => Hostel | undefined;
  createHostel: (data: Omit<Hostel, 'id' | 'created_at' | 'rating' | 'reviews_count'>) => string;
  updateHostel: (id: string, data: Partial<Hostel>) => void;
  deleteHostel: (id: string) => void;
  toggleHostelStatus: (id: string) => void;
  toggleHostelVerified: (id: string) => void;

  // Rooms
  getHostelRooms: (hostelId: string) => Room[];
  createRoom: (data: Omit<Room, 'id' | 'created_at'>) => string;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  toggleRoomAvailability: (id: string) => void;

  // Bookings
  getUserBookings: (userId?: string) => Booking[];
  getOwnerBookings: (ownerId?: string) => Booking[];
  createBooking: (data: {
    room_id: string;
    starting_date: string;
    total_nights: number;
    number_of_guests: number;
    guest_name: string;
    guest_phone: string;
    special_requests?: string;
  }) => { success: boolean; bookingId?: string; error?: string };
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  cancelBooking: (id: string) => boolean;

  // Reservations
  getUserReservations: (userId?: string) => Reservation[];
  getOwnerReservations: (ownerId?: string) => Reservation[];
  createReservation: (data: {
    hostel_id: string;
    guest_name: string;
    guest_phone: string;
    message: string;
  }) => { success: boolean; error?: string };
  updateReservationStatus: (id: string, status: ReservationStatus) => void;

  // Reviews & Testimonials
  hasUserConfirmedStay: (userId: string, hostelId: string) => boolean;
  addReview: (data: { hostel_id: string; rating: number; comment: string }) => { success: boolean; error?: string };
  addTestimonial: (data: { content: string; role: string; rating: number }) => { success: boolean; error?: string };
  toggleTestimonial: (id: string) => void;
  deleteTestimonial: (id: string) => void;

  // Admin users
  toggleUserVerified: (id: string) => void;
  deleteUser: (id: string) => void;
  updateUserRole: (id: string, role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'fmh_users_v1',
  CURRENT_USER: 'fmh_current_user_v1',
  HOSTELS: 'fmh_hostels_v1',
  ROOMS: 'fmh_rooms_v1',
  BOOKINGS: 'fmh_bookings_v1',
  RESERVATIONS: 'fmh_reservations_v1',
  REVIEWS: 'fmh_reviews_v1',
  TESTIMONIALS: 'fmh_testimonials_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) return JSON.parse(saved);
    // Default to student for testing
    return SEED_USERS[1]; // Aayush Sharma
  });

  const [hostels, setHostels] = useState<Hostel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOSTELS);
    return saved ? JSON.parse(saved) : SEED_HOSTELS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROOMS);
    return saved ? JSON.parse(saved) : SEED_ROOMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : SEED_BOOKINGS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    return saved ? JSON.parse(saved) : SEED_RESERVATIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : SEED_REVIEWS;
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    return saved ? JSON.parse(saved) : SEED_TESTIMONIALS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('home');

  const navigateToRoleDashboard = (role: UserRole) => {
    if (role === 'student') setCurrentTab('student-dashboard');
    else if (role === 'owner') setCurrentTab('owner-dashboard');
    else if (role === 'admin') setCurrentTab('admin-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HOSTELS, JSON.stringify(hostels));
  }, [hostels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  }, [testimonials]);

  // Toast Helpers
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth
  const login = (email: string, role?: UserRole): { success: boolean; error?: string } => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (role && existing.role !== role && existing.role !== 'admin') {
        return { success: false, error: `This account is registered as a ${existing.role}, not a ${role}.` };
      }
      setCurrentUser(existing);
      if (existing.role === 'owner') setCurrentTab('owner-dashboard');
      else if (existing.role === 'admin') setCurrentTab('admin-dashboard');
      else setCurrentTab('student-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      addToast(`Welcome back, ${existing.email}!`, 'success');
      return { success: true };
    }
    return { success: false, error: 'User with this email not found. Please register first.' };
  };

  const register = (data: {
    email: string;
    username: string;
    role: UserRole;
    phone?: string;
  }): { success: boolean; error?: string } => {
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, error: 'Email already registered.' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      username: data.username,
      role: data.role,
      phone: data.phone || '',
      is_verified: true,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    if (newUser.role === 'owner') setCurrentTab('owner-dashboard');
    else if (newUser.role === 'admin') setCurrentTab('admin-dashboard');
    else setCurrentTab('student-dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('Account created successfully! Welcome to FindMyHostel.', 'success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentTab('home');
    addToast('Logged out successfully.', 'info');
  };

  const switchRole = (role: UserRole | 'guest', targetDashboard = true) => {
    if (role === 'guest') {
      setCurrentUser(null);
      if (targetDashboard) setCurrentTab('home');
      addToast('Switched to Guest mode.', 'info');
      return;
    }
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      if (targetDashboard) {
        if (role === 'student') setCurrentTab('student-dashboard');
        else if (role === 'owner') setCurrentTab('owner-dashboard');
        else if (role === 'admin') setCurrentTab('admin-dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      const roleName = role === 'owner' ? 'Hostel Owner' : role === 'admin' ? 'Website Admin' : 'Student';
      const dashboardName = role === 'owner' ? 'Hostel Owner Portal' : role === 'admin' ? 'Admin Panel' : 'Student Portal';
      addToast(`Switched to ${roleName} (${found.email}) — ${dashboardName} opened`, 'success');
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    addToast('Profile updated successfully!', 'success');
  };

  // Hostels
  const getHostel = (id: string) => hostels.find((h) => h.id === id);

  const createHostel = (data: Omit<Hostel, 'id' | 'created_at' | 'rating' | 'reviews_count'>): string => {
    const newId = `hostel-${Date.now()}`;
    const newHostel: Hostel = {
      ...data,
      id: newId,
      rating: 0,
      reviews_count: 0,
      created_at: new Date().toISOString(),
    };
    setHostels((prev) => [newHostel, ...prev]);
    addToast(`Hostel "${data.name}" created successfully!`, 'success');
    return newId;
  };

  const updateHostel = (id: string, data: Partial<Hostel>) => {
    setHostels((prev) => prev.map((h) => (h.id === id ? { ...h, ...data } : h)));
    addToast('Hostel details updated.', 'success');
  };

  const deleteHostel = (id: string) => {
    setHostels((prev) => prev.filter((h) => h.id !== id));
    addToast('Hostel listing removed.', 'info');
  };

  const toggleHostelStatus = (id: string) => {
    setHostels((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextState = !h.is_active;
          addToast(`Hostel is now ${nextState ? 'Active' : 'Inactive'}.`, 'info');
          return { ...h, is_active: nextState };
        }
        return h;
      })
    );
  };

  const toggleHostelVerified = (id: string) => {
    setHostels((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextState = !h.is_verified;
          addToast(`Hostel verification ${nextState ? 'approved' : 'revoked'}.`, 'info');
          return { ...h, is_verified: nextState };
        }
        return h;
      })
    );
  };

  // Rooms
  const getHostelRooms = (hostelId: string) => rooms.filter((r) => r.hostel_id === hostelId);

  const createRoom = (data: Omit<Room, 'id' | 'created_at'>): string => {
    const newId = `room-${Date.now()}`;
    const newRoom: Room = {
      ...data,
      id: newId,
      created_at: new Date().toISOString(),
    };
    setRooms((prev) => [...prev, newRoom]);
    addToast(`Room ${data.room_number} added successfully!`, 'success');
    return newId;
  };

  const updateRoom = (id: string, data: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    addToast('Room updated successfully.', 'success');
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    addToast('Room removed.', 'info');
  };

  const toggleRoomAvailability = (id: string) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_available: !r.is_available } : r))
    );
  };

  // Bookings
  const getUserBookings = (userId?: string) => {
    const uid = userId || currentUser?.id;
    if (!uid) return [];
    return bookings.filter((b) => b.guest_id === uid);
  };

  const getOwnerBookings = (ownerId?: string) => {
    const oid = ownerId || currentUser?.id;
    if (!oid) return [];
    const ownerHostelIds = new Set(hostels.filter((h) => h.owner_id === oid).map((h) => h.id));
    return bookings.filter((b) => ownerHostelIds.has(b.hostel_id));
  };

  const createBooking = (data: {
    room_id: string;
    starting_date: string;
    total_nights: number;
    number_of_guests: number;
    guest_name: string;
    guest_phone: string;
    special_requests?: string;
  }): { success: boolean; bookingId?: string; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'Please log in to book a room.' };
    }
    const targetRoom = rooms.find((r) => r.id === data.room_id);
    if (!targetRoom) {
      return { success: false, error: 'Selected room not found.' };
    }
    if (data.number_of_guests > targetRoom.capacity) {
      return { success: false, error: `Room capacity is ${targetRoom.capacity} guests.` };
    }
    // Check conflicts for same room and starting date
    const conflict = bookings.find(
      (b) =>
        b.room_id === data.room_id &&
        b.starting_date === data.starting_date &&
        ['pending', 'confirmed', 'checked_in'].includes(b.status)
    );
    if (conflict) {
      return { success: false, error: 'This room is already booked for the selected date.' };
    }

    // Pro-rated pricing: (room.monthly_rent / 30) * days
    const price = Math.round((targetRoom.monthly_rent / 30) * data.total_nights);
    const newId = `bk-${Date.now()}`;
    const newBooking: Booking = {
      id: newId,
      guest_id: currentUser.id,
      room_id: targetRoom.id,
      hostel_id: targetRoom.hostel_id,
      starting_date: data.starting_date,
      total_nights: data.total_nights,
      number_of_guests: data.number_of_guests,
      monthly_rent: targetRoom.monthly_rent,
      total_price: price,
      status: 'pending',
      guest_name: data.guest_name,
      guest_email: currentUser.email,
      guest_phone: data.guest_phone,
      special_requests: data.special_requests,
      created_at: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    addToast('Booking request submitted! Waiting for owner confirmation.', 'success');
    return { success: true, bookingId: newId };
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    addToast(`Booking marked as ${status.replace('_', ' ')}.`, 'info');
  };

  const cancelBooking = (id: string): boolean => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return false;
    if (['completed', 'cancelled'].includes(booking.status)) {
      addToast('Cannot cancel this booking as it is already closed.', 'error');
      return false;
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
    addToast('Booking cancelled.', 'info');
    return true;
  };

  // Reservations
  const getUserReservations = (userId?: string) => {
    const uid = userId || currentUser?.id;
    if (!uid) return [];
    return reservations.filter((r) => r.user_id === uid);
  };

  const getOwnerReservations = (ownerId?: string) => {
    const oid = ownerId || currentUser?.id;
    if (!oid) return [];
    const ownerHostelIds = new Set(hostels.filter((h) => h.owner_id === oid).map((h) => h.id));
    return reservations.filter((r) => ownerHostelIds.has(r.hostel_id));
  };

  const createReservation = (data: {
    hostel_id: string;
    guest_name: string;
    guest_phone: string;
    message: string;
  }): { success: boolean; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'Please log in to submit a reservation request.' };
    }
    if (currentUser.role === 'owner') {
      return { success: false, error: 'Hostel owners cannot submit reservations.' };
    }
    const hasPending = reservations.some(
      (r) => r.user_id === currentUser.id && r.hostel_id === data.hostel_id && r.status === 'pending'
    );
    if (hasPending) {
      return {
        success: false,
        error: 'You already have a pending reservation request for this hostel. Please wait for the owner response.',
      };
    }

    const newId = `res-${Date.now()}`;
    const newRes: Reservation = {
      id: newId,
      user_id: currentUser.id,
      hostel_id: data.hostel_id,
      guest_name: data.guest_name,
      guest_phone: data.guest_phone,
      message: data.message,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    setReservations((prev) => [newRes, ...prev]);
    addToast('Reservation request sent! The owner will contact you shortly.', 'success');
    return { success: true };
  };

  const updateReservationStatus = (id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    addToast(`Reservation request updated to ${status}.`, 'info');
  };

  // Reviews & Testimonials
  const hasUserConfirmedStay = (userId: string, hostelId: string): boolean => {
    const hasBooking = bookings.some(
      (b) =>
        b.guest_id === userId &&
        b.hostel_id === hostelId &&
        ['confirmed', 'checked_in', 'completed'].includes(b.status)
    );
    const hasReservation = reservations.some(
      (r) => r.user_id === userId && r.hostel_id === hostelId && r.status === 'confirmed'
    );
    return hasBooking || hasReservation;
  };

  const addReview = (data: { hostel_id: string; rating: number; comment: string }): {
    success: boolean;
    error?: string;
  } => {
    if (!currentUser) return { success: false, error: 'Please log in to write a review.' };
    if (currentUser.role === 'owner') return { success: false, error: 'Hostel owners cannot review hostels.' };

    if (!hasUserConfirmedStay(currentUser.id, data.hostel_id)) {
      return {
        success: false,
        error: 'You can review this hostel only after your booking or reservation has been accepted.',
      };
    }

    const existing = reviews.find((r) => r.user_id === currentUser.id && r.hostel_id === data.hostel_id);
    if (existing) {
      return { success: false, error: 'You have already reviewed this hostel.' };
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      hostel_id: data.hostel_id,
      user_id: currentUser.id,
      user_name: currentUser.username || currentUser.email.split('@')[0],
      user_email: currentUser.email,
      rating: data.rating,
      comment: data.comment,
      created_at: new Date().toISOString(),
    };

    const nextReviews = [newReview, ...reviews];
    setReviews(nextReviews);

    // Recalculate hostel rating and reviews count
    const hostelRevs = nextReviews.filter((r) => r.hostel_id === data.hostel_id);
    const avg = hostelRevs.reduce((acc, cur) => acc + cur.rating, 0) / hostelRevs.length;
    setHostels((prev) =>
      prev.map((h) =>
        h.id === data.hostel_id
          ? { ...h, rating: Number(avg.toFixed(1)), reviews_count: hostelRevs.length }
          : h
      )
    );

    addToast('Thank you! Your verified review has been published.', 'success');
    return { success: true };
  };

  const addTestimonial = (data: { content: string; role: string; rating: number }): {
    success: boolean;
    error?: string;
  } => {
    if (!currentUser) return { success: false, error: 'Please log in to submit a testimonial.' };

    const hasAnyAccepted =
      bookings.some((b) => b.guest_id === currentUser.id && ['confirmed', 'checked_in', 'completed'].includes(b.status)) ||
      reservations.some((r) => r.user_id === currentUser.id && r.status === 'confirmed');

    if (!hasAnyAccepted) {
      return {
        success: false,
        error: 'You can leave a testimonial only after one of your hostel bookings has been confirmed.',
      };
    }

    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      user_id: currentUser.id,
      user_name: currentUser.username || currentUser.email.split('@')[0],
      role: data.role || 'Hostel Seeker',
      content: data.content,
      rating: data.rating,
      is_active: true,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.username)}&background=random`,
      created_at: new Date().toISOString(),
    };

    setTestimonials((prev) => [newTestimonial, ...prev]);
    addToast('Your review has been submitted for the homepage!', 'success');
    return { success: true };
  };

  const toggleTestimonial = (id: string) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_active: !t.is_active } : t))
    );
    addToast('Testimonial status updated.', 'info');
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    addToast('Testimonial removed.', 'info');
  };

  // Admin users management
  const toggleUserVerified = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_verified: !u.is_verified } : u))
    );
    addToast('User verification updated.', 'info');
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addToast('User account deleted.', 'info');
  };

  const updateUserRole = (id: string, role: UserRole) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    addToast(`User role updated to ${role}.`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentTab,
        setCurrentTab,
        navigateToRoleDashboard,
        users,
        hostels,
        rooms,
        bookings,
        reservations,
        reviews,
        testimonials,
        toasts,
        addToast,
        removeToast,
        login,
        register,
        logout,
        switchRole,
        updateUserProfile,
        getHostel,
        createHostel,
        updateHostel,
        deleteHostel,
        toggleHostelStatus,
        toggleHostelVerified,
        getHostelRooms,
        createRoom,
        updateRoom,
        deleteRoom,
        toggleRoomAvailability,
        getUserBookings,
        getOwnerBookings,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        getUserReservations,
        getOwnerReservations,
        createReservation,
        updateReservationStatus,
        hasUserConfirmedStay,
        addReview,
        addTestimonial,
        toggleTestimonial,
        deleteTestimonial,
        toggleUserVerified,
        deleteUser,
        updateUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
