import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Moon,
  Sun,
  LayoutDashboard,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from 'convex/react';
import { bookingsListMineRef } from '@/lib/convexRefs';
import { getInitials } from '@/lib/utils';
import { ROLES } from '@/convex/schema';
import { useTheme } from 'next-themes';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const isProfessional = user?.role === ROLES.PROFESSIONAL;
  const isAdmin = user?.role === ROLES.ADMIN;

  const pendingCount = useQuery(
    bookingsListMineRef,
    isAuthenticated && !isProfessional ? { status: 'pending' } : 'skip'
  )?.length ?? 0;

  const navItems = isProfessional
    ? [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/pro' },
        { label: 'My Profile', icon: User, path: '/pro/profile' },
      ]
    : [
        { label: 'Home', icon: Home, path: '/' },
        { label: 'Services', icon: Search, path: '/services' },
        { label: 'Orders', icon: ShoppingBag, path: '/orders' },
        ...(isAdmin ? [{ label: 'Admin', icon: ShieldCheck, path: '/admin' }] : []),
        { label: 'Profile', icon: User, path: '/profile' },
      ];

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <div className="w-9 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm tracking-tight">
                  DK
                </span>
              </div>
              <span className="ml-2 text-xl font-bold hidden sm:inline-block">
                Dukaan Konnect
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className="relative"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
                {item.label === 'Orders' && pendingCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {pendingCount}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Avatar - Desktop */}
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(isProfessional ? '/pro/profile' : '/profile')}
                className="hidden md:flex"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.image ?? undefined} alt={user.name ?? 'User'} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                  {item.label === 'Orders' && pendingCount > 0 && (
                    <Badge variant="destructive" className="ml-auto">
                      {pendingCount}
                    </Badge>
                  )}
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
