import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Code2, Plus, X, Search, Sparkles, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WizardTechnicalSkillsStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
  addXP: (points: number, achievement?: string) => void;
}

export function WizardTechnicalSkillsStep({ data, updateData, addXP }: WizardTechnicalSkillsStepProps) {
  const [newSkill, setNewSkill] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const popularSkills = [
    { name: "React", category: "Frontend", trending: true },
    { name: "TypeScript", category: "Frontend", trending: true },
    { name: "Node.js", category: "Backend", trending: false },
    { name: "Python", category: "Backend", trending: true },
    { name: "AWS", category: "Cloud", trending: true },
    { name: "Docker", category: "DevOps", trending: false },
    { name: "Kubernetes", category: "DevOps", trending: true },
    { name: "MongoDB", category: "Database", trending: false },
    { name: "PostgreSQL", category: "Database", trending: false },
    { name: "Vue.js", category: "Frontend", trending: false },
    { name: "Angular", category: "Frontend", trending: false },
    { name: "Java", category: "Backend", trending: false },
    { name: "C#", category: "Backend", trending: false },
    { name: "Azure", category: "Cloud", trending: true },
    { name: "GraphQL", category: "API", trending: true },
    { name: "Redis", category: "Database", trending: false },
  ];

  const addSkill = () => {
    if (newSkill && skillLevel) {
      const skills = data.skills || [];
      const newSkillObj = { name: newSkill, level: skillLevel };
      updateData("skills", [...skills, newSkillObj]);
      setNewSkill("");
      setSkillLevel("");
      addXP(15);

      if (skills.length + 1 === 5) {
        addXP(25, "Stack Builder");
      } else if (skills.length + 1 === 10) {
        addXP(50, "Tech Wizard");
      }
    }
  };

  const removeSkill = (index: number) => {
    const skills = data.skills || [];
    updateData("skills", skills.filter((_: any, i: number) => i !== index));
  };

  const addPopularSkill = (skillName: string) => {
    const skills = data.skills || [];
    if (!skills.some((s: any) => s.name === skillName)) {
      const newSkillObj = { name: skillName, level: "Intermedio" };
      updateData("skills", [...skills, newSkillObj]);
      addXP(10);
    }
  };

  const getSkillLevelData = (level: string) => {
    const levels = {
      "Principiante": { 
        color: "from-yellow-400 to-orange-400", 
        icon: "🌱", 
        bgColor: "bg-yellow-50 border-yellow-200 text-yellow-800" 
      },
      "Intermedio": { 
        color: "from-blue-400 to-indigo-400", 
        icon: "⚡", 
        bgColor: "bg-blue-50 border-blue-200 text-blue-800" 
      },
      "Avanzado": { 
        color: "from-green-400 to-emerald-400", 
        icon: "🚀", 
        bgColor: "bg-green-50 border-green-200 text-green-800" 
      },
      "Expert": { 
        color: "from-purple-400 to-pink-400", 
        icon: "⭐", 
        bgColor: "bg-purple-50 border-purple-200 text-purple-800" 
      },
    };
    return levels[level] || levels["Intermedio"];
  };

  const filteredSkills = popularSkills.filter(skill => 
    !searchTerm || skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const skillCount = data.skills?.length || 0;

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
        >
          <Code2 className="h-4 w-4" />
          <span className="font-medium">
            {skillCount === 0 ? "¡Empecemos con tu primer skill!" : `${skillCount} skills agregados`}
          </span>
        </motion.div>
      </div>

      {/* Add New Skill */}
      <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg">Agregar Nueva Habilidad</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Ej: React, Python, Docker..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="bg-white shadow-sm"
            />
            <Select onValueChange={setSkillLevel} value={skillLevel}>
              <SelectTrigger className="bg-white shadow-sm">
                <SelectValue placeholder="Selecciona nivel" />
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
              disabled={!newSkill || !skillLevel}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Skills */}
      {data.skills && data.skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  Tu Stack Tecnológico ({data.skills.length})
                </h3>
                {data.skills.length >= 5 && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    🎯 Stack Sólido
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <AnimatePresence>
                  {data.skills.map((skill: any, index: number) => {
                    const levelData = getSkillLevelData(skill.level);
                    return (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className={`group relative flex items-center gap-3 p-4 rounded-xl border-2 ${levelData.bgColor} hover:shadow-md transition-all`}
                      >
                        <span className="text-lg">{levelData.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{skill.name}</div>
                          <div className="text-xs opacity-75">{skill.level}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeSkill(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Popular Skills */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Habilidades Populares en Axity
            </h3>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-48 bg-white shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredSkills.map((skill) => {
              const isAdded = data.skills?.some((s: any) => s.name === skill.name);
              return (
                <motion.button
                  key={skill.name}
                  onClick={() => !isAdded && addPopularSkill(skill.name)}
                  disabled={isAdded}
                  className={`relative p-4 rounded-xl text-left transition-all ${
                    isAdded
                      ? 'bg-green-50 text-green-800 cursor-not-allowed border-2 border-green-200'
                      : 'bg-white hover:bg-gray-50 text-gray-700 hover:shadow-md border-2 border-gray-100 hover:border-gray-200'
                  }`}
                  whileHover={!isAdded ? { scale: 1.02 } : {}}
                  whileTap={!isAdded ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {isAdded ? (
                      <Zap className="h-4 w-4 text-green-600" />
                    ) : (
                      <Plus className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="font-medium text-sm">{skill.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{skill.category}</span>
                    {skill.trending && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-600 border-orange-200">
                        🔥 Trending
                      </Badge>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Zap className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h4 className="font-semibold text-violet-900 mb-2">💡 Consejos de nuestros Tech Leads</h4>
              <ul className="text-sm text-violet-800 space-y-1">
                <li>• Incluye tanto lenguajes como frameworks específicos que domines</li>
                <li>• No te preocupes si estás aprendiendo - valoramos la capacidad de crecimiento</li>
                <li>• Las habilidades emergentes y cloud son muy valoradas en nuestros proyectos</li>
                <li>• Puedes agregar herramientas de testing, CI/CD y metodologías ágiles</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}