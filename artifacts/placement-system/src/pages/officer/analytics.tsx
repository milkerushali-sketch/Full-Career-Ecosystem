import React from 'react';
import { useGetPlacementStats, getGetPlacementStatsQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { TrendingUp, Users, Target, GraduationCap } from 'lucide-react';

export default function OfficerAnalyticsPage() {
  const { data: stats, isLoading } = useGetPlacementStats({
    query: { queryKey: getGetPlacementStatsQueryKey() }
  });

  if (isLoading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );

  if (!stats) return null;

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Placement Analytics</h2>
        <p className="text-muted-foreground">In-depth metrics and historical performance tracking.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardContent className="p-6 text-center flex flex-col justify-center h-full">
            <div className="mx-auto p-2 bg-emerald-500/10 text-emerald-500 rounded-full mb-3 w-max">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold">{stats.placementRate}%</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Placement Rate</div>
          </CardContent>
        </Card>
        
        <Card className="hover-elevate">
          <CardContent className="p-6 text-center flex flex-col justify-center h-full">
            <div className="mx-auto p-2 bg-blue-500/10 text-blue-500 rounded-full mb-3 w-max">
              <Users className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold">{stats.totalPlaced}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Total Placed</div>
          </CardContent>
        </Card>
        
        <Card className="hover-elevate">
          <CardContent className="p-6 text-center flex flex-col justify-center h-full">
            <div className="mx-auto p-2 bg-amber-500/10 text-amber-500 rounded-full mb-3 w-max">
              <Target className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold">{stats.avgPackage ? `${stats.avgPackage.toFixed(1)}L` : 'TBD'}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Average CTC</div>
          </CardContent>
        </Card>
        
        <Card className="hover-elevate">
          <CardContent className="p-6 text-center flex flex-col justify-center h-full">
            <div className="mx-auto p-2 bg-purple-500/10 text-purple-500 rounded-full mb-3 w-max">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold text-primary">{stats.topPackage ? `${stats.topPackage.toFixed(1)}L` : 'TBD'}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">Highest CTC</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Placement Trend</CardTitle>
            <CardDescription>Monthly placement and interview volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="placed" name="Placed Students" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPlaced)" />
                  <Area type="monotone" dataKey="interviews" name="Interviews" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorInterviews)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
            <CardDescription>Distribution of placed students by department</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-[300px] w-full max-w-sm">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.departmentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="placed"
                    nameKey="department"
                  >
                    {stats.departmentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Batch Comparison</CardTitle>
          <CardDescription>Performance metrics across recent graduating batches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.batchStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="batch" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="placed" name="Total Placed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                <Bar yAxisId="right" dataKey="avgPackage" name="Avg CTC (LPA)" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}