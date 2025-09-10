export type ConsultantLevel =
  | "trainee"
  | "junior"
  | "consultor"
  | "avanzado"
  | "senior"
  | "senior_avanzado";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  level: ConsultantLevel;

  skills: Array<{ name: string; level: string; version?: string }>;
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    challenges: string;
    achievements: string;
    technologies: string[];
    projects: Array<{
      name: string;
      role: string;
      responsibilities: string;
      technologies: Array<{ name: string; version?: string }>;
    }>;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    year: string;
    achievements?: string;
    status: '' | 'terminado' | 'en-curso' | 'incompleto';
    isInternational: boolean;
    hasApostille: boolean;
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
  type: "skill" | "experience" | "education" | "certification" | "milestone";
  message: string;
  description?: string;
  icon: string;
  timestamp: number;
  context?: string;
}

/** Updater type-safe: value se ajusta al tipo del campo */
export type UpdateFormData = <K extends keyof FormData>(
  field: K,
  value: FormData[K]
) => void;

/** Alias para el callback de mensajes motivacionales */
export type AddMotivationalMessage = (
  type: MotivationalMessage["type"],
  message: string,
  description?: string,
  icon?: string,
  context?: string
) => void;

export type StreakCounter = {
  skills: number;
  experiences: number;
  education: number;
  certifications: number;
};
