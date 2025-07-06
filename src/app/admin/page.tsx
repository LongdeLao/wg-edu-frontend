'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        router.push('/');
        return;
      }
      
      // Store user role for component access
      localStorage.setItem('userRole', parsedUser.role);
      
      setUser(parsedUser);
    } catch (e) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Add, edit, and remove students from the system.</p>
              <Button className="mt-4" onClick={() => router.push('/admin/students')}>
                Manage Students
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage teaching staff and their subject assignments.</p>
              <Button className="mt-4" onClick={() => router.push('/admin/staff')}>
                Manage Staff
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 