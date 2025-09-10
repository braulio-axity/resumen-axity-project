import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Save, 
  Check, 
  Loader2, 
  AlertTriangle, 
  Cloud, 
  CloudOff,
  RefreshCw,
  Clock
} from 'lucide-react';

interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved?: Date;
  error?: string;
  onForceSave?: () => void;
  className?: string;
}

export function AutoSaveIndicator({ 
  status, 
  lastSaved, 
  error, 
  onForceSave,
  className = "" 
}: AutoSaveIndicatorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Loader2,
          text: 'Guardando...',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          iconColor: 'text-blue-600',
          animate: true
        };
      case 'saved':
        return {
          icon: Check,
          text: 'Guardado',
          color: 'bg-green-100 text-green-800 border-green-200',
          iconColor: 'text-green-600',
          animate: false
        };
      case 'error':
        return {
          icon: AlertTriangle,
          text: 'Error al guardar',
          color: 'bg-red-100 text-red-800 border-red-200',
          iconColor: 'text-red-600',
          animate: false
        };
      default:
        return {
          icon: Cloud,
          text: 'Auto guardado',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          iconColor: 'text-gray-600',
          animate: false
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    return date.toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Status Indicator */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              className="relative bg-transparent border-none p-0 m-0 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDetails(!showDetails)}
            >
              <Badge 
                className={`${config.color} flex items-center gap-2 cursor-pointer transition-all`}
              >
                <Icon 
                  className={`h-3 w-3 ${config.iconColor} ${config.animate ? 'animate-spin' : ''}`} 
                />
                <span className="text-xs font-medium">{config.text}</span>
                
                {/* Online/Offline indicator */}
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-400' : 'bg-red-400'
                }`} />
              </Badge>
              
              {/* Pulse effect for saving */}
              {status === 'saving' && (
                <motion.div
                  className="absolute inset-0 bg-blue-300 rounded-full opacity-30"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <div className="font-medium">{config.text}</div>
              {lastSaved && (
                <div className="text-xs text-muted-foreground">
                  {formatLastSaved(lastSaved)}
                </div>
              )}
              {!isOnline && (
                <div className="text-xs text-red-600 mt-1">
                  Sin conexión - Guardado local
                </div>
              )}
              {error && (
                <div className="text-xs text-red-600 mt-1">
                  {error}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {/* Detailed Actions */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -10 }}
              className="flex items-center gap-1"
            >
              {/* Force Save Button */}
              {onForceSave && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onForceSave}
                      className="p-1 h-6 w-6 hover:bg-blue-100 rounded"
                      disabled={status === 'saving'}
                    >
                      <RefreshCw className={`h-3 w-3 text-blue-600 ${
                        status === 'saving' ? 'animate-spin' : ''
                      }`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Guardar ahora</span>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Last Saved Time */}
              {lastSaved && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs text-gray-600 border-none cursor-default hover:bg-gray-100">
                      <Clock className="h-3 w-3" />
                      <span>{formatLastSaved(lastSaved)}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Último guardado: {lastSaved.toLocaleString()}</span>
                  </TooltipContent>
                </Tooltip>
              )}


            </motion.div>
          )}
        </AnimatePresence>

        {/* Network Status */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1"
          >
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
              <CloudOff className="h-3 w-3 mr-1" />
              Sin conexión
            </Badge>
          </motion.div>
        )}
      </div>
    </TooltipProvider>
  );
}