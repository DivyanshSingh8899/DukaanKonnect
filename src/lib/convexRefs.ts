import { makeFunctionReference } from "convex/server";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { Category, Service, Professional, Address, Order, OrderStatus } from "@/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ProBooking {
  id: string;
  service: Service;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  status: OrderStatus;
  totalAmount: number;
  address: string;
  notes?: string;
  createdAt: string;
  isAssignedToMe: boolean;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export type IdDocumentType = "aadhar" | "pan" | "driving_license";

export interface AdminProfessional extends Professional {
  email: string;
  idDocumentType: IdDocumentType | null;
  idDocumentUrl: string | null;
}

export interface MyProfessionalService {
  id: string;
  service: Service;
  price: number;
}

export interface ProfessionalOffer {
  professional: Professional;
  price: number;
}

export interface AdminBooking {
  id: string;
  service: Service;
  professional: Professional | null;
  customerName: string;
  customerEmail: string;
  date: string;
  time: string;
  status: OrderStatus;
  totalAmount: number;
  address: string;
  createdAt: string;
}

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalProfessionals: number;
  approvedProfessionals: number;
  pendingProfessionals: number;
  revenue: number;
}

export const currentUserRef = makeFunctionReference<
  "query",
  Record<string, never>,
  Doc<"users"> | null
>("users:currentUser");

export const updateProfileRef = makeFunctionReference<
  "mutation",
  { name?: string; phone?: string; address?: string },
  void
>("users:updateProfile");

export const categoriesListRef = makeFunctionReference<
  "query",
  Record<string, never>,
  Category[]
>("categories:list");

export const servicesListRef = makeFunctionReference<
  "query",
  Record<string, never>,
  Service[]
>("services:list");

export const servicesListFeaturedRef = makeFunctionReference<
  "query",
  Record<string, never>,
  Service[]
>("services:listFeatured");

export const serviceGetByIdRef = makeFunctionReference<
  "query",
  { id: Id<"services"> },
  Service | null
>("services:getById");

export const professionalsListBySpecialtyRef = makeFunctionReference<
  "query",
  { categorySlug: string },
  Professional[]
>("professionals:listBySpecialty");

export const professionalsMyProfileRef = makeFunctionReference<
  "query",
  Record<string, never>,
  Professional | null
>("professionals:myProfile");

export const registerAsProfessionalRef = makeFunctionReference<
  "mutation",
  {
    specialties: string[];
    bio?: string;
    experienceYears: number;
    idDocumentType: IdDocumentType;
    idDocumentStorageId: Id<"_storage">;
  },
  Id<"professionals">
>("professionals:registerAsProfessional");

export const generateIdUploadUrlRef = makeFunctionReference<
  "mutation",
  Record<string, never>,
  string
>("professionals:generateIdUploadUrl");

export const addressesListMineRef = makeFunctionReference<
  "query",
  Record<string, never>,
  Address[]
>("addresses:listMine");

export const addAddressRef = makeFunctionReference<
  "mutation",
  {
    label: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
  },
  Id<"addresses">
>("addresses:add");

export const bookingsGetBookedSlotsRef = makeFunctionReference<
  "query",
  { categorySlug: string; date: string },
  string[]
>("bookings:getBookedSlots");

export const bookingsListMineRef = makeFunctionReference<
  "query",
  { status?: OrderStatus },
  Order[]
>("bookings:listMine");

export const bookingsListForProfessionalRef = makeFunctionReference<
  "query",
  { status?: OrderStatus },
  ProBooking[]
>("bookings:listForProfessional");

export const bookingsUpdateStatusRef = makeFunctionReference<
  "mutation",
  { bookingId: Id<"bookings">; status: OrderStatus },
  void
>("bookings:updateStatus");

export const bookingsCreateRef = makeFunctionReference<
  "mutation",
  {
    serviceId: Id<"services">;
    professionalId?: Id<"professionals">;
    date: string;
    time: string;
    address: string;
    notes?: string;
  },
  Id<"bookings">
>("bookings:create");

export const paymentsCreateOrderRef = makeFunctionReference<
  "action",
  { serviceId: Id<"services"> },
  RazorpayOrder
>("paymentActions:createOrder");

export const paymentsVerifyAndBookRef = makeFunctionReference<
  "action",
  {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    serviceId: Id<"services">;
    professionalId?: Id<"professionals">;
    date: string;
    time: string;
    address: string;
    notes?: string;
  },
  Id<"bookings">
>("paymentActions:verifyAndBook");

export const chatListMineRef = makeFunctionReference<
  "query",
  Record<string, never>,
  ChatMessage[]
>("chat:listMine");

export const chatSendMessageRef = makeFunctionReference<
  "action",
  { content: string },
  void
>("chatActions:sendMessage");

export const categoriesCreateRef = makeFunctionReference<
  "mutation",
  { name: string; slug: string; icon: string; description: string },
  Id<"categories">
>("categories:create");

export const categoriesUpdateRef = makeFunctionReference<
  "mutation",
  {
    categoryId: Id<"categories">;
    name?: string;
    icon?: string;
    description?: string;
  },
  void
>("categories:update");

export const categoriesRemoveRef = makeFunctionReference<
  "mutation",
  { categoryId: Id<"categories"> },
  void
>("categories:remove");

export const servicesCreateRef = makeFunctionReference<
  "mutation",
  {
    name: string;
    slug: string;
    categoryId: Id<"categories">;
    description: string;
    price: number;
    duration: number;
    image: string;
    featured: boolean;
    tags: string[];
  },
  Id<"services">
>("services:create");

export const servicesUpdateRef = makeFunctionReference<
  "mutation",
  {
    serviceId: Id<"services">;
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    image?: string;
    featured?: boolean;
    tags?: string[];
  },
  void
>("services:update");

export const servicesRemoveRef = makeFunctionReference<
  "mutation",
  { serviceId: Id<"services"> },
  void
>("services:remove");

export const adminStatsRef = makeFunctionReference<
  "query",
  Record<string, never>,
  AdminStats
>("admin:stats");

export const adminListProfessionalsRef = makeFunctionReference<
  "query",
  { approved?: boolean },
  AdminProfessional[]
>("admin:listProfessionals");

export const adminSetProfessionalApprovalRef = makeFunctionReference<
  "mutation",
  { professionalId: Id<"professionals">; approved: boolean },
  void
>("admin:setProfessionalApproval");

export const adminAssignProfessionalRef = makeFunctionReference<
  "mutation",
  { bookingId: Id<"bookings">; professionalId?: Id<"professionals"> },
  void
>("admin:assignProfessional");

export const adminListAllBookingsRef = makeFunctionReference<
  "query",
  { status?: OrderStatus },
  AdminBooking[]
>("admin:listAllBookings");

export const myProfessionalServicesRef = makeFunctionReference<
  "query",
  Record<string, never>,
  MyProfessionalService[]
>("professionalServices:myServices");

export const addOrUpdateProfessionalServiceRef = makeFunctionReference<
  "mutation",
  { serviceId: Id<"services">; price: number },
  Id<"professionalServices">
>("professionalServices:addOrUpdate");

export const removeProfessionalServiceRef = makeFunctionReference<
  "mutation",
  { professionalServiceId: Id<"professionalServices"> },
  void
>("professionalServices:remove");

export const professionalServicesForServiceRef = makeFunctionReference<
  "query",
  { serviceId: Id<"services"> },
  ProfessionalOffer[]
>("professionalServices:listForService");
