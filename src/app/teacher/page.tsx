'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeacherSubjects from '../components/TeacherSubjects';

export default function TeacherDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is teacher
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'teacher') {
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
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.username}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You are logged in as a teacher.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage your classes and lessons.</p>
              <Button className="mt-4">View Classes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View and grade student assignments.</p>
              <Button className="mt-4">Grade Center</Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Teacher's Subjects Section */}
        <Card>
          <CardHeader>
            <CardTitle>My Teaching Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <TeacherSubjects />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 