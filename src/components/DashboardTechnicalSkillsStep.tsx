import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, X, Search, Sparkles, TrendingUp, Zap, Grid3X3, List } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DashboardTechnicalSkillsStepProps {
  data: any;
  updateData: (field: string, value: any) => void;
  addXP: (points: number, achievement?: string) => void;
}

type Skill = { name: string; level: string; category?: string };

const levels = {
  Principiante: { color: "...", icon: "🌱", bgColor: "...", textColor: "..." },
  Intermedio:   { color: "...", icon: "⚡", bgColor: "...", textColor: "..." },
  Avanzado:     { color: "...", icon: "🚀", bgColor: "...", textColor: "..." },
  Expert:       { color: "...", icon: "⭐", bgColor: "...", textColor: "..." },
} as const;

type LevelKey = keyof typeof levels;

export function DashboardTechnicalSkillsStep({ data, updateData, addXP }: DashboardTechnicalSkillsStepProps) {
  const [newSkill, setNewSkill] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const skillCategories = [
    { id: "frontend", name: "Frontend", color: "bg-blue-100 text-blue-800" },
    { id: "backend", name: "Backend", color: "bg-green-100 text-green-800" },
    { id: "cloud", name: "Cloud", color: "bg-purple-100 text-purple-800" },
    { id: "database", name: "Database", color: "bg-orange-100 text-orange-800" },
    { id: "devops", name: "DevOps", color: "bg-red-100 text-red-800" },
    { id: "mobile", name: "Mobile", color: "bg-indigo-100 text-indigo-800" }
  ];

  const popularSkills = [
    { name: "React", category: "frontend", trending: true, level: "high" },
    { name: "TypeScript", category: "frontend", trending: true, level: "high" },
    { name: "Node.js", category: "backend", trending: false, level: "high" },
    { name: "Python", category: "backend", trending: true, level: "high" },
    { name: "AWS", category: "cloud", trending: true, level: "high" },
    { name: "Docker", category: "devops", trending: false, level: "medium" },
    { name: "Kubernetes", category: "devops", trending: true, level: "high" },
    { name: "MongoDB", category: "database", trending: false, level: "medium" },
    { name: "PostgreSQL", category: "database", trending: false, level: "medium" },
    { name: "Vue.js", category: "frontend", trending: true, level: "medium" },
    { name: "Angular", category: "frontend", trending: false, level: "medium" },
    { name: "Java", category: "backend", trending: false, level: "medium" },
    { name: "C#", category: "backend", trending: false, level: "medium" },
    { name: "Azure", category: "cloud", trending: true, level: "high" },
    { name: "GraphQL", category: "backend", trending: true, level: "medium" },
    { name: "Redis", category: "database", trending: false, level: "low" },
    { name: "React Native", category: "mobile", trending: true, level: "medium" },
    { name: "Flutter", category: "mobile", trending: true, level: "medium" },
  ];

  const addSkill = () => {
    if (newSkill && skillLevel) {
      const skills = data.skills || [];
      const newSkillObj = { 
        name: newSkill, 
        level: skillLevel,
        category: selectedCategory !== "all" ? selectedCategory : "other"
      };
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

  const addPopularSkill = (skillName: string, category: string) => {
    const skills = data.skills || [];
    if (!skills.some((s: any) => s.name === skillName)) {
      const newSkillObj = { name: skillName, level: "Intermedio", category };
      updateData("skills", [...skills, newSkillObj]);
      addXP(10);
    }
  };

  function getSkillLevelData(level: string) {
    const key: LevelKey = (Object.keys(levels) as LevelKey[]).includes(level as LevelKey)
      ? (level as LevelKey)
      : "Intermedio";
    return levels[key];
  }

  const filteredSkills = popularSkills.filter(skill => {
    const matchesSearch = !searchTerm || skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedUserSkills = () => {
    const skills = data.skills || [];
    
    const grouped: Record<string, Skill[]> = {};
    skills.forEach((skill: Skill) => {
      const category = skill.category || "other";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(skill);
    });
    
    return grouped;
  };

  const skillCount = data.skills?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">{skillCount}</div>
            <div className="text-sm text-gray-600">Habilidades totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {data.skills?.filter((s: Skill) => s.level === "Expert").length || 0}
            </div>
            <div className="text-sm text-gray-600">Nivel Expert</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {Object.keys(groupedUserSkills()).length}
            </div>
            <div className="text-sm text-gray-600">Categorías</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {Math.round((skillCount / 15) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Completitud</div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Skill Section */}
      <Card className="border-dashed border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-purple-600" />
            Agregar Nueva Habilidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Ej: React, Python, Docker..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1"
            />
            <Select onValueChange={setSkillLevel} value={skillLevel}>
              <SelectTrigger className="md:w-48">
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
              disabled={!newSkill || !skillLevel}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Skills */}
      {skillCount > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Tu Stack Tecnológico ({skillCount})
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="Expert">Expert</TabsTrigger>
                <TabsTrigger value="Avanzado">Avanzado</TabsTrigger>
                <TabsTrigger value="Intermedio">Intermedio</TabsTrigger>
                <TabsTrigger value="Principiante">Principiante</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                <SkillsDisplay 
                  skills={data.skills || []} 
                  viewMode={viewMode}
                  onRemove={removeSkill}
                  getSkillLevelData={getSkillLevelData}
                />
              </TabsContent>
              
              {["Expert", "Avanzado", "Intermedio", "Principiante"].map(level => (
                <TabsContent key={level} value={level} className="mt-6">
                  <SkillsDisplay 
                    skills={(data.skills || []).filter((skill: Skill) => skill.level === level)}
                    viewMode={viewMode}
                    onRemove={(index: number) => {
                      const allSkills = data.skills || [];
                      const skillToRemove = allSkills.filter((s: Skill) => s.level === level)[index];
                      const originalIndex = allSkills.findIndex((s: Skill) => s === skillToRemove);
                      removeSkill(originalIndex);
                    }}
                    getSkillLevelData={getSkillLevelData}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Popular Skills */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              Habilidades Populares en Axity
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {skillCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => {
              const isAdded = data.skills?.some((s: any) => s.name === skill.name);
              const category = skillCategories.find(cat => cat.id === skill.category);
              
              return (
                <motion.button
                  key={skill.name}
                  onClick={() => !isAdded && addPopularSkill(skill.name, skill.category)}
                  disabled={isAdded}
                  className={`relative p-4 rounded-xl text-left transition-all border-2 ${
                    isAdded
                      ? 'bg-green-50 text-green-800 cursor-not-allowed border-green-200'
                      : 'bg-white hover:bg-gray-50 text-gray-700 hover:shadow-md border-gray-100 hover:border-gray-200'
                  }`}
                  whileHover={!isAdded ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isAdded ? { scale: 0.98 } : {}}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{skill.name}</span>
                    {isAdded ? (
                      <Zap className="h-4 w-4 text-green-600" />
                    ) : (
                      <Plus className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`text-xs ${category?.color || 'bg-gray-100 text-gray-800'}`}>
                      {category?.name || skill.category}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {skill.trending && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-600">
                        🔥 Trending
                      </Badge>
                    )}
                    {skill.level === "high" && (
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-600">
                        ⭐ Demandado
                      </Badge>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skills Display Component
function SkillsDisplay({
  skills,
  viewMode,
  onRemove,
  getSkillLevelData,
}: {
  skills: Skill[];
  viewMode: "grid" | "list";
  onRemove: (index: number) => void;
  getSkillLevelData: (level: string) => { color: string; icon: string; bgColor: string; textColor: string };
}) {
  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        <AnimatePresence>
          {skills.map((skill: any, index: number) => {
            const levelData = getSkillLevelData(skill.level);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{levelData.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{skill.name}</div>
                    <div className="text-sm text-gray-600">{skill.level}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {skill.category && (
                    <Badge variant="outline" className="text-xs">
                      {skill.category}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
                    onClick={() => onRemove(index)}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {skills.map((skill: any, index: number) => {
          const levelData = getSkillLevelData(skill.level);
          return (
            <motion.div
              key={index}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`group relative p-4 rounded-xl border-2 transition-all ${levelData.bgColor}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xl">{levelData.icon}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  onClick={() => onRemove(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="font-medium text-gray-900 mb-1">{skill.name}</div>
              <div className="text-sm opacity-75 mb-2">{skill.level}</div>
              
              {skill.category && (
                <Badge variant="outline" className="text-xs">
                  {skill.category}
                </Badge>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}