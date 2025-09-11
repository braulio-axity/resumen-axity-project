import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AutoSaveIndicator } from "./AutoSaveIndicator";
import { 
  Sparkles, 
  User, 
  TrendingUp, 
  CheckCheck, 
  CheckCircle2,
  HelpCircle,
  Settings
} from "lucide-react";
import { CONSULTANT_LEVELS, FORM_STEPS } from "../constants";
import type { FormData } from "../types/app";
import axityLogo from 'figma:asset/57af6e8947c8fbfc785c96ea7f281591f169a017.png';

interface FormHeaderProps {
  formData: FormData;
  currentStep: number;
  milestones: string[];
  calculateProgress: () => number;
  getStepCompletion: (stepIndex: number) => boolean;
  navigateToStep: (stepIndex: number) => void;
  saveState: any;
  forceSave: () => void;
  clearSavedData: () => void;
}

export function FormHeader({
  formData,
  currentStep,
  milestones,
  calculateProgress,
  getStepCompletion,
  navigateToStep,
  saveState,
  forceSave,
}: FormHeaderProps) {
  const currentLevelInfo = CONSULTANT_LEVELS[formData.level];

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b shadow-lg sticky top-0 z-40">
      {/* Nivel Superior - Branding y Usuario */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Lado Izquierdo - Branding Mejorado */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img src={axityLogo} alt="Axity" className="h-12 w-auto" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-full animate-pulse"></div>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] bg-clip-text text-transparent">
                  Perfil Profesional
                </h1>
                <p className="text-sm text-[var(--axity-gray)] flex items-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  Construye tu perfil técnico de manera inteligente
                </p>
              </div>
            </div>

            {/* Lado Derecho - Usuario Mejorado */}
            <div className="flex items-center gap-4">
              <AutoSaveIndicator
                status={saveState.status}
                lastSaved={saveState.lastSaved}
                error={saveState.error}
                onForceSave={forceSave}
              />

              {/* Usuario Card Moderno */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 border border-purple-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <Badge className={`${currentLevelInfo.bgColor} ${currentLevelInfo.color} border-0 text-xs px-1.5 py-0.5`}>
                        {currentLevelInfo.emoji}
                      </Badge>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-bold text-[var(--axity-purple)] text-sm">
                      {formData.firstName} {formData.lastName}
                    </div>
                    <div className="text-xs text-[var(--axity-gray)] flex items-center gap-1">
                      <span>{currentLevelInfo.name}</span>
                      <span>•</span>
                      <span>{formData.employeeId}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Botones de Acción */}
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-[var(--axity-gray)]">
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-[var(--axity-gray)]">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nivel Inferior - Progreso y Navegación */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-6xl mx-auto">
            {/* Header de Progreso */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--axity-purple)]" />
                  <span className="font-medium text-[var(--axity-purple)]">
                    Actualizando perfil profesional
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[var(--axity-gray)]">
                    <div className="w-2 h-2 bg-[var(--axity-purple)] rounded-full"></div>
                    <span>Paso {currentStep + 1} de {FORM_STEPS.length}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--axity-gray)]">
                    <CheckCheck className="h-4 w-4 text-[var(--axity-mint)]" />
                    <span>{milestones.length} hitos</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--axity-purple)]">
                  {Math.round(calculateProgress())}% completado
                </span>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProgress()}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {/* Navegación de Pasos Mejorada */}
            <div className="flex items-center justify-between">
              {FORM_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = getStepCompletion(index);
                const isPast = index < currentStep;
                const isClickable = index <= currentStep || (index > 0 && getStepCompletion(index - 1));
                
                return (
                  <div key={step.id} className="flex-1 relative">
                    {/* Línea Conectora */}
                    {index < FORM_STEPS.length - 1 && (
                      <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gray-200 z-0">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)]"
                          initial={{ width: 0 }}
                          animate={{ width: isPast ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}

                    {/* Step Button */}
                    <motion.button
                      onClick={() => isClickable && navigateToStep(index)}
                      disabled={!isClickable}
                      className={`relative z-10 flex flex-col items-center w-full group ${isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                      whileHover={isClickable ? { scale: 1.05 } : {}}
                      whileTap={isClickable ? { scale: 0.95 } : {}}
                    >
                      {/* Icono del Paso */}
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 border-2 transition-all shadow-lg ${
                          isActive 
                            ? 'bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white border-transparent' 
                            : isCompleted || isPast
                            ? 'bg-[var(--axity-mint)] text-white border-[var(--axity-mint)]'
                            : 'bg-white text-gray-400 border-gray-200'
                        }`}
                        animate={isActive ? { 
                          boxShadow: ['0 0 0 0 rgba(139, 95, 191, 0.7)', '0 0 0 10px rgba(139, 95, 191, 0)', '0 0 0 0 rgba(139, 95, 191, 0)']
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {isCompleted && !isActive ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </motion.div>

                      {/* Título del Paso */}
                      <div className="text-center max-w-[140px]">
                        <div className={`text-sm font-medium transition-colors ${
                          isActive ? 'text-[var(--axity-purple)]' : isCompleted || isPast ? 'text-[var(--axity-mint)]' : 'text-gray-600'
                        }`}>
                          {step.shortTitle}
                        </div>
                        {isActive && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-[var(--axity-violet)] mt-1 font-medium"
                          >
                            Actual
                          </motion.div>
                        )}
                        {(isCompleted && !isActive) && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-[var(--axity-mint)] mt-1 font-medium"
                          >
                            Completado
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}