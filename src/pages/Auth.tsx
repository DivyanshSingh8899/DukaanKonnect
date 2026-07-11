import { Button } from "@/components/ui/button";
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
  BadgeCheck,
  Clock,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Star,
  User,
  UserX,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

const TRUST_POINTS = [
  {
    Icon: BadgeCheck,
    title: "Verified professionals",
    text: "Every provider is identity-checked and background-verified before they take a job.",
  },
  {
    Icon: Clock,
    title: "On-time, on demand",
    text: "Book in minutes and track your professional from confirmation to doorstep.",
  },
  {
    Icon: Lock,
    title: "Secure payments",
    text: "Payments are held in escrow and released only after the job is done.",
  },
  {
    Icon: Star,
    title: "Trust-score ranking",
    text: "Providers are ranked by real service quality, never by paid placement.",
  },
];

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, user, signIn } = useAuth();
  const updateProfile = useMutation(updateProfileRef);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<"signIn" | { email: string; name: string }>(
    "signIn",
  );
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
  }, [
    authLoading,
    isAuthenticated,
    user,
    navigate,
    redirectAfterAuth,
    searchParams,
  ]);

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
      // signIn succeeded → OTP was correct.
      // Update the profile, but don't treat its failure as a bad OTP.
      if (step !== "signIn" && step.name) {
        try {
          await updateProfile({ name: step.name });
        } catch (profileErr) {
          console.error("Profile update failed (non-fatal):", profileErr);
        }
      }
      // Do NOT navigate here — the useEffect handles redirect
      // once isAuthenticated flips. Leave isLoading true so the
      // spinner stays until the redirect completes.
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
      setError(
        `Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 lg:grid lg:grid-cols-[minmax(0,44%)_minmax(0,56%)]">
      {/* ============ LEFT — BRAND / TRUST PANEL (desktop) ============ */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#0B1631] text-white">
        {/* quiet geometric texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10 px-10 xl:px-14 pt-10">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md"
          >
            <img
              src="./logo.svg"
              alt="DukaanKonnect logo"
              width={40}
              height={40}
              className="rounded-md bg-white p-1"
            />
            <span className="text-lg font-semibold tracking-tight">
              Dukaan<span className="text-blue-400">Konnect</span>
            </span>
          </button>
        </div>

        <div className="relative z-10 px-10 xl:px-14 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight"
          >
            Home services you can
            <br />
            actually trust.
          </motion.h1>
          <p className="mt-3 max-w-md text-sm xl:text-base text-slate-300">
            Book verified professionals for cleaning, plumbing, electrical work
            and more — with zero commission and transparent pricing.
          </p>

          <ul className="mt-10 space-y-6 max-w-md">
            {TRUST_POINTS.map(({ Icon, title, text }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 ring-1 ring-inset ring-blue-400/30">
                  <Icon className="h-[18px] w-[18px] text-blue-300" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-400">
                    {text}
                  </span>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 border-t border-white/10 px-10 xl:px-14 py-5">
          <p className="text-xs text-slate-400">
            Zero commission · Escrow-protected payments · Masked phone numbers
          </p>
        </div>
      </aside>

      {/* ============ RIGHT — AUTH FORM ============ */}
      <main className="flex min-h-screen flex-col">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 lg:hidden">
          <img
            src="./logo.svg"
            alt="DukaanKonnect logo"
            width={32}
            height={32}
            className="rounded-md cursor-pointer"
            onClick={() => navigate("/")}
          />
          <span className="text-base font-semibold tracking-tight">
            Dukaan<span className="text-blue-600">Konnect</span>
          </span>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px]">
            <AnimatePresence mode="wait">
              {step === "signIn" ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Heading */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      Welcome
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Sign in or create an account to get started.
                    </p>
                  </div>

                  {/* Email form */}
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="auth-name"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Full name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="auth-name"
                          name="name"
                          placeholder="Enter your full name"
                          type="text"
                          autoComplete="name"
                          className="h-11 pl-9 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="auth-email"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="auth-email"
                          name="email"
                          placeholder="name@example.com"
                          type="email"
                          autoComplete="email"
                          className="h-11 pl-9 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500">
                        We'll email you a 6-digit verification code.
                      </p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                        className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                      >
                        {error}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending code...
                        </>
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  {/* Guest login */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-3 text-xs uppercase tracking-wide text-slate-400">
                        or
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="h-11 w-full border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Continue as guest
                  </Button>

                  <p className="mt-8 text-center text-xs leading-relaxed text-slate-400">
                    By continuing, you agree to DukaanKonnect's{" "}
                    <a
                      href="/terms"
                      className="font-medium text-slate-600 underline underline-offset-2 hover:text-blue-600"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="font-medium text-slate-600 underline underline-offset-2 hover:text-blue-600"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 ring-1 ring-inset ring-blue-100">
                      <ShieldCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      Verify your email
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                      We've sent a 6-digit code to{" "}
                      <span className="font-medium text-slate-900">
                        {step.email}
                      </span>
                    </p>
                  </div>

                  <form onSubmit={handleOtpSubmit}>
                    <input type="hidden" name="email" value={step.email} />
                    <input type="hidden" name="code" value={otp} />

                    <div className="flex justify-center">
                      <InputOTP
                        value={otp}
                        onChange={setOtp}
                        maxLength={6}
                        disabled={isLoading}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            otp.length === 6 &&
                            !isLoading
                          ) {
                            const form = (e.target as HTMLElement).closest(
                              "form",
                            );
                            if (form) {
                              form.requestSubmit();
                            }
                          }
                        }}
                      >
                        <InputOTPGroup className="gap-2">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="h-12 w-11 rounded-md border border-slate-300 text-lg font-semibold first:rounded-l-md last:rounded-r-md data-[active=true]:border-blue-500 data-[active=true]:ring-2 data-[active=true]:ring-blue-500/30"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        role="alert"
                        className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-700"
                      >
                        {error}
                      </motion.div>
                    )}

                    <p className="mt-5 text-center text-sm text-slate-500">
                      Didn't receive the code?{" "}
                      <Button
                        variant="link"
                        className="h-auto p-0 text-blue-600"
                        onClick={() => setStep("signIn")}
                      >
                        Resend code
                      </Button>
                    </p>

                    <div className="mt-6 space-y-3">
                      <Button
                        type="submit"
                        disabled={isLoading || otp.length !== 6}
                        className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify and continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setStep("signIn")}
                        disabled={isLoading}
                        className="h-11 w-full text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Use a different email
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile trust strip */}
        <footer className="border-t border-slate-200 px-5 py-4 lg:hidden">
          <div className="flex items-center justify-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
              Verified pros
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-blue-600" />
              Secure payments
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-blue-600" />
              Trust-score ranked
            </span>
          </div>
        </footer>
      </main>
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
