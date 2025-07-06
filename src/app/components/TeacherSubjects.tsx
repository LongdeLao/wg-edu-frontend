'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Teacher, 
  Subject, 
  getAllTeachers,
  getAllSubjects,
  assignSubjectToTeacher,
  removeSubjectFromTeacher
} from '../services/api';
import { useToast } from '@/components/ui/use-toast';

const TeacherSubjects = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersData, subjectsData] = await Promise.all([
          getAllTeachers(),
          getAllSubjects()
        ]);
        
        setTeachers(teachersData);
        setSubjects(subjectsData);
        
        // Check if user is admin
        const userRole = localStorage.getItem('userRole');
        setIsAdmin(userRole === 'admin');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load teacher and subject data',
          variant: 'destructive',
        });
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAssignSubject = async () => {
    if (!selectedTeacherId || !selectedSubjectId) {
      toast({
        title: 'Warning',
        description: 'Please select both a teacher and a subject',
        variant: 'default',
      });
      return;
    }

    try {
      await assignSubjectToTeacher(selectedTeacherId, selectedSubjectId);
      
      // Refresh teachers data
      const teachersData = await getAllTeachers();
      setTeachers(teachersData);
      
      toast({
        title: 'Success',
        description: 'Subject assigned to teacher successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign subject to teacher',
        variant: 'destructive',
      });
      console.error('Error assigning subject:', error);
    }
  };

  const handleRemoveSubject = async (teacherId: number, subjectId: number) => {
    try {
      await removeSubjectFromTeacher(teacherId, subjectId);
      
      // Refresh teachers data
      const teachersData = await getAllTeachers();
      setTeachers(teachersData);
      
      toast({
        title: 'Success',
        description: 'Subject removed from teacher successfully',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove subject from teacher',
        variant: 'destructive',
      });
      console.error('Error removing subject:', error);
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

  if (loading) {
    return <div className="flex justify-center my-8">Loading teacher data...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Teachers and Subjects</h2>
      
      {isAdmin && (
        <div className="bg-slate-50 p-4 rounded-md shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-lg font-semibold">Assign Subject to Teacher</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="teacher-select" className="block text-sm font-medium mb-1">
                Select Teacher
              </label>
              <select
                id="teacher-select"
                className="w-full p-2 border rounded-md"
                value={selectedTeacherId || ''}
                onChange={(e) => setSelectedTeacherId(Number(e.target.value) || null)}
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.username || 'Unknown'} (ID: {teacher.id})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label htmlFor="subject-select" className="block text-sm font-medium mb-1">
                Select Subject
              </label>
              <select
                id="subject-select"
                className="w-full p-2 border rounded-md"
                value={selectedSubjectId || ''}
                onChange={(e) => setSelectedSubjectId(Number(e.target.value) || null)}
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    [{subject.grade}] {subject.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="self-end">
              <Button onClick={handleAssignSubject}>Assign Subject</Button>
            </div>
          </div>
        </div>
      )}
      
      <Accordion type="multiple" className="w-full">
        {teachers.map((teacher) => (
          <AccordionItem key={teacher.id} value={`teacher-${teacher.id}`}>
            <AccordionTrigger className="hover:bg-slate-50 px-4">
              <div className="flex justify-between w-full">
                <div className="font-medium">{teacher.username || 'Unknown'}</div>
                <div className="text-sm text-slate-500">{teacher.subjects?.length || 0} subjects</div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              {teacher.subjects && teacher.subjects.length > 0 ? (
                <Table>
                  <TableCaption>Subjects taught by {teacher.username || 'this teacher'}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Description</TableHead>
                      {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacher.subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>
                          <Badge className={getGradeColor(subject.grade)}>{subject.grade}</Badge>
                        </TableCell>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell className="max-w-sm truncate">{subject.description}</TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemoveSubject(teacher.id, subject.id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-slate-500 py-2">No subjects assigned to this teacher.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      
      {teachers.length === 0 && (
        <div className="text-center py-4 text-slate-500">
          No teachers found in the system.
        </div>
      )}
    </div>
  );
};

export default TeacherSubjects; 