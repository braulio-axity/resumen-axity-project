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
  Pause,
  X,
  Globe,
  ShieldCheck
} from "lucide-react";

interface EducationStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (type: string, message: string, description?: string, icon?: string, context?: string) => void;
  streakCounter: any;
  setStreakCounter: (fn: (prev: any) => any) => void;
}

export function EducationStep({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  streakCounter,
  setStreakCounter
}: EducationStepProps) {
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [contextualMessage, setContextualMessage] = useState<string | null>(null);
  const [currentEducation, setCurrentEducation] = useState({
    institution: "",
    degree: "",
    field: "",
    year: "",
    achievements: "",
    status: "",
    isInternational: false,
    hasApostille: false,
    apostilleValidated: false
  });
  const [currentCert, setCurrentCert] = useState({
    name: "",
    issuer: "",
    year: "",
    credentialId: ""
  });

  // Mensajes dinámicos para educación
  const educationMessages = [
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
  const certificationMessages = [
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

  const addEducation = () => {
    if (currentEducation.institution && currentEducation.degree) {
      const education = formData.education || [];
      updateFormData("education", [...education, currentEducation]);
      setCurrentEducation({ institution: "", degree: "", field: "", year: "", achievements: "", status: "", isInternational: false, hasApostille: false, apostilleValidated: false });
      setShowEducationForm(false);
      
      // Update streak counter
      setStreakCounter(prev => ({ ...prev, education: prev.education + 1 }));
      
      // Mensajes especiales para educación
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
        'education',
        randomMessage,
        `${currentEducation.degree} en ${currentEducation.institution} - ¡Excelente preparación!`,
        '🎓',
        `Graduado en ${currentEducation.year || 'fecha por especificar'}`
      );

      showContextualSuccess(`🎓 Formación en ${currentEducation.institution} agregada exitosamente!`);
    }
  };

  const addCertification = () => {
    if (currentCert.name && currentCert.issuer) {
      const certifications = formData.certifications || [];
      updateFormData("certifications", [...certifications, currentCert]);
      setCurrentCert({ name: "", issuer: "", year: "", credentialId: "" });
      setShowCertForm(false);
      
      // Update streak counter
      setStreakCounter(prev => ({ ...prev, certifications: prev.certifications + 1 }));
      
      // Mensajes especiales para certificaciones  
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
        'certification',
        randomMessage,
        `${currentCert.name} de ${currentCert.issuer} - ¡Tu expertise está validada!`,
        '🏆',
        `Certificado en ${currentCert.year || 'fecha por especificar'}`
      );

      showContextualSuccess(`🏆 Certificación ${currentCert.name} agregada exitosamente!`);
    }
  };

  // Combinar educación y certificaciones en una timeline cronológica
  const createTimelineData = () => {
    const education = (formData.education || []).map((edu: any) => ({
      ...edu,
      type: 'education' as const,
      sortYear: parseInt(edu.year) || 0
    }));
    
    const certifications = (formData.certifications || []).map((cert: any) => ({
      ...cert,
      type: 'certification' as const,
      sortYear: parseInt(cert.year) || 0
    }));
    
    return [...education, ...certifications]
      .filter(item => item.sortYear > 0)
      .sort((a, b) => a.sortYear - b.sortYear);
  };

  const timelineData = createTimelineData();

  return (
    <div className="space-y-8">
      {/* Contextual Success Message */}
      <AnimatePresence>
        {contextualMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-4 shadow-lg border border-emerald-200"
          >
            <div className="flex items-center gap-3">
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

      {/* Timeline View */}
      {timelineData.length > 0 && (
        <div className="relative">
          <h4 className="text-lg font-bold text-[var(--axity-purple)] mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Tu cronología de aprendizaje ({timelineData.length} elementos)
          </h4>
          
          {/* Timeline Container */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-purple-400 to-yellow-400 opacity-30"></div>
            
            <div className="space-y-8">
              {timelineData.map((item, index) => (
                <motion.div
                  key={index}
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
                            {item.status && (
                              <div className="flex items-center gap-2 mt-2">
                                {item.status === 'terminado' && <CheckCircle className="h-4 w-4 text-green-600" />}
                                {item.status === 'en-curso' && <Play className="h-4 w-4 text-blue-600" />}
                                {item.status === 'pausado' && <Pause className="h-4 w-4 text-yellow-600" />}
                                {item.status === 'incompleto' && <X className="h-4 w-4 text-red-500" />}
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                  item.status === 'terminado' ? 'bg-green-100 text-green-700' :
                                  item.status === 'en-curso' ? 'bg-blue-100 text-blue-700' :
                                  item.status === 'pausado' ? 'bg-yellow-100 text-yellow-700' :
                                  item.status === 'incompleto' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {item.status === 'terminado' ? 'Terminado' :
                                   item.status === 'en-curso' ? 'En curso' :
                                   item.status === 'pausado' ? 'Pausado' :
                                   item.status === 'incompleto' ? 'Incompleto' :
                                   item.status}
                                </span>
                              </div>
                            )}
                            
                            {/* Indicadores de validación internacional */}
                            {item.isInternational && (
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Internacional
                                </Badge>
                                {item.hasApostille && (
                                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-xs">
                                    📜 Apostilla
                                  </Badge>
                                )}
                                {item.apostilleValidated && (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                    Validado
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
                      className="mt-4 bg-axity-gradient-cool text-white"
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Año de graduación 📅</Label>
                      <Input
                        type="number"
                        placeholder="2024"
                        value={currentEducation.year}
                        onChange={(e) => setCurrentEducation(prev => ({ ...prev, year: e.target.value }))}
                        className="bg-white/80 border-gray-200"
                      />
                    </div>
                    <div>
                      <Label>Estado del estudio 📊</Label>
                      <Select 
                        value={currentEducation.status} 
                        onValueChange={(value) => setCurrentEducation(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger className="bg-white/80 border-gray-200">
                          <SelectValue placeholder="Selecciona estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="terminado">✅ Terminado</SelectItem>
                          <SelectItem value="en-curso">▶️ En curso</SelectItem>
                          <SelectItem value="pausado">⏸️ Pausado</SelectItem>
                          <SelectItem value="incompleto">❌ Incompleto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Logros académicos destacados 🌟</Label>
                    <Textarea
                      placeholder="Menciones honoríficas, promedio destacado, proyectos de tesis, reconocimientos..."
                      value={currentEducation.achievements}
                      onChange={(e) => setCurrentEducation(prev => ({ ...prev, achievements: e.target.value }))}
                      rows={2}
                      className="bg-white/80 border-gray-200"
                    />
                  </div>
                  
                  {/* Validación de estudios extranjeros */}
                  <div className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <Label className="text-blue-700 font-semibold">Validación Internacional</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is-international"
                        checked={currentEducation.isInternational}
                        onCheckedChange={(checked) => {
                          setCurrentEducation(prev => ({ 
                            ...prev, 
                            isInternational: !!checked,
                            hasApostille: false,
                            apostilleValidated: false
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
                            checked={currentEducation.hasApostille}
                            onCheckedChange={(checked) => {
                              setCurrentEducation(prev => ({ 
                                ...prev, 
                                hasApostille: !!checked,
                                apostilleValidated: false
                              }))
                            }}
                          />
                          <Label htmlFor="has-apostille" className="text-sm">
                            ¿Tienes el certificado de apostilla? 📜
                          </Label>
                        </div>
                        
                        {currentEducation.hasApostille && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-6"
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="apostille-validated"
                                checked={currentEducation.apostilleValidated}
                                onCheckedChange={(checked) => {
                                  setCurrentEducation(prev => ({ ...prev, apostilleValidated: !!checked }))
                                }}
                              />
                              <Label htmlFor="apostille-validated" className="text-sm">
                                ¿Está validado el certificado? 
                                <ShieldCheck className="h-4 w-4 inline ml-1 text-green-600" />
                              </Label>
                            </div>
                            
                            {currentEducation.apostilleValidated && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-2 p-2 bg-green-100 border border-green-300 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-xs font-medium text-green-700">
                                    ✅ Título internacional validado
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </div>
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
                    disabled={!currentEducation.institution || !currentEducation.degree}
                    className="flex-1 bg-axity-gradient-cool text-white"
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
                      className="mt-4 bg-axity-gradient-secondary text-white"
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
                      placeholder="AWS, Microsoft, Google, Scrum Alliance, etc."
                      value={currentCert.issuer}
                      onChange={(e) => setCurrentCert(prev => ({ ...prev, issuer: e.target.value }))}
                      className="bg-white/80 border-gray-200"
                    />
                  </div>
                  <div>
                    <Label>Año de obtención 📅</Label>
                    <Input
                      type="number"
                      placeholder="2024"
                      value={currentCert.year}
                      onChange={(e) => setCurrentCert(prev => ({ ...prev, year: e.target.value }))}
                      className="bg-white/80 border-gray-200"
                    />
                  </div>
                  <div>
                    <Label>ID de credencial (opcional) 🔗</Label>
                    <Input
                      placeholder="ID o número de certificado"
                      value={currentCert.credentialId}
                      onChange={(e) => setCurrentCert(prev => ({ ...prev, credentialId: e.target.value }))}
                      className="bg-white/80 border-gray-200"
                    />
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
                    disabled={!currentCert.name || !currentCert.issuer}
                    className="flex-1 bg-axity-gradient-secondary text-white"
                  >
                    Guardar 🏆
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {timelineData.length === 0 && !showEducationForm && !showCertForm && (
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-center gap-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center"
            >
              <GraduationCap className="h-8 w-8 text-emerald-600" />
            </motion.div>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center"
            >
              <Trophy className="h-8 w-8 text-yellow-600" />
            </motion.div>
          </div>
          <h4 className="text-xl font-bold text-[var(--axity-purple)] mb-3">
            ¡Comparte tu formación técnica! 📚
          </h4>
          <p className="text-[var(--axity-gray)] mb-6">
            Construye tu cronología de aprendizaje agregando estudios formales y certificaciones
          </p>
          <p className="text-sm text-gray-500">
            Agrega al menos un elemento para continuar
          </p>
        </motion.div>
      )}
    </div>
  );
}