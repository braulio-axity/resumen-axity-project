import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Code2, Plus, X, Zap, Star } from "lucide-react";
import { useState } from "react";

interface TechnicalSkillsStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
}

export function TechnicalSkillsStep({ data, updateData }: TechnicalSkillsStepProps) {
  const [newSkill, setNewSkill] = useState("");
  const [skillLevel, setSkillLevel] = useState("");

  const popularSkills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", 
    "C#", ".NET", "Angular", "Vue.js", "PHP", "Laravel", "MySQL", 
    "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "AWS", "Azure", 
    "Git", "Jenkins", "Figma", "Adobe XD", "Tableau", "Power BI",
    "Spring Boot", "Microservices", "GraphQL", "Redis", "Elasticsearch"
  ];

  const addSkill = () => {
    if (newSkill && skillLevel) {
      const skills = data.skills || [];
      const newSkillObj = { name: newSkill, level: skillLevel };
      updateData("skills", [...skills, newSkillObj]);
      setNewSkill("");
      setSkillLevel("");
    }
  };

  const removeSkill = (index: number) => {
    const skills = data.skills || [];
    updateData("skills", skills.filter((_: any, i: number) => i !== index));
  };

  const addPopularSkill = (skill: string) => {
    const skills = data.skills || [];
    if (!skills.some((s: any) => s.name === skill)) {
      const newSkillObj = { name: skill, level: "Intermedio" };
      updateData("skills", [...skills, newSkillObj]);
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case "Principiante": 
        return "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300";
      case "Intermedio": 
        return "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300";
      case "Avanzado": 
        return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
      case "Expert": 
        return "bg-axity-gradient-primary text-white border-purple-300";
      default: 
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSkillIcon = (level: string) => {
    switch (level) {
      case "Expert": return <Star className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className="border-t-4 border-t-[var(--axity-purple)]">
      <CardHeader className="bg-gradient-to-r from-secondary/50 to-accent/30">
        <CardTitle className="flex items-center gap-2">
          <div className="bg-axity-gradient-primary p-2 rounded-lg">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          Stack Tecnológico
        </CardTitle>
        <CardDescription>
          ⚡ Define tu arsenal tecnológico. Estas habilidades nos ayudarán a conectarte con los proyectos perfectos para ti.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Agregar nueva habilidad</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Ej: React, Python, Docker..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1"
            />
            <Select onValueChange={setSkillLevel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Principiante">🌱 Principiante</SelectItem>
                <SelectItem value="Intermedio">⚡ Intermedio</SelectItem>
                <SelectItem value="Avanzado">🚀 Avanzado</SelectItem>
                <SelectItem value="Expert">⭐ Expert</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={addSkill} 
              size="sm"
              className="bg-axity-gradient-primary hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {data.skills && data.skills.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">
              Tus habilidades ({data.skills.length})
            </Label>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: any, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${getSkillLevelColor(skill.level)} flex items-center gap-2 px-3 py-1 border`}
                >
                  {getSkillIcon(skill.level)}
                  <span>{skill.name}</span>
                  <span className="text-xs opacity-75">({skill.level})</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent ml-1"
                    onClick={() => removeSkill(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            {data.skills.length >= 5 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  🎉 ¡Excelente! Tienes un stack sólido. Los proyectos de Axity requieren consultores versátiles como tú.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Zap className="h-4 w-4 text-[var(--axity-orange)]" />
            Habilidades populares en Axity
          </Label>
          <p className="text-sm text-muted-foreground">
            Haz clic para agregar las tecnologías más demandadas en nuestros proyectos
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {popularSkills.map((skill) => (
              <Button
                key={skill}
                variant="outline"
                size="sm"
                onClick={() => addPopularSkill(skill)}
                className="text-xs justify-start hover:bg-secondary"
                disabled={data.skills?.some((s: any) => s.name === skill)}
              >
                {data.skills?.some((s: any) => s.name === skill) ? "✓" : "+"} {skill}
              </Button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-[var(--axity-violet)]/10 to-[var(--axity-magenta)]/10 p-4 rounded-lg border border-[var(--axity-violet)]/20">
          <p className="text-sm">
            💡 <strong>Consejo de nuestros Tech Leads:</strong> No te preocupes si no dominas todas las tecnologías. 
            En Axity valoramos la capacidad de aprender y adaptarse. Incluye las habilidades en las que te sientes cómodo trabajando.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}