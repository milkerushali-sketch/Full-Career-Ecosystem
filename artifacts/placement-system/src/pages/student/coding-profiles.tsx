import React, { useState, useEffect } from 'react';
import { useGetMyCodingProfiles, getGetMyCodingProfilesQueryKey, useUpdateCodingProfiles } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Trophy, Flame } from 'lucide-react';
import { SiGithub, SiLeetcode, SiHackerrank, SiCodeforces } from 'react-icons/si';

export default function StudentCodingProfilesPage() {
  const { data: profiles, isLoading } = useGetMyCodingProfiles({
    query: { queryKey: getGetMyCodingProfilesQueryKey() }
  });
  
  const updateProfiles = useUpdateCodingProfiles();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    githubUsername: '', githubUrl: '',
    leetcodeUsername: '', leetcodeSolved: '',
    hackerrankUsername: '', hackerrankBadges: '',
    codeforcesUsername: '', codeforcesRating: ''
  });

  useEffect(() => {
    if (profiles) {
      setFormData({
        githubUsername: profiles.githubUsername || '',
        githubUrl: profiles.githubUrl || '',
        leetcodeUsername: profiles.leetcodeUsername || '',
        leetcodeSolved: profiles.leetcodeSolved?.toString() || '',
        hackerrankUsername: profiles.hackerrankUsername || '',
        hackerrankBadges: profiles.hackerrankBadges?.toString() || '',
        codeforcesUsername: profiles.codeforcesUsername || '',
        codeforcesRating: profiles.codeforcesRating?.toString() || ''
      });
    }
  }, [profiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      leetcodeSolved: formData.leetcodeSolved ? Number(formData.leetcodeSolved) : undefined,
      hackerrankBadges: formData.hackerrankBadges ? Number(formData.hackerrankBadges) : undefined,
      codeforcesRating: formData.codeforcesRating ? Number(formData.codeforcesRating) : undefined
    };

    updateProfiles.mutate({ data: payload }, {
      onSuccess: (data) => {
        toast({ title: 'Success', description: 'Coding profiles updated' });
        queryClient.setQueryData(getGetMyCodingProfilesQueryKey(), data);
      },
      onError: () => toast({ title: 'Error', description: 'Failed to update profiles', variant: 'destructive' })
    });
  };

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-64 w-full" /></div>;

  const statCards = [
    { platform: "GitHub", icon: SiGithub, username: profiles?.githubUsername, url: profiles?.githubUrl, stat: null, statLabel: "", color: "text-foreground bg-muted" },
    { platform: "LeetCode", icon: SiLeetcode, username: profiles?.leetcodeUsername, stat: profiles?.leetcodeSolved, statLabel: "Problems Solved", color: "text-[#FFA116] bg-[#FFA116]/10" },
    { platform: "HackerRank", icon: SiHackerrank, username: profiles?.hackerrankUsername, stat: profiles?.hackerrankBadges, statLabel: "Badges", color: "text-[#00EA64] bg-[#00EA64]/10" },
    { platform: "Codeforces", icon: SiCodeforces, username: profiles?.codeforcesUsername, stat: profiles?.codeforcesRating, statLabel: "Rating", color: "text-[#1F8ACB] bg-[#1F8ACB]/10" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Competitive Programming</h2>
        <p className="text-muted-foreground">Link your external coding profiles to showcase your problem-solving skills.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c) => (
          <Card key={c.platform} className="overflow-hidden border-border/50">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <div className={`p-3 rounded-full mb-3 ${c.color}`}>
                <c.icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">{c.platform}</h3>
              {c.username ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4 font-mono">{c.username}</p>
                  {c.stat !== undefined && c.stat !== null && (
                    <div className="mt-auto w-full py-2 bg-muted/50 rounded-lg flex items-center justify-center gap-2">
                      {c.platform === "LeetCode" ? <Flame className="h-4 w-4 text-[#FFA116]" /> : <Trophy className="h-4 w-4 text-primary" />}
                      <span className="font-bold text-xl">{c.stat}</span>
                      <span className="text-xs text-muted-foreground uppercase">{c.statLabel}</span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic mt-2">Not linked</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Update Profile Links</CardTitle>
            <CardDescription>Enter your usernames and current stats. These will be visible to placement officers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center gap-2 mb-2 md:col-span-2">
                <SiGithub className="h-5 w-5" /> <h4 className="font-semibold">GitHub</h4>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input name="githubUsername" value={formData.githubUsername} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Profile URL</Label>
                <Input name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-[#FFA116]/5 border-[#FFA116]/20">
              <div className="flex items-center gap-2 mb-2 md:col-span-2">
                <SiLeetcode className="h-5 w-5 text-[#FFA116]" /> <h4 className="font-semibold text-[#FFA116]">LeetCode</h4>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input name="leetcodeUsername" value={formData.leetcodeUsername} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Problems Solved</Label>
                <Input name="leetcodeSolved" type="number" value={formData.leetcodeSolved} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-[#00EA64]/5 border-[#00EA64]/20">
              <div className="flex items-center gap-2 mb-2 md:col-span-2">
                <SiHackerrank className="h-5 w-5 text-[#00EA64]" /> <h4 className="font-semibold text-[#00EA64]">HackerRank</h4>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input name="hackerrankUsername" value={formData.hackerrankUsername} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Badges Earned</Label>
                <Input name="hackerrankBadges" type="number" value={formData.hackerrankBadges} onChange={handleChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-[#1F8ACB]/5 border-[#1F8ACB]/20">
              <div className="flex items-center gap-2 mb-2 md:col-span-2">
                <SiCodeforces className="h-5 w-5 text-[#1F8ACB]" /> <h4 className="font-semibold text-[#1F8ACB]">Codeforces</h4>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input name="codeforcesUsername" value={formData.codeforcesUsername} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Max Rating</Label>
                <Input name="codeforcesRating" type="number" value={formData.codeforcesRating} onChange={handleChange} />
              </div>
            </div>

          </CardContent>
          <div className="px-6 pb-6 pt-2">
            <Button type="submit" disabled={updateProfiles.isPending}>
              {updateProfiles.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Profiles
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}