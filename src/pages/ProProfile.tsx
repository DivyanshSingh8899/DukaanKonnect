import { useMemo, useState } from 'react';
import { Briefcase, LogOut, Star, CheckCircle2, Search, Pencil, Trash2, Plus } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { CameraCapture } from '@/components/CameraCapture';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from 'convex/react';
import {
  categoriesListRef,
  registerAsProfessionalRef,
  professionalsMyProfileRef,
  generateIdUploadUrlRef,
  servicesListRef,
  myProfessionalServicesRef,
  addOrUpdateProfessionalServiceRef,
  removeProfessionalServiceRef,
  type IdDocumentType,
} from '@/lib/convexRefs';
import { getInitials } from '@/lib/utils';
import type { Id } from '@/convex/_generated/dataModel';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const ID_DOCUMENT_LABELS: Record<IdDocumentType, string> = {
  aadhar: 'Aadhar Card',
  pan: 'PAN Card',
  driving_license: 'Driving License',
};

function BecomeProfessional() {
  const navigate = useNavigate();
  const categories = useQuery(categoriesListRef, {});
  const registerAsProfessional = useMutation(registerAsProfessionalRef);
  const generateIdUploadUrl = useMutation(generateIdUploadUrlRef);
  const [selected, setSelected] = useState<string[]>([]);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [idDocumentType, setIdDocumentType] = useState<IdDocumentType | ''>('');
  const [idPhoto, setIdPhoto] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (selected.length === 0) {
      toast.error('Please select at least one specialty');
      return;
    }
    if (!experienceYears || Number(experienceYears) < 0) {
      toast.error('Please enter your years of experience');
      return;
    }
    if (!idDocumentType) {
      toast.error('Please select an ID document type');
      return;
    }
    if (!idPhoto) {
      toast.error('Please capture a photo of your ID document');
      return;
    }
    setIsSubmitting(true);
    try {
      const uploadUrl = await generateIdUploadUrl({});
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': idPhoto.type },
        body: idPhoto,
      });
      const { storageId } = await uploadResponse.json();

      await registerAsProfessional({
        fullName: fullName.trim(),
        specialties: selected,
        bio: bio || undefined,
        experienceYears: Number(experienceYears),
        idDocumentType,
        idDocumentStorageId: storageId as Id<'_storage'>,
      });
      toast.success('Submitted! We will review your application shortly.');
      navigate('/pro');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Become a Service Professional</h1>
          <p className="text-muted-foreground">
            Choose the services you specialize in and start receiving job requests.
          </p>
        </div>

        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="p-4 text-sm text-muted-foreground">
            Once approved, you'll be able to list the exact services you offer and set
            your own price for each one from your profile. Our admin team reviews and
            assigns jobs to you based on your specialties and experience.
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Identity Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name (as on your ID)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ID Document Type</label>
              <Select value={idDocumentType} onValueChange={(v) => setIdDocumentType(v as IdDocumentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                  <SelectItem value="driving_license">Driving License</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Take a live photo of your {idDocumentType ? ID_DOCUMENT_LABELS[idDocumentType] : 'ID document'}
              </label>
              <CameraCapture onCapture={setIdPhoto} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Specialties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {(categories ?? []).map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selected.includes(cat.slug) ? 'default' : 'outline'}
                  className="cursor-pointer text-sm py-2 px-3"
                  onClick={() => toggleCategory(cat.slug)}
                >
                  {cat.name}
                </Badge>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Years of Experience</label>
              <Input
                type="number"
                min={0}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="e.g. 3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                What work can you do? Describe your experience (Optional)
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell customers what you can do and about your experience..."
                rows={4}
              />
            </div>

            <Button className="w-full" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function MyServicesAndPricing() {
  const allServices = useQuery(servicesListRef, {});
  const myServices = useQuery(myProfessionalServicesRef, {});
  const addOrUpdateService = useMutation(addOrUpdateProfessionalServiceRef);
  const removeService = useMutation(removeProfessionalServiceRef);

  const [search, setSearch] = useState('');
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});

  const myServiceIds = useMemo(() => new Set((myServices ?? []).map((s) => s.service.id)), [myServices]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return (allServices ?? [])
      .filter(
        (s) =>
          !myServiceIds.has(s.id) &&
          (s.name.toLowerCase().includes(q) || s.categoryName.toLowerCase().includes(q)),
      )
      .slice(0, 6);
  }, [allServices, search, myServiceIds]);

  const handleAdd = async (serviceId: string) => {
    const price = Number(priceDrafts[serviceId]);
    if (!price || price <= 0) {
      toast.error('Enter a valid price first');
      return;
    }
    try {
      await addOrUpdateService({ serviceId: serviceId as Id<'services'>, price });
      toast.success('Service added');
      setSearch('');
      setPriceDrafts((prev) => {
        const next = { ...prev };
        delete next[serviceId];
        return next;
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add service');
    }
  };

  const handleUpdatePrice = async (myServiceId: string, serviceId: string) => {
    const price = Number(priceDrafts[myServiceId]);
    if (!price || price <= 0) {
      toast.error('Enter a valid price');
      return;
    }
    try {
      await addOrUpdateService({ serviceId: serviceId as Id<'services'>, price });
      toast.success('Price updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update price');
    }
  };

  const handleRemove = async (myServiceId: string) => {
    try {
      await removeService({ professionalServiceId: myServiceId as Id<'professionalServices'> });
      toast.success('Service removed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove service');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>My Services & Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search for a service (e.g. plumber, tap repair)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
              {suggestions.map((s) => (
                <div key={s.id} className="flex items-center gap-2 p-2 border-b last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.categoryName}</p>
                  </div>
                  <Input
                    type="number"
                    placeholder="Price"
                    className="w-24 h-8"
                    value={priceDrafts[s.id] ?? ''}
                    onChange={(e) => setPriceDrafts({ ...priceDrafts, [s.id]: e.target.value })}
                  />
                  <Button size="icon" className="h-8 w-8 shrink-0" onClick={() => handleAdd(s.id)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          {(myServices ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">
              No services added yet. Search above to add what you offer and set your price.
            </p>
          )}
          {(myServices ?? []).map((row) => (
            <div key={row.id} className="flex items-center gap-3 p-3 rounded-lg border">
              <img src={row.service.image} alt={row.service.name} className="w-12 h-12 rounded-md object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{row.service.name}</p>
                <p className="text-xs text-muted-foreground">{row.service.categoryName}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">₹</span>
                <Input
                  type="number"
                  className="w-20 h-8"
                  defaultValue={row.price}
                  onChange={(e) => setPriceDrafts({ ...priceDrafts, [row.id]: e.target.value })}
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={() => handleUpdatePrice(row.id, row.service.id)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                onClick={() => handleRemove(row.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProProfile() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const myProfile = useQuery(professionalsMyProfileRef, {});

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch {
      toast.error('Failed to log out');
    }
  };

  if (myProfile === undefined) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading...
        </div>
      </Layout>
    );
  }

  if (myProfile === null) {
    return <BecomeProfessional />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Professional Profile</h1>
          <p className="text-muted-foreground">Your public profile and stats</p>
        </div>

        {!myProfile.approved && (
          <Card className="mb-6 border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="p-4 text-sm">
              <p className="font-medium">Pending approval</p>
              <p className="text-muted-foreground mt-1">
                Your account is awaiting review before you can start receiving job requests.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="overflow-hidden mb-6">
          <div className="h-16 bg-linear-to-r from-primary to-accent" />
          <CardContent className="pt-0">
            <div className="flex flex-col items-center text-center mb-6 -mt-10">
              <Avatar className="w-24 h-24 mb-4 border-4 border-background shadow-md">
                <AvatarImage src={myProfile.avatar} />
                <AvatarFallback className="text-2xl">{getInitials(myProfile.name)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1">{myProfile.name}</h3>
              {myProfile.bio && (
                <p className="text-sm text-muted-foreground max-w-md">{myProfile.bio}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-linear-to-br from-primary/5 to-accent/5 rounded-lg border">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  {myProfile.rating}
                </div>
                <p className="text-xs text-muted-foreground">
                  {myProfile.reviewCount} reviews
                </p>
              </div>
              <div className="text-center p-4 bg-linear-to-br from-primary/5 to-accent/5 rounded-lg border">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {myProfile.completedJobs}
                </div>
                <p className="text-xs text-muted-foreground">Jobs completed</p>
              </div>
              <div className="text-center p-4 bg-linear-to-br from-primary/5 to-accent/5 rounded-lg border">
                <div className="text-lg font-semibold">{myProfile.experienceYears ?? 0}</div>
                <p className="text-xs text-muted-foreground">Years experience</p>
              </div>
            </div>

            <div className="mb-2">
              <p className="text-sm font-medium mb-2">Specialties</p>
              <div className="flex flex-wrap gap-2">
                {myProfile.specialties.map((spec) => (
                  <Badge key={spec} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>

        <MyServicesAndPricing />
      </div>
    </Layout>
  );
}