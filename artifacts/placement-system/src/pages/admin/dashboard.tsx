import React from 'react';
import { useGetAdminDashboard, getGetAdminDashboardQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Building2, UserCircle, Settings, ShieldAlert, Network, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminDashboard({
    query: { queryKey: getGetAdminDashboardQueryKey() }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data) return null;

  const kpis = [
    { title: "Total Users", value: data.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Students", value: data.totalStudents, icon: UserCircle, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Officers", value: data.totalOfficers, icon: ShieldAlert, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Companies", value: data.totalCompanies, icon: Building2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Departments", value: data.totalDepartments, icon: Network, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Administration</h2>
        <p className="text-muted-foreground">Global oversight of the platform infrastructure and users.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" /> System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-500/10 mb-4">
                  <ShieldCheck className="h-12 w-12 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-500 capitalize">{data.systemHealth}</h3>
                <p className="text-muted-foreground mt-2">All services are operating normally</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="p-4 rounded-lg bg-muted/30 border flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">Force Sync Readiness</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Re-run AI models for all students</p>
              </div>
              <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded font-medium opacity-50 cursor-not-allowed">Run</button>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">Backup Database</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Export all records to S3</p>
              </div>
              <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded font-medium opacity-50 cursor-not-allowed">Start</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}