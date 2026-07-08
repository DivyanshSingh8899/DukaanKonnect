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
  { specialties: string[]; bio?: string },
  Id<"professionals">
>("professionals:registerAsProfessional");

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
