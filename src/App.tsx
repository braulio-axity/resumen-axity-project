import { useState, useRef } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import {
  ArrowRight,
  ArrowLeft,
  Code2,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  User,
  TrendingUp,
  CheckCheck,
  LogOut,
} from "lucide-react";
import { AutoSaveIndicator } from "./components/AutoSaveIndicator";
import { useAutoSave } from "./hooks/useAutoSave";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import axityLogo from "@/assets/react.svg";

// Steps
import { SkillsStep } from "./components/steps/SkillsStep";
import { SlidePanelExperience } from "./components/steps/SlidePanelExperience";
import { EducationStep } from "./components/steps/EducationStep";
import { ReviewStep } from "./components/steps/ReviewStep";

// Tipos compartidos
import type {
  FormData,
  MotivationalMessage,
  UpdateFormData,
  AddMotivationalMessage,
  StreakCounter,
} from "./types/app";

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(50);
  const [milestones, setMilestones] = useState<string[]>([
    "¡Bienvenido a tu perfil profesional, Erick! 🚀",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLatestMessage, setShowLatestMessage] =
    useState<MotivationalMessage | null>(null);
  const [streakCounter, setStreakCounter] = useState<StreakCounter>({
    skills: 0,
    experiences: 0,
    education: 0,
    certifications: 0,
  });

  // Unique ID counter for generating unique message IDs
  const messageIdCounter = useRef(0);

  const [formData, setFormData] = useState<FormData>({
    // Datos precargados del login
    firstName: "Erick",
    lastName: "Rivera Parra",
    email: "erick.rivera@axity.com",
    employeeId: "AXY-2024-0247",
    level: "senior_avanzado",
    // Datos del formulario
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    personalStatement: "",
  });

  const consultantLevels = {
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

  const steps = [
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
      color: "bg-axity-gradient-cool",
      theme: "from-emerald-50 to-teal-50",
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

  const { saveState, forceSave /*, clearSavedData*/ } = useAutoSave({
    key: "axity-cv-form-erick",
    data: { formData, progress, milestones, currentStep },
    delay: 3000,
    onLoad: (savedData) => {
      if (savedData.formData) {
        // Preservar los datos precargados del usuario actual
        setFormData((prev) => ({
          ...prev,
          ...savedData.formData,
          firstName: "Erick",
          lastName: "Rivera Parra",
          email: "erick.rivera@axity.com",
          level: "senior_avanzado",
        }));
      }
      if (typeof savedData.progress === "number") {
        setProgress(savedData.progress);
      }
      if (Array.isArray(savedData.milestones)) {
        setMilestones(savedData.milestones);
      }
      if (typeof savedData.currentStep === "number") {
        setCurrentStep(savedData.currentStep);
      }
    },
    onSave: () => {
      console.log("CV data saved automatically for Erick");
    },
  });

  const updateFormData: UpdateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Generate unique ID for messages
  const generateUniqueMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${Date.now()}-${messageIdCounter.current}`;
  };

  const addMotivationalMessage: AddMotivationalMessage = (
    type,
    message,
    description,
    icon,
    context
  ) => {
    const newMessage: MotivationalMessage = {
      id: generateUniqueMessageId(),
      type,
      message,
      description,
      icon: icon ?? "🎉",
      timestamp: Date.now(),
      context,
    };

    setShowLatestMessage(newMessage);

    // Hide the latest message after 4 seconds
    setTimeout(() => {
      setShowLatestMessage(null);
    }, 4000);
  };

  const addProgress = (points: number, milestone?: string) => {
    setProgress((prev) => Math.min(prev + points, 100));

    if (milestone && !milestones.includes(milestone)) {
      setMilestones((prev) => [...prev, milestone]);
      addMotivationalMessage(
        "milestone",
        milestone,
        "Has alcanzado un nuevo hito",
        "🏆"
      );
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      addProgress(15, `¡Sección ${currentStep + 1} completada!`);

      const completionMessages = [
        "¡Sección conquistada! 🎉",
        "¡Progreso épico desbloqueado! 🚀",
        "¡Un paso más hacia la perfección! ✨",
        "¡Tu perfil cobra vida! 💫",
        "¡Excelente momentum! 🔥",
        "¡Building success step by step! 📈",
        "¡Tu dedicación se nota! 👏",
        "¡Camino al éxito trazado! 🛤️",
      ];

      const randomCompletion =
        completionMessages[Math.floor(Math.random() * completionMessages.length)];
      addMotivationalMessage(
        "milestone",
        randomCompletion,
        "Sigues construyendo tu perfil profesional con estilo",
        "✅"
      );
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateProgress = () => {
    const totalSections = steps.length;
    return ((currentStep + 1) / totalSections) * 100;
    // Nota: también muestras "progress" del autosave arriba; este es un cálculo visual.
  };

  const getStepCompletion = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return formData.skills.length > 0;
      case 1:
        return formData.experiences.length > 0;
      case 2:
        return (
          formData.education.length > 0 || formData.certifications.length > 0
        );
      case 3:
        return true;
      default:
        return false;
    }
  };

  const canProceed = () => getStepCompletion(currentStep);

  const currentLevelInfo = consultantLevels[formData.level];
  console.log('first', currentLevelInfo)
  const navigateToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || getStepCompletion(stepIndex - 1)) {
      setCurrentStep(stepIndex);
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      formData,
      updateFormData,
      addProgress,
      addMotivationalMessage,
      streakCounter,
      setStreakCounter,
    };

    switch (currentStep) {
      case 0:
        return <SkillsStep {...stepProps} />;
      case 1:
        return <SlidePanelExperience {...stepProps} />;
      case 2:
        return <EducationStep {...stepProps} />;
      case 3:
        return (
          <ReviewStep
            formData={formData}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            addProgress={addProgress}
            addMotivationalMessage={addMotivationalMessage}
          />
        );
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Toaster position="top-right" />

      {/* FLOATING LATEST MESSAGE - Top Priority */}
      <AnimatePresence>
        {showLatestMessage && (
          <motion.div
            key={`floating-${showLatestMessage.id}`}
            initial={{ opacity: 0, scale: 0.8, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -100 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
          >
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-2xl border border-white/20 max-w-md"
              animate={{
                boxShadow: [
                  "0 10px 30px rgba(139, 95, 191, 0.3)",
                  "0 20px 40px rgba(139, 95, 191, 0.4)",
                  "0 10px 30px rgba(139, 95, 191, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="text-3xl"
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  {showLatestMessage.icon}
                </motion.div>
                <div>
                  <div className="font-bold text-lg">
                    {showLatestMessage.message}
                  </div>
                  {showLatestMessage.description && (
                    <div className="text-white/80 text-sm mt-1">
                      {showLatestMessage.description}
                    </div>
                  )}
                  {showLatestMessage.context && (
                    <div className="text-white/70 text-xs mt-2 bg-white/10 rounded-lg px-2 py-1">
                      {showLatestMessage.context}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER flotante */}
        <header className="fixed top-0 left-0 right-0 z-50">
          <motion.div
            className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Branding */}
                <div className="flex items-center gap-4">
                  <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="relative group">
                    <img src={axityLogo} alt="Axity" className="h-8 w-auto" />
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-lg opacity-0 group-hover:opacity-20 blur-sm"
                      whileHover={{ opacity: 0.3 }}
                    />
                  </motion.div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-0.5 bg-gradient-to-b from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-full opacity-30" />
                    <div>
                      <h1 className="font-bold bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] bg-clip-text text-transparent text-lg">
                        Perfil Profesional
                      </h1>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <TrendingUp className="h-3 w-3" />
                        <span>Construcción inteligente</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stepper Desktop */}
                <div className="hidden md:flex items-center gap-2 bg-white/20 rounded-xl p-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = getStepCompletion(index);
                    const isClickable =
                      index <= currentStep ||
                      (index > 0 && getStepCompletion(index - 1));

                    return (
                      <motion.button
                        key={`nav-${step.id}`}
                        onClick={() => isClickable && navigateToStep(index)}
                        disabled={!isClickable}
                        className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white shadow-lg"
                            : isCompleted
                            ? "bg-[var(--axity-mint)]/20 text-[var(--axity-mint)] hover:bg-[var(--axity-mint)]/30"
                            : isClickable
                            ? "text-gray-600 hover:text-[var(--axity-purple)] hover:bg-white/40"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                        whileHover={isClickable ? { scale: 1.02 } : {}}
                        whileTap={isClickable ? { scale: 0.98 } : {}}
                      >
                        <div className="relative">
                          {isCompleted && !isActive ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", bounce: 0.6 }}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}

                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-white/30 rounded-full"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.8, 0, 0.8],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </div>

                        <span className="font-medium">{step.shortTitle}</span>

                        {isActive && (
                          <motion.div
                            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Indicadores + Usuario */}
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex items-center gap-3 bg-white/20 rounded-xl px-3 py-2">
                    <AutoSaveIndicator
                      status={saveState.status}
                      lastSaved={saveState.lastSaved}
                      error={saveState.error}
                      onForceSave={forceSave}
                    />

                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[var(--axity-purple)]">
                        {Math.round(calculateProgress())}%
                      </span>
                      <div className="w-12 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-mint)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${calculateProgress()}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {getStepCompletion(currentStep) ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 text-xs text-[var(--axity-mint)] bg-[var(--axity-mint)]/20 px-2 py-1 rounded-full"
                      >
                        <CheckCheck className="h-3 w-3" />
                        <span>Listo</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center gap-1 text-xs text-[var(--axity-violet)] bg-[var(--axity-violet)]/20 px-2 py-1 rounded-full"
                      >
                        <div className="w-1.5 h-1.5 bg-[var(--axity-violet)] rounded-full" />
                        <span>Activo</span>
                      </motion.div>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.05 }} className="relative bg-white/20 rounded-xl p-2">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--axity-mint)] rounded-full border-2 border-white text-xs flex items-center justify-center">
                          <span className="text-white text-xs">
                            {consultantLevels[formData.level].emoji}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <div className="font-medium text-gray-700 text-sm">
                          {formData.firstName} {formData.lastName}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <span>{consultantLevels[formData.level].name}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-white/30"
                      title="Cerrar sesión"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navegación móvil */}
          <div className="md:hidden mx-4 mt-2">
            <motion.div
              className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="p-3">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = getStepCompletion(index);
                    const isClickable =
                      index <= currentStep ||
                      (index > 0 && getStepCompletion(index - 1));

                    return (
                      <motion.button
                        key={`mobile-nav-${step.id}`}
                        onClick={() => isClickable && navigateToStep(index)}
                        disabled={!isClickable}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-b from-[var(--axity-purple)] to-[var(--axity-violet)] text-white"
                            : isCompleted
                            ? "text-[var(--axity-mint)]"
                            : isClickable
                            ? "text-gray-500 hover:text-[var(--axity-purple)]"
                            : "text-gray-300"
                        }`}
                        whileHover={isClickable ? { scale: 1.05 } : {}}
                      >
                        {isCompleted && !isActive ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                        <span className="text-xs font-medium">
                          {index + 1}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Línea de progreso global */}
          <div className="mx-4 mt-2 h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--axity-purple)] via-[var(--axity-violet)] to-[var(--axity-mint)]"
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-6 pt-32 md:pt-28 pb-24 flex-1">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${currentStep}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Header */}
                <div
                  className={`bg-gradient-to-r ${steps[currentStep].theme} rounded-2xl p-8 mb-8 text-center border border-purple-100`}
                >
                  <motion.div
                    className={`inline-flex p-4 ${steps[currentStep].color} rounded-xl mb-4 shadow-lg`}
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {(() => {
                      const StepIcon = steps[currentStep].icon;
                      return <StepIcon className="h-8 w-8 text-white" />;
                    })()}
                  </motion.div>
                  <h2 className="text-3xl font-bold text-[var(--axity-purple)] mb-2">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-lg text-[var(--axity-gray)]">
                    {steps[currentStep].subtitle}
                  </p>
                </div>

                {/* Step Content */}
                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg">
                  <CardContent className="p-8">{renderStepContent()}</CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Botonera inferior fija */}
        <AnimatePresence>
          {currentStep < 3 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none"
            >
              <div className="container mx-auto px-6 pb-6">
                <div className="max-w-4xl mx-auto">
                  <motion.div
                    className="bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl pointer-events-auto"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        {/* Prev */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={prevStep}
                            variant="outline"
                            disabled={currentStep === 0}
                            className="ax-btn-seconday flex items-center gap-2 bg-white/80 hover:bg-white border-gray-200 hover:border-[var(--axity-purple)] transition-all duration-200 px-6 py-3 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Anterior</span>
                          </Button>
                        </motion.div>

                        {/* Indicador paso */}
                        <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-2">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-[var(--axity-purple)]">
                              Paso {currentStep + 1} de {steps.length}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {steps.slice(0, 3).map((_, index) => (
                              <div
                                key={`progress-dot-${index}`}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  index === currentStep
                                    ? "bg-[var(--axity-purple)] scale-125"
                                    : index < currentStep
                                    ? "bg-[var(--axity-mint)]"
                                    : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Next */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
                          <Button
                            onClick={nextStep}
                            disabled={!canProceed()}
                            className={`ax-btn-primary flex items-center gap-2 ${steps[currentStep].color} hover:opacity-90 text-white shadow-lg px-8 py-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden`}
                          >
                            {canProceed() && (
                              <motion.div
                                className="absolute inset-0 bg-white/20"
                                animate={{ scale: [1, 1.05, 1], opacity: [0, 0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              />
                            )}

                            <span className="relative z-10">
                              <span className="hidden sm:inline">Continuar</span>
                              <span className="sm:hidden">Siguiente</span>
                            </span>
                            <ArrowRight className="h-4 w-4 relative z-10" />
                          </Button>

                          {getStepCompletion(currentStep) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--axity-mint)] rounded-full border-2 border-white"
                            >
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-full h-full bg-[var(--axity-mint)] rounded-full"
                              />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                          {!canProceed() ? (
                            <motion.div
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-[var(--axity-violet)] rounded-full" />
                              <span>Completa esta sección para continuar</span>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-2 text-[var(--axity-mint)]"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              <span>¡Sección lista para continuar!</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
