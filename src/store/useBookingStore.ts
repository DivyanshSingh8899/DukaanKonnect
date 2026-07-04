import { create } from 'zustand';
import type {
  BookingState,
  Service,
  TimeSlot,
  Professional,
} from '@/types';

interface BookingStore extends BookingState {
  setService: (service: Service) => void;
  setDate: (date: Date | null) => void;
  setTimeSlot: (timeSlot: TimeSlot) => void;
  setProfessional: (professional: Professional) => void;
  setAddress: (address: string) => void;
  setNotes: (notes: string) => void;
  resetBooking: () => void;
  isBookingComplete: () => boolean;
}

const initialState: BookingState = {
  service: null,
  date: null,
  timeSlot: null,
  professional: null,
  address: '',
  notes: '',
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  ...initialState,
  setService: (service) => set({ service }),
  setDate: (date) => set({ date }),
  setTimeSlot: (timeSlot) => set({ timeSlot }),
  setProfessional: (professional) => set({ professional }),
  setAddress: (address) => set({ address }),
  setNotes: (notes) => set({ notes }),
  resetBooking: () => set(initialState),
  isBookingComplete: () => {
    const state = get();
    return !!(
      state.service &&
      state.date &&
      state.timeSlot &&
      state.address
    );
  },
}));
