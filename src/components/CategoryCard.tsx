import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Sparkles,
  Droplet,
  Zap,
  Scissors,
  Hammer,
  Paintbrush,
  Wrench,
  Bug,
  LucideIcon
} from 'lucide-react';
import type { Category } from '@/types';
import { useNavigate } from 'react-router';

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Droplet,
  Zap,
  Scissors,
  Hammer,
  Paintbrush,
  Wrench,
  Bug,
};

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[category.icon] || Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      // transition={{ delay: index * 0.05, duration: 0.2 }}
      // whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="cursor-pointer hover:border-primary/40 group overflow-hidden"
        onClick={() => navigate(`/services?category=${category.slug}`)}
      >
        <CardContent className="p-5 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-3 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
          <p className="text-xs text-muted-foreground">
            {category.serviceCount} services
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
