import { motion, AnimatePresence } from "motion/react";
import type { MotivationalMessage } from "../types/app";

interface FloatingMessageProps {
  showLatestMessage: MotivationalMessage | null;
}

export function FloatingMessage({ showLatestMessage }: FloatingMessageProps) {
  return (
    <AnimatePresence>
      {showLatestMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -100 }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        >
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-2xl border border-white/20 max-w-md"
            animate={{ 
              boxShadow: [
                '0 10px 30px rgba(139, 95, 191, 0.3)',
                '0 20px 40px rgba(139, 95, 191, 0.4)',
                '0 10px 30px rgba(139, 95, 191, 0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex items-center gap-4">
              <motion.div 
                className="text-3xl"
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 0.6 }}
              >
                {showLatestMessage.icon}
              </motion.div>
              <div>
                <div className="font-bold text-lg">{showLatestMessage.message}</div>
                {showLatestMessage.description && (
                  <div className="text-white/80 text-sm mt-1">{showLatestMessage.description}</div>
                )}
                {showLatestMessage.context && (
                  <div className="text-white/70 text-xs mt-2 bg-white/10 rounded-lg px-2 py-1">
                    {showLatestMessage.context}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}