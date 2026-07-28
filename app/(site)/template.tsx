"use client";

import { motion, useReducedMotion } from 'motion/react';

export default function Template({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
