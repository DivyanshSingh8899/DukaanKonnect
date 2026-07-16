import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  Star,
  Shield,
  BadgeCheck,
  ClipboardList,
  CalendarCheck,
  Sparkles,
  Quote,
  MapPin,
  Wrench,
  Droplet,
  Home as HomeIcon,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { CategoryCard } from "@/components/CategoryCard";
import { ServiceCard } from "@/components/ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { useQuery } from "convex/react";
import { categoriesListRef, servicesListFeaturedRef } from "@/lib/convexRefs";
import { useNavigate } from "react-router";

// Mock feed for the hero's live-ledger signature element.
// Swap for a real `bookingsRecentRef` query whenever one exists — shape is intentionally simple.
const LIVE_FEED = [
  { name: "Rohit S.", service: "AC Repair", city: "Bengaluru", icon: Wrench },
  {
    name: "Anjali M.",
    service: "Deep Cleaning",
    city: "Mumbai",
    icon: Sparkles,
  },
  { name: "Priya N.", service: "Salon at Home", city: "Pune", icon: HomeIcon },
  { name: "Karan V.", service: "Plumbing", city: "Delhi", icon: Droplet },
  { name: "Sara T.", service: "Pest Control", city: "Chennai", icon: Shield },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedIndex, setFeedIndex] = useState(0);
  const navigate = useNavigate();

  const categories = useQuery(categoriesListRef, {});
  const allFeaturedServices = useQuery(servicesListFeaturedRef, {});
  const featuredServices = allFeaturedServices?.slice(0, 4);

  useEffect(() => {
    const t = setInterval(
      () => setFeedIndex((i) => (i + 1) % LIVE_FEED.length),
      2800,
    );
    return () => clearInterval(t);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const visibleFeed = [0, 1, 2].map(
    (offset) => LIVE_FEED[(feedIndex + offset) % LIVE_FEED.length],
  );

  return (
    <Layout>
      {/* ============ HERO — theme-aware black/white, blue/emerald accents ============ */}
      <section className="relative overflow-hidden bg-background text-foreground">
        {/* subtle grain — dark mode only, invisible/negligible on white */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-overlay dark:opacity-[0.4]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
          }}
        />
        {/* hairline grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.06]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>
        {/* colored glows */}
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -top-24 left-1/3 w-[26rem] h-[26rem] rounded-full bg-blue-600/20 blur-[100px]"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.22, 0.1] }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="pointer-events-none absolute -bottom-32 right-0 w-[28rem] h-[28rem] rounded-full bg-emerald-500/15 blur-[110px]"
        />

        <div className="container mx-auto max-w-6xl px-4 relative pt-20 pb-0 md:pt-28">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Copy + search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-1.5 text-sm text-muted-foreground ring-1 ring-inset ring-foreground/10">
                <BadgeCheck className="h-4 w-4 text-emerald-500" />
                Every professional background-checked before day one
              </div>

              <h1 className="mb-8 font-bold tracking-tighter leading-[0.92] text-[13vw] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                Book it.
                <br />
                <span className="text-blue-600">Verified.</span>{" "}
                <span className="text-emerald-500">Done.</span>
              </h1>

              <p className="mb-10 text-lg md:text-xl text-muted-foreground max-w-lg">
                Cleaning, repairs, beauty and more — a background-checked pro,
                upfront pricing, no phone calls.
              </p>

              <div className="mb-6 flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-1 border border-foreground/15 focus-within:border-blue-600 transition-colors rounded-xl">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="What do you need done?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-14 border-none bg-transparent pl-11 text-base text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="h-14 px-8 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                >
                  Search
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  "Home Cleaning",
                  "AC Repair",
                  "Salon at Home",
                  "Plumbing",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() =>
                      navigate(`/services?search=${encodeURIComponent(term)}`)
                    }
                    className="rounded-full border border-foreground/15 px-3.5 py-1.5 text-sm text-muted-foreground transition hover:border-emerald-500/50 hover:text-foreground"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Signature element: trust panel — stamp + stacked metrics, fills the right column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="hidden lg:block relative"
            >
              <div className="relative rounded-2xl border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm p-8 pt-10">
                {/* rotating stamp, centered up top */}
                <div className="relative h-40 w-40 mx-auto mb-8">
                  <motion.svg
                    viewBox="0 0 200 200"
                    className="absolute inset-0 h-full w-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 22,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <defs>
                      <path
                        id="stampCircle"
                        d="M 100,100 m -80,0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                      />
                    </defs>
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#3B82F6"
                      strokeOpacity="0.35"
                      strokeWidth="1"
                    />
                    <text
                      fontSize="12.5"
                      fill="#3B82F6"
                      fillOpacity="0.75"
                      letterSpacing="2"
                    >
                      <textPath href="#stampCircle">
                        VERIFIED PROS &#8226; UPFRONT PRICING &#8226; ALWAYS ON TIME &#8226; SHOWS UP ON TIME &#8226;
                      </textPath>
                    </text>
                  </motion.svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
                      <BadgeCheck
                        className="h-8 w-8 text-emerald-500"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                </div>

                {/* stacked metric rows */}
                <div className="space-y-1">
                  {[
                    {
                      label: "Verified professionals",
                      value: "25+",
                      color: "text-blue-600",
                    },
                    {
                      label: "Cities covered",
                      value: "12+",
                      color: "text-emerald-500",
                    },
                    {
                      label: "Average rating",
                      value: "4.8/5",
                      color: "text-blue-600",
                    },
                    {
                      label: "Avg. response time",
                      value: "< 30 min",
                      color: "text-emerald-500",
                    },
                  ].map((row, i) => (
                    <motion.div
                      key={row.label}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.35 }}
                      className="flex items-center justify-between py-3 border-t border-foreground/10 first:border-t-0"
                    >
                      <span className="text-sm text-muted-foreground">
                        {row.label}
                      </span>
                      <span className={`text-sm font-semibold ${row.color}`}>
                        {row.value}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
          {/* Inverted marquee strip */}
          <div className="relative mt-16 md:mt-20 border-t border-foreground/10">
            <div className="overflow-hidden bg-foreground text-background">
              <motion.div
                className="flex whitespace-nowrap py-4 text-sm md:text-base font-medium tracking-tight"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              >
                {Array.from({ length: 2 }).map((_, loop) => (
                  <span key={loop} className="flex items-center">
                    {[
                      "Home Cleaning",
                      "AC Repair",
                      "Salon at Home",
                      "Plumbing",
                      "Electrical",
                      "Pest Control",
                      "Painting",
                      "Appliance Repair",
                    ].map((s, i) => (
                      <span key={s} className="flex items-center">
                        <span className="px-6">{s}</span>
                        <span
                          className={
                            i % 2 === 0 ? "text-blue-500" : "text-emerald-500"
                          }
                        >
                          &#9670;
                        </span>
                      </span>
                    ))}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="bg-background border-b">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "50+", label: "Happy Customers" },
              { value: "25+", label: "Verified Professionals" },
              { value: "12+", label: "Cities Covered" },
              { value: "4.8/5", label: "Average Rating" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.4 }}
              >
                <p className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="py-14 md:py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">
                Categories
              </p>
              <h2 className="text-2xl md:text-3xl font-bold">
                Browse by category
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/services")}
              className="hidden md:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {categories === undefined ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ FEATURED SERVICES ============ */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">
                This month
              </p>
              <h2 className="text-2xl md:text-3xl font-bold">
                Featured services
              </h2>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/services")}
              className="hidden md:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {featuredServices === undefined ? (
            <SkeletonGrid count={4} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ HOW IT WORKS — connected path ============ */}
      <section className="py-14 md:py-20 bg-[#0B1631] text-white relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="container mx-auto max-w-5xl px-4 relative">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-2">
              Three steps, no calls
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              From "I need this fixed" to done
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            <div className="hidden md:block absolute top-8 left-[16.5%] right-[16.5%] h-px bg-linear-to-r from-blue-500/40 via-emerald-400/40 to-blue-500/40" />
            {[
              {
                icon: ClipboardList,
                title: "Choose a service",
                description:
                  "Pick from verified categories with upfront pricing.",
              },
              {
                icon: CalendarCheck,
                title: "Pick a time",
                description: "Choose a slot and your preferred professional.",
              },
              {
                icon: Sparkles,
                title: "It gets done",
                description: "A background-checked pro shows up and delivers.",
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="relative text-center"
              >
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#0B1631] border-2 border-blue-500/50 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-slate-400 max-w-55 mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="py-14 md:py-20 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">
              Reviews
            </p>
            <h2 className="text-2xl md:text-3xl font-bold">
              What customers say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Anjali Mehta",
                city: "Mumbai",
                text: "Booked a deep cleaning and the professional was on time, polite, and thorough. Will definitely book again.",
              },
              {
                name: "Rohit Sharma",
                city: "Bangalore",
                text: "Fixed my AC within an hour of booking. Transparent pricing and no surprise charges.",
              },
              {
                name: "Priya Nair",
                city: "Pune",
                text: "Loved the salon-at-home experience. Easy booking, great service, highly recommend Dukaan Konnect.",
              },
            ].map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6 px-6 pb-6">
                    <Quote className="w-6 h-6 text-blue-600/40 mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      {review.text}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{review.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.city}
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden py-16 md:py-20 bg-[#0B1631] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container mx-auto px-4 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to book a service?
            </h2>
            <p className="text-lg mb-8 text-slate-300">
              Join thousands of satisfied customers who trust us for their home
              service needs.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/services")}
              className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              Explore services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
