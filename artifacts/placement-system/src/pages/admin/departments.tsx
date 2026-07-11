import React, { useState } from 'react';
import { useListDepartments, getListDepartmentsQueryKey, useCreateDepartment, useUpdateDepartment, useAdminDeleteDepartment, Department } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Edit, Trash2, Loader2, Network } from 'lucide-react';

export default function AdminDepartmentsPage() {
  const { data: departments, isLoading } = useListDepartments({
    query: { queryKey: getListDepartmentsQueryKey() }
  });
  
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useAdminDeleteDepartment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    hodName: ''
  });

  const openAddDialog = () => {
    setEditingId(null);
    setFormData({ name: '', code: '', hodName: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (dept: Department) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name,
      code: dept.code,
      hodName: dept.hodName || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateDepartment.mutate({ id: editingId, data: formData }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Department updated' });
          queryClient.invalidateQueries({ queryKey: getListDepartmentsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Update failed', variant: 'destructive' })
      });
    } else {
      createDepartment.mutate({ data: formData }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Department created' });
          queryClient.invalidateQueries({ queryKey: getListDepartmentsQueryKey() });
          setIsDialogOpen(false);
        },
        onError: () => toast({ title: 'Error', description: 'Creation failed', variant: 'destructive' })
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this department? Make sure no students are assigned to it.')) {
      deleteDepartment.mutate({ id }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'Department deleted' });
          queryClient.invalidateQueries({ queryKey: getListDepartmentsQueryKey() });
        },
        onError: () => toast({ title: 'Error', description: 'Cannot delete department in use', variant: 'destructive' })
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-[500px]" /></div>;

  const filtered = (departments || []).filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Departments</h2>
          <p className="text-muted-foreground">Manage academic departments and branches.</p>
        </div>
        <Button onClick={openAddDialog}><Plus className="mr-2 h-4 w-4" /> Add Department</Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/10">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or code..." 
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
                <TableHead>Department Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Head of Department</TableHead>
                <TableHead className="text-right">Students Enrolled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <Network className="mx-auto h-8 w-8 mb-2 opacity-20" />
                    No departments found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(dept => (
                  <TableRow key={dept.id} className="hover:bg-muted/50">
                    <TableCell className="font-semibold">{dept.name}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-semibold bg-muted px-2 py-1 rounded border">
                        {dept.code}
                      </span>
                    </TableCell>
                    <TableCell>{dept.hodName || '-'}</TableCell>
                    <TableCell className="text-right font-medium">
                      {dept.studentCount || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(dept)} className="h-8 w-8 text-muted-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
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
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Department' : 'Add Department'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Department Name *</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Computer Science and Engineering" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Short Code *</Label>
                  <Input id="code" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. CSE" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hodName">HOD Name</Label>
                  <Input id="hodName" value={formData.hodName} onChange={e => setFormData({...formData, hodName: e.target.value})} placeholder="Dr. John Doe" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createDepartment.isPending || updateDepartment.isPending}>
                {(createDepartment.isPending || updateDepartment.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}