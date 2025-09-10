import type { Dispatch, SetStateAction } from 'react';
export type ConsultantLevel = 'trainee' | 'junior' | 'consultor' | 'avanzado' | 'senior' | 'senior_avanzado';

export interface FormData {
  // Datos precargados
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  level: ConsultantLevel;
  // Datos del formulario
  skills: Array<{name: string; level: string; version?: string}>;
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    challenges: string;
    achievements: string;
    technologies: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
    achievements?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: string;
    credentialId?: string;
  }>;
  personalStatement: string;
}

export interface MotivationalMessage {
  id: string;
  type: 'skill' | 'experience' | 'education' | 'certification' | 'milestone';
  message: string;
  description?: string;
  icon: string;
  timestamp: number;
  context?: string;
}

export interface StreakCounter {
  skills: number;
  experiences: number;
  education: number;
  certifications: number;
}


export interface StepComponentProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (
    type: MotivationalMessage['type'], 
    message: string, 
    description?: string, 
    icon?: string, 
    context?: string
  ) => void;
  streakCounter: StreakCounter;
  setStreakCounter: Dispatch<SetStateAction<StreakCounter>>;
}

export type UpdateFormData = <K extends keyof FormData>(
  field: K,
  value: FormData[K]
) => void;
