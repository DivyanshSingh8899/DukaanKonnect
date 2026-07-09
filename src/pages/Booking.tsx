import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useBookingStore } from '@/store/useBookingStore';
import { useQuery, useAction } from 'convex/react';
import {
  currentUserRef,
  paymentsCreateOrderRef,
  paymentsVerifyAndBookRef,
  serviceGetByIdRef,
  bookingsGetBookedSlotsRef,
  professionalsListBySpecialtyRef,
} from '@/lib/convexRefs';
import { getInitials } from '@/lib/utils';
import type { Id } from '@/convex/_generated/dataModel';
import type { Professional, TimeSlot } from '@/types';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { format } from 'date-fns';

const ALL_TIMES = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];

const ANY_PROFESSIONAL: Professional = {
  id: 'any',
  name: 'Any Available Professional',
  avatar: '',
  rating: 0,
  reviewCount: 0,
  completedJobs: 0,
  specialties: [],
};

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const {
    service,
    date,
    timeSlot,
    professional,
    address,
    notes,
    setService,
    setDate,
    setTimeSlot,
    setProfessional,
    setAddress,
    setNotes,
    resetBooking,
  } = useBookingStore();

  const currentUser = useQuery(currentUserRef, {});
  const createOrder = useAction(paymentsCreateOrderRef);
  const verifyAndBook = useAction(paymentsVerifyAndBookRef);

  const serviceIdParam = searchParams.get('service');
  const fetchedService = useQuery(
    serviceGetByIdRef,
    serviceIdParam && !service ? { id: serviceIdParam as Id<'services'> } : 'skip'
  );

  useEffect(() => {
    if (serviceIdParam && !service && fetchedService !== undefined) {
      if (fetchedService) {
        setService(fetchedService);
      } else {
        navigate('/services');
        toast.error('Service not found');
      }
    }
  }, [serviceIdParam, service, fetchedService, setService, navigate]);

  useEffect(() => {
    if (currentUser?.address && !address) {
      setAddress(currentUser.address);
    }
  }, [currentUser, address, setAddress]);

  const bookedSlots =
    useQuery(
      bookingsGetBookedSlotsRef,
      service && date
        ? { categorySlug: service.categorySlug, date: format(date, 'yyyy-MM-dd') }
        : 'skip'
    ) ?? [];

  const timeSlotOptions: TimeSlot[] = ALL_TIMES.map((time, i) => ({
    id: `t${i + 1}`,
    time,
    available: !bookedSlots.includes(time),
  }));

  const matchingProfessionals =
    useQuery(
      professionalsListBySpecialtyRef,
      service ? { categorySlug: service.categorySlug } : 'skip'
    ) ?? [];

  const handleNext = () => {
    if (step === 1 && !service) {
      toast.error('Please select a service');
      return;
    }
    if (step === 2 && !date) {
      toast.error('Please select a date');
      return;
    }
    if (step === 2 && !timeSlot) {
      toast.error('Please select a time slot');
      return;
    }
    if (step === 3 && !professional) {
      toast.error('Please select a professional');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!address.trim()) {
      toast.error('Please enter your address');
      return;
    }
    if (!service || !date || !timeSlot) return;

    const RazorpayCheckout = (window as any).Razorpay;
    if (!RazorpayCheckout) {
      toast.error('Payment could not load. Please refresh and try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createOrder({ serviceId: service.id as Id<'services'> });

      const razorpay = new RazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Dukaan Konnect',
        description: service.name,
        prefill: {
          name: currentUser?.name ?? undefined,
          email: currentUser?.email ?? undefined,
          contact: currentUser?.phone ?? undefined,
        },
        theme: { color: '#3949ab' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyAndBook({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              serviceId: service.id as Id<'services'>,
              professionalId:
                professional && professional.id !== 'any'
                  ? (professional.id as Id<'professionals'>)
                  : undefined,
              date: format(date, 'yyyy-MM-dd'),
              time: timeSlot.time,
              address,
              notes: notes || undefined,
            });
            toast.success('Payment successful! Booking confirmed.');
            resetBooking();
            navigate('/orders');
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : 'Payment verification failed'
            );
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setIsSubmitting(false),
        },
      });

      razorpay.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setIsSubmitting(false);
      });

      razorpay.open();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to start payment'
      );
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Service', icon: CheckCircle2 },
    { number: 2, title: 'Date & Time', icon: CalendarIcon },
    { number: 3, title: 'Professional', icon: User },
    { number: 4, title: 'Summary', icon: CheckCircle2 },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      step >= s.number
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30 scale-110'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s.number ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{s.number}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 hidden sm:block ${
                      step >= s.number ? 'font-medium text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all ${
                      step > s.number ? 'bg-gradient-to-r from-primary to-accent' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Service Selection */}
              {step === 1 && service && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Selected Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-32 h-32 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">
                            {service.name}
                          </h3>
                          <Badge variant="secondary" className="mb-2">
                            {service.categoryName}
                          </Badge>
                          <p className="text-sm text-muted-foreground mb-3">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {service.duration} mins
                            </span>
                            <span className="font-semibold text-primary text-lg">
                              ₹{service.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Date & Time Selection */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle>Select Date</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={date || undefined}
                        onSelect={(d) => setDate(d ? d : null)}
                        disabled={(dateVal) =>
                          dateVal < new Date() || dateVal < new Date('1900-01-01')
                        }
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Select Time Slot</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-3">
                        {timeSlotOptions.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={
                              timeSlot?.id === slot.id ? 'default' : 'outline'
                            }
                            disabled={!slot.available}
                            onClick={() => setTimeSlot(slot)}
                            className="h-auto py-3"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Professional Selection */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Choose a Professional</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Card
                          className={`cursor-pointer transition-all ${
                            professional?.id === ANY_PROFESSIONAL.id
                              ? 'ring-2 ring-primary'
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setProfessional(ANY_PROFESSIONAL)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="w-7 h-7 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">
                                  Any Available Professional
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  We'll assign the best available expert for this
                                  job.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {matchingProfessionals.map((prof) => (
                          <Card
                            key={prof.id}
                            className={`cursor-pointer transition-all ${
                              professional?.id === prof.id
                                ? 'ring-2 ring-primary'
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => setProfessional(prof)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                  <AvatarImage src={prof.avatar} />
                                  <AvatarFallback>
                                    {getInitials(prof.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h4 className="font-semibold mb-1">
                                    {prof.name}
                                  </h4>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                    <span>★ {prof.rating}</span>
                                    <span>•</span>
                                    <span>{prof.completedJobs} jobs</span>
                                  </div>
                                  <div className="flex gap-2 flex-wrap">
                                    {prof.specialties.map((spec) => (
                                      <Badge
                                        key={spec}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {spec}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Summary & Address */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Address
                          </label>
                          <Textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your complete address"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Additional Notes (Optional)
                          </label>
                          <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special instructions..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {service && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Service
                          </p>
                          <p className="font-semibold">{service.name}</p>
                        </div>
                      )}
                      {date && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Date & Time
                          </p>
                          <p className="font-semibold">
                            {format(new Date(date), 'PPP')} at {timeSlot?.time}
                          </p>
                        </div>
                      )}
                      {professional && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Professional
                          </p>
                          <p className="font-semibold">{professional.name}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Price Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {service && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span>Service Price</span>
                      <span>₹{service.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-accent">
                      <span>Discount</span>
                      <span>- ₹0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span className="text-primary">₹{service.price}</span>
                    </div>
                  </>
                )}

                <div className="space-y-2 pt-4">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setStep(step - 1)}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}

                  {step < 4 ? (
                    <Button className="w-full" onClick={handleNext}>
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleBooking}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? 'Processing...'
                        : `Pay ₹${service?.price ?? ''} & Confirm`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
