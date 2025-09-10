import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { 
  Zap, 
  Trophy, 
  Star,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Target,
  TrendingUp,
  Award,
  BadgeIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import axityLogo from 'figma:asset/57af6e8947c8fbfc785c96ea7f281591f169a017.png';

interface AxityHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    employeeId: string;
  };
  xp: number;
  achievements: string[];
  currentStep: number;
  totalSteps: number;
}

export function AxityHeader({ user, xp, achievements, currentStep, totalSteps }: AxityHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(true);
  
  const level = Math.floor(xp / 200) + 1;
  const nextLevelXP = level * 200;
  const currentLevelXP = (level - 1) * 200;
  const progressToNextLevel = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getLevelTitle = (level: number) => {
    if (level >= 5) return "Senior Consultant";
    if (level >= 4) return "Expert Developer";
    if (level >= 3) return "Advanced Developer";
    if (level >= 2) return "Junior Developer";
    return "Trainee Developer";
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <motion.header 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 bg-white/95 backdrop-blur-2xl border-b border-white/20 shadow-lg"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 via-white/80 to-blue-50/50 backdrop-blur-2xl" />
      
      <div className="relative container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo y Branding */}
          <motion.div 
            className="flex items-center gap-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <img 
                  src={axityLogo} 
                  alt="Axity" 
                  className="h-12 w-auto"
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-[var(--axity-purple)] mb-1">
                  Professional Profile
                </h1>
                <p className="text-sm text-[var(--axity-gray)] flex items-center gap-2">
                  <Target className="h-3 w-3" />
                  Actualización de Perfil Profesional
                </p>
              </div>
            </div>
            
            {/* Progress Mini Indicator */}
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/60 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                <span className="text-sm font-medium text-[var(--axity-purple)]">
                  Paso {currentStep + 1} de {totalSteps}
                </span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>

          {/* User Info y Gamification */}
          <div className="flex items-center gap-4">
            {/* XP y Level Card */}
            <motion.div 
              className="hidden md:flex items-center gap-4 bg-white/80 backdrop-blur-xl rounded-2xl px-6 py-3 border border-white/40 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-300 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="h-2 w-2 text-yellow-700" />
                  </motion.div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-gray-900">{xp} XP</span>
                    <BadgeIcon className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                      Nivel {level}
                    </BadgeIcon>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">{getLevelTitle(level)}</span>
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNextLevel}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="relative bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg hover:bg-white/90 rounded-2xl px-4 py-3"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">{achievements.length}</span>
                  {achievements.length > 0 && (
                    <motion.div
                      className="w-2 h-2 bg-red-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
              </Button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        Logros Recientes
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {achievements.length > 0 ? (
                        achievements.slice(-5).reverse().map((achievement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Trophy className="h-4 w-4 text-yellow-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm text-gray-900">{achievement}</p>
                                <p className="text-xs text-gray-500">Hace unos momentos</p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-gray-500">
                          <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No hay logros aún</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg hover:bg-white/90 rounded-2xl px-4 py-3 transition-all"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Avatar className="h-8 w-8 border-2 border-white shadow-md">
                    <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white font-semibold text-sm">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="hidden md:block text-left">
                    <p className="font-semibold text-sm text-gray-900 leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-600">
                      {user.employeeId}
                    </p>
                  </div>
                  
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                </motion.button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent
                align="end" 
                className="w-64 bg-white/95 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-2xl"
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-purple-200 shadow-lg">
                      <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <Badge className="mt-1 bg-purple-100 text-purple-800 border-purple-200">
                        {user.employeeId}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <DropdownMenuItem className="rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <User className="h-4 w-4 mr-3 text-gray-600" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <TrendingUp className="h-4 w-4 mr-3 text-gray-600" />
                    <span>Progreso</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="rounded-xl p-3 hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4 mr-3 text-gray-600" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="my-2" />
                  
                  <DropdownMenuItem className="rounded-xl p-3 hover:bg-red-50 text-red-600 transition-colors">
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="md:hidden mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[var(--axity-purple)]">
                Paso {currentStep + 1} de {totalSteps}
              </span>
              <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/60 rounded-xl px-3 py-2">
            <Zap className="h-4 w-4 text-yellow-600" />
            <span className="font-bold text-sm">{xp} XP</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}