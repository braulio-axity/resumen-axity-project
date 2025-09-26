import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Plus,
  X,
  Code2,
  CheckCircle2,
  AlertCircle,
  Send,
  Sparkles,
  Search,
  Target,
  Settings,
  Hash,
} from "lucide-react";
import TechnologiesAdmin from "@/components/admin/TechnologiesAdmin";

import type {
  FormData,
  UpdateFormData,
  AddMotivationalMessage,
  StreakCounter,
} from "./../../types/app";
import { useAuth } from "@/context/AuthContext";
import { addCvSkill, listCvSkills } from '@/api/cvSkills';
import { skillKey } from "@/utils/skills";

// 👉 Contexto de tecnologías
import { useTechnologiesContext } from "@/context/TechnologiesContext";
import { createSuggestion } from "@/api/techSuggestions";

interface SkillsStepProps {
  formData: FormData;
  updateFormData: UpdateFormData;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: AddMotivationalMessage;
  streakCounter: StreakCounter;
  setStreakCounter: React.Dispatch<React.SetStateAction<StreakCounter>>;
}

type SkillItem = { name: string; level: string; version?: string };

export function SkillsStep({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  setStreakCounter,
}: SkillsStepProps) {
  const [newSkill, setNewSkill] = useState<string>("");
  const [skillLevel, setSkillLevel] = useState<string>("");
  const [skillVersion, setSkillVersion] = useState<string>("");
  const [isRequestingSkill, setIsRequestingSkill] = useState<boolean>(false);
  const [contextualMessage, setContextualMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSlidePanel, setShowSlidePanel] = useState<boolean>(false);
  const [selectedTechnology, setSelectedTechnology] = useState<string>("");
  const [tempSkillLevel, setTempSkillLevel] = useState<string>("");
  const [tempSkillVersion, setTempSkillVersion] = useState<string>("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [loadingServerSkills, setLoadingServerSkills] = useState(false);

  const { isAuthenticated, loading: authLoading, user } = useAuth();


  // ----------------- Get skills -------------------
  useEffect(() => {
    (async () => {
      try {
        setLoadingServerSkills(true);
        const server = await listCvSkills(); // [{ id, level, skill:{name,version} }]
        const serverAsForm: SkillItem[] = server.map(s => ({
          name: s.skill.name,
          version: s.skill.version || undefined,
          level: s.level,
        }));
  
        const current = (formData.skills || []) as SkillItem[];
  
        const seen = new Set<string>(current.map(s => skillKey(s.name, s.version)));
        const merged = [
          ...current,
          ...serverAsForm.filter(s => !seen.has(skillKey(s.name, s.version))),
        ];
  
        if (merged.length !== current.length) {
          updateFormData("skills", merged);
        }
      } finally {
        setLoadingServerSkills(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // ----------------- Technologies Context -----------------
  const { mapByName /* loading, refresh */ } = useTechnologiesContext();

  // Lista de nombres disponibles (popular skills) proveniente del contexto
  const popularSkills: string[] = useMemo(() => Object.keys(mapByName ?? {}), [mapByName]);

  // Acceso a categoría y color desde el mapa del contexto
  const getSkillCategory = (skillName: string): { category: string; color: string } | null => {
    const info = mapByName?.[skillName];
    if (!info) return null;
    return { category: info.category, color: info.color || "" };
  };

  // --------------------------------------------------------

  const skillLevels = [
    { id: "bajo",  name: "Básico",     emoji: "🌱", description: "Conceptos fundamentales claros", professional: "Básico",     color: "from-green-400 to-emerald-500", bgColor: "bg-green-50",  textColor: "text-green-700" },
    { id: "medio", name: "Intermedio", emoji: "💻", description: "Aplicación práctica en proyectos", professional: "Intermedio", color: "from-blue-400 to-cyan-500",     bgColor: "bg-blue-50",   textColor: "text-blue-700" },
    { id: "alto",  name: "Avanzado",   emoji: "🚀", description: "Experiencia sólida y buenas prácticas", professional: "Avanzado",  color: "from-purple-400 to-violet-500", bgColor: "bg-purple-50", textColor: "text-purple-700" },
  ];

  const skillMessages = [
    "¡Tu stack se fortalece! 💪",
    "¡Otra herramienta en tu arsenal! 🔧",
    "¡Perfil técnico en construcción! 🏗️",
    "¡Expandiendo horizontes tecnológicos! 🌟",
    "¡Tu toolkit crece inteligentemente! 🧠",
    "¡Agregaste superpoderes técnicos! ⚡",
    "¡Stack diversificado como un pro! 🎯",
    "¡Tecnología desbloqueada! 🔓",
    "¡Tu perfil brilla más! ✨",
    "¡Competencia técnica level up! 📈",
    "¡Herramientas de élite agregadas! 👑",
    "¡Stack building como un maestro! 🎨",
    "¡Tu expertise se expande! 🚀",
    "¡Tecnología dominada oficialmente! 🏆",
    "¡Construcción de perfil épica! 🎪",
  ];

  const isSkillInPopularList = (skillName: string) => {
    const normalizedInput = skillName.trim().toLowerCase();
    return popularSkills.some((skill: string) => skill.toLowerCase() === normalizedInput);
  };

  const isSkillAlreadyInStack = (skillName: string) => {
    const skills = formData.skills || [];
    const normalizedInput = skillName.trim().toLowerCase();
    return skills.some((s: SkillItem) => s.name.toLowerCase() === normalizedInput);
  };

  const filteredSkills: string[] = popularSkills.filter((skill: string) => {
    if (!searchTerm.trim()) return true;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const skillInfo = getSkillCategory(skill);
    const matchesName = skill.toLowerCase().includes(normalizedSearch);
    const matchesCategory = skillInfo?.category.toLowerCase().includes(normalizedSearch);
    return matchesName || matchesCategory;
  });

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => setContextualMessage(null), 3000);
  };

  const addSkill = () => {
    const skillExists = isSkillInPopularList(newSkill);
    const alreadyInStack = isSkillAlreadyInStack(newSkill);
    if (alreadyInStack) {
      showContextualSuccess(`❌ ${newSkill} ya está en tu stack tecnológico`);
      return;
    }
    if (newSkill && skillLevel && skillExists) {
      const skills = (formData.skills || []) as SkillItem[];
      const newSkillObj: SkillItem = {
        name: newSkill,
        level: skillLevel,
        ...(skillVersion.trim() && { version: skillVersion.trim() }),
      };
      updateFormData("skills", [...skills, newSkillObj]);
      setNewSkill("");
      setSkillLevel("");
      setSkillVersion("");
      addProgress(5);

      setStreakCounter((prev) => ({ ...prev, skills: prev.skills + 1 }));

      const milestoneMessages: Record<number, string[]> = {
        1: ["¡Primera tecnología en el stack! 🎉", "¡Tu journey técnico comenzó! 🛤️", "¡Primer building block colocado! 🧱"],
        3: ["¡Stack tomando forma! 🔧", "¡Diversidad técnica emergente! 🌈", "¡Tu toolkit se expande! 📦"],
        5: ["¡Stack bien diversificado! 🎯", "¡Perfil técnico balanceado! ⚖️", "¡Arsenal de herramientas sólido! 🛠️"],
        8: ["¡Stack de consultor experto! 👨‍💻", "¡Tu expertise es impresionante! 🤩", "¡Perfil técnico de élite! 🌟"],
        10: ["¡Stack master level achieved! 🏆", "¡Tu dominio técnico es épico! 🚀", "¡Eres un unicornio tecnológico! 🦄"],
      };

      const skillCount = skills.length + 1;
      if (milestoneMessages[skillCount]) {
        const randomMilestone =
          milestoneMessages[skillCount][Math.floor(Math.random() * milestoneMessages[skillCount].length)];
        addProgress(15, randomMilestone);
      }

      const randomMessage = skillMessages[Math.floor(Math.random() * skillMessages.length)];
      const versionText = skillVersion.trim() ? ` ${skillVersion.trim()}` : "";
      const levelTxt = skillLevels.find((l) => l.id === skillLevel)?.professional;

      addMotivationalMessage(
        "skill",
        randomMessage,
        `${newSkill}${versionText} ahora forma parte de tu stack técnico`,
        "🔧",
        `Nivel: ${levelTxt}`
      );
      showContextualSuccess(`✨ ${newSkill} agregado exitosamente a tu stack!`);
    }
  };

  const handlePopularSkillClick = (skillName: string) => {
    const skills = (formData.skills || []) as SkillItem[];
    if (!skills.some((s) => s.name === skillName)) {
      setSelectedTechnology(skillName);
      setTempSkillLevel("");
      setTempSkillVersion("");
      setShowSlidePanel(true);
    }
  };

  const addSkillFromPanel = async () => {
    if (!selectedTechnology || !tempSkillLevel) return;
  
    // Normaliza versión: "" -> undefined (tu backend normaliza a "")
    const versionNorm = (tempSkillVersion || '').trim() || undefined;
  
    // 1) Evita duplicados en la UI: si existe misma (name, version), actualiza level
    const skills = (formData.skills || []) as SkillItem[];
    const existingIdx = skills.findIndex(
      s => s.name.trim().toLowerCase() === selectedTechnology.trim().toLowerCase()
        && (s.version || '') === (versionNorm || '')
    );
  
    // 2) Construye objeto local (optimista)
    const optimistic: SkillItem = {
      name: selectedTechnology,
      level: tempSkillLevel,
      ...(versionNorm ? { version: versionNorm } : {}),
    };
  
    let rollback:
      | { type: 'replace'; index: number; prev: SkillItem }
      | { type: 'remove'; index: number }
      | null = null;
  
    try {
      setAddingSkill(true);
  
      // 3) Optimistic UI
      if (existingIdx >= 0) {
        rollback = { type: 'replace', index: existingIdx, prev: skills[existingIdx] };
        const next = [...skills];
        next[existingIdx] = optimistic;
        updateFormData('skills', next);
      } else {
        rollback = { type: 'remove', index: skills.length };
        updateFormData('skills', [...skills, optimistic]);
      }
  
      // 4) Persistencia real en el backend (idempotente por (cvId, skillId))
      await addCvSkill({
        name: selectedTechnology.trim(),
        version: versionNorm,
        level: tempSkillLevel,
      });
  
      // 5) UX positiva (tu lógica existente)
      addProgress(5);
      setStreakCounter(prev => ({ ...prev, skills: prev.skills + 1 }));
  
      const milestoneMessages: Record<number, string[]> = {
        1: ['¡Primera tecnología en el stack! 🎉', '¡Tu journey técnico comenzó! 🛤️', '¡Primer building block colocado! 🧱'],
        3: ['¡Stack tomando forma! 🔧', '¡Diversidad técnica emergente! 🌈', '¡Tu toolkit se expande! 📦'],
        5: ['¡Stack bien diversificado! 🎯', '¡Perfil técnico balanceado! ⚖️', '¡Arsenal de herramientas sólido! 🛠️'],
        8: ['¡Stack de consultor experto! 👨‍💻', '¡Tu expertise es impresionante! 🤩', '¡Perfil técnico de élite! 🌟'],
        10: ['¡Stack master level achieved! 🏆', '¡Tu dominio técnico es épico! 🚀', '¡Eres un unicornio tecnológico! 🦄'],
      };
      const skillCount = (formData.skills?.length || 0); // ya está actualizado optimistamente
      if (milestoneMessages[skillCount]) {
        const msg = milestoneMessages[skillCount][Math.floor(Math.random() * milestoneMessages[skillCount].length)];
        addProgress(15, msg);
      }
  
      const randomMessage = skillMessages[Math.floor(Math.random() * skillMessages.length)];
      const versionText = versionNorm ? ` ${versionNorm}` : '';
      const levelInfo = skillLevels.find(l => l.id === tempSkillLevel);
      addMotivationalMessage(
        'skill',
        randomMessage,
        `${selectedTechnology}${versionText} agregado como ${levelInfo?.professional}`,
        '⚡',
        'Configurado desde el panel lateral'
      );
      showContextualSuccess(`🚀 ${selectedTechnology} agregado exitosamente!`);
  
      // 6) Limpieza UI
      setSelectedTechnology('');
      setTempSkillLevel('');
      setTempSkillVersion('');
      setShowSlidePanel(false);
    } catch (e: any) {
      // 7) Rollback si la API falla
      if (rollback) {
        const cur = (formData.skills || []) as SkillItem[];
        if (rollback.type === 'replace') {
          const next = [...cur];
          next[rollback.index] = rollback.prev;
          updateFormData('skills', next);
        } else {
          // remove el último agregado
          const next = [...cur];
          next.splice(rollback.index, 1);
          updateFormData('skills', next);
        }
      }
      showContextualSuccess(`❌ No pudimos guardar tu skill`);
    } finally {
      setAddingSkill(false);
    }
  };

  const removeSkill = (index: number) => {
    const skills = (formData.skills || []) as SkillItem[];
    const removedSkill = skills[index];
    updateFormData(
      "skills",
      skills.filter((_, i) => i !== index)
    );
    setStreakCounter((prev) => ({ ...prev, skills: 0 }));

    const removeMessages = [
      "Stack optimizado! 🔧",
      "Refinando tu perfil técnico! ✨",
      "Ajuste estratégico realizado! 🎯",
      "Tu stack se adapta! 🔄",
      "Perfeccionando la selección! 📝",
      "Stack curation en acción! 🎪",
    ];
    const randomMessage = removeMessages[Math.floor(Math.random() * removeMessages.length)];
    addMotivationalMessage("skill", randomMessage, `${removedSkill.name} removido del stack`, "🗑️");
  };

  const requestNewSkill = async () => {
    if (!newSkill.trim() || !skillLevel) return;
    if (isSkillAlreadyInStack(newSkill)) {
      showContextualSuccess(`❌ ${newSkill} ya está en tu stack tecnológico`);
      return;
    }

    setIsRequestingSkill(true);
    try {
      // Aquí podrías llamar a un endpoint de "solicitar nueva tecnología"
      await createSuggestion({
        name: newSkill.trim(),
        version: skillVersion.trim() || undefined,
        category: "Otros",
        color: undefined,
      });
      const versionText = skillVersion.trim() ? ` ${skillVersion.trim()}` : "";
      addMotivationalMessage(
        "skill",
        "¡Solicitud enviada! 📧",
        `Hemos notificado al admin sobre "${newSkill}${versionText}" (nivel: ${
          skillLevels.find((l) => l.id === skillLevel)?.name
        }). Te avisaremos cuando esté disponible.`,
        "✨",
        "Tecnología solicitada para agregar a las tecnologías populares de Axity"
      );
      addProgress(2, "¡Contribuyendo a las tecnologías populares de Axity! 🔧");
      setNewSkill("");
      setSkillLevel("");
      setSkillVersion("");
    } catch {
      addMotivationalMessage("skill", "Error al enviar solicitud", "Intenta de nuevo en unos momentos.", "⚠️");
    } finally {
      setIsRequestingSkill(false);
    }
  };

  const hasSkillName = newSkill.trim().length > 0;
  const hasSkillLevel = skillLevel.length > 0;
  const skillExists = hasSkillName && isSkillInPopularList(newSkill);
  const skillIsNew = hasSkillName && !isSkillInPopularList(newSkill);
  const skillAlreadyExists = hasSkillName && isSkillAlreadyInStack(newSkill);

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {contextualMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-gradient-to-r from-[var(--axity-mint)] to-emerald-500 text-white rounded-xl p-4 shadow-lg border border-green-200"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-2xl"
              >
                ✨
              </motion.div>
              <p className="font-medium">{contextualMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module to admin */}
      {!authLoading && isAuthenticated && user?.role === "ADMIN" && <TechnologiesAdmin />}

      {/* Current Skills Display */}
      {formData.skills && formData.skills.length > 0 && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-[var(--axity-mint)] to-emerald-500 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">
                  Tu Stack Tecnológico ({formData.skills.length})
                </h4>
                <p className="text-sm text-green-600">
                  Tecnologías que dominas y que forman parte de tu perfil
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {formData.skills.map((skill: SkillItem, index: number) => {
                const skillInfo = getSkillCategory(skill.name);
                const levelInfo = skillLevels.find((l) => l.id === skill.level);

                return (
                  <motion.div
                    key={`${skill.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    className="group relative bg-white rounded-lg border border-green-200 p-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{levelInfo?.emoji}</span>
                        <div>
                          <div className="font-medium text-green-800 text-sm">
                            {skill.name}
                            {skill.version && (
                              <span className="text-sm text-green-600 ml-1">v{skill.version}</span>
                            )}
                          </div>
                          <div className="text-xs text-green-600">{levelInfo?.name}</div>
                        </div>
                      </div>

                      {skillInfo && (
                        <Badge className={`text-xs ${skillInfo.color} border-0`}>{skillInfo.category}</Badge>
                      )}

                      <motion.button
                        onClick={() => removeSkill(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-1 hover:bg-red-100 rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Popular Skills */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h4 className="text-lg font-bold text-[var(--axity-purple)]">Tecnologías populares en Axity 🔥</h4>
            <p className="text-sm text-gray-500 mt-1">
              {popularSkills.length} tecnologías disponibles • Haz click para configurar tu nivel
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar tecnologías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 border-gray-200 focus:border-[var(--axity-violet)] transition-colors"
            />
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Search Results Info */}
        {searchTerm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 text-sm text-gray-600">
            <Search className="h-4 w-4" />
            <span>
              {filteredSkills.length} tecnología{filteredSkills.length !== 1 ? "s" : ""} encontrada
              {filteredSkills.length !== 1 ? "s" : ""}
              {filteredSkills.length > 0 && (
                <span className="text-[var(--axity-purple)] font-medium ml-1">para "{searchTerm}"</span>
              )}
            </span>
          </motion.div>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredSkills.map((skill: string, index: number) => {
            const skillInfo = getSkillCategory(skill);
            const isAlreadyAdded = (formData.skills || []).some((s: SkillItem) => s.name === skill);

            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 20) * 0.05 }}
                className={`relative group transition-all ${
                  isAlreadyAdded ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-105"
                }`}
                onClick={() => !isAlreadyAdded && handlePopularSkillClick(skill)}
              >
                <motion.div
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    isAlreadyAdded
                      ? "bg-gray-100 border-gray-200"
                      : "bg-white border-gray-200 hover:border-[var(--axity-violet)] hover:shadow-md"
                  }`}
                  whileHover={!isAlreadyAdded ? { scale: 1.02 } : {}}
                  whileTap={!isAlreadyAdded ? { scale: 0.98 } : {}}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`text-2xl ${isAlreadyAdded ? "grayscale" : ""}`}>
                      {skill === "React" && "⚛️"}
                      {skill === "Angular" && "🅰️"}
                      {skill === "Vue.js" && "💚"}
                      {skill === "Node.js" && "🟢"}
                      {skill === "Python" && "🐍"}
                      {skill === "Java" && "☕"}
                      {skill === "JavaScript" && "🟨"}
                      {skill === "TypeScript" && "🔷"}
                      {skill === "Docker" && "🐋"}
                      {skill === "AWS" && "☁️"}
                      {!["React", "Angular", "Vue.js", "Node.js", "Python", "Java", "JavaScript", "TypeScript", "Docker", "AWS"].includes(skill) && "💻"}
                    </div>

                    <div className="space-y-1">
                      <h5 className={`font-medium text-sm ${isAlreadyAdded ? "text-gray-500" : "text-gray-800"}`}>{skill}</h5>
                      {skillInfo && (
                        <Badge className={`text-xs ${isAlreadyAdded ? "bg-gray-200 text-gray-500" : skillInfo.color} border-0`}>
                          {skillInfo.category}
                        </Badge>
                      )}
                    </div>

                    {isAlreadyAdded && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 bg-[var(--axity-mint)] text-white rounded-full p-1">
                        <CheckCircle2 className="h-3 w-3" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Manual Skill Entry */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[var(--axity-violet)] to-purple-500 rounded-lg">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-[var(--axity-purple)]">¿No encuentras una tecnología? 🔍</h4>
            <p className="text-sm text-gray-500">Agrega cualquier tecnología manualmente</p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="skill-name" className="text-[var(--axity-purple)]">
                    Nombre de la tecnología *
                  </Label>
                  <Input
                    id="skill-name"
                    placeholder="ej. Laravel, Docker, etc."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="bg-white/80 border-purple-200 focus:border-[var(--axity-violet)]"
                  />
                </div>

                <div>
                  <Label htmlFor="skill-level" className="text-[var(--axity-purple)]">
                    Nivel de experiencia *
                  </Label>
                  <Select value={skillLevel} onValueChange={setSkillLevel}>
                    <SelectTrigger className="bg-white/80 border-purple-200 focus:border-[var(--axity-violet)]">
                      <SelectValue placeholder="Selecciona nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id}>
                          <div className="flex items-center gap-2">
                            <span>{level.emoji}</span>
                            <span>{level.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="skill-version" className="text-[var(--axity-purple)]">
                    Versión (opcional)
                  </Label>
                  <Input
                    id="skill-version"
                    placeholder="ej. 8.2, 20.x, etc."
                    value={skillVersion}
                    onChange={(e) => setSkillVersion(e.target.value)}
                    className="bg-white/80 border-purple-200 focus:border-[var(--axity-violet)]"
                  />
                </div>
              </div>

              {/* Dynamic Action Buttons - Tres validaciones independientes */}
              <div className="space-y-4">
                {/* Validación 1: Tecnología ya existe en el stack del usuario */}
                <AnimatePresence>
                  {skillAlreadyExists && (
                    <motion.div
                      key="already-exists"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[var(--axity-blue)] mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-[var(--axity-blue)] font-medium mb-1">
                            ¡Ya tienes "{newSkill}" en tu stack! 🎯
                          </p>
                          <p className="text-sm text-gray-600">
                            Esta tecnología ya forma parte de tu perfil profesional. Puedes encontrarla en la sección "Tu Stack Tecnológico" arriba.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Validación 2: Tecnología popular disponible pero NO en stack */}
                <AnimatePresence>
                  {skillExists && !skillAlreadyExists && (
                    <motion.div
                      key="popular-available"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="space-y-3">
                        {/* Info */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <Sparkles className="h-4 w-4 text-[var(--axity-violet)]" />
                            <div className="flex-1">
                              <p className="text-sm text-[var(--axity-violet)] font-medium">
                                "{newSkill}" está disponible en los botones de arriba ⭐
                              </p>
                              <p className="text-xs text-gray-600">
                                Puedes agregarlo aquí {hasSkillLevel ? "" : "(selecciona un nivel primero) "}o usando los botones de tecnologías populares
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Botón principal para agregar - Solo si tiene nivel */}
                        {hasSkillLevel && (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                            <Button
                              onClick={addSkill}
                              className="w-full bg-gradient-to-r from-[var(--axity-mint)] to-emerald-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Agregar {newSkill} a mi stack 🚀
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Validación 3: Tecnología nueva (no en catálogo) */}
                <AnimatePresence>
                  {skillIsNew && !skillAlreadyExists && (
                    <motion.div
                      key="new-technology"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-amber-50 border border-amber-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-amber-800 mb-3">
                            "{newSkill}" no está en nuestras tecnologías populares.{" "}
                            {hasSkillLevel ? "¿Te gustaría solicitarla para agregarla?" : "Selecciona un nivel de experiencia y podrás solicitarla."}
                          </p>

                          {/* Botón solicitar - Solo si tiene nivel */}
                          {hasSkillLevel && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                              <Button
                                onClick={requestNewSkill}
                                disabled={isRequestingSkill}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                              >
                                {isRequestingSkill ? (
                                  <>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                      <Settings className="h-4 w-4 mr-2" />
                                    </motion.div>
                                    Enviando solicitud...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Solicitar "{newSkill}" 📧
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Side Panel for Technology Configuration */}
      <Sheet open={showSlidePanel} onOpenChange={setShowSlidePanel}>
        <SheetContent
          side="right"
          className="w-[calc(100vw-1.5rem)] max-w-none sm:w-[800px] lg:w-[950px] xl:w-[1100px] 2xl:w-[1200px] overflow-y-auto sm:mr-0 mr-3"
        >
          <SheetHeader className="space-y-4 pb-6 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-xl flex items-center justify-center">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <SheetTitle className="text-xl text-[var(--axity-purple)]">Configurar tecnología</SheetTitle>
                <SheetDescription className="text-sm text-[var(--axity-gray)]">
                  Especifica tu nivel de experiencia para {selectedTechnology}
                </SheetDescription>
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[var(--axity-gray)]">
                <span>Configuración de tecnología</span>
                <span>{tempSkillLevel ? "100%" : "50%"}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] h-2 rounded-full"
                  initial={{ width: "50%" }}
                  animate={{ width: tempSkillLevel ? "100%" : "50%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center px-4">
              <div className="relative flex items-center gap-6 sm:gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-full flex items-center justify-center">
                    <Code2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-[var(--axity-purple)]">Tecnología</span>
                </div>

                <div className="h-0.5 w-6 sm:w-8 bg-[var(--axity-mint)]"></div>

                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      tempSkillLevel ? "bg-gradient-to-br from-[var(--axity-mint)] to-emerald-500" : "bg-gray-200"
                    }`}
                  >
                    {tempSkillLevel ? <CheckCircle2 className="h-4 w-4 text-white" /> : <Settings className="h-4 w-4 text-gray-400" />}
                  </div>
                  <span className={`text-xs font-medium ${tempSkillLevel ? "text-[var(--axity-mint)]" : "text-gray-400"}`}>Nivel</span>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Panel Content */}
          <div className="px-4 lg:px-6 space-y-6">
            {selectedTechnology && (
              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {selectedTechnology === "React" && "⚛️"}
                      {selectedTechnology === "Angular" && "🅰️"}
                      {selectedTechnology === "Vue.js" && "💚"}
                      {selectedTechnology === "Node.js" && "🟢"}
                      {selectedTechnology === "Python" && "🐍"}
                      {selectedTechnology === "Java" && "☕"}
                      {selectedTechnology === "JavaScript" && "🟨"}
                      {selectedTechnology === "TypeScript" && "🔷"}
                      {selectedTechnology === "Docker" && "🐋"}
                      {selectedTechnology === "AWS" && "☁️"}
                      {!["React", "Angular", "Vue.js", "Node.js", "Python", "Java", "JavaScript", "TypeScript", "Docker", "AWS"].includes(selectedTechnology) && "💻"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[var(--axity-purple)]">{selectedTechnology}</h3>
                      {getSkillCategory(selectedTechnology) && (
                        <Badge className={`text-xs ${getSkillCategory(selectedTechnology)!.color} border-0 mt-1`}>
                          {getSkillCategory(selectedTechnology)!.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Level Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[var(--axity-purple)]" />
                <Label className="text-[var(--axity-purple)] font-medium">Nivel de experiencia *</Label>
              </div>
              <div className="grid gap-3">
                {skillLevels.map((level) => (
                  <motion.div
                    key={level.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      tempSkillLevel === level.id ? "border-[var(--axity-violet)] bg-[var(--axity-violet)]/10" : "border-gray-200 hover:border-[var(--axity-violet)]/50"
                    }`}
                    onClick={() => setTempSkillLevel(level.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{level.emoji}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-[var(--axity-purple)]">{level.name}</h4>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                      {tempSkillLevel === level.id && <CheckCircle2 className="h-5 w-5 text-[var(--axity-violet)]" />}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Version Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-[var(--axity-gray)]" />
                <Label htmlFor="temp-version" className="text-[var(--axity-purple)] font-medium">
                  Versión (opcional)
                </Label>
              </div>
              <Input
                id="temp-version"
                placeholder="ej. 18.x, 8.2, 2023, etc."
                value={tempSkillVersion}
                onChange={(e) => setTempSkillVersion(e.target.value)}
                className="bg-white/80 border-purple-200 focus:border-[var(--axity-violet)]"
              />
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Especifica la versión si es relevante para tu experiencia
              </p>
            </div>
          </div>

          {/* Fixed Action Buttons at Bottom */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 lg:p-6 mt-8">
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowSlidePanel(false)} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={() => void addSkillFromPanel()} disabled={addingSkill || !selectedTechnology || !tempSkillLevel}
                className="flex-1 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] hover:opacity-90 text-white disabled:opacity-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                {addingSkill ? 'Guardando…' : 'Agregar skill'}
              </Button>
            </div>

            {!tempSkillLevel && <p className="text-xs text-gray-500 text-center mt-2">Selecciona un nivel de experiencia para continuar</p>}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
