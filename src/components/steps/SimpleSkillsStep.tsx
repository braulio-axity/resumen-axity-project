import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  Plus,
  X,
  Code2,
  CheckCircle2,
  Search,
  Monitor,
  Database,
  Cloud,
  Settings,
  Shield,
  Smartphone,
  Cpu,
  BarChart3,
  Globe,
  Target,
  Award
} from "lucide-react";

interface SkillsStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (type: string, message: string, description?: string, icon?: string, context?: string) => void;
  streakCounter: any;
  setStreakCounter: (fn: (prev: any) => any) => void;
}

interface TechItem {
  name: string;
  category: string;
  popularity: number;
  trending: boolean;
  description: string;
}

export function SimpleSkillsStep({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  streakCounter,
  setStreakCounter
}: SkillsStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [expandedTech, setExpandedTech] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [contextualMessage, setContextualMessage] = useState<string | null>(null);

  const skillLevels = [
    {
      id: "principiante",
      name: "Básico", 
      emoji: "🌱",
      description: "Conceptos fundamentales claros",
      professional: "Principiante",
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      id: "intermedio",
      name: "Intermedio",
      emoji: "💻", 
      description: "Aplicación práctica en proyectos",
      professional: "Intermedio",
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: "avanzado", 
      name: "Avanzado",
      emoji: "🚀",
      description: "Experiencia sólida y buenas prácticas", 
      professional: "Avanzado",
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
      id: "experto",
      name: "Experto",
      emoji: "⭐",
      description: "Dominio técnico y liderazgo",
      professional: "Experto", 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  ];

  const categories = [
    {
      id: "frontend",
      name: "Frontend & UI",
      icon: Monitor,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      id: "mobile",
      name: "Mobile",
      icon: Smartphone,
      color: "text-green-600", 
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      borderColor: "border-green-200"
    },
    {
      id: "backend",
      name: "Backend & APIs",
      icon: Cpu,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      borderColor: "border-purple-200"
    },
    {
      id: "database",
      name: "Bases de Datos",
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      borderColor: "border-orange-200"
    },
    {
      id: "cloud",
      name: "Cloud & DevOps",
      icon: Cloud,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
      borderColor: "border-indigo-200"
    },
    {
      id: "apis",
      name: "APIs & Comunicación", 
      icon: Globe,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      borderColor: "border-teal-200"
    },
    {
      id: "testing",
      name: "Testing & QA",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      hoverColor: "hover:bg-emerald-100",
      borderColor: "border-emerald-200"
    },
    {
      id: "tools",
      name: "Herramientas",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      hoverColor: "hover:bg-gray-100",
      borderColor: "border-gray-200"
    },
    {
      id: "data",
      name: "Data & Analytics",
      icon: BarChart3, 
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      hoverColor: "hover:bg-violet-100",
      borderColor: "border-violet-200"
    },
    {
      id: "security",
      name: "Seguridad",
      icon: Shield,
      color: "text-red-600", 
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
      borderColor: "border-red-200"
    }
  ];

  const techCatalog: TechItem[] = [
    // Frontend & UI
    { name: "React", category: "frontend", popularity: 95, trending: true, description: "Biblioteca para construir interfaces de usuario" },
    { name: "Angular", category: "frontend", popularity: 88, trending: false, description: "Framework completo para aplicaciones web" },
    { name: "Vue.js", category: "frontend", popularity: 82, trending: true, description: "Framework progresivo para construir UIs" },
    { name: "Next.js", category: "frontend", popularity: 90, trending: true, description: "Framework de React con SSR y SSG" },
    { name: "TypeScript", category: "frontend", popularity: 92, trending: true, description: "JavaScript con tipado estático" },
    { name: "JavaScript", category: "frontend", popularity: 98, trending: false, description: "Lenguaje de programación web fundamental" },
    { name: "Tailwind CSS", category: "frontend", popularity: 85, trending: true, description: "Framework CSS utility-first" },
    { name: "Bootstrap", category: "frontend", popularity: 75, trending: false, description: "Framework CSS responsivo" },
    { name: "Svelte", category: "frontend", popularity: 72, trending: true, description: "Framework compilado para web apps" },
    { name: "Nuxt.js", category: "frontend", popularity: 78, trending: true, description: "Framework de Vue.js con SSR" },
    { name: "jQuery", category: "frontend", popularity: 65, trending: false, description: "Biblioteca JavaScript rápida y ligera" },
    { name: "Material-UI", category: "frontend", popularity: 80, trending: false, description: "Componentes React con Material Design" },
    { name: "Ant Design", category: "frontend", popularity: 75, trending: false, description: "Lenguaje de diseño empresarial" },
    { name: "Sass", category: "frontend", popularity: 70, trending: false, description: "Preprocesador CSS profesional" },
    { name: "HTML5", category: "frontend", popularity: 95, trending: false, description: "Lenguaje de marcado web estándar" },
    { name: "CSS3", category: "frontend", popularity: 90, trending: false, description: "Hojas de estilo en cascada modernas" },
    { name: "Webpack", category: "frontend", popularity: 78, trending: false, description: "Bundler de módulos para JavaScript" },

    // Mobile
    { name: "React Native", category: "mobile", popularity: 88, trending: true, description: "Framework para apps móviles nativas" },
    { name: "Flutter", category: "mobile", popularity: 85, trending: true, description: "SDK de Google para apps multiplataforma" },
    { name: "Ionic", category: "mobile", popularity: 70, trending: false, description: "Framework híbrido para apps móviles" },
    { name: "Xamarin", category: "mobile", popularity: 65, trending: false, description: "Plataforma Microsoft para apps móviles" },
    { name: "Swift", category: "mobile", popularity: 82, trending: false, description: "Lenguaje de Apple para iOS" },
    { name: "Kotlin", category: "mobile", popularity: 80, trending: true, description: "Lenguaje moderno para Android" },
    { name: "Cordova", category: "mobile", popularity: 60, trending: false, description: "Plataforma para apps híbridas" },
    { name: "Expo", category: "mobile", popularity: 75, trending: true, description: "Plataforma para desarrollo con React Native" },

    // Backend & APIs
    { name: "Node.js", category: "backend", popularity: 92, trending: true, description: "Runtime de JavaScript del lado servidor" },
    { name: "Express.js", category: "backend", popularity: 88, trending: false, description: "Framework web minimalista para Node.js" },
    { name: "Nest.js", category: "backend", popularity: 82, trending: true, description: "Framework escalable para Node.js" },
    { name: "Python", category: "backend", popularity: 90, trending: true, description: "Lenguaje versátil y fácil de aprender" },
    { name: "Django", category: "backend", popularity: 78, trending: false, description: "Framework web de alto nivel para Python" },
    { name: "Flask", category: "backend", popularity: 75, trending: false, description: "Microframework web para Python" },
    { name: "FastAPI", category: "backend", popularity: 85, trending: true, description: "Framework moderno y rápido para APIs" },
    { name: "Java", category: "backend", popularity: 88, trending: false, description: "Lenguaje orientado a objetos empresarial" },
    { name: "Spring Boot", category: "backend", popularity: 85, trending: true, description: "Framework para aplicaciones Java" },
    { name: ".NET Core", category: "backend", popularity: 82, trending: true, description: "Plataforma de desarrollo multiplataforma" },
    { name: "PHP", category: "backend", popularity: 70, trending: false, description: "Lenguaje de scripting del lado servidor" },
    { name: "Laravel", category: "backend", popularity: 75, trending: false, description: "Framework PHP elegante" },
    { name: "Go", category: "backend", popularity: 80, trending: true, description: "Lenguaje compilado de Google" },
    { name: "Rust", category: "backend", popularity: 75, trending: true, description: "Lenguaje de sistemas seguro" },
    { name: "Ruby", category: "backend", popularity: 68, trending: false, description: "Lenguaje dinámico y expresivo" },
    { name: "Ruby on Rails", category: "backend", popularity: 70, trending: false, description: "Framework web para Ruby" },
    { name: "C#", category: "backend", popularity: 80, trending: false, description: "Lenguaje de Microsoft para .NET" },
    { name: "Serverless", category: "backend", popularity: 72, trending: true, description: "Arquitectura sin servidor" },

    // Databases
    { name: "PostgreSQL", category: "database", popularity: 88, trending: true, description: "Base de datos relacional avanzada" },
    { name: "MySQL", category: "database", popularity: 85, trending: false, description: "Sistema de gestión de BD popular" },
    { name: "MongoDB", category: "database", popularity: 82, trending: true, description: "Base de datos NoSQL de documentos" },
    { name: "Redis", category: "database", popularity: 80, trending: false, description: "Base de datos en memoria" },
    { name: "Cassandra", category: "database", popularity: 65, trending: false, description: "BD distribuida de alta disponibilidad" },
    { name: "DynamoDB", category: "database", popularity: 75, trending: true, description: "BD NoSQL serverless de AWS" },
    { name: "Oracle", category: "database", popularity: 70, trending: false, description: "Sistema de BD empresarial" },
    { name: "SQL Server", category: "database", popularity: 75, trending: false, description: "BD relacional de Microsoft" },
    { name: "MariaDB", category: "database", popularity: 68, trending: false, description: "Fork de MySQL" },
    { name: "Neo4j", category: "database", popularity: 60, trending: false, description: "BD de grafos nativa" },
    { name: "InfluxDB", category: "database", popularity: 58, trending: false, description: "BD de series temporales" },
    { name: "Firebase", category: "database", popularity: 78, trending: true, description: "Plataforma de BD en la nube" },
    { name: "Supabase", category: "database", popularity: 72, trending: true, description: "Alternativa open source a Firebase" },
    { name: "SQLite", category: "database", popularity: 70, trending: false, description: "BD SQL embebida" },

    // Cloud & DevOps
    { name: "AWS", category: "cloud", popularity: 92, trending: true, description: "Servicios web de Amazon" },
    { name: "Azure", category: "cloud", popularity: 88, trending: true, description: "Plataforma en la nube de Microsoft" },
    { name: "Google Cloud", category: "cloud", popularity: 82, trending: true, description: "Servicios en la nube de Google" },
    { name: "Docker", category: "cloud", popularity: 90, trending: true, description: "Plataforma de contenedores" },
    { name: "Kubernetes", category: "cloud", popularity: 85, trending: true, description: "Orquestador de contenedores" },
    { name: "Jenkins", category: "cloud", popularity: 75, trending: false, description: "Servidor de automatización" },
    { name: "GitLab CI", category: "cloud", popularity: 78, trending: true, description: "CI/CD integrado con GitLab" },
    { name: "GitHub Actions", category: "cloud", popularity: 80, trending: true, description: "Automatización en GitHub" },
    { name: "Terraform", category: "cloud", popularity: 82, trending: true, description: "Infraestructura como código" },
    { name: "Ansible", category: "cloud", popularity: 70, trending: false, description: "Automatización de configuración" },
    { name: "Nginx", category: "cloud", popularity: 88, trending: false, description: "Servidor web y proxy reverso" },
    { name: "Apache", category: "cloud", popularity: 75, trending: false, description: "Servidor web HTTP" },
    { name: "Helm", category: "cloud", popularity: 68, trending: true, description: "Gestor de paquetes para Kubernetes" },
    { name: "Prometheus", category: "cloud", popularity: 72, trending: true, description: "Sistema de monitoreo" },
    { name: "Grafana", category: "cloud", popularity: 75, trending: true, description: "Visualización de métricas" },
    { name: "ELK Stack", category: "cloud", popularity: 70, trending: false, description: "Elasticsearch, Logstash, y Kibana" },
    { name: "Vagrant", category: "cloud", popularity: 60, trending: false, description: "Gestión de entornos virtuales" },

    // APIs & Communication
    { name: "REST APIs", category: "apis", popularity: 95, trending: false, description: "Servicios web RESTful" },
    { name: "GraphQL", category: "apis", popularity: 78, trending: true, description: "Lenguaje de consulta para APIs" },
    { name: "gRPC", category: "apis", popularity: 65, trending: true, description: "Framework RPC de alto rendimiento" },
    { name: "WebSockets", category: "apis", popularity: 70, trending: false, description: "Comunicación bidireccional en tiempo real" },
    { name: "Socket.io", category: "apis", popularity: 72, trending: false, description: "Biblioteca para WebSockets" },
    { name: "JSON", category: "apis", popularity: 98, trending: false, description: "Formato de intercambio de datos" },
    { name: "XML", category: "apis", popularity: 65, trending: false, description: "Lenguaje de marcado extensible" },
    { name: "SOAP", category: "apis", popularity: 55, trending: false, description: "Protocolo de acceso a objetos simples" },
    { name: "OpenAPI", category: "apis", popularity: 75, trending: true, description: "Especificación para APIs REST" },
    { name: "Postman", category: "apis", popularity: 85, trending: false, description: "Plataforma para desarrollo de APIs" },
    { name: "Insomnia", category: "apis", popularity: 68, trending: false, description: "Cliente REST alternativo" },
    { name: "Apache Kafka", category: "apis", popularity: 72, trending: true, description: "Plataforma de streaming distribuida" },
    { name: "RabbitMQ", category: "apis", popularity: 68, trending: false, description: "Broker de mensajes" },

    // Testing & QA
    { name: "Jest", category: "testing", popularity: 85, trending: true, description: "Framework de testing para JavaScript" },
    { name: "Cypress", category: "testing", popularity: 80, trending: true, description: "Framework de testing end-to-end" },
    { name: "Selenium", category: "testing", popularity: 78, trending: false, description: "Automatización de navegadores web" },
    { name: "Playwright", category: "testing", popularity: 75, trending: true, description: "Testing end-to-end moderno" },
    { name: "Mocha", category: "testing", popularity: 70, trending: false, description: "Framework de testing para Node.js" },
    { name: "Jasmine", category: "testing", popularity: 65, trending: false, description: "Framework BDD para JavaScript" },
    { name: "PyTest", category: "testing", popularity: 82, trending: false, description: "Framework de testing para Python" },
    { name: "JUnit", category: "testing", popularity: 85, trending: false, description: "Framework de testing para Java" },
    { name: "TestNG", category: "testing", popularity: 70, trending: false, description: "Framework de testing inspirado en JUnit" },
    { name: "Puppeteer", category: "testing", popularity: 72, trending: false, description: "Control de Chrome headless" },
    { name: "Storybook", category: "testing", popularity: 75, trending: true, description: "Desarrollo de componentes aislados" },
    { name: "React Testing Library", category: "testing", popularity: 80, trending: true, description: "Testing utilities para React" },
    { name: "Appium", category: "testing", popularity: 65, trending: false, description: "Automatización de apps móviles" },

    // Tools
    { name: "Git", category: "tools", popularity: 98, trending: false, description: "Sistema de control de versiones" },
    { name: "GitHub", category: "tools", popularity: 95, trending: false, description: "Plataforma de desarrollo colaborativo" },
    { name: "GitLab", category: "tools", popularity: 80, trending: true, description: "Plataforma DevOps completa" },
    { name: "Bitbucket", category: "tools", popularity: 70, trending: false, description: "Repositorios Git de Atlassian" },
    { name: "JIRA", category: "tools", popularity: 85, trending: false, description: "Gestión de proyectos y seguimiento" },
    { name: "Confluence", category: "tools", popularity: 75, trending: false, description: "Colaboración y documentación" },
    { name: "Slack", category: "tools", popularity: 88, trending: false, description: "Comunicación en equipo" },
    { name: "Trello", category: "tools", popularity: 72, trending: false, description: "Gestión de tareas con tableros" },
    { name: "Notion", category: "tools", popularity: 78, trending: true, description: "Workspace todo-en-uno" },
    { name: "VS Code", category: "tools", popularity: 92, trending: true, description: "Editor de código moderno" },
    { name: "IntelliJ IDEA", category: "tools", popularity: 85, trending: false, description: "IDE para desarrollo Java" },

    // Data & Analytics
    { name: "R", category: "data", popularity: 75, trending: false, description: "Lenguaje estadístico" },
    { name: "Pandas", category: "data", popularity: 85, trending: true, description: "Manipulación de datos en Python" },
    { name: "NumPy", category: "data", popularity: 88, trending: false, description: "Computación numérica en Python" },
    { name: "Matplotlib", category: "data", popularity: 80, trending: false, description: "Visualización de datos en Python" },
    { name: "Seaborn", category: "data", popularity: 75, trending: false, description: "Visualización estadística" },
    { name: "Jupyter", category: "data", popularity: 85, trending: false, description: "Notebooks interactivos" },
    { name: "Apache Spark", category: "data", popularity: 78, trending: true, description: "Motor de análisis unificado" },
    { name: "Hadoop", category: "data", popularity: 68, trending: false, description: "Framework de big data" },
    { name: "Tableau", category: "data", popularity: 82, trending: false, description: "Visualización de datos empresarial" },
    { name: "Power BI", category: "data", popularity: 80, trending: true, description: "Business intelligence de Microsoft" },
    { name: "Apache Airflow", category: "data", popularity: 72, trending: true, description: "Orquestación de workflows" },
    { name: "TensorFlow", category: "data", popularity: 87, trending: true, description: "Framework de machine learning" },
    { name: "PyTorch", category: "data", popularity: 85, trending: true, description: "Framework de deep learning" },

    // Security
    { name: "OAuth", category: "security", popularity: 88, trending: false, description: "Framework de autorización" },
    { name: "JWT", category: "security", popularity: 85, trending: false, description: "JSON Web Tokens" },
    { name: "SSL/TLS", category: "security", popularity: 92, trending: false, description: "Protocolos de seguridad" },
    { name: "OWASP", category: "security", popularity: 75, trending: false, description: "Proyecto de seguridad web abierta" },
    { name: "Penetration Testing", category: "security", popularity: 70, trending: true, description: "Testing de seguridad" },
    { name: "Vulnerability Assessment", category: "security", popularity: 72, trending: true, description: "Evaluación de vulnerabilidades" },
    { name: "Cryptography", category: "security", popularity: 68, trending: false, description: "Cifrado y seguridad" },
    { name: "Security Auditing", category: "security", popularity: 65, trending: true, description: "Auditoría de seguridad" }
  ];

  const filteredTechnologies = useMemo(() => {
    let filtered = techCatalog;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(tech => selectedCategories.includes(tech.category));
    }

    // Sort by popularity (highest first)
    filtered.sort((a, b) => b.popularity - a.popularity);

    return filtered;
  }, [searchQuery, selectedCategories]);

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => {
      setContextualMessage(null);
    }, 3000);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addToStack = (tech: TechItem) => {
    setExpandedTech(tech.name);
    setSelectedLevel("");
    setSelectedVersion("");
  };

  const confirmAddToStack = (tech: TechItem) => {
    if (!selectedLevel) return;

    const skills = formData.skills || [];
    const newSkill = {
      name: tech.name,
      level: selectedLevel,
      category: tech.category,
      ...(selectedVersion.trim() && { version: selectedVersion.trim() })
    };

    updateFormData("skills", [...skills, newSkill]);
    addProgress(5);
    setStreakCounter((prev: any) => ({ ...prev, skills: prev.skills + 1 }));

    const levelInfo = skillLevels.find(l => l.id === selectedLevel);
    showContextualSuccess(`✨ ${tech.name} agregado a tu stack!`);
    
    addMotivationalMessage(
      'skill',
      '¡Nueva tecnología dominada! 🚀',
      `${tech.name} como ${levelInfo?.professional} agregado a tu arsenal`,
      '⚡'
    );

    setExpandedTech(null);
    setSelectedLevel("");
    setSelectedVersion("");
  };

  const removeFromStack = (index: number) => {
    const skills = formData.skills || [];
    const removedSkill = skills[index];
    const newSkills = skills.filter((_: any, i: number) => i !== index);
    
    updateFormData("skills", newSkills);
    
    addMotivationalMessage(
      'skill',
      'Tecnología removida 🔄',
      `${removedSkill.name} fue removido de tu stack`,
      '🗑️'
    );
  };

  const isInStack = (techName: string) => {
    return formData.skills?.some((skill: any) => skill.name === techName);
  };

  const getTechCount = (categoryId: string) => {
    return techCatalog.filter(tech => tech.category === categoryId).length;
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
    setExpandedTech(null);
  };

  const cancelExpansion = () => {
    setExpandedTech(null);
    setSelectedLevel("");
    setSelectedVersion("");
  };

  return (
    <div className="space-y-6">
      {/* Contextual Success Message */}
      <AnimatePresence>
        {contextualMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 shadow-lg border border-green-200"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-2xl"
              >
                ✨
              </motion.div>
              <p className="font-medium">{contextualMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar Prominente */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Busca cualquier tecnología (ej: React, Python, AWS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base bg-white border-gray-200 focus:border-[var(--axity-purple)] focus:ring-[var(--axity-purple)]"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium text-[var(--axity-purple)]">
              Filtrar por Categorías
            </CardTitle>
            {selectedCategories.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-[var(--axity-purple)]"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategories.includes(category.id);
              const techCount = getTechCount(category.id);
              
              return (
                <motion.button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isSelected 
                      ? `${category.bgColor} ${category.color} ${category.borderColor} border-2 font-medium` 
                      : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <Badge 
                    variant="secondary"
                    className="ml-1 text-xs px-1.5 py-0.5 bg-white/60 text-gray-600"
                  >
                    {techCount}
                  </Badge>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Technology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredTechnologies.map((tech, index) => {
            const isExpanded = expandedTech === tech.name;
            const inStack = isInStack(tech.name);
            
            return (
              <motion.div
                key={tech.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`relative bg-white rounded-xl border-2 shadow-sm transition-all duration-300 overflow-hidden ${
                  isExpanded 
                    ? 'border-[var(--axity-purple)] shadow-lg scale-[1.02] z-10' 
                    : inStack
                    ? 'border-[var(--axity-mint)] bg-[var(--axity-mint)]/5'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="p-4">
                  {/* Tech Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {tech.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {tech.description}
                      </p>
                    </div>
                    
                    {/* Popularity Indicator */}
                    <div className="flex items-center gap-1 ml-3">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          tech.popularity >= 90 ? 'bg-green-500' :
                          tech.popularity >= 75 ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`} />
                        <span className="text-xs text-gray-500">
                          {tech.popularity}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-2">
                    {inStack ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-[var(--axity-mint)] text-[var(--axity-mint)] hover:bg-[var(--axity-mint)]/10"
                        disabled
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        En tu stack
                      </Button>
                    ) : isExpanded ? (
                      <div className="flex-1 space-y-3">
                        {/* Level Selection */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Nivel de experiencia
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            {skillLevels.map((level) => (
                              <motion.button
                                key={level.id}
                                onClick={() => setSelectedLevel(level.id)}
                                className={`p-2 rounded-lg text-xs transition-all border-2 ${
                                  selectedLevel === level.id
                                    ? `${level.color} border-current font-medium`
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-center gap-1 justify-center">
                                  <span>{level.emoji}</span>
                                  <span>{level.name}</span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Version Input (Optional) */}
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Versión (opcional)
                          </Label>
                          <Input
                            placeholder="ej: v18, 3.x, latest"
                            value={selectedVersion}
                            onChange={(e) => setSelectedVersion(e.target.value)}
                            className="h-9 text-sm"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => confirmAddToStack(tech)}
                            disabled={!selectedLevel}
                            className="flex-1 bg-[var(--axity-purple)] hover:bg-[var(--axity-purple)]/90 text-white"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Agregar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelExpansion}
                            className="px-3"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToStack(tech)}
                        className="flex-1 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar a mi stack
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Current Stack */}
      {formData.skills && formData.skills.length > 0 && (
        <Card className="mt-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-[var(--axity-purple)] flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Tu Stack Tecnológico ({formData.skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.skills.map((skill: any, index: number) => {
                const levelInfo = skillLevels.find(l => l.id === skill.level);
                
                return (
                  <motion.div
                    key={`${skill.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gradient-to-r from-[var(--axity-purple)]/10 to-[var(--axity-violet)]/10 rounded-lg p-3 border border-[var(--axity-purple)]/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {skill.name}
                          </span>
                          {skill.version && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              {skill.version}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{levelInfo?.emoji}</span>
                          <span className="text-sm text-gray-600">
                            {levelInfo?.professional}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromStack(index)}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredTechnologies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No encontramos tecnologías
          </h3>
          <p className="text-gray-500 mb-4">
            Intenta ajustar tu búsqueda o filtros
          </p>
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="text-[var(--axity-purple)] border-[var(--axity-purple)] hover:bg-[var(--axity-purple)]/10"
          >
            Limpiar filtros
          </Button>
        </motion.div>
      )}
    </div>
  );
}