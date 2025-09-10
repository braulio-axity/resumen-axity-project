import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardHeader } from "../ui/card";
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
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  X,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

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
  streakCounter: any; // se acepta, pero NO lo desestructuramos si no se usa
  setStreakCounter: (fn: (prev: any) => any) => void;
}

interface ProjectTech {
  name: string;
  version?: string;
}

interface Project {
  name: string;
  description: string;
  technologies: ProjectTech[];
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

export function CarouselExperience({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  // streakCounter  // <- no lo usamos; evitar warning por variable no leída
  setStreakCounter,
}: ExperienceStepProps) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState(0);
  const [contextualMessage, setContextualMessage] = useState<string | null>(null);

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

  // tipamos la lista de experiencias para evitar "any" en map
  const experiences: Experience[] = Array.isArray(formData?.experiences)
    ? (formData.experiences as Experience[])
    : [];

  const experienceSteps = [
    {
      id: 0,
      title: "Información básica",
      icon: Building,
      subtitle: "Empresa, cargo y fechas de trabajo",
      color: "from-blue-400 to-purple-500",
      bgColor: "from-blue-50 to-purple-50",
    },
    {
      id: 1,
      title: "Proyectos destacados",
      icon: Code2,
      subtitle: "Proyectos importantes y tecnologías",
      color: "from-green-400 to-blue-500",
      bgColor: "from-green-50 to-blue-50",
    },
    {
      id: 2,
      title: "Logros y desafíos",
      icon: Trophy,
      subtitle: "Impacto generado y retos superados",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
    },
  ] as const;

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => setContextualMessage(null), 3000);
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

  const addExperience = () => {
    if (!currentExp.company || !currentExp.position) return;

    const currentList: Experience[] = experiences;
    updateFormData("experiences", [...currentList, currentExp]);

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

    setShowCarousel(false);
    setActiveStep(0);
    addProgress(20);

    setStreakCounter((prev) => ({ ...prev, experiences: prev.experiences + 1 }));

    const expCount = currentList.length + 1;
    const milestones: Record<number, string> = {
      1: "¡Primera experiencia documentada! 📖",
      3: "¡Trayectoria sólida construida! 🏗️",
      5: "¡Portfolio profesional épico! 🎯",
    };

    if (milestones[expCount]) {
      addProgress(15, milestones[expCount]);
    }

    addMotivationalMessage(
      "experience",
      "¡Experiencia agregada exitosamente! 🎉",
      `${currentExp.position} en ${currentExp.company} ahora es parte de tu trayectoria`,
      "💼"
    );

    showContextualSuccess(`🎯 Tu experiencia en ${currentExp.company} ha sido documentada!`);
  };

  const canProceedStep = (): boolean => {
    switch (activeStep) {
      case 0:
        return Boolean(
          currentExp.company.trim() && currentExp.position.trim() && currentExp.startDate
        );
      case 1:
        return true; // proyectos son opcionales
      case 2:
        return true; // desafíos y logros son opcionales
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
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

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
        {experiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-full border border-purple-200"
          >
            <Award className="h-4 w-4 text-[var(--axity-purple)]" />
            <span className="text-sm font-medium text-[var(--axity-purple)]">
              {experiences.length} experiencia{experiences.length !== 1 ? "s" : ""} documentada
              {experiences.length !== 1 ? "s" : ""}
            </span>
          </motion.div>
        )}
      </div>

      {/* Timeline de Experiencias */}
      {experiences.length > 0 && (
        <div className="space-y-6">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--axity-purple)] via-[var(--axity-violet)] to-[var(--axity-orange)]"></div>

            {experiences.map((exp: Experience, index: number) => (
              <motion.div
                key={index}
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
                            <p className="text-[var(--axity-orange)] font-medium">{exp.company}</p>
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
                            <span>{getDuration(exp.startDate, exp.endDate, exp.current)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {exp.current && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <PlayCircle className="h-3 w-3 mr-1" />
                            Actual
                          </Badge>
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
            onClick={() => setShowCarousel(true)}
            size="lg"
            className="ax-btn-primary bg-axity-gradient-accent text-white shadow-xl px-8 py-4"
          >
            <Plus className="h-6 w-6 mr-3" />
            {experiences.length > 0
              ? "Agregar nueva experiencia"
              : "Documentar mi primera experiencia"}{" "}
            ✨
          </Button>
        </motion.div>
        <p className="text-sm text-[var(--axity-gray)] mt-4">
          Experiencia deslizable paso a paso 👆
        </p>
      </div>

      {/* CAROUSEL MODAL */}
      <AnimatePresence>
        {showCarousel && (
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
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
            >
              {/* Carousel Header */}
              <div className="bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">Nueva experiencia profesional</h3>
                    <p className="text-white/80 text-sm">Desliza para navegar entre pasos</p>
                  </div>
                  <Button
                    onClick={() => {
                      setShowCarousel(false);
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

                {/* Step Dots */}
                <div className="flex items-center justify-center gap-2">
                  {experienceSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveStep(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === activeStep
                          ? "bg-white scale-125"
                          : index < activeStep
                          ? "bg-white/60"
                          : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Carousel Content */}
              <div className="relative h-[500px] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 bg-gradient-to-br ${experienceSteps[activeStep].bgColor} p-8`}
                  >
                    {/* Step Content */}
                    <div className="h-full flex flex-col">
                      {/* Step Header */}
                      <div className="text-center mb-6">
                        <div
                          className={`w-20 h-20 bg-gradient-to-br ${experienceSteps[activeStep].color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        >
                          {(() => {
                            const StepIcon = experienceSteps[activeStep].icon;
                            return <StepIcon className="h-10 w-10 text-white" />;
                          })()}
                        </div>
                        <h4 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
                          {experienceSteps[activeStep].title}
                        </h4>
                        <p className="text-[var(--axity-gray)]">
                          {experienceSteps[activeStep].subtitle}
                        </p>
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 overflow-y-auto">
                        {/* Step 0: Basic Information */}
                        {activeStep === 0 && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                              <div>
                                <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                                  <Building className="h-4 w-4" />
                                  Empresa u organización
                                </Label>
                                <Input
                                  placeholder="ej. Axity, Microsoft, Google"
                                  value={currentExp.company}
                                  onChange={(e) =>
                                    setCurrentExp((prev) => ({ ...prev, company: e.target.value }))
                                  }
                                  className="text-lg p-4 bg-white/80 border-blue-200 focus:border-blue-400"
                                />
                              </div>

                              <div>
                                <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                                  <User className="h-4 w-4" />
                                  Tu cargo o posición
                                </Label>
                                <Input
                                  placeholder="ej. Senior Developer, Tech Lead"
                                  value={currentExp.position}
                                  onChange={(e) =>
                                    setCurrentExp((prev) => ({ ...prev, position: e.target.value }))
                                  }
                                  className="text-lg p-4 bg-white/80 border-purple-200 focus:border-purple-400"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                                    <Calendar className="h-4 w-4" />
                                    Fecha inicio
                                  </Label>
                                  <Input
                                    type="month"
                                    value={currentExp.startDate}
                                    onChange={(e) =>
                                      setCurrentExp((prev) => ({ ...prev, startDate: e.target.value }))
                                    }
                                    className="bg-white/80 border-orange-200 focus:border-orange-400"
                                  />
                                </div>

                                <div>
                                  <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                                    <Calendar className="h-4 w-4" />
                                    Fecha fin
                                  </Label>
                                  <div className="space-y-2">
                                    <Input
                                      type="month"
                                      value={currentExp.endDate}
                                      onChange={(e) =>
                                        setCurrentExp((prev) => ({ ...prev, endDate: e.target.value }))
                                      }
                                      disabled={currentExp.current}
                                      className="bg-white/80 border-green-200 focus:border-green-400 disabled:opacity-50"
                                    />
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="current-carousel"
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
                                        htmlFor="current-carousel"
                                        className="text-sm text-[var(--axity-gray)]"
                                      >
                                        Trabajo actual
                                      </Label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 1: Projects (placeholder) */}
                        {activeStep === 1 && (
                          <div className="space-y-6">
                            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-white/50">
                              <Code2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                              <h5 className="text-lg font-medium text-gray-600 mb-2">
                                Proyectos destacados
                              </h5>
                              <p className="text-gray-500 mb-4 text-sm">
                                Los proyectos son opcionales
                              </p>
                              <p className="text-xs text-gray-400">
                                Puedes agregarlos más tarde si lo deseas
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Achievements */}
                        {activeStep === 2 && (
                          <div className="space-y-6">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                                  <Target className="h-4 w-4" />
                                  Desafíos resueltos
                                </Label>
                                <Textarea
                                  placeholder="ej. Optimicé el rendimiento del sistema reduciendo los tiempos de carga..."
                                  value={currentExp.challenges}
                                  onChange={(e) =>
                                    setCurrentExp((prev) => ({ ...prev, challenges: e.target.value }))
                                  }
                                  className="min-h-[80px] bg-white/80 border-red-200 focus:border-red-400 resize-none"
                                />
                              </div>

                              <div>
                                <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-3">
                                  <Trophy className="h-4 w-4" />
                                  Logros obtenidos
                                </Label>
                                <Textarea
                                  placeholder="ej. Lideré un equipo de 5 desarrolladores..."
                                  value={currentExp.achievements}
                                  onChange={(e) =>
                                    setCurrentExp((prev) => ({
                                      ...prev,
                                      achievements: e.target.value,
                                    }))
                                  }
                                  className="min-h-[80px] bg-white/80 border-yellow-200 focus:border-yellow-400 resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevStep}
                  disabled={activeStep === 0}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
                    activeStep === 0 ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
                  }`}
                >
                  <ArrowLeft className="h-5 w-5 text-[var(--axity-purple)]" />
                </button>

                <button
                  onClick={activeStep === experienceSteps.length - 1 ? addExperience : nextStep}
                  disabled={!canProceedStep()}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] shadow-lg flex items-center justify-center transition-all ${
                    !canProceedStep() ? "opacity-30 cursor-not-allowed" : "hover:scale-110"
                  }`}
                >
                  {activeStep === experienceSteps.length - 1 ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <ArrowRight className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>

              {/* Footer Progress */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between text-sm">
                <span className="text-[var(--axity-gray)]">
                  Paso {activeStep + 1} de {experienceSteps.length}
                </span>
                <div className="flex items-center gap-2">
                  {canProceedStep() ? (
                    <div className="flex items-center gap-1 text-[var(--axity-mint)]">
                      <CheckCircle className="h-4 w-4" />
                      <span>Listo para continuar</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[var(--axity-gray)]">
                      <div className="w-2 h-2 bg-[var(--axity-violet)] rounded-full" />
                      <span>Completa los campos requeridos</span>
                    </div>
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
