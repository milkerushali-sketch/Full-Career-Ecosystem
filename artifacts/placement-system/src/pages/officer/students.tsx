import React, { useState } from 'react';
import { useListAllStudents, getListAllStudentsQueryKey } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useLocation } from 'wouter';

export default function OfficerStudentsPage() {
  const { data: students, isLoading } = useListAllStudents({
    query: { queryKey: getListAllStudentsQueryKey() }
  });
  
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-full" /><Skeleton className="h-[500px] w-full" /></div>;

  const departments = Array.from(new Set(students?.map(s => s.department).filter(Boolean))) as string[];

  const filtered = (students || []).filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.rollNo && s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDept = departmentFilter === 'all' || s.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Student Directory</h2>
          <p className="text-muted-foreground">Manage and track all registered students.</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-border/50 shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/10 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or roll number..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={departmentFilter}
              onChange={e => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-background sticky top-0 z-10 shadow-sm">
              <TableRow>
                <TableHead>Student Details</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">CGPA</TableHead>
                <TableHead className="text-right">Readiness</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(student => (
                  <TableRow 
                    key={student.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      // In a real app we'd open a slide-over panel here
                      // toast({ title: 'Student details', description: `Viewing ${student.name}` });
                    }}
                  >
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{student.rollNo || '-'}</TableCell>
                    <TableCell>
                      {student.department ? (
                        <Badge variant="outline" className="font-normal">{student.department}</Badge>
                      ) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {student.cgpa ? student.cgpa.toFixed(2) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold">{student.readinessScore}</span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${student.readinessScore > 75 ? 'bg-emerald-500' : student.readinessScore > 50 ? 'bg-amber-500' : 'bg-destructive'}`}
                            style={{ width: `${student.readinessScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {student.isPlaced ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">Placed</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">Available</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-3 border-t border-border/50 text-xs text-muted-foreground text-center bg-muted/10">
          Showing {filtered.length} students
        </div>
      </Card>
    </div>
  );
}