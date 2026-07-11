import React from 'react';
import { useGetAIAnalysis, getGetAIAnalysisQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Lightbulb, Clock, Code, Award } from 'lucide-react';

export default function StudentRecommendationsPage() {
  const { data: analysis, isLoading } = useGetAIAnalysis({
    query: { queryKey: getGetAIAnalysisQueryKey() }
  });

  if (isLoading) return <div className="space-y-6"><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /></div>;
  if (!analysis) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-5 w-5" />;
      case 'project': return <Code className="h-5 w-5" />;
      case 'certification': return <Award className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-amber-500 text-white",
    low: "bg-blue-500 text-white"
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">AI Recommendations</h2>
        <p className="text-muted-foreground">Tailored action plan to close your skill gaps.</p>
      </div>

      {(!analysis.recommendations || analysis.recommendations.length === 0) ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            You're all set! No immediate recommendations.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.recommendations.map((rec, i) => (
            <Card key={i} className="flex flex-col hover-elevate overflow-hidden border-border/50">
              <div className={`h-1 w-full ${priorityColors[rec.priority || 'medium'].split(' ')[0]}`} />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-muted rounded-md text-foreground">
                      {getIcon(rec.type)}
                    </div>
                    <Badge variant="outline" className="capitalize text-xs font-semibold tracking-wider">
                      {rec.type}
                    </Badge>
                  </div>
                  {rec.priority && (
                    <Badge className={`border-none ${priorityColors[rec.priority]}`}>
                      {rec.priority} Priority
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-3 leading-tight">{rec.title}</CardTitle>
                {rec.provider && (
                  <p className="text-sm font-medium text-primary mt-1">{rec.provider}</p>
                )}
              </CardHeader>
              <CardContent className="pb-3 flex-1 flex flex-col justify-end">
                {rec.estimatedHours && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1.5" />
                    Est. Time: {rec.estimatedHours} hours
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Button className="w-full" variant="secondary" asChild>
                  <a href={rec.url} target="_blank" rel="noopener noreferrer">
                    View Resource <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}