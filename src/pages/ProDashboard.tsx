import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Package,
  CheckCircle2,
  Loader2,
  StickyNote,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { EmptyState } from '@/components/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation } from 'convex/react';
import {
  bookingsUpdateStatusRef,
  professionalsMyProfileRef,
  bookingsListForProfessionalRef,
  type ProBooking,
} from '@/lib/convexRefs';
import type { Id } from '@/convex/_generated/dataModel';
import { Navigate } from 'react-router';
import { format } from 'date-fns';
import { toast } from 'sonner';

function ProBookingCard({ booking, index }: { booking: ProBooking; index: number }) {
  const updateStatus = useMutation(bookingsUpdateStatusRef);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (status: 'confirmed' | 'cancelled' | 'in_progress' | 'completed') => {
    setIsUpdating(true);
    try {
      await updateStatus({ bookingId: booking.id as Id<'bookings'>, status });
      const messages: Record<string, string> = {
        confirmed: 'Job accepted!',
        cancelled: 'Job declined',
        in_progress: 'Job marked in progress',
        completed: 'Job marked complete',
      };
      toast.success(messages[status]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update job');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="hover:shadow-md transition-all">
        <CardContent className="px-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-28 h-28 rounded-lg overflow-hidden shrink-0">
              <img
                src={booking.service.image}
                alt={booking.service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{booking.service.name}</h3>
                  <p className="text-sm text-muted-foreground">Customer: {booking.customerName}</p>
                </div>
                <Badge variant="secondary" className="text-lg font-semibold">
                  ₹{booking.totalAmount}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{format(new Date(booking.date), 'PP')} at {booking.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{booking.address}</span>
                </div>
              </div>

              {booking.notes && (
                <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
                  <StickyNote className="w-4 h-4 mt-0.5" />
                  <span>{booking.notes}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t">
                {booking.status === 'confirmed' && (
                  <Button size="sm" disabled={isUpdating} onClick={() => handleUpdate('completed')}>
                    Mark Complete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProDashboard() {
  const [activeTab, setActiveTab] = useState('new');
  const myProfile = useQuery(professionalsMyProfileRef, {});
  const bookings = useQuery(bookingsListForProfessionalRef, {});

  if (myProfile === undefined || bookings === undefined) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading...
        </div>
      </Layout>
    );
  }

  if (myProfile === null) {
    return <Navigate to="/pro/profile" replace />;
  }

  const newRequests = bookings.filter((b) => b.status === 'pending');
  const activeJobs = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress');
  const completedJobs = bookings.filter((b) => b.status === 'completed');

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Professional Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your job requests and bookings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="new">New ({newRequests.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-6">
            {newRequests.length > 0 ? (
              <div className="space-y-4">
                {newRequests.map((b, i) => (
                  <ProBookingCard key={b.id} booking={b} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="No new requests"
                description="New job requests matching your specialties will show up here."
              />
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {activeJobs.length > 0 ? (
              <div className="space-y-4">
                {activeJobs.map((b, i) => (
                  <ProBookingCard key={b.id} booking={b} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Loader2}
                title="No active jobs"
                description="Jobs you've accepted will appear here."
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedJobs.length > 0 ? (
              <div className="space-y-4">
                {completedJobs.map((b, i) => (
                  <ProBookingCard key={b.id} booking={b} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="No completed jobs yet"
                description="Your completed job history will appear here."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
