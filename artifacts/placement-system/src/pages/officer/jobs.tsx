import React, { useState } from 'react';
import { useListJobs, getListJobsQueryKey, useCreateJob, useUpdateJob, JobPosting } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogScrollArea } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Briefcase, Search, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function OfficerJobsPage() {
  const { data: jobs, isLoading } = useListJobs({
    query: { queryKey: getListJobsQueryKey() }
  });
  
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    description: '',
    eligibilityCriteria: '',
    applicationDeadline: '',
    status: 'open' as 'open' | 'closed' | 'upcoming',
    ctc: '',
    openings: ''
  });

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({
      title: '', companyId: '', description: '', eligibilityCriteria: '',
      applicationDeadline: '', status: 'upcoming', ctc: '', openings: ''
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (job: JobPosting) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      companyId: job.companyId.toString(),
      description: job.description || '',
      eligibilityCriteria: job.eligibilityCriteria || '',
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '', // simple date string
      status: job.status,
      ctc: job.ctc?.toString() || '',
      openings: job.openings?.toString() || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert applicationDeadline to ISO format for API if not empty
    let isoDate = formData.applicationDeadline;
    if (isoDate && !isoDate.includes('T')) {
      isoDate = new Date(isoDate).toISOString();
    }

    const payload = {
      title: formData.title,
      companyId: Number(formData.companyId),
      description: formData.description,
      eligibilityCriteria: formData.eligibilityCriteria,
      applicationDeadline: isoDate || undefined,
      status: formData.status,
      ctc: formData.ctc ? Number(formData.ctc) : undefined,
      openings: formData.openings ? Number(formData.openings) : undefined
    };

    if (editingId) {
      updateJob.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Job posting updated' });
          queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Update failed', variant: 'destructive' })
      });
    } else {
      createJob.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Job posting created' });
          queryClient.invalidateQueries({ queryKey: getListJobsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Creation failed', variant: 'destructive' })
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-[500px]" /></div>;

  const filtered = (jobs || []).filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    open: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    upcoming: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    closed: "bg-muted text-muted-foreground border-border"
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Job Postings</h2>
          <p className="text-muted-foreground">Manage active placement drives and applications.</p>
        </div>
        <Button onClick={openAddDialog}><Plus className="mr-2 h-4 w-4" /> New Posting</Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by role or company..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-background sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead>Role & Company</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">CTC (LPA)</TableHead>
                <TableHead className="text-right">Applicants</TableHead>
                <TableHead className="text-right">Deadline</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No job postings found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(job => (
                  <TableRow key={job.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="font-semibold">{job.title}</div>
                      <div className="text-sm text-primary flex items-center mt-0.5">
                        <Briefcase className="h-3 w-3 mr-1 inline" /> {job.companyName}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`uppercase tracking-wider text-[10px] font-bold ${statusColors[job.status]}`}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {job.ctc ? job.ctc : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-center bg-muted px-2 py-0.5 rounded text-xs font-medium">
                        {job.applicationCount || 0}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {job.applicationDeadline ? (
                        <span className={`flex items-center justify-end ${new Date(job.applicationDeadline) < new Date() ? 'text-destructive' : 'text-muted-foreground'}`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(parseISO(job.applicationDeadline), 'MMM dd, yyyy')}
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(job)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 h-[80vh] flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle>{editingId ? 'Edit Job Posting' : 'Create Job Posting'}</DialogTitle>
            </DialogHeader>
            
            <DialogScrollArea className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title / Role *</Label>
                  <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyId">Company ID * (Needs Select in real app)</Label>
                    <Input id="companyId" type="number" value={formData.companyId} onChange={e => setFormData({...formData, companyId: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="open">Open (Accepting Apps)</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eligibilityCriteria">Custom Eligibility Notes</Label>
                  <Textarea id="eligibilityCriteria" value={formData.eligibilityCriteria} onChange={e => setFormData({...formData, eligibilityCriteria: e.target.value})} rows={2} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctc">CTC (LPA)</Label>
                    <Input id="ctc" type="number" step="0.1" value={formData.ctc} onChange={e => setFormData({...formData, ctc: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="openings">Openings</Label>
                    <Input id="openings" type="number" value={formData.openings} onChange={e => setFormData({...formData, openings: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline">Deadline</Label>
                    <Input id="applicationDeadline" type="date" value={formData.applicationDeadline} onChange={e => setFormData({...formData, applicationDeadline: e.target.value})} />
                  </div>
                </div>
              </div>
            </DialogScrollArea>
            
            <DialogFooter className="p-6 border-t mt-auto shrink-0 bg-background">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createJob.isPending || updateJob.isPending}>
                Save Posting
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}