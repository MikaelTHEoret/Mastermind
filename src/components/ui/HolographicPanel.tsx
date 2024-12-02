import React from 'react';
import { motion } from 'framer-motion';

interface HolographicPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function HolographicPanel({ children, className = '' }: HolographicPanelProps) {
  return (
    <motion.div
      className={`relative bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10" />
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
    </motion.div>
  );
}