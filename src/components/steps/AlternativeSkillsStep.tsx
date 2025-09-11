import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  X,
  Code2,
  CheckCircle2,
  Search,
  Layers,
  Database,
  Cloud,
  Settings,
  Monitor,
  Shield,
  Smartphone,
  Cpu,
  BarChart3,
  Globe,
  ChevronDown,
  ChevronUp,
  Target,
  Flame
} from "lucide-react";

interface SkillsStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (type: string, message: string, description?: string, icon?: string, context?: string) => void;
  streakCounter: any;
  setStreakCounter: (fn: (prev: any) => any) => void;
}

interface TechCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  technologies: string[];
}

export function AlternativeSkillsStep({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  setStreakCounter
}: SkillsStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["frontend"]);
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const [selectedTech, setSelectedTech] = useState<{ name: string; category: string } | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [contextualMessage, setContextualMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("categories");

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

  const techCategories: TechCategory[] = [
    {
      id: "frontend",
      name: "Frontend & UI",
      icon: Monitor,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Interfaces de usuario y experiencias web",
      technologies: [
        "React", "Angular", "Vue.js", "Next.js", "Nuxt.js", "Svelte", 
        "TypeScript", "JavaScript", "HTML5", "CSS3", "Sass", "Less",
        "Tailwind CSS", "Bootstrap", "Material-UI", "Ant Design", "jQuery"
      ]
    },
    {
      id: "mobile",
      name: "Mobile",
      icon: Smartphone,
      color: "text-green-600", 
      bgColor: "bg-green-50",
      description: "Desarrollo de aplicaciones móviles",
      technologies: [
        "React Native", "Flutter", "Ionic", "Xamarin", 
        "Swift", "Kotlin", "Cordova", "PhoneGap"
      ]
    },
    {
      id: "backend",
      name: "Backend & APIs",
      icon: Cpu,
      color: "text-purple-600",
      bgColor: "bg-purple-50", 
      description: "Servicios del lado del servidor",
      technologies: [
        "Node.js", "Express.js", "Nest.js", "Python", "Django", "Flask", "FastAPI",
        "Java", "Spring Boot", "Spring Framework", ".NET Core", "ASP.NET", 
        "PHP", "Laravel", "Go", "Rust", "Ruby", "Ruby on Rails", "Scala"
      ]
    },
    {
      id: "database",
      name: "Bases de Datos",
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Almacenamiento y gestión de datos",
      technologies: [
        "PostgreSQL", "MySQL", "MongoDB", "Redis", "Cassandra", "DynamoDB",
        "Oracle", "SQL Server", "MariaDB", "Neo4j", "InfluxDB", 
        "Firebase", "Supabase", "SQLite"
      ]
    },
    {
      id: "cloud",
      name: "Cloud & DevOps",
      icon: Cloud,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50", 
      description: "Infraestructura y despliegue",
      technologies: [
        "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins",
        "GitLab CI", "GitHub Actions", "CircleCI", "Terraform", "Ansible",
        "Chef", "Puppet", "Helm", "ArgoCD", "Vagrant", "Rancher"
      ]
    },
    {
      id: "apis",
      name: "APIs & Comunicación", 
      icon: Globe,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      description: "Integración y comunicación entre servicios", 
      technologies: [
        "REST API", "GraphQL", "gRPC", "WebSockets", "Socket.io",
        "SOAP", "OpenAPI", "Swagger", "Apache Kafka", "RabbitMQ",
        "Azure Service Bus", "Amazon SQS", "Apache Pulsar"
      ]
    },
    {
      id: "testing",
      name: "Testing & QA",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Herramientas de pruebas y calidad",
      technologies: [
        "Jest", "Cypress", "Selenium", "Postman", "JUnit", "pytest",
        "Mocha", "Chai", "Playwright", "TestNG", "PHPUnit", "RSpec", "Jasmine"
      ]
    },
    {
      id: "tools",
      name: "Herramientas",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      description: "Control de versiones y colaboración",
      technologies: [
        "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Confluence",
        "Slack", "Teams", "Trello", "Asana", "Azure DevOps"
      ]
    },
    {
      id: "data",
      name: "Data & Analytics",
      icon: BarChart3, 
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      description: "Análisis y visualización de datos",
      technologies: [
        "Power BI", "Tableau", "Apache Spark", "Databricks", "Snowflake",
        "Apache Airflow", "Looker", "QlikView", "SAS", "R", "Pandas", "NumPy"
      ]
    },
    {
      id: "security",
      name: "Seguridad",
      icon: Shield,
      color: "text-red-600", 
      bgColor: "bg-red-50",
      description: "Autenticación y protección",
      technologies: [
        "OAuth", "JWT", "SAML", "SSL/TLS", "Vault", "Keycloak", "Auth0", "Okta"
      ]
    }
  ];

  const getAllTechnologies = () => {
    return techCategories.reduce((acc, category) => {
      return [...acc, ...category.technologies.map(tech => ({ name: tech, category: category.id }))];
    }, [] as { name: string; category: string }[]);
  };

  const filteredTechnologies = getAllTechnologies().filter(tech =>
    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => {
      setContextualMessage(null);
    }, 3000);
  };

  const handleTechClick = (techName: string, categoryId: string) => {
    const skills = formData.skills || [];
    if (!skills.some((s: any) => s.name === techName)) {
      setSelectedTech({ name: techName, category: categoryId });
      setShowLevelSelector(true);
    }
  };

  const addSkillWithLevel = (levelId: string) => {
    if (!selectedTech) return;
    
    const skills = formData.skills || [];
    const newSkillObj = {
      name: selectedTech.name,
      level: levelId,
      category: selectedTech.category,
      ...(selectedVersion.trim() && { version: selectedVersion.trim() })
    };
    
    updateFormData("skills", [...skills, newSkillObj]);
    addProgress(5);
    setStreakCounter((prev: any) => ({ ...prev, skills: prev.skills + 1 }));
    
    const levelInfo = skillLevels.find(l => l.id === levelId);
    const categoryInfo = techCategories.find(c => c.id === selectedTech.category);
    const versionText = selectedVersion.trim() ? ` ${selectedVersion.trim()}` : '';
    
    addMotivationalMessage(
      'skill',
      '¡Stack potenciado! 🚀',
      `${selectedTech.name}${versionText} agregado como ${levelInfo?.professional} en ${categoryInfo?.name}`,
      '⚡'
    );

    showContextualSuccess(`✨ ${selectedTech.name} agregado a tu arsenal tecnológico!`);
    
    setSelectedTech(null);
    setSelectedLevel("");
    setSelectedVersion("");
    setShowLevelSelector(false);
  };

  const removeSkill = (index: number) => {
    const skills = formData.skills || [];
    const removedSkill = skills[index];
    updateFormData("skills", skills.filter((_: any, i: number) => i !== index));
    
    addMotivationalMessage(
      'skill',
      'Stack optimizado! 🔧',
      `${removedSkill.name} removido del arsenal`,
      '🗑️'
    );
  };

  const getSkillsByCategory = () => {
    const skills = formData.skills || [];
    const skillsByCategory: { [key: string]: any[] } = {};
    
    skills.forEach((skill: any) => {
      const category = skill.category || 'other';
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });
    
    return skillsByCategory;
  };

  const skillsByCategory = getSkillsByCategory();

  return (
    <div className="space-y-8">
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

      {/* Stack Builder Header */}
      <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
        <motion.div
          className="inline-flex p-3 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-xl mb-4"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Layers className="h-6 w-6 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
          Stack Builder 🏗️
        </h3>
        <p className="text-[var(--axity-gray)]">
          Construye tu arsenal tecnológico de forma inteligente y organizada
        </p>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Busca cualquier tecnología..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 h-12 text-base"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Por Categorías
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Búsqueda
            </TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            {techCategories.map((category) => {
              const isExpanded = expandedCategories.includes(category.id);
              const Icon = category.icon;
              const categorySkills = skillsByCategory[category.id] || [];
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader
                      className={`cursor-pointer transition-all ${category.bgColor} border-b`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-white shadow-sm ${category.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {categorySkills.length > 0 && (
                            <Badge className={`${category.color.replace('text-', 'bg-').replace('-600', '-100')} ${category.color.replace('-600', '-800')} border-0`}>
                              {categorySkills.length} agregada{categorySkills.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {category.technologies.map((tech) => {
                                const isAdded = formData.skills?.some((s: any) => s.name === tech);
                                
                                return (
                                  <motion.button
                                    key={tech}
                                    onClick={() => !isAdded && handleTechClick(tech, category.id)}
                                    disabled={isAdded}
                                    className={`p-3 rounded-xl text-sm font-medium transition-all border text-left ${
                                      isAdded
                                        ? 'bg-green-100 text-green-800 border-green-200 cursor-not-allowed'
                                        : `bg-white hover:${category.bgColor} ${category.color} border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md`
                                    }`}
                                    whileHover={!isAdded ? { scale: 1.02, y: -2 } : {}}
                                    whileTap={!isAdded ? { scale: 0.98 } : {}}
                                  >
                                    {isAdded ? '✅' : '+'} {tech}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-4">
            {searchQuery && (
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Mostrando {filteredTechnologies.length} resultado{filteredTechnologies.length !== 1 ? 's' : ''} para "{searchQuery}"
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredTechnologies.map((tech) => {
                    const isAdded = formData.skills?.some((s: any) => s.name === tech.name);
                    const categoryInfo = techCategories.find(c => c.id === tech.category);
                    
                    return (
                      <motion.button
                        key={tech.name}
                        onClick={() => !isAdded && handleTechClick(tech.name, tech.category)}
                        disabled={isAdded}
                        className={`p-3 rounded-xl text-sm font-medium transition-all border text-left ${
                          isAdded
                            ? 'bg-green-100 text-green-800 border-green-200 cursor-not-allowed'
                            : 'bg-white hover:bg-purple-50 text-[var(--axity-purple)] border-gray-200 hover:border-[var(--axity-violet)]/50 shadow-sm hover:shadow-md'
                        }`}
                        whileHover={!isAdded ? { scale: 1.02, y: -2 } : {}}
                        whileTap={!isAdded ? { scale: 0.98 } : {}}
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {isAdded ? '✅' : '+'} {tech.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {categoryInfo?.name}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Level Selector Modal */}
      <AnimatePresence>
        {showLevelSelector && selectedTech && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
              setShowLevelSelector(false);
              setSelectedTech(null);
              setSelectedVersion("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200"
            >
              <div className="text-center mb-6">
                <div className="p-3 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-xl mb-4 inline-flex">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--axity-purple)] mb-2">
                  ¿Cuál es tu nivel en {selectedTech.name}? 📊
                </h3>
                <p className="text-[var(--axity-gray)]">
                  Define tu experiencia con esta tecnología
                </p>
              </div>

              {/* Version Input */}
              <div className="mb-6">
                <Label className="text-[var(--axity-purple)] font-medium">
                  Versión (opcional) 📌
                </Label>
                <Input
                  placeholder="ej. 18.2, 3.11, v2.5..."
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="mt-1 bg-white/80 border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Especifica la versión que dominas
                </p>
              </div>
              
              <div className="space-y-3">
                {skillLevels.map((level) => (
                  <motion.button
                    key={level.id}
                    onClick={() => addSkillWithLevel(level.id)}
                    className={`w-full p-4 text-left rounded-xl border transition-all hover:shadow-md ${level.color}`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{level.emoji}</span>
                      <div>
                        <div className="font-bold">{level.name}</div>
                        <div className="text-sm opacity-80">{level.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLevelSelector(false);
                    setSelectedTech(null);
                    setSelectedVersion("");
                  }}
                  className="px-6 bg-white border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Skills - Stack Display */}
      {formData.skills && formData.skills.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              className="p-2 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h4 className="text-lg font-bold text-[var(--axity-purple)]">
                Tu Stack Tecnológico 💻
              </h4>
              <p className="text-sm text-gray-600">
                {formData.skills.length} tecnología{formData.skills.length !== 1 ? 's' : ''} en tu arsenal
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {techCategories.map((category) => {
              const categorySkills = skillsByCategory[category.id] || [];
              if (categorySkills.length === 0) return null;
              
              const Icon = category.icon;
              
              return (
                <div key={category.id}>
                  <div className={`flex items-center gap-2 mb-3 p-2 ${category.bgColor} rounded-lg`}>
                    <Icon className={`h-4 w-4 ${category.color}`} />
                    <span className={`font-medium ${category.color}`}>
                      {category.name} ({categorySkills.length})
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {categorySkills.map((skill: any) => {
                        const level = skillLevels.find(lvl => lvl.id === skill.level);
                        const globalIndex = formData.skills.findIndex((s: any) => s.name === skill.name);
                        
                        return (
                          <motion.div
                            key={skill.name}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all hover:border-[var(--axity-violet)]/50"
                            whileHover={{ scale: 1.02, y: -2 }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Code2 className="h-4 w-4 text-[var(--axity-purple)]" />
                                  <h5 className="font-bold text-[var(--axity-purple)]">
                                    {skill.name}
                                    {skill.version && (
                                      <span className="text-sm font-normal text-[var(--axity-violet)] ml-1">
                                        v{skill.version}
                                      </span>
                                    )}
                                  </h5>
                                </div>
                                <Badge className={level?.color || "bg-gray-100 text-gray-800 border-gray-200"}>
                                  {level?.professional}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSkill(globalIndex)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 text-red-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {formData.skills && formData.skills.length === 0 && (
        <div className="text-center py-12">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Layers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          </motion.div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">
            ¡Construye tu stack tecnológico! 🏗️
          </h4>
          <p className="text-gray-500">
            Explora las categorías o busca tecnologías específicas para comenzar
          </p>
        </div>
      )}
    </div>
  );
}