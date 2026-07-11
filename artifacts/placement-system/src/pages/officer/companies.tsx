import React, { useState } from 'react';
import { useListCompanies, getListCompaniesQueryKey, useCreateCompany, useUpdateCompany, Company } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogScrollArea } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Building2, Search, Edit, Globe, Users, Briefcase } from 'lucide-react';

export default function OfficerCompaniesPage() {
  const { data: companies, isLoading } = useListCompanies({
    query: { queryKey: getListCompaniesQueryKey() }
  });
  
  const createCompany = useCreateCompany();
  const updateCompany = useUpdateCompany();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    website: '',
    logoUrl: '',
    packageMin: '',
    packageMax: '',
    minCGPARequired: '',
    maxBacklogs: '0',
    requiredSkills: '' as string,
    eligibleDepartments: '' as string
  });

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({
      name: '', industry: '', description: '', website: '', logoUrl: '',
      packageMin: '', packageMax: '', minCGPARequired: '7.0', maxBacklogs: '0',
      requiredSkills: '', eligibleDepartments: ''
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (company: Company) => {
    setEditingId(company.id);
    setFormData({
      name: company.name,
      industry: company.industry,
      description: company.description || '',
      website: company.website || '',
      logoUrl: company.logoUrl || '',
      packageMin: company.packageMin?.toString() || '',
      packageMax: company.packageMax?.toString() || '',
      minCGPARequired: company.minCGPARequired?.toString() || '0',
      maxBacklogs: company.maxBacklogs?.toString() || '0',
      requiredSkills: (company.requiredSkills || []).join(', '),
      eligibleDepartments: (company.eligibleDepartments || []).join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      industry: formData.industry,
      description: formData.description,
      website: formData.website,
      logoUrl: formData.logoUrl,
      packageMin: formData.packageMin ? Number(formData.packageMin) : undefined,
      packageMax: formData.packageMax ? Number(formData.packageMax) : undefined,
      minCGPARequired: Number(formData.minCGPARequired),
      maxBacklogs: Number(formData.maxBacklogs),
      requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      eligibleDepartments: formData.eligibleDepartments.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingId) {
      updateCompany.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Company updated' });
          queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Update failed', variant: 'destructive' })
      });
    } else {
      createCompany.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Company created' });
          queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Creation failed', variant: 'destructive' })
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><Skeleton className="h-64" /><Skeleton className="h-64" /><Skeleton className="h-64" /></div></div>;

  const filtered = (companies || []).filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Partner Companies</h2>
          <p className="text-muted-foreground">Manage recruiters and their eligibility criteria.</p>
        </div>
        <Button onClick={openAddDialog}><Plus className="mr-2 h-4 w-4" /> Add Company</Button>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search companies by name or industry..." 
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(company => (
          <Card key={company.id} className="flex flex-col hover-elevate border-border/50">
            <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-background border flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1">
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="h-full w-full object-contain" />
                  ) : (
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <p className="text-sm text-primary font-medium">{company.industry}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => openEditDialog(company)} className="h-8 w-8 text-muted-foreground -mt-2 -mr-2">
                <Edit className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm bg-muted/30 p-3 rounded-md border border-border/50">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs uppercase font-semibold">CTC Range</span>
                  <span className="font-medium">
                    {company.packageMin && company.packageMax 
                      ? `${company.packageMin} - ${company.packageMax} LPA` 
                      : company.packageMin ? `${company.packageMin}+ LPA` : 'TBD'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs uppercase font-semibold">Min CGPA</span>
                  <span className="font-medium">{company.minCGPARequired?.toFixed(1) || 'None'}</span>
                </div>
                <div className="flex flex-col col-span-2">
                  <span className="text-muted-foreground text-xs uppercase font-semibold">Eligible Depts</span>
                  <span className="font-medium truncate" title={(company.eligibleDepartments||[]).join(', ')}>
                    {(company.eligibleDepartments||[]).length > 0 ? (company.eligibleDepartments||[]).join(', ') : 'All'}
                  </span>
                </div>
              </div>
              
              {company.requiredSkills && company.requiredSkills.length > 0 && (
                <div className="mt-4">
                  <span className="text-xs text-muted-foreground block mb-2 font-medium">Required Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {company.requiredSkills.slice(0, 4).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0.5 rounded-sm font-semibold">{skill}</Badge>
                    ))}
                    {company.requiredSkills.length > 4 && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 rounded-sm bg-transparent border-dashed">+{company.requiredSkills.length - 4}</Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            {company.website && (
              <CardFooter className="pt-0 pb-4 border-t border-border/50 mt-auto">
                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground mt-2" asChild>
                  <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-3.5 w-3.5" /> Visit Website
                  </a>
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 h-[85vh] flex flex-col">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle>{editingId ? 'Edit Company' : 'Add New Company'}</DialogTitle>
            </DialogHeader>
            
            <DialogScrollArea className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name *</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Input id="industry" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description / Profile</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input id="logoUrl" value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} placeholder="https://..." />
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-muted/20 space-y-4">
                  <h4 className="font-semibold text-sm flex items-center"><Briefcase className="w-4 h-4 mr-2 text-primary" /> Hiring Criteria</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="packageMin">Min CTC (LPA)</Label>
                      <Input id="packageMin" type="number" step="0.1" value={formData.packageMin} onChange={e => setFormData({...formData, packageMin: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="packageMax">Max CTC (LPA)</Label>
                      <Input id="packageMax" type="number" step="0.1" value={formData.packageMax} onChange={e => setFormData({...formData, packageMax: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minCGPARequired">Min CGPA Cutoff</Label>
                      <Input id="minCGPARequired" type="number" step="0.1" max="10" value={formData.minCGPARequired} onChange={e => setFormData({...formData, minCGPARequired: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxBacklogs">Max Allowed Backlogs</Label>
                      <Input id="maxBacklogs" type="number" value={formData.maxBacklogs} onChange={e => setFormData({...formData, maxBacklogs: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requiredSkills">Required Skills (comma separated)</Label>
                    <Input id="requiredSkills" value={formData.requiredSkills} onChange={e => setFormData({...formData, requiredSkills: e.target.value})} placeholder="React, Node.js, Python" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eligibleDepartments">Eligible Departments (comma separated)</Label>
                    <Input id="eligibleDepartments" value={formData.eligibleDepartments} onChange={e => setFormData({...formData, eligibleDepartments: e.target.value})} placeholder="CSE, IT, ECE" />
                  </div>
                </div>
              </div>
            </DialogScrollArea>
            
            <DialogFooter className="p-6 border-t mt-auto shrink-0 bg-background">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createCompany.isPending || updateCompany.isPending}>
                Save Company
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}