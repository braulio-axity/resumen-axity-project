import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Briefcase, Plus, Calendar, Edit3, Trash2, Building, Users, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ModernExperienceStepProps {
  data: any; // si puedes, tipa esto a { experiences?: Experience[] }
  updateData: (field: string, value: any) => void;
  addXP: (points: number, achievement?: string) => void;
}

type Experience = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
  achievements: string[];
  current: boolean;
};

export function ModernExperienceStep({ data, updateData, addXP }: ModernExperienceStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const [currentExperience, setCurrentExperience] = useState<Experience>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    technologies: [],
    achievements: [],
    current: false
  });

  const addExperience = () => {
    if (currentExperience.company && currentExperience.position) {
      const experiences: Experience[] = (data.experiences as Experience[]) || [];
      if (editingIndex >= 0) {
        const copy = [...experiences];
        copy[editingIndex] = currentExperience;
        updateData("experiences", copy);
        setEditingIndex(-1);
      } else {
        updateData("experiences", [...experiences, currentExperience]);
        addXP(25);
        const nextCount = experiences.length + 1;
        if (nextCount === 1) addXP(15, "Primera Experiencia");
        else if (nextCount >= 3) addXP(30, "Senior Developer");
      }
      resetForm();
    }
  };

  const editExperience = (index: number) => {
    const experiences: Experience[] = (data.experiences as Experience[]) || [];
    setCurrentExperience(experiences[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const removeExperience = (index: number) => {
    const experiences: Experience[] = (data.experiences as Experience[]) || [];
    updateData(
      "experiences",
      experiences.filter((_, i) => i !== index)
    );
  };

  const resetForm = () => {
    setCurrentExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: [],
      achievements: [],
      current: false
    });
    setShowForm(false);
    setEditingIndex(-1);
  };

  const updateCurrentExperience = <K extends keyof Experience>(field: K, value: Experience[K]) => {
    setCurrentExperience(prev => ({ ...prev, [field]: value }));
  };

  // const addTechnology = (tech: string) => {
  //   if (tech && !currentExperience.technologies.includes(tech)) {
  //     updateCurrentExperience("technologies", [...currentExperience.technologies, tech]);
  //   }
  // };

  // const addAchievement = (achievement: string) => {
  //   if (achievement && !currentExperience.achievements.includes(achievement)) {
  //     updateCurrentExperience("achievements", [...currentExperience.achievements, achievement]);
  //   }
  // };

  const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
    const formatDate = (date: string) => {
      if (!date) return "";
      const [year, month] = date.split("-");
      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      return `${months[parseInt(month) - 1]} ${year}`;
    };
    const start = formatDate(startDate);
    const end = current ? "Presente" : formatDate(endDate);
    return `${start} - ${end}`;
  };

  const calculateDuration = (startDate: string, endDate: string, current: boolean) => {
    if (!startDate) return "";
    const start = new Date(startDate);
    const end = current ? new Date() : new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths > 0 ? `${years} años ${remainingMonths} meses` : `${years} años`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-white/80 to-orange-50/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Experiencia Profesional</h2>
                <p className="text-muted-foreground">
                  Comparte tu trayectoria profesional. Cada proyecto es una historia de crecimiento.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Current Experiences */}
      {data.experiences && (data.experiences as Experience[]).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Building className="h-5 w-5 text-[var(--axity-orange)]" />
            Tu Experiencia {(data.experiences as Experience[]).length ? `(${(data.experiences as Experience[]).length})` : ""}
          </h3>

          <div className="space-y-4">
            <AnimatePresence>
              {(data.experiences as Experience[]).map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                            {exp.current && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">Actual</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              <span className="font-medium">{exp.company}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{calculateDuration(exp.startDate, exp.endDate, exp.current)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => editExperience(index)} className="h-8 w-8 p-0 hover:bg-blue-100">
                            <Edit3 className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeExperience(index)} className="h-8 w-8 p-0 hover:bg-red-100">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {exp.description && <p className="text-sm text-gray-700 mb-4 leading-relaxed">{exp.description}</p>}

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Tecnologías</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium">Logros</span>
                          </div>
                          <ul className="space-y-1">
                            {exp.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="text-sm text-gray-700 flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {!showForm ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <Button onClick={() => setShowForm(true)} className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 shadow-lg" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Agregar Experiencia Profesional
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <h3 className="font-semibold flex items-center gap-2">
                <Plus className="h-5 w-5 text-[var(--axity-orange)]" />
                {editingIndex >= 0 ? "Editar Experiencia" : "Nueva Experiencia"}
              </h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Empresa *</Label>
                  <Input
                    placeholder="Nombre de la empresa"
                    value={currentExperience.company}
                    onChange={(e) => updateCurrentExperience("company", e.target.value)}
                    className="bg-white border-0 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo *</Label>
                  <Input
                    placeholder="Tu posición/rol"
                    value={currentExperience.position}
                    onChange={(e) => updateCurrentExperience("position", e.target.value)}
                    className="bg-white border-0 shadow-sm"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de inicio</Label>
                  <Input
                    type="month"
                    value={currentExperience.startDate}
                    onChange={(e) => updateCurrentExperience("startDate", e.target.value)}
                    className="bg-white border-0 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de fin</Label>
                  <Input
                    type="month"
                    value={currentExperience.endDate}
                    onChange={(e) => updateCurrentExperience("endDate", e.target.value)}
                    disabled={currentExperience.current}
                    className="bg-white border-0 shadow-sm disabled:bg-gray-50"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="current"
                      checked={currentExperience.current}
                      onChange={(e) => updateCurrentExperience("current", e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="current" className="text-sm font-normal">
                      Es mi trabajo actual
                    </Label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Descripción del rol</Label>
                <Textarea
                  placeholder="Describe tus responsabilidades principales, proyectos destacados y el impacto de tu trabajo..."
                  value={currentExperience.description}
                  onChange={(e) => updateCurrentExperience("description", e.target.value)}
                  rows={4}
                  className="bg-white border-0 shadow-sm resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={addExperience}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 shadow-lg"
                  disabled={!currentExperience.company || !currentExperience.position}
                >
                  {editingIndex >= 0 ? "Actualizar" : "Guardar"} Experiencia
                </Button>
                <Button variant="outline" onClick={resetForm} className="border-gray-200 hover:bg-gray-50">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-900 mb-2">Consejos para destacar tu experiencia</h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Incluye métricas y resultados específicos (ej: "Mejoré el rendimiento en 30%")</li>
                  <li>• Menciona tecnologías y frameworks utilizados</li>
                  <li>• Destaca el impacto de tu trabajo en el equipo o la empresa</li>
                  <li>• Incluye proyectos freelance o colaboraciones relevantes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
