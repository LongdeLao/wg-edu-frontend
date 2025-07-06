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
  Student, 
  StudentRequest, 
  getAllStudents, 
  createStudent, 
  updateStudent, 
  deleteStudent 
} from '@/app/services/api';

export default function StudentManagement() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentRequest>({
    first_name: '',
    last_name: '',
    email: '',
    grade: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
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
      setToken(storedToken);
      fetchStudents(storedToken);
    } catch (e) {
      router.push('/');
    }
  }, [router]);

  const fetchStudents = async (authToken: string) => {
    try {
      setLoading(true);
      const data = await getAllStudents();
      setStudents(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStudent = async () => {
    try {
      setLoading(true);
      await createStudent(formData);
      setIsAddDialogOpen(false);
      resetForm();
      fetchStudents(token);
    } catch (err: any) {
      setError(err.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (student: Student) => {
    setCurrentStudent(student);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      grade: student.grade,
      username: student.username,
      password: '', // Password is optional for updates
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateStudent = async () => {
    if (!currentStudent) return;
    
    try {
      setLoading(true);
      await updateStudent(currentStudent.id, formData);
      setIsEditDialogOpen(false);
      resetForm();
      fetchStudents(token);
    } catch (err: any) {
      setError(err.message || 'Failed to update student');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setCurrentStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteStudent = async () => {
    if (!currentStudent) return;
    
    try {
      setLoading(true);
      await deleteStudent(currentStudent.id);
      setIsDeleteDialogOpen(false);
      fetchStudents(token);
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      grade: '',
      username: '',
      password: '',
    });
    setCurrentStudent(null);
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Student Management</h1>
          <div className="space-x-4">
            <Button onClick={() => router.push('/admin')}>Back to Dashboard</Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add New Student</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Create a new student account. The student will be able to login with the provided username and password.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="John"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="grade">Grade/Class</Label>
                    <Input
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      placeholder="10"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="johndoe"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent} disabled={loading}>
                    {loading ? 'Adding...' : 'Add Student'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <div className="text-center py-4">Loading...</div>}
            {!loading && students.length === 0 && (
              <div className="text-center py-4">No students found. Add some students to get started.</div>
            )}
            {!loading && students.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.first_name} {student.last_name}</TableCell>
                      <TableCell>{student.username}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClick(student)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(student)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Student Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information. Leave password blank to keep the current password.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit_first_name">First Name</Label>
                <Input
                  id="edit_first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="edit_last_name">Last Name</Label>
                <Input
                  id="edit_last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="edit_grade">Grade/Class</Label>
              <Input
                id="edit_grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="edit_password">New Password (optional)</Label>
              <Input
                id="edit_password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave blank to keep current password"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStudent} disabled={loading}>
              {loading ? 'Updating...' : 'Update Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentStudent?.first_name} {currentStudent?.last_name}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 