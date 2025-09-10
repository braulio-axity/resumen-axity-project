import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface EmptyStateCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  gradient?: string;
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  buttonText,
  onClick,
  gradient = "from-gray-100 to-gray-200"
}: EmptyStateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-8"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8"
      >
        <div className={`w-32 h-32 bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-white/50 shadow-lg`}>
          <Icon className="h-16 w-16 text-white" />
        </div>
      </motion.div>
      
      <h4 className="text-2xl font-bold text-[var(--axity-purple)] mb-3">
        {title}
      </h4>
      <p className="text-[var(--axity-gray)] mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onClick}
          size="lg"
          className="bg-axity-gradient-accent text-white shadow-xl px-8 py-4"
        >
          <Plus className="h-5 w-5 mr-2" />
          {buttonText}
        </Button>
      </motion.div>
    </motion.div>
  );
}