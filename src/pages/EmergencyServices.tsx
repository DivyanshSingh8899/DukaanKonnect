import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  Zap,
  Droplet,
  Wind,
  Flame,
  KeyRound,
  Wrench,
  Waves,
  Bug,
  ShieldCheck,
  MapPinned,
  Lock,
  Clock,
  PhoneCall,
  Siren,
  ArrowRight,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EmergencyCategory {
  title: string;
  description: string;
  icon: typeof Zap;
  href: string;
}

const EMERGENCY_CATEGORIES: EmergencyCategory[] = [
  {
    title: 'Electrical Emergency',
    description: 'Sparking wires, sudden outages, or short circuits handled by a certified electrician, fast.',
    icon: Zap,
    href: '/services?category=electrical',
  },
  {
    title: 'Plumbing Leak',
    description: 'Burst pipes or major leaks causing flooding? We stop the damage before it spreads.',
    icon: Droplet,
    href: '/services?category=plumbing',
  },
  {
    title: 'AC Breakdown',
    description: 'AC given up in the heat? Emergency cooling repair to get your home comfortable again.',
    icon: Wind,
    href: '/services?category=appliance-repair',
  },
  {
    title: 'Gas Leak Assistance',
    description: 'Smell gas or suspect a leak? Get immediate professional assistance for your safety.',
    icon: Flame,
    href: '/services?search=gas',
  },
  {
    title: 'Locksmith',
    description: 'Locked out or a broken lock? A verified locksmith is dispatched right away.',
    icon: KeyRound,
    href: '/services?search=lock',
  },
  {
    title: 'Appliance Repair',
    description: 'Fridge, washing machine, or geyser down? Fast repairs at your doorstep.',
    icon: Wrench,
    href: '/services?category=appliance-repair',
  },
  {
    title: 'Water Tank Overflow',
    description: 'Overflowing tank wasting water and damaging your property? Get it fixed immediately.',
    icon: Waves,
    href: '/services?search=water tank',
  },
  {
    title: 'Pest Emergency',
    description: 'Sudden infestation taking over? Rapid pest control before it spreads further.',
    icon: Bug,
    href: '/services?category=pest-control',
  },
];

const TRUST_INDICATORS = [
  { label: 'Verified Professionals', icon: ShieldCheck },
  { label: 'Live Tracking', icon: MapPinned },
  { label: 'Secure Payments', icon: Lock },
];

export default function EmergencyServices() {
  const navigate = useNavigate();

  const scrollToCategories = () => {
    document.getElementById('emergency-categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0B1631] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div
          className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent 70%)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
        />

        <div className="container relative mx-auto max-w-6xl px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/15">
              24/7 Emergency Response
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              🚨 Emergency Home Services – Help When You Need It Most
            </h1>
            <p className="text-slate-300 text-base md:text-lg mb-8 max-w-xl">
              Facing a plumbing leak, electrical fault, AC breakdown, locksmith emergency, or any
              urgent home issue? DukaanKonnect connects you with the nearest verified professional
              in just a few taps.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                size="lg"
                onClick={scrollToCategories}
                className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg shadow-red-500/30"
              >
                <Siren className="w-4 h-4" />
                Request Emergency Service
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
              >
                <a href="tel:+919115224050">
                  <PhoneCall className="w-4 h-4" />
                  Call Support
                </a>
              </Button>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-2 text-sm font-medium mb-8">
              <Clock className="w-4 h-4" />
              Estimated Arrival: 30–45 minutes*
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {TRUST_INDICATORS.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: SOS illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative flex items-center justify-center h-72 sm:h-96"
          >
            {/* Orbiting category icons */}
            {[Zap, Droplet, Wind, KeyRound].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute w-12 h-12 rounded-2xl bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center text-white"
                style={{
                  top: i % 2 === 0 ? '10%' : undefined,
                  bottom: i % 2 !== 0 ? '10%' : undefined,
                  left: i < 2 ? '5%' : undefined,
                  right: i >= 2 ? '5%' : undefined,
                }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            ))}

            {/* Pulse rings */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border-2 border-red-500/40"
                style={{ width: 160, height: 160 }}
                animate={{ scale: [1, 2.1], opacity: [0.6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
              />
            ))}

            {/* SOS button */}
            <motion.button
              type="button"
              onClick={scrollToCategories}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-2xl shadow-red-500/50 flex flex-col items-center justify-center text-white cursor-pointer"
            >
              <Siren className="w-8 h-8 mb-1" />
              <span className="text-xl sm:text-2xl font-bold tracking-wide">SOS</span>
              <span className="text-[11px] text-white/80">Tap for help</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Emergency Categories */}
      <section id="emergency-categories" className="container mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">What's the emergency?</h2>
          <p className="text-muted-foreground">
            Pick a category and we'll connect you with the nearest available professional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EMERGENCY_CATEGORIES.map(({ title, description, icon: Icon, href }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group flex flex-col rounded-2xl border bg-card p-6 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-red-50 group-hover:text-red-500 transition-colors">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground mb-5 flex-1">{description}</p>
              <Button
                variant="outline"
                className="rounded-full justify-between hover:bg-blue-600 hover:text-white hover:border-blue-600"
                onClick={() => navigate(href)}
              >
                Request Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
