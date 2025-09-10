import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { 
  Trophy, 
  ChevronUp, 
  Flame, 
  Bell, 
  Gift, 
  MessageSquare,
  ChevronDown
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { MotivationalMessage, FormData, StreakCounter } from "../types";

interface ProgressPanelProps {
  showProgressPanel: boolean;
  setShowProgressPanel: (show: boolean) => void;
  formData: FormData;
  streakCounter: StreakCounter;
  motivationalMessages: MotivationalMessage[];
  setMotivationalMessages: Dispatch<SetStateAction<MotivationalMessage[]>>;
}

export function ProgressPanel({
  showProgressPanel,
  setShowProgressPanel,
  formData,
  streakCounter,
  motivationalMessages,
  setMotivationalMessages
}: ProgressPanelProps) {
  return (
    <>
      {/* RIGHT SIDEBAR - PROGRESS PANEL */}
      <AnimatePresence>
        {showProgressPanel && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-80 bg-white/90 backdrop-blur-xl border-l border-gray-200 shadow-xl flex flex-col"
          >
            {/* Progress Panel Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6" />
                  <div>
                    <h3 className="font-bold text-lg">Tu Progreso</h3>
                    <p className="text-white/80 text-sm">Logros y actividad reciente</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProgressPanel(false)}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats Quick View */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-[var(--axity-purple)]">{formData.skills?.length || 0}</div>
                  <div className="text-xs text-gray-600">Tecnologías</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-[var(--axity-orange)]">{formData.experiences?.length || 0}</div>
                  <div className="text-xs text-gray-600">Experiencias</div>
                </div>
              </div>
              
              {/* Streak Counters */}
              <div className="mt-4 space-y-2">
                {Object.entries(streakCounter).map(([key, value]) => (
                  value > 0 && (
                    <motion.div
                      key={key}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm"
                    >
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium text-[var(--axity-purple)]">
                        {key}: {value} consecutivos
                      </span>
                    </motion.div>
                  )
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <h4 className="font-medium text-[var(--axity-purple)] mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Actividad Reciente
              </h4>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {motivationalMessages.slice(0, 8).map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border shadow-sm transition-all hover:shadow-md ${
                        message.type === 'skill' ? 'bg-blue-50 border-blue-200' :
                        message.type === 'experience' ? 'bg-orange-50 border-orange-200' :
                        message.type === 'education' ? 'bg-green-50 border-green-200' :
                        message.type === 'certification' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-purple-50 border-purple-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{message.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[var(--axity-purple)] line-clamp-2">
                            {message.message}
                          </p>
                          {message.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {message.description}
                            </p>
                          )}
                          {message.context && (
                            <p className="text-xs text-[var(--axity-violet)] mt-1 font-medium">
                              {message.context}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {motivationalMessages.length === 0 && (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">
                      Tus logros aparecerán aquí
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Panel Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[var(--axity-purple)] border-[var(--axity-purple)] hover:bg-[var(--axity-purple)] hover:text-white"
                onClick={() => setMotivationalMessages([])}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Limpiar actividad
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Panel Button */}
      {!showProgressPanel && (
        <motion.button
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          onClick={() => setShowProgressPanel(true)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-l-xl shadow-lg z-30 hover:from-purple-600 hover:to-blue-600 transition-all"
        >
          <ChevronDown className="h-5 w-5 rotate-90" />
        </motion.button>
      )}
    </>
  );
}