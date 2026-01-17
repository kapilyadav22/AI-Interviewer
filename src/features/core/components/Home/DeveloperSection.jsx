import { memo } from "react";
import { motion } from "motion/react";
import {
  Trophy,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "../../../../shared/components/Icons";
import { useCardEffects } from "../../../../shared/hooks/useCardEffects";
import { URLS } from "../../../../shared/constants/urlConstants";
import logo from "../../../../assets/kapil.jpg";

const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-primary-600 dark:hover:bg-primary-600 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-white font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
  >
    {icon}
    <span className="text-sm">{label}</span>
  </a>
);

export const DeveloperSection = memo(function DeveloperSection() {
  const { handleMouseMove, handleMouseLeave, cardStyle, overlayStyle } =
    useCardEffects({
      tiltIntensity: 5,
      spotlightRadiusLight: 600,
      spotlightRadiusDark: 600,
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-7xl px-4 py-32"
    >
      <div
        className="relative group perspective-container"
        style={{ perspective: 1200 }}
      >
        <div className="absolute -inset-2 bg-gradient-to-r from-primary-600/20 via-indigo-600/20 to-purple-600/20 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

        <motion.div
          style={{
            ...cardStyle,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ rotateY: 2, rotateX: -2 }}
          className="relative bg-white dark:bg-slate-800 rounded-[3.5rem] p-10 md:p-16 border border-slate-100 dark:border-slate-700 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-700 hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.15)] will-change-transform transform-gpu"
        >
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[3.5rem] opacity-0 group-hover:opacity-100 transition duration-700 z-10"
            style={overlayStyle}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(14,165,233,0.05),transparent)] pointer-events-none" />

          <div
            className="flex flex-col md:flex-row items-center gap-16 relative z-30"
            style={{ transform: "translateZ(80px)" }}
          >
            <div
              className="relative shrink-0"
              style={{ transform: "translateZ(40px)" }}
            >
              <motion.div
                whileHover={{ rotate: 0, scale: 1.05 }}
                className="w-56 h-56 rounded-[3rem] overflow-hidden border-8 border-white dark:border-slate-700 shadow-2xl rotate-6 transition-all duration-500"
              >
                <img
                  src={logo}
                  alt="Kapil Yadav"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.2, rotate: 0 }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary-600 to-indigo-600 text-white p-5 rounded-[1.5rem] shadow-2xl -rotate-12 transition-transform duration-300"
              >
                <Trophy size={32} />
              </motion.div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-8">
              <div className="space-y-3">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase"
                >
                  Meet the{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                    Architect
                  </span>
                </motion.h2>
                <p className="text-2xl font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                  Kapil Yadav
                </p>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed max-w-2xl font-medium">
                M.Tech graduate from DTU and a Senior Software Engineer.
                Passionate about building AI-powered tools that bridge the gap
                between candidates and their dream offers. Expert in Full-Stack
                Development, Generative AI, and high-performance web systems.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-6">
                {[
                  {
                    href: URLS.SOCIAL.GITHUB,
                    icon: <Github size={22} />,
                    label: "GitHub",
                  },
                  {
                    href: URLS.SOCIAL.LINKEDIN,
                    icon: <Linkedin size={22} />,
                    label: "LinkedIn",
                  },
                  {
                    href: URLS.SOCIAL.TWITTER,
                    icon: <Twitter size={22} />,
                    label: "Twitter",
                  },
                  {
                    href: URLS.SOCIAL.EMAIL,
                    icon: <Mail size={22} />,
                    label: "Email",
                  },
                ].map((social, i) => (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <SocialLink {...social} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});
