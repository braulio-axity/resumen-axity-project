import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { AutoSaveIndicator } from "@/components/AutoSaveIndicator";
import { CheckCircle2, TrendingUp, LogOut, User } from "lucide-react";
import axityLogo from "@/assets/logo_axity.svg";
import type { ComponentType, ReactElement } from "react";

type StepIcon = ComponentType<{ className?: string }>;

export interface HeaderStep {
  id: string;
  icon: StepIcon;
  shortTitle: string;
}

type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

interface AxityHeaderProps {
  steps: HeaderStep[];
  currentStep: number;
  navigateToStep: (index: number) => void;
  getStepCompletion: (index: number) => boolean;
  progressPercent: number;

  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  levelInfo: {
    name: string;
    emoji: string;
  };

  /** Datos del autosave (opcional). Nota: lastSaved puede venir como timestamp (number) y aquí lo convertimos a Date */
  autoSave?: {
    status: AutoSaveStatus | string;     // puede venir más laxo desde el hook
    lastSaved?: Date | number | null;    // a veces timestamp
    error?: string | null;               // a veces null
    onForceSave?: () => void;
  };

  onLogout: () => void;
  logoSrc?: string;
}

export function AxityHeader({
  steps,
  currentStep,
  navigateToStep,
  getStepCompletion,
  progressPercent,
  user,
  levelInfo,
  autoSave,
  onLogout,
  logoSrc,
}: Readonly<AxityHeaderProps>): ReactElement {
  const normalizedStatus: AutoSaveStatus = (() => {
    const raw = autoSave?.status;
    if (raw === "idle" || raw === "saving" || raw === "saved" || raw === "error") {
      return raw;
    }
    return "idle";
  })();

  const normalizedLastSaved: Date | undefined = (() => {
    const raw = autoSave?.lastSaved;
    if (raw instanceof Date) return raw;
    if (typeof raw === "number") return new Date(raw);
    return undefined; // null/undefined -> undefined
  })();

  const normalizedError: string | undefined =
    autoSave?.error ?? undefined; // null -> undefined

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Header principal */}
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
                <img src={logoSrc ?? axityLogo} alt="Axity" className="h-8 w-auto" />
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-lg opacity-0 group-hover:opacity-20 blur-sm"
                  whileHover={{ opacity: 0.3 }}
                />
              </motion.div>
            </div>

            {/* Stepper Desktop */}
            <div className="hidden md:flex items-center gap-2 bg-white/20 rounded-xl p-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = getStepCompletion(index);
                const isClickable = index <= currentStep || (index > 0 && getStepCompletion(index - 1));

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
                          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
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
              {/* AutoSaveIndicator (opcional) */}
              {autoSave && (
                <div className="hidden lg:flex items-center gap-3 bg-white/20 rounded-xl px-3 py-2">
                  <AutoSaveIndicator
                    status={normalizedStatus}
                    lastSaved={normalizedLastSaved}
                    error={normalizedError}
                    onForceSave={autoSave.onForceSave}
                  />

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[var(--axity-purple)]">{Math.round(progressPercent)}%</span>
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-mint)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
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
                      <CheckCircle2 className="h-3 w-3" />
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
              )}

              {/* Usuario */}
              <motion.div whileHover={{ scale: 1.05 }} className="relative bg-white/20 rounded-xl p-2">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--axity-mint)] rounded-full border-2 border-white text-xs flex items-center justify-center">
                      <span className="text-white text-xs">{levelInfo.emoji}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-medium text-gray-700 text-sm">
                      {user.firstName || user.email}
                      {user.lastName ? ` ${user.lastName}` : ""}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{levelInfo.name}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Logout */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-white/80 hover:cursor-pointer"
                  title="Cerrar sesión"
                  onClick={onLogout}
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
                const isClickable = index <= currentStep || (index > 0 && getStepCompletion(index - 1));

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
                    <span className="text-xs font-medium">{index + 1}</span>
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
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
