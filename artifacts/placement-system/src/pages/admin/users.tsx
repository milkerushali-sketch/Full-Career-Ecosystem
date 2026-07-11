import React, { useState } from 'react';
import { useAdminListUsers, getAdminListUsersQueryKey, useAdminUpdateUser, useAdminDeleteUser, User } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, ShieldAlert, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminListUsers({
    query: { queryKey: getAdminListUsersQueryKey() }
  });
  
  const updateUser = useAdminUpdateUser();
  const deleteUser = useAdminDeleteUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const toggleStatus = (user: User) => {
    updateUser.mutate({ id: user.id, data: { isActive: !user.isActive } }, {
      onSuccess: () => {
        toast({ title: 'Success', description: `User status updated` });
        queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Permanently delete this user? This cannot be undone.')) {
      deleteUser.mutate({ id }, {
        onSuccess: () => {
          toast({ title: 'Success', description: 'User deleted' });
          queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() });
        }
      });
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-[500px]" /></div>;

  const filtered = (users || []).filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleColors = {
    admin: "bg-destructive/10 text-destructive border-destructive/20",
    officer: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    student: "bg-blue-500/10 text-blue-600 border-blue-500/20"
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Users</h2>
          <p className="text-muted-foreground">Manage access across the platform.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/10 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="flex h-10 w-[150px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="officer">Officer</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-background sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`uppercase font-bold tracking-wider text-[10px] ${roleColors[user.role]}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleStatus(user)}
                      className={`h-7 px-2 text-xs font-semibold ${user.isActive ? 'text-emerald-600 hover:text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20' : 'text-muted-foreground bg-muted hover:bg-muted/80'}`}
                    >
                      {user.isActive ? 'Active' : 'Suspended'}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {format(parseISO(user.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}