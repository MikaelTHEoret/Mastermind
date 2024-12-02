import React from 'react';
import { motion } from 'framer-motion';

interface GlowingTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowingText({ children, className = '' }: GlowingTextProps) {
  return (
    <motion.span
      className={`font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        textShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
      }}
    >
      {children}
    </motion.span>
  );
}