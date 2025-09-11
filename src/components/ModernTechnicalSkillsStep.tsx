import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Code2, Plus, X, Search, Filter, Star, Zap, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ModernTechnicalSkillsStepProps {
  data: any; // si ya tienes tipos globales, cámbialo por tu FormData
  updateData: (field: string, value: any) => void;
  addXP: (points: number, achievement?: string) => void;
}

/** ===== Tipos auxiliares ===== */
type Level = "Principiante" | "Intermedio" | "Avanzado" | "Expert";
type CategoryId = "frontend" | "backend" | "database" | "cloud" | "design" | "data" | "other";

type Skill = {
  name: string;
  level: Level;
  category: CategoryId | string; // por si llega algo fuera del union
};

type CategoryMeta = {
  name: string;
  color: string;
  skills: string[];
};

export function ModernTechnicalSkillsStep({ data, updateData, addXP }: ModernTechnicalSkillsStepProps) {
  const [newSkill, setNewSkill] = useState("");
  const [skillLevel, setSkillLevel] = useState<Level | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | CategoryId>("all");

  /** Catálogo de categorías (sin "other" a propósito) */
  const skillCatalog: Record<Exclude<CategoryId, "other">, CategoryMeta> = {
    frontend: { name: "Frontend", color: "from-blue-500 to-cyan-500", skills: ["React", "Vue.js", "Angular", "JavaScript", "TypeScript", "Next.js", "Svelte"] },
    backend:  { name: "Backend", color: "from-green-500 to-emerald-500", skills: ["Node.js", "Python", "Java", "C#", ".NET", "PHP", "Go", "Rust"] },
    database: { name: "Base de Datos", color: "from-orange-500 to-red-500", skills: ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Oracle"] },
    cloud:    { name: "Cloud & DevOps", color: "from-purple-500 to-pink-500", skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins", "Terraform"] },
    design:   { name: "Design & UX", color: "from-pink-500 to-rose-500", skills: ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator"] },
    data:     { name: "Data & Analytics", color: "from-indigo-500 to-purple-500", skills: ["Tableau", "Power BI", "Python", "R", "SQL", "Excel"] },
  };

  const addSkill = () => {
    if (newSkill && skillLevel) {
      const skills: Skill[] = (data.skills ?? []) as Skill[];
      const newSkillObj: Skill = { name: newSkill, level: skillLevel as Level, category: getCategoryForSkill(newSkill) };
      updateData("skills", [...skills, newSkillObj]);
      setNewSkill("");
      setSkillLevel("");
      addXP(10);

      if (skills.length + 1 === 5) addXP(25, "Stack Builder");
      else if (skills.length + 1 === 10) addXP(50, "Tech Wizard");
    }
  };

  const removeSkill = (index: number) => {
    const skills: Skill[] = (data.skills ?? []) as Skill[];
    updateData("skills", skills.filter((_, i) => i !== index));
  };

  const addPopularSkill = (skill: string, category: CategoryId) => {
    const skills: Skill[] = (data.skills ?? []) as Skill[];
    if (!skills.some((s) => s.name === skill)) {
      const newSkillObj: Skill = { name: skill, level: "Intermedio", category };
      updateData("skills", [...skills, newSkillObj]);
      addXP(15);
    }
  };

  const getCategoryForSkill = (skillName: string): CategoryId => {
    for (const [categoryKey, category] of Object.entries(skillCatalog) as [Exclude<CategoryId, "other">, CategoryMeta][]) {
      if (category.skills.some((s) => s.toLowerCase() === skillName.toLowerCase())) return categoryKey;
    }
    return "other";
  };

  const getSkillLevelData = (level: Level | string) => {
    const levels: Record<Level, { color: string; icon: string; bgColor: string; textColor: string }> = {
      Principiante: { color: "from-yellow-400 to-orange-400", icon: "🌱", bgColor: "bg-yellow-50 border-yellow-200", textColor: "text-yellow-800" },
      Intermedio:   { color: "from-blue-400 to-indigo-400",  icon: "⚡", bgColor: "bg-blue-50 border-blue-200",   textColor: "text-blue-800" },
      Avanzado:     { color: "from-green-400 to-emerald-400", icon: "🚀", bgColor: "bg-green-50 border-green-200", textColor: "text-green-800" },
      Expert:       { color: "from-purple-400 to-pink-400",   icon: "⭐", bgColor: "bg-purple-50 border-purple-200", textColor: "text-purple-800" },
    };
    return levels[(level as Level)] || levels["Intermedio"];
  };

  const filteredCategories = (Object.entries(skillCatalog) as [Exclude<CategoryId, "other">, CategoryMeta][])
    .filter(([key, category]) => {
      if (selectedCategory !== "all" && key !== selectedCategory) return false;
      if (!searchTerm) return true;
      return category.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    });

  const getSkillsByCategory = () => {
    const skills: Skill[] = (data.skills ?? []) as Skill[];
    const categorized: Record<CategoryId, Skill[]> = {
      frontend: [], backend: [], database: [], cloud: [], design: [], data: [], other: [],
    };

    skills.forEach((skill) => {
      const raw = (skill.category ?? "other") as string;
      const cat: CategoryId = ["frontend","backend","database","cloud","design","data","other"].includes(raw)
        ? (raw as CategoryId)
        : "other";
      categorized[cat].push(skill);
    });

    return categorized;
  };

  const categorizedSkills = getSkillsByCategory();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-axity-gradient-primary rounded-2xl shadow-lg">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Stack Tecnológico</h2>
                <p className="text-muted-foreground">Define tu arsenal de herramientas. Cada habilidad te acerca a tu proyecto ideal.</p>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Add New Skill */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-[var(--axity-purple)]" />
              Agregar Nueva Habilidad
            </h3>
            <div className="flex gap-3">
              <Input
                placeholder="Ej: React, Python, Docker..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 bg-white border-0 shadow-sm"
              />
              <Select onValueChange={(v) => setSkillLevel(v as Level)}>
                <SelectTrigger className="w-40 bg-white border-0 shadow-sm">
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
                className="bg-axity-gradient-primary hover:opacity-90 shadow-lg"
                disabled={!newSkill || !skillLevel}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Skills */}
      {data.skills && (data.skills as Skill[]).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Tus Habilidades {(data.skills as Skill[]).length ? `(${(data.skills as Skill[]).length})` : ""}
                </h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {(data.skills as Skill[]).length >= 5 ? "Stack Sólido" : "Construyendo Stack"}
                </Badge>
              </div>

              <div className="space-y-4">
                {(Object.entries(categorizedSkills) as [CategoryId, Skill[]][])
                  .map(([categoryKey, skills]) => {
                    const category = skillCatalog[categoryKey as Exclude<CategoryId, "other">];
                    if (!category || !skills.length) return null;

                    return (
                      <div key={categoryKey} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                          <span className="text-sm font-medium text-muted-foreground">{category.name}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 ml-5">
                          {skills.map((skill) => {
                            const levelData = getSkillLevelData(skill.level);
                            const globalIndex = (data.skills as Skill[]).findIndex((s) => s.name === skill.name);

                            return (
                              <motion.div
                                key={`${skill.name}-${globalIndex}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1.05 }}
                                className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border shadow-sm ${levelData.bgColor} hover:shadow-md transition-all`}
                              >
                                <span className="text-lg">{levelData.icon}</span>
                                <span className={`font-medium ${levelData.textColor}`}>{skill.name}</span>
                                <span className={`text-xs ${levelData.textColor} opacity-75`}>{skill.level}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeSkill(globalIndex)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Popular Skills */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--axity-orange)]" />
                Habilidades Populares en Axity
              </h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar habilidad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48 bg-white border-0 shadow-sm"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as "all" | CategoryId)}>
                  <SelectTrigger className="w-32 bg-white border-0 shadow-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {(Object.entries(skillCatalog) as [Exclude<CategoryId, "other">, CategoryMeta][])
                      .map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {filteredCategories.map(([categoryKey, category]) => (
                  <motion.div
                    key={categoryKey}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-lg bg-gradient-to-r ${category.color} shadow-sm`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-7">
                      {category.skills
                        .filter((s) => !searchTerm || s.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((skill) => {
                          const isAdded = (data.skills as Skill[] | undefined)?.some((s) => s.name === skill) ?? false;
                          return (
                            <motion.button
                              key={skill}
                              onClick={() => !isAdded && addPopularSkill(skill, categoryKey)}
                              disabled={isAdded}
                              className={`p-3 rounded-xl text-sm font-medium transition-all text-left ${
                                isAdded
                                  ? "bg-green-100 text-green-800 cursor-not-allowed"
                                  : "bg-white hover:bg-gray-50 text-gray-700 hover:shadow-md border shadow-sm"
                              }`}
                              whileHover={!isAdded ? { scale: 1.02 } : {}}
                              whileTap={!isAdded ? { scale: 0.98 } : {}}
                            >
                              <div className="flex items-center gap-2">
                                {isAdded ? <Zap className="h-4 w-4 text-green-600" /> : <Plus className="h-4 w-4" />}
                                {skill}
                              </div>
                            </motion.button>
                          );
                        })}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Zap className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h4 className="font-semibold text-violet-900 mb-2">Consejos de nuestros Tech Leads</h4>
                <ul className="text-sm text-violet-800 space-y-1">
                  <li>• Incluye tanto habilidades técnicas como frameworks específicos</li>
                  <li>• No te preocupes si no dominas todo - valoramos la capacidad de aprender</li>
                  <li>• Las certificaciones y proyectos prácticos son un plus</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
