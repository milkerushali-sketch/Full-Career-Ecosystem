import React, { useState, useRef } from 'react';
import { useGetAIAnalysis, getGetAIAnalysisQueryKey, useTriggerAIAnalysis, useBuildAIResume, useListCompanies, GeneratedResume } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  FileUp, Sparkles, CheckCircle2, AlertCircle, Loader2, FileText, Download,
  Target, TrendingUp, Lightbulb,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { parseISO, format } from 'date-fns';

interface UploadAnalysis {
  fileName: string;
  atsScore: number;
  formattingScore: number;
  keywordScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  formattingIssues: string[];
  recommendations: string[];
  targetCompanyName: string | null;
  extractedWordCount: number;
}

export default function StudentResumePage() {
  const { data: analysis, isLoading, isFetching } = useGetAIAnalysis({
    query: { queryKey: getGetAIAnalysisQueryKey() }
  });
  const { data: companies } = useListCompanies();

  const triggerAnalysis = useTriggerAIAnalysis();
  const buildResume = useBuildAIResume();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [generatedResume, setGeneratedResume] = useState<GeneratedResume | null>(null);
  const [targetCompanyId, setTargetCompanyId] = useState<string>('');
  const [uploadAnalysis, setUploadAnalysis] = useState<UploadAnalysis | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleBuildResume = () => {
    buildResume.mutate(undefined, {
      onSuccess: (data) => {
        setGeneratedResume(data);
        toast({ title: 'Resume Generated', description: 'Your ATS-friendly resume is ready below.' });
      },
      onError: () => {
        toast({ title: 'Generation Failed', description: 'Could not generate resume from your profile.', variant: 'destructive' });
      }
    });
  };

  const handleDownloadText = () => {
    if (!generatedResume) return;
    const blob = new Blob([generatedResume.formattedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedResume.contact.name.replace(/\s+/g, '_')}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintResume = () => {
    window.print();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast({ title: 'Invalid File', description: 'Please upload a PDF file.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    setUploadAnalysis(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (targetCompanyId) formData.append('companyId', targetCompanyId);

      const token = localStorage.getItem('placement_token');
      const res = await fetch('/api/students/resume/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }

      const data: UploadAnalysis = await res.json();
      setUploadAnalysis(data);
      toast({ title: 'Resume Analyzed', description: `ATS match score: ${data.atsScore}/100` });
    } catch (err: any) {
      toast({ title: 'Upload Failed', description: err.message || 'Could not analyze this PDF.', variant: 'destructive' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Resume & Readiness</h2>
          <p className="text-muted-foreground">Automated feedback based on your profile, academics, and projects.</p>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={triggerAnalysis.isPending || isFetching}
          className="bg-gradient-to-r from-primary to-accent"
          data-testid="button-reanalyze"
        >
          {triggerAnalysis.isPending || isFetching ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Re-Analyze Profile
        </Button>
      </div>

      {analysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
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

      {/* ── AI Resume Maker ─────────────────────────────────────────────────── */}
      <Card className="print:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> AI Resume Maker</CardTitle>
          <CardDescription>Generate a single-column, ATS-approved resume straight from your profile, academics, skills, and projects.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleBuildResume} disabled={buildResume.isPending} data-testid="button-build-resume">
            {buildResume.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate ATS Resume
          </Button>

          {generatedResume && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={handleDownloadText} data-testid="button-download-txt">
                  <Download className="mr-2 h-4 w-4" /> Download .txt
                </Button>
                <Button size="sm" variant="outline" onClick={handlePrintResume} data-testid="button-print-resume">
                  <Download className="mr-2 h-4 w-4" /> Download / Print PDF
                </Button>
              </div>

              {generatedResume.atsTips.length > 0 && (
                <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-2 font-medium text-sm">
                    <Lightbulb className="h-4 w-4 text-primary" /> ATS Tips
                  </div>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {generatedResume.atsTips.map((tip, i) => <li key={i}>• {tip}</li>)}
                  </ul>
                </div>
              )}

              <div id="resume-print-area" className="rounded-md border bg-background p-8 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {generatedResume.formattedText}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Upload & Analyze against a target company ───────────────────────── */}
      <Card className="border-dashed border-2 bg-muted/10 print:hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" /> Upload Resume for Company-Targeted Recommendations</CardTitle>
          <CardDescription>Upload your existing resume PDF; we'll extract its text and score it against a target company's required skills.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <select
              className="border rounded-md px-3 py-2 text-sm bg-background min-w-[220px]"
              value={targetCompanyId}
              onChange={(e) => setTargetCompanyId(e.target.value)}
              data-testid="select-target-company"
            >
              <option value="">General ATS check (no target company)</option>
              {companies?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileSelect}
              data-testid="input-resume-file"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} data-testid="button-upload-resume">
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
              {isUploading ? 'Analyzing…' : 'Select PDF File'}
            </Button>
          </div>

          {uploadAnalysis && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-md border p-4 text-center">
                  <div className="text-3xl font-bold text-primary">{uploadAnalysis.atsScore}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">ATS Score</div>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <div className="text-3xl font-bold">{uploadAnalysis.keywordScore}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Keyword Match</div>
                </div>
                <div className="rounded-md border p-4 text-center">
                  <div className="text-3xl font-bold">{uploadAnalysis.formattingScore}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Formatting</div>
                </div>
              </div>

              {uploadAnalysis.targetCompanyName && (
                <p className="text-sm text-muted-foreground">Scored against <span className="font-medium text-foreground">{uploadAnalysis.targetCompanyName}</span>'s required skills.</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Matched Keywords</div>
                  <div className="flex flex-wrap gap-1.5">
                    {uploadAnalysis.matchedKeywords.length > 0 ? uploadAnalysis.matchedKeywords.map((k, i) => (
                      <Badge key={i} variant="outline" className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400">{k}</Badge>
                    )) : <span className="text-sm text-muted-foreground italic">None matched</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-1.5"><AlertCircle className="h-4 w-4 text-amber-500" /> Missing Keywords</div>
                  <div className="flex flex-wrap gap-1.5">
                    {uploadAnalysis.missingKeywords.length > 0 ? uploadAnalysis.missingKeywords.map((k, i) => (
                      <Badge key={i} variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-500">{k}</Badge>
                    )) : <span className="text-sm text-muted-foreground italic">None — great coverage!</span>}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2 flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-primary" /> Recommendations</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {uploadAnalysis.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
