import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Star, Shield, Clock, ClipboardList, CalendarCheck, Sparkles, Quote } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { CategoryCard } from '@/components/CategoryCard';
import { ServiceCard } from '@/components/ServiceCard';
import { FoundingTeam } from '@/components/FoundingTeam';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { useQuery } from 'convex/react';
import { categoriesListRef, servicesListFeaturedRef } from '@/lib/convexRefs';
import { useNavigate } from 'react-router';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = useQuery(categoriesListRef, {});
  const allFeaturedServices = useQuery(servicesListFeaturedRef, {});
  // Cap to a multiple of the grid's column count so the row is always full.
  const featuredServices = allFeaturedServices?.slice(0, 4);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Verified Professionals',
      description: 'Background checked & trained experts',
    },
    {
      icon: Star,
      title: 'Quality Service',
      description: 'Rated 4.8 stars by 50+ customers',
    },
    {
      icon: Clock,
      title: 'On-Time Guarantee',
      description: '90% services completed on time',
    },
  ];

  return (
    <Layout>
      {/* Hero Section — navy, matches Auth brand panel */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-[#0B1631] via-[#0d1b3d] to-[#0B1631] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.15, 1, 1.15], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-blue-500/15 blur-3xl"
          />
        </div>

        <div className="container mx-auto max-w-6xl px-4 relative w-full">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left column — copy, search, trust row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-sm text-slate-300 ring-1 ring-inset ring-white/10">
                <Sparkles className="h-4 w-4 text-blue-300" />
                Trusted by 50+ happy customers
              </div>

              <h1 className="mb-5 text-4xl font-bold tracking-tight md:text-6xl">
                Home services you can
                <br className="hidden sm:block" /> actually{' '}
                <span className="text-green-400">trust</span>.
              </h1>
              <p className="mb-8 text-lg text-slate-300 md:text-xl">
                Book verified professionals for home cleaning, repairs, beauty
                and more — at prices you can see upfront.
              </p>

              {/* Search Bar */}
              <div className="mb-6 rounded-2xl bg-white p-2 shadow-2xl shadow-black/30 sm:flex sm:items-center sm:gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="h-12 border-none bg-transparent pl-11 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="mt-2 h-12 w-full rounded-xl bg-blue-600 px-8 text-white hover:bg-blue-700 sm:mt-0 sm:w-auto"
                >
                  Search
                </Button>
              </div>

              {/* Popular searches */}
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <span className="text-sm text-slate-400">Popular:</span>
                {['Home Cleaning', 'AC Repair', 'Salon at Home', 'Plumbing'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() =>
                        navigate(`/services?search=${encodeURIComponent(term)}`)
                      }
                      className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-200 ring-1 ring-inset ring-white/10 transition hover:bg-white/10"
                    >
                      {term}
                    </button>
                  ),
                )}
              </div>
            </motion.div>

            {/* Right column — illustration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative mx-auto hidden w-full max-w-lg lg:block"
            >
              {/* Glow behind the illustration */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-blue-500/10 blur-3xl" />

              <motion.div
                // animate={{ y: [0, -12, 0] }}
                // transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <svg
                  viewBox="0 0 480 420"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                  role="img"
                  aria-label="Trusted home services illustration"
                >
                  <defs>
                    <linearGradient id="hsRoof" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#3b82f6" />
                      <stop offset="1" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="hsWall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
                      <stop offset="1" stopColor="#ffffff" stopOpacity="0.04" />
                    </linearGradient>
                  </defs>

                  {/* Ground */}
                  <ellipse cx="240" cy="372" rx="180" ry="26" fill="#3b82f6" opacity="0.12" />

                  {/* House body */}
                  <rect x="120" y="190" width="240" height="170" rx="14" fill="url(#hsWall)" stroke="#60a5fa" strokeOpacity="0.4" strokeWidth="2" />

                  {/* Roof */}
                  <path d="M104 196 L240 96 L376 196 Z" fill="url(#hsRoof)" />
                  <path d="M104 196 L240 96 L376 196 Z" fill="#ffffff" opacity="0.06" />

                  {/* Door */}
                  <rect x="212" y="270" width="56" height="90" rx="8" fill="#22c55e" opacity="0.85" />
                  <circle cx="256" cy="316" r="4" fill="#0B1631" />

                  {/* Windows */}
                  <rect x="150" y="228" width="46" height="46" rx="8" fill="#60a5fa" opacity="0.4" />
                  <rect x="284" y="228" width="46" height="46" rx="8" fill="#60a5fa" opacity="0.4" />
                  <path d="M173 228 v46 M150 251 h46" stroke="#0B1631" strokeOpacity="0.5" strokeWidth="2" />
                  <path d="M307 228 v46 M284 251 h46" stroke="#0B1631" strokeOpacity="0.5" strokeWidth="2" />

                  {/* Verified badge */}
                  <g>
                    <circle cx="356" cy="150" r="34" fill="#22c55e" />
                    <circle cx="356" cy="150" r="34" fill="#ffffff" opacity="0.1" />
                    <path d="M342 150 l9 9 l17 -18" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </g>

                  {/* Floating tool chip — wrench */}
                  <g transform="translate(92 120)">
                    <rect x="-26" y="-26" width="52" height="52" rx="14" fill="#ffffff" fillOpacity="0.08" stroke="#60a5fa" strokeOpacity="0.4" strokeWidth="1.5" />
                    <path d="M-8 8 L8 -8 M6 -14 a10 10 0 1 0 8 8 l-6 6 -4 -4 6 -6 z" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </g>

                  {/* Floating tool chip — spark/clean */}
                  <g transform="translate(410 268)">
                    <rect x="-26" y="-26" width="52" height="52" rx="14" fill="#ffffff" fillOpacity="0.08" stroke="#60a5fa" strokeOpacity="0.4" strokeWidth="1.5" />
                    <path d="M0 -14 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill="#86efac" />
                  </g>

                  {/* Location pin */}
                  <g transform="translate(96 300)">
                    <path d="M0 -18 a14 14 0 0 1 14 14 c0 10 -14 22 -14 22 s-14 -12 -14 -22 a14 14 0 0 1 14 -14 z" fill="#3b82f6" />
                    <circle cx="0" cy="-4" r="5" fill="#0B1631" />
                  </g>
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '50+', label: 'Happy Customers' },
              { value: '25+', label: 'Verified Professionals' },
              { value: '12+', label: 'Cities Covered' },
              { value: '4.8/5', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
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

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Browse by Category
              </h2>
              <p className="text-muted-foreground">
                Choose from {categories?.length ?? 0}+ categories
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/services')}
              className="hidden md:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              View All
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

      {/* Featured Services Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Featured Services
              </h2>
              <p className="text-muted-foreground">
                Most popular services this month
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/services')}
              className="hidden md:flex text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {featuredServices === undefined ? (
            <SkeletonGrid count={4} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Book a trusted professional in three simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: ClipboardList,
                title: 'Choose a Service',
                description: 'Browse categories and pick the service you need',
              },
              {
                icon: CalendarCheck,
                title: 'Book a Slot',
                description: 'Select a date, time, and your preferred professional',
              },
              {
                icon: Sparkles,
                title: 'Get It Done',
                description: 'A verified expert arrives and completes the job',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground">
              Real feedback from real bookings
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Anjali Mehta',
                city: 'Mumbai',
                text: 'Booked a deep cleaning and the professional was on time, polite, and thorough. Will definitely book again.',
              },
              {
                name: 'Rohit Sharma',
                city: 'Bangalore',
                text: 'Fixed my AC within an hour of booking. Transparent pricing and no surprise charges.',
              },
              {
                name: 'Priya Nair',
                city: 'Pune',
                text: 'Loved the salon-at-home experience. Easy booking, great service, highly recommend Dukaan Konnect.',
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
                            className="w-3.5 h-3.5 fill-blue-500 text-blue-500"
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

      {/* <FoundingTeam /> */}

      {/* CTA Section — navy bookend, mirrors hero */}
      <section className="relative overflow-hidden py-16 md:py-20 bg-[#0B1631] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1.5px, transparent 1.5px)',
            backgroundSize: '24px 24px',
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
              Ready to Book a Service?
            </h2>
            <p className="text-lg mb-8 text-slate-300">
              Join thousands of satisfied customers who trust us for their home
              service needs
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/services')}
              className="px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              Explore Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}