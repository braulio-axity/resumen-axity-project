import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  Plus,
  Building,
  User,
  Calendar,
  Target,
  Trophy,
  Code2,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  Clock,
  Eye,
  Edit3,
  ChevronDown,
  ChevronUp,
  PlayCircle,
} from "lucide-react";
import { Separator } from "../ui/separator";

/* =========================
   Tipos
   ========================= */
interface ExperienceStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (
    type: string,
    message: string,
    description?: string,
    icon?: string,
    context?: string
  ) => void;
  streakCounter: any;
  setStreakCounter: (fn: (prev: any) => any) => void;
}

interface ProjectTechnology {
  name: string;
  version?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: ProjectTechnology[];
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  challenges: string;
  achievements: string;
  technologies: string[];
  projects: Project[];
}

/* =========================
   Componente
   ========================= */
export function InlineExperienceWizard({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  streakCounter,
  setStreakCounter,
}: ExperienceStepProps) {
  // Evita warning por prop no usada (se mantiene por compatibilidad de props)
  void streakCounter;

  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
    {}
  );
  const [activeStep, setActiveStep] = useState(0);
  const [contextualMessage, setContextualMessage] = useState<string | null>(
    null
  );

  const [currentExp, setCurrentExp] = useState<Experience>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    challenges: "",
    achievements: "",
    technologies: [],
    projects: [],
  });

  const [currentProject, setCurrentProject] = useState<Project>({
    name: "",
    description: "",
    technologies: [],
  });

  const [newTechName, setNewTechName] = useState("");
  const [newTechVersion, setNewTechVersion] = useState("");

  const experienceSteps = [
    {
      id: 0,
      title: "Información básica",
      icon: Building,
      description: "Empresa, cargo y fechas de trabajo",
      color: "from-blue-400 to-purple-500",
    },
    {
      id: 1,
      title: "Proyectos destacados",
      icon: Code2,
      description: "Proyectos importantes y tecnologías usadas",
      color: "from-green-400 to-blue-500",
    },
    {
      id: 2,
      title: "Logros y desafíos",
      icon: Trophy,
      description: "Impacto generado y retos superados",
      color: "from-yellow-400 to-orange-500",
    },
  ] as const;

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => setContextualMessage(null), 3000);
  };

  const toggleExpanded = (index: number) => {
    setExpandedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getDuration = (startDate: string, endDate: string, current: boolean) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const end = current ? new Date() : new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      const remainingMonths = months % 12;
      return remainingMonths > 0
        ? `${years} año${years > 1 ? "s" : ""} y ${remainingMonths} mes${
            remainingMonths > 1 ? "es" : ""
          }`
        : `${years} año${years > 1 ? "s" : ""}`;
    }
    return `${months} mes${months > 1 ? "es" : ""}`;
  };

  /* ======= Project helpers (se usan en Step 1 si agregas UI) ======= */
  const addTechnologyToCurrentProject = () => {
    const name = newTechName.trim();
    if (!name) return;
    const tech: ProjectTechnology = {
      name,
      version: newTechVersion.trim() || undefined,
    };
    setCurrentProject((prev) => ({
      ...prev,
      technologies: [...prev.technologies, tech],
    }));
    setNewTechName("");
    setNewTechVersion("");
  };

  /* ======= Guardar experiencia ======= */
  const addExperience = () => {
    if (!currentExp.company || !currentExp.position) return;

    const experiences: Experience[] = Array.isArray(formData.experiences)
      ? (formData.experiences as Experience[])
      : [];

    updateFormData("experiences", [...experiences, currentExp]);

    // Reset
    setCurrentExp({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      challenges: "",
      achievements: "",
      technologies: [],
      projects: [],
    });
    setShowAddForm(false);
    setActiveStep(0);

    addProgress(20);
    setStreakCounter((prev: any) => ({
      ...prev,
      experiences: (prev?.experiences ?? 0) + 1,
    }));

    const expCount = experiences.length + 1;
    const milestones: Partial<Record<number, string>> = {
      1: "¡Primera experiencia documentada! 📖",
      3: "¡Trayectoria sólida construida! 🏗️",
      5: "¡Portfolio profesional épico! 🎯",
    };
    const milestoneMsg = milestones[expCount];
    if (milestoneMsg) addProgress(15, milestoneMsg);

    addMotivationalMessage(
      "experience",
      "¡Experiencia agregada exitosamente! 🎉",
      `${currentExp.position} en ${currentExp.company} ahora es parte de tu trayectoria`,
      "💼"
    );
    showContextualSuccess(
      `🎯 Tu experiencia en ${currentExp.company} ha sido documentada!`
    );
  };

  const canProceedStep = () => {
    switch (activeStep) {
      case 0:
        return (
          currentExp.company.trim().length > 0 &&
          currentExp.position.trim().length > 0 &&
          Boolean(currentExp.startDate)
        );
      case 1:
        return true; // proyectos opcionales
      case 2:
        return true; // desafíos/logros opcionales
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (activeStep < experienceSteps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };
  const prevStep = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  // Lista tipada para pintar
  const experiencesList: Experience[] = Array.isArray(formData.experiences)
    ? (formData.experiences as Experience[])
    : [];

  return (
    <div className="space-y-8">
      {/* Contextual Success Message */}
      <AnimatePresence>
        {contextualMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-2xl"
              >
                ✅
              </motion.div>
              <p className="font-medium">{contextualMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="text-center">
        {experiencesList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-full border border-purple-200"
          >
            <Award className="h-4 w-4 text-[var(--axity-purple)]" />
            <span className="text-sm font-medium text-[var(--axity-purple)]">
              {experiencesList.length} experiencia
              {experiencesList.length !== 1 ? "s" : ""} documentada
              {experiencesList.length !== 1 ? "s" : ""}
            </span>
          </motion.div>
        )}
      </div>

      {/* Timeline de Experiencias */}
      {experiencesList.length > 0 && (
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--axity-purple)] via-[var(--axity-violet)] to-[var(--axity-orange)]" />

            {experiencesList.map((exp: Experience, index: number) => (
              <motion.div
                key={`${exp.company}-${exp.position}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20 pb-8"
              >
                {/* Timeline Dot */}
                <motion.div
                  className={`absolute left-6 w-4 h-4 rounded-full shadow-lg ${
                    exp.current
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : "bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)]"
                  }`}
                  whileHover={{ scale: 1.2 }}
                >
                  {exp.current && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                {/* Experience Card */}
                <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-[var(--axity-purple)]">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[var(--axity-purple)]">
                              {exp.position}
                            </h4>
                            <p className="text-[var(--axity-orange)] font-medium">
                              {exp.company}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-[var(--axity-gray)]">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {exp.startDate} -{" "}
                              {exp.current ? "Presente" : exp.endDate}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {getDuration(exp.startDate, exp.endDate, exp.current)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {exp.current && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Actual
                            </Badge>
                          </motion.div>
                        )}

                        <Button
                          onClick={() => toggleExpanded(index)}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {expandedCards[index] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {expandedCards[index] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <Separator className="mb-6" />

                          {/* Projects Section */}
                          {exp.projects && exp.projects.length > 0 && (
                            <div className="mb-6">
                              <div className="flex items-center gap-2 mb-4">
                                <Code2 className="h-5 w-5 text-[var(--axity-purple)]" />
                                <h5 className="font-bold text-[var(--axity-purple)]">
                                  Proyectos ({exp.projects.length})
                                </h5>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {exp.projects.map(
                                  (project: Project, projectIndex: number) => (
                                    <motion.div
                                      key={`${project.name}-${projectIndex}`}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: projectIndex * 0.1 }}
                                      className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
                                    >
                                      <div className="flex items-start gap-3 mb-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                          <PlayCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <h6 className="font-bold text-[var(--axity-purple)] mb-1">
                                            {project.name}
                                          </h6>
                                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                            {project.description}
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap gap-2">
                                        {project.technologies.map(
                                          (tech: ProjectTechnology, techIndex: number) => (
                                            <Badge
                                              key={`${tech.name}-${techIndex}`}
                                              className="text-xs bg-blue-100 text-blue-800 border-blue-200"
                                            >
                                              {tech.name}
                                              {tech.version ? ` v${tech.version}` : ""}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    </motion.div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Challenges and Achievements */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {exp.challenges && (
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Target className="h-5 w-5 text-red-500" />
                                  <h5 className="font-bold text-[var(--axity-purple)]">
                                    Desafíos resueltos
                                  </h5>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                  <p className="text-sm text-gray-700">
                                    {exp.challenges}
                                  </p>
                                </div>
                              </div>
                            )}

                            {exp.achievements && (
                              <div>
                                <div className="flex items-center gap-2 mb-3">
                                  <Trophy className="h-5 w-5 text-yellow-500" />
                                  <h5 className="font-bold text-[var(--axity-purple)]">
                                    Logros obtenidos
                                  </h5>
                                </div>
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                  <p className="text-sm text-gray-700">
                                    {exp.achievements}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[var(--axity-purple)]"
                            >
                              <Edit3 className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-[var(--axity-purple)]"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver detalles
                            </Button>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Experience Button */}
      {!showAddForm && (
        <div className="text-center py-8">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="ax-btn-primary text-white shadow-xl px-8 py-4"
            >
              <Plus className="h-6 w-6 mr-3" />
              {experiencesList.length > 0
                ? "Agregar nueva experiencia"
                : "Documentar mi primera experiencia"}{" "}
              ✨
            </Button>
          </motion.div>
          <p className="text-sm text-[var(--axity-gray)] mt-4">
            Cada experiencia construye tu historia profesional única
          </p>
        </div>
      )}

      {/* INLINE WIZARD FORM */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Wizard Header */}
            <Card className="bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      {(() => {
                        const Icon = experienceSteps[activeStep].icon;
                        return <Icon className="h-6 w-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Nueva experiencia profesional
                      </h3>
                      <p className="text-white/80 text-sm">
                        {experienceSteps[activeStep].title}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setActiveStep(0);
                      setCurrentExp({
                        company: "",
                        position: "",
                        startDate: "",
                        endDate: "",
                        current: false,
                        challenges: "",
                        achievements: "",
                        technologies: [],
                        projects: [],
                      });
                      setCurrentProject({
                        name: "",
                        description: "",
                        technologies: [],
                      });
                      setNewTechName("");
                      setNewTechVersion("");
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>

                {/* Step Progress */}
                <div className="flex items-center justify-between">
                  {experienceSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-3 flex-1">
                      <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                          index === activeStep
                            ? "bg-white/20 text-white"
                            : index < activeStep
                            ? "text-white/70"
                            : "text-white/50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            index === activeStep
                              ? "bg-white text-[var(--axity-purple)]"
                              : index < activeStep
                              ? "bg-white/30 text-white"
                              : "bg-white/10 text-white/50"
                          }`}
                        >
                          {index < activeStep ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="hidden md:block">
                          <div className="text-sm font-medium">{step.title}</div>
                          <div className="text-xs opacity-80">
                            {step.description}
                          </div>
                        </div>
                      </div>
                      {index < experienceSteps.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mx-2 ${
                            index < activeStep ? "bg-white/30" : "bg-white/10"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step Content */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step 0: Basic Information */}
                    {activeStep === 0 && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div
                            className={`w-20 h-20 bg-gradient-to-br ${experienceSteps[activeStep].color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                          >
                            <Building className="h-10 w-10 text-white" />
                          </div>
                          <h4 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
                            Información de la empresa y tu rol
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Comparte los detalles básicos de esta experiencia
                            profesional
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                              <Building className="h-4 w-4" />
                              Empresa u organización
                            </Label>
                            <Input
                              placeholder="ej. Axity, Microsoft, Google"
                              value={currentExp.company}
                              onChange={(e) =>
                                setCurrentExp((prev) => ({
                                  ...prev,
                                  company: e.target.value,
                                }))
                              }
                              className="text-lg p-4 bg-blue-50 border-blue-200 focus:border-blue-400"
                            />
                          </div>

                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                              <User className="h-4 w-4" />
                              Tu cargo o posición
                            </Label>
                            <Input
                              placeholder="ej. Senior Developer, Tech Lead, Architect"
                              value={currentExp.position}
                              onChange={(e) =>
                                setCurrentExp((prev) => ({
                                  ...prev,
                                  position: e.target.value,
                                }))
                              }
                              className="text-lg p-4 bg-purple-50 border-purple-200 focus:border-purple-400"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                              <Calendar className="h-4 w-4" />
                              Fecha de inicio
                            </Label>
                            <Input
                              type="month"
                              value={currentExp.startDate}
                              onChange={(e) =>
                                setCurrentExp((prev) => ({
                                  ...prev,
                                  startDate: e.target.value,
                                }))
                              }
                              className="p-4 bg-orange-50 border-orange-200 focus:border-orange-400"
                            />
                          </div>

                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                              <Calendar className="h-4 w-4" />
                              Fecha de finalización
                            </Label>
                            <div className="space-y-3">
                              <Input
                                type="month"
                                value={currentExp.endDate}
                                onChange={(e) =>
                                  setCurrentExp((prev) => ({
                                    ...prev,
                                    endDate: e.target.value,
                                  }))
                                }
                                disabled={currentExp.current}
                                className="p-4 bg-green-50 border-green-200 focus:border-green-400 disabled:opacity-50"
                              />
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="current"
                                  checked={currentExp.current}
                                  onCheckedChange={(checked) =>
                                    setCurrentExp((prev) => ({
                                      ...prev,
                                      current: !!checked,
                                      endDate: checked ? "" : prev.endDate,
                                    }))
                                  }
                                />
                                <Label
                                  htmlFor="current"
                                  className="text-sm text-[var(--axity-gray)]"
                                >
                                  Trabajo actualmente aquí
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 1: Projects (placeholder de UI) */}
                    {activeStep === 1 && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div
                            className={`w-20 h-20 bg-gradient-to-br ${experienceSteps[activeStep].color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                          >
                            <Code2 className="h-10 w-10 text-white" />
                          </div>
                          <h4 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
                            Proyectos destacados
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Los proyectos son opcionales pero añaden valor a tu
                            experiencia
                          </p>
                        </div>

                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                          <Code2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">
                            No hay proyectos agregados aún
                          </p>
                          <div className="flex flex-col gap-3 items-center">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Tecnología (ej. React)"
                                value={newTechName}
                                onChange={(e) => setNewTechName(e.target.value)}
                                className="w-44"
                              />
                              <Input
                                placeholder="Versión (opcional)"
                                value={newTechVersion}
                                onChange={(e) =>
                                  setNewTechVersion(e.target.value)
                                }
                                className="w-44"
                              />
                              <Button
                                onClick={addTechnologyToCurrentProject}
                                variant="outline"
                              >
                                Añadir tecnología
                              </Button>
                            </div>
                            <Button
                              onClick={() =>
                                showContextualSuccess(
                                  "UI de proyectos pendiente — tecnologías añadidas al borrador del proyecto."
                                )
                              }
                              variant="outline"
                              className="border-[var(--axity-purple)] text-[var(--axity-purple)] hover:bg-[var(--axity-purple)] hover:text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar primer proyecto
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Challenges and Achievements */}
                    {activeStep === 2 && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div
                            className={`w-20 h-20 bg-gradient-to-br ${experienceSteps[activeStep].color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                          >
                            <Trophy className="h-10 w-10 text-white" />
                          </div>
                          <h4 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
                            Logros y desafíos superados
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Comparte el impacto que generaste y los retos que
                            enfrentaste
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                              <Target className="h-4 w-4" />
                              Principales desafíos resueltos
                            </Label>
                            <Textarea
                              placeholder="ej. Optimicé el rendimiento del sistema reduciendo los tiempos de carga en un 70%..."
                              value={currentExp.challenges}
                              onChange={(e) =>
                                setCurrentExp((prev) => ({
                                  ...prev,
                                  challenges: e.target.value,
                                }))
                              }
                              className="min-h-[120px] bg-red-50 border-red-200 focus:border-red-400 resize-none"
                            />
                          </div>

                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                              <Trophy className="h-4 w-4" />
                              Logros y reconocimientos
                            </Label>
                            <Textarea
                              placeholder="ej. Lideré un equipo de 5 desarrolladores en la implementación de microservicios..."
                              value={currentExp.achievements}
                              onChange={(e) =>
                                setCurrentExp((prev) => ({
                                  ...prev,
                                  achievements: e.target.value,
                                }))
                              }
                              className="min-h-[120px] bg-yellow-50 border-yellow-200 focus:border-yellow-400 resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    onClick={prevStep}
                    disabled={activeStep === 0}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Atrás
                  </Button>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--axity-gray)]">
                      Paso {activeStep + 1} de {experienceSteps.length}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {activeStep === experienceSteps.length - 1 ? (
                      <Button
                        onClick={addExperience}
                        disabled={!canProceedStep()}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Guardar experiencia
                      </Button>
                    ) : (
                      <Button
                        onClick={nextStep}
                        disabled={!canProceedStep()}
                        className="g-axity-gradient-primary text-white"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
