import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ServiceCard } from '@/components/ServiceCard';
import { EmptyState } from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { SkeletonGrid } from '@/components/SkeletonCard';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSearchParams } from 'react-router';

export default function Services() {
  const [searchParams] = useSearchParams();
  const services = useQuery(api.services.list);
  const categories = useQuery(api.categories.list);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const filteredServices = useMemo(() => {
    let filtered = [...(services ?? [])];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.categoryName.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s) => s.categorySlug === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(
      (s) => s.price >= priceRange[0] && s.price <= priceRange[1]
    );

    // Filter by rating
    if (minRating > 0) {
      filtered = filtered.filter((s) => s.rating >= minRating);
    }

    // Sort services
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return filtered;
  }, [services, searchQuery, selectedCategory, sortBy, priceRange, minRating]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popular');
    setPriceRange([0, 5000]);
    setMinRating(0);
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    priceRange[0] !== 0 || priceRange[1] !== 5000,
    minRating > 0,
  ].filter(Boolean).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Explore Services
          </h1>
          <p className="text-muted-foreground">
            Browse through our wide range of professional services
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchQuery('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(categories ?? []).map((category) => (
                <SelectItem key={category.id} value={category.slug}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters (Mobile) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto relative">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>
                  Refine your service search
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={5000}
                    step={100}
                    className="mb-2"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Min Rating */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Minimum Rating
                  </label>
                  <Select
                    value={minRating.toString()}
                    onValueChange={(v) => setMinRating(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.8">4.8+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-6 flex-wrap"
          >
            <span className="text-sm text-muted-foreground">
              Active filters:
            </span>
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {(categories ?? []).find((c) => c.slug === selectedCategory)?.name}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSelectedCategory('all')}
                />
              </Badge>
            )}
            {(priceRange[0] !== 0 || priceRange[1] !== 5000) && (
              <Badge variant="secondary" className="gap-1">
                ₹{priceRange[0]} - ₹{priceRange[1]}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setPriceRange([0, 5000])}
                />
              </Badge>
            )}
            {minRating > 0 && (
              <Badge variant="secondary" className="gap-1">
                {minRating}+ Stars
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setMinRating(0)}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 text-xs"
            >
              Clear All
            </Button>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredServices.length} service
            {filteredServices.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Services Grid */}
        {services === undefined ? (
          <SkeletonGrid count={8} />
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No services found"
            description="Try adjusting your filters or search query to find what you're looking for."
            action={{
              label: 'Clear Filters',
              onClick: clearFilters,
            }}
          />
        )}
      </div>
    </Layout>
  );
}
