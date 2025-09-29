export type Role = 'TEACHER' | 'STUDENT';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  groupSection?: string;
}

export interface Quiz {
  id: number;
  title: string;
  description?: string;
  teacherId: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimitMinutes?: number;
  totalMarks?: number;
  assignedGroups: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: Question[];
}

export interface Question {
  id?: number;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  marks: number;
  correctAnswer?: string;
  options?: QuestionOption[];
}

export interface QuestionOption {
  id?: number;
  text: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: number;
  quizId: number;
  studentName: string;
  studentEmail: string;
  groupSection: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'PUBLISHED';
  startedAt: string;
  submittedAt?: string;
  timeTakenMinutes?: number;
  visibleToStudent: boolean;
}

export interface QuizRequest {
  title: string;
  description?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimitMinutes: number;
  totalMarks: number;
  assignedGroups: string[];
  questions?: QuestionRequest[];
}

export interface QuestionRequest {
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK';
  marks: number;
  options?: OptionRequest[];
  correctAnswer?: string;
}

export interface OptionRequest {
  text: string;
  isCorrect: boolean;
}

export interface QuizSubmissionRequest {
  quizId: number;
  answers: AnswerRequest[];
  timeTakenMinutes?: number;
}

export interface AnswerRequest {
  questionId: number;
  answer: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
}
