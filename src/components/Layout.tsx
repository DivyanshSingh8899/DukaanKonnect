import { ReactNode } from 'react';
import { Header } from './Header';
import { ChatWidget } from './ChatWidget';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1"
      >
        {children}
      </motion.main>
      <ChatWidget />
      <footer className="relative overflow-hidden border-t border-white/10 bg-[#0B1631] text-white py-12 mt-auto">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="container mx-auto px-4 max-w-6xl relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-[#0B1631] font-bold text-sm">
                    DK
                  </span>
                </div>
                <span className="font-semibold tracking-tight">
                  Dukaan<span className="text-blue-400">Konnect</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Your trusted partner for all home services. Quality
                professionals at your doorstep.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-blue-500 hover:text-white transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-white">Services</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>Cleaning</li>
                <li>Plumbing</li>
                <li>Electrical</li>
                <li>Salon & Spa</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-white">Support</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-white">Contact</h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>Email: support.dukaankonnect@gmail.com</li>
                <li>Phone: +91 9115224050</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 text-center text-sm text-slate-400">
            <p>© 2026 Dukaan Konnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}