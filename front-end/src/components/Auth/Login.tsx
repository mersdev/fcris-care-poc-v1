import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { profileApi } from '@/api/authApi';

export function Login() {
  const [email, setEmail] = useState('merszerodev+02@gmail.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sign_in } = useAuthContext();

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in using AuthContext
      await sign_in(email, password);
      
      try {
        // Try to get user profile - if it fails, user needs to complete onboarding
        await profileApi.getProfile();
        
        // User has a profile, proceed to dashboard
        toast({
          title: 'Success',
          description: 'Successfully logged in!',
        });
        navigate('/dashboard');
      } catch (error) {
        // Profile doesn't exist, redirect to profile setup
        toast({
          title: 'Welcome!',
          description: 'Please complete your profile setup to continue.',
        });
        navigate('/profile?setup=true');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to login',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px] p-6">
        <div className="space-y-2 mb-4">
          <h2 className="text-2xl font-bold">Login</h2>
          <p className="text-sm text-gray-500">Enter your credentials to access your account</p>
        </div>
        <form onSubmit={handle_submit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
