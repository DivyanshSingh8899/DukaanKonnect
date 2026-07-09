import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { updateProfileRef } from "@/lib/convexRefs";
import { useMutation } from "convex/react";
import { ROLES } from "@/convex/schema";
import {
  ArrowRight,
  Briefcase,
  Droplet,
  Loader2,
  Mail,
  Scissors,
  ShieldCheck,
  Sparkles,
  User,
  UserX,
  Wrench,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, user, signIn } = useAuth();
  const updateProfile = useMutation(updateProfileRef);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loginMode, setLoginMode] = useState<"customer" | "provider">("customer");
  const [step, setStep] = useState<"signIn" | { email: string; name: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user !== undefined) {
      if (user?.role === ROLES.PROFESSIONAL) {
        navigate("/pro");
        return;
      }
      const redirect = searchParams.get("redirect") || redirectAfterAuth || "/";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, user, navigate, redirectAfterAuth, searchParams]);
  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      const name = (formData.get("name") as string).trim();
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string, name });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);

      if (step !== "signIn" && step.name) {
        await updateProfile({ name: step.name });
      }

      if (loginMode === "provider") {
        navigate("/pro/profile");
        return;
      }

      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);

      setError("The verification code you entered is incorrect.");
      setIsLoading(false);

      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Attempting anonymous sign in...");
      await signIn("anonymous");
      console.log("Anonymous sign in successful");
      const redirect = redirectAfterAuth || "/";
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      setError(`Failed to sign in as guest: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  const floatingIcons = [
    { Icon: Wrench, className: "top-[12%] left-[10%]", delay: 0 },
    { Icon: Sparkles, className: "top-[20%] right-[12%]", delay: 1.2 },
    { Icon: Zap, className: "bottom-[18%] left-[14%]", delay: 2.4 },
    { Icon: Droplet, className: "bottom-[24%] right-[9%]", delay: 0.8 },
  ];

  const showcaseServices = [
    { Icon: Sparkles, label: "Home Cleaning", color: "text-blue-500", bg: "bg-blue-500/10" },
    { Icon: Droplet, label: "Plumbing", color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { Icon: Zap, label: "Electrical", color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { Icon: Scissors, label: "Salon & Spa", color: "text-pink-500", bg: "bg-pink-500/10" },
  ];
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setShowcaseIndex((i) => (i + 1) % showcaseServices.length),
      2500,
    );
    return () => clearInterval(interval);
  }, [showcaseServices.length]);
  const CurrentShowcase = showcaseServices[showcaseIndex];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      {/* Animated decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl"
        />
        {floatingIcons.map(({ Icon, className, delay }, i) => (
          <motion.div
            key={i}
            className={`absolute hidden sm:block ${className}`}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 0.25, 0], y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay }}
          >
            <Icon className="w-10 h-10 text-primary" />
          </motion.div>
        ))}
      </div>

      {/* Auth Content */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 max-w-5xl w-full">
          {/* Brand showcase */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center lg:text-left max-w-md"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dukaan Konnect
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-6">
              Home services, on demand — book trusted professionals in
              minutes.
            </p>

            <div className="relative h-48 sm:h-56 w-full max-w-sm mx-auto lg:mx-0 rounded-2xl border bg-card/60 backdrop-blur-sm shadow-xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showcaseIndex}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -10 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                >
                  <div className={`w-16 h-16 rounded-2xl ${CurrentShowcase.bg} flex items-center justify-center`}>
                    <CurrentShowcase.Icon className={`w-8 h-8 ${CurrentShowcase.color}`} />
                  </div>
                  <p className="font-semibold text-lg">{CurrentShowcase.label}</p>
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {showcaseServices.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === showcaseIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex items-center justify-center flex-col"
          >
          <Card className="min-w-[350px] pb-0 border shadow-2xl shadow-primary/10 backdrop-blur-sm bg-card/95">
            <AnimatePresence mode="wait">
              {step === "signIn" ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <CardHeader className="text-center">
                    <motion.div
                      className="flex justify-center"
                      whileHover={{ scale: 1.08, rotate: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src="./logo.svg"
                        alt="Lock Icon"
                        width={64}
                        height={64}
                        className="rounded-lg mb-4 mt-4 cursor-pointer shadow-lg shadow-primary/20"
                        onClick={() => navigate("/")}
                      />
                    </motion.div>
                    <CardTitle className="text-xl">Get Started</CardTitle>
                    <CardDescription>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={loginMode}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.2 }}
                          className="block"
                        >
                          {loginMode === "provider"
                            ? "Sign up to offer your services and receive job requests"
                            : "Enter your email to log in or sign up"}
                        </motion.span>
                      </AnimatePresence>
                    </CardDescription>
                  </CardHeader>

                  <div className="px-6">
                    <div className="relative grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
                      <motion.div
                        className="absolute inset-y-1 w-[calc(50%-4px)] rounded-md bg-background shadow-sm"
                        animate={{ x: loginMode === "customer" ? "0%" : "calc(100% + 8px)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                      <button
                        type="button"
                        onClick={() => setLoginMode("customer")}
                        className={`relative z-10 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
                          loginMode === "customer" ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <User className="w-4 h-4" />
                        Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginMode("provider")}
                        className={`relative z-10 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors ${
                          loginMode === "provider" ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <Briefcase className="w-4 h-4" />
                        Service Provider
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleEmailSubmit}>
                    <CardContent>
                      <div className="relative mb-3">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          name="name"
                          placeholder="Your full name"
                          type="text"
                          className="pl-9 transition-shadow focus-visible:shadow-md focus-visible:shadow-primary/10"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <div className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            className="pl-9 transition-shadow focus-visible:shadow-md focus-visible:shadow-primary/10"
                            disabled={isLoading}
                            required
                          />
                        </div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}>
                          <Button type="submit" variant="outline" size="icon" disabled={isLoading}>
                            {isLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowRight className="h-4 w-4" />
                            )}
                          </Button>
                        </motion.div>
                      </div>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500"
                        >
                          {error}
                        </motion.p>
                      )}

                      <AnimatePresence>
                        {loginMode === "customer" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                  Or
                                </span>
                              </div>
                            </div>

                            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-4"
                                onClick={handleGuestLogin}
                                disabled={isLoading}
                              >
                                <UserX className="mr-2 h-4 w-4" />
                                Continue as Guest
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                >
                  <CardHeader className="text-center mt-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                    >
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </motion.div>
                    <CardTitle>Check your email</CardTitle>
                    <CardDescription>
                      We've sent a code to {step.email}
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleOtpSubmit}>
                    <CardContent className="pb-4">
                      <input type="hidden" name="email" value={step.email} />
                      <input type="hidden" name="code" value={otp} />

                      <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <InputOTP
                          value={otp}
                          onChange={setOtp}
                          maxLength={6}
                          disabled={isLoading}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                              // Find the closest form and submit it
                              const form = (e.target as HTMLElement).closest("form");
                              if (form) {
                                form.requestSubmit();
                              }
                            }
                          }}
                        >
                          <InputOTPGroup>
                            {Array.from({ length: 6 }).map((_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </motion.div>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500 text-center"
                        >
                          {error}
                        </motion.p>
                      )}
                      <p className="text-sm text-muted-foreground text-center mt-4">
                        Didn't receive a code?{" "}
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => setStep("signIn")}
                        >
                          Try again
                        </Button>
                      </p>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                      <motion.div className="w-full" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading || otp.length !== 6}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              Verify code
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep("signIn")}
                        disabled={isLoading}
                        className="w-full"
                      >
                        Use different email
                      </Button>
                    </CardFooter>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
