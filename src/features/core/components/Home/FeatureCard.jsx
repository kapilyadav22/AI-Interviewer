import { memo } from "react";
import { motion } from "motion/react";
import { useCardEffects } from "../../../../shared/hooks/useCardEffects";

export const FeatureCard = memo(function FeatureCard({
  icon,
  title,
  description,
}) {
  const { handleMouseMove, handleMouseLeave, cardStyle, overlayStyle } =
    useCardEffects({
      spotlightRadiusLight: 260,
      spotlightRadiusDark: 300,
    });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, rotateX: 15 },
        visible: {
          opacity: 1,
          y: 0,
          rotateX: 0,
          transition: {
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
          },
        },
      }}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        ...cardStyle,
      }}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: -5,
        zIndex: 50,
        borderColor: "rgba(14, 165, 233, 0.6)",
      }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 cursor-pointer overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/10 will-change-transform transform-gpu"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 z-10"
        style={overlayStyle}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 dark:from-primary-900/10" />

      <div
        className="relative z-30 space-y-4 flex flex-col items-center text-center"
        style={{ transform: "translateZ(50px)" }}
      >
        <div className="bg-slate-50 dark:bg-slate-700 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner border border-slate-100 dark:border-slate-600">
          <div className="text-primary-600 dark:text-primary-400 transform group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed antialiased">
            {description}
          </p>
        </div>
      </div>

      <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors duration-500" />
    </motion.div>
  );
});
