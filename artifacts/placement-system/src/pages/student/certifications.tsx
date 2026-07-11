import React, { useState } from 'react';
import { useListMyCertifications, getListMyCertificationsQueryKey, useAddCertification, useDeleteCertification } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Loader2, FileText, ExternalLink, Calendar, Trash2, Award } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function StudentCertificationsPage() {
  const { data: certs, isLoading } = useListMyCertifications({
    query: { queryKey: getListMyCertificationsQueryKey() }
  });
  
  const addCert = useAddCertification();
  const deleteCert = useDeleteCertification();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCert.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: 'Success', description: 'Certification added' });
        queryClient.invalidateQueries({ queryKey: getListMyCertificationsQueryKey() });
        setIsDialogOpen(false);
        setFormData({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' });
      },
      onError: () => toast({ title: 'Error', description: 'Failed to add certification', variant: 'destructive' })
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this certification?')) {
      deleteCert.mutate({ id }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Certification deleted' });
          queryClient.invalidateQueries({ queryKey: getListMyCertificationsQueryKey() });
        },
        onError: () => toast({ title: 'Error', description: 'Failed to delete certification', variant: 'destructive' })
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-48" /><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><Skeleton className="h-48" /><Skeleton className="h-48" /></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Certifications</h2>
          <p className="text-muted-foreground">Official credentials and completed courses.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Credential</Button>
      </div>

      {(!certs || certs.length === 0) ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <Award className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground">No certifications yet</h3>
            <p className="text-muted-foreground max-w-sm mt-1">
              Add external certifications to validate your skills to employers.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {certs.map(cert => (
            <Card key={cert.id} className="relative group overflow-hidden border border-border/50 shadow-sm hover-elevate">
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(cert.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="pb-3">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3">
                  <FileText className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">{cert.name}</CardTitle>
                <CardDescription className="font-medium text-foreground">{cert.issuer}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2 text-sm text-muted-foreground space-y-1">
                {cert.issueDate && (
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2" />
                    Issued: {format(parseISO(cert.issueDate), 'MMM yyyy')}
                  </div>
                )}
                {cert.credentialId && (
                  <div className="truncate" title={cert.credentialId}>
                    <span className="font-medium">ID:</span> {cert.credentialId}
                  </div>
                )}
              </CardContent>
              {cert.credentialUrl && (
                <CardFooter className="pt-2">
                  <Button variant="secondary" className="w-full text-xs h-8" asChild>
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                      View Credential <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add Certification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Certification Name *</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization *</Label>
                <Input id="issuer" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} placeholder="e.g. AWS, Microsoft, Coursera" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input id="issueDate" type="date" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input id="expiryDate" type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialId">Credential ID</Label>
                <Input id="credentialId" value={formData.credentialId} onChange={e => setFormData({...formData, credentialId: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credentialUrl">Credential URL</Label>
                <Input id="credentialUrl" type="url" value={formData.credentialUrl} onChange={e => setFormData({...formData, credentialUrl: e.target.value})} placeholder="https://..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addCert.isPending}>
                {addCert.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}