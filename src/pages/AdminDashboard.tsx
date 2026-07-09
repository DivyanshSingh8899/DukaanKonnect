import { useState } from 'react';
import {
  Users,
  ClipboardList,
  IndianRupee,
  CheckCircle2,
  Clock,
  Package,
  Plus,
  Trash2,
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from 'convex/react';
import {
  adminStatsRef,
  adminListProfessionalsRef,
  adminSetProfessionalApprovalRef,
  adminListAllBookingsRef,
  adminAssignProfessionalRef,
  categoriesListRef,
  categoriesCreateRef,
  categoriesRemoveRef,
  servicesListRef,
  servicesCreateRef,
  servicesRemoveRef,
} from '@/lib/convexRefs';
import { ROLES } from '@/convex/schema';
import { Navigate } from 'react-router';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Id } from '@/convex/_generated/dataModel';

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function OverviewTab() {
  const stats = useQuery(adminStatsRef, {});

  if (!stats) {
    return <p className="text-muted-foreground text-center py-12">Loading...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard icon={ClipboardList} label="Total Bookings" value={stats.totalBookings} />
      <StatCard icon={Clock} label="Pending Bookings" value={stats.pendingBookings} />
      <StatCard icon={CheckCircle2} label="Completed Bookings" value={stats.completedBookings} />
      <StatCard icon={IndianRupee} label="Revenue Collected" value={`₹${stats.revenue}`} />
      <StatCard icon={Users} label="Total Professionals" value={stats.totalProfessionals} />
      <StatCard icon={CheckCircle2} label="Approved Professionals" value={stats.approvedProfessionals} />
      <StatCard icon={Clock} label="Pending Approval" value={stats.pendingProfessionals} />
    </div>
  );
}

