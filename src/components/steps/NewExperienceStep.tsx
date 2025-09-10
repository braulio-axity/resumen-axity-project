import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Plus,
  Building,
  User,
  Calendar,
  Target,
  Trophy,
  ArrowLeft,
  ArrowRight,
  X,
  Eye,
  Edit3,
  Sparkles,
  Code2,
  Trash2,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Rocket,
  CheckCircle,
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

export function NewExperienceStep({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  streakCounter,
  setStreakCounter,
}: ExperienceStepProps) {
  // evitar warning por prop no usada
  void streakCounter;

  const [showAddModal, setShowAddModal] = useState(false);
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

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newTechName, setNewTechName] = useState("");
  const [newTechVersion, setNewTechVersion] = useState("");

  const experienceSteps = [
    { id: 0, title: "Información básica", icon: Building, completed: false },
    { id: 1, title: "Proyectos", icon: Code2, completed: false },
    { id: 2, title: "Desafíos y logros", icon: Trophy, completed: false },
  ] as const;

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => {
      setContextualMessage(null);
    }, 3000);
  };

  const toggleExpanded = (index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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

  /* ====== Project helpers ====== */
  const addTechnologyToProject = () => {
    const name = newTechName.trim();
    if (!name) return;

    const newTech: ProjectTechnology = {
      name,
      version: newTechVersion.trim() || undefined,
    };

    setCurrentProject((prev) => ({
      ...prev,
      technologies: [...prev.technologies, newTech],
    }));

    setNewTechName("");
    setNewTechVersion("");
  };

  const removeTechnologyFromProject = (techIndex: number) => {
    setCurrentProject((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, index) => index !== techIndex),
    }));
  };

  const addProjectToExperience = () => {
    if (
      !currentProject.name.trim() ||
      !currentProject.description.trim() ||
      currentProject.technologies.length === 0
    ) {
      return;
    }

    setCurrentExp((prev) => ({
      ...prev,
      projects: [...prev.projects, currentProject],
    }));

    setCurrentProject({
      name: "",
      description: "",
      technologies: [],
    });

    setShowProjectForm(false);

    addMotivationalMessage(
      "experience",
      "¡Proyecto agregado con éxito! 🚀",
      `${currentProject.name} suma valor a tu experiencia`,
      "💻"
    );
  };

  const removeProjectFromExperience = (projectIndex: number) => {
    setCurrentExp((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, index) => index !== projectIndex),
    }));
  };

  const addExperience = () => {
    if (!currentExp.company || !currentExp.position) return;

    const experiences: Experience[] = Array.isArray(formData.experiences)
      ? (formData.experiences as Experience[])
      : [];
    updateFormData("experiences", [...experiences, currentExp]);

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

    setShowAddModal(false);
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

    const milestone = milestones[expCount];
    if (milestone) addProgress(15, milestone);

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
          currentExp.company.trim() &&
          currentExp.position.trim() &&
          currentExp.startDate
        );
      case 1:
        return true; // opcional
      case 2:
        return true; // opcional
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
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--axity-purple)] via-[var(--axity-violet)] to-[var(--axity-orange)]"></div>

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
                              {exp.startDate} - {exp.current ? "Presente" : exp.endDate}
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
                                          <Rocket className="h-4 w-4 text-white" />
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
                                          (
                                            tech: ProjectTechnology,
                                            techIndex: number
                                          ) => (
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
                                  <p className="text-sm text-gray-700">{exp.challenges}</p>
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
      <div className="text-center py-8">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => setShowAddModal(true)}
            size="lg"
            className="ax-btn-primary bg-axity-gradient-accent text-white shadow-xl px-8 py-4"
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

      {/* Add Experience Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      {(() => {
                        const StepIcon = experienceSteps[activeStep].icon;
                        return <StepIcon className="h-6 w-6" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        Nueva experiencia profesional
                      </h3>
                      <p className="text-white/80">
                        {experienceSteps[activeStep].title}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setShowAddModal(false);
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
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Step Progress */}
                <div className="flex items-center gap-4">
                  {experienceSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
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
                      <span
                        className={`text-sm ${
                          index === activeStep
                            ? "text-white font-medium"
                            : "text-white/70"
                        }`}
                      >
                        {step.title}
                      </span>
                      {index < experienceSteps.length - 1 && (
                        <div
                          className={`w-8 h-0.5 mx-2 ${
                            index < activeStep ? "bg-white/30" : "bg-white/10"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[60vh]">
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
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                              className="p-4 bg-orange-50 border-orange-200 focus:border-orange-400"
                            />
                            <div className="flex items-center gap-2 mt-3">
                              <input
                                type="checkbox"
                                id="current-position"
                                checked={currentExp.current}
                                onChange={(e) =>
                                  setCurrentExp((prev) => ({
                                    ...prev,
                                    current: e.target.checked,
                                  }))
                                }
                                className="rounded border-gray-300"
                              />
                              <Label
                                htmlFor="current-position"
                                className="text-sm text-[var(--axity-gray)]"
                              >
                                Trabajo actualmente aquí 💼
                              </Label>
                            </div>
                          </div>
                        </div>

                        {/* Duration Display */}
                        {currentExp.startDate && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
                          >
                            <div className="flex items-center gap-2 text-[var(--axity-purple)]">
                              <Clock className="h-5 w-5" />
                              <span className="font-medium">
                                Duración:{" "}
                                {getDuration(
                                  currentExp.startDate,
                                  currentExp.endDate,
                                  currentExp.current
                                )}
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Step 1: Projects */}
                    {activeStep === 1 && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Code2 className="h-10 w-10 text-white" />
                          </div>
                          <h4 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
                            Proyectos desarrollados
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Documenta los proyectos específicos en los que
                            participaste
                          </p>
                        </div>

                        {/* Existing Projects */}
                        {currentExp.projects.length > 0 && (
                          <div className="space-y-4">
                            <h5 className="font-bold text-[var(--axity-purple)] flex items-center gap-2">
                              <Rocket className="h-5 w-5" />
                              Proyectos agregados ({currentExp.projects.length})
                            </h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {currentExp.projects.map(
                                (project: Project, index: number) => (
                                  <motion.div
                                    key={`${project.name}-${index}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <h6 className="font-bold text-[var(--axity-purple)]">
                                        {project.name}
                                      </h6>
                                      <Button
                                        onClick={() =>
                                          removeProjectFromExperience(index)
                                        }
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                      {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {project.technologies.map(
                                        (
                                          tech: ProjectTechnology,
                                          techIndex: number
                                        ) => (
                                          <Badge
                                            key={`${tech.name}-${techIndex}`}
                                            className="text-xs bg-blue-100 text-blue-800 border-blue-200"
                                          >
                                            {tech.name}
                                            {tech.version
                                              ? ` v${tech.version}`
                                              : ""}
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

                        {/* Add Project Form */}
                        {!showProjectForm ? (
                          <div className="text-center">
                            <Button
                              onClick={() => setShowProjectForm(true)}
                              variant="outline"
                              className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar proyecto
                            </Button>
                            <p className="text-xs text-[var(--axity-gray)] mt-2">
                              Los proyectos ayudan a detallar tu experiencia técnica
                            </p>
                          </div>
                        ) : (
                          <Card className="border-green-200 bg-green-50/50">
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Lightbulb className="h-5 w-5 text-green-600" />
                                  <h5 className="font-bold text-[var(--axity-purple)]">
                                    Nuevo proyecto
                                  </h5>
                                </div>
                                <Button
                                  onClick={() => {
                                    setShowProjectForm(false);
                                    setCurrentProject({
                                      name: "",
                                      description: "",
                                      technologies: [],
                                    });
                                  }}
                                  size="sm"
                                  variant="ghost"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                              <div>
                                <Label className="text-[var(--axity-purple)] font-medium mb-2 block">
                                  Nombre del proyecto
                                </Label>
                                <Input
                                  placeholder="ej. Sistema de gestión de inventarios"
                                  value={currentProject.name}
                                  onChange={(e) =>
                                    setCurrentProject((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                  className="bg-white border-green-200 focus:border-green-400"
                                />
                              </div>

                              <div>
                                <Label className="text-[var(--axity-purple)] font-medium mb-2 block">
                                  Tu participación y responsabilidades
                                </Label>
                                <Textarea
                                  placeholder="Describe qué hiciste en este proyecto, tu rol, responsabilidades principales..."
                                  value={currentProject.description}
                                  onChange={(e) =>
                                    setCurrentProject((prev) => ({
                                      ...prev,
                                      description: e.target.value,
                                    }))
                                  }
                                  rows={4}
                                  className="bg-white border-green-200 focus:border-green-400 resize-none"
                                />
                              </div>

                              <div>
                                <Label className="text-[var(--axity-purple)] font-medium mb-2 block">
                                  Tecnologías utilizadas <span className="text-red-500">*</span>
                                </Label>

                                {currentProject.technologies.length > 0 && (
                                  <div className="mb-4 flex flex-wrap gap-2">
                                    {currentProject.technologies.map(
                                      (tech: ProjectTechnology, index: number) => (
                                        <Badge
                                          key={`${tech.name}-${index}`}
                                          className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1"
                                        >
                                          {tech.name}
                                          {tech.version ? ` v${tech.version}` : ""}
                                          <Button
                                            onClick={() =>
                                              removeTechnologyFromProject(index)
                                            }
                                            size="sm"
                                            variant="ghost"
                                            className="h-4 w-4 p-0 text-blue-600 hover:text-red-600"
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                )}

                                <div className="grid grid-cols-3 gap-2">
                                  <div className="col-span-2">
                                    <Input
                                      placeholder="ej. React, Node.js, PostgreSQL"
                                      value={newTechName}
                                      onChange={(e) => setNewTechName(e.target.value)}
                                      onKeyDown={(e) =>
                                        e.key === "Enter" && addTechnologyToProject()
                                      }
                                      className="bg-white border-green-200 focus:border-green-400"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Versión"
                                      value={newTechVersion}
                                      onChange={(e) =>
                                        setNewTechVersion(e.target.value)
                                      }
                                      onKeyDown={(e) =>
                                        e.key === "Enter" && addTechnologyToProject()
                                      }
                                      className="bg-white border-green-200 focus:border-green-400"
                                    />
                                    <Button
                                      onClick={addTechnologyToProject}
                                      disabled={!newTechName.trim()}
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 pt-4 border-t border-green-200">
                                <Button
                                  onClick={() => {
                                    setShowProjectForm(false);
                                    setCurrentProject({
                                      name: "",
                                      description: "",
                                      technologies: [],
                                    });
                                  }}
                                  variant="outline"
                                  size="sm"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={addProjectToExperience}
                                  disabled={
                                    !currentProject.name.trim() ||
                                    !currentProject.description.trim() ||
                                    currentProject.technologies.length === 0
                                  }
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Sparkles className="h-4 w-4 mr-1" />
                                  Agregar proyecto
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {/* Step 2: Challenges and Achievements */}
                    {activeStep === 2 && (
                      <div className="space-y-8">
                        <div className="text-center mb-8">
                          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trophy className="h-10 w-10 text-white" />
                          </div>
                          <h4 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
                            Desafíos y logros
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Comparte los retos que superaste y los resultados que
                            lograste
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-4">
                              <Target className="h-5 w-5" />
                              Desafíos técnicos resueltos
                            </Label>
                            <Textarea
                              placeholder="Describe los problemas complejos que abordaste, soluciones implementadas, arquitecturas diseñadas..."
                              value={currentExp.challenges}
                              onChange={(e) =>
                                setCurrentExp((prev) => ({
                                  ...prev,
                                  challenges: e.target.value,
                                }))
                              }
                              rows={8}
                              className="bg-red-50 border-red-200 focus:border-red-400 resize-none"
                            />
                            <p className="text-xs text-[var(--axity-gray)] mt-2">
                              Opcional: Ayuda a destacar tu capacidad de resolución
                            </p>
                          </div>

                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-4">
                              <Trophy className="h-5 w-5" />
                              Resultados y logros obtenidos
                            </Label>
                            <Textarea
                              placeholder="Resultados medibles: mejoras de rendimiento, reducción de costos, proyectos entregados a tiempo..."
                              value={currentExp.achievements}
                              onChange={(e) =>
                                setCurrentExp((prev) => ({
                                  ...prev,
                                  achievements: e.target.value,
                                }))
                              }
                              rows={8}
                              className="bg-yellow-50 border-yellow-200 focus:border-yellow-400 resize-none"
                            />
                            <p className="text-xs text-[var(--axity-gray)] mt-2">
                              Opcional: Cuantifica tu impacto cuando sea posible
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Modal Footer */}
              <div className="border-t bg-gray-50 p-6 flex justify-between items-center">
                <Button
                  onClick={activeStep === 0 ? () => setShowAddModal(false) : prevStep}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {activeStep === 0 ? "Cancelar" : "Anterior"}
                </Button>

                <div className="flex items-center gap-4">
                  {/* Step Indicator */}
                  <div className="flex items-center gap-2">
                    {experienceSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === activeStep
                            ? "bg-[var(--axity-purple)] w-6"
                            : index < activeStep
                            ? "bg-[var(--axity-mint)]"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {activeStep === experienceSteps.length - 1 ? (
                    <Button
                      onClick={addExperience}
                      disabled={!canProceedStep()}
                      className="bg-axity-gradient-accent text-white px-6 flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Guardar experiencia
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceedStep()}
                      className="bg-[var(--axity-purple)] hover:bg-[var(--axity-violet)] text-white px-6 flex items-center gap-2"
                    >
                      Continuar
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
