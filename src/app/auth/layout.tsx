"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="relative w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { duration: 0.2 }
            }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.15 }
            }}
            className="w-full absolute left-0 right-0"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 