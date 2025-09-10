import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Briefcase, Plus, Trash2, Calendar } from "lucide-react";
import { useState } from "react";

interface ExperienceStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

export function ExperienceStep({ data, updateData }: ExperienceStepProps) {
  const [showForm, setShowForm] = useState(false);
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
      updateData("experiences", [...experiences, currentExperience]);
      setCurrentExperience({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        current: false
      });
      setShowForm(false);
    }
  };

  const removeExperience = (index: number) => {
    const experiences = data.experiences || [];
    updateData("experiences", experiences.filter((_: any, i: number) => i !== index));
  };

  const updateCurrentExperience = (field: string, value: any) => {
    setCurrentExperience(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Experiencia Laboral
        </CardTitle>
        <CardDescription>
          🏗️ Cuéntanos sobre los proyectos épicos en los que has trabajado. Cada línea de código cuenta una historia.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.experiences && data.experiences.length > 0 && (
          <div className="space-y-4">
            {data.experiences.map((exp: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 bg-muted/30">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{exp.position}</h4>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exp.startDate} - {exp.current ? "Actual" : exp.endDate}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {exp.description && (
                  <p className="text-sm mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {!showForm ? (
          <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Experiencia
          </Button>
        ) : (
          <div className="border rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa *</Label>
                <Input
                  id="company"
                  placeholder="Nombre de la empresa"
                  value={currentExperience.company}
                  onChange={(e) => updateCurrentExperience("company", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Cargo *</Label>
                <Input
                  id="position"
                  placeholder="Tu posición/rol"
                  value={currentExperience.position}
                  onChange={(e) => updateCurrentExperience("position", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de inicio</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={currentExperience.startDate}
                  onChange={(e) => updateCurrentExperience("startDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de fin</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={currentExperience.endDate}
                  onChange={(e) => updateCurrentExperience("endDate", e.target.value)}
                  disabled={currentExperience.current}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="current"
                    checked={currentExperience.current}
                    onChange={(e) => updateCurrentExperience("current", e.target.checked)}
                  />
                  <Label htmlFor="current" className="text-sm">Trabajo actual</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describe tus responsabilidades, logros y tecnologías utilizadas..."
                value={currentExperience.description}
                onChange={(e) => updateCurrentExperience("description", e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={addExperience}>Guardar</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm">
            🎯 <strong>Tip de reclutador:</strong> Incluye números y logros específicos cuando sea posible. 
            "Mejoré el rendimiento en 30%" suena mejor que "Mejoré el rendimiento".
          </p>
        </div>
      </CardContent>
    </Card>
  );
}