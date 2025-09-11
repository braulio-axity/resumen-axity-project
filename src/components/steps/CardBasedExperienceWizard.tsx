import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Plus,
  Building,
  Calendar,
  Code2,
  Target,
  Trophy,
  User,
  MapPin,
  Clock,
  Save,
  ArrowLeft,
  CheckCircle,
  GripVertical,
  Eye,
  EyeOff,
  Briefcase,
  Rocket,
  Activity,
  Layers,
  Grid3X3,
  Layout,
  Minimize2,
  Search,
} from "lucide-react";

interface ExperienceStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (type: string, message: string, description?: string, icon?: string, context?: string) => void;
  streakCounter: any;
  setStreakCounter: (fn: (prev: any) => any) => void;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  challenges: string;
  achievements: string;
  technologies: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: Array<{
      name: string;
      version?: string;
    }>;
  }>;
  priority: number;
  visibility: 'public' | 'internal' | 'private';
  tags: string[];
}

type ViewMode = 'cards' | 'timeline' | 'grid' | 'minimal';
type FormStep = 'overview' | 'basic' | 'projects' | 'details' | 'review';

export function CardBasedExperienceWizard({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
}: ExperienceStepProps) {
  const [experiences, setExperiences] = useState<Experience[]>(
    formData.experiences?.map((exp: any, index: number) => ({
      ...exp,
      id: exp.id || `exp-${Date.now()}-${index}`,
      priority: index,
      visibility: 'public',
      tags: []
    })) || []
  );
  
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'position'>('date');
  const [showPreview, setShowPreview] = useState(false);

  const createNewExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      challenges: "",
      achievements: "",
      technologies: [],
      projects: [],
      priority: experiences.length,
      visibility: 'public',
      tags: []
    };
    setSelectedExp(newExp);
    setIsCreating(true);
    setFormStep('basic');
  };

  const saveExperience = () => {
    if (!selectedExp) return;

    if (isCreating) {
      const newExperiences = [...experiences, selectedExp];
      setExperiences(newExperiences);
      updateFormData("experiences", newExperiences);
      addProgress(25);
      addMotivationalMessage(
        'experience',
        '¡Nueva experiencia creada! 🎉',
        `${selectedExp.position} en ${selectedExp.company}`,
        '💼'
      );
    } else {
      const updatedExperiences = experiences.map(exp => 
        exp.id === selectedExp.id ? selectedExp : exp
      );
      setExperiences(updatedExperiences);
      updateFormData("experiences", updatedExperiences);
      addMotivationalMessage(
        'experience',
        '¡Experiencia actualizada! ✨',
        'Cambios guardados exitosamente',
        '✅'
      );
    }

    setSelectedExp(null);
    setIsCreating(false);
    setFormStep('overview');
  };

  const getDuration = (startDate: string, endDate: string, current: boolean) => {
    if (!startDate) return "";
    const start = new Date(startDate + "-01");
    const end = current ? new Date() : new Date(endDate + "-01");
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const years = Math.floor(months / 12);
    
    if (years > 0) {
      const remainingMonths = months % 12;
      return remainingMonths > 0 
        ? `${years}a ${remainingMonths}m`
        : `${years} año${years > 1 ? 's' : ''}`;
    }
    return `${months} mes${months > 1 ? 'es' : ''}`;
  };

  const filteredExperiences = experiences.filter(exp =>
    exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.position.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      case 'company':
        return a.company.localeCompare(b.company);
      case 'position':
        return a.position.localeCompare(b.position);
      default:
        return 0;
    }
  });

  const renderExperienceCard = (exp: Experience, index: number) => (
    <motion.div
      key={exp.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      className="group"
    >
      <Card className="h-full hover:shadow-xl transition-all duration-300 border-l-4 border-l-[var(--axity-purple)] bg-gradient-to-br from-white to-purple-50/30 cursor-pointer"
        onClick={() => {
          setSelectedExp(exp);
          setIsCreating(false);
          setFormStep('basic');
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Building className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[var(--axity-purple)] text-sm line-clamp-1">{exp.position}</h4>
                  <p className="text-xs text-[var(--axity-orange)]">{exp.company}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{exp.startDate} - {exp.current ? 'Presente' : exp.endDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{getDuration(exp.startDate, exp.endDate, exp.current)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {exp.current && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs px-1.5 py-0.5">
                  Actual
                </Badge>
              )}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Technologies */}
          {exp.technologies.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {exp.technologies.slice(0, 3).map((tech, techIndex) => (
                  <Badge
                    key={techIndex}
                    className="text-xs bg-blue-100 text-blue-800 border-blue-200 px-1.5 py-0.5"
                  >
                    {tech}
                  </Badge>
                ))}
                {exp.technologies.length > 3 && (
                  <Badge className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5">
                    +{exp.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-purple-50 rounded-lg p-2">
              <div className="text-xs font-bold text-[var(--axity-purple)]">{exp.projects.length}</div>
              <div className="text-xs text-gray-600">Proyectos</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-2">
              <div className="text-xs font-bold text-[var(--axity-orange)]">{exp.technologies.length}</div>
              <div className="text-xs text-gray-600">Tecnologías</div>
            </div>
            <div className="bg-green-50 rounded-lg p-2">
              <div className="text-xs font-bold text-green-600">{exp.challenges ? '✓' : '○'}</div>
              <div className="text-xs text-gray-600">Desafíos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderExperienceForm = () => {
    if (!selectedExp) return null;

    return (
      <div className="space-y-6">
        {/* Form Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                setSelectedExp(null);
                setIsCreating(false);
                setFormStep('overview');
              }}
              variant="ghost"
              size="sm"
              className="text-gray-600"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver
            </Button>
            <div>
              <h3 className="text-lg font-bold text-[var(--axity-purple)]">
                {isCreating ? 'Nueva experiencia' : 'Editar experiencia'}
              </h3>
              <p className="text-sm text-gray-600">
                {isCreating ? 'Crea una nueva entrada en tu historial profesional' : 'Modifica los detalles de esta experiencia'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowPreview(!showPreview)}
              variant="outline"
              size="sm"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            
            <Button
              onClick={saveExperience}
              disabled={!selectedExp.company || !selectedExp.position}
              className="bg-[var(--axity-purple)] hover:bg-[var(--axity-violet)] text-white"
            >
              <Save className="h-4 w-4 mr-1" />
              {isCreating ? 'Crear' : 'Guardar'}
            </Button>
          </div>
        </div>

        {/* Form Tabs */}
        <Tabs value={formStep} onValueChange={(value) => setFormStep(value as FormStep)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="basic" className="text-xs">
              <Building className="h-3 w-3 mr-1" />
              Básico
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-xs">
              <Code2 className="h-3 w-3 mr-1" />
              Proyectos
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Detalles
            </TabsTrigger>
            <TabsTrigger value="review" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Revisar
            </TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                  <Building className="h-4 w-4" />
                  Empresa u organización
                </Label>
                <Input
                  placeholder="ej. Axity, Microsoft, Google"
                  value={selectedExp.company}
                  onChange={(e) => setSelectedExp(prev => prev ? { ...prev, company: e.target.value } : null)}
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
                  value={selectedExp.position}
                  onChange={(e) => setSelectedExp(prev => prev ? { ...prev, position: e.target.value } : null)}
                  className="bg-purple-50 border-purple-200 focus:border-purple-400"
                />
              </div>

              <div>
                <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de inicio
                </Label>
                <Input
                  type="month"
                  value={selectedExp.startDate}
                  onChange={(e) => setSelectedExp(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                  className="bg-orange-50 border-orange-200 focus:border-orange-400"
                />
              </div>

              <div>
                <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de finalización
                </Label>
                <Input
                  type="month"
                  value={selectedExp.endDate}
                  onChange={(e) => setSelectedExp(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                  disabled={selectedExp.current}
                  className="bg-orange-50 border-orange-200 focus:border-orange-400"
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="current-position"
                    checked={selectedExp.current}
                    onChange={(e) => setSelectedExp(prev => prev ? { ...prev, current: e.target.checked } : null)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="current-position" className="text-sm text-gray-600">
                    Trabajo actualmente aquí 💼
                  </Label>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                <Code2 className="h-4 w-4" />
                Tecnologías principales
              </Label>
              <Input
                placeholder="React, Node.js, PostgreSQL (separadas por comas)"
                value={selectedExp.technologies.join(', ')}
                onChange={(e) => {
                  const techs = e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech);
                  setSelectedExp(prev => prev ? { ...prev, technologies: techs } : null);
                }}
                className="bg-green-50 border-green-200 focus:border-green-400"
              />
              {selectedExp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedExp.technologies.map((tech, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-[var(--axity-purple)] mb-2">
                Proyectos desarrollados
              </h4>
              <p className="text-gray-600 mb-6">
                Agrega los proyectos específicos en los que participaste
              </p>
              
              <Button
                onClick={() => {
                  // Lógica para agregar proyecto
                }}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar proyecto
              </Button>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4" />
                  Desafíos técnicos resueltos
                </Label>
                <Textarea
                  placeholder="Describe los problemas complejos que abordaste..."
                  value={selectedExp.challenges}
                  onChange={(e) => setSelectedExp(prev => prev ? { ...prev, challenges: e.target.value } : null)}
                  rows={6}
                  className="bg-red-50 border-red-200 focus:border-red-400 resize-none"
                />
              </div>

              <div>
                <Label className="text-[var(--axity-purple)] font-medium flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4" />
                  Resultados y logros obtenidos
                </Label>
                <Textarea
                  placeholder="Resultados medibles: mejoras de rendimiento, proyectos exitosos..."
                  value={selectedExp.achievements}
                  onChange={(e) => setSelectedExp(prev => prev ? { ...prev, achievements: e.target.value } : null)}
                  rows={6}
                  className="bg-yellow-50 border-yellow-200 focus:border-yellow-400 resize-none"
                />
              </div>
            </div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <h4 className="font-bold text-[var(--axity-purple)] flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Vista previa de experiencia
                </h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">{selectedExp.position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-600" />
                      <span>{selectedExp.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span>{selectedExp.startDate} - {selectedExp.current ? 'Presente' : selectedExp.endDate}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">Tecnologías:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedExp.technologies.map((tech, index) => (
                        <Badge key={index} className="text-xs bg-blue-100 text-blue-800">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <Layout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[var(--axity-purple)]">
              Gestión Visual de Experiencias
            </h3>
            <p className="text-[var(--axity-gray)]">
              Organiza y edita tu trayectoria profesional de forma visual e intuitiva
            </p>
          </div>
        </motion.div>
      </div>

      {selectedExp && (formStep !== 'overview') ? (
        renderExperienceForm()
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar experiencias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Sort */}
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'date' | 'company' | 'position')}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="date">Ordenar por fecha</option>
                <option value="company">Ordenar por empresa</option>
                <option value="position">Ordenar por posición</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                {[
                  { mode: 'cards', icon: Grid3X3, label: 'Cards' },
                  { mode: 'timeline', icon: Activity, label: 'Timeline' },
                  { mode: 'grid', icon: Layers, label: 'Grid' },
                  { mode: 'minimal', icon: Minimize2, label: 'Minimal' }
                ].map(({ mode, icon: Icon, label }) => (
                  <Button
                    key={mode}
                    onClick={() => setViewMode(mode as ViewMode)}
                    variant={viewMode === mode ? "default" : "ghost"}
                    size="sm"
                    className={`text-xs ${viewMode === mode ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>

              <Button
                onClick={createNewExperience}
                className="bg-axity-gradient-accent text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva experiencia
              </Button>
            </div>
          </div>

          {/* Stats */}
          {experiences.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-[var(--axity-purple)]">{experiences.length}</div>
                <div className="text-sm text-gray-600">Experiencias</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-[var(--axity-orange)]">
                  {experiences.reduce((sum, exp) => sum + exp.technologies.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Tecnologías</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-[var(--axity-mint)]">
                  {experiences.reduce((sum, exp) => sum + exp.projects.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Proyectos</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">
                  {experiences.filter(exp => exp.current).length}
                </div>
                <div className="text-sm text-gray-600">Actuales</div>
              </Card>
            </div>
          )}

          {/* Experience List */}
          {experiences.length > 0 ? (
            <div className={`grid gap-4 ${
              viewMode === 'cards' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' :
              viewMode === 'timeline' ? 'grid-cols-1' :
              'grid-cols-1'
            }`}>
              <AnimatePresence>
                {filteredExperiences.map((exp, index) => (
                  <div key={exp.id}>
                    {renderExperienceCard(exp, index)}
                  </div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-orange-200">
                  <Briefcase className="h-16 w-16 text-[var(--axity-orange)]" />
                </div>
              </motion.div>
              <h4 className="text-2xl font-bold text-[var(--axity-purple)] mb-3">
                ¡Comienza a construir tu historial! 🚀
              </h4>
              <p className="text-[var(--axity-gray)] mb-6">
                Crea tu primera experiencia profesional con nuestro editor visual
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={createNewExperience}
                  size="lg"
                  className="bg-axity-gradient-accent text-white shadow-xl px-8 py-4"
                >
                  <Plus className="h-6 w-6 mr-3" />
                  Crear mi primera experiencia ✨
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}