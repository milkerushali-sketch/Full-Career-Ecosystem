import React, { useState } from 'react';
import { useListMyInternships, getListMyInternshipsQueryKey, useAddInternship, useUpdateInternship, useDeleteInternship, Internship } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, Briefcase, Calendar, Edit, Trash2, MapPin, IndianRupee } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function StudentInternshipsPage() {
  const { data: internships, isLoading } = useListMyInternships({
    query: { queryKey: getListMyInternshipsQueryKey() }
  });
  
  const addInternship = useAddInternship();
  const updateInternship = useUpdateInternship();
  const deleteInternship = useDeleteInternship();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    description: '',
    location: '',
    stipend: '',
    startDate: '',
    endDate: ''
  });

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({ company: '', role: '', description: '', location: '', stipend: '', startDate: '', endDate: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Internship) => {
    setEditingId(item.id);
    setFormData({
      company: item.company,
      role: item.role,
      description: item.description || '',
      location: item.location || '',
      stipend: item.stipend?.toString() || '',
      startDate: item.startDate || '',
      endDate: item.endDate || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      stipend: formData.stipend ? Number(formData.stipend) : undefined
    };

    if (editingId) {
      updateInternship.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Internship updated' });
          queryClient.invalidateQueries({ queryKey: getListMyInternshipsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Failed to update internship', variant: 'destructive' })
      });
    } else {
      addInternship.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Internship added' });
          queryClient.invalidateQueries({ queryKey: getListMyInternshipsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Failed to add internship', variant: 'destructive' })
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this internship?')) {
      deleteInternship.mutate({ id }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Internship deleted' });
          queryClient.invalidateQueries({ queryKey: getListMyInternshipsQueryKey() });
        },
        onError: () => toast({ title: 'Error', description: 'Failed to delete internship', variant: 'destructive' })
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-48" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
          <p className="text-muted-foreground">Internships and full-time roles.</p>
        </div>
        <Button onClick={openAddDialog}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
      </div>

      {(!internships || internships.length === 0) ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No experience added</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              Add your internships or full-time roles here.
            </p>
            <Button variant="outline" className="mt-4" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add experience
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {internships.sort((a,b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime()).map((item, index) => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary/20 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Briefcase className="w-4 h-4" />
              </div>
              <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] hover-elevate">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.role}</CardTitle>
                      <p className="text-primary font-medium">{item.company}</p>
                    </div>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)} className="h-8 w-8 text-muted-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground font-medium">
                    {(item.startDate || item.endDate) && (
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.startDate ? format(parseISO(item.startDate), 'MMM yyyy') : ''} - {item.endDate ? format(parseISO(item.endDate), 'MMM yyyy') : 'Present'}
                      </span>
                    )}
                    {item.location && (
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> {item.location}
                      </span>
                    )}
                    {item.stipend ? (
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                        <IndianRupee className="h-3 w-3 mr-1" /> {item.stipend.toLocaleString()}/mo
                      </span>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{item.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input id="company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role / Title *</Label>
                  <Input id="role" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Tasks & Achievements)</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date (empty = Present)</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location (City or Remote)</Label>
                  <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stipend">Stipend / Salary (Numeric)</Label>
                  <Input id="stipend" type="number" value={formData.stipend} onChange={e => setFormData({...formData, stipend: e.target.value})} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addInternship.isPending || updateInternship.isPending}>
                {(addInternship.isPending || updateInternship.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}