import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Package,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrderStatus, Order } from "@/types";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { useQuery, useMutation } from "convex/react";
import { bookingsListMineRef, bookingsUpdateStatusRef } from "@/lib/convexRefs";
import { getInitials } from "@/lib/utils";
import type { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { BookingCard } from "../components/ui/card";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-500",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-purple-500",
    icon: Loader2,
  },
  completed: {
    label: "Completed",
    color: "bg-green-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    icon: XCircle,
  },
};

function OrderCard({ order, index }: { order: Order; index: number }) {
  const navigate = useNavigate();
  const updateStatus = useMutation(bookingsUpdateStatusRef);

  const displayStatus: OrderStatus =
    order.status === "cancelled"
      ? "cancelled"
      : order.professional
        ? "confirmed"
        : "pending";

  const config = statusConfig[displayStatus];
  const StatusIcon = config.icon;

  const handleCancel = async () => {
    try {
      await updateStatus({
        bookingId: order.id as Id<"bookings">,
        status: "cancelled",
      });
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel booking",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // transition={{ delay: index * 0.05 }}
    >
      <BookingCard className="hover:shadow-md transition-all">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-4 p-6">
            {/* Service Image */}
            <div className="w-full md:w-32 h-32 rounded-lg overflow-hidden shrink-0">
              <img
                src={order.service.image}
                alt={order.service.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Order Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {order.service.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Order ID: #{order.id.toUpperCase()}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={`${config.color} text-black shadow-sm px-2.5 py-1`}
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>
                    {format(new Date(order.date), "PP")} at {order.time}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{order.address}</span>
                </div>
              </div>

              {/* Professional Info */}
              {order.professional ? (
                <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={order.professional.avatar} />
                    <AvatarFallback>
                      {getInitials(order.professional.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {order.professional.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ★ {order.professional.rating} •{" "}
                      {order.professional.completedJobs} jobs
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  Finding a professional for you...
                </div>
              )}

              {/* Price and Actions */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <span className="text-sm text-muted-foreground">
                    Total Amount
                  </span>
                  <p className="text-xl font-bold text-primary">
                    ₹{order.totalAmount}
                  </p>
                </div>
                <div className="flex gap-2">
                  {order.status === "completed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/booking?service=${order.service.id}`)
                      }
                    >
                      Book Again
                    </Button>
                  )}
                  {order.status === "confirmed" && (
                    <Button variant="outline" size="sm">
                      Reschedule
                    </Button>
                  )}
                  {(order.status === "pending" ||
                    order.status === "confirmed") && (
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </BookingCard>
    </motion.div>
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  const orders = useQuery(bookingsListMineRef, {});

  const filterOrders = (status?: OrderStatus) => {
    if (!orders) return [];
    if (!status) return orders;
    return orders.filter((order) => order.status === status);
  };

  const allOrders = filterOrders();
  const upcomingOrders = filterOrders("confirmed");
  const completedOrders = filterOrders("completed");

  return (
    <Layout>
      {/* Header */}
      <div
        className="relative bg-muted/30 border-b"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your service bookings
          </p>
        </div>
      </div>
      <div className="container mx-auto max-w-6xl px-4 py-10">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All ({allOrders.length})</TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {allOrders.length > 0 ? (
              <div className="space-y-4">
                {allOrders.map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="No orders yet"
                description="Start booking services to see your orders here."
                action={{
                  label: "Browse Services",
                  onClick: () => navigate("/services"),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingOrders.length > 0 ? (
              <div className="space-y-4">
                {upcomingOrders.map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No upcoming bookings"
                description="Book a service to see your upcoming appointments here."
                action={{
                  label: "Browse Services",
                  onClick: () => navigate("/services"),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedOrders.length > 0 ? (
              <div className="space-y-4">
                {completedOrders.map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="No completed orders"
                description="Your completed service history will appear here."
                action={{
                  label: "Browse Services",
                  onClick: () => navigate("/services"),
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
