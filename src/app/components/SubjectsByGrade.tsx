'use client';

import { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Subject, getAllSubjectsGrouped } from '../services/api';
import { useToast } from '@/components/ui/use-toast';

const SubjectsByGrade = () => {
  const [subjectsByGrade, setSubjectsByGrade] = useState<Record<string, Subject[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeGrade, setActiveGrade] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const groupedSubjects = await getAllSubjectsGrouped();
        setSubjectsByGrade(groupedSubjects);
        
        // Set default active grade
        const grades = Object.keys(groupedSubjects);
        if (grades.length > 0) {
          setActiveGrade(grades[0]);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load subjects data',
          variant: 'destructive',
        });
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [toast]);

  if (loading) {
    return <div className="flex justify-center my-8">Loading subjects...</div>;
  }

  const grades = Object.keys(subjectsByGrade);

  if (grades.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500">
        No subjects found in the system.
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Subject Offerings</h2>
      
      <Tabs value={activeGrade} onValueChange={setActiveGrade}>
        <TabsList className="mb-4">
          {grades.map((grade) => (
            <TabsTrigger key={grade} value={grade}>
              {grade}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {grades.map((grade) => (
          <TabsContent key={grade} value={grade}>
            <Table>
              <TableCaption>Subjects offered for {grade} grade</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectsByGrade[grade].map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>{subject.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default SubjectsByGrade; 