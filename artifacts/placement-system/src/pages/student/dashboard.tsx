import React from 'react';
import { useGetStudentDashboard, getGetStudentDashboardQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Award, Code, CheckSquare, Building, FileText, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { data, isLoading } = useGetStudentDashboard({
    query: {
      queryKey: getGetStudentDashboardQueryKey(),
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 col-span-2" />
          <Skeleton className="h-80 col-span-1" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    { title: "Skills", value: data.skillCount, icon: Award, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Projects", value: data.projectCount, icon: Code, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Internships", value: data.internshipCount, icon: Briefcase, color: "text-teal-500", bg: "bg-teal-500/10" },
    { title: "Certifications", value: data.certificationCount, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Eligible Companies", value: data.eligibleCompanyCount, icon: Building, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Upcoming Interviews", value: data.upcomingInterviews, icon: CheckSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Gauge */}
        <Card className="col-span-1 lg:col-span-1 border-primary/20 bg-gradient-to-b from-card to-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-2">
              Placement Readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pb-6">
            <div className="relative w-48 h-48 flex items-center justify-center mt-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" 
                  className={data.readinessScore > 75 ? "text-emerald-500" : data.readinessScore > 50 ? "text-amber-500" : "text-destructive"}
                  strokeDasharray={`${(data.readinessScore / 100) * 283} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold tracking-tighter">{data.readinessScore}</span>
                <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Score</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {data.readinessScore >= 80 ? "Excellent readiness! You are well prepared for top tier companies." :
                 data.readinessScore >= 50 ? "Good progress. Focus on closing skill gaps to improve." :
                 "Needs attention. Build more projects and acquire core skills."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <CardTitle className="text-base font-semibold">Profile Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="text-sm font-medium text-right">{data.profile.name}</div>
                
                <div className="text-sm text-muted-foreground">Department</div>
                <div className="text-sm font-medium text-right">{data.profile.department || "Not specified"}</div>
                
                <div className="text-sm text-muted-foreground">CGPA</div>
                <div className="text-sm font-medium text-right">{data.profile.cgpa ? data.profile.cgpa.toFixed(2) : "N/A"}</div>
                
                <div className="text-sm text-muted-foreground">Batch</div>
                <div className="text-sm font-medium text-right">{data.profile.batch || "Not specified"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            {data.recentNotifications > 0 && (
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {data.recentNotifications} new
              </span>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Check your notifications page for latest updates on jobs and interviews.</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}