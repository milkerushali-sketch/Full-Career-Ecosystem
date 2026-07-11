import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, UserCircle, GraduationCap, Briefcase, 
  FileText, Award, Code, CheckSquare, Building, Lightbulb, 
  Bell, LogOut, Menu, Moon, Sun, Users, BarChart3, Settings, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const studentLinks: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/student/dashboard' },
  { icon: UserCircle, label: 'Profile', href: '/student/profile' },
  { icon: GraduationCap, label: 'Academics', href: '/student/academics' },
  { icon: Award, label: 'Skills', href: '/student/skills' },
  { icon: Code, label: 'Projects', href: '/student/projects' },
  { icon: Briefcase, label: 'Internships', href: '/student/internships' },
  { icon: FileText, label: 'Certifications', href: '/student/certifications' },
  { icon: Network, label: 'Coding Profiles', href: '/student/coding-profiles' },
  { icon: FileText, label: 'Resume AI', href: '/student/resume' },
  { icon: CheckSquare, label: 'Readiness', href: '/student/readiness' },
  { icon: Building, label: 'Companies', href: '/student/companies' },
  { icon: Lightbulb, label: 'Recommendations', href: '/student/recommendations' },
  { icon: Bell, label: 'Notifications', href: '/student/notifications' },
];

const officerLinks: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/officer/dashboard' },
  { icon: Users, label: 'Students', href: '/officer/students' },
  { icon: BarChart3, label: 'Analytics', href: '/officer/analytics' },
  { icon: Building, label: 'Companies', href: '/officer/companies' },
  { icon: Briefcase, label: 'Jobs', href: '/officer/jobs' },
  { icon: CheckSquare, label: 'Interviews', href: '/officer/interviews' },
];

const adminLinks: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Network, label: 'Departments', href: '/admin/departments' },
  { icon: Building, label: 'Companies', href: '/admin/companies' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Protect routes based on role
  useEffect(() => {
    if (!user) {
      setLocation('/');
    } else if (location.startsWith('/student') && user.role !== 'student') {
      setLocation(`/${user.role}/dashboard`);
    } else if (location.startsWith('/officer') && user.role !== 'officer') {
      setLocation(`/${user.role}/dashboard`);
    } else if (location.startsWith('/admin') && user.role !== 'admin') {
      setLocation(`/${user.role}/dashboard`);
    }
  }, [user, location, setLocation]);

  if (!user) return null;

  const links = user.role === 'student' ? studentLinks : user.role === 'officer' ? officerLinks : adminLinks;

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const currentTitle = links.find(l => l.href === location)?.label || 'Dashboard';

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <LayoutDashboard className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight text-foreground">PlacePro</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-border flex flex-col gap-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-9 w-9 bg-primary/20 text-primary border border-primary/20">
              <AvatarFallback className="bg-transparent">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize truncate">{user.role}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-muted-foreground hover:text-foreground">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card/80 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-primary">
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-bold text-lg tracking-tight text-foreground">PlacePro</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="md:hidden fixed top-0 bottom-0 left-0 w-64 bg-card border-r border-border z-50 flex flex-col"
            >
              <div className="h-16 flex items-center px-6 border-b border-border">
                <div className="flex items-center gap-2 text-primary">
                  <LayoutDashboard className="h-6 w-6" />
                  <span className="font-bold text-xl tracking-tight text-foreground">PlacePro</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {links.map((link) => {
                  const isActive = location === link.href;
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
              <div className="p-4 border-t border-border flex flex-col gap-4">
                <div className="flex items-center gap-3 px-2">
                  <Avatar className="h-9 w-9 bg-primary/20 text-primary border border-primary/20">
                    <AvatarFallback className="bg-transparent">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize truncate">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-muted-foreground hover:text-foreground">
                    {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0 h-[100dvh] overflow-hidden bg-background">
        <header className="h-16 px-8 flex items-center border-b border-border/50 shrink-0">
          <h1 className="text-xl font-semibold">{currentTitle}</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">Welcome back, {user.name.split(' ')[0]}</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full max-w-6xl mx-auto"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
