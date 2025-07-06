'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from './services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('Logging in with:', { username, password });
      const response = await login({ username, password });
      console.log('Login response:', response);
      
      // Store token and user info in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect based on user role
      switch (response.user.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'teacher':
          router.push('/teacher');
          break;
        case 'student':
          router.push('/student');
          break;
        default:
          router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (role: string) => {
    setUsername(`test_${role}`);
    setPassword(`test_${role}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">WG-EDU Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm dark:bg-red-900/30 dark:text-red-300">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            Test accounts - Click to autofill:
          </div>
          <div className="flex justify-around w-full gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTestLogin('admin')}
            >
              Admin
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTestLogin('teacher')}
            >
              Teacher
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleTestLogin('student')}
            >
              Student
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
