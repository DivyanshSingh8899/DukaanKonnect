import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Siren } from 'lucide-react';

export function EmergencyButton() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.button
        type="button"
        aria-label="Emergency Services"
        title="Emergency Services"
        onClick={() => navigate('/emergency')}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative h-14 w-14 rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/40 flex items-center justify-center text-white cursor-pointer"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-red-500/50"
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
        <Siren className="w-6 h-6 relative" />
      </motion.button>
    </div>
  );
}
