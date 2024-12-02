import React from 'react';
import { motion } from 'framer-motion';
import { useNexusStore } from '../stores/nexusStore';
import { GlowingText } from './ui/GlowingText';
import { HolographicPanel } from './ui/HolographicPanel';
import { DataStream } from './ui/DataStream';

interface NexusCoreProps {
  metrics: any;
}

export default function NexusCore({ metrics }: NexusCoreProps) {
  const nexus = useNexusStore((state) => state.nexus);

  return (
    <HolographicPanel className="w-96 h-96">
      <motion.div
        className="w-48 h-48 rounded-full bg-purple-600/20 relative mx-auto my-8"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-pulse-purple" />
        <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <GlowingText className="text-lg">MASTERMIND</GlowingText>
        </div>
      </motion.div>

      <div className="mt-8 space-y-2 p-4">
        <div className="text-sm text-purple-400">
          CPU: {metrics.cpu?.currentLoad.toFixed(1)}%
        </div>
        <div className="text-sm text-purple-400">
          Memory: {(metrics.memory?.used / 1024 / 1024 / 1024).toFixed(2)} GB
        </div>
      </div>
    </HolographicPanel>
  );
}