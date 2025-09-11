import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { SuccessConfetti } from "./SuccessConfetti";
import {
  CheckCircle,
  Rocket,
  Code2,
  Briefcase,
  Award,
  Sparkles,
  TrendingUp,
  Target,
  User,
  Mail,
  MapPin,
  Calendar,
  Star
} from "lucide-react";
import { motion } from "motion/react";

interface WizardFinalStepProps {
  data: any;
  onSubmit: () => void;
  isSubmitting: boolean;
}

type Skill = { name: string; level: string };
const LEVELS = ["Expert", "Avanzado", "Intermedio", "Principiante"] as const;
type LevelKey = typeof LEVELS[number];

export function WizardFinalStep({ data, onSubmit, isSubmitting }: WizardFinalStepProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getSummaryStats = () => {
    return {
      skills: data.skills?.length || 0,
      experiences: data.experiences?.length || 0,
      education: data.education?.length || 0,
      certifications: data.certifications?.length || 0
    };
  };

  const stats = getSummaryStats();
  const totalItems = stats.skills + stats.experiences + stats.education + stats.certifications;

  // Quitamos completedSections (estaba sin uso)
  const completionPercentage = totalItems > 0 ? Math.min(100, (totalItems / 15) * 100) : 0;

  const getCompletionLevel = () => {
    if (completionPercentage >= 80)
      return { label: "Perfil Excepcional", color: "text-purple-600", bg: "bg-purple-50", icon: "🌟" };
    if (completionPercentage >= 60)
      return { label: "Perfil Completo", color: "text-green-600", bg: "bg-green-50", icon: "✅" };
    if (completionPercentage >= 40)
      return { label: "Buen Progreso", color: "text-blue-600", bg: "bg-blue-50", icon: "🚀" };
    return { label: "Perfil Básico", color: "text-yellow-600", bg: "bg-yellow-50", icon: "⚡" };
  };

  const completion = getCompletionLevel();

  // Tipamos el resultado por nivel para evitar 'unknown' en Object.entries
  const getSkillHighlights = (): Record<LevelKey, string[]> => {
    const categories: Record<LevelKey, string[]> = {
      Expert: [],
      Avanzado: [],
      Intermedio: [],
      Principiante: []
    };

    const arr: Skill[] = (data.skills || []) as Skill[];
    arr.forEach((skill: Skill) => {
      const maybeKey = skill.level as LevelKey;
      const key: LevelKey = (LEVELS as readonly string[]).includes(maybeKey) ? maybeKey : "Intermedio";
      categories[key].push(skill.name);
    });

    return categories;
  };

  const skillCategories = getSkillHighlights();

  const handleSubmit = async () => {
    setShowConfetti(true);
    await onSubmit();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <>
        <SuccessConfetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl"
          >
            <CheckCircle className="h-16 w-16 text-white" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ¡Perfil Actualizado Exitosamente!
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Tu información profesional ya está disponible para los equipos de Axity
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-green-900">Visible para PMs</h3>
                <p className="text-sm text-green-700">Tu perfil es visible para Project Managers</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold text-blue-900">Matching Automático</h3>
                <p className="text-sm text-blue-700">Te asignaremos proyectos compatibles</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-semibold text-purple-900">Oportunidades</h3>
                <p className="text-sm text-purple-700">Recibirás notificaciones de nuevos proyectos</p>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Animation */}
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
            <CheckCircle className="h-12 w-12 text-white" />
          </motion.div>
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">¡Perfil Profesional Listo!</h2>
        <p className="text-lg text-muted-foreground">Tu información está preparada para conectarte con las mejores oportunidades en Axity</p>
      </motion.div>

      {/* Completion Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Estado de tu Perfil</h3>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm`}>
                  <span className="text-lg">{completion.icon}</span>
                  <span className="font-medium">{completion.label}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{Math.round(completionPercentage)}%</div>
                <div className="text-white/80">Completitud</div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Code2 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-1">{stats.skills}</div>
                <div className="text-sm text-blue-700 font-medium">Habilidades</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.skills === 0 ? "Agrega al menos 5" : stats.skills >= 5 ? "¡Excelente!" : "Agrega más"}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="h-8 w-8 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-orange-900 mb-1">{stats.experiences}</div>
                <div className="text-sm text-orange-700 font-medium">Experiencias</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.experiences === 0 ? "Mínimo 1" : "Perfecto"}</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-emerald-900 mb-1">{stats.education}</div>
                <div className="text-sm text-emerald-700 font-medium">Formación</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.education === 0 ? "Opcional" : "Agregado"}</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-900 mb-1">{stats.certifications}</div>
                <div className="text-sm text-purple-700 font-medium">Certificaciones</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.certifications === 0 ? "Recomendado" : "¡Genial!"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Preview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-purple-600" />
              Vista Previa de tu Perfil
            </h3>

            {/* Basic Info */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl mb-6">
              <h4 className="font-bold text-lg mb-4 text-purple-900">Información del Consultor</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {data.firstName} {data.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">Consultor Axity</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{data.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>ID: {data.employeeId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{data.location === "cdmx" ? "Ciudad de México" : data.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Summary */}
            {data.skills && data.skills.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-blue-600" />
                  Stack Tecnológico Destacado
                </h4>

                {/* Iteramos por LEVELS para tener tipos fuertes */}
                <div className="space-y-3">
                  {LEVELS.map((level) => {
                    const skills = skillCategories[level];
                    if (!skills.length) return null;

                    const levelData: Record<LevelKey, { color: string; icon: string }> = {
                      Expert: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: "⭐" },
                      Avanzado: { color: "bg-green-100 text-green-800 border-green-200", icon: "🚀" },
                      Intermedio: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: "⚡" },
                      Principiante: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: "🌱" }
                    };

                    return (
                      <div key={level} className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{levelData[level].icon}</span>
                          <span className="font-medium text-gray-900">{level}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.slice(0, 8).map((skillName, index) => (
                            <Badge key={`${skillName}-${index}`} className={`${levelData[level].color} border`}>
                              {skillName}
                            </Badge>
                          ))}
                          {skills.length > 8 && (
                            <Badge variant="outline" className="border-gray-300">
                              +{skills.length - 8} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Latest Experience */}
            {data.experiences && data.experiences.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-orange-600" />
                  Experiencia Más Reciente
                </h4>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-orange-900">{data.experiences[0].position}</div>
                      <div className="text-orange-700">{data.experiences[0].company}</div>
                      {data.experiences[0].current && (
                        <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">Posición Actual</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Readiness Indicator */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
                <span className="font-bold text-green-900">Nivel de Preparación del Perfil</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-green-700">Skills registrados:</span>
                  <div className="font-bold text-green-900">{stats.skills} tecnologías</div>
                </div>
                <div>
                  <span className="text-green-700">Experiencia total:</span>
                  <div className="font-bold text-green-900">{stats.experiences} posiciones</div>
                </div>
                <div>
                  <span className="text-green-700">Formación:</span>
                  <div className="font-bold text-green-900">{stats.education + stats.certifications} items</div>
                </div>
                <div>
                  <span className="text-green-700">Completitud:</span>
                  <div className="font-bold text-green-900">{Math.round(completionPercentage)}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Launch Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-center">
        <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl border-0">
          <CardContent className="p-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-6"
            >
              <Rocket className="h-16 w-16 mx-auto" />
            </motion.div>

            <h3 className="text-2xl font-bold mb-3">¿Listo para el Despegue?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Tu perfil profesional será visible para Project Managers y Tech Leads de Axity. Te conectaremos con proyectos que se alineen
              perfectamente con tu experiencia y objetivos.
            </p>

            <div className="flex items-center justify-center gap-6 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Información verificada</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>Perfil optimizado</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Sync automático</span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              size="lg"
              disabled={isSubmitting}
              className="bg-white text-purple-600 hover:bg-white/90 font-bold shadow-xl px-12 py-4 text-lg"
            >
              {isSubmitting ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="mr-3">
                  <Sparkles className="h-6 w-6" />
                </motion.div>
              ) : (
                <Rocket className="h-6 w-6 mr-3" />
              )}
              {isSubmitting ? "Actualizando perfil..." : "🚀 Lanzar mi Perfil Profesional"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Legal Notice */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Al actualizar tu perfil, confirmas que la información es veraz y actual. Este perfil se utiliza exclusivamente para asignación
              de proyectos y desarrollo profesional dentro de Axity, siguiendo nuestras políticas de privacidad y seguridad.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
