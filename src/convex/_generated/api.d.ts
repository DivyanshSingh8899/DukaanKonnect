/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as addresses from "../addresses.js";
import type * as admin from "../admin.js";
import type * as adminAuth from "../adminAuth.js";
import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth_sendOtpEmail from "../auth/sendOtpEmail.js";
import type * as bookings from "../bookings.js";
import type * as categories from "../categories.js";
import type * as chat from "../chat.js";
import type * as chatActions from "../chatActions.js";
import type * as http from "../http.js";
import type * as paymentActions from "../paymentActions.js";
import type * as professionalServices from "../professionalServices.js";
import type * as professionals from "../professionals.js";
import type * as razorpay from "../razorpay.js";
import type * as seed from "../seed.js";
import type * as services from "../services.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  addresses: typeof addresses;
  admin: typeof admin;
  adminAuth: typeof adminAuth;
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  "auth/sendOtpEmail": typeof auth_sendOtpEmail;
  bookings: typeof bookings;
  categories: typeof categories;
  chat: typeof chat;
  chatActions: typeof chatActions;
  http: typeof http;
  paymentActions: typeof paymentActions;
  professionalServices: typeof professionalServices;
  professionals: typeof professionals;
  razorpay: typeof razorpay;
  seed: typeof seed;
  services: typeof services;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
