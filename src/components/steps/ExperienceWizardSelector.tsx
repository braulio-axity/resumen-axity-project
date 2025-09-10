import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { 
  MessageCircle,
  Layout,
  Activity,
  ChevronRight,
  Star,
  Zap,
  Users,
  BarChart3,
  Settings,
  ArrowLeft,
  Sparkles,
  Award,
  CheckCircle,
  Circle,
  Eye,
  Code2,
  Briefcase,
  Target
} from "lucide-react";

// Import the different wizard implementations
import { NewExperienceStep } from "./NewExperienceStep";
import { ConversationalExperienceWizard } from "./ConversationalExperienceWizard";
import { CardBasedExperienceWizard } from "./CardBasedExperienceWizard";

interface ExperienceStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (type: string, message: string, description?: string, icon?: string, context?: string) => void;
  streakCounter: any;
  setStreakCounter: (fn: (prev: any) => any) => void;
}

type WizardType = 'timeline' | 'conversational' | 'cards' | null;

interface WizardOption {
  id: WizardType;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
  difficulty: 'Fácil' | 'Moderado' | 'Avanzado';
  timeEstimate: string;
  userType: string;
  pros: string[];
  preview: string;
}

export function ExperienceWizardSelector(props: ExperienceStepProps) {
  const [selectedWizard, setSelectedWizard] = useState<WizardType>(null);
  const [showComparison, setShowComparison] = useState(false);

  const wizardOptions: WizardOption[] = [
    {
      id: 'timeline',
      name: 'Timeline Interactivo',
      description: 'Visualiza tu experiencia en una línea de tiempo moderna con cards expandibles',
      icon: Activity,
      color: 'from-purple-500 to-violet-600',
      features: [
        'Línea de tiempo visual',
        'Cards expandibles',
        'Modal con wizard de 3 pasos',
        'Gestión de proyectos avanzada',
        'Indicadores de trabajo actual'
      ],
      difficulty: 'Moderado',
      timeEstimate: '5-8 min',
      userType: 'Profesionales visuales',
      pros: [
        'Ideal para ver progresión temporal',
        'Muy visual y atractivo',
        'Fácil de navegar'
      ],
      preview: 'Perfecto para consultores que valoran la visualización cronológica'
    },
    {
      id: 'conversational',
      name: 'Asistente Conversacional',
      description: 'Un chatbot inteligente te guía paso a paso de manera natural y personalizada',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-600',
      features: [
        'Experiencia tipo chat',
        'Guía personalizada paso a paso',
        'Validación inteligente',
        'Preguntas adaptativas',
        'Feedback en tiempo real'
      ],
      difficulty: 'Fácil',
      timeEstimate: '3-5 min',
      userType: 'Principiantes y usuarios casuales',
      pros: [
        'Muy intuitivo y natural',
        'Guía completa sin confusión',
        'Ideal para usuarios nuevos'
      ],
      preview: 'Perfecto para quienes prefieren una experiencia guiada y conversacional'
    },
    {
      id: 'cards',
      name: 'Editor Visual Avanzado',
      description: 'Panel de control completo con múltiples vistas y gestión drag & drop',
      icon: Layout,
      color: 'from-green-500 to-emerald-600',
      features: [
        'Múltiples vistas (cards, grid, timeline)',
        'Drag & drop para reordenar',
        'Búsqueda y filtros avanzados',
        'Editor de tabs completo',
        'Vista previa en tiempo real'
      ],
      difficulty: 'Avanzado',
      timeEstimate: '8-12 min',
      userType: 'Power users y profesionales avanzados',
      pros: [
        'Control total sobre la información',
        'Múltiples formas de organizar',
        'Muy poderoso y flexible'
      ],
      preview: 'Perfecto para usuarios experimentados que quieren control total'
    }
  ];

  if (selectedWizard) {
    return (
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => setSelectedWizard(null)}
            variant="ghost"
            size="sm"
            className="text-[var(--axity-purple)]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cambiar estilo
          </Button>
          <div>
            <h3 className="text-lg font-bold text-[var(--axity-purple)]">
              {wizardOptions.find(w => w.id === selectedWizard)?.name}
            </h3>
            <p className="text-sm text-gray-600">
              {wizardOptions.find(w => w.id === selectedWizard)?.description}
            </p>
          </div>
        </div>

        {/* Render selected wizard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedWizard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedWizard === 'timeline' && <NewExperienceStep {...props} />}
            {selectedWizard === 'conversational' && <ConversationalExperienceWizard {...props} />}
            {selectedWizard === 'cards' && <CardBasedExperienceWizard {...props} />}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[var(--axity-purple)]">
              Elige tu estilo de experiencia
            </h2>
            <p className="text-lg text-[var(--axity-gray)]">
              Selecciona la forma que más te acomode para documentar tu trayectoria profesional
            </p>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Award className="h-3 w-3 mr-1" />
            3 estilos únicos
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Personalizable
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <Sparkles className="h-3 w-3 mr-1" />
            Experiencia optimizada
          </Badge>
        </div>
      </div>

      {/* Quick stats if user has experiences */}
      {props.formData.experiences && props.formData.experiences.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-[var(--axity-purple)] mb-2">
                Ya tienes experiencias documentadas ✨
              </h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Circle className="h-3 w-3 text-green-500 fill-green-500" />
                  <span>{props.formData.experiences.length} experiencia{props.formData.experiences.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Code2 className="h-3 w-3 text-blue-500" />
                  <span>{props.formData.experiences.reduce((sum: number, exp: any) => sum + (exp.technologies?.length || 0), 0)} tecnologías</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-orange-500" />
                  <span>{props.formData.experiences.reduce((sum: number, exp: any) => sum + (exp.projects?.length || 0), 0)} proyectos</span>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowComparison(true)}
              variant="outline"
              size="sm"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Comparar estilos
            </Button>
          </div>
        </motion.div>
      )}

      {/* Wizard Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wizardOptions.map((wizard, index) => {
          const Icon = wizard.icon;
          return (
            <motion.div
              key={wizard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card 
                className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-purple-200 relative overflow-hidden"
                onClick={() => setSelectedWizard(wizard.id)}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${wizard.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${wizard.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`${
                        wizard.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                        wizard.difficulty === 'Moderado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      } border-0 text-xs`}>
                        {wizard.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-500">{wizard.timeEstimate}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[var(--axity-purple)] mb-2">
                    {wizard.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {wizard.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                        Ideal para:
                      </span>
                      <p className="text-sm text-[var(--axity-purple)] font-medium">
                        {wizard.userType}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative">
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Características:</h5>
                      <div className="space-y-1">
                        {wizard.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {wizard.features.length > 3 && (
                          <div className="text-xs text-gray-500 ml-5">
                            +{wizard.features.length - 3} características más
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pros */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Ventajas:</h5>
                      <div className="space-y-1">
                        {wizard.pros.map((pro, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <p className="text-xs text-gray-600 italic">
                        "{wizard.preview}"
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.div
                    className="mt-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className={`w-full bg-gradient-to-r ${wizard.color} text-white shadow-lg hover:shadow-xl group-hover:shadow-2xl transition-all`}
                      onClick={() => setSelectedWizard(wizard.id)}
                    >
                      <span>Usar este estilo</span>
                      <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setShowComparison(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Comparación de estilos</h3>
                    <p className="text-white/80">Encuentra el estilo que mejor se adapte a tu forma de trabajar</p>
                  </div>
                  <Button
                    onClick={() => setShowComparison(false)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {wizardOptions.map((wizard) => {
                    const Icon = wizard.icon;
                    return (
                      <Card key={wizard.id} className="border-2">
                        <CardHeader className="text-center">
                          <div className={`w-12 h-12 bg-gradient-to-br ${wizard.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="font-bold text-[var(--axity-purple)]">{wizard.name}</h4>
                          <Badge className={`${
                            wizard.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                            wizard.difficulty === 'Moderado' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          } border-0 mx-auto`}>
                            {wizard.difficulty} • {wizard.timeEstimate}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium mb-1">Todas las características:</h5>
                            <div className="space-y-1">
                              {wizard.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => {
                              setSelectedWizard(wizard.id);
                              setShowComparison(false);
                            }}
                            className={`w-full bg-gradient-to-r ${wizard.color} text-white`}
                            size="sm"
                          >
                            Seleccionar
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 mb-2">¿No estás seguro cuál elegir?</h4>
              <p className="text-blue-800 text-sm mb-3">
                Cada estilo está diseñado para diferentes tipos de usuarios y formas de trabajar. 
                Puedes cambiar entre estilos en cualquier momento sin perder tu información.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-blue-700">
                  <Zap className="h-3 w-3" />
                  <span>Cambio instantáneo</span>
                </div>
                <div className="flex items-center gap-1 text-blue-700">
                  <BarChart3 className="h-3 w-3" />
                  <span>Sin pérdida de datos</span>
                </div>
                <div className="flex items-center gap-1 text-blue-700">
                  <Settings className="h-3 w-3" />
                  <span>Totalmente personalizable</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}