import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Briefcase, Plus, Calendar, MapPin, Edit3, Trash2, Building, Target, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WizardExperienceStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
  addXP: (points: number, achievement?: string) => void;
}

export function WizardExperienceStep({ data, updateData, addXP }: WizardExperienceStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [currentExperience, setCurrentExperience] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    current: false
  });

  const addExperience = () => {
    if (currentExperience.company && currentExperience.position) {
      const experiences = data.experiences || [];
      if (editingIndex >= 0) {
        experiences[editingIndex] = currentExperience;
        updateData("experiences", experiences);
        setEditingIndex(-1);
      } else {
        updateData("experiences", [...experiences, currentExperience]);
        addXP(30);
        
        if (experiences.length + 1 === 1) {
          addXP(20, "Primera Experiencia");
        } else if (experiences.length + 1 >= 3) {
          addXP(40, "Senior Developer");
        }
      }
      
      resetForm();
    }
  };

  const editExperience = (index: number) => {
    const experiences = data.experiences || [];
    setCurrentExperience(experiences[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const removeExperience = (index: number) => {
    const experiences = data.experiences || [];
    updateData("experiences", experiences.filter((_: any, i: number) => i !== index));
  };

  const resetForm = () => {
    setCurrentExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      current: false
    });
    setShowForm(false);
    setEditingIndex(-1);
  };

  const updateCurrentExperience = (field: string, value: any) => {
    setCurrentExperience(prev => ({ ...prev, [field]: value }));
  };

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
    
    if (months < 12) {
      return `${months} meses`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return remainingMonths > 0 ? `${years} años ${remainingMonths} meses` : `${years} años`;
    }
  };

  const experienceCount = data.experiences?.length || 0;

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full"
        >
          <Briefcase className="h-4 w-4" />
          <span className="font-medium">
            {experienceCount === 0 ? "Comparte tu trayectoria profesional" : `${experienceCount} experiencias registradas`}
          </span>
        </motion.div>
      </div>

      {/* Current Experiences */}
      {data.experiences && data.experiences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            Tu Trayectoria Profesional
          </h3>
          
          <div className="space-y-4">
            <AnimatePresence>
              {data.experiences.map((exp: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -2 }}
                  className="group"
                >
                  <Card className="shadow-lg hover:shadow-xl transition-all border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <Building className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">{exp.position}</h4>
                              <p className="font-medium text-orange-700">{exp.company}</p>
                            </div>
                            {exp.current && (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                Actual
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{calculateDuration(exp.startDate, exp.endDate, exp.current)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editExperience(index)}
                            className="h-8 w-8 p-0 hover:bg-blue-100 rounded-lg"
                          >
                            <Edit3 className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(index)}
                            className="h-8 w-8 p-0 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {exp.description && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {exp.description}
                          </p>
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

      {/* Add Experience Form */}
      {!showForm ? (
        <Card className="border-2 border-dashed border-orange-200 hover:border-orange-300 transition-colors">
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Agregar Experiencia Profesional</h3>
              <p className="text-muted-foreground">
                Cada proyecto y trabajo cuenta una historia. Comparte la tuya.
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(true)} 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 shadow-lg"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Comenzar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-xl border-0">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Plus className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg">
                  {editingIndex >= 0 ? "Editar Experiencia" : "Nueva Experiencia Profesional"}
                </h3>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Empresa *</Label>
                    <Input
                      placeholder="Nombre de la empresa"
                      value={currentExperience.company}
                      onChange={(e) => updateCurrentExperience("company", e.target.value)}
                      className="bg-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Cargo/Posición *</Label>
                    <Input
                      placeholder="Tu rol en la empresa"
                      value={currentExperience.position}
                      onChange={(e) => updateCurrentExperience("position", e.target.value)}
                      className="bg-white shadow-sm"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fecha de inicio</Label>
                    <Input
                      type="month"
                      value={currentExperience.startDate}
                      onChange={(e) => updateCurrentExperience("startDate", e.target.value)}
                      className="bg-white shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fecha de fin</Label>
                    <Input
                      type="month"
                      value={currentExperience.endDate}
                      onChange={(e) => updateCurrentExperience("endDate", e.target.value)}
                      disabled={currentExperience.current}
                      className="bg-white shadow-sm disabled:bg-gray-50"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <input
                        type="checkbox"
                        id="current"
                        checked={currentExperience.current}
                        onChange={(e) => updateCurrentExperience("current", e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="current" className="text-sm font-normal text-gray-700">
                        Es mi trabajo actual
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Descripción del rol</Label>
                  <Textarea
                    placeholder="Describe tus responsabilidades principales, proyectos destacados y logros obtenidos..."
                    value={currentExperience.description}
                    onChange={(e) => updateCurrentExperience("description", e.target.value)}
                    rows={4}
                    className="bg-white shadow-sm resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Incluye métricas específicas y tecnologías utilizadas
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={addExperience}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 shadow-lg"
                    disabled={!currentExperience.company || !currentExperience.position}
                  >
                    {editingIndex >= 0 ? "Actualizar Experiencia" : "Guardar Experiencia"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Tips */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-900 mb-3">🚀 Maximiza el impacto de tu experiencia</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-800">
                <div>
                  <p className="font-medium mb-1">✨ Incluye:</p>
                  <ul className="space-y-1">
                    <li>• Métricas específicas y resultados</li>
                    <li>• Tecnologías y frameworks utilizados</li>
                    <li>• Proyectos destacados</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">🎯 Enfócate en:</p>
                  <ul className="space-y-1">
                    <li>• Impacto en el equipo/empresa</li>
                    <li>• Liderazgo y colaboración</li>
                    <li>• Solución de problemas complejos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}