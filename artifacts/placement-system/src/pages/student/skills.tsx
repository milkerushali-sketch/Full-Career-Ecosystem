import React, { useState } from 'react';
import { useListMySkills, getListMySkillsQueryKey, useAddSkill, useRemoveSkill } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, X, Loader2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StudentSkillsPage() {
  const { data: skills, isLoading } = useListMySkills({
    query: { queryKey: getListMySkillsQueryKey() }
  });
  
  const addSkill = useAddSkill();
  const removeSkill = useRemoveSkill();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', level: 'intermediate' as 'beginner' | 'intermediate' | 'advanced', category: 'Technical' });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addSkill.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Skill added' });
        queryClient.invalidateQueries({ queryKey: getListMySkillsQueryKey() });
        setIsAddOpen(false);
        setFormData({ name: '', level: 'intermediate', category: 'Technical' });
      },
      onError: () => toast({ title: 'Error', description: 'Failed to add skill', variant: 'destructive' })
    });
  };

  const handleRemove = (id: number) => {
    removeSkill.mutate({ id }, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Skill removed' });
        queryClient.invalidateQueries({ queryKey: getListMySkillsQueryKey() });
      },
      onError: () => toast({ title: 'Error', description: 'Failed to remove skill', variant: 'destructive' })
    });
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-48" /><Skeleton className="h-64 w-full" /></div>;

  // Group skills by category
  const skillsByCategory = (skills || []).reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category]!.push(skill);
    return acc;
  }, {} as Record<string, NonNullable<typeof skills>>);

  const levelColors = {
    beginner: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
    intermediate: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    advanced: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
  };

  const predefinedCategories = ["Technical", "Programming Languages", "Frameworks & Libraries", "Tools", "Soft Skills", "Domain Knowledge"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Skills Portfolio</h2>
          <p className="text-muted-foreground">Manage your technical and soft skills.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Skill</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddSubmit}>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Skill Name</Label>
                  <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. React, Python, Leadership" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Proficiency Level</Label>
                  <Select value={formData.level} onValueChange={(v: any) => setFormData({...formData, level: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={addSkill.isPending}>
                  {addSkill.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {(!skills || skills.length === 0) ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No skills added yet</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              Add your skills to improve your readiness score and match with eligible companies.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add your first skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(skillsByCategory).map(([category, catSkills]) => (
            <Card key={category} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b border-border/50">
                <CardTitle className="text-lg flex justify-between items-center">
                  {category}
                  <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-1 rounded-full border">
                    {catSkills.length} skills
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-border/50">
                  <AnimatePresence>
                    {catSkills.map(skill => (
                      <motion.li 
                        key={skill.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors"
                      >
                        <span className="font-medium">{skill.name}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium uppercase tracking-wider ${levelColors[skill.level]}`}>
                            {skill.level}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-50 hover:opacity-100" 
                            onClick={() => handleRemove(skill.id)}
                            disabled={removeSkill.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}