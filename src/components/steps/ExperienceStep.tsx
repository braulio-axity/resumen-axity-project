import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Plus,
  Star,
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
  Briefcase,
  Code2,
  Trash2,
} from "lucide-react";

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

export function ExperienceStep({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  streakCounter,
  setStreakCounter,
}: ExperienceStepProps) {
  // Evita warning por prop no usada (la prop se conserva por compatibilidad)
  void streakCounter;

  const [showStoryBuilder, setShowStoryBuilder] = useState(false);
  const [storyStep, setStoryStep] = useState(0);

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
  const [contextualMessage, setContextualMessage] = useState<string | null>(
    null
  );

  // Mensajes dinámicos para experiencias
  const experienceMessages: string[] = [
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

  const storySteps = [
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
      title: "Proyectos desarrollados",
      subtitle: "¿Qué proyectos realizaste?",
      icon: Code2,
      color: "from-green-500 to-teal-500",
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
  ] as const;

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => setContextualMessage(null), 3000);
  };

  const addExperience = () => {
    if (currentExp.company && currentExp.position) {
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
      setShowStoryBuilder(false);
      setStoryStep(0);
      addProgress(10);

      // Update streak counter
      setStreakCounter((prev: any) => ({
        ...prev,
        experiences: (prev?.experiences ?? 0) + 1,
      }));

      // Mensajes especiales por hitos de experiencia
      const experienceMilestones: Partial<Record<number, string[]>> = {
        1: [
          "¡Tu historia profesional inicia! 📖",
          "¡Primer capítulo documentado! 📝",
          "¡Journey profesional activado! 🛤️",
        ],
        3: [
          "¡Trayectoria sólida construida! 🏗️",
          "¡Experiencia diversa comprobada! 🌟",
          "¡Tu perfil gana profundidad! 📊",
        ],
        5: [
          "¡Portfolio de experiencias épico! 🎯",
          "¡Background profesional envidiable! 👑",
          "¡Eres un consultor experimentado! 🧠",
        ],
      };

      const expCount = experiences.length + 1;
      const milestoneOptions = experienceMilestones[expCount];
      if (milestoneOptions && milestoneOptions.length) {
        const randomMilestone =
          milestoneOptions[Math.floor(Math.random() * milestoneOptions.length)];
        addProgress(10, randomMilestone);
      }

      const randomMessage =
        experienceMessages[Math.floor(Math.random() * experienceMessages.length)];

      addMotivationalMessage(
        "experience",
        randomMessage,
        `${currentExp.position} en ${currentExp.company} ahora es parte de tu trayectoria`,
        "💼",
        `${currentExp.startDate} - ${
          currentExp.current ? "Presente" : currentExp.endDate
        }`
      );

      showContextualSuccess(
        `🎯 Experiencia en ${currentExp.company} documentada exitosamente!`
      );
    }
  };

  const nextStoryStep = () => {
    if (storyStep < storySteps.length - 1) setStoryStep((prev) => prev + 1);
  };
  const prevStoryStep = () => {
    if (storyStep > 0) setStoryStep((prev) => prev - 1);
  };

  const canProceedStory = () => {
    switch (storyStep) {
      case 0:
        return currentExp.company.trim() !== "";
      case 1:
        return currentExp.position.trim() !== "";
      case 2:
        return currentExp.startDate !== "";
      case 3:
        return true; // proyectos opcionales
      case 4:
        return true; // challenges opcional
      case 5:
        return true; // achievements opcional
      default:
        return false;
    }
  };

  const resetStoryBuilder = () => {
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
    setShowProjectForm(false);
    setStoryStep(0);
    setShowStoryBuilder(false);
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
      "¡Proyecto agregado exitosamente! 🚀",
      `${currentProject.name} es parte de tu experiencia profesional`,
      "💻",
      `Tecnologías: ${currentProject.technologies.map((t) => t.name).join(", ")}`
    );
  };

  const removeProjectFromExperience = (projectIndex: number) => {
    setCurrentExp((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, index) => index !== projectIndex),
    }));
  };

  /* ====== Lista tipada para render ====== */
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
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 shadow-lg border border-orange-200"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-2xl"
              >
                💼
              </motion.div>
              <p className="font-medium">{contextualMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motivational Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
          Tu experiencia profesional 📂
        </h3>
        <p className="text-[var(--axity-gray)]">
          Documenta tu trayectoria y logros más significativos
        </p>
      </div>

      {/* Experience Gallery */}
      {experiencesList.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-[var(--axity-purple)] mb-6 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Tu historial profesional ({experiencesList.length})
          </h4>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {experiencesList.map((exp: Experience, index: number) => (
              <motion.div
                key={`${exp.company}-${exp.position}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden"
              >
                <Card className="bg-gradient-to-br from-white to-orange-50 border border-orange-200 shadow-md hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Header with Company */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h5 className="font-bold text-[var(--axity-purple)] text-lg">
                            {exp.position}
                          </h5>
                          <p className="text-orange-600 font-medium">
                            {exp.company}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {exp.startDate} -{" "}
                              {exp.current ? "Presente" : exp.endDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      {exp.current && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Badge className="bg-green-100 text-green-800 border-green-200 shadow-sm">
                            🔥 Actual
                          </Badge>
                        </motion.div>
                      )}
                    </div>

                    {/* Projects Preview */}
                    {exp.projects && exp.projects.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Code2 className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-[var(--axity-purple)] text-sm">
                            Proyectos ({exp.projects.length}):
                          </span>
                        </div>
                        <div className="space-y-2">
                          {exp.projects.slice(0, 2).map(
                            (project: Project, projectIndex: number) => (
                              <div
                                key={`${project.name}-${projectIndex}`}
                                className="bg-green-50 p-2 rounded-lg border border-green-100"
                              >
                                <div className="font-medium text-sm text-[var(--axity-purple)]">
                                  {project.name}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.technologies
                                    .slice(0, 3)
                                    .map(
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
                                  {project.technologies.length > 3 && (
                                    <Badge className="text-xs bg-gray-100 text-gray-600">
                                      +{project.technologies.length - 3} más
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                          {exp.projects.length > 2 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{exp.projects.length - 2} proyectos más
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Story Preview */}
                    <div className="space-y-4">
                      {exp.challenges && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-[var(--axity-purple)] text-sm">
                              Desafíos resueltos:
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm bg-orange-50 p-3 rounded-lg border border-orange-100 line-clamp-3">
                            {exp.challenges}
                          </p>
                        </div>
                      )}

                      {exp.achievements && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium text-[var(--axity-purple)] text-sm">
                              Resultados obtenidos:
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-100 line-clamp-3">
                            {exp.achievements}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm shadow-lg"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-white/90 backdrop-blur-sm shadow-lg"
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add Experience Button */}
      {!showStoryBuilder && (
        <div className="text-center py-12">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => setShowStoryBuilder(true)}
              size="lg"
              className="bg-axity-gradient-accent text-white shadow-xl px-8 py-4"
            >
              <Plus className="h-6 w-6 mr-3" />
              Agregar experiencia profesional 📂
            </Button>
          </motion.div>
          <p className="text-sm text-[var(--axity-gray)] mt-4">
            Documenta tu trayectoria técnica paso a paso
          </p>
        </div>
      )}

      {/* Story Builder Modal */}
      <AnimatePresence>
        {showStoryBuilder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div
                className={`bg-gradient-to-r ${storySteps[storyStep].color} text-white p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const StepIcon = storySteps[storyStep].icon;
                      return <StepIcon className="h-8 w-8" />;
                    })()}
                    <div>
                      <h3 className="text-2xl font-bold">
                        {storySteps[storyStep].title}
                      </h3>
                      <p className="text-white/80">
                        {storySteps[storyStep].subtitle}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={resetStoryBuilder}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Story Progress */}
                <div className="flex items-center gap-2">
                  <span className="text-white/80 text-sm">
                    Paso {storyStep + 1} de {storySteps.length}
                  </span>
                  <div className="flex-1 bg-white/20 rounded-full h-2">
                    <motion.div
                      className="bg-white rounded-full h-2"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${((storyStep + 1) / storySteps.length) * 100}%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={storyStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Step 0: Company */}
                    {storyStep === 0 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <Building className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-[var(--axity-purple)] mb-2">
                            ¿En qué empresa trabajaste? 🏢
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Comparte el nombre de la organización donde
                            desarrollaste esta experiencia
                          </p>
                        </div>

                        <div>
                          <Input
                            placeholder="Nombre de la empresa"
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
                      </div>
                    )}

                    {/* Step 1: Position */}
                    {storyStep === 1 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <User className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-[var(--axity-purple)] mb-2">
                            ¿Cuál fue tu rol en el equipo? 👨‍💻
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Define tu posición y responsabilidades principales
                          </p>
                        </div>

                        <div>
                          <Input
                            placeholder="Tu cargo o posición"
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
                    )}

                    {/* Step 2: Timeline */}
                    {storyStep === 2 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <Calendar className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-[var(--axity-purple)] mb-2">
                            ¿Cuándo desarrollaste esta experiencia? 📅
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Define las fechas de inicio y finalización de tu
                            participación
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium">
                              Fecha de inicio 📅
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
                              className="mt-2 bg-orange-50 border-orange-200"
                            />
                          </div>

                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium">
                              Fecha de finalización (si aplica) 🏁
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
                              className="mt-2 bg-orange-50 border-orange-200"
                            />
                            <div className="flex items-center space-x-2 mt-3">
                              <input
                                type="checkbox"
                                id="current-story"
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
                                htmlFor="current-story"
                                className="text-sm font-normal"
                              >
                                Trabajo actualmente aquí 💼
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Projects */}
                    {storyStep === 3 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <Code2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-[var(--axity-purple)] mb-2">
                            ¿Qué proyectos desarrollaste? 💻
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Documenta los proyectos específicos en los que
                            participaste y las tecnologías que utilizaste
                          </p>
                        </div>

                        {/* Existing Projects */}
                        {currentExp.projects && currentExp.projects.length > 0 && (
                          <div className="space-y-4 mb-6">
                            <h5 className="font-medium text-[var(--axity-purple)] flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              Proyectos agregados ({currentExp.projects.length})
                            </h5>
                            {currentExp.projects.map(
                              (project: Project, index: number) => (
                                <div
                                  key={`${project.name}-${index}`}
                                  className="bg-green-50 border border-green-200 rounded-lg p-4"
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
                                  <p className="text-sm text-gray-700 mb-3">
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
                                          className="bg-green-100 text-green-800 border-green-200"
                                        >
                                          {tech.name}
                                          {tech.version
                                            ? ` v${tech.version}`
                                            : ""}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              )
                            )}
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
                            <p className="text-xs text-gray-500 mt-2">
                              Opcional: Los proyectos ayudan a detallar tu
                              experiencia técnica
                            </p>
                          </div>
                        ) : (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="font-medium text-[var(--axity-purple)]">
                                Nuevo proyecto
                              </h5>
                              <Button
                                onClick={() => {
                                  setShowProjectForm(false);
                                  setCurrentProject({
                                    name: "",
                                    description: "",
                                    technologies: [],
                                  });
                                  setNewTechName("");
                                  setNewTechVersion("");
                                }}
                                size="sm"
                                variant="ghost"
                                className="text-gray-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            <div>
                              <Label className="text-[var(--axity-purple)] font-medium">
                                Nombre del proyecto 📝
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
                                className="mt-2 bg-white border-green-200 focus:border-green-400"
                              />
                            </div>

                            <div>
                              <Label className="text-[var(--axity-purple)] font-medium">
                                Descripción de tu participación 📋
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
                                className="mt-2 bg-white border-green-200 focus:border-green-400 resize-none"
                              />
                            </div>

                            <div>
                              <Label className="text-[var(--axity-purple)] font-medium">
                                Tecnologías utilizadas 🔧{" "}
                                <span className="text-red-500">*</span>
                              </Label>

                              {/* Technologies List */}
                              {currentProject.technologies.length > 0 && (
                                <div className="mt-2 mb-4 flex flex-wrap gap-2">
                                  {currentProject.technologies.map(
                                    (
                                      tech: ProjectTechnology,
                                      index: number
                                    ) => (
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

                              {/* Add Technology Form */}
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <Input
                                  placeholder="ej. React, Node.js, MySQL"
                                  value={newTechName}
                                  onChange={(e) => setNewTechName(e.target.value)}
                                  onKeyDown={(e) =>
                                    e.key === "Enter" && addTechnologyToProject()
                                  }
                                  className="bg-white border-green-200 focus:border-green-400"
                                />
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="Versión (opcional)"
                                    value={newTechVersion}
                                    onChange={(e) =>
                                      setNewTechVersion(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                      e.key === "Enter" &&
                                      addTechnologyToProject()
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
                              <p className="text-xs text-gray-500 mt-1">
                                Las tecnologías son obligatorias. Agrega al menos
                                una.
                              </p>
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
                                  setNewTechName("");
                                  setNewTechVersion("");
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
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 4: Challenges */}
                    {storyStep === 4 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <Target className="h-16 w-16 text-red-500 mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-[var(--axity-purple)] mb-2">
                            ¿Qué desafíos técnicos resolviste? 🎯
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Describe los problemas complejos que abordaste y las
                            soluciones que implementaste
                          </p>
                        </div>

                        <div>
                          <Textarea
                            placeholder="Describe los desafíos técnicos, problemas de rendimiento, arquitectura, integración de sistemas, metodologías implementadas..."
                            value={currentExp.challenges}
                            onChange={(e) =>
                              setCurrentExp((prev) => ({
                                ...prev,
                                challenges: e.target.value,
                              }))
                            }
                            rows={6}
                            className="text-base p-4 bg-red-50 border-red-200 focus:border-red-400 resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Opcional: Puedes continuar sin llenar este campo
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Achievements */}
                    {storyStep === 5 && (
                      <div className="space-y-6">
                        <div className="text-center mb-8">
                          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                          <h4 className="text-xl font-bold text-[var(--axity-purple)] mb-2">
                            ¿Cuáles fueron tus principales logros? 🏆
                          </h4>
                          <p className="text-[var(--axity-gray)]">
                            Comparte los resultados medibles y el impacto de tu
                            trabajo
                          </p>
                        </div>

                        <div>
                          <Textarea
                            placeholder="Resultados medibles: mejoras de rendimiento, reducción de costos, proyectos entregados a tiempo, equipos coordinados, usuarios impactados..."
                            value={currentExp.achievements}
                            onChange={(e) =>
                              setCurrentExp((prev) => ({
                                ...prev,
                                achievements: e.target.value,
                              }))
                            }
                            rows={6}
                            className="text-base p-4 bg-yellow-50 border-yellow-200 focus:border-yellow-400 resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Opcional: Puedes continuar sin llenar este campo
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Preview Panel - Solo mostrar cuando hay algo que mostrar */}
              {(currentExp.company || currentExp.position) && (
                <div className="border-t bg-gray-50 p-4">
                  <h5 className="font-medium text-[var(--axity-purple)] mb-3 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Vista previa de tu experiencia:
                  </h5>
                  <div className="bg-white rounded-lg p-4 border">
                    <div className="text-sm space-y-2">
                      {currentExp.position && (
                        <div className="font-bold text-[var(--axity-purple)]">
                          {currentExp.position}
                        </div>
                      )}
                      {currentExp.company && (
                        <div className="text-orange-600 font-medium">
                          {currentExp.company}
                        </div>
                      )}
                      {currentExp.startDate && (
                        <div className="text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {currentExp.startDate} -{" "}
                          {currentExp.current
                            ? "Presente"
                            : currentExp.endDate || "..."}
                        </div>
                      )}
                      {currentExp.projects && currentExp.projects.length > 0 && (
                        <div className="text-green-600 flex items-center gap-1">
                          <Code2 className="h-3 w-3" />
                          {currentExp.projects.length} proyecto
                          {currentExp.projects.length !== 1 ? "s" : ""} agregado
                          {currentExp.projects.length !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="border-t bg-white p-6 flex justify-between">
                <Button
                  onClick={storyStep === 0 ? resetStoryBuilder : prevStoryStep}
                  variant="outline"
                  className="bg-white border-gray-300 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {storyStep === 0 ? "Cancelar" : "Anterior"}
                </Button>

                {storyStep === storySteps.length - 1 ? (
                  <Button
                    onClick={addExperience}
                    disabled={!currentExp.company || !currentExp.position}
                    className="bg-axity-gradient-accent text-white px-6"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Guardar experiencia 📂
                  </Button>
                ) : (
                  <Button
                    onClick={nextStoryStep}
                    disabled={!canProceedStory()}
                    className={`bg-gradient-to-r ${storySteps[storyStep].color} text-white px-6`}
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {experiencesList.length === 0 && !showStoryBuilder && (
        <div className="text-center py-16">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Briefcase className="h-20 w-20 text-gray-400 mx-auto mb-6" />
          </motion.div>
          <h4 className="text-xl font-bold text-[var(--axity-purple)] mb-3">
            ¡Documenta tu trayectoria profesional! 📂
          </h4>
          <p className="text-[var(--axity-gray)] mb-2">
            Cada experiencia laboral cuenta una historia de crecimiento técnico
          </p>
          <p className="text-sm text-gray-500">
            Agrega al menos una experiencia para continuar
          </p>
        </div>
      )}
    </div>
  );
}
