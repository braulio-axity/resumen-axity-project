import { useEffect, useState } from 'react';
import { listCvExperiences, createCvExperience, updateCvExperience, deleteCvExperience, type CreateExperiencePayload } from '@/api/cvExperiences';
import { motion, AnimatePresence } from "motion/react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet"
import {
  Plus,
  Building,
  User,
  Calendar,
  Target,
  Trophy,
  Code2,
  Trash2,
  Rocket,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Award,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  Zap,
  Edit,
  FolderOpen
} from "lucide-react"
import { Separator } from "../ui/separator"
import type {
  FormData,
  UpdateFormData,
  AddMotivationalMessage,
  StreakCounter,
} from "./../../types/app"
import { Loading } from '../ui/Loading';

type Experience = FormData["experiences"][number]
type Project = Experience["projects"][number]

interface ExperienceStepProps {
  formData: FormData;
  updateFormData: UpdateFormData;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: AddMotivationalMessage;
  streakCounter: StreakCounter;
  setStreakCounter: React.Dispatch<React.SetStateAction<StreakCounter>>;
}

export function SlidePanelExperience({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  setStreakCounter
}: ExperienceStepProps) {
  const [showSlidePanel, setShowSlidePanel] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({})
  const [activeStep, setActiveStep] = useState(0)
  const [contextualMessage, setContextualMessage] = useState<string | null>(null)

  const [currentExp, setCurrentExp] = useState<Experience>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    challenges: "",
    achievements: "",
    technologies: [],
    projects: []
  })

  const [currentProject, setCurrentProject] = useState<Project>({
    name: "",
    role: "",
    responsibilities: "",
    technologies: []
  })

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [newTechName, setNewTechName] = useState("")
  const [newTechVersion, setNewTechVersion] = useState("")
  const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null)

  const [loadingServerExp, setLoadingServerExp] = useState(false)
  const [savingExp, setSavingExp] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        setLoadingServerExp(true);
        const server = await listCvExperiences();
        updateFormData('experiences', server as any);
      } finally {
        setLoadingServerExp(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const experienceSteps = [
    {
      id: 0,
      title: "Básico",
      icon: Building,
      description: "Empresa, cargo y fechas",
      color: "from-blue-400 to-purple-500"
    },
    {
      id: 1,
      title: "Proyectos",
      icon: Code2,
      description: "Obligatorio - Al menos uno",
      color: "from-green-400 to-blue-500"
    },
    {
      id: 2,
      title: "Logros",
      icon: Trophy,
      description: "Impacto y desafíos",
      color: "from-yellow-400 to-orange-500"
    }
  ]

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => setContextualMessage(null), 3000);
  }

  const toggleExpanded = (index: number) => {
    setExpandedCards(prev => ({ ...prev, [index]: !prev[index] }));
  }

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
        ? `${years} año${years > 1 ? 's' : ''} y ${remainingMonths} mes${remainingMonths > 1 ? 'es' : ''}`
        : `${years} año${years > 1 ? 's' : ''}`;
    }
    return `${months} mes${months > 1 ? 'es' : ''}`;
  }

  // Ordenar experiencias (reciente primero)
  const sortExperiencesByDate = (experiences: Experience[]) => {
    return [...experiences].sort((a, b) => {
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }

  const addExperience = async () => {
    if (!currentExp.company || !currentExp.position || !currentExp.startDate) return;

    const normalize = (e: Experience): CreateExperiencePayload => ({
      company: e.company.trim(),
      position: e.position.trim(),
      startDate: e.startDate,             // "YYYY-MM"
      endDate: e.current ? '' : (e.endDate || ''), // "" si current true
      current: !!e.current,
      challenges: e.challenges ?? '',
      achievements: e.achievements ?? '',
      technologies: (e.technologies || []).map(t => ({ name: t.name, version: t.version || undefined })),
      projects: (e.projects || []).map(p => ({
        name: p.name, role: p.role, responsibilities: p.responsibilities,
        technologies: (p.technologies || []).map(t => ({ name: t.name, version: t.version || undefined })),
      })),
    });

    const experiences = formData.experiences || [];
    let rollback: null | { type: 'replace' | 'remove'; index: number; prev?: Experience } = null;

    try {
      setSavingExp(true);

      if (editingExperienceIndex !== null) {
        // Optimistic replace
        rollback = { type: 'replace', index: editingExperienceIndex, prev: experiences[editingExperienceIndex] };
        const next = [...experiences];
        next[editingExperienceIndex] = currentExp;
        updateFormData('experiences', next);

        const serverId = (rollback.prev as any)?.id;
        if (serverId) {
          await updateCvExperience(serverId, normalize(currentExp));
        } else {
          await createCvExperience(normalize(currentExp));
        }

        addMotivationalMessage('experience', '¡Experiencia actualizada exitosamente! ✏️', `${currentExp.position} en ${currentExp.company} ha sido modificada`, '📝');
        showContextualSuccess(`✏️ Tu experiencia en ${currentExp.company} ha sido actualizada!`);
      } else {
        // Optimistic append
        rollback = { type: 'remove', index: experiences.length };
        updateFormData('experiences', [...experiences, currentExp]);

        await createCvExperience(normalize(currentExp));

        setStreakCounter(prev => ({ ...prev, experiences: prev.experiences + 1 }));
        const expCount = experiences.length + 1;
        const milestones: Record<number, string> = {
          1: '¡Primera experiencia documentada! 📖',
          3: '¡Trayectoria sólida construida! 🏗️',
          5: '¡Portfolio profesional épico! 🎯',
        };
        if (milestones[expCount]) addProgress(15, milestones[expCount]);
        addMotivationalMessage('experience', '¡Experiencia agregada exitosamente! 🎉', `${currentExp.position} en ${currentExp.company} ahora es parte de tu trayectoria`, '💼');
        showContextualSuccess(`🎯 Tu experiencia en ${currentExp.company} ha sido documentada!`);
        addProgress(20);
      }

      // Reset
      setCurrentExp({
        company: "", position: "", startDate: "", endDate: "", current: false,
        challenges: "", achievements: "", technologies: [], projects: []
      });
      setShowSlidePanel(false);
      setActiveStep(0);
      setEditingExperienceIndex(null);
    } catch (e: any) {
      // rollback UI
      const cur = (formData.experiences || []) as Experience[];
      if (rollback) {
        if (rollback.type === 'replace' && rollback.prev) {
          const next = [...cur];
          next[rollback.index] = rollback.prev;
          updateFormData('experiences', next);
        } else if (rollback.type === 'remove') {
          const next = [...cur];
          next.splice(rollback.index, 1);
          updateFormData('experiences', next);
        }
      }
      // feedback
      setContextualMessage(e?.message || 'No pudimos guardar la experiencia. Intenta otra vez.');
      setTimeout(() => setContextualMessage(null), 3000);
    } finally {
      setSavingExp(false);
    }
  }

  const editExperience = (index: number) => {
    const experience = formData.experiences[index] as Experience;
    setCurrentExp({ ...experience });
    setEditingExperienceIndex(index);
    setActiveStep(0);
    setShowSlidePanel(true);
  }

  const deleteExperience = async (index: number) => {
    const experiences = formData.experiences || [];
    const deletedExp = experiences[index] as Experience;
    const next = experiences.filter((_, i) => i !== index);

    // Optimistic
    updateFormData('experiences', next);

    try {
      const serverId = (deletedExp as any)?.id;
      if (serverId) {
        await deleteCvExperience(serverId);
      } // si no hay id, sólo era local
      addMotivationalMessage('experience', 'Experiencia eliminada', `${deletedExp.position} en ${deletedExp.company} ha sido removida`, '🗑️');
      showContextualSuccess(`🗑️ Experiencia en ${deletedExp.company} eliminada`);
    } catch (e: any) {
      // rollback
      updateFormData('experiences', experiences);
      setContextualMessage(e?.message || 'No pudimos eliminar la experiencia.');
      setTimeout(() => setContextualMessage(null), 3000);
    }
  }

  const canProceedStep = (): boolean => {
    switch (activeStep) {
      case 0: return !!(currentExp.company.trim() && currentExp.position.trim() && currentExp.startDate);
      case 1: return currentExp.projects.length > 0; // al menos un proyecto
      case 2: return true; // opcional
      default: return false;
    }
  }

  const nextStep = () => {
    if (activeStep < experienceSteps.length - 1) setActiveStep(prev => prev + 1);
  }

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  }

  return (
    <div className="space-y-8">
      {/* Loading */}
      {loadingServerExp &&  <Loading show fullscreen label="Cargando información..." size="lg" />}
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
        {formData.experiences?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-full border border-purple-200"
          >
            <Award className="h-4 w-4 text-[var(--axity-purple)]" />
            <span className="text-sm font-medium text-[var(--axity-purple)]">
              {formData.experiences.length} experiencia{formData.experiences.length !== 1 ? 's' : ''} documentada{formData.experiences.length !== 1 ? 's' : ''}
            </span>
          </motion.div>
        )}
      </div>

      {/* Timeline de Experiencias */}
      {formData.experiences && formData.experiences.length > 0 && (
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--axity-purple)] via-[var(--axity-violet)] to-[var(--axity-orange)]"></div>

            {sortExperiencesByDate(formData.experiences).map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-20 pb-8"
              >
                <motion.div
                  className={`absolute left-6 w-4 h-4 rounded-full shadow-lg ${exp.current
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                      : 'bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)]'
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

                <Card
                  className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-[var(--axity-purple)] cursor-pointer"
                  onClick={() => toggleExpanded(index)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                            <Building className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-[var(--axity-purple)]">{exp.position}</h4>
                            <p className="text-[var(--axity-orange)] font-medium">{exp.company}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-[var(--axity-gray)]">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{exp.startDate} - {exp.current ? 'Presente' : exp.endDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{getDuration(exp.startDate, exp.endDate, exp.current)}</span>
                          </div>
                          {exp.projects && exp.projects.length > 0 && (
                            <div className="flex items-center gap-1">
                              <FolderOpen className="h-4 w-4 text-[var(--axity-violet)]" />
                              <span>{exp.projects.length} proyecto{exp.projects.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {exp.current && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <Zap className="h-3 w-3 mr-1" />
                            Actual
                          </Badge>
                        )}

                        {/* Botones de acción */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              editExperience(index);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-[var(--axity-violet)]/10 hover:text-[var(--axity-violet)]"
                            title="Editar experiencia"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('¿Estás seguro de que deseas eliminar esta experiencia?')) {
                                deleteExperience(index);
                              }
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500"
                            title="Eliminar experiencia"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(index);
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title={expandedCards[index] ? "Contraer" : "Ver proyectos"}
                          >
                            {expandedCards[index] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Contenido expandido - Proyectos */}
                  <AnimatePresence>
                    {expandedCards[index] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="pt-0 pb-6">
                          <Separator className="mb-4" />

                          {/* Proyectos */}
                          {exp.projects && exp.projects.length > 0 ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-2 mb-4">
                                <Rocket className="h-4 w-4 text-[var(--axity-violet)]" />
                                <h5 className="font-medium text-[var(--axity-purple)]">
                                  Proyectos destacados ({exp.projects.length})
                                </h5>
                              </div>

                              <div className="grid gap-3">
                                {exp.projects.map((project, projectIndex) => (
                                  <motion.div
                                    key={projectIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: projectIndex * 0.1 }}
                                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h6 className="font-medium text-[var(--axity-purple)] mb-1">
                                            {project.name}
                                          </h6>
                                          <p className="text-sm text-[var(--axity-orange)] font-medium mb-2">
                                            {project.role}
                                          </p>
                                        </div>
                                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--axity-violet)] to-[var(--axity-magenta)] rounded-lg flex items-center justify-center flex-shrink-0">
                                          <Code2 className="h-4 w-4 text-white" />
                                        </div>
                                      </div>

                                      <p className="text-sm text-[var(--axity-gray)] leading-relaxed">
                                        {project.responsibilities}
                                      </p>

                                      {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-3">
                                          {project.technologies.map((tech, techIndex) => (
                                            <Badge
                                              key={techIndex}
                                              variant="secondary"
                                              className="text-xs bg-white/70 text-[var(--axity-violet)] border border-[var(--axity-violet)]/20"
                                            >
                                              {tech.name}{tech.version ? ` v${tech.version}` : ''}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6 text-[var(--axity-gray)]">
                              <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No hay proyectos documentados</p>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editExperience(index);
                                }}
                                variant="outline"
                                size="sm"
                                className="mt-2"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Agregar proyectos
                              </Button>
                            </div>
                          )}

                          {/* Logros y desafíos si existen */}
                          {(exp.achievements || exp.challenges) && (
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <div className="grid md:grid-cols-2 gap-4">
                                {exp.achievements && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Trophy className="h-4 w-4 text-[var(--axity-orange)]" />
                                      <h6 className="font-medium text-[var(--axity-purple)]">Logros</h6>
                                    </div>
                                    <p className="text-sm text-[var(--axity-gray)] leading-relaxed">
                                      {exp.achievements}
                                    </p>
                                  </div>
                                )}

                                {exp.challenges && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Target className="h-4 w-4 text-[var(--axity-magenta)]" />
                                      <h6 className="font-medium text-[var(--axity-purple)]">Desafíos</h6>
                                    </div>
                                    <p className="text-sm text-[var(--axity-gray)] leading-relaxed">
                                      {exp.challenges}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
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
            onClick={() => {
              setEditingExperienceIndex(null);
              setCurrentExp({
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                current: false,
                challenges: "",
                achievements: "",
                technologies: [],
                projects: []
              });
              setActiveStep(0);
              setShowSlidePanel(true);
            }}
            size="lg"
            className="ax-btn-primary bg-axity-gradient-accent text-white shadow-xl px-8 py-4"
          >
            <Plus className="h-6 w-6 mr-3" />
            {formData.experiences?.length > 0 ? 'Agregar nueva experiencia' : 'Documentar mi primera experiencia'} ✨
          </Button>
        </motion.div>
        <p className="text-sm text-[var(--axity-gray)] mt-4">
          Completa tu experiencia desde el panel lateral 👈
        </p>
      </div>

      {/* SLIDING PANEL */}
      <Sheet open={showSlidePanel} onOpenChange={setShowSlidePanel}>
        <SheetContent side="right" className="w-[calc(100vw-1.5rem)] max-w-none sm:w-[800px] lg:w-[950px] xl:w-[1100px] 2xl:w-[1200px] overflow-y-auto sm:mr-0 mr-3">
          <SheetHeader className="space-y-4 pb-6 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-xl flex items-center justify-center">
                {(() => {
                  const StepIcon = experienceSteps[activeStep].icon;
                  return <StepIcon className="h-6 w-6 text-white" />;
                })()}
              </div>
              <div>
                <SheetTitle className="text-xl text-[var(--axity-purple)]">
                  {editingExperienceIndex !== null ? 'Editar experiencia profesional' : 'Nueva experiencia profesional'}
                </SheetTitle>
                <SheetDescription className="text-sm text-[var(--axity-gray)]">
                  {experienceSteps[activeStep].title} • Paso {activeStep + 1} de {experienceSteps.length}
                </SheetDescription>
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[var(--axity-gray)]">
                <span>Progreso del formulario</span>
                <span>{Math.round(((activeStep + 1) / experienceSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((activeStep + 1) / experienceSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Step Indicators - Layout vertical compacto */}
            <div className="flex items-center justify-center px-4">
              <div className="relative flex items-end gap-6 sm:gap-8">
                {experienceSteps.map((step, index) => {

                  return (
                    <div key={step.id} className="flex flex-col items-center gap-2 relative">
                      {/* Línea conectora - antes del círculo */}
                      {index > 0 && (
                        <div
                          className={`absolute h-0.5 w-6 sm:w-8 ${index - 1 < activeStep ? 'bg-[var(--axity-mint)]' : 'bg-gray-200'}`}
                          style={{
                            left: '-18px', // Posiciona la línea a la izquierda del círculo
                            top: '16px', // Centra verticalmente con el círculo
                            transform: 'translateX(-50%)'
                          }}
                        />
                      )}

                      {/* Círculo del paso */}
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all relative z-10 ${index === activeStep
                          ? 'bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white shadow-lg'
                          : index < activeStep
                            ? 'bg-[var(--axity-mint)] text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                        {index < activeStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>

                      {/* Título del paso - debajo del círculo */}
                      <div className="text-center min-w-0">
                        <div className={`text-xs font-medium leading-tight whitespace-nowrap ${index === activeStep ? 'text-[var(--axity-purple)]' : 'text-gray-500'}`}>
                          {step.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SheetHeader>

          {/* Step Content */}
          <div className="space-y-6 px-4 lg:px-6">
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
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${experienceSteps[activeStep].color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <Building className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-[var(--axity-purple)] mb-2">
                        Información básica de la empresa
                      </h4>
                      <p className="text-sm text-[var(--axity-gray)]">
                        Datos esenciales de tu experiencia laboral
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                          <Building className="h-4 w-4" />
                          Empresa u organización
                        </Label>
                        <Input
                          placeholder="ej. Axity, Microsoft, Google"
                          value={currentExp.company}
                          onChange={(e) => setCurrentExp(prev => ({ ...prev, company: e.target.value }))}
                          className="bg-blue-50 border-blue-200 focus:border-blue-400"
                        />
                      </div>

                      <div>
                        <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                          <User className="h-4 w-4" />
                          Tu cargo o posición
                        </Label>
                        <Input
                          placeholder="ej. Senior Developer, Tech Lead"
                          value={currentExp.position}
                          onChange={(e) => setCurrentExp(prev => ({ ...prev, position: e.target.value }))}
                          className="bg-purple-50 border-purple-200 focus:border-purple-400"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4" />
                            Fecha de inicio
                          </Label>
                          <Input
                            type="month"
                            value={currentExp.startDate}
                            onChange={(e) => setCurrentExp(prev => ({ ...prev, startDate: e.target.value }))}
                            className="bg-orange-50 border-orange-200 focus:border-orange-400"
                          />
                        </div>

                        <div>
                          <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4" />
                            Fecha de finalización
                          </Label>
                          <div className="space-y-2">
                            <Input
                              type="month"
                              value={currentExp.endDate}
                              onChange={(e) => setCurrentExp(prev => ({ ...prev, endDate: e.target.value }))}
                              disabled={currentExp.current}
                              className="bg-green-50 border-green-200 focus:border-green-400 disabled:opacity-50"
                            />
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="current-panel"
                                checked={currentExp.current}
                                onCheckedChange={(checked) => setCurrentExp(prev => ({
                                  ...prev,
                                  current: !!checked,
                                  endDate: checked ? "" : prev.endDate
                                }))}
                              />
                              <Label htmlFor="current-panel" className="text-sm text-[var(--axity-gray)]">
                                Trabajo actualmente aquí
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Projects */}
                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${experienceSteps[activeStep].color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <Code2 className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-[var(--axity-purple)] mb-2">
                        Proyectos destacados
                      </h4>
                      <p className="text-sm text-[var(--axity-gray)]">
                        <span className="text-[var(--axity-magenta)] font-medium">*Obligatorio:</span> Agrega al menos un proyecto importante en el que trabajaste
                      </p>
                    </div>

                    {/* Lista de proyectos ya agregados */}
                    {currentExp.projects.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <Rocket className="h-4 w-4 text-[var(--axity-mint)]" />
                          <span className="font-medium text-[var(--axity-purple)]">
                            {currentExp.projects.length} proyecto{currentExp.projects.length !== 1 ? 's' : ''} agregado{currentExp.projects.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {currentExp.projects.map((project, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 border border-blue-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-bold text-[var(--axity-purple)] mb-1">{project.name}</h5>
                                <p className="text-sm text-[var(--axity-orange)] font-medium mb-2">{project.role}</p>
                                <p className="text-sm text-[var(--axity-gray)] mb-2 line-clamp-2">{project.responsibilities}</p>
                                {project.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {project.technologies.map((tech, techIndex) => (
                                      <Badge
                                        key={techIndex}
                                        variant="secondary"
                                        className="text-xs bg-[var(--axity-violet)]/10 text-[var(--axity-violet)]"
                                      >
                                        {tech.name}{tech.version ? ` ${tech.version}` : ''}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <Button
                                onClick={() => {
                                  const updatedProjects = currentExp.projects.filter((_, i) => i !== index);
                                  setCurrentExp(prev => ({ ...prev, projects: updatedProjects }));
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Formulario para agregar nuevo proyecto */}
                    {!showProjectForm ? (
                      <div className="text-center py-6 border-2 border-dashed border-[var(--axity-violet)]/30 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={() => setShowProjectForm(true)}
                            className="bg-axity-gradient-primary text-white shadow-lg"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {currentExp.projects.length === 0 ? 'Agregar mi primer proyecto' : 'Agregar otro proyecto'}
                          </Button>
                        </motion.div>
                        {currentExp.projects.length === 0 && (
                          <p className="text-sm text-[var(--axity-gray)] mt-2">
                            Necesitas al menos un proyecto para continuar
                          </p>
                        )}
                      </div>
                    ) : (
                      <Card className="border-[var(--axity-violet)]/20 bg-gradient-to-r from-purple-50 to-blue-50">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-[var(--axity-purple)]">Nuevo proyecto</h5>
                            <Button
                              onClick={() => {
                                setShowProjectForm(false);
                                setCurrentProject({
                                  name: "",
                                  role: "",
                                  responsibilities: "",
                                  technologies: []
                                });
                                setNewTechName("");
                                setNewTechVersion("");
                              }}
                              variant="ghost"
                              size="sm"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Nombre del proyecto */}
                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                              <Rocket className="h-4 w-4" />
                              Nombre del proyecto *
                            </Label>
                            <Input
                              placeholder="ej. Sistema de Gestión de Inventarios, App Móvil E-commerce"
                              value={currentProject.name}
                              onChange={(e) => setCurrentProject(prev => ({ ...prev, name: e.target.value }))}
                              className="bg-white border-blue-200 focus:border-blue-400"
                            />
                          </div>

                          {/* Rol en el proyecto */}
                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                              <User className="h-4 w-4" />
                              Tu rol en este proyecto *
                            </Label>
                            <Input
                              placeholder="ej. Frontend Developer, Tech Lead, Full Stack Developer"
                              value={currentProject.role}
                              onChange={(e) => setCurrentProject(prev => ({ ...prev, role: e.target.value }))}
                              className="bg-white border-purple-200 focus:border-purple-400"
                            />
                          </div>



                          {/* Responsabilidades */}
                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                              <Target className="h-4 w-4" />
                              Tus responsabilidades principales *
                            </Label>
                            <Textarea
                              placeholder="ej. Desarrollé el frontend usando React, implementé la API REST, coordiné con el equipo de diseño..."
                              value={currentProject.responsibilities}
                              onChange={(e) => setCurrentProject(prev => ({ ...prev, responsibilities: e.target.value }))}
                              className="min-h-[100px] bg-white border-orange-200 focus:border-orange-400 resize-none"
                            />
                          </div>

                          {/* Herramientas/Tecnologías */}
                          <div>
                            <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                              <Code2 className="h-4 w-4" />
                              Stack tecnológico del proyecto
                            </Label>
                            <p className="text-sm text-[var(--axity-gray)] mb-4 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                              💡 <strong>¿Qu�� agregar aquí?</strong> Enumera las tecnologías, lenguajes, frameworks, bases de datos, y herramientas que usaste específicamente en este proyecto.
                            </p>

                            {/* Lista de tecnologías agregadas */}
                            {currentProject.technologies.length > 0 && (
                              <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2 h-2 bg-[var(--axity-mint)] rounded-full"></div>
                                  <span className="text-sm font-medium text-[var(--axity-purple)]">
                                    Tecnologías agregadas ({currentProject.technologies.length})
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                                  {currentProject.technologies.map((tech, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="bg-white text-[var(--axity-violet)] border border-[var(--axity-violet)]/20 flex items-center gap-2 px-3 py-1.5 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                      <Code2 className="h-3 w-3" />
                                      <span className="font-medium">{tech.name}</span>
                                      {tech.version && (
                                        <span className="text-xs bg-[var(--axity-violet)]/10 px-1.5 py-0.5 rounded">
                                          v{tech.version}
                                        </span>
                                      )}
                                      <Button
                                        onClick={() => {
                                          const updatedTechs = currentProject.technologies.filter((_, i) => i !== index);
                                          setCurrentProject(prev => ({ ...prev, technologies: updatedTechs }));
                                        }}
                                        variant="ghost"
                                        size="sm"
                                        className="h-4 w-4 p-0 hover:bg-red-100 text-red-500 ml-1"
                                        title="Eliminar tecnología"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Formulario para agregar tecnología - Mejorado */}
                            <div className="space-y-3">
                              <div className="bg-white border-2 border-dashed border-[var(--axity-violet)]/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Plus className="h-4 w-4 text-[var(--axity-violet)]" />
                                  <span className="font-medium text-[var(--axity-purple)]">Agregar nueva tecnología</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  <div className="space-y-1">
                                    <Label className="text-xs text-[var(--axity-gray)] font-medium">
                                      Nombre *
                                    </Label>
                                    <Input
                                      placeholder="ej. React, Node.js, PostgreSQL"
                                      value={newTechName}
                                      onChange={(e) => setNewTechName(e.target.value)}
                                      className="bg-white border-[var(--axity-violet)]/20 focus:border-[var(--axity-violet)] focus:ring-[var(--axity-violet)]/20"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs text-[var(--axity-gray)] font-medium">
                                      Versión (opcional)
                                    </Label>
                                    <Input
                                      placeholder="ej. 18.2, 16.14, 14.8"
                                      value={newTechVersion}
                                      onChange={(e) => setNewTechVersion(e.target.value)}
                                      className="bg-white border-[var(--axity-violet)]/20 focus:border-[var(--axity-violet)] focus:ring-[var(--axity-violet)]/20"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <Label className="text-xs text-transparent font-medium">
                                      Acción
                                    </Label>
                                    <Button
                                      onClick={() => {
                                        if (newTechName.trim()) {
                                          const newTech = {
                                            name: newTechName.trim(),
                                            version: newTechVersion.trim() || undefined
                                          };
                                          setCurrentProject(prev => ({
                                            ...prev,
                                            technologies: [...prev.technologies, newTech]
                                          }));
                                          setNewTechName("");
                                          setNewTechVersion("");
                                        }
                                      }}
                                      disabled={!newTechName.trim()}
                                      className="w-full bg-axity-gradient-primary text-white hover:opacity-90 disabled:opacity-50"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Ejemplos de tecnologías comunes */}
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                  <p className="text-xs text-[var(--axity-gray)] mb-2">
                                    💡 <strong>Ejemplos de tecnologías comunes:</strong>
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {[
                                      "React", "Vue.js", "Angular", "Node.js", "Express", "Spring Boot",
                                      "Java", "Python", "C#", "JavaScript", "TypeScript", "PHP",
                                      "MySQL", "PostgreSQL", "MongoDB", "Redis", "AWS", "Azure",
                                      "Docker", "Kubernetes", "Git", "Jenkins", "Jira", "Figma"
                                    ].map((example) => (
                                      <button
                                        key={example}
                                        onClick={() => {
                                          if (!currentProject.technologies.find(tech => tech.name.toLowerCase() === example.toLowerCase())) {
                                            setNewTechName(example);
                                          }
                                        }}
                                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-[var(--axity-violet)]/10 hover:text-[var(--axity-violet)] transition-colors"
                                      >
                                        {example}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Botones de acción */}
                          <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button
                              onClick={() => {
                                setShowProjectForm(false);
                                setCurrentProject({
                                  name: "",
                                  role: "",
                                  responsibilities: "",
                                  technologies: []
                                });
                              }}
                              variant="outline"
                              size="sm"
                            >
                              Cancelar
                            </Button>
                            <Button
                              onClick={() => {
                                if (currentProject.name.trim() && currentProject.role.trim() && currentProject.responsibilities.trim()) {
                                  setCurrentExp(prev => ({
                                    ...prev,
                                    projects: [...prev.projects, currentProject]
                                  }));
                                  setCurrentProject({
                                    name: "",
                                    role: "",
                                    responsibilities: "",
                                    technologies: []
                                  });
                                  setShowProjectForm(false);
                                  setNewTechName("");
                                  setNewTechVersion("");

                                  showContextualSuccess(`🚀 Proyecto "${currentProject.name}" agregado exitosamente!`);
                                }
                              }}
                              disabled={!currentProject.name.trim() || !currentProject.role.trim() || !currentProject.responsibilities.trim()}
                              className="bg-axity-gradient-primary text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Guardar proyecto
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Step 2: Achievements */}
                {activeStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${experienceSteps[activeStep].color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-[var(--axity-purple)] mb-2">
                        Logros y desafíos
                      </h4>
                      <p className="text-sm text-[var(--axity-gray)]">
                        Comparte tu impacto y los retos que enfrentaste
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4" />
                          Desafíos principales resueltos
                        </Label>
                        <Textarea
                          placeholder="ej. Optimicé el rendimiento del sistema reduciendo los tiempos de carga..."
                          value={currentExp.challenges}
                          onChange={(e) => setCurrentExp(prev => ({ ...prev, challenges: e.target.value }))}
                          className="min-h-[100px] bg-red-50 border-red-200 focus:border-red-400 resize-none"
                        />
                      </div>

                      <div>
                        <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                          <Trophy className="h-4 w-4" />
                          Logros y reconocimientos
                        </Label>
                        <Textarea
                          placeholder="ej. Lideré un equipo de 5 desarrolladores implementando microservicios..."
                          value={currentExp.achievements}
                          onChange={(e) => setCurrentExp(prev => ({ ...prev, achievements: e.target.value }))}
                          className="min-h-[100px] bg-yellow-50 border-yellow-200 focus:border-yellow-400 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                onClick={prevStep}
                disabled={activeStep === 0}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Atrás
              </Button>

              <div className="flex gap-2">
                {activeStep === experienceSteps.length - 1 ? (
                  <Button
                    onClick={() => void addExperience()}
                    disabled={!canProceedStep() || savingExp || loadingServerExp}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {savingExp ? 'Guardando…' : 'Guardar experiencia'}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceedStep()}
                    className="bg-axity-gradient-primary text-white"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}