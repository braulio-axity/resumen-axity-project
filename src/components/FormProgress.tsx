import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Trophy, Zap, Code, CheckCircle } from "lucide-react";

interface FormProgressProps {
  currentStep: number;
  totalSteps: number;
  xp: number;
  achievements: string[];
}

export function FormProgress({ currentStep, totalSteps, xp, achievements }: FormProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  const level = Math.floor(xp / 100) + 1;
  const levelProgress = xp % 100;

  const getProgressMessage = () => {
    if (progress < 25) return "🚀 Configurando tu stack tecnológico...";
    if (progress < 50) return "⚡ Documentando tu experiencia...";
    if (progress < 75) return "🎓 Registrando tu formación...";
    return "✨ Finalizando tu perfil profesional...";
  };

  const getLevelTitle = (level: number) => {
    if (level === 1) return "Junior Consultant";
    if (level === 2) return "Mid-Level Consultant";
    if (level === 3) return "Senior Consultant";
    if (level >= 4) return "Principal Consultant";
    return "Consultant";
  };

  return (
    <div className="bg-card p-6 rounded-lg border mb-6 bg-gradient-to-r from-card to-secondary/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-axity-gradient-primary p-2 rounded-lg">
            <Code className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-semibold">Nivel {level}</span>
            <p className="text-sm text-muted-foreground">{getLevelTitle(level)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">{xp} XP</span>
            </div>
            <p className="text-xs text-muted-foreground">Puntos de experiencia</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progreso del Perfil</span>
            <span className="text-muted-foreground">{currentStep} de {totalSteps} secciones</span>
          </div>
          <Progress value={progress} className="h-3 bg-secondary" />
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {getProgressMessage()}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Hasta próximo nivel</span>
            <span className="text-muted-foreground">{levelProgress}/100 XP</span>
          </div>
          <Progress value={levelProgress} className="h-2 bg-secondary" />
        </div>
      </div>

      {achievements.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Logros Desbloqueados</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-axity-gradient-primary text-white border-0"
              >
                🏆 {achievement}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}