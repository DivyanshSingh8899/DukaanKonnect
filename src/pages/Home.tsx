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
import { api } from '@/convex/_generated/api';
import { useNavigate } from 'react-router';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = useQuery(api.categories.list);
  const allFeaturedServices = useQuery(api.services.listFeatured);
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
      description: 'Rated 4.8 stars by 50,000+ customers',
    },
    {
      icon: Clock,
      title: 'On-Time Guarantee',
      description: '90% services completed on time',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.15, 1, 1.15], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl"
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Home Services at Your Doorstep
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Book trusted professionals for home cleaning, repairs, beauty and more
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search for services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button onClick={handleSearch} size="lg" className="px-8">
                  Search
                </Button>
              </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="inline-block">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm">
                          {feature.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '50,000+', label: 'Happy Customers' },
              { value: '2,500+', label: 'Verified Professionals' },
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
                <p className="text-2xl md:text-3xl font-bold text-primary mb-1">
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
        <div className="container mx-auto px-4">
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
              className="hidden md:flex"
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
        <div className="container mx-auto px-4">
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
              className="hidden md:flex"
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
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
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
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
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
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
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
                    <Quote className="w-6 h-6 text-primary/40 mb-3" />
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
                            className="w-3.5 h-3.5 fill-accent text-accent"
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

      <FoundingTeam />

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 md:py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
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
            <p className="text-lg mb-8 opacity-90">
              Join thousands of satisfied customers who trust us for their home
              service needs
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/services')}
              className="px-8"
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
