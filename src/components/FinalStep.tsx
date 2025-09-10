import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle, Rocket, User, Code2, Briefcase, Award, Sparkles } from "lucide-react";

interface FinalStepProps {
  data: any;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function FinalStep({ data, onSubmit, isSubmitting }: FinalStepProps) {
  const getSummaryStats = () => {
    return {
      skills: data.skills?.length || 0,
      experiences: data.experiences?.length || 0,
      education: data.education?.length || 0,
      certifications: data.certifications?.length || 0,
    };
  };

  const stats = getSummaryStats();
  const completionPercentage = Math.min(100, ((stats.skills > 0 ? 25 : 0) + (stats.experiences > 0 ? 25 : 0) + (stats.education > 0 ? 25 : 0) + (stats.certifications > 0 ? 25 : 0)));

  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-6 w-6" />
            ¡Perfil Profesional Completado!
          </CardTitle>
          <CardDescription className="text-green-700">
            🎉 Tu información está lista para ser actualizada en el sistema de Axity. 
            Nuestro equipo de People & Culture podrá ahora conectarte con las mejores oportunidades.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center border-t-4 border-t-[var(--axity-blue)]">
          <CardContent className="pt-4">
            <User className="h-8 w-8 mx-auto mb-2 text-[var(--axity-blue)]" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-muted-foreground">Datos Básicos</div>
          </CardContent>
        </Card>
        
        <Card className="text-center border-t-4 border-t-[var(--axity-purple)]">
          <CardContent className="pt-4">
            <Code2 className="h-8 w-8 mx-auto mb-2 text-[var(--axity-purple)]" />
            <div className="text-2xl font-bold">{stats.skills}</div>
            <div className="text-sm text-muted-foreground">Habilidades</div>
          </CardContent>
        </Card>
        
        <Card className="text-center border-t-4 border-t-[var(--axity-orange)]">
          <CardContent className="pt-4">
            <Briefcase className="h-8 w-8 mx-auto mb-2 text-[var(--axity-orange)]" />
            <div className="text-2xl font-bold">{stats.experiences}</div>
            <div className="text-sm text-muted-foreground">Experiencias</div>
          </CardContent>
        </Card>
        
        <Card className="text-center border-t-4 border-t-[var(--axity-mint)]">
          <CardContent className="pt-4">
            <Award className="h-8 w-8 mx-auto mb-2 text-[var(--axity-mint)]" />
            <div className="text-2xl font-bold">{stats.education + stats.certifications}</div>
            <div className="text-sm text-muted-foreground">Formación</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--axity-violet)]" />
            Resumen de tu perfil actualizado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-secondary/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Consultor Axity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <p><strong>Nombre:</strong> {data.firstName} {data.lastName}</p>
              <p><strong>Email:</strong> {data.email}</p>
              <p><strong>ID Empleado:</strong> {data.employeeId}</p>
              <p><strong>Ubicación:</strong> {data.location === 'cdmx' ? 'Ciudad de México' : data.location}</p>
            </div>
          </div>

          {data.skills && data.skills.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Stack Tecnológico Principal</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.slice(0, 8).map((skill: any, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-axity-gradient-primary text-white"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {data.skills.length > 8 && (
                  <Badge variant="outline" className="border-[var(--axity-purple)]">
                    +{data.skills.length - 8} más
                  </Badge>
                )}
              </div>
            </div>
          )}

          {data.experiences && data.experiences.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Experiencia Destacada</h4>
              <div className="bg-muted/50 p-3 rounded">
                <p className="font-medium">{data.experiences[0].position}</p>
                <p className="text-sm text-muted-foreground">{data.experiences[0].company}</p>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-[var(--axity-violet)]/10 to-[var(--axity-magenta)]/10 p-4 rounded-lg">
            <p className="text-sm">
              📊 <strong>Completitud del perfil:</strong> {completionPercentage}% - 
              {completionPercentage === 100 ? " ¡Perfil completo!" : " Considera agregar más información para aumentar tus oportunidades."}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-axity-gradient-primary p-6 rounded-lg text-center text-white">
        <Rocket className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">¿Listo para actualizar tu perfil?</h3>
        <p className="text-white/90 mb-4 text-sm">
          Tu perfil profesional actualizado será visible para los Project Managers y Tech Leads de Axity. 
          Esto nos permitirá asignarte a los proyectos que mejor se adapten a tu experiencia y objetivos de carrera.
        </p>
        
        <Button 
          onClick={onSubmit} 
          size="lg" 
          disabled={isSubmitting}
          className="bg-white text-[var(--axity-purple)] hover:bg-white/90 font-semibold"
        >
          {isSubmitting ? "Actualizando perfil..." : "🚀 Actualizar mi perfil profesional"}
        </Button>
      </div>

      <div className="text-center text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <p>
          Al actualizar tu perfil, confirmas que la información proporcionada es veraz y actual. 
          Este perfil será utilizado exclusivamente para asignación de proyectos y desarrollo profesional dentro de Axity.
        </p>
      </div>
    </div>
  );
}