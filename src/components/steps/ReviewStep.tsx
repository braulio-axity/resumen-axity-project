import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Code2,
  Briefcase,
  GraduationCap,
  PartyPopper,
  Star,
  Target,
  Sparkles,
  Send,
} from "lucide-react";

// ⬇️ Importa tipos centralizados
import type {
  FormData,
  AddMotivationalMessage,
} from "../../types/app";
import React from "react";

interface ReviewStepProps {
  formData: FormData;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: AddMotivationalMessage;
}

type ConsultantLevel = NonNullable<FormData["level"]>;

const consultantLevels: Record<
  ConsultantLevel,
  { name: string; emoji: string; color: string }
> = {
  trainee: {
    name: "Trainee",
    emoji: "🌱",
    color: "text-green-600",
  },
  junior: {
    name: "Junior",
    emoji: "⚡",
    color: "text-blue-600",
  },
  consultor: {
    name: "Consultor",
    emoji: "🚀",
    color: "text-[var(--axity-purple)]",
  },
  avanzado: {
    name: "Avanzado",
    emoji: "🔥",
    color: "text-orange-600",
  },
  senior: {
    name: "Senior",
    emoji: "⭐",
    color: "text-yellow-600",
  },
  senior_avanzado: {
    name: "Senior Avanzado",
    emoji: "👑",
    color: "text-red-600",
  },
};

export function ReviewStep({
  formData,
  isSubmitting,
  setIsSubmitting,
  addProgress,
  addMotivationalMessage,
}: ReviewStepProps) {
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    addProgress(25, "¡Perfil profesional completado! 🎊");

    addMotivationalMessage(
      "milestone",
      "¡Tu perfil profesional ha sido actualizado! 🚀",
      "Ya está visible para los Staff Manager de Axity",
      "🎉",
      "Perfil completado al 100%",
    );

    setIsSubmitting(false);
  };

  const skillsCount = formData.skills?.length || 0;
  const experiencesCount = formData.experiences?.length || 0;
  const educationCount =
    (formData.education?.length || 0) +
    (formData.certifications?.length || 0);

  // Nivel con fallback seguro para evitar errores si viene undefined
  const levelKey: ConsultantLevel = (formData.level ?? "consultor") as ConsultantLevel;

  return (
    <div className="space-y-8">
      {/* Celebration Header */}
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="text-6xl mb-4"
        >
          🎊
        </motion.div>
        <h3 className="text-3xl font-bold text-[var(--axity-purple)] mb-2">
          ¡Tu perfil profesional está listo para destacar! 🌟
        </h3>
        <p className="text-xl text-[var(--axity-gray)]">
          Excelente trabajo, {formData.firstName}. Has creado un
          perfil técnico sobresaliente.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center shadow-lg"
        >
          <Code2 className="h-12 w-12 mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1">
            {skillsCount}
          </div>
          <div className="text-blue-100">
            Tecnologías dominadas
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white text-center shadow-lg"
        >
          <Briefcase className="h-12 w-12 mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1">
            {experiencesCount}
          </div>
          <div className="text-orange-100">
            Experiencias profesionales
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -4 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white text-center shadow-lg"
        >
          <GraduationCap className="h-12 w-12 mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1">
            {educationCount}
          </div>
          <div className="text-emerald-100">
            Formación y certificaciones
          </div>
        </motion.div>
      </div>

      {/* CV Preview */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-xl">
          <CardTitle className="flex items-center gap-3 text-xl">
            <PartyPopper className="h-6 w-6" />
            Resumen de tu perfil profesional
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-[var(--axity-purple)] mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Información Personal
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nombre:</span>
                  <span className="font-medium">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">
                    {formData.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    ID Empleado:
                  </span>
                  <span className="font-medium">
                    {formData.employeeId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nivel:</span>
                  <Badge className="bg-purple-100 text-[var(--axity-purple)] border-purple-200">
                    {consultantLevels[levelKey].emoji}{" "}
                    {consultantLevels[levelKey].name}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[var(--axity-purple)] mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Tu perfil técnico completo
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {skillsCount} Tecnologías
                    </div>
                    <div className="text-xs text-gray-600">
                      Tu stack técnico
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {experiencesCount} Experiencias
                    </div>
                    <div className="text-xs text-gray-600">
                      Trayectoria profesional
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {educationCount} Credenciales
                    </div>
                    <div className="text-xs text-gray-600">
                      Formación y certificaciones
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-purple-200">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-center space-y-4"
            >
              <div className="text-lg text-[var(--axity-purple)] font-medium">
                ¿Todo se ve bien? ¡Es hora de enviar tu cv! 🚀
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="lg"
                className="bg-axity-gradient-primary text-white shadow-xl px-8 py-4 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="mr-3"
                    >
                      <Sparkles className="h-6 w-6" />
                    </motion.div>
                    Publicando tu cv...
                  </>
                ) : (
                  <>
                    <Send className="h-6 w-6 mr-3" />
                    Enviar tu CV ✨
                  </>
                )}
              </Button>

              <p className="text-sm text-[var(--axity-gray)]">
                Tu perfil será visible para los Staff Managers
                de Axity
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
