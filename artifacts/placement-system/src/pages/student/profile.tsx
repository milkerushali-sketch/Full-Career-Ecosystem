import React, { useState, useEffect, useRef } from 'react';
import { useGetMyProfile, getGetMyProfileQueryKey, useUpdateMyProfile, useUpdateMyAccount, useChangeMyPassword, StudentProfile } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { Save, Loader2, Link as LinkIcon, MapPin, Phone, User as UserIcon, KeyRound } from 'lucide-react';

export default function StudentProfilePage() {
  const { data: profile, isLoading } = useGetMyProfile({
    query: { queryKey: getGetMyProfileQueryKey() }
  });
  const updateProfile = useUpdateMyProfile();
  const updateAccount = useUpdateMyAccount();
  const changePassword = useChangeMyPassword();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, login } = useAuth();

  const [accountData, setAccountData] = useState({ name: '', email: '' });
  const accountInitializedRef = useRef(false);

  useEffect(() => {
    if (user && !accountInitializedRef.current) {
      accountInitializedRef.current = true;
      setAccountData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAccount.mutate({ data: accountData }, {
      onSuccess: (res) => {
        login(res.token, res.user);
        toast({ title: 'Success', description: 'Account details updated' });
      },
      onError: (err: any) => {
        toast({
          title: 'Error',
          description: err.response?.data?.error || 'Failed to update account',
          variant: 'destructive'
        });
      }
    });
  };

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    changePassword.mutate({ data: { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword } }, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Password changed successfully' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      },
      onError: (err: any) => {
        toast({
          title: 'Error',
          description: err.response?.data?.error || 'Failed to change password',
          variant: 'destructive'
        });
      }
    });
  };

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    bio: '',
    linkedinUrl: '',
    photoUrl: ''
  });

  const initializedRef = useRef<number | null>(null);

  useEffect(() => {
    if (profile && initializedRef.current !== profile.id) {
      initializedRef.current = profile.id;
      setFormData({
        phone: profile.phone || '',
        address: profile.address || '',
        bio: profile.bio || '',
        linkedinUrl: profile.linkedinUrl || '',
        photoUrl: profile.photoUrl || ''
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ data: formData }, {
      onSuccess: (updatedProfile) => {
        toast({ title: 'Success', description: 'Profile updated successfully' });
        queryClient.setQueryData(getGetMyProfileQueryKey(), updatedProfile);
      },
      onError: (err: any) => {
        toast({ 
          title: 'Error', 
          description: err.response?.data?.message || 'Failed to update profile',
          variant: 'destructive'
        });
      }
    });
  };

  if (isLoading) {
    return <div className="space-y-6"><Skeleton className="h-48 w-full" /><Skeleton className="h-96 w-full" /></div>;
  }

  if (!profile) return null;

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none shadow-md">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-accent/80"></div>
        <CardContent className="p-6 relative pt-0">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-card shadow-lg bg-muted">
              <AvatarImage src={formData.photoUrl || undefined} />
              <AvatarFallback className="text-3xl bg-primary/10 text-primary">{getInitials(profile.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pb-2">
              <h2 className="text-2xl sm:text-3xl font-bold">{profile.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">{profile.rollNo || 'No Roll No'}</span>
                <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">{profile.department || 'No Department'}</span>
                <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">Batch: {profile.batch || 'N/A'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Edit Profile Information</CardTitle>
                <CardDescription>Update your contact details and bio for companies to see.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="pl-9" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="linkedinUrl" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} className="pl-9" placeholder="https://linkedin.com/in/username" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="address" name="address" value={formData.address} onChange={handleChange} className="pl-9 resize-none" placeholder="Your full address..." rows={2} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} className="min-h-[120px]" placeholder="Write a short professional bio..." />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="photoUrl">Avatar URL</Label>
                  <Input id="photoUrl" name="photoUrl" value={formData.photoUrl} onChange={handleChange} placeholder="https://example.com/avatar.jpg" />
                </div>
              </CardContent>
              <div className="px-6 pb-6 pt-2">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm flex items-center justify-between">
                  <span>CGPA</span>
                  <span className="font-bold text-primary">{profile.cgpa ? profile.cgpa.toFixed(2) : "N/A"}</span>
                </div>
                <div className="text-sm flex items-center justify-between mt-1">
                  <span>Active Backlogs</span>
                  <span className={`font-bold ${profile.backlogs && profile.backlogs > 0 ? "text-destructive" : "text-emerald-500"}`}>{profile.backlogs || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <form onSubmit={handleAccountSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><UserIcon className="h-5 w-5" /> Account Details</CardTitle>
              <CardDescription>Your login name and email address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="acc-name">Full Name</Label>
                <Input id="acc-name" name="name" value={accountData.name} onChange={handleAccountChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-email">Email</Label>
                <Input id="acc-email" name="email" type="email" value={accountData.email} onChange={handleAccountChange} required />
              </div>
            </CardContent>
            <div className="px-6 pb-6 pt-2">
              <Button type="submit" disabled={updateAccount.isPending} data-testid="button-save-account">
                {updateAccount.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Account
              </Button>
            </div>
          </form>
        </Card>

        <Card>
          <form onSubmit={handlePasswordSubmit}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><KeyRound className="h-5 w-5" /> Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} required minLength={6} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange} required minLength={6} />
                </div>
              </div>
            </CardContent>
            <div className="px-6 pb-6 pt-2">
              <Button type="submit" disabled={changePassword.isPending} data-testid="button-change-password">
                {changePassword.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}