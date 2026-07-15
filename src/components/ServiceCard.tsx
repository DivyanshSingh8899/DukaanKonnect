import { motion } from 'framer-motion';
import { Star, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Service } from '@/types';
import { useNavigate } from 'react-router';
import { BookingCard } from './ui/card';

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // transition={{ delay: index * 0.05, duration: 0.3 }}
      // whileHover={{ y: -4 }}
    >
      <BookingCard className="overflow-hidden transition-all cursor-pointer group">
        <div className="relative h-45 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
          {service.featured && (
            <Badge className="absolute top-3 left-3 bg-accent">
              Featured
            </Badge>
          )}
          {service.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <CardContent className="px-4 pb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-0">
                {service.categoryName}
              </p>
              <h3 className="font-bold text-xl mb-0 line-clamp-1">
                {service.name}
              </h3>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {service.description}
          </p>

          <div className="flex items-center gap-3 mb-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="font-medium">{service.rating}</span>
              <span className="text-muted-foreground">
                ({service.reviewCount})
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{service.duration} mins</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">
                ₹{service.price}
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => navigate(`/booking?service=${service.id}`)}
              className="group/btn rounded-full"
            >
              Book Now
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </BookingCard>
    </motion.div>
  );
}
