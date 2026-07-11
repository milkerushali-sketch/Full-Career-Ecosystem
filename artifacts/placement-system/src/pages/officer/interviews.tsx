import React, { useState } from 'react';
import { useListInterviews, getListInterviewsQueryKey, useScheduleInterview, useUpdateInterview, Interview } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogScrollArea } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Calendar, Edit, MapPin, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function OfficerInterviewsPage() {
  const { data: interviews, isLoading } = useListInterviews({
    query: { queryKey: getListInterviewsQueryKey() }
  });
  
  const scheduleInterview = useScheduleInterview();
  const updateInterview = useUpdateInterview();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    studentId: '',
    companyId: '',
    jobId: '',
    scheduledAt: '',
    type: 'technical' as 'technical'|'hr'|'group_discussion'|'aptitude'|'final',
    status: 'scheduled' as 'scheduled'|'completed'|'cancelled'|'rescheduled',
    venue: '',
    feedback: '',
    result: ''
  });

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({
      studentId: '', companyId: '', jobId: '', scheduledAt: '',
      type: 'technical', status: 'scheduled', venue: '', feedback: '', result: ''
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (interview: Interview) => {
    setEditingId(interview.id);
    setFormData({
      studentId: interview.studentId.toString(),
      companyId: interview.companyId.toString(),
      jobId: interview.jobId?.toString() || '',
      scheduledAt: interview.scheduledAt ? interview.scheduledAt.slice(0, 16) : '', // format for datetime-local input
      type: interview.type,
      status: interview.status,
      venue: interview.venue || '',
      feedback: interview.feedback || '',
      result: interview.result || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dt = new Date(formData.scheduledAt);
    if (isNaN(dt.getTime())) {
      toast({ title: 'Error', description: 'Invalid date/time format.', variant: 'destructive' });
      return;
    }
    const isoDate = dt.toISOString();

    if (editingId) {
      updateInterview.mutate({ id: editingId, data: {
        scheduledAt: isoDate,
        status: formData.status,
        venue: formData.venue,
        feedback: formData.feedback,
        result: formData.result
      }}, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Interview updated' });
          queryClient.invalidateQueries({ queryKey: getListInterviewsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Update failed', variant: 'destructive' })
      });
    } else {
      scheduleInterview.mutate({ data: {
        studentId: Number(formData.studentId),
        companyId: Number(formData.companyId),
        jobId: formData.jobId ? Number(formData.jobId) : undefined,
        scheduledAt: isoDate,
        type: formData.type,
        venue: formData.venue
      }}, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Interview scheduled' });
          queryClient.invalidateQueries({ queryKey: getListInterviewsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Scheduling failed', variant: 'destructive' })
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-[500px]" /></div>;

  const filtered = (interviews || []).filter(i => 
    i.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    rescheduled: "bg-amber-500/10 text-amber-600 border-amber-500/20"
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Interview Schedule</h2>
          <p className="text-muted-foreground">Manage and track student interview pipelines.</p>
        </div>
        <Button onClick={openAddDialog}><Plus className="mr-2 h-4 w-4" /> Schedule Interview</Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by student or company name..." 
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
                <TableHead>Student</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No interviews found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.sort((a,b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()).map(interview => (
                  <TableRow key={interview.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{interview.studentName}</TableCell>
                    <TableCell>{interview.companyName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {interview.type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        {format(parseISO(interview.scheduledAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`uppercase tracking-wider text-[10px] font-bold ${statusColors[interview.status]}`}>
                        {interview.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(interview)} className="h-8 w-8">
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
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Update Interview' : 'Schedule Interview'}</DialogTitle>
            </DialogHeader>
            <DialogScrollArea className="max-h-[60vh] p-1 mt-4">
              <div className="space-y-4 px-1">
                
                {!editingId && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID *</Label>
                      <Input id="studentId" type="number" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyId">Company ID *</Label>
                      <Input id="companyId" type="number" value={formData.companyId} onChange={e => setFormData({...formData, companyId: e.target.value})} required />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Interview Type</Label>
                    <Select disabled={!!editingId} value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                        <SelectItem value="group_discussion">Group Discussion</SelectItem>
                        <SelectItem value="aptitude">Aptitude</SelectItem>
                        <SelectItem value="final">Final Round</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledAt">Date & Time *</Label>
                    <Input id="scheduledAt" type="datetime-local" value={formData.scheduledAt} onChange={e => setFormData({...formData, scheduledAt: e.target.value})} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue / Link</Label>
                  <Input id="venue" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} placeholder="Room 101 or Zoom link" />
                </div>

                {editingId && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/20 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Update Status</Label>
                      <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="rescheduled">Rescheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="result">Result / Decision</Label>
                      <Input id="result" value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})} placeholder="Selected, Rejected, Shortlisted for next round..." />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedback">Interviewer Feedback</Label>
                      <Textarea id="feedback" value={formData.feedback} onChange={e => setFormData({...formData, feedback: e.target.value})} rows={3} placeholder="Notes from the panel..." />
                    </div>
                  </div>
                )}
              </div>
            </DialogScrollArea>
            <DialogFooter className="mt-6 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={scheduleInterview.isPending || updateInterview.isPending}>
                {(scheduleInterview.isPending || updateInterview.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Interview
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}