import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Briefcase, Plus, Calendar, MapPin, Edit3, Trash2, Building, Target, Users, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardExperienceStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
  addXP: (points: number, achievement?: string) => void;
}

export function DashboardExperienceStep({ data, updateData, addXP }: DashboardExperienceStepProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [currentExperience, setCurrentExperience] = useState({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    current: false,
    location: "",
    type: "Tiempo completo"
  });

  const experienceTypes = [
    "Tiempo completo",
    "Medio tiempo", 
    "Freelance",
    "Consultoría",
    "Prácticas",
    "Proyecto"
  ];

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
      current: false,
      location: "",
      type: "Tiempo completo"
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

  const getTotalExperience = () => {
    if (!data.experiences) return "0 años";
    
    let totalMonths = 0;
    data.experiences.forEach((exp: any) => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.current ? new Date() : new Date(exp.endDate);
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        totalMonths += months;
      }
    });
    
    if (totalMonths < 12) return `${totalMonths} meses`;
    
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    return remainingMonths > 0 ? `${years} años ${remainingMonths} meses` : `${years} años`;
  };

  const experienceCount = data.experiences?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">{experienceCount}</div>
            <div className="text-sm text-gray-600">Posiciones</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {data.experiences?.filter((exp: any) => exp.current).length || 0}
            </div>
            <div className="text-sm text-gray-600">Actual</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {new Set((data.experiences ?? []).map((exp: any) => exp.company)).size}
            </div>
            <div className="text-sm text-gray-600">Empresas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{getTotalExperience()}</div>
            <div className="text-sm text-gray-600">Experiencia total</div>
          </CardContent>
        </Card>
      </div>

      {/* Experience Timeline */}
      {experienceCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Tu Trayectoria Profesional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <AnimatePresence>
                {data.experiences.map((exp: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="group relative"
                  >
                    {/* Timeline connector */}
                    {index < data.experiences.length - 1 && (
                      <div className="absolute left-8 top-20 w-0.5 h-16 bg-gray-200" />
                    )}
                    
                    <div className="flex gap-6">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 mt-6">
                        <div className={`w-4 h-4 rounded-full border-4 ${
                          exp.current 
                            ? 'bg-green-400 border-green-200' 
                            : 'bg-orange-400 border-orange-200'
                        }`} />
                      </div>
                      
                      {/* Experience card */}
                      <motion.div 
                        className="flex-1 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                        whileHover={{ y: -2 }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <Building className="h-5 w-5 text-orange-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                                <p className="font-medium text-orange-700">{exp.company}</p>
                              </div>
                              {exp.current && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                  Actual
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{calculateDuration(exp.startDate, exp.endDate, exp.current)}</span>
                              </div>
                              {exp.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{exp.location}</span>
                                </div>
                              )}
                              {exp.type && (
                                <Badge variant="outline" className="text-xs">
                                  {exp.type}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editExperience(index)}
                              className="p-2 hover:bg-blue-100 rounded-lg"
                            >
                              <Edit3 className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(index)}
                              className="p-2 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>

                        {exp.description && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {exp.description}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Experience Form */}
      <Card className={showForm ? "border-2 border-orange-200" : "border-dashed border-2 border-orange-200"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-orange-600" />
            {editingIndex >= 0 ? "Editar Experiencia" : "Agregar Nueva Experiencia"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showForm && editingIndex === -1 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Comparte tu Experiencia Profesional</h3>
              <p className="text-gray-600 mb-6">
                Cada proyecto y trabajo cuenta una historia. Comparte la tuya.
              </p>
              <Button 
                onClick={() => setShowForm(true)} 
                className="bg-gradient-to-r from-orange-500 to-red-500"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Experiencia
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Basic Company & Position */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Empresa *</Label>
                  <Input
                    placeholder="Nombre de la empresa"
                    value={currentExperience.company}
                    onChange={(e) => updateCurrentExperience("company", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo/Posición *</Label>
                  <Input
                    placeholder="Tu rol en la empresa"
                    value={currentExperience.position}
                    onChange={(e) => updateCurrentExperience("position", e.target.value)}
                  />
                </div>
              </div>

              {/* Dates and Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Fecha de inicio</Label>
                  <Input
                    type="month"
                    value={currentExperience.startDate}
                    onChange={(e) => updateCurrentExperience("startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha de fin</Label>
                  <Input
                    type="month"
                    value={currentExperience.endDate}
                    onChange={(e) => updateCurrentExperience("endDate", e.target.value)}
                    disabled={currentExperience.current}
                    className="disabled:bg-gray-50"
                  />
                  <div className="flex items-center space-x-2 mt-2">
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
                <div className="space-y-2">
                  <Label>Ubicación</Label>
                  <Input
                    placeholder="Ciudad, País"
                    value={currentExperience.location}
                    onChange={(e) => updateCurrentExperience("location", e.target.value)}
                  />
                </div>
              </div>

              {/* Experience Type */}
              <div className="space-y-2">
                <Label>Tipo de empleo</Label>
                <div className="flex flex-wrap gap-2">
                  {experienceTypes.map(type => (
                    <Button
                      key={type}
                      variant={currentExperience.type === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateCurrentExperience("type", type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Descripción del rol</Label>
                <Textarea
                  placeholder="Describe tus responsabilidades principales, proyectos destacados y logros obtenidos..."
                  value={currentExperience.description}
                  onChange={(e) => updateCurrentExperience("description", e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  💡 Incluye métricas específicas, tecnologías utilizadas y resultados obtenidos
                </p>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={addExperience}
                  className="bg-gradient-to-r from-orange-500 to-red-500"
                  disabled={!currentExperience.company || !currentExperience.position}
                >
                  {editingIndex >= 0 ? "Actualizar Experiencia" : "Guardar Experiencia"}
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-orange-900 mb-3">🚀 Maximiza el impacto de tu experiencia</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-orange-800">
                <div>
                  <p className="font-medium mb-2">✨ Incluye siempre:</p>
                  <ul className="space-y-1">
                    <li>• Métricas específicas y resultados cuantificables</li>
                    <li>• Tecnologías y frameworks utilizados</li>
                    <li>• Proyectos destacados y su impacto</li>
                    <li>• Logros y reconocimientos obtenidos</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">🎯 Enfócate en:</p>
                  <ul className="space-y-1">
                    <li>• Impacto en el equipo y la empresa</li>
                    <li>• Liderazgo y colaboración demostrada</li>
                    <li>• Solución de problemas complejos</li>
                    <li>• Crecimiento y aprendizaje continuo</li>
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