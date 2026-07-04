export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  serviceCount: number;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  description: string;
  price: number;
  duration: number;
  rating: number;
  reviewCount: number;
  image: string;
  featured: boolean;
  tags: string[];
}

export interface Professional {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  specialties: string[];
  bio?: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface BookingState {
  service: Service | null;
  date: Date | null;
  timeSlot: TimeSlot | null;
  professional: Professional | null;
  address: string;
  notes: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  service: Service;
  professional: Professional | null;
  date: string;
  time: string;
  status: OrderStatus;
  totalAmount: number;
  address: string;
  notes?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  savedAddresses: Address[];
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface CartItem {
  service: Service;
  quantity: number;
}
