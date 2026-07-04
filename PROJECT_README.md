# UrbanClone - Professional Home Services Platform

A complete, production-ready frontend web application inspired by Urban Company. Built with modern web technologies and designed for a pixel-perfect, startup-level user experience.

![Urban Clone](https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop)

## 🚀 Live Demo

Visit the live application to see all features in action.

## ✨ Features

### 🏠 Home Page
- **Hero Section** with dynamic search functionality
- **Category Grid** with 8+ service categories
- **Featured Services** showcase
- **Feature Pills** highlighting key benefits
- **Call-to-Action** sections

### 🔍 Services Listing
- **Advanced Filtering** by category, price range, and ratings
- **Dynamic Search** with real-time results
- **Multiple Sort Options** (Popular, Rating, Price)
- **Active Filter Display** with quick removal
- **Empty States** for better UX
- **Responsive Grid Layout**

### 📅 Booking Flow
- **4-Step Booking Process**:
  1. Service Selection
  2. Date & Time Picker with availability
  3. Professional Selection with profiles
  4. Address & Summary Review
- **Progress Indicator** with visual feedback
- **Price Summary Sidebar** (sticky on desktop)
- **Form Validation** at each step
- **Smooth Animations** between steps

### 📦 Orders Management
- **Tabbed Interface** (All, Upcoming, Completed)
- **Order Cards** with detailed information
- **Status Badges** with color coding
- **Professional Contact** quick access
- **Book Again** functionality
- **Empty States** for each tab

### 👤 Profile & Settings
- **Profile Information** editing
- **Avatar Display** with fallback
- **Saved Addresses** management
- **Notification Preferences** (Email, SMS, Push)
- **Account Settings** access
- **Logout Functionality**

### 🎨 Design & UX
- **Modern Theme** with carefully chosen color palette
- **Dark Mode Support** with smooth transitions
- **Responsive Design** (Mobile-first approach)
- **Framer Motion Animations** throughout
- **Skeleton Loaders** for better perceived performance
- **Empty States** with actionable CTAs
- **Consistent Spacing & Typography**

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Framer Motion** - Production-ready animations
- **Lucide Icons** - Beautiful icon set
- **next-themes** - Dark mode support

### State Management
- **Zustand** - Lightweight state management
  - User Store (with persistence)
  - Booking Store
  - Cart Store (with persistence)

### Additional Libraries
- **date-fns** - Modern date utility library
- **react-day-picker** - Date picker component
- **sonner** - Beautiful toast notifications
- **Convex** - Backend/Database (configured but using dummy data)

## 📁 Project Structure

```
src/
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   ├── Header.tsx       # Navigation header
│   ├── Layout.tsx       # Page layout wrapper
│   ├── ServiceCard.tsx  # Service display card
│   ├── CategoryCard.tsx # Category display card
│   ├── LoadingSpinner.tsx
│   └── EmptyState.tsx
├── pages/               # Route pages
│   ├── Home.tsx         # Landing page
│   ├── Services.tsx     # Service listing
│   ├── Booking.tsx      # Booking flow
│   ├── Orders.tsx       # Order history
│   ├── Profile.tsx      # User profile
│   ├── Auth.tsx         # Authentication
│   └── NotFound.tsx     # 404 page
├── store/               # Zustand stores
│   ├── useUserStore.ts
│   ├── useBookingStore.ts
│   └── useCartStore.ts
├── data/                # Data & Constants
│   └── dummy.ts         # Mock data
├── types/               # TypeScript types
│   └── index.ts
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
└── index.css            # Global styles & theme
```

## 🎨 Design System

### Color Palette (Modern Theme)
- **Primary**: Purple-blue gradient (oklch color space)
- **Accent**: Green for success/featured items
- **Secondary**: Light gray for backgrounds
- **Destructive**: Red for errors/warnings

### Typography
- **Headings**: Bold, large sizes with proper hierarchy
- **Body**: Clean, readable with consistent line-height
- **Small Text**: Muted foreground for secondary info

### Spacing
- Consistent 4px/8px/12px/16px/24px scale
- Container max-width with responsive padding
- Card padding: 16px (mobile) to 24px (desktop)

