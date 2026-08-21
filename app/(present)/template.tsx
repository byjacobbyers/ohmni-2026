'use client'

import { motion, useReducedMotion } from 'motion/react'

/**
 * Next remounts a template on every route change, so this is the screen
 * transition. Faster than the site's 0.75s: a deck should feel like a cut,
 * not a dissolve.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.22 }}
    >
      {children}
    </motion.div>
  )
}
