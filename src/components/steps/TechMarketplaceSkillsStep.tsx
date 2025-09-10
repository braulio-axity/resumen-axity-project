import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Plus,
  X,
  Code2,
  CheckCircle2,
  AlertCircle,
  Send,
  Sparkles,
  Search,
  Filter,
  ShoppingCart,
  Zap,
  Monitor,
  Database,
  Cloud,
  Settings,
  Shield,
  Smartphone,
  Cpu,
  GitBranch,
  BarChart3,
  Globe,
  Star,
  TrendingUp,
  Package,
  Heart,
  Target,
  Flame,
  Award,
  Rocket
} from "lucide-react";

interface SkillsStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  addProgress: (points: number, milestone?: string) => void;
  addMotivationalMessage: (type: string, message: string, description?: string, icon?: string, context?: string) => void;
  streakCounter: any;
  setStreakCounter: (fn: (prev: any) => any) => void;
}

interface TechItem {
  name: string;
  category: string;
  popularity: number;
  trending: boolean;
  description: string;
  tags: string[];
}

interface CartItem {
  name: string;
  category: string;
  level: string;
  version?: string;
}

export function TechMarketplaceSkillsStep({
  formData,
  updateFormData,
  addProgress,
  addMotivationalMessage,
  streakCounter,
  setStreakCounter
}: SkillsStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [contextualMessage, setContextualMessage] = useState<string | null>(null);

  const skillLevels = [
    {
      id: "principiante",
      name: "Básico", 
      emoji: "🌱",
      description: "Conceptos fundamentales claros",
      professional: "Principiante",
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      id: "intermedio",
      name: "Intermedio",
      emoji: "💻", 
      description: "Aplicación práctica en proyectos",
      professional: "Intermedio",
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: "avanzado", 
      name: "Avanzado",
      emoji: "🚀",
      description: "Experiencia sólida y buenas prácticas", 
      professional: "Avanzado",
      color: "bg-purple-100 text-purple-800 border-purple-200"
    },
    {
      id: "experto",
      name: "Experto",
      emoji: "⭐",
      description: "Dominio técnico y liderazgo",
      professional: "Experto", 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  ];

  const categories = [
    {
      id: "frontend",
      name: "Frontend & UI",
      icon: Monitor,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      count: 17
    },
    {
      id: "mobile",
      name: "Mobile",
      icon: Smartphone,
      color: "text-green-600", 
      bgColor: "bg-green-50",
      count: 8
    },
    {
      id: "backend",
      name: "Backend & APIs",
      icon: Cpu,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      count: 19
    },
    {
      id: "database",
      name: "Bases de Datos",
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      count: 14
    },
    {
      id: "cloud",
      name: "Cloud & DevOps",
      icon: Cloud,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      count: 17
    },
    {
      id: "apis",
      name: "APIs & Comunicación", 
      icon: Globe,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      count: 13
    },
    {
      id: "testing",
      name: "Testing & QA",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      count: 13
    },
    {
      id: "tools",
      name: "Herramientas",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      count: 11
    },
    {
      id: "data",
      name: "Data & Analytics",
      icon: BarChart3, 
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      count: 12
    },
    {
      id: "security",
      name: "Seguridad",
      icon: Shield,
      color: "text-red-600", 
      bgColor: "bg-red-50",
      count: 8
    }
  ];

  const techCatalog: TechItem[] = [
    // Frontend & UI
    { name: "React", category: "frontend", popularity: 95, trending: true, description: "Biblioteca para construir interfaces de usuario", tags: ["popular", "trending"] },
    { name: "Angular", category: "frontend", popularity: 88, trending: false, description: "Framework completo para aplicaciones web", tags: ["enterprise"] },
    { name: "Vue.js", category: "frontend", popularity: 82, trending: true, description: "Framework progresivo para construir UIs", tags: ["trending"] },
    { name: "Next.js", category: "frontend", popularity: 90, trending: true, description: "Framework de React con SSR y SSG", tags: ["popular", "trending"] },
    { name: "TypeScript", category: "frontend", popularity: 92, trending: true, description: "JavaScript con tipado estático", tags: ["popular", "trending"] },
    { name: "JavaScript", category: "frontend", popularity: 98, trending: false, description: "Lenguaje de programación web fundamental", tags: ["essential"] },
    { name: "Tailwind CSS", category: "frontend", popularity: 85, trending: true, description: "Framework CSS utility-first", tags: ["trending"] },
    { name: "Bootstrap", category: "frontend", popularity: 75, trending: false, description: "Framework CSS responsivo", tags: ["stable"] },
    { name: "Svelte", category: "frontend", popularity: 72, trending: true, description: "Framework compilado para web apps", tags: ["trending", "new"] },
    { name: "Nuxt.js", category: "frontend", popularity: 78, trending: true, description: "Framework de Vue.js con SSR", tags: ["trending"] },
    { name: "jQuery", category: "frontend", popularity: 65, trending: false, description: "Biblioteca JavaScript rápida y ligera", tags: ["legacy"] },
    { name: "Material-UI", category: "frontend", popularity: 80, trending: false, description: "Componentes React con Material Design", tags: ["ui"] },
    { name: "Ant Design", category: "frontend", popularity: 75, trending: false, description: "Lenguaje de diseño empresarial", tags: ["ui", "enterprise"] },
    { name: "Sass", category: "frontend", popularity: 70, trending: false, description: "Preprocesador CSS profesional", tags: ["css"] },
    { name: "Less", category: "frontend", popularity: 60, trending: false, description: "Preprocesador CSS dinámico", tags: ["css"] },
    { name: "HTML5", category: "frontend", popularity: 95, trending: false, description: "Lenguaje de marcado web estándar", tags: ["essential"] },
    { name: "CSS3", category: "frontend", popularity: 90, trending: false, description: "Hojas de estilo en cascada modernas", tags: ["essential"] },

    // Mobile
    { name: "React Native", category: "mobile", popularity: 88, trending: true, description: "Framework para apps móviles nativas", tags: ["popular", "trending"] },
    { name: "Flutter", category: "mobile", popularity: 85, trending: true, description: "SDK de Google para apps multiplataforma", tags: ["trending"] },
    { name: "Ionic", category: "mobile", popularity: 70, trending: false, description: "Framework híbrido para apps móviles", tags: ["hybrid"] },
    { name: "Xamarin", category: "mobile", popularity: 65, trending: false, description: "Plataforma Microsoft para apps móviles", tags: ["microsoft"] },
    { name: "Swift", category: "mobile", popularity: 82, trending: false, description: "Lenguaje de Apple para iOS", tags: ["native", "ios"] },
    { name: "Kotlin", category: "mobile", popularity: 80, trending: true, description: "Lenguaje moderno para Android", tags: ["android", "trending"] },
    { name: "Cordova", category: "mobile", popularity: 60, trending: false, description: "Plataforma para apps híbridas", tags: ["hybrid"] },
    { name: "PhoneGap", category: "mobile", popularity: 55, trending: false, description: "Distribución de Apache Cordova", tags: ["hybrid", "legacy"] },

    // Backend & APIs
    { name: "Node.js", category: "backend", popularity: 92, trending: true, description: "Runtime de JavaScript del lado servidor", tags: ["popular", "trending"] },
    { name: "Express.js", category: "backend", popularity: 88, trending: false, description: "Framework web minimalista para Node.js", tags: ["popular"] },
    { name: "Nest.js", category: "backend", popularity: 82, trending: true, description: "Framework escalable para Node.js", tags: ["trending"] },
    { name: "Python", category: "backend", popularity: 90, trending: true, description: "Lenguaje versátil y fácil de aprender", tags: ["popular", "trending"] },
    { name: "Django", category: "backend", popularity: 78, trending: false, description: "Framework web de alto nivel para Python", tags: ["python"] },
    { name: "Flask", category: "backend", popularity: 75, trending: false, description: "Microframework web para Python", tags: ["python"] },
    { name: "FastAPI", category: "backend", popularity: 85, trending: true, description: "Framework moderno y rápido para APIs", tags: ["python", "trending"] },
    { name: "Java", category: "backend", popularity: 88, trending: false, description: "Lenguaje orientado a objetos empresarial", tags: ["enterprise"] },
    { name: "Spring Boot", category: "backend", popularity: 85, trending: true, description: "Framework para aplicaciones Java", tags: ["java", "trending"] },
    { name: "Spring Framework", category: "backend", popularity: 80, trending: false, description: "Framework integral para Java", tags: ["java", "enterprise"] },
    { name: ".NET Core", category: "backend", popularity: 82, trending: true, description: "Plataforma de desarrollo multiplataforma", tags: ["microsoft", "trending"] },
    { name: "ASP.NET", category: "backend", popularity: 78, trending: false, description: "Framework web de Microsoft", tags: ["microsoft"] },
    { name: "PHP", category: "backend", popularity: 70, trending: false, description: "Lenguaje de scripting del lado servidor", tags: ["web"] },
    { name: "Laravel", category: "backend", popularity: 75, trending: false, description: "Framework PHP elegante", tags: ["php"] },
    { name: "Go", category: "backend", popularity: 80, trending: true, description: "Lenguaje compilado de Google", tags: ["google", "trending"] },
    { name: "Rust", category: "backend", popularity: 75, trending: true, description: "Lenguaje de sistemas seguro", tags: ["systems", "trending"] },
    { name: "Ruby", category: "backend", popularity: 68, trending: false, description: "Lenguaje dinámico y expresivo", tags: ["dynamic"] },
    { name: "Ruby on Rails", category: "backend", popularity: 70, trending: false, description: "Framework web para Ruby", tags: ["ruby"] },
    { name: "Scala", category: "backend", popularity: 65, trending: false, description: "Lenguaje funcional y orientado a objetos", tags: ["functional"] },

    // Databases
    { name: "PostgreSQL", category: "database", popularity: 88, trending: true, description: "Base de datos relacional avanzada", tags: ["relational", "trending"] },
    { name: "MySQL", category: "database", popularity: 85, trending: false, description: "Sistema de gestión de BD popular", tags: ["relational", "popular"] },
    { name: "MongoDB", category: "database", popularity: 82, trending: true, description: "Base de datos NoSQL de documentos", tags: ["nosql", "trending"] },
    { name: "Redis", category: "database", popularity: 80, trending: false, description: "Base de datos en memoria", tags: ["cache", "memory"] },
    { name: "Cassandra", category: "database", popularity: 65, trending: false, description: "BD distribuida de alta disponibilidad", tags: ["distributed"] },
    { name: "DynamoDB", category: "database", popularity: 75, trending: true, description: "BD NoSQL serverless de AWS", tags: ["aws", "nosql"] },
    { name: "Oracle", category: "database", popularity: 70, trending: false, description: "Sistema de BD empresarial", tags: ["enterprise"] },
    { name: "SQL Server", category: "database", popularity: 75, trending: false, description: "BD relacional de Microsoft", tags: ["microsoft"] },
    { name: "MariaDB", category: "database", popularity: 68, trending: false, description: "Fork de MySQL", tags: ["relational"] },
    { name: "Neo4j", category: "database", popularity: 60, trending: false, description: "BD de grafos nativa", tags: ["graph"] },
    { name: "InfluxDB", category: "database", popularity: 58, trending: false, description: "BD de series temporales", tags: ["timeseries"] },
    { name: "Firebase", category: "database", popularity: 78, trending: true, description: "Plataforma de BD en la nube", tags: ["google", "realtime"] },
    { name: "Supabase", category: "database", popularity: 72, trending: true, description: "Alternativa open source a Firebase", tags: ["opensource", "trending"] },
    { name: "SQLite", category: "database", popularity: 70, trending: false, description: "BD SQL embebida", tags: ["embedded"] },

    // Y así continúa con las demás categorías...
    // Para mantener el ejemplo conciso, agreguemos algunas más importantes

    // Cloud & DevOps
    { name: "AWS", category: "cloud", popularity: 92, trending: true, description: "Servicios web de Amazon", tags: ["leader", "popular"] },
    { name: "Azure", category: "cloud", popularity: 88, trending: true, description: "Plataforma en la nube de Microsoft", tags: ["microsoft", "trending"] },
    { name: "Google Cloud", category: "cloud", popularity: 82, trending: true, description: "Servicios en la nube de Google", tags: ["google", "trending"] },
    { name: "Docker", category: "cloud", popularity: 90, trending: true, description: "Plataforma de contenedores", tags: ["containers", "popular"] },
    { name: "Kubernetes", category: "cloud", popularity: 85, trending: true, description: "Orquestador de contenedores", tags: ["containers", "trending"] },
  ];

  const filteredTechnologies = useMemo(() => {
    let filtered = techCatalog;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(tech =>
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(tech => selectedCategories.includes(tech.category));
    }

    // Sort
    if (sortBy === "popularity") {
      filtered.sort((a, b) => b.popularity - a.popularity);
    } else if (sortBy === "trending") {
      filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, selectedCategories, sortBy]);

  const showContextualSuccess = (message: string) => {
    setContextualMessage(message);
    setTimeout(() => {
      setContextualMessage(null);
    }, 3000);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addToCart = (tech: TechItem) => {
    setSelectedTech(tech);
    setShowLevelModal(true);
  };

  const confirmAddToCart = () => {
    if (!selectedTech || !selectedLevel) return;

    const newItem: CartItem = {
      name: selectedTech.name,
      category: selectedTech.category,
      level: selectedLevel,
      ...(selectedVersion.trim() && { version: selectedVersion.trim() })
    };

    setCart(prev => [...prev, newItem]);
    setShowLevelModal(false);
    setSelectedTech(null);
    setSelectedLevel("");
    setSelectedVersion("");

    const levelInfo = skillLevels.find(l => l.id === selectedLevel);
    showContextualSuccess(`✨ ${selectedTech.name} agregado a tu carrito tecnológico!`);
    
    addMotivationalMessage(
      'skill',
      '¡Tech agregada al carrito! 🛒',
      `${selectedTech.name} como ${levelInfo?.professional} está listo para checkout`,
      '⚡'
    );
  };

  const removeFromCart = (index: number) => {
    const removedItem = cart[index];
    setCart(prev => prev.filter((_, i) => i !== index));
    
    addMotivationalMessage(
      'skill',
      'Item removido del carrito 🗑️',
      `${removedItem.name} fue removido`,
      '🔄'
    );
  };

  const checkoutCart = () => {
    if (cart.length === 0) return;

    const skills = formData.skills || [];
    const newSkills = cart.map(item => ({
      name: item.name,
      level: item.level,
      category: item.category,
      ...(item.version && { version: item.version })
    }));

    updateFormData("skills", [...skills, ...newSkills]);
    addProgress(cart.length * 5);
    setStreakCounter((prev: any) => ({ ...prev, skills: prev.skills + cart.length }));

    addMotivationalMessage(
      'skill',
      `¡Checkout exitoso! 🎉`,
      `${cart.length} tecnología${cart.length !== 1 ? 's' : ''} agregada${cart.length !== 1 ? 's' : ''} a tu stack`,
      '🚀'
    );

    setCart([]);
    showContextualSuccess(`🎉 ¡${cart.length} tecnologías agregadas a tu stack!`);
  };

  const isInStack = (techName: string) => {
    return formData.skills?.some((skill: any) => skill.name === techName);
  };

  const isInCart = (techName: string) => {
    return cart.some(item => item.name === techName);
  };

  const getItemStatus = (tech: TechItem) => {
    if (isInStack(tech.name)) return 'in-stack';
    if (isInCart(tech.name)) return 'in-cart';
    return 'available';
  };

  return (
    <div className="space-y-6">
      {/* Contextual Success Message */}
      <AnimatePresence>
        {contextualMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 shadow-lg border border-green-200"
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

      {/* Marketplace Header */}
      <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
        <motion.div
          className="inline-flex p-3 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-xl mb-4"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Package className="h-6 w-6 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-[var(--axity-purple)] mb-2">
          Tech Marketplace 🛒
        </h3>
        <p className="text-[var(--axity-gray)]">
          Explora, selecciona y construye tu arsenal tecnológico perfecto
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters and Cart */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[var(--axity-purple)] flex items-center gap-2">
                <Search className="h-4 w-4" />
                Buscar Tecnologías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Busca cualquier tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[var(--axity-purple)] flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Categorías
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategories.includes(category.id);
                  
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-all ${
                        isSelected 
                          ? `${category.bgColor} ${category.color} border border-current` 
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Shopping Cart */}
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-[var(--axity-purple)] flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Carrito Tech
                {cart.length > 0 && (
                  <Badge className="bg-[var(--axity-orange)] text-white">
                    {cart.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-4">
                  <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Tu carrito está vacío</p>
                  <p className="text-xs text-gray-400 mt-1">Agrega tecnologías para empezar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cart.map((item, index) => {
                      const levelInfo = skillLevels.find(l => l.id === item.level);
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {levelInfo?.professional}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(index)}
                            className="h-6 w-6 p-0 hover:bg-red-100 text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={checkoutCart}
                      className="w-full bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Checkout ({cart.length})
                    </Button>
                  </motion.div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{filteredTechnologies.length} tecnologías encontradas</span>
              {selectedCategories.length > 0 && (
                <Badge variant="secondary">
                  {selectedCategories.length} categoría{selectedCategories.length !== 1 ? 's' : ''} seleccionada{selectedCategories.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Más Popular</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="name">Alfabético</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tech Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredTechnologies.map((tech, index) => {
                const status = getItemStatus(tech);
                const category = categories.find(c => c.id === tech.category);
                
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`h-full transition-all hover:shadow-lg ${
                      status === 'in-stack' 
                        ? 'bg-green-50 border-green-200' 
                        : status === 'in-cart'
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:border-[var(--axity-violet)]/50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-[var(--axity-purple)]">
                                {tech.name}
                              </h4>
                              {tech.trending && (
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs">
                                    <TrendingUp className="h-2 w-2 mr-1" />
                                    Trending
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                              {tech.description}
                            </p>
                            
                            <div className="flex items-center gap-2">
                              {category && (
                                <Badge className={`${category.color.replace('text-', 'bg-').replace('-600', '-100')} ${category.color.replace('-600', '-800')} text-xs`}>
                                  {category.name}
                                </Badge>
                              )}
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-500">{tech.popularity}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {status === 'in-stack' ? (
                            <Button disabled className="flex-1 bg-green-100 text-green-800">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              En Stack
                            </Button>
                          ) : status === 'in-cart' ? (
                            <Button disabled className="flex-1 bg-blue-100 text-blue-800">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              En Carrito
                            </Button>
                          ) : (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1"
                            >
                              <Button
                                onClick={() => addToCart(tech)}
                                className="w-full bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] text-white"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredTechnologies.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">
                No se encontraron tecnologías
              </h4>
              <p className="text-gray-500">
                Intenta con otros términos de búsqueda o categorías
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Level Selection Modal */}
      <AnimatePresence>
        {showLevelModal && selectedTech && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
              setShowLevelModal(false);
              setSelectedTech(null);
              setSelectedVersion("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200"
            >
              <div className="text-center mb-6">
                <div className="p-3 bg-gradient-to-r from-[var(--axity-purple)] to-[var(--axity-violet)] rounded-xl mb-4 inline-flex">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--axity-purple)] mb-2">
                  ¿Cuál es tu nivel en {selectedTech.name}? 📊
                </h3>
                <p className="text-[var(--axity-gray)]">
                  Define tu experiencia para agregarlo al carrito
                </p>
              </div>

              {/* Version Input */}
              <div className="mb-6">
                <Label className="text-[var(--axity-purple)] font-medium">
                  Versión (opcional) 📌
                </Label>
                <Input
                  placeholder="ej. 18.2, 3.11, v2.5..."
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  className="mt-1 bg-white/80 border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Especifica la versión que dominas
                </p>
              </div>
              
              <div className="space-y-3">
                {skillLevels.map((level) => (
                  <motion.button
                    key={level.id}
                    onClick={() => {
                      setSelectedLevel(level.id);
                      confirmAddToCart();
                    }}
                    className={`w-full p-4 text-left rounded-xl border transition-all hover:shadow-md ${level.color}`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{level.emoji}</span>
                      <div>
                        <div className="font-bold">{level.name}</div>
                        <div className="text-sm opacity-80">{level.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowLevelModal(false);
                    setSelectedTech(null);
                    setSelectedVersion("");
                  }}
                  className="px-6 bg-white border-gray-300 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Stack Display */}
      {formData.skills && formData.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--axity-purple)]">
              <Award className="h-5 w-5" />
              Tu Stack Tecnológico ({formData.skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {formData.skills.map((skill: any, index: number) => {
                const level = skillLevels.find(l => l.id === skill.level);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Code2 className="h-3 w-3 text-[var(--axity-purple)]" />
                      <span className="font-medium text-sm text-[var(--axity-purple)]">
                        {skill.name}
                      </span>
                    </div>
                    <Badge className={level?.color || "bg-gray-100 text-gray-800"}>
                      {level?.professional}
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}