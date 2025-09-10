import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import {
  Bot,
  User,
  Building,
  Trophy,
  Plus,
  Check,
  Clock,
  MapPin,
  Briefcase,
  Send,
  X,
  Lightbulb,
  Rocket,
  CheckCircle,
  Edit3,
  Play,
  SkipForward,
} from "lucide-react";

interface ExperienceStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (
    type: string,
    message: string,
    description?: string,
    icon?: string,
    context?: string,
  ) => void;
  streakCounter: any;
  setStreakCounter: (fn: (prev: any) => any) => void;
}

interface ChatMessage {
  id: string;
  type: "bot" | "user" | "system";
  content: string;
  timestamp: number;
  animation?: string;
  data?: any;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  challenges: string;
  achievements: string;
  technologies: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: Array<{
      name: string;
      version?: string;
    }>;
  }>;
}

type ConversationStep =
  | "welcome"
  | "company"
  | "position"
  | "dates"
  | "current_job"
  | "projects"
  | "project_details"
  | "technologies"
  | "challenges"
  | "achievements"
  | "summary"
  | "add_another"
  | "completed";

export function ConversationalExperienceWizard({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  setStreakCounter,
}: ExperienceStepProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] =
    useState<ConversationStep>("welcome");
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [currentExp, setCurrentExp] = useState<Experience>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    challenges: "",
    achievements: "",
    technologies: [],
    projects: [],
  });
  const [currentProject, setCurrentProject] = useState({
    name: "",
    description: "",
    technologies: [],
  });
  const [tempTechList, setTempTechList] = useState<string[]>(
    [],
  );
  const [showQuickActions, setShowQuickActions] =
    useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Inicializar conversación
    if (messages.length === 0) {
      addBotMessage(
        "¡Hola! 👋 Soy Eugen_IA Assistant, tu guía para documentar tu experiencia laboral.",
        "welcome",
      );
      setTimeout(() => {
        addBotMessage(
          "Vamos a construir tu perfil profesional de manera conversacional. ¿Te parece si empezamos? 🚀",
          "welcome",
        );
        setTimeout(() => {
          setShowQuickActions(true);
        }, 1000);
      }, 1500);
    }
  }, []);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const addBotMessage = (
    content: string,
    step: ConversationStep,
    data?: any,
  ) => {
    setIsTyping(true);
    setTimeout(
      () => {
        const message: ChatMessage = {
          id: `bot-${Date.now()}-${Math.random()}`,
          type: "bot",
          content,
          timestamp: Date.now(),
          data,
        };
        addMessage(message);
        setIsTyping(false);
      },
      1000 + Math.random() * 500,
    ); // Simular typing
  };

  const addUserMessage = (content: string, data?: any) => {
    const message: ChatMessage = {
      id: `user-${Date.now()}-${Math.random()}`,
      type: "user",
      content,
      timestamp: Date.now(),
      data,
    };
    addMessage(message);
  };

  const addSystemMessage = (content: string) => {
    const message: ChatMessage = {
      id: `system-${Date.now()}-${Math.random()}`,
      type: "system",
      content,
      timestamp: Date.now(),
    };
    addMessage(message);
  };

  const handleQuickAction = (
    action: string,
    value?: string,
  ) => {
    switch (action) {
      case "start":
        addUserMessage("¡Perfecto! Empecemos 🎯");
        setShowQuickActions(false);
        proceedToStep("company");
        break;
      case "skip_section":
        addUserMessage(
          "Prefiero saltarme esta sección por ahora",
        );
        // Lógica para saltar sección
        break;
      case "need_help":
        addUserMessage("Necesito ayuda 🙋‍♂️");
        addBotMessage(
          "¡Por supuesto! Te ayudo con cualquier duda. ¿En qué sección necesitas apoyo?",
          currentStep,
        );
        break;
    }
  };

  const proceedToStep = (step: ConversationStep) => {
    setCurrentStep(step);

    switch (step) {
      case "company":
        addBotMessage(
          "Perfecto 🏢 ¿En qué empresa trabajas o trabajaste? Puedes escribir el nombre completo.",
          "company",
        );
        break;

      case "position":
        addBotMessage(
          `Excelente elección, ${currentExp.company} 👍 ¿Cuál es o era tu cargo/posición en esta empresa?`,
          "position",
        );
        break;

      case "dates":
        addBotMessage(
          "¿Cuándo comenzaste en este rol? Formato: MM/YYYY (ej: 03/2023)",
          "dates",
        );
        break;

      case "current_job":
        addBotMessage(
          "¿Sigues trabajando actualmente en esta posición? 🤔",
          "current_job",
        );
        break;

      case "projects":
        addBotMessage(
          "¡Genial! Ahora hablemos de los proyectos específicos 🚀 ¿Trabajaste en algún proyecto destacado en esta empresa?",
          "projects",
        );
        break;

      case "technologies":
        addBotMessage(
          "¿Qué tecnologías principales utilizaste en esta experiencia? Sepáralas con comas (ej: React, Node.js, PostgreSQL)",
          "technologies",
        );
        break;

      case "challenges":
        addBotMessage(
          "¿Cuáles fueron los principales desafíos técnicos que enfrentaste y resolviste? 💪",
          "challenges",
        );
        break;

      case "achievements":
        addBotMessage(
          "¿Qué logros específicos obtuviste en esta posición? (mejoras de rendimiento, proyectos exitosos, etc.) 🏆",
          "achievements",
        );
        break;

      case "summary":
        addBotMessage(
          "¡Excelente trabajo! 🎉 Déjame resumir tu experiencia:",
          "summary",
        );
        showExperienceSummary();
        break;

      case "add_another":
        addBotMessage(
          "¿Te gustaría agregar otra experiencia laboral? 🔄",
          "add_another",
        );
        break;
    }
  };

  const handleUserInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    addUserMessage(userInput);
    const input = userInput;
    setUserInput("");

    // Procesar respuesta según el paso actual
    setTimeout(() => {
      processUserResponse(input);
    }, 500);
  };

  const processUserResponse = (input: string) => {
    switch (currentStep) {
      case "company":
        setCurrentExp((prev) => ({ ...prev, company: input }));
        addBotMessage(
          `¡${input}! Una excelente empresa 🌟`,
          "company",
        );
        setTimeout(() => proceedToStep("position"), 1000);
        break;

      case "position":
        setCurrentExp((prev) => ({ ...prev, position: input }));
        addBotMessage(
          `${input} - suena como un rol muy interesante 💼`,
          "position",
        );
        setTimeout(() => proceedToStep("dates"), 1000);
        break;

      case "dates":
        setCurrentExp((prev) => ({
          ...prev,
          startDate: input,
        }));
        addBotMessage(`Perfecto, desde ${input} 📅`, "dates");
        setTimeout(() => proceedToStep("current_job"), 1000);
        break;

      case "technologies":
        const techs = input
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech);
        setCurrentExp((prev) => ({
          ...prev,
          technologies: techs,
        }));
        addBotMessage(
          `¡Excelente stack tecnológico! ${techs.join(", ")} 🔧`,
          "technologies",
        );
        setTimeout(() => proceedToStep("challenges"), 1500);
        break;

      case "challenges":
        setCurrentExp((prev) => ({
          ...prev,
          challenges: input,
        }));
        addBotMessage(
          "Impresionante cómo resolviste esos desafíos 💡",
          "challenges",
        );
        setTimeout(() => proceedToStep("achievements"), 1000);
        break;

      case "achievements":
        setCurrentExp((prev) => ({
          ...prev,
          achievements: input,
        }));
        addBotMessage(
          "¡Resultados increíbles! 🎯",
          "achievements",
        );
        setTimeout(() => proceedToStep("summary"), 1000);
        break;
    }
  };

  const showExperienceSummary = () => {
    setTimeout(() => {
      addSystemMessage("📋 Resumen de experiencia generado");
      setTimeout(() => {
        addBotMessage(
          "¿Todo se ve correcto? ¿Quieres guardar esta experiencia?",
          "summary",
        );
      }, 1000);
    }, 1500);
  };

  const saveExperience = () => {
    const experiences = formData.experiences || [];
    updateFormData("experiences", [...experiences, currentExp]);

    addUserMessage("¡Sí, guárdala! ✅");
    addBotMessage(
      "¡Experiencia guardada exitosamente! 🎉",
      "completed",
    );

    addProgress(25);
    setStreakCounter((prev) => ({
      ...prev,
      experiences: prev.experiences + 1,
    }));

    addMotivationalMessage(
      "experience",
      "¡Nueva experiencia documentada! 🚀",
      `${currentExp.position} en ${currentExp.company} agregado a tu perfil`,
      "💼",
    );

    setTimeout(() => {
      proceedToStep("add_another");
    }, 2000);
  };

  const startNewExperience = () => {
    setCurrentExp({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      challenges: "",
      achievements: "",
      technologies: [],
      projects: [],
    });
    setCurrentProject({
      name: "",
      description: "",
      technologies: [],
    });
    setTempTechList([]);
    addUserMessage("¡Sí, agregar otra experiencia! 🔄");
    proceedToStep("company");
  };

  const getDuration = (
    startDate: string,
    endDate: string,
    current: boolean,
  ) => {
    if (!startDate) return "";
    const start = new Date(startDate + "-01");
    const end = current
      ? new Date()
      : new Date(endDate + "-01");
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24),
    );
    const months = Math.floor(diffDays / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      const remainingMonths = months % 12;
      return remainingMonths > 0
        ? `${years} año${years > 1 ? "s" : ""} y ${remainingMonths} mes${remainingMonths > 1 ? "es" : ""}`
        : `${years} año${years > 1 ? "s" : ""}`;
    }
    return `${months} mes${months > 1 ? "es" : ""}`;
  };

  return (
    <div className="flex h-[600px] max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold">Axity Assistant</h3>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>
                En línea - Documentando experiencia laboral
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-0">
              {formData.experiences?.length || 0} experiencias
            </Badge>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "system" ? (
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mx-auto">
                    {message.content}
                  </div>
                ) : (
                  <div
                    className={`flex items-start gap-3 max-w-[70%] ${message.type === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === "bot"
                          ? "bg-gradient-to-br from-[var(--axity-purple)] to-[var(--axity-violet)] text-white"
                          : "bg-gradient-to-br from-orange-400 to-red-500 text-white"
                      }`}
                    >
                      {message.type === "bot" ? (
                        <Bot className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.type === "bot"
                          ? "bg-white text-gray-800 shadow-sm border"
                          : "bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white"
                      }`}
                    >
                      <div className="text-sm">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          message.type === "bot"
                            ? "text-gray-500"
                            : "text-white/70"
                        }`}
                      >
                        {new Date(
                          message.timestamp,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Actions */}
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center"
              >
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleQuickAction("start")}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    ¡Empezar ahora!
                  </Button>
                  <Button
                    onClick={() =>
                      handleQuickAction("need_help")
                    }
                    size="sm"
                    variant="outline"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    Necesito ayuda
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Job Quick Actions */}
          <AnimatePresence>
            {currentStep === "current_job" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center"
              >
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setCurrentExp((prev) => ({
                        ...prev,
                        current: true,
                      }));
                      addUserMessage(
                        "¡Sí, sigo trabajando aquí! 💼",
                      );
                      addBotMessage(
                        "¡Perfecto! Un trabajo actual siempre es emocionante 🔥",
                        "current_job",
                      );
                      setTimeout(
                        () => proceedToStep("projects"),
                        1000,
                      );
                    }}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Sí, trabajo aquí
                  </Button>
                  <Button
                    onClick={() => {
                      setCurrentExp((prev) => ({
                        ...prev,
                        current: false,
                      }));
                      addUserMessage(
                        "No, ya terminé en esta empresa",
                      );
                      addBotMessage(
                        "Entendido. ¿Cuándo terminaste? (MM/YYYY)",
                        "dates",
                      );
                      setCurrentStep("dates"); // Para capturar fecha de fin
                    }}
                    size="sm"
                    variant="outline"
                    className="border-gray-300"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Ya terminé
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Projects Quick Actions */}
          <AnimatePresence>
            {currentStep === "projects" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center"
              >
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      addUserMessage(
                        "¡Sí, trabajé en varios proyectos interesantes! 🚀",
                      );
                      addBotMessage(
                        "¡Genial! Cuéntame sobre el proyecto más significativo. ¿Cómo se llamaba?",
                        "project_details",
                      );
                      setCurrentStep("project_details");
                    }}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Rocket className="h-4 w-4 mr-1" />
                    Sí, varios proyectos
                  </Button>
                  <Button
                    onClick={() => {
                      addUserMessage(
                        "No trabajé en proyectos específicos destacados",
                      );
                      addBotMessage(
                        "No hay problema, continuemos con las tecnologías que usaste 🔧",
                        "projects",
                      );
                      setTimeout(
                        () => proceedToStep("technologies"),
                        1000,
                      );
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <SkipForward className="h-4 w-4 mr-1" />
                    Saltar proyectos
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Actions */}
          <AnimatePresence>
            {currentStep === "summary" &&
              currentExp.company && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-center"
                >
                  <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 max-w-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-[var(--axity-purple)]" />
                        <span className="font-bold text-[var(--axity-purple)]">
                          Resumen de Experiencia
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">
                          {currentExp.position}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span>{currentExp.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span>
                          {currentExp.startDate} -{" "}
                          {currentExp.current
                            ? "Presente"
                            : currentExp.endDate}
                        </span>
                      </div>
                      {currentExp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {currentExp.technologies
                            .slice(0, 3)
                            .map((tech, index) => (
                              <Badge
                                key={index}
                                className="text-xs bg-blue-100 text-blue-800"
                              >
                                {tech}
                              </Badge>
                            ))}
                          {currentExp.technologies.length >
                            3 && (
                            <Badge className="text-xs bg-gray-100 text-gray-600">
                              +
                              {currentExp.technologies.length -
                                3}{" "}
                              más
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={saveExperience}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white flex-1"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Guardar
                        </Button>
                        <Button
                          onClick={() => {
                            addUserMessage(
                              "Quiero modificar algo",
                            );
                            addBotMessage(
                              "¡Por supuesto! ¿Qué te gustaría cambiar?",
                              "summary",
                            );
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
          </AnimatePresence>

          {/* Add Another Experience Actions */}
          <AnimatePresence>
            {currentStep === "add_another" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-center"
              >
                <div className="flex gap-3">
                  <Button
                    onClick={startNewExperience}
                    size="sm"
                    className="bg-gradient-to-r from-[var(--axity-orange)] to-[var(--axity-magenta)] text-white"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar otra experiencia
                  </Button>
                  <Button
                    onClick={() => {
                      addUserMessage(
                        "No, terminemos por ahora ✅",
                      );
                      addBotMessage(
                        "¡Perfecto! Has documentado toda tu experiencia laboral. ¡Excelente trabajo! 🎉",
                        "completed",
                      );
                    }}
                    size="sm"
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Terminar sección
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <form
            onSubmit={handleUserInput}
            className="flex gap-3"
          >
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="flex-1 bg-gray-50 border-gray-200 focus:border-[var(--axity-purple)] focus:ring-[var(--axity-purple)]"
              disabled={
                isTyping ||
                showQuickActions ||
                currentStep === "current_job" ||
                currentStep === "projects" ||
                currentStep === "summary" ||
                currentStep === "add_another"
              }
            />
            <Button
              type="submit"
              disabled={!userInput.trim() || isTyping}
              size="icon"
              className="bg-[var(--axity-purple)] hover:bg-[var(--axity-violet)] text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Presiona Enter para enviar</span>
            <div className="flex items-center gap-4">
              <span>
                {
                  messages.filter((m) => m.type === "user")
                    .length
                }{" "}
                respuestas
              </span>
              <span>•</span>
              <span>Paso: {currentStep}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Experience Summary */}
      <div className="w-80 bg-gradient-to-b from-purple-50 to-blue-50 border-l">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-[var(--axity-purple)]" />
            <h3 className="font-bold text-[var(--axity-purple)]">
              Tu Progreso
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Experiencias documentadas</span>
              <Badge className="bg-[var(--axity-purple)] text-white">
                {formData.experiences?.length || 0}
              </Badge>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="h-2 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min((formData.experiences?.length || 0) * 33, 100)}%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 h-full overflow-y-auto">
          {/* Current Experience Being Created */}
          {currentExp.company && (
            <Card className="border-dashed border-2 border-purple-300 bg-purple-50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-purple-700">
                    Creando...
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="font-medium text-purple-900">
                    {currentExp.position}
                  </div>
                  <div className="text-purple-700">
                    {currentExp.company}
                  </div>
                  {currentExp.startDate && (
                    <div className="text-xs text-purple-600">
                      {currentExp.startDate}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Existing Experiences */}
          {formData.experiences?.map(
            (exp: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-l-4 border-l-[var(--axity-purple)] bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-[var(--axity-purple)] text-sm">
                          {exp.position}
                        </div>
                        <div className="text-sm text-gray-700">
                          {exp.company}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {exp.startDate} -{" "}
                          {exp.current
                            ? "Presente"
                            : exp.endDate}
                        </div>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    </div>

                    {exp.technologies &&
                      exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exp.technologies
                            .slice(0, 2)
                            .map(
                              (
                                tech: string,
                                techIndex: number,
                              ) => (
                                <Badge
                                  key={techIndex}
                                  className="text-xs bg-blue-100 text-blue-800 px-1 py-0"
                                >
                                  {tech}
                                </Badge>
                              ),
                            )}
                          {exp.technologies.length > 2 && (
                            <Badge className="text-xs bg-gray-100 text-gray-600 px-1 py-0">
                              +{exp.technologies.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                  </CardContent>
                </Card>
              </motion.div>
            ),
          )}

          {/* Empty State */}
          {(!formData.experiences ||
            formData.experiences.length === 0) &&
            !currentExp.company && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="h-8 w-8 text-purple-400" />
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Aún no hay experiencias
                </div>
                <div className="text-xs text-gray-500">
                  Comienza la conversación para agregar tu
                  primera experiencia
                </div>
              </div>
            )}
        </div>

        {/* Quick Tips */}
        <div className="p-4 border-t bg-white">
          <div className="text-xs text-gray-600">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-3 w-3 text-yellow-500" />
              <span className="font-medium">Consejo:</span>
            </div>
            <p>
              Sé específico con las tecnologías y logros. Esto
              ayudará a matchearte con proyectos relevantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}