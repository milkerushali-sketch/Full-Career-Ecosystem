import React from 'react';
import { useGetAIAnalysis, getGetAIAnalysisQueryKey, useTriggerAIAnalysis } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { parseISO, format } from 'date-fns';

export default function StudentResumePage() {
  const { data: analysis, isLoading, isFetching } = useGetAIAnalysis({
    query: { queryKey: getGetAIAnalysisQueryKey() }
  });
  
  const triggerAnalysis = useTriggerAIAnalysis();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAnalyze = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    triggerAnalysis.mutate(undefined as any, {
      onSuccess: () => {
        toast({ title: 'Analysis Complete', description: 'AI has processed your updated profile.' });
        queryClient.invalidateQueries({ queryKey: getGetAIAnalysisQueryKey() });
      },
      onError: () => {
        toast({ title: 'Analysis Failed', description: 'Could not process profile data.', variant: 'destructive' });
      }
    });
  };

  const CircularGauge = ({ value, label }: { value: number, label: string }) => {
    const color = value > 80 ? "text-emerald-500" : value > 60 ? "text-amber-500" : "text-destructive";
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
            <circle 
              cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
              className={color}
              strokeDasharray={`${(value / 100) * 251} 251`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{value}</span>
          </div>
        </div>
        <span className="mt-2 font-medium text-sm text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
    );
  };

  if (isLoading && !isFetching) return <div className="space-y-6"><Skeleton className="h-64 w-full" /><Skeleton className="h-96 w-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Resume & Readiness</h2>
          <p className="text-muted-foreground">Automated feedback based on your profile, academics, and projects.</p>
        </div>
        <Button 
          onClick={handleAnalyze} 
          disabled={triggerAnalysis.isPending || isFetching}
          className="bg-gradient-to-r from-primary to-accent"
        >
          {triggerAnalysis.isPending || isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Re-Analyze Profile
        </Button>
      </div>

      <Card className="border-dashed border-2 bg-muted/10">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <FileUp className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload Resume PDF</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Upload your physical resume to augment the AI analysis. The system parses it and extracts additional context.
          </p>
          <Button variant="outline" onClick={() => toast({ title: 'Not Implemented', description: 'PDF upload is a premium feature.' })}>
            Select PDF File
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-3 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center gap-12">
                  <CircularGauge value={analysis.readinessScore} label="Overall Readiness" />
                  <CircularGauge value={analysis.resumeScore} label="Resume Score" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Analysis Summary</h3>
                  <p className="text-muted-foreground">
                    Your profile was last analyzed on {analysis.analysisDate ? format(parseISO(analysis.analysisDate), 'MMM d, yyyy') : 'recently'}. 
                    You have a strong foundation but could improve by addressing key skill gaps identified by our matching algorithm.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1 border-emerald-500/20 bg-emerald-500/5">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="mr-2 h-5 w-5" /> Profile Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
                {analysis.strengths.length === 0 && <li className="text-sm text-muted-foreground italic">Add more data to see strengths.</li>}
              </ul>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 border-amber-500/20 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-600 dark:text-amber-500">
                <AlertCircle className="mr-2 h-5 w-5" /> Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(analysis.weaknesses || []).map((weak, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{weak}</span>
                  </li>
                ))}
                {(!analysis.weaknesses || analysis.weaknesses.length === 0) && <li className="text-sm text-muted-foreground italic">No major weaknesses identified!</li>}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}