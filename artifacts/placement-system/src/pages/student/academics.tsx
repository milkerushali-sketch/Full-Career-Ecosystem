import React, { useState, useEffect } from 'react';
import { useGetMyAcademics, getGetMyAcademicsQueryKey, useUpdateMyAcademics, SemesterInput } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';

export default function StudentAcademicsPage() {
  const { data: academics, isLoading } = useGetMyAcademics({
    query: { queryKey: getGetMyAcademicsQueryKey() }
  });
  const updateAcademics = useUpdateMyAcademics();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<{ cgpa: number | ''; backlogs: number; semesters: SemesterInput[] }>({
    cgpa: '',
    backlogs: 0,
    semesters: []
  });

  useEffect(() => {
    if (academics) {
      setFormData({
        cgpa: academics.cgpa,
        backlogs: academics.backlogs,
        semesters: academics.semesters.map(s => ({
          semester: s.semester,
          sgpa: s.sgpa,
          year: s.year,
          backlogs: s.backlogs || 0
        }))
      });
    }
  }, [academics]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAcademics.mutate(
      { data: { 
          cgpa: Number(formData.cgpa) || 0, 
          backlogs: Number(formData.backlogs) || 0,
          semesters: formData.semesters.map(s => ({...s, sgpa: Number(s.sgpa), semester: Number(s.semester), backlogs: Number(s.backlogs)}))
        } 
      },
      {
        onSuccess: (updatedData) => {
          toast({ title: 'Success', description: 'Academics updated successfully' });
          queryClient.setQueryData(getGetMyAcademicsQueryKey(), updatedData);
        },
        onError: () => {
          toast({ title: 'Error', description: 'Failed to update academics', variant: 'destructive' });
        }
      }
    );
  };

  const handleSemesterChange = (index: number, field: string, value: string) => {
    const newSemesters = [...formData.semesters];
    newSemesters[index] = { ...newSemesters[index], [field]: value };
    setFormData({ ...formData, semesters: newSemesters });
  };

  const addSemester = () => {
    const nextSem = formData.semesters.length + 1;
    const currentYear = new Date().getFullYear().toString();
    setFormData({
      ...formData,
      semesters: [...formData.semesters, { semester: nextSem, sgpa: 0, year: currentYear, backlogs: 0 }]
    });
  };

  const removeSemester = (index: number) => {
    const newSemesters = [...formData.semesters];
    newSemesters.splice(index, 1);
    setFormData({ ...formData, semesters: newSemesters });
  };

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-48 w-full" /><Skeleton className="h-96 w-full" /></div>;

  // Prepare chart data
  const chartData = (academics?.semesters || [])
    .sort((a, b) => a.semester - b.semester)
    .map(s => ({ name: `Sem ${s.semester}`, sgpa: s.sgpa }));

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Cumulative GPA</h3>
            <div className="text-6xl font-bold text-primary">{academics?.cgpa ? academics.cgpa.toFixed(2) : "0.00"}</div>
            <p className="text-sm mt-4 text-muted-foreground">Maintained across {academics?.semesters.length || 0} semesters</p>
          </CardContent>
        </Card>
        
        <Card className={(academics?.backlogs && academics.backlogs > 0) ? "bg-destructive/5 border-destructive/20" : "bg-emerald-500/5 border-emerald-500/20"}>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Active Backlogs</h3>
            <div className={`text-6xl font-bold ${(academics?.backlogs && academics.backlogs > 0) ? "text-destructive" : "text-emerald-600"}`}>
              {academics?.backlogs || 0}
            </div>
            <p className="text-sm mt-4 text-muted-foreground">
              {(academics?.backlogs && academics.backlogs > 0) ? "Needs to be cleared for placements" : "All clear! Good job."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Academic Progress</CardTitle>
              <CardDescription>Your SGPA trend over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                      />
                      <Line type="monotone" dataKey="sgpa" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground border border-dashed rounded-lg">
                  No semester data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle>Update Records</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-border/50">
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">Current CGPA</Label>
                    <Input id="cgpa" type="number" step="0.01" min="0" max="10" value={formData.cgpa} onChange={e => setFormData({...formData, cgpa: e.target.value as unknown as number})} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backlogs">Total Backlogs</Label>
                    <Input id="backlogs" type="number" min="0" value={formData.backlogs} onChange={e => setFormData({...formData, backlogs: Number(e.target.value)})} required />
                  </div>
                </div>

                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Semester Records</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSemester} className="h-8">
                      <Plus className="h-4 w-4 mr-1" /> Add Sem
                    </Button>
                  </div>
                  
                  {formData.semesters.length === 0 ? (
                    <div className="text-sm text-center py-4 text-muted-foreground italic">No semesters added yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {formData.semesters.map((sem, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-border/50">
                          <div className="w-16">
                            <Label className="text-xs text-muted-foreground mb-1 block">Sem</Label>
                            <Input type="number" value={sem.semester} onChange={e => handleSemesterChange(i, 'semester', e.target.value)} className="h-8 px-2" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground mb-1 block">SGPA</Label>
                            <Input type="number" step="0.01" value={sem.sgpa} onChange={e => handleSemesterChange(i, 'sgpa', e.target.value)} className="h-8 px-2" />
                          </div>
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground mb-1 block">Year</Label>
                            <Input value={sem.year} onChange={e => handleSemesterChange(i, 'year', e.target.value)} className="h-8 px-2" />
                          </div>
                          <div className="w-10 flex flex-col justify-end pt-5">
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeSemester(i)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="p-6 pt-4 mt-auto border-t border-border/50">
                <Button type="submit" className="w-full" disabled={updateAcademics.isPending}>
                  {updateAcademics.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save All Records
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}