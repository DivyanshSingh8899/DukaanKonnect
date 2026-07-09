import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { RequireAuth } from "@/components/RequireAuth";
import "./index.css";
import "./types/global.d.ts";

// Lazy load route components for better code splitting
const Home = lazy(() => import("./pages/Home.tsx"));
const Services = lazy(() => import("./pages/Services.tsx"));
const Booking = lazy(() => import("./pages/Booking.tsx"));
const Orders = lazy(() => import("./pages/Orders.tsx"));
const Profile = lazy(() => import("./pages/Profile.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const ProDashboard = lazy(() => import("./pages/ProDashboard.tsx"));
const ProProfile = lazy(() => import("./pages/ProProfile.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <InstrumentationProvider>
        <ConvexAuthProvider client={convex}>
          <BrowserRouter>
            <Suspense fallback={<RouteLoading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route
                  path="/booking"
                  element={
                    <RequireAuth>
                      <Booking />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <RequireAuth>
                      <Orders />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/pro"
                  element={
                    <RequireAuth>
                      <ProDashboard />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/pro/profile"
                  element={
                    <RequireAuth>
                      <ProProfile />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <AdminDashboard />
                    </RequireAuth>
                  }
                />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </ConvexAuthProvider>
      </InstrumentationProvider>
    </ThemeProvider>
  </StrictMode>,
);
