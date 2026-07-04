# 🚀 UrbanClone - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Development Server
```bash
pnpm dev
```

### 3. Open Browser
```
http://localhost:5173
```

**That's it! The app is now running.** 🎉

---

## 📱 Demo User Account

The app comes pre-configured with a demo user:

```
Name: John Doe
Email: john.doe@example.com
Phone: +91 98765 43210
```

**Note**: Authentication is currently in demo mode. You're automatically logged in.

---

## 🗺️ Navigation Guide

### Main Pages

| Page | URL | Description |
|------|-----|-------------|
| **Home** | `/` | Landing page with search & categories |
| **Services** | `/services` | Browse all services with filters |
| **Booking** | `/booking` | Book a service (4-step flow) |
| **Orders** | `/orders` | View your booking history |
| **Profile** | `/profile` | Manage account & settings |

### Quick Actions

**From Home Page**:
1. Click any category → Filter services
2. Click "Book Now" on service → Start booking
3. Use search bar → Find specific services

**Book a Service**:
1. Go to Services page
2. Click "Book Now" on any service
3. Follow 4-step booking flow
4. Confirm booking

**View Orders**:
1. Click "Orders" in navigation
2. Switch between tabs (All/Upcoming/Completed)
3. Click "Book Again" to rebook

---

## 🎨 Theme Toggle

**Desktop**: Click sun/moon icon in header

**Mobile**: Open menu → Click theme toggle

The app supports:
- ☀️ Light Mode (default)
- 🌙 Dark Mode

Theme preference is saved automatically.

---

## 🧪 Test Features

### Try These User Flows:

#### 1. Browse Services
```
Home → Categories → Click "Cleaning" → See filtered services
```

#### 2. Search Services
```
Home → Search "haircut" → View results
```

#### 3. Book a Service
```
Services → "Deep Home Cleaning" → Book Now →
Select Date → Pick Time Slot → Choose Professional →
Enter Address → Confirm
```

#### 4. Filter Services
```
Services → Open Filters → Set price range →
Select minimum rating → Apply
```

#### 5. Edit Profile
```
Profile → Edit Profile → Change details → Save
```

---

## 📦 Available Data

### Services (12 total)
- Deep Home Cleaning - ₹2,499
- Bathroom Cleaning - ₹899
- Kitchen Cleaning - ₹1,299
- Tap & Mixer Repair - ₹349
- Drain Cleaning - ₹599
- Light Installation - ₹299
- Switch & Socket Repair - ₹199
- Haircut & Styling - ₹499
- Facial & Cleanup - ₹799
- Furniture Assembly - ₹699
- Wall Painting - ₹4,999
- AC Repair - ₹499

### Categories (8 total)
- Cleaning
- Plumbing
- Electrical
- Salon & Spa
- Carpentry
- Painting
- Appliance Repair
- Pest Control

### Professionals (4 total)
- Rajesh Kumar (Cleaning specialist)
- Amit Sharma (Plumbing expert)
- Priya Singh (Salon professional)
- Vikram Patel (Electrician)

### Sample Orders (4 total)
- 1 Confirmed
- 3 Completed

---

## 🛠️ Development Commands

### Start Dev Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Preview Production Build
```bash
pnpm preview
```

### Type Check
```bash
pnpm tsc -b --noEmit
```

### Format Code
```bash
pnpm format
```

### Lint Code
```bash
pnpm lint
```

---

## 🎯 Key Features to Test

### ✅ Responsive Design
1. Resize browser window
2. Open DevTools → Toggle device toolbar
3. Test on mobile/tablet/desktop sizes

### ✅ Dark Mode
1. Toggle theme in header
2. Navigate between pages
3. Verify all components adapt

### ✅ Animations
1. Navigate between pages
2. Hover over cards
3. Watch list animations
4. Try booking flow transitions

### ✅ Filtering
1. Go to Services page
2. Try category filter
3. Adjust price range
4. Change sort order
5. Use search

### ✅ Booking Flow
1. Select service
2. Complete all 4 steps
3. Validate required fields
4. Watch progress indicator
5. See confirmation toast

---

## 🔧 Configuration

### Change Port
Edit `vite.config.ts`:
```typescript
server: {
  port: 3000, // Change from 5173
}
```

### Modify Theme Colors
Edit `src/index.css`:
```css
:root {
  --primary: oklch(0.42 0.19 264); /* Your color */
}
```

### Add More Services
Edit `src/data/dummy.ts`:
```typescript
export const services: Service[] = [
  // Add your services here
];
```

---

## 📱 Mobile Testing

### Using DevTools
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device (iPhone, iPad, etc.)
4. Test touch interactions

### Using Phone
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Update vite config to allow network access
3. Access from phone: `http://YOUR_IP:5173`

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5173
kill -9 <PID>

# Or use different port in vite.config.ts
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors
```bash
# Check for errors
npx tsc -b --noEmit

# If issues, check tsconfig.json
```

### Styling Issues
```bash
# Rebuild Tailwind
pnpm dev

# Check index.css is imported in main.tsx
```

---

## 📚 Documentation

### Main Docs
- **`PROJECT_README.md`** → Complete documentation
- **`IMPLEMENTATION_SUMMARY.md`** → Technical details
- **`FEATURES_OVERVIEW.md`** → All features
- **`DELIVERY_SUMMARY.md`** → Project completion status

### Code Structure
```
src/
├── components/      # Reusable components
├── pages/          # Route pages
├── store/          # Zustand stores
├── data/           # Dummy data
├── types/          # TypeScript types
└── index.css       # Global styles
```

---

## 🎓 Learning Resources

### Key Technologies
- **React**: https://react.dev
- **TypeScript**: https://typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **Zustand**: https://zustand-demo.pmnd.rs
- **Framer Motion**: https://framer.com/motion
- **shadcn/ui**: https://ui.shadcn.com

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production
netlify deploy --prod
```

### Manual Deployment
```bash
# Build
pnpm build

# Upload dist/ folder to any static host
```

---

## ✨ Next Steps

### Explore Features
1. ✅ Browse all pages
2. ✅ Test booking flow
3. ✅ Try dark mode
4. ✅ Test on mobile
5. ✅ Check animations

### Customize
1. Change colors in `index.css`
2. Add more services in `dummy.ts`
3. Modify category icons
4. Update dummy user data

### Extend
1. Connect to real backend
2. Add authentication
3. Integrate payment
4. Add more pages
5. Implement reviews

---

## 💡 Tips

### Performance
- ✅ Code splitting enabled
- ✅ Lazy loading active
- ✅ Optimized bundle
- ✅ Fast build times

### Development
- Use `pnpm dev` for hot reload
- Check console for warnings
- Use React DevTools extension
- Test on multiple browsers

### Production
- Always run `pnpm build` first
- Test production build with `pnpm preview`
- Check for console errors
- Test all user flows

---

## 🎯 Success Checklist

After setup, verify:
- ✅ App loads at `localhost:5173`
- ✅ All pages accessible
- ✅ Theme toggle works
- ✅ Mobile menu opens
- ✅ Services load correctly
- ✅ Booking flow works
- ✅ No console errors

---

## 📞 Need Help?

### Check Documentation
1. Read `PROJECT_README.md`
2. Review `IMPLEMENTATION_SUMMARY.md`
3. Check `FEATURES_OVERVIEW.md`

### Common Issues
- Port in use → Change port or kill process
- Build errors → Clear cache and reinstall
- Styling broken → Check Tailwind config
- TypeScript errors → Run type check

---

**🎉 You're all set! Start exploring the app.**

Happy coding! 🚀
