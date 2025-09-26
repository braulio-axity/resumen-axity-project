// src/App.tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import axityLogo from "@/assets/logo_axity.svg";

// Auth
import { useAuth } from "@/context/AuthContext";
import LoginCard from "@/components/LoginCard";

// Header nuevo
import { AxityHeader } from "@/components/AxityHeader";

// Steps
import { SkillsStep } from "./components/steps/SkillsStep";
import { SlidePanelExperience } from "./components/steps/SlidePanelExperience";
import { EducationStep } from "./components/steps/EducationStep";
import { ReviewStep } from "./components/steps/ReviewStep";

// AutoSave
import { useAutoSave } from "./hooks/useAutoSave";

// Tipos compartidos
import type {
  FormData,
  MotivationalMessage,
  UpdateFormData,
  AddMotivationalMessage,
  StreakCounter,
  ConsultantLevel,
} from "./types/app";
import { consultantLevels, steps } from "./constants";

export default function App() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(50);
  const [milestones, setMilestones] = useState<string[]>([
    "¡Bienvenido a tu perfil profesional! 🚀",
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
    firstName: "",
    lastName: "",
    email: "",
    employeeId: "",
    level: "junior",
    skills: [],
    experiences: [],
    education: [],
    certifications: [],
    personalStatement: "",
  });

  const { saveState, forceSave /*, clearSavedData*/ } = useAutoSave({
    key: `cv-form-${user?.email ?? "guest"}`,
    data: { formData, progress, milestones, currentStep },
    delay: 3000,
    onLoad: (savedData) => {
      if (savedData.formData) {
        setFormData((prev) => ({
          ...prev,
          ...savedData.formData,
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
      console.log("CV data saved automatically");
    },
  });

  useEffect(() => {
    if (!user) return;

    const normalizeLevel = (val?: unknown): ConsultantLevel => {
      const candidate = typeof val === "string" ? (val as ConsultantLevel) : undefined;
      const allowed = Object.keys(consultantLevels) as Array<string>;
      return candidate && allowed.includes(candidate) ? (candidate as ConsultantLevel) : "junior";
    };
  
    setFormData((prev: FormData): FormData => {
      return {
        ...prev,
        email: user.email ?? prev.email,
        firstName: prev.firstName && prev.firstName.trim() !== "" ? prev.firstName : (user.firstName ?? prev.firstName),
        lastName: prev.lastName && prev.lastName.trim() !== "" ? prev.lastName : (user.lastName ?? prev.lastName),
        employeeId: prev.employeeId && prev.employeeId.trim() !== "" ? prev.employeeId : (user.employeeId ?? prev.employeeId),
        level: prev.level ?? normalizeLevel(user.level),
      };
    });
  }, [user]);

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

  const currentLevelInfo =
    consultantLevels[
      formData.level as keyof typeof consultantLevels
    ] ?? consultantLevels.junior;

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

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-gray-200 rounded mb-3" />
          <p className="text-gray-500">Cargando información…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-50 via-white to-purple-50 p-6">
        <Toaster position="top-right" />
        <LoginCard />
      </div>
    );
  }

  const headerSteps = steps.map((s) => ({
    id: String(s.id),
    shortTitle: s.shortTitle,
    icon: s.icon,
    title: s.title,
  }));

  const autoSaveProps = {
    status: saveState.status,
    lastSaved: saveState.lastSaved,
    error: saveState.error,
    onForceSave: forceSave,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Toaster position="top-right" />

      {/* FLOATING LATEST MESSAGE */}
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

      {/* HEADER */}
      <AxityHeader
        // casting a `any` to avoid strict incompatibilities — ajusta si quieres tipado exacto
        steps={headerSteps as unknown as any}
        currentStep={currentStep}
        navigateToStep={navigateToStep}
        getStepCompletion={getStepCompletion}
        progressPercent={calculateProgress()}
        user={{
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email || user?.email,
        }}
        levelInfo={currentLevelInfo}
        autoSave={autoSaveProps}
        onLogout={logout}
        logoSrc={axityLogo}
      />

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
              {/* Step Header (mantén tu diseño de portada de sección) */}
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
  );
}
