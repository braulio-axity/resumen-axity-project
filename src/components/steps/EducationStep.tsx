import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { 
  Plus, 
  Clock, 
  GraduationCap, 
  Trophy,
  CheckCircle,
  Play,
  X,
  Globe,
  ShieldCheck
} from "lucide-react";

import type {
  FormData,
  UpdateFormData,
  AddMotivationalMessage,
  StreakCounter
} from "../../types/app";

type EducationItem = NonNullable<FormData["education"]>[number];
type CertificationItem = NonNullable<FormData["certifications"]>[number];

interface EducationStepProps {
  formData: FormData;
  updateFormData: UpdateFormData; 
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: AddMotivationalMessage;
  streakCounter: StreakCounter;
  setStreakCounter: React.Dispatch<React.SetStateAction<StreakCounter>>;
}

export function EducationStep({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  setStreakCounter
}: EducationStepProps) {
  const [showEducationForm, setShowEducationForm] = useState<boolean>(false);
  const [showCertForm, setShowCertForm] = useState<boolean>(false);
  const [contextualMessage, setContextualMessage] = useState<string | null>(null);


  const [currentEducation, setCurrentEducation] = useState<EducationItem>({
    institution: "",
    degree: "",
    field: "",
    year: "",
    achievements: "",
    status: "" as EducationItem["status"],
    isInternational: false as EducationItem["isInternational"],
    hasApostille: false as EducationItem["hasApostille"]
  });

  const [currentCert, setCurrentCert] = useState<CertificationItem>({
    name: "",
    issuer: "",
    year: "",
    credentialId: ""
  });

  // Mensajes dinámicos para educación
  const educationMessages: string[] = [
    "¡Knowledge is power activado! 🧠",
    "¡Tu formación académica destaca! 🌟",
    "¡Bases sólidas documentadas! 🏛️",
    "¡Inversión en conocimiento registrada! 💡",
    "¡Tu background académico brilla! ✨",
    "¡Fundamentos técnicos confirmados! 🎯",
    "¡Educación de calidad verificada! ✅",
    "¡Tu preparación académica impresiona! 📚",
    "¡Conocimiento estructurado añadido! 🔧",
    "¡Formación técnica level up! 📈",
    "¡Tu expertise tiene raíces profundas! 🌳",
    "¡Background académico sobresaliente! 🏆",
    "¡Credenciales educativas desbloqueadas! 🔓",
    "¡Tu preparación es tu superpoder! ⚡",
    "¡Fundación académica rock solid! 🗿"
  ];

  // Mensajes dinámicos para certificaciones
  const certificationMessages: string[] = [
    "¡Credencial técnica desbloqueada! 🏅",
    "¡Tu expertise está certificada! ✅",
    "¡Skills oficialmente validados! 🎖️",
    "¡Certificación de élite añadida! 👑",
    "¡Tu conocimiento tiene respaldo oficial! 📜",
    "¡Competencias técnicas verificadas! 🔍",
    "¡Badge profesional conseguido! 🏆",
    "¡Tu expertise ahora es incuestionable! 💪",
    "¡Credencial industry-standard! 🌟",
    "¡Certificación que abre puertas! 🚪",
    "¡Tu perfil gana credibilidad! 📈",
    "¡Skills certificados = Skills confiables! 🤝",
    "¡Validation técnica completada! ✨",
    "¡Tu conocimiento tiene sello de calidad! 🎯",
    "¡Certificación que habla por ti! 💬"
  ];

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => {
      setContextualMessage(null);
    }, 3000);
  };

  const validateYear = (year: string): { isValid: boolean; message: string | null } => {
    if (!year) return { isValid: true, message: null }

    if (year.length !== 4) {
      return { isValid: false, message: "📅 El año debe tener exactamente 4 dígitos" };
    }
    const yearNumber = parseInt(year, 10);
    if (Number.isNaN(yearNumber)) {
      return { isValid: false, message: "📅 Ingresa solo números" };
    }
    if (yearNumber < 0) {
      return { isValid: false, message: "📅 El año no puede ser negativo" };
    }
    const currentYear = new Date().getFullYear();
    if (yearNumber < 1900 || yearNumber > currentYear + 10) {
      return { isValid: false, message: `📅 Año debe estar entre 1900 y ${currentYear + 10}` };
    }
    return { isValid: true, message: null };
  };

  const handleYearChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setCurrentEducation(prev => ({ ...prev, year: numericValue }));
  };

  const handleCertYearChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setCurrentCert(prev => ({ ...prev, year: numericValue }));
  };

  const isEducationFormValid = (): boolean => {
    if (!currentEducation.institution || !currentEducation.degree || !currentEducation.status) {
      return false;
    }
    if (currentEducation.status === "terminado" && !currentEducation.year) {
      return false;
    }
    if (currentEducation.year) {
      const yearValidation = validateYear(currentEducation.year);
      if (!yearValidation.isValid) return false;
    }
    return true;
  };

  const isYearFieldEnabled = (): boolean => currentEducation.status !== "";

  const addEducation = (): void => {
    if (!isEducationFormValid()) return;

    const education = formData.education ?? [];
    updateFormData("education", [...education, currentEducation]);

    setCurrentEducation({
      institution: "",
      degree: "",
      field: "",
      year: "",
      achievements: "",
      status: "" as EducationItem["status"],
      isInternational: false as EducationItem["isInternational"],
      hasApostille: false as EducationItem["hasApostille"]
    });
    setShowEducationForm(false);

    setStreakCounter(prev => ({ ...prev, education: prev.education + 1 }));

    const educationMilestones: Record<number, string[]> = {
      1: ["¡Fundación académica establecida! 🏛️", "¡Tu preparación formal brilla! ✨", "¡Base de conocimiento sólida! 🧠"],
      2: ["¡Formación académica diversa! 📚", "¡Tu preparación es excepcional! 🌟", "¡Background educativo impresionante! 🎓"],
      3: ["¡Académicamente sobresaliente! 👑", "¡Tu formación es tu superpoder! ⚡", "¡Education level: Expert! 🏆"]
    };

    const eduCount = education.length + 1;
    if (educationMilestones[eduCount]) {
      const randomMilestone = educationMilestones[eduCount][Math.floor(Math.random() * educationMilestones[eduCount].length)];
      addProgress(8, randomMilestone);
    } else {
      addProgress(8);
    }

    const randomMessage = educationMessages[Math.floor(Math.random() * educationMessages.length)];
    addMotivationalMessage(
      "education",
      randomMessage,
      `${currentEducation.degree} en ${currentEducation.institution} - ¡Excelente preparación!`,
      "🎓",
      `Graduado en ${currentEducation.year || "fecha por especificar"}`
    );

    showContextualSuccess(`🎓 Formación en ${currentEducation.institution} agregada exitosamente!`);
  };

  const isCertificationFormValid = (): boolean => {
    if (!currentCert.name || !currentCert.issuer) return false;
    if (currentCert.year) {
      const yearValidation = validateYear(currentCert.year);
      if (!yearValidation.isValid) return false;
    }
    return true;
  };

  const addCertification = (): void => {
    if (!isCertificationFormValid()) return;

    const certifications = formData.certifications ?? [];
    updateFormData("certifications", [...certifications, currentCert]);

    setCurrentCert({ name: "", issuer: "", year: "", credentialId: "" });
    setShowCertForm(false);

    setStreakCounter(prev => ({ ...prev, certifications: prev.certifications + 1 }));

    const certificationMilestones: Record<number, string[]> = {
      1: ["¡Primera certificación desbloqueada! 🏅", "¡Tu expertise está validada! ✅", "¡Credencial técnica conseguida! 🎖️"],
      3: ["¡Portfolio de certificaciones sólido! 💪", "¡Tus skills están bien respaldados! 🛡️", "¡Certificaciones de peso! ⚖️"],
      5: ["¡Eres una máquina de certificaciones! 🤖", "¡Validation master achieved! 🏆", "¡Tu expertise es incuestionable! 👑"],
      10: ["¡Certificación collector achieved! 🏆", "¡Eres un experto certificado en todo! 🌟", "¡Tu credibilidad es infinita! ♾️"]
    };

    const certCount = certifications.length + 1;
    if (certificationMilestones[certCount]) {
      const randomMilestone = certificationMilestones[certCount][Math.floor(Math.random() * certificationMilestones[certCount].length)];
      addProgress(10, randomMilestone);
    } else {
      addProgress(10);
    }

    const randomMessage = certificationMessages[Math.floor(Math.random() * certificationMessages.length)];
    addMotivationalMessage(
      "certification",
      randomMessage,
      `${currentCert.name} de ${currentCert.issuer} - ¡Tu expertise está validada!`,
      "🏆",
      `Certificado en ${currentCert.year || "fecha por especificar"}`
    );

    showContextualSuccess(`🏆 Certificación ${currentCert.name} agregada exitosamente!`);
  };

  const createTimelineData = () => {
    const education = (formData.education ?? []).map((edu: EducationItem) => ({
      ...edu,
      type: "education" as const,
      sortYear: parseInt(edu.year as string, 10) || 0
    }));

    const certifications = (formData.certifications ?? []).map((cert: CertificationItem) => ({
      ...cert,
      type: "certification" as const,
      sortYear: parseInt(cert.year as string, 10) || 0
    }));

    const completedEducation = education.filter(item => item.status === "terminado" && item.sortYear > 0);
    const inProgressEducation = education.filter(item => item.status === "en-curso");
    const incompleteEducation = education.filter(item => item.status === "incompleto");

    const completedTimeline = [...completedEducation, ...certifications.filter(cert => cert.sortYear > 0)]
      .sort((a, b) => a.sortYear - b.sortYear);

    return {
      completed: completedTimeline,
      inProgress: inProgressEducation,
      incomplete: incompleteEducation
    };
  };

  const timelineData = createTimelineData();

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {contextualMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-4 shadow-lg border border-emerald-200"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--axity-mint)] to-[var(--axity-purple)]">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="text-2xl"
              >
                📚
              </motion.div>
              <p className="font-medium">{contextualMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {timelineData.completed.length > 0 && (
        <div className="relative">
          <h4 className="text-lg font-bold text-[var(--axity-purple)] mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tu cronología de aprendizaje ({timelineData.completed.length} elementos completados)
          </h4>
          
          {/* Timeline Container */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-purple-400 to-yellow-400 opacity-30"></div>
            
            <div className="space-y-8">
              {timelineData.completed.map((item, index) => (
                <motion.div
                  key={`completed-${index}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-start gap-6"
                >
                  {/* Timeline Dot */}
                  <motion.div
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                      item.type === 'education' 
                        ? 'bg-gradient-to-br from-emerald-400 to-green-500' 
                        : 'bg-gradient-to-br from-yellow-400 to-orange-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.type === 'education' ? (
                      <GraduationCap className="h-8 w-8 text-white" />
                    ) : (
                      <Trophy className="h-8 w-8 text-white" />
                    )}
                    
                    {/* Year Badge */}
                    <div className="absolute -top-2 -right-2 bg-white border-2 border-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-[var(--axity-purple)]">
                      {item.sortYear.toString().slice(-2)}
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div
                    className={`flex-1 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border ${
                      item.type === 'education'
                        ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
                        : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    {item.type === 'education' ? (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="font-bold text-[var(--axity-purple)] mb-1">
                              {item.degree}
                            </h5>
                            <p className="text-emerald-700 font-medium">{item.institution}</p>
                            {item.field && (
                              <p className="text-sm text-gray-600 mt-1">{item.field}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                                Terminado
                              </span>
                            </div>
                            
                            {/* Indicadores de validación internacional */}
                            {item.isInternational && (
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Internacional
                                </Badge>
                                {item.hasApostille && (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                    Apostillado
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                            {item.year}
                          </Badge>
                        </div>
                        
                        {item.achievements && (
                          <div className="bg-emerald-100/50 p-3 rounded-lg border border-emerald-200">
                            <p className="text-sm text-emerald-800">{item.achievements}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h5 className="font-bold text-[var(--axity-purple)] mb-1">
                              {item.name}
                            </h5>
                            <p className="text-yellow-700 font-medium">{item.issuer}</p>
                            {item.credentialId && (
                              <p className="text-xs text-gray-500 mt-1">
                                ID: {item.credentialId}
                              </p>
                            )}
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            {item.year}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Estudios en curso */}
      {timelineData.inProgress.length > 0 && (
        <div className="relative">
          <h4 className="text-lg font-bold text-[var(--axity-blue)] mb-4 flex items-center gap-2">
            <Play className="h-5 w-5" />
            Estudios en curso ({timelineData.inProgress.length})
          </h4>
          
          <div className="space-y-4">
            {timelineData.inProgress.map((item, index) => (
              <motion.div
                key={`inprogress-${index}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Play className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        En curso
                      </span>
                    </div>
                    <h5 className="font-bold text-[var(--axity-purple)] mb-1">
                      {item.degree}
                    </h5>
                    <p className="text-blue-700 font-medium">{item.institution}</p>
                    {item.field && (
                      <p className="text-sm text-gray-600 mt-1">{item.field}</p>
                    )}
                    {item.year && (
                      <p className="text-xs text-gray-500 mt-1">Inicio: {item.year}</p>
                    )}
                  </div>
                </div>
                {item.achievements && (
                  <div className="bg-blue-100/50 p-3 rounded-lg border border-blue-200 mt-3">
                    <p className="text-sm text-blue-800">{item.achievements}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Estudios incompletos - Al final en rojo */}
      {timelineData.incomplete.length > 0 && (
        <div className="relative">
          <h4 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
            <X className="h-5 w-5" />
            Estudios incompletos ({timelineData.incomplete.length})
          </h4>
          
          <div className="space-y-4">
            {timelineData.incomplete.map((item, index) => (
              <motion.div
                key={`incomplete-${index}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <X className="h-4 w-4 text-red-500" />
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
                        Incompleto
                      </span>
                    </div>
                    <h5 className="font-bold text-[var(--axity-purple)] mb-1">
                      {item.degree}
                    </h5>
                    <p className="text-red-700 font-medium">{item.institution}</p>
                    {item.field && (
                      <p className="text-sm text-gray-600 mt-1">{item.field}</p>
                    )}
                    {item.year && (
                      <p className="text-xs text-gray-500 mt-1">Año: {item.year}</p>
                    )}
                  </div>
                </div>
                {item.achievements && (
                  <div className="bg-red-100/50 p-3 rounded-lg border border-red-200 mt-3">
                    <p className="text-sm text-red-800">{item.achievements}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add Content Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Education */}
        <Card className="border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 transition-all">
          <CardContent className="p-6 text-center">
            {!showEducationForm ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--axity-purple)] mb-2">
                      ¿Dónde estudiaste? 🎓
                    </h4>
                    <p className="text-sm text-emerald-600">
                      Agrega tu formación académica: universidades, institutos, carreras técnicas...
                    </p>
                    <Button 
                      onClick={() => setShowEducationForm(true)}
                      className="mt-4 w-full bg-gradient-to-r from-[var(--axity-mint)] to-[var(--axity-mint)] hover:from-emerald-500 hover:to-teal-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar formación académica 📚
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                  <h4 className="font-bold text-[var(--axity-purple)]">Nueva formación académica</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>¿En qué institución estudiaste? 🏛️</Label>
                    <Input
                      placeholder="Universidad/Instituto"
                      value={currentEducation.institution}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, institution: e.target.value }))}
                      className="bg-white/80 border-gray-200"
                    />
                  </div>
                  <div>
                    <Label>¿Qué título obtuviste? 🎓</Label>
                    <Input
                      placeholder="Licenciatura, Ingeniería, Maestría, etc."
                      value={currentEducation.degree}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, degree: e.target.value }))}
                      className="bg-white/80 border-gray-200"
                    />
                  </div>
                  <div>
                    <Label>Área de especialización 📖</Label>
                    <Input
                      placeholder="Sistemas, Software, Datos, etc."
                      value={currentEducation.field}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, field: e.target.value }))}
                      className="bg-white/80 border-gray-200"
                    />
                  </div>
                  
                  {/* REORDENADO: Estado del estudio va ANTES que año */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Estado del estudio 📊 *</Label>
                      <Select 
                        value={currentEducation.status as string} 
                        onValueChange={(value) => setCurrentEducation(prev => ({ 
                          ...prev, 
                          status: value as EducationItem["status"],
                          // Limpiar campos de validación internacional si no es terminado
                          isInternational: (value as EducationItem["status"]) === 'terminado' ? prev.isInternational : false,
                          hasApostille: (value as EducationItem["status"]) === 'terminado' ? prev.hasApostille : false
                        }))}
                      >
                        <SelectTrigger className="bg-white/80 border-gray-200">
                          <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="terminado">✅ Terminado</SelectItem>
                          <SelectItem value="en-curso">▶️ En curso</SelectItem>
                          <SelectItem value="incompleto">❌ Incompleto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>
                        Año de graduación 📅
                        {currentEducation.status === 'terminado' && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </Label>
                      <Input
                        type="text"
                        placeholder="2024"
                        value={currentEducation.year as string}
                        onChange={(e) => handleYearChange(e.target.value)}
                        disabled={!isYearFieldEnabled()}
                        maxLength={4}
                        className={`bg-white/80 transition-all duration-200 ${
                          !isYearFieldEnabled() 
                            ? 'opacity-50 cursor-not-allowed bg-gray-100' 
                            : (() => {
                                const yearValidation = validateYear((currentEducation.year as string) || "");
                                const isTerminadoWithoutYear = currentEducation.status === 'terminado' && !currentEducation.year;
                                
                                if (!yearValidation.isValid || isTerminadoWithoutYear) {
                                  return 'border-red-300 focus:border-red-500';
                                }
                                return 'border-gray-200';
                              })()
                        }`}
                      />
                      {!isYearFieldEnabled() && (
                        <p className="text-xs text-gray-400 mt-1">
                          ⚠️ Selecciona primero el estado del estudio
                        </p>
                      )}
                      {isYearFieldEnabled() && (() => {
                        const yearValidation = validateYear((currentEducation.year as string) || "");
                        
                        // Mostrar error de validación de formato
                        if (currentEducation.year && !yearValidation.isValid) {
                          return (
                            <p className="text-xs text-red-600 mt-1">
                              {yearValidation.message}
                            </p>
                          );
                        }
                        
                        // Mostrar requerimiento para terminado
                        if (currentEducation.status === 'terminado' && !currentEducation.year) {
                          return (
                            <p className="text-xs text-red-600 mt-1">
                              📅 Año requerido para estudios terminados
                            </p>
                          );
                        }
                        
                        // Mostrar info para estados opcionales
                        if ((currentEducation.status === 'en-curso' || currentEducation.status === 'incompleto') && !currentEducation.year) {
                          return (
                            <p className="text-xs text-gray-500 mt-1">
                              ℹ️ Año opcional para estudios {
                                currentEducation.status === 'en-curso' ? 'en curso' : 'incompletos'
                              } (formato: YYYY)
                            </p>
                          );
                        }
                        
                        // Mostrar info de formato cuando está escribiendo
                        if (currentEducation.year && (currentEducation.year as string).length > 0 && (currentEducation.year as string).length < 4) {
                          return (
                            <p className="text-xs text-blue-600 mt-1">
                              📝 Formato: año completo de 4 dígitos (ej: 2024)
                            </p>
                          );
                        }
                        
                        return null;
                      })()}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Logros académicos destacados 🌟</Label>
                    <Textarea
                      placeholder="Menciones honoríficas, promedio destacado, proyectos de tesis, reconocimientos..."
                      value={currentEducation.achievements || ""}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, achievements: e.target.value as EducationItem["achievements"] }))}
                      rows={2}
                      className="bg-white/80 border-gray-200"
                    />
                  </div>
                  
                  {/* Validación de estudios extranjeros - Solo para estudios terminados */}
                  {currentEducation.status === 'terminado' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="h-5 w-5 text-blue-600" />
                        <Label className="text-blue-700 font-semibold">Validación Internacional</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is-international"
                          checked={!!currentEducation.isInternational}
                          onCheckedChange={(checked) => {
                            setCurrentEducation(prev => ({ 
                              ...prev, 
                              isInternational: !!checked as EducationItem["isInternational"],
                              hasApostille: false as EducationItem["hasApostille"]
                            }))
                          }}
                        />
                        <Label htmlFor="is-international" className="text-sm font-medium">
                          ¿Obtuviste este título en el extranjero? 🌍
                        </Label>
                      </div>
                      
                      {currentEducation.isInternational && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 ml-6 pl-4 border-l-2 border-blue-300"
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="has-apostille"
                              checked={!!currentEducation.hasApostille}
                              onCheckedChange={(checked) => {
                                setCurrentEducation(prev => ({ 
                                  ...prev, 
                                  hasApostille: !!checked as EducationItem["hasApostille"]
                                }))
                              }}
                            />
                            <Label htmlFor="has-apostille" className="text-sm">
                              ¿Tu título está apostillado? 📜
                            </Label>
                          </div>
                          
                          {currentEducation.hasApostille && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="ml-6 mt-2 p-2 bg-green-100 border border-green-300 rounded-md"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-xs font-medium text-green-700">
                                  ✅ Título internacional apostillado
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={() => setShowEducationForm(false)} 
                    variant="outline" 
                    className="flex-1 bg-white border-gray-300 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={addEducation}
                    disabled={!isEducationFormValid()}
                    className="flex-1 bg-gradient-to-r from-[var(--axity-mint)] to-[var(--axity-mint)] hover:from-emerald-500 hover:to-teal-600 text-white"
                  >
                    Guardar 📚
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Certification */}
        <Card className="border-2 border-dashed border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 transition-all">
          <CardContent className="p-6 text-center">
            {!showCertForm ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--axity-purple)] mb-2">
                      ¿Qué certificaciones tienes? 🏆
                    </h4>
                    <p className="text-sm text-yellow-600">
                      Comparte tus certificaciones técnicas: AWS, Azure, Google Cloud, Microsoft...
                    </p>
                    <Button 
                      onClick={() => setShowCertForm(true)}
                      className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-300 hover:to-yellow-400 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar certificación técnica 🏆
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-bold text-[var(--axity-purple)]">Nueva certificación técnica</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Nombre de la certificación 🎖️</Label>
                    <Input
                      placeholder="AWS Solutions Architect, Scrum Master, etc."
                      value={currentCert.name}
                      onChange={(e) => setCurrentCert(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/80 border-gray-200"
                    />
                  </div>
                  <div>
                    <Label>Organización certificadora 🏢</Label>
                    <Input
                      placeholder="Amazon Web Services, Microsoft, Google, etc."
                      value={currentCert.issuer}
                      onChange={(e) => setCurrentCert(prev => ({ ...prev, issuer: e.target.value }))}
                      className="bg-white/80 border-gray-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Año de certificación 📅</Label>
                      <Input
                        type="text"
                        placeholder="2024"
                        value={currentCert.year as string}
                        onChange={(e) => handleCertYearChange(e.target.value)}
                        maxLength={4}
                        className={`bg-white/80 transition-all duration-200 ${
                          (() => {
                            const yearValidation = validateYear((currentCert.year as string) || "");
                            if (currentCert.year && !yearValidation.isValid) {
                              return 'border-red-300 focus:border-red-500';
                            }
                            return 'border-gray-200';
                          })()
                        }`}
                      />
                      {(() => {
                        const yearValidation = validateYear((currentCert.year as string) || "");
                        
                        // Mostrar error de validación de formato
                        if (currentCert.year && !yearValidation.isValid) {
                          return (
                            <p className="text-xs text-red-600 mt-1">
                              {yearValidation.message}
                            </p>
                          );
                        }
                        
                        // Mostrar info de formato cuando está escribiendo
                        if (currentCert.year && (currentCert.year as string).length > 0 && (currentCert.year as string).length < 4) {
                          return (
                            <p className="text-xs text-blue-600 mt-1">
                              📝 Formato: año completo de 4 dígitos (ej: 2024)
                            </p>
                          );
                        }
                        
                        // Mostrar ayuda cuando está vacío
                        if (!currentCert.year) {
                          return (
                            <p className="text-xs text-gray-500 mt-1">
                              ℹ️ Año de obtención de la certificación (formato: YYYY)
                            </p>
                          );
                        }
                        
                        return null;
                      })()}
                    </div>
                    <div>
                      <Label>ID de credencial 🆔</Label>
                      <Input
                        placeholder="Opcional"
                        value={currentCert.credentialId || ""}
                        onChange={(e) => setCurrentCert(prev => ({ ...prev, credentialId: e.target.value as CertificationItem["credentialId"] }))}
                        className="bg-white/80 border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={() => setShowCertForm(false)} 
                    variant="outline" 
                    className="flex-1 bg-white border-gray-300 hover:bg-gray-50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={addCertification}
                    disabled={!isCertificationFormValid()}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-300 hover:to-yellow-400 text-white"
                  >
                    Guardar 🏆
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
