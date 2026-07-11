import React from 'react';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider, useAuth } from '@/lib/auth';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

// Pages
import NotFound from '@/pages/not-found';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';

// Student Pages
import StudentDashboard from '@/pages/student/dashboard';
import StudentProfile from '@/pages/student/profile';
import StudentAcademics from '@/pages/student/academics';
import StudentSkills from '@/pages/student/skills';
import StudentProjects from '@/pages/student/projects';
import StudentInternships from '@/pages/student/internships';
import StudentCertifications from '@/pages/student/certifications';
import StudentCodingProfiles from '@/pages/student/coding-profiles';
import StudentResume from '@/pages/student/resume';
import StudentReadiness from '@/pages/student/readiness';
import StudentCompanies from '@/pages/student/companies';
import StudentRecommendations from '@/pages/student/recommendations';
import StudentNotifications from '@/pages/student/notifications';

// Officer Pages
import OfficerDashboard from '@/pages/officer/dashboard';
import OfficerStudents from '@/pages/officer/students';
import OfficerAnalytics from '@/pages/officer/analytics';
import OfficerCompanies from '@/pages/officer/companies';
import OfficerJobs from '@/pages/officer/jobs';
import OfficerInterviews from '@/pages/officer/interviews';

// Admin Pages
import AdminDashboard from '@/pages/admin/dashboard';
import AdminUsers from '@/pages/admin/users';
import AdminDepartments from '@/pages/admin/departments';
import AdminCompanies from '@/pages/admin/companies';
import AdminSettings from '@/pages/admin/settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ component: Component, allowedRoles }: { component: React.ComponentType<any>, allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/');
    } else if (user && !allowedRoles.includes(user.role)) {
      setLocation(`/${user.role}/dashboard`);
    }
  }, [isAuthenticated, user, allowedRoles, setLocation]);

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/register" component={Register} />

      {/* Student Routes */}
      <Route path="/student/dashboard"><ProtectedRoute component={StudentDashboard} allowedRoles={['student']} /></Route>
      <Route path="/student/profile"><ProtectedRoute component={StudentProfile} allowedRoles={['student']} /></Route>
      <Route path="/student/academics"><ProtectedRoute component={StudentAcademics} allowedRoles={['student']} /></Route>
      <Route path="/student/skills"><ProtectedRoute component={StudentSkills} allowedRoles={['student']} /></Route>
      <Route path="/student/projects"><ProtectedRoute component={StudentProjects} allowedRoles={['student']} /></Route>
      <Route path="/student/internships"><ProtectedRoute component={StudentInternships} allowedRoles={['student']} /></Route>
      <Route path="/student/certifications"><ProtectedRoute component={StudentCertifications} allowedRoles={['student']} /></Route>
      <Route path="/student/coding-profiles"><ProtectedRoute component={StudentCodingProfiles} allowedRoles={['student']} /></Route>
      <Route path="/student/resume"><ProtectedRoute component={StudentResume} allowedRoles={['student']} /></Route>
      <Route path="/student/readiness"><ProtectedRoute component={StudentReadiness} allowedRoles={['student']} /></Route>
      <Route path="/student/companies"><ProtectedRoute component={StudentCompanies} allowedRoles={['student']} /></Route>
      <Route path="/student/recommendations"><ProtectedRoute component={StudentRecommendations} allowedRoles={['student']} /></Route>
      <Route path="/student/notifications"><ProtectedRoute component={StudentNotifications} allowedRoles={['student']} /></Route>

      {/* Officer Routes */}
      <Route path="/officer/dashboard"><ProtectedRoute component={OfficerDashboard} allowedRoles={['officer']} /></Route>
      <Route path="/officer/students"><ProtectedRoute component={OfficerStudents} allowedRoles={['officer']} /></Route>
      <Route path="/officer/analytics"><ProtectedRoute component={OfficerAnalytics} allowedRoles={['officer']} /></Route>
      <Route path="/officer/companies"><ProtectedRoute component={OfficerCompanies} allowedRoles={['officer']} /></Route>
      <Route path="/officer/jobs"><ProtectedRoute component={OfficerJobs} allowedRoles={['officer']} /></Route>
      <Route path="/officer/interviews"><ProtectedRoute component={OfficerInterviews} allowedRoles={['officer']} /></Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard"><ProtectedRoute component={AdminDashboard} allowedRoles={['admin']} /></Route>
      <Route path="/admin/users"><ProtectedRoute component={AdminUsers} allowedRoles={['admin']} /></Route>
      <Route path="/admin/departments"><ProtectedRoute component={AdminDepartments} allowedRoles={['admin']} /></Route>
      <Route path="/admin/companies"><ProtectedRoute component={AdminCompanies} allowedRoles={['admin']} /></Route>
      <Route path="/admin/settings"><ProtectedRoute component={AdminSettings} allowedRoles={['admin']} /></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
          </AuthProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;