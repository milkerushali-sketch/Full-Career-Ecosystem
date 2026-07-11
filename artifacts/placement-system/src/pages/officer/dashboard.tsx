import React from 'react';
import { useGetOfficerDashboard, getGetOfficerDashboardQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Briefcase, CalendarCheck, Building2, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function OfficerDashboardPage() {
  const { data, isLoading } = useGetOfficerDashboard({
    query: { queryKey: getGetOfficerDashboardQueryKey() }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const kpis = [
    { title: "Total Students", value: data.totalStudents, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Placed", value: data.placedStudents, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Active Jobs", value: data.activeJobs, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Interviews", value: data.scheduledInterviews, icon: CalendarCheck, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Companies", value: data.companiesVisited, icon: Building2, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Avg Readiness", value: data.avgReadinessScore, icon: TrendingUp, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Placement Command Center</h2>
        <p className="text-muted-foreground">Overview of university placement activities and student readiness.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="overflow-hidden border-border/50 shadow-sm">
            <CardContent className="p-4 flex flex-col items-center text-center justify-center h-full">
              <div className={`p-2 rounded-full mb-2 ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">{kpi.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Department Placement Rates</CardTitle>
            <CardDescription>Percentage of students placed per department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.departmentStats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(val) => `${val}%`} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="department" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <RechartsTooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    formatter={(value: number) => [`${value}%`, 'Placement Rate']}
                  />
                  <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={24}>
                    {data.departmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-sm border-border/50 flex flex-col">
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
            <CardDescription>Next 24-48 hours</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto px-2">
            {data.recentInterviews.length > 0 ? (
              <div className="space-y-4 pr-4">
                {data.recentInterviews.map((interview) => (
                  <div key={interview.id} className="flex flex-col p-3 rounded-lg border border-border bg-muted/20">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{interview.studentName}</span>
                      <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {format(parseISO(interview.scheduledAt), 'HH:mm')}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{interview.companyName}</div>
                    <div className="flex justify-between mt-2 items-center">
                      <span className="text-xs capitalize bg-muted px-2 py-0.5 rounded-full">{interview.type.replace('_', ' ')}</span>
                      <span className="text-xs text-muted-foreground">{format(parseISO(interview.scheduledAt), 'MMM dd')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No upcoming interviews scheduled.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}