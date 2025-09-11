import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  Layout,
  SidebarClose,
  Layers,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

// Import all experience components
import { InlineExperienceWizard } from "./InlineExperienceWizard";
import { SlidePanelExperience } from "./SlidePanelExperience";
import { CarouselExperience } from "./CarouselExperience";
import { NewExperienceStep } from "./NewExperienceStep"; // Original
import type { StreakCounter } from "@/types/app";

interface ExperienceStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (type: string, message: string, description?: string, icon?: string, context?: string) => void;
  streakCounter: StreakCounter;
  setStreakCounter: React.Dispatch<React.SetStateAction<StreakCounter>>;
}

type ExperienceMode = 'selector' | 'inline' | 'panel' | 'carousel' | 'original';

export function ExperienceSelector(props: ExperienceStepProps) {
  const [selectedMode, setSelectedMode] = useState<ExperienceMode>('selector');

  const experienceOptions = [
    {
      id: 'inline',
      title: 'Wizard Inline',
      description: 'Formulario paso a paso que se expande en la misma página',
      icon: Layout,
      pros: ['Sin ventanas emergentes', 'Vista completa del contenido', 'Fácil navegación'],
      recommended: true,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'panel',
      title: 'Panel Lateral',
      description: 'Panel deslizante desde el lateral derecho',
      icon: SidebarClose,
      pros: ['Mantiene contexto visual', 'Diseño elegante', 'Fácil de cerrar'],
      recommended: false,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'carousel',
      title: 'Tarjetas Deslizables',
      description: 'Experiencia tipo carousel con navegación por swipe',
      icon: Layers,
      pros: ['Interfaz moderna', 'Navegación intuitiva', 'Diseño atractivo'],
      recommended: false,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'original',
      title: 'Modal Original',
      description: 'Modal centrado con el diseño original (z-index corregido)',
      icon: CheckCircle,
      pros: ['Diseño familiar', 'Completamente funcional', 'Problema resuelto'],
      recommended: false,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const renderSelectedMode = () => {
    switch (selectedMode) {
      case 'inline':
        return <InlineExperienceWizard {...props} />;
      case 'panel':
        return <SlidePanelExperience {...props} />;
      case 'carousel':
        return <CarouselExperience {...props} />;
      case 'original':
        return <NewExperienceStep {...props} />;
      default:
        return null;
    }
  };

  if (selectedMode !== 'selector') {
    return (
      <div className="space-y-6">
        {/* Back to selector button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setSelectedMode('selector')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            ← Cambiar modo de experiencia
          </Button>
          <Badge variant="secondary" className="bg-[var(--axity-purple)]/10 text-[var(--axity-purple)]">
            {experienceOptions.find(opt => opt.id === selectedMode)?.title}
          </Badge>
        </div>
        {renderSelectedMode()}
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
          className="space-y-4"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
              Elige tu experiencia de registro
            </h3>
            <p className="text-[var(--axity-gray)] max-w-2xl mx-auto">
              Selecciona el método que prefieras para registrar tus experiencias profesionales. 
              Todas las opciones mantienen el mismo contenido, solo cambia la interfaz.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {experienceOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                option.recommended 
                  ? 'border-[var(--axity-purple)] shadow-lg' 
                  : 'border-gray-200 hover:border-[var(--axity-purple)]'
              }`}>
                {option.recommended && (
                  <div className="absolute -top-3 left-4">
                    <Badge className="bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white shadow-lg">
                      ⭐ Recomendado
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-[var(--axity-purple)]">
                        {option.title}
                      </h4>
                      <p className="text-sm text-[var(--axity-gray)] mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-[var(--axity-purple)]">
                      Ventajas:
                    </h5>
                    <ul className="space-y-1">
                      {option.pros.map((pro, proIndex) => (
                        <li key={proIndex} className="flex items-center gap-2 text-sm text-[var(--axity-gray)]">
                          <div className="w-1.5 h-1.5 bg-[var(--axity-mint)] rounded-full"></div>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => setSelectedMode(option.id as ExperienceMode)}
                    className={`w-full ${
                      option.recommended 
                        ? 'bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] hover:opacity-90' 
                        : 'bg-white border border-[var(--axity-purple)] text-[var(--axity-purple)] hover:bg-[var(--axity-purple)] hover:text-white'
                    }`}
                    variant={option.recommended ? "default" : "outline"}
                  >
                    <span className="flex items-center gap-2">
                      Usar {option.title}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <CheckCircle className="h-5 w-5 text-[var(--axity-purple)]" />
              <h5 className="font-medium text-[var(--axity-purple)]">
                Todas las opciones incluyen el mismo contenido
              </h5>
            </div>
            <p className="text-sm text-[var(--axity-gray)] max-w-xl mx-auto">
              Sin importar qué opción elijas, podrás completar los 3 pasos: 
              <span className="font-medium"> Información básica, Proyectos destacados y Logros & desafíos</span>. 
              Solo cambia la forma de presentar la información.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}