import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../utils/cn";

export const Tooltip = ({ content, children, position = "top", className }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: position === "top" ? 10 : position === "bottom" ? -10 : 0,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-[110] px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-bold rounded-lg whitespace-nowrap shadow-xl pointer-events-none uppercase tracking-widest",
              positions[position],
              className,
            )}
          >
            {content}
            <div
              className={cn(
                "absolute w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45",
                position === "top" && "bottom-[-4px] left-1/2 -translate-x-1/2",
                position === "bottom" && "top-[-4px] left-1/2 -translate-x-1/2",
                position === "left" && "right-[-4px] top-1/2 -translate-y-1/2",
                position === "right" && "left-[-4px] top-1/2 -translate-y-1/2",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
