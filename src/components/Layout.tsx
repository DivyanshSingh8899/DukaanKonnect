import { ReactNode } from 'react';
import { Header } from './Header';
import { ChatWidget } from './ChatWidget';
import { motion } from 'framer-motion';

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
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3">About Us</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for all home services. Quality
                professionals at your doorstep.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Services</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Cleaning</li>
                <li>Plumbing</li>
                <li>Electrical</li>
                <li>Salon & Spa</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Email: support@dukaankonnect.com</li>
                <li>Phone: +91 1800 000 0000</li>
                <li>Available 24/7</li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© 2026 Dukaan Konnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
