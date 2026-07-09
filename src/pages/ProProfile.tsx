import { useState } from 'react';
import { Briefcase, LogOut, Star, CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from 'convex/react';
import { categoriesListRef, registerAsProfessionalRef, professionalsMyProfileRef } from '@/lib/convexRefs';
import { getInitials } from '@/lib/utils';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

function BecomeProfessional() {
  const navigate = useNavigate();
  const categories = useQuery(categoriesListRef, {});
  const registerAsProfessional = useMutation(registerAsProfessionalRef);
  const [selected, setSelected] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCategory = (slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      toast.error('Please select at least one specialty');
      return;
    }
    setIsSubmitting(true);
    try {
      await registerAsProfessional({ specialties: selected, bio: bio || undefined });
      toast.success('Welcome! You are now a service professional.');
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
              <label className="text-sm font-medium">Bio (Optional)</label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell customers about your experience..."
                rows={4}
              />
            </div>

            <Button className="w-full" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Start Accepting Jobs'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
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

        <Card className="overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-primary to-accent" />
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

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  {myProfile.rating}
                </div>
                <p className="text-xs text-muted-foreground">
                  {myProfile.reviewCount} reviews
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border">
                <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {myProfile.completedJobs}
                </div>
                <p className="text-xs text-muted-foreground">Jobs completed</p>
              </div>
            </div>

            <div className="mb-6">
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
      </div>
    </Layout>
  );
}
