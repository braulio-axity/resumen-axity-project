import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import axityLogo from "@/assets/logo_axity.svg";

import { useAuth } from "@/context/AuthContext";
import { AxityHeader } from "@/components/AxityHeader";

import { SkillsStep } from "@/components/steps/SkillsStep";
import { SlidePanelExperience } from "@/components/steps/SlidePanelExperience";
import { EducationStep } from "@/components/steps/EducationStep";
import { ReviewStep } from "@/components/steps/ReviewStep";

import { useAutoSave } from "@/hooks/useAutoSave";

import type { FormData, MotivationalMessage, UpdateFormData, AddMotivationalMessage, StreakCounter, ConsultantLevel } from "@/types/app";
import { consultantLevels, steps } from "@/constants";
import { useNavigate } from "react-router-dom";
import { useWizardStepRouter } from "@/hooks/useWizardStep";

export default function WizardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [progress, setProgress] = useState(50);
  const [milestones, setMilestones] = useState<string[]>(["¡Bienvenido a tu perfil profesional! 🚀"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLatestMessage, setShowLatestMessage] = useState<MotivationalMessage | null>(null);
  const [streakCounter, setStreakCounter] = useState<StreakCounter>({ skills: 0, experiences: 0, education: 0, certifications: 0 });
  const messageIdCounter = useRef(0);

  const [formData, setFormData] = useState<FormData>({
    firstName: "", lastName: "", email: "", employeeId: "", level: "junior",
    skills: [], experiences: [], education: [], certifications: [], personalStatement: "",
  });

  const canEnter = useCallback((idx: number) => {
    if (idx === 0) return true;
    if (idx === 1) return formData.skills.length > 0;
    if (idx === 2) return formData.experiences.length > 0;
    if (idx === 3) return formData.education.length > 0 || formData.certifications.length > 0;
    return true;
  }, [formData.skills.length, formData.experiences.length, formData.education.length, formData.certifications.length]);

  const { stepIndex: currentStep, goNext, goPrev, setStep } = useWizardStepRouter({
    totalSteps: steps.length,
    canEnter,
    onStepChange: () => window.scrollTo({ top: 0 }),
  });

  const { saveState, forceSave } = useAutoSave({
    key: `cv-form-${user?.email ?? "guest"}`,
    data: { formData, progress, milestones, currentStep },
    delay: 3000,
    onLoad: (savedData) => {
      if (savedData.formData) setFormData((prev) => ({ ...prev, ...savedData.formData }));
      if (typeof savedData.progress === "number") setProgress(savedData.progress);
      if (Array.isArray(savedData.milestones)) setMilestones(savedData.milestones);
    },
  });

  useEffect(() => {
    if (!user) return;
    const normalizeLevel = (val?: unknown): ConsultantLevel => {
      const candidate = typeof val === "string" ? (val as ConsultantLevel) : undefined;
      const allowed = Object.keys(consultantLevels) as Array<string>;
      return candidate && allowed.includes(candidate) ? (candidate as ConsultantLevel) : "junior";
    };
    setFormData((prev): FormData => ({
      ...prev,
      email: user.email ?? prev.email,
      firstName: prev.firstName?.trim() ? prev.firstName : (user.firstName ?? prev.firstName),
      lastName: prev.lastName?.trim() ? prev.lastName : (user.lastName ?? prev.lastName),
      employeeId: prev.employeeId?.trim() ? prev.employeeId : (user.employeeId ?? prev.employeeId),
      level: prev.level ?? normalizeLevel(user.level),
    }));
  }, [user]);

  const updateFormData: UpdateFormData = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const generateUniqueMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${Date.now()}-${messageIdCounter.current}`;
  };

  const addMotivationalMessage: AddMotivationalMessage = (type, message, description, icon, context) => {
    const newMessage: MotivationalMessage = {
      id: generateUniqueMessageId(), type, message, description, icon: icon ?? "🎉", timestamp: Date.now(), context,
    };
    setShowLatestMessage(newMessage);
    setTimeout(() => setShowLatestMessage(null), 4000);
  };

  const addProgress = (points: number, milestone?: string) => {
    setProgress((prev) => Math.min(prev + points, 100));
    if (milestone && !milestones.includes(milestone)) {
      setMilestones((prev) => [...prev, milestone]);
      addMotivationalMessage("milestone", milestone, "Has alcanzado un nuevo hito", "🏆");
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      goNext();
      addProgress(15, `¡Sección ${currentStep + 1} completada!`);
      const msgs = ["¡Sección conquistada! 🎉","¡Progreso épico desbloqueado! 🚀","¡Un paso más hacia la perfección! ✨","¡Tu perfil cobra vida! 💫","¡Excelente momentum! 🔥","¡Building success step by step! 📈","¡Tu dedicación se nota! 👏","¡Camino al éxito trazado! 🛤️"];
      addMotivationalMessage("milestone", msgs[Math.floor(Math.random()*msgs.length)], "Sigues construyendo tu perfil profesional con estilo", "✅");
    }
  };
  const prevStep = () => currentStep > 0 && goPrev();

  const calculateProgress = () => ((currentStep + 1) / steps.length) * 100;

  const getStepCompletion = (stepIndex: number) => {
    if (stepIndex === 0) return formData.skills.length > 0;
    if (stepIndex === 1) return formData.experiences.length > 0;
    if (stepIndex === 2) return formData.education.length > 0 || formData.certifications.length > 0;
    if (stepIndex === 3) return true;
    return false;
  };

  const canProceed = () => getStepCompletion(currentStep);

  const currentLevelInfo =
    consultantLevels[formData.level as keyof typeof consultantLevels] ?? consultantLevels.junior;

  const headerSteps = steps.map((s) => ({
    id: String(s.id), shortTitle: s.shortTitle, icon: s.icon, title: s.title,
  }));

  const autoSaveProps = {
    status: saveState.status, lastSaved: saveState.lastSaved, error: saveState.error, onForceSave: forceSave,
  };

  const navigateToStep = (idx: number) => setStep(idx);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <Toaster position="top-right" />
      <AxityHeader
        steps={headerSteps as unknown as any}
        currentStep={currentStep}
        navigateToStep={navigateToStep}
        getStepCompletion={getStepCompletion}
        progressPercent={calculateProgress()}
        user={{ firstName: user?.firstName, lastName: user?.lastName, email: user?.email }}
        levelInfo={currentLevelInfo}
        autoSave={autoSaveProps}
        onLogout={handleLogout}
        logoSrc={axityLogo}
      />
      <main className="container mx-auto px-6 pt-32 md:pt-28 pb-24 flex-1">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg">
              <CardContent className="p-8">
                {currentStep === 0 && (
                  <SkillsStep
                    formData={formData}
                    updateFormData={updateFormData}
                    addProgress={addProgress}
                    addMotivationalMessage={addMotivationalMessage}
                    streakCounter={streakCounter}
                    setStreakCounter={setStreakCounter}
                  />
                )}
                {currentStep === 1 && (
                  <SlidePanelExperience
                    formData={formData}
                    updateFormData={updateFormData}
                    addProgress={addProgress}
                    addMotivationalMessage={addMotivationalMessage}
                    streakCounter={streakCounter}
                    setStreakCounter={setStreakCounter}
                  />
                )}
                {currentStep === 2 && (
                  <EducationStep
                    formData={formData}
                    updateFormData={updateFormData}
                    addProgress={addProgress}
                    addMotivationalMessage={addMotivationalMessage}
                    streakCounter={streakCounter}
                    setStreakCounter={setStreakCounter}
                  />
                )}
                {currentStep === 3 && (
                  <ReviewStep
                    formData={formData}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                    addProgress={addProgress}
                    addMotivationalMessage={addMotivationalMessage}
                  />
                )}
              </CardContent>
            </Card>
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