### Components
- **Rounded Corners**: 12px (lg radius)
- **Shadows**: Subtle on hover, pronounced on cards
- **Transitions**: 200-300ms duration with ease curves
- **Animations**: Stagger effects on lists, smooth page transitions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codebase
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Start development server:
```bash
pnpm dev
```

5. Open browser:
```
http://localhost:5173
```

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## 🎯 Key Features Implementation

### State Management (Zustand)

```typescript
// User Store - Persisted
const user = useUserStore((state) => state.user);
const updateProfile = useUserStore((state) => state.updateProfile);

// Booking Store - Session-based
const { service, date, timeSlot } = useBookingStore();
const setService = useBookingStore((state) => state.setService);

// Cart Store - Persisted
const items = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addItem);
```

### Routing

```typescript
// All routes are lazy-loaded for better performance
<Route path="/" element={<Home />} />
<Route path="/services" element={<Services />} />
<Route path="/booking" element={<Booking />} />
<Route path="/orders" element={<Orders />} />
<Route path="/profile" element={<Profile />} />
```

### Dark Mode

```typescript
// Toggle theme anywhere in the app
import { useTheme } from 'next-themes';
const { theme, setTheme } = useTheme();
setTheme(theme === 'dark' ? 'light' : 'dark');
```

### Animations

```typescript
// Framer Motion for smooth animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🎭 Component Examples

### Service Card
```typescript
<ServiceCard service={service} index={0} />
```
- Displays service image, name, price, rating
- Hover animations
- Click navigates to booking flow

### Category Card
```typescript
<CategoryCard category={category} index={0} />
```
- Icon display with background
- Service count
- Click navigates to filtered services

### Empty State
```typescript
<EmptyState
  icon={Package}
  title="No orders yet"
  description="Start booking services"
  action={{ label: "Browse Services", onClick: handleClick }}
/>
```

## 🔐 Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  savedAddresses: Address[];
}
```

### Service
```typescript
interface Service {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  price: number;
  duration: number;
  rating: number;
  reviewCount: number;
  image: string;
  featured: boolean;
}
```

### Order
```typescript
interface Order {
  id: string;
  service: Service;
  professional: Professional;
  date: string;
  time: string;
  status: OrderStatus;
  totalAmount: number;
  address: string;
}
```

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize the color scheme:
```css
:root {
  --primary: oklch(0.42 0.19 264);
  --accent: oklch(0.55 0.22 142);
  /* ... more colors */
}
```

### Add New Service Categories
Edit `src/data/dummy.ts`:
```typescript
export const categories: Category[] = [
  {
    id: '9',
    name: 'Your Category',
    slug: 'your-category',
    icon: 'YourIcon',
    description: 'Description',
    serviceCount: 0,
  },
  // ... existing categories
];
```

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Netlify
```bash
netlify deploy --prod
```

## 📊 Performance Optimizations

- **Lazy Loading**: All routes are code-split
- **Image Optimization**: External CDN images (Unsplash)
- **Memoization**: Strategic use of useMemo
- **Virtualization**: Ready for large lists
- **Bundle Size**: Tree-shaking enabled

## 🐛 Known Issues & Future Enhancements

### Current Limitations
- Using static/dummy data (no real backend)
- No real authentication (demo mode)
- No payment integration
- No real-time updates

### Planned Features
- [ ] Backend API integration
- [ ] Real authentication flow
- [ ] Payment gateway (Stripe/Razorpay)
- [ ] Real-time booking updates
- [ ] Push notifications
- [ ] Service provider dashboard
- [ ] Reviews & ratings system
- [ ] Referral program
- [ ] Loyalty points

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Built with ❤️ by a Senior Frontend Engineer

## 🙏 Acknowledgments

- **Urban Company** for the inspiration
- **shadcn/ui** for the beautiful components
- **Vercel** for Next.js and hosting
- **Framer** for Motion animations
- **Unsplash** for high-quality images

## 📞 Support

For support, email support@urbanclone.com or join our Slack channel.

---

**⭐ Star this repository if you found it helpful!**
