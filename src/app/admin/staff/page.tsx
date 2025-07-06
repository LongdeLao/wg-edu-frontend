'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Teacher, 
  getAllTeachers,
  getAllSubjects,
  Subject,
  assignSubjectToTeacher,
  removeSubjectFromTeacher
} from '@/app/services/api';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

export default function StaffManagement() {
  const [user, setUser] = useState<any>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState<boolean>(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (!storedUser || !storedToken) {
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        router.push('/');
        return;
      }
      setUser(parsedUser);
      
      // Store user role for component access
      localStorage.setItem('userRole', parsedUser.role);
      
      fetchData();
    } catch (e) {
      router.push('/');
    }
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teachersData, subjectsData] = await Promise.all([
        getAllTeachers(),
        getAllSubjects()
      ]);
      
      setTeachers(teachersData);
      setSubjects(subjectsData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignSubject = async () => {
    if (!currentTeacher || !selectedSubjectId) {
      setError('Please select a subject to assign');
      return;
    }
    
    try {
      setLoading(true);
      await assignSubjectToTeacher(currentTeacher.id, selectedSubjectId);
      setIsAssignDialogOpen(false);
      setSelectedSubjectId(null);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to assign subject');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubject = async (teacherId: number, subjectId: number) => {
    try {
      setLoading(true);
      await removeSubjectFromTeacher(teacherId, subjectId);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove subject');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'PIB':
        return 'bg-blue-500';
      case 'IB1':
        return 'bg-green-500';
      case 'IB2':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <Button onClick={() => router.push('/admin')}>Back to Dashboard</Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Teaching Staff</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : teachers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No teachers found in the system.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell>{teacher.id}</TableCell>
                      <TableCell>{teacher.username}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects && teacher.subjects.length > 0 ? (
                            teacher.subjects.map((subject) => (
                              <Badge key={subject.id} className={getGradeColor(subject.grade)}>
                                {subject.grade} - {subject.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500">No subjects assigned</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentTeacher(teacher);
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          Assign Subject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {currentTeacher && (
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Subject to {currentTeacher.username}</DialogTitle>
                <DialogDescription>
                  Select a subject to assign to this teacher.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Select onValueChange={(value) => setSelectedSubjectId(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          [{subject.grade}] {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignSubject} disabled={loading || !selectedSubjectId}>
                  {loading ? 'Assigning...' : 'Assign Subject'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {currentTeacher && currentTeacher.subjects && currentTeacher.subjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Subjects for {currentTeacher.username}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTeacher.subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                      </TableCell>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{subject.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveSubject(currentTeacher.id, subject.id)}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 