import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clock, Mail, Lock, User, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().min(2, 'Department is required'),
  role: z.enum(['employee', 'manager']),
});

const Auth = () => {
  const { user, role, signIn, signUp, loading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Engineering',
    role: 'employee' as 'employee' | 'manager',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={role === 'manager' ? '/manager/dashboard' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    try {
      if (isLogin) {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
          setSubmitting(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast({
            title: 'Login Failed',
            description: error.message === 'Invalid login credentials' 
              ? 'Invalid email or password. Please try again.' 
              : error.message,
            variant: 'destructive',
          });
        }
      } else {
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
          setSubmitting(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, {
          name: formData.name,
          department: formData.department,
          role: formData.role,
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Account Exists',
              description: 'This email is already registered. Please login instead.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Registration Failed',
              description: error.message,
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: 'Account Created!',
            description: 'You can now access the system.',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          
          <div className="relative z-10 flex flex-col justify-center p-12">
            <div className="animate-slide-up">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent shadow-glow">
                  <Clock className="h-8 w-8 text-accent-foreground" />
                </div>
                <h1 className="font-display text-4xl font-bold text-primary-foreground">
                  AttendX
                </h1>
              </div>
              
              <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground">
                Employee Attendance<br />Management System
              </h2>
              
              <p className="mb-8 max-w-md text-lg text-primary-foreground/80">
                Streamline your workforce management with real-time attendance tracking, 
                insightful analytics, and seamless team coordination.
              </p>

              <div className="space-y-4">
                {[
                  'Quick check-in/check-out',
                  'Real-time attendance tracking',
                  'Comprehensive reports & analytics',
                  'Team calendar & scheduling',
                ].map((feature, index) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3 animate-fade-in"
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                    </div>
                    <span className="text-primary-foreground/90">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
          <div className="w-full max-w-md animate-scale-in">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-md">
                <Clock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">AttendX</h1>
            </div>

            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {isLogin
                  ? 'Enter your credentials to access your account'
                  : 'Fill in your details to get started'}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="mb-6 flex rounded-lg bg-muted p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={cn(
                  'flex-1 rounded-md py-2 text-sm font-medium transition-all',
                  isLogin
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={cn(
                  'flex-1 rounded-md py-2 text-sm font-medium transition-all',
                  !isLogin
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={cn('pl-10', errors.name && 'border-destructive')}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={cn('pl-10', errors.email && 'border-destructive')}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={cn('pl-10', errors.password && 'border-destructive')}
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <select
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['employee', 'manager'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: type })}
                          className={cn(
                            'rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all',
                            formData.role === type
                              ? 'border-accent bg-accent/10 text-accent'
                              : 'border-border bg-background text-foreground hover:border-accent/50'
                          )}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
                variant="hero"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