function ProfessionalsTab() {
  const pending = useQuery(adminListProfessionalsRef, { approved: false });
  const approved = useQuery(adminListProfessionalsRef, { approved: true });
  const setApproval = useMutation(adminSetProfessionalApprovalRef);

  const handleSetApproval = async (professionalId: string, value: boolean) => {
    try {
      await setApproval({ professionalId: professionalId as Id<'professionals'>, approved: value });
      toast.success(value ? 'Professional approved' : 'Professional approval revoked');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-3">Pending Approval ({pending?.length ?? 0})</h3>
        {pending === undefined ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : pending.length === 0 ? (
          <p className="text-muted-foreground text-sm">No professionals waiting for approval.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.experienceYears ?? 0} years experience
                    </p>
                    <div className="flex gap-1.5 flex-wrap mt-1.5">
                      {p.specialties.map((s) => (
                        <Badge key={s} variant="secondary" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.idDocumentUrl && (
                      <a
                        href={p.idDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline underline-offset-2"
                      >
                        View {p.idDocumentType?.replace('_', ' ') ?? 'ID'}
                      </a>
                    )}
                    <Button size="sm" onClick={() => handleSetApproval(p.id, true)}>
                      Approve
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-3">Approved ({approved?.length ?? 0})</h3>
        {approved === undefined ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : approved.length === 0 ? (
          <p className="text-muted-foreground text-sm">No approved professionals yet.</p>
        ) : (
          <div className="space-y-3">
            {approved.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      ★ {p.rating} · {p.completedJobs} jobs completed
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetApproval(p.id, false)}
                  >
                    Revoke
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingsTab() {
  const bookings = useQuery(adminListAllBookingsRef, {});
  const approvedProfessionals = useQuery(adminListProfessionalsRef, { approved: true });
  const assignProfessional = useMutation(adminAssignProfessionalRef);

  const handleAssign = async (bookingId: string, professionalId: string) => {
    try {
      await assignProfessional({
        bookingId: bookingId as Id<'bookings'>,
        professionalId: professionalId === 'unassign' ? undefined : (professionalId as Id<'professionals'>),
      });
      toast.success('Professional assigned');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to assign professional');
    }
  };

  if (bookings === undefined) {
    return <p className="text-muted-foreground text-center py-12">Loading...</p>;
  }

  if (bookings.length === 0) {
    return <p className="text-muted-foreground text-center py-12">No bookings yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Professional</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((b) => {
          const matchingProfessionals = (approvedProfessionals ?? []).filter((p) =>
            p.specialties.includes(b.service.categorySlug),
          );
          return (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.service.name}</TableCell>
              <TableCell>
                <div>{b.customerName}</div>
                <div className="text-xs text-muted-foreground">{b.customerEmail}</div>
              </TableCell>
              <TableCell>
                {b.status === 'pending' || b.status === 'confirmed' ? (
                  <Select
                    value={b.professional?.id ?? 'unassign'}
                    onValueChange={(v) => handleAssign(b.id, v)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassign">Unassigned</SelectItem>
                      {matchingProfessionals.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  b.professional?.name ?? '—'
                )}
              </TableCell>
              <TableCell>
                {format(new Date(b.date), 'PP')} · {b.time}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {b.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">₹{b.totalAmount}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function ServicesTab() {
  const categories = useQuery(categoriesListRef, {});
  const services = useQuery(servicesListRef, {});
  const createCategory = useMutation(categoriesCreateRef);
  const removeCategory = useMutation(categoriesRemoveRef);
  const createService = useMutation(servicesCreateRef);
  const removeService = useMutation(servicesRemoveRef);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', icon: '', description: '' });

  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    slug: '',
    categoryId: '',
    description: '',
    price: '',
    duration: '',
    image: '',
    featured: false,
    tags: '',
  });

  const handleAddCategory = async () => {
    if (!categoryForm.name || !categoryForm.slug || !categoryForm.icon) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createCategory(categoryForm);
      toast.success('Category added');
      setCategoryForm({ name: '', slug: '', icon: '', description: '' });
      setCategoryDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add category');
    }
  };

  const handleAddService = async () => {
    if (
      !serviceForm.name ||
      !serviceForm.slug ||
      !serviceForm.categoryId ||
      !serviceForm.price ||
      !serviceForm.duration
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createService({
        name: serviceForm.name,
        slug: serviceForm.slug,
        categoryId: serviceForm.categoryId as Id<'categories'>,
        description: serviceForm.description,
        price: Number(serviceForm.price),
        duration: Number(serviceForm.duration),
        image: serviceForm.image,
        featured: serviceForm.featured,
        tags: serviceForm.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      toast.success('Service added');
      setServiceForm({
        name: '',
        slug: '',
        categoryId: '',
        description: '',
        price: '',
        duration: '',
        image: '',
        featured: false,
        tags: '',
      });
      setServiceDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add service');
    }
  };

  const handleRemoveCategory = async (categoryId: string) => {
    try {
      await removeCategory({ categoryId: categoryId as Id<'categories'> });
      toast.success('Category removed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove category');
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    try {
      await removeService({ serviceId: serviceId as Id<'services'> });
      toast.success('Service removed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove service');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Categories ({categories?.length ?? 0})</h3>
          <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1.5" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  placeholder="Name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
                <Input
                  placeholder="Slug (e.g. cleaning)"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                />
                <Input
                  placeholder="Lucide icon name (e.g. Sparkles)"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleAddCategory}>Save Category</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(categories ?? []).map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.serviceCount} services</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRemoveCategory(c.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Services ({services?.length ?? 0})</h3>
          <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1.5" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                <Input
                  placeholder="Name"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                />
                <Input
                  placeholder="Slug (e.g. deep-home-cleaning)"
                  value={serviceForm.slug}
                  onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })}
                />
                <Select
                  value={serviceForm.categoryId}
                  onValueChange={(v) => setServiceForm({ ...serviceForm, categoryId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Price (₹)"
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  />
                  <Input
                    placeholder="Duration (mins)"
                    type="number"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Image URL"
                  value={serviceForm.image}
                  onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                />
                <Input
                  placeholder="Tags, comma separated"
                  value={serviceForm.tags}
                  onChange={(e) => setServiceForm({ ...serviceForm, tags: e.target.value })}
                />
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured on homepage</Label>
                  <Switch
                    id="featured"
                    checked={serviceForm.featured}
                    onCheckedChange={(checked) => setServiceForm({ ...serviceForm, featured: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddService}>Save Service</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-2">
          {(services ?? []).map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={s.image} alt={s.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.categoryName} · ₹{s.price}
                      {s.featured && ' · Featured'}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive flex-shrink-0"
                  onClick={() => handleRemoveService(s.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading...
        </div>
      </Layout>
    );
  }

  if (user?.role !== ROLES.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Founder Dashboard</h1>
          <p className="text-muted-foreground">
            Manage professionals, bookings, and services across the platform
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-xl grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="professionals">Professionals</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="professionals" className="mt-6">
            <ProfessionalsTab />
          </TabsContent>
          <TabsContent value="bookings" className="mt-6">
            <BookingsTab />
          </TabsContent>
          <TabsContent value="services" className="mt-6">
            <ServicesTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
