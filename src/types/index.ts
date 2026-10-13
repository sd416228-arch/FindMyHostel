export type UserRole = 'student' | 'owner' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  phone?: string;
  profile_picture?: string;
  is_verified: boolean;
  created_at: string;
}

export type RoomType = 'single' | 'double' | 'dorm' | 'deluxe';

export interface Room {
  id: string;
  hostel_id: string;
  room_number: string;
  room_type: RoomType;
  capacity: number;
  monthly_rent: number;
  description: string;
  has_ac: boolean;
  has_bathroom: boolean;
  has_tv: boolean;
  has_balcony: boolean;
  image?: string;
  is_available: boolean;
  created_at: string;
}

export interface Hostel {
  id: string;
  owner_id: string;
  owner_email?: string;
  name: string;
  description: string;
  location: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email: string;
  website?: string;
  
  // Amenities
  wifi: boolean;
  parking: boolean;
  laundry: boolean;
  kitchen: boolean;
  gym: boolean;
  
  // Pricing & Ratings
  monthly_rent: number;
  rating: number;
  reviews_count: number;
  
  // Media
  cover_image?: string;
  gallery_images?: string[];
  
  // Status
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  guest_id: string;
  room_id: string;
  hostel_id: string;
  starting_date: string; // YYYY-MM-DD
  total_nights: number;
  number_of_guests: number;
  monthly_rent: number;
  total_price: number;
  status: BookingStatus;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
  created_at: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  user_id: string;
  hostel_id: string;
  guest_name: string;
  guest_phone: string;
  message: string;
  status: ReservationStatus;
  created_at: string;
}

export interface Review {
  id: string;
  hostel_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Testimonial {
  id: string;
  user_id?: string;
  user_name: string;
  role: string;
  content: string;
  rating: number;
  is_active: boolean;
  avatar?: string;
  created_at: string;
}
