/**
 * API Service Module
 * 
 * This module provides functions to interact with the WG Education API.
 * It handles authentication, error handling, and data fetching.
 */

import axios from 'axios';

// Determine the base URL for API requests based on environment
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // When running in browser, use the current hostname to determine API URL
    const hostname = window.location.hostname;
    
    // If we're on localhost, use the local development server
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8080/api';
    }
    
    // For production deployment, use relative URL which will be handled by Next.js rewrites
    return '/api';
  }
  
  // Server-side rendering - use environment variable or default
  return process.env.API_URL || '/api';
};

// Base URL for API requests
const API_URL = getApiBaseUrl();

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * API health check response interface
 */
export interface ApiHealthResponse {
  status: string;
  message?: string;
}

/**
 * User entity interface
 */
export interface User {
  id: number;
  username: string;
  role: string;
}

/**
 * Student entity interface
 */
export interface Student {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  grade: string;
  created_at: string;
  updated_at: string;
}

/**
 * Student request payload interface
 */
export interface StudentRequest {
  first_name: string;
  last_name: string;
  email: string;
  grade: string;
  username: string;
  password: string;
}

/**
 * Login request payload interface
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Login response interface
 */
export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Subject entity interface
 */
export interface Subject {
  id: number;
  grade: string;
  name: string;
  description: string;
  created_at: string;
}

/**
 * Teacher entity interface
 */
export interface Teacher {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  subjects: Subject[];
}

/**
 * Auth API functions
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', credentials);
  return response.data;
};

export const checkAuth = async (): Promise<User> => {
  const response = await api.get<{ message: string; user_id: number; role: string }>('/protected');
  return {
    id: response.data.user_id,
    username: '', // Not returned by the endpoint
    role: response.data.role,
  };
};

/**
 * Health check
 * 
 * @returns Promise with API health status
 */
export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await api.get<{ status: string }>('/health');
  return response.data;
};

/**
 * Student API functions
 */
export const getAllStudents = async (): Promise<Student[]> => {
  const response = await api.get<{ students: Student[] }>('/admin/students');
  return response.data.students;
};

export const getStudent = async (id: number): Promise<Student> => {
  const response = await api.get<Student>(`/admin/students/${id}`);
  return response.data;
};

export const createStudent = async (student: StudentRequest): Promise<Student> => {
  const response = await api.post<Student>('/admin/students', student);
  return response.data;
};

export const updateStudent = async (id: number, student: Partial<StudentRequest>): Promise<Student> => {
  const response = await api.put<Student>(`/admin/students/${id}`, student);
  return response.data;
};

export const deleteStudent = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/admin/students/${id}`);
  return response.data;
};

/**
 * Subject API functions
 */
export const getAllSubjects = async (): Promise<Subject[]> => {
  const response = await api.get<Subject[]>('/subjects');
  return response.data;
};

export const getAllSubjectsGrouped = async (): Promise<Record<string, Subject[]>> => {
  const response = await api.get<Record<string, Subject[]>>('/subjects/grouped');
  return response.data;
};

export const getSubjectsByGrade = async (grade: string): Promise<Subject[]> => {
  const response = await api.get<Subject[]>(`/subjects/${grade}`);
  return response.data;
};

export const getSubject = async (id: number): Promise<Subject> => {
  const response = await api.get<Subject>(`/subjects/id/${id}`);
  return response.data;
};

/**
 * Teacher API functions
 */
export const getAllTeachers = async (): Promise<Teacher[]> => {
  const response = await api.get<Teacher[]>('/teachers');
  return response.data;
};

export const getTeacher = async (id: number): Promise<Teacher> => {
  const response = await api.get<Teacher>(`/teachers/${id}`);
  return response.data;
};

export const assignSubjectToTeacher = async (teacherId: number, subjectId: number): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(`/teachers/${teacherId}/subjects`, { subject_id: subjectId });
  return response.data;
};

export const removeSubjectFromTeacher = async (teacherId: number, subjectId: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/teachers/${teacherId}/subjects/${subjectId}`);
  return response.data;
}; 