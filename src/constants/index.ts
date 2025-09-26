import {
  Code2,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Building,
  User,
  Calendar,
  Target,
  Trophy,
} from "lucide-react";

export const CONSULTANT_LEVELS = {
  trainee: {
    name: "Trainee",
    emoji: "🌱",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  junior: {
    name: "Junior",
    emoji: "⚡",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  consultor: {
    name: "Consultor",
    emoji: "🚀",
    color: "text-[var(--axity-purple)]",
    bgColor: "bg-purple-100",
  },
  avanzado: {
    name: "Avanzado",
    emoji: "🔥",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  senior: {
    name: "Senior",
    emoji: "⭐",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  senior_avanzado: {
    name: "Senior Avanzado",
    emoji: "👑",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
} as const;

export const FORM_STEPS = [
  {
    id: 0,
    title: "Stack tecnológico",
    subtitle: "Comparte las tecnologías que dominas 💻",
    shortTitle: "Stack Tecnológico",
    icon: Code2,
    color: "bg-axity-gradient-primary",
    theme: "from-blue-50 to-purple-50",
  },
  {
    id: 1,
    title: "Experiencia profesional",
    subtitle:
      "Cuéntanos sobre los proyectos que has desarrollado 📂",
    shortTitle: "Experiencia",
    icon: Briefcase,
    color: "bg-axity-gradient-accent",
    theme: "from-orange-50 to-red-50",
  },
  {
    id: 2,
    title: "Tu background académico y técnico",
    subtitle:
      "El aprendizaje continuo es clave en tecnología. Comparte tu formación y certificaciones 📚",
    shortTitle: "Educación",
    icon: GraduationCap,
    color: "bg-axity-gradient-accent",
    theme: "from-emerald-50 to-teal-50",
  },
  {
    id: 3,
    title: "¡Perfil completado!",
    subtitle: "Revisa tu información antes de publicar 🚀",
    shortTitle: "Finalizar",
    icon: CheckCircle2,
    color: "bg-axity-gradient-secondary",
    theme: "from-purple-50 to-pink-50",
  },
];

export const SKILL_LEVELS = [
  {
    id: "principiante",
    name: "Básico",
    emoji: "🌱",
    description: "Conceptos fundamentales claros",
    professional: "Principiante",
  },
  {
    id: "intermedio",
    name: "Intermedio",
    emoji: "💻",
    description: "Aplicación práctica en proyectos",
    professional: "Intermedio",
  },
  {
    id: "avanzado",
    name: "Avanzado",
    emoji: "🚀",
    description: "Experiencia sólida y buenas prácticas",
    professional: "Avanzado",
  },
  {
    id: "experto",
    name: "Experto",
    emoji: "⭐",
    description: "Dominio técnico y liderazgo",
    professional: "Experto",
  },
];

export const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Java",
  "Angular",
  "Vue.js",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "GraphQL",
  "REST API",
  "Microservices",
  "CI/CD",
  "Git",
  "Jira",
];

export const STORY_STEPS = [
  {
    title: "La empresa",
    subtitle: "¿Dónde desarrollaste esta experiencia?",
    icon: Building,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Tu rol",
    subtitle: "¿Cuál fue tu posición en el equipo?",
    icon: User,
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Cronología",
    subtitle: "¿Cuándo desarrollaste esta experiencia?",
    icon: Calendar,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Desafíos técnicos",
    subtitle: "¿Qué retos resolviste?",
    icon: Target,
    color: "from-red-500 to-pink-500",
  },
  {
    title: "Resultados obtenidos",
    subtitle: "¿Cuáles fueron tus principales logros?",
    icon: Trophy,
    color: "from-yellow-500 to-orange-500",
  },
];

// Mensajes motivacionales
export const SKILL_MESSAGES = [
  "¡Tu stack se fortalece! 💪",
  "¡Otra herramienta en tu arsenal! 🔧",
  "¡Perfil técnico en construcción! 🏗️",
  "¡Expandiendo horizontes tecnológicos! 🌟",
  "¡Tu toolkit crece inteligentemente! 🧠",
  "¡Agregaste superpoderes técnicos! ⚡",
  "¡Stack diversificado como un pro! 🎯",
  "¡Tecnología desbloqueada! 🔓",
  "¡Tu perfil brilla más! ✨",
  "¡Competencia técnica level up! 📈",
  "¡Herramientas de élite agregadas! 👑",
  "¡Stack building como un maestro! 🎨",
  "¡Tu expertise se expande! 🚀",
  "¡Tecnología dominada oficialmente! 🏆",
  "¡Construcción de perfil épica! 🎪",
];

export const EXPERIENCE_MESSAGES = [
  "¡Tu historia profesional cobra vida! 📖",
  "¡Documentando logros como un pro! 🏆",
  "¡Experiencia valiosa registrada! 💎",
  "¡Tu trayectoria se enriquece! 🛤️",
  "¡Capítulo profesional añadido! 📚",
  "¡Portfolio de experiencias epic! 🎯",
  "¡Tu carrera toma forma digital! 💻",
  "¡Milestone profesional desbloqueado! 🔓",
  "¡Construyendo legacy técnico! 🏗️",
  "¡Historia de éxito documentada! ⭐",
  "¡Expertise comprobada oficialmente! ✅",
  "¡Tu journey profesional brilla! ✨",
  "¡Experiencia level unlocked! 🚀",
  "¡Añadiendo valor a tu perfil! 📈",
  "¡Tu background se fortalece! 💪",
];

export const EDUCATION_MESSAGES = [
  "¡Knowledge is power activado! 🧠",
  "¡Tu formación académica destaca! 🌟",
  "¡Bases sólidas documentadas! 🏛️",
  "¡Inversión en conocimiento registrada! 💡",
  "¡Tu background académico brilla! ✨",
  "¡Fundamentos técnicos confirmados! 🎯",
  "¡Educación de calidad verificada! ✅",
  "¡Tu preparación académica impresiona! 📚",
  "¡Conocimiento estructurado añadido! 🔧",
  "¡Formación técnica level up! 📈",
  "¡Tu expertise tiene raíces profundas! 🌳",
  "¡Background académico sobresaliente! 🏆",
  "¡Credenciales educativas desbloqueadas! 🔓",
  "¡Tu preparación es tu superpoder! ⚡",
  "¡Fundación académica rock solid! 🗿",
];

export const CERTIFICATION_MESSAGES = [
  "¡Credencial técnica desbloqueada! 🏅",
  "¡Tu expertise está certificada! ✅",
  "¡Skills oficialmente validados! 🎖️",
  "¡Certificación de élite añadida! 👑",
  "¡Tu conocimiento tiene respaldo oficial! 📜",
  "¡Competencias técnicas verificadas! 🔍",
  "¡Badge profesional conseguido! 🏆",
  "¡Tu expertise ahora es incuestionable! 💪",
  "¡Credencial industry-standard! 🌟",
  "¡Certificación que abre puertas! 🚪",
  "¡Tu perfil gana credibilidad! 📈",
  "¡Skills certificados = Skills confiables! 🤝",
  "¡Validation técnica completada! ✨",
  "¡Tu conocimiento tiene sello de calidad! 🎯",
  "¡Certificación que habla por ti! 💬",
];

export const COMPLETION_MESSAGES = [
  "¡Sección conquistada! 🎉",
  "¡Progreso épico desbloqueado! 🚀",
  "¡Un paso más hacia la perfección! ✨",
  "¡Tu perfil cobra vida! 💫",
  "¡Excelente momentum! 🔥",
  "¡Building success step by step! 📈",
  "¡Tu dedicación se nota! 👏",
  "¡Camino al éxito trazado! 🛤️",
];


export const consultantLevels = {
  trainee: {
    name: "Trainee",
    emoji: "🌱",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  junior: {
    name: "Junior",
    emoji: "⚡",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  consultor: {
    name: "Consultor",
    emoji: "🚀",
    color: "text-[var(--axity-purple)]",
    bgColor: "bg-purple-100",
  },
  avanzado: {
    name: "Avanzado",
    emoji: "🔥",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  senior: {
    name: "Senior",
    emoji: "⭐",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  senior_avanzado: {
    name: "Senior Avanzado",
    emoji: "👑",
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
};

export const steps = [
  {
    id: 0,
    title: "¿Qué tecnologías dominas?",
    subtitle: "Selecciona las tecnologías que dominas 💻",
    shortTitle: "Stack Tecnológico",
    icon: Code2,
    color: "bg-axity-gradient-primary",
    theme: "from-blue-50 to-purple-50",
  },
  {
    id: 1,
    title: "¡Es hora de documentar tu trayectoria!",
    subtitle:
      "Cada experiencia profesional es una pieza clave de tu historia de crecimiento. Comienza agregando tu experiencia laboral más significativa 📂",
    shortTitle: "Experiencia",
    icon: Briefcase,
    color: "bg-axity-gradient-accent",
    theme: "from-orange-50 to-red-50",
  },
  {
    id: 2,
    title: "Formación y certificaciones",
    subtitle: "Tu background académico y credenciales técnicas 📚",
    shortTitle: "Educación",
    icon: GraduationCap,
    color: "bg-axity-gradient-accent",
    theme: "from-purple-50 to-pink-100",
  },
  {
    id: 3,
    title: "¡Perfil completado!",
    subtitle: "Revisa tu información antes de enviar 🚀",
    shortTitle: "Finalizar",
    icon: CheckCircle2,
    color: "bg-axity-gradient-secondary",
    theme: "from-purple-50 to-pink-50",
  },
];