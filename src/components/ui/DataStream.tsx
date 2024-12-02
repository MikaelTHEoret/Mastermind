import React from 'react';
import { motion } from 'framer-motion';

interface DataStreamProps {
  start: [number, number, number];
  end: [number, number, number];
}

export function DataStream({ start, end }: DataStreamProps) {
  return (
    <motion.group>
      <motion.line
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
        }}
        stroke="rgba(139, 92, 246, 0.5)"
        strokeWidth={2}
        points={[...start, ...end]}
      />
      <motion.mesh
        position={start}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
        }}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.5} />
      </motion.mesh>
    </motion.group>
  );
}