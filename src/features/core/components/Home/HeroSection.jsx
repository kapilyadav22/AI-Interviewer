import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../../../../shared/components/Button";
import { config } from "../../../../config";

export const HeroSection = memo(function HeroSection() {
  return (
    <div className="relative overflow-hidden w-full flex flex-col items-center">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/20 via-slate-50/20 to-white/20 dark:from-indigo-900/20 dark:via-slate-900/20 dark:to-slate-950/20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-[100px] animate-blob" />
        <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute -bottom-[40%] left-[20%] w-[70%] h-[70%] rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 20, perspective: 1000 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for smoothness
          opacity: { duration: 1 },
        }}
        className="space-y-6 max-w-4xl text-center z-10 p-8"
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Secure Your{" "}
            <span className="relative inline-block">
              <span className="text-primary-600 dark:text-primary-500 relative z-10">
                Next Offer
              </span>
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute bottom-2 left-0 h-3 bg-primary-100 dark:bg-primary-900/30 -z-10 rounded-full"
              />
            </span>{" "}
            with {config.appName}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto"
        >
          Practice with our intelligent AI interviewer. Upload your resume, get
          real-time feedback, and improve your confidence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="pt-8 flex flex-wrap gap-4 justify-center"
        >
          <Link to="/setup">
            <Button
              size="lg"
              className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-primary-600 to-indigo-600 border-none font-black uppercase tracking-wider"
            >
              Start Practice
            </Button>
          </Link>
          <Link to="/collaborative-whiteboard">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 py-6 text-sm font-bold border-2 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 dark:text-slate-200 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight"
            >
              Whiteboard
            </Button>
          </Link>
          <Link to="/compiler">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 py-6 text-sm font-bold border-2 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 dark:text-slate-200 transition-all hover:scale-105 active:scale-95 uppercase tracking-tight"
            >
              Compiler
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
});
