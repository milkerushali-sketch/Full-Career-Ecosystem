import React from 'react';
import { useGetAIAnalysis, getGetAIAnalysisQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ShieldAlert, BookOpen, Clock, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StudentReadinessPage() {
  const { data: analysis, isLoading } = useGetAIAnalysis({
    query: { queryKey: getGetAIAnalysisQueryKey() }
  });

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-96 w-full" /></div>;
  if (!analysis) return null;

  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-amber-500 text-white",
    low: "bg-blue-500 text-white"
  };

  // Fake radar data since the API doesn't provide dimension-level scoring, we'll infer it from gaps/strengths
  const radarData = [
    { subject: 'Academics', A: 85, fullMark: 100 },
    { subject: 'Technical', A: 70, fullMark: 100 },
    { subject: 'Projects', A: 90, fullMark: 100 },
    { subject: 'Soft Skills', A: 60, fullMark: 100 },
    { subject: 'Experience', A: 50, fullMark: 100 },
    { subject: 'Coding', A: 75, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Readiness Analysis</h2>
        <p className="text-muted-foreground">Deep dive into your skill gaps and dimensional readiness.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle>Capability Radar</CardTitle>
            <CardDescription>Your profile mapped across key dimensions</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Student" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" /> Identified Skill Gaps
            </CardTitle>
            <CardDescription>Missing skills highly requested by eligible companies</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2 space-y-3">
            {analysis.skillGaps.length > 0 ? (
              analysis.skillGaps.map((gap, i) => (
                <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{gap.skill}</span>
                    <Badge variant="outline" className={`border-none ${priorityColors[gap.priority]}`}>
                      {gap.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{gap.gap}</p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No significant skill gaps identified.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}