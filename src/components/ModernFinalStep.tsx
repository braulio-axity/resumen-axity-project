import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  CheckCircle, 
  Rocket, 
  User, 
  Code2, 
  Briefcase, 
  Award, 
  Sparkles,
  TrendingUp,
  Target,
  Calendar,
  Mail,
  MapPin
} from "lucide-react";
import { motion } from "motion/react";

interface ModernFinalStepProps {
  data: any;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ModernFinalStep({ data, onSubmit, isSubmitting }: ModernFinalStepProps) {
  const getSummaryStats = () => {
    return {
      skills: data.skills?.length || 0,
      experiences: data.experiences?.length || 0,
      education: data.education?.length || 0,
      certifications: data.certifications?.length || 0,
    };
  };

  const stats = getSummaryStats();
  const totalSections = 4;
  const completedSections = [
    stats.skills > 0,
    stats.experiences > 0, 
    stats.education > 0,
    stats.certifications > 0
  ].filter(Boolean).length;
  
  const completionPercentage = (completedSections / totalSections) * 100;

  const getCompletionLevel = () => {
    if (completionPercentage === 100) return { label: "Perfil Completo", color: "text-green-600", bg: "bg-green-50" };
    if (completionPercentage >= 75) return { label: "Casi Completo", color: "text-blue-600", bg: "bg-blue-50" };
    if (completionPercentage >= 50) return { label: "En Progreso", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { label: "Necesita Atención", color: "text-red-600", bg: "bg-red-50" };
  };

  const completion = getCompletionLevel();

  const getSkillCategories = () => {
    if (!data.skills) return {};
    
    const categories = {};
    data.skills.forEach(skill => {
      const category = skill.category || 'other';
      if (!categories[category]) categories[category] = [];
      categories[category].push(skill);
    });
    
    return categories;
  };

  const skillCategories = getSkillCategories();

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800">¡Perfil Profesional Listo!</h2>
                <p className="text-green-700">
                  Tu información está preparada para conectarte con las mejores oportunidades en Axity.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Completion Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Estado de Completitud</h3>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${completion.bg}`}>
                  <div className={`w-2 h-2 rounded-full ${completion.color.replace('text-', 'bg-')}`} />
                  <span className={`text-sm font-medium ${completion.color}`}>
                    {completion.label}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{Math.round(completionPercentage)}%</div>
                <div className="text-sm text-muted-foreground">Completado</div>
              </div>
            </div>

            <div className="mb-6">
              <Progress value={completionPercentage} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{completedSections} de {totalSections} secciones</span>
                <span>{completionPercentage === 100 ? "¡Excelente!" : "Continúa agregando información"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Code2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-900">{stats.skills}</div>
                <div className="text-sm text-blue-700">Habilidades</div>
                {stats.skills === 0 && <div className="text-xs text-blue-600 mt-1">Recomendado: 5+</div>}
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-200">
                <Briefcase className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-orange-900">{stats.experiences}</div>
                <div className="text-sm text-orange-700">Experiencias</div>
                {stats.experiences === 0 && <div className="text-xs text-orange-600 mt-1">Mínimo: 1</div>}
              </div>
              
              <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <Award className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                <div className="text-2xl font-bold text-emerald-900">{stats.education}</div>
                <div className="text-sm text-emerald-700">Educación</div>
                {stats.education === 0 && <div className="text-xs text-emerald-600 mt-1">Opcional</div>}
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-900">{stats.certifications}</div>
                <div className="text-sm text-purple-700">Certificaciones</div>
                {stats.certifications === 0 && <div className="text-xs text-purple-600 mt-1">Recomendado</div>}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-[var(--axity-purple)]" />
              Resumen de tu Perfil Profesional
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gradient-to-r from-[var(--axity-purple)]/10 to-[var(--axity-violet)]/10 p-4 rounded-xl border border-[var(--axity-purple)]/20">
              <h4 className="font-semibold mb-3 text-[var(--axity-purple)]">Información del Consultor</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{data.firstName} {data.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{data.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">ID: {data.employeeId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {data.location === 'cdmx' ? 'Ciudad de México' : data.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Summary */}
            {data.skills && data.skills.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-blue-600" />
                  Stack Tecnológico Principal
                </h4>
                <div className="space-y-3">
                  {Object.entries(skillCategories).map(([category, skills]) => {
                    if (!skills.length) return null;
                    
                    const categoryNames = {
                      frontend: "Frontend",
                      backend: "Backend", 
                      database: "Base de Datos",
                      cloud: "Cloud & DevOps",
                      design: "Design & UX",
                      data: "Data & Analytics",
                      other: "Otras"
                    };
                    
                    return (
                      <div key={category} className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-2">
                          {categoryNames[category] || "Otras"}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {skills.slice(0, 6).map((skill, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="bg-white text-blue-800 border-blue-200"
                            >
                              {skill.name}
                            </Badge>
                          ))}
                          {skills.length > 6 && (
                            <Badge variant="outline" className="border-blue-300 text-blue-700">
                              +{skills.length - 6} más
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
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-orange-600" />
                  Experiencia Más Reciente
                </h4>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="font-medium text-orange-900">{data.experiences[0].position}</div>
                  <div className="text-orange-700">{data.experiences[0].company}</div>
                  {data.experiences[0].current && (
                    <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                      Posición Actual
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Achievements */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">Nivel de Perfil</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-yellow-700">Habilidades registradas:</span>
                  <div className="font-semibold text-yellow-900">{stats.skills} tecnologías</div>
                </div>
                <div>
                  <span className="text-yellow-700">Experiencia total:</span>
                  <div className="font-semibold text-yellow-900">{stats.experiences} posiciones</div>
                </div>
                <div>
                  <span className="text-yellow-700">Formación académica:</span>
                  <div className="font-semibold text-yellow-900">{stats.education} títulos</div>
                </div>
                <div>
                  <span className="text-yellow-700">Certificaciones:</span>
                  <div className="font-semibold text-yellow-900">{stats.certifications} badges</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Submit Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-axity-gradient-primary text-white shadow-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Rocket className="h-12 w-12" />
            </motion.div>
            
            <h3 className="text-2xl font-bold mb-2">¿Listo para el Lanzamiento?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Tu perfil profesional actualizado será visible para Project Managers y Tech Leads de Axity. 
              Esto nos permitirá conectarte con proyectos que se alineen perfectamente con tu experiencia y objetivos de carrera.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 text-white/80">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Información verificada</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Actualización automática</span>
              </div>
            </div>
            
            <Button 
              onClick={onSubmit} 
              size="lg" 
              disabled={isSubmitting}
              className="bg-white text-[var(--axity-purple)] hover:bg-white/90 font-semibold shadow-lg px-8 py-3"
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              ) : (
                <Rocket className="h-5 w-5 mr-2" />
              )}
              {isSubmitting ? "Actualizando perfil..." : "🚀 Actualizar mi Perfil Profesional"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Legal Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Card className="bg-gray-50/80 backdrop-blur-sm border-gray-200">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              Al actualizar tu perfil, confirmas que la información proporcionada es veraz y actual. 
              Este perfil será utilizado exclusivamente para asignación de proyectos y desarrollo 
              profesional dentro de Axity, siguiendo nuestras políticas de privacidad.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}