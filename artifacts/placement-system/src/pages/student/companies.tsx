import React from 'react';
import { useGetCompanyEligibility, getGetCompanyEligibilityQueryKey } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Building2, IndianRupee, GraduationCap, CheckCircle2, XCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function StudentCompaniesPage() {
  const { data: eligibleCompanies, isLoading } = useGetCompanyEligibility({
    query: { queryKey: getGetCompanyEligibilityQueryKey() }
  });
  const [searchTerm, setSearchTerm] = React.useState('');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      </div>
    );
  }

  const filtered = (eligibleCompanies || []).filter(item => 
    item.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.company.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Company Eligibility</h2>
          <p className="text-muted-foreground">Companies matched against your academic criteria and skills.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search companies..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-muted-foreground">
            No companies found matching your search.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map(({ company, eligible, matchScore, reasons, missingCriteria }) => (
            <Card key={company.id} className={`flex flex-col overflow-hidden hover-elevate ${eligible ? 'border-primary/30' : 'opacity-80'}`}>
              <CardHeader className="pb-3 bg-muted/10 border-b border-border/50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-background border flex items-center justify-center shrink-0 shadow-sm">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.name} className="h-8 w-8 object-contain" />
                      ) : (
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">{company.industry}</p>
                    </div>
                  </div>
                  {eligible ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Eligible
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                      <XCircle className="h-3 w-3 mr-1" /> Not Eligible
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm">
                    <IndianRupee className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">CTC:</span> 
                    <span className="ml-1 text-primary font-semibold">
                      {company.packageMin}-{company.packageMax} LPA
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Min CGPA:</span> 
                    <span className="ml-1">{company.minCGPARequired?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Match Score</span>
                    <span className="text-sm font-bold">{matchScore}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${eligible ? 'bg-primary' : 'bg-muted-foreground'}`} 
                      style={{ width: `${matchScore}%` }}
                    />
                  </div>
                </div>

                {!eligible && reasons && reasons.length > 0 && (
                  <div className="mt-4 p-3 bg-destructive/5 rounded-md border border-destructive/10">
                    <p className="text-xs font-semibold text-destructive mb-1">Blockers:</p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                      {reasons.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
                
                {missingCriteria && missingCriteria.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Missing Required Skills:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {missingCriteria.map((skill, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded border bg-muted/50 uppercase tracking-wider font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}