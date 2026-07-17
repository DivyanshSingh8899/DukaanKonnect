import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { ROLES } from "./schema";

const categoriesData = [
  { name: "Cleaning", slug: "cleaning", icon: "Sparkles", description: "Professional home cleaning services", serviceCount: 3 },
  { name: "Plumbing", slug: "plumbing", icon: "Droplet", description: "Expert plumbing solutions", serviceCount: 2 },
  { name: "Electrical", slug: "electrical", icon: "Zap", description: "Safe electrical repairs", serviceCount: 2 },
  { name: "Salon & Spa", slug: "salon-spa", icon: "Scissors", description: "Beauty and wellness services", serviceCount: 2 },
  { name: "Carpentry", slug: "carpentry", icon: "Hammer", description: "Skilled carpentry work", serviceCount: 1 },
  { name: "Painting", slug: "painting", icon: "Paintbrush", description: "Professional painting services", serviceCount: 1 },
  { name: "Appliance Repair", slug: "appliance-repair", icon: "Wrench", description: "Fix all home appliances", serviceCount: 1 },
  { name: "Pest Control", slug: "pest-control", icon: "Bug", description: "Effective pest solutions", serviceCount: 0 },
];

const servicesData = [
  { name: "Deep Home Cleaning", slug: "deep-home-cleaning", categorySlug: "cleaning", description: "Comprehensive deep cleaning of your entire home including kitchen, bathrooms, bedrooms, and living areas. Our professionals use eco-friendly products.", price: 899, duration: 180, rating: 4.8, reviewCount: 1247, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800", featured: true, tags: ["Popular", "Eco-friendly"] },
  { name: "Bathroom Cleaning", slug: "bathroom-cleaning", categorySlug: "cleaning", description: "Thorough cleaning and sanitization of bathrooms including tiles, fixtures, and drains.", price: 899, duration: 60, rating: 4.7, reviewCount: 892, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800", featured: false, tags: ["Quick Service"] },
  { name: "Kitchen Cleaning", slug: "kitchen-cleaning", categorySlug: "cleaning", description: "Complete kitchen cleaning including countertops, cabinets, appliances, and chimney cleaning.", price: 1299, duration: 120, rating: 4.6, reviewCount: 678, image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800", featured: false, tags: ["Deep Clean"] },
  { name: "Tap & Mixer Repair", slug: "tap-mixer-repair", categorySlug: "plumbing", description: "Fix leaking taps, mixer installation, and replacement services for all types of faucets.", price: 349, duration: 45, rating: 4.5, reviewCount: 534, image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800", featured: false, tags: ["Emergency Service"] },
  { name: "Drain Cleaning", slug: "drain-cleaning", categorySlug: "plumbing", description: "Professional drain cleaning for kitchen sinks, bathrooms, and blocked drainage systems.", price: 599, duration: 60, rating: 4.4, reviewCount: 421, image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800", featured: false, tags: ["Same Day"] },
  { name: "Light Installation", slug: "light-installation", categorySlug: "electrical", description: "Install ceiling lights, chandeliers, wall lamps, and LED strip lighting with safety certification.", price: 299, duration: 30, rating: 4.7, reviewCount: 765, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800", featured: true, tags: ["Certified"] },
  { name: "Switch & Socket Repair", slug: "switch-socket-repair", categorySlug: "electrical", description: "Replace faulty switches, sockets, and electrical outlets with premium quality products.", price: 199, duration: 30, rating: 4.6, reviewCount: 612, image: "https://plus.unsplash.com/premium_photo-1750890890026-a81bd4f67e4c?w=800", featured: false, tags: ["Quick Fix"] },
  { name: "Haircut & Styling", slug: "haircut-styling", categorySlug: "salon-spa", description: "Professional haircut with styling, beard trimming, and hair wash at your home.", price: 499, duration: 60, rating: 4.9, reviewCount: 2134, image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800", featured: true, tags: ["Bestseller", "At Home"] },
  { name: "Facial & Cleanup", slug: "facial-cleanup", categorySlug: "salon-spa", description: "Deep cleansing facial with premium products for glowing skin. Includes cleanup and massage.", price: 799, duration: 90, rating: 4.8, reviewCount: 1567, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800", featured: true, tags: ["Premium"] },
  { name: "Furniture Assembly", slug: "furniture-assembly", categorySlug: "carpentry", description: "Expert assembly of flat-pack furniture, shelves, and storage units from any brand.", price: 699, duration: 120, rating: 4.5, reviewCount: 423, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800", featured: false, tags: ["All Brands"] },
  { name: "Wall Painting", slug: "wall-painting", categorySlug: "painting", description: "Professional wall painting with premium paints. Includes surface preparation and cleanup.", price: 4999, duration: 480, rating: 4.7, reviewCount: 892, image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800", featured: false, tags: ["Premium Paint"] },
  { name: "AC Repair", slug: "ac-repair", categorySlug: "appliance-repair", description: "AC repair and servicing for all brands. Gas refilling, cleaning, and maintenance.", price: 499, duration: 90, rating: 4.6, reviewCount: 1123, image: "https://plus.unsplash.com/premium_photo-1683134512538-7b390d0adc9e?w=800", featured: true, tags: ["All Brands", "Warranty"] },
];

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("categories").first();
    if (existing) {
      return { skipped: true, reason: "categories already seeded" };
    }

    const categoryIdBySlug = new Map<string, Id<"categories">>();
    for (const cat of categoriesData) {
      const id = await ctx.db.insert("categories", cat);
      categoryIdBySlug.set(cat.slug, id);
    }

    for (const svc of servicesData) {
      const categoryId = categoryIdBySlug.get(svc.categorySlug);
      if (!categoryId) continue;
      const category = categoriesData.find((c) => c.slug === svc.categorySlug)!;
      const { categorySlug, ...rest } = svc;
      await ctx.db.insert("services", {
        ...rest,
        categoryId,
        categoryName: category.name,
        categorySlug,
      });
    }

    return { skipped: false, categories: categoriesData.length, services: servicesData.length };
  },
});

const professionalsData = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@dukaankonnect.pro",
    specialties: ["plumbing"],
    bio: "Licensed plumber with over a decade of experience fixing leaks, installations, and drainage issues across residential homes.",
    experienceYears: 11,
    rating: 4.8,
    reviewCount: 312,
    completedJobs: 480,
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@dukaankonnect.pro",
    specialties: ["cleaning"],
    bio: "Detail-oriented cleaning specialist known for thorough deep cleans using eco-friendly products.",
    experienceYears: 6,
    rating: 4.9,
    reviewCount: 528,
    completedJobs: 710,
  },
  {
    name: "Amit Verma",
    email: "amit.verma@dukaankonnect.pro",
    specialties: ["electrical"],
    bio: "Certified electrician specializing in wiring, installations, and safe emergency repairs.",
    experienceYears: 8,
    rating: 4.7,
    reviewCount: 245,
    completedJobs: 390,
  },
  {
    name: "Sunita Reddy",
    email: "sunita.reddy@dukaankonnect.pro",
    specialties: ["salon-spa"],
    bio: "Professional beautician offering haircuts, styling, and facials in the comfort of your home.",
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 601,
    completedJobs: 820,
  },
];

export const seedProfessionals = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", professionalsData[0].email))
      .unique();
    if (existing) {
      return { skipped: true, reason: "professionals already seeded" };
    }

    for (const pro of professionalsData) {
      const userId = await ctx.db.insert("users", {
        name: pro.name,
        email: pro.email,
        role: ROLES.PROFESSIONAL,
      });

      await ctx.db.insert("professionals", {
        userId,
        name: pro.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(pro.email)}`,
        rating: pro.rating,
        reviewCount: pro.reviewCount,
        completedJobs: pro.completedJobs,
        specialties: pro.specialties,
        bio: pro.bio,
        experienceYears: pro.experienceYears,
        approved: true,
      });
    }

    return { skipped: false, professionals: professionalsData.length };
  },
});
