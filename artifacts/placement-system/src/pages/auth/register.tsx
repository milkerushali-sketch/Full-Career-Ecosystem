import React, { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/lib/auth';
import { useRegisterUser } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutDashboard, Loader2, UserCircle, GraduationCap, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'officer' | 'admin'>('student');

  const registerMutation = useRegisterUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { data: { name, email, password, role } },
      {
        onSuccess: (data) => {
          login(data.token, data.user);
          toast({ title: 'Success', description: 'Account created successfully' });
          setLocation(`/${data.user.role}/dashboard`);
        },
        onError: (err: any) => {
          toast({ 
            title: 'Error', 
            description: err.response?.data?.message || err.message || 'Failed to register',
            variant: 'destructive'
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
            <LayoutDashboard className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">PlacePro</h1>
        </div>

        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/90">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${
                    role === 'student' 
                      ? 'border-primary bg-primary/10 text-primary font-medium' 
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <GraduationCap className="h-5 w-5 mb-1" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('officer')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${
                    role === 'officer' 
                      ? 'border-primary bg-primary/10 text-primary font-medium' 
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Users className="h-5 w-5 mb-1" />
                  Officer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${
                    role === 'admin' 
                      ? 'border-primary bg-primary/10 text-primary font-medium' 
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <UserCircle className="h-5 w-5 mb-1" />
                  Admin
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@university.edu" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-background"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create account
              </Button>
              <div className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}