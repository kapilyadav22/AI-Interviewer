import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  Trophy,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";
import { HOME_FEATURES } from "../data/homeFeatures";
import { URLS } from "../../../shared/constants/urlConstants";
import logo from "../../../assets/kapil.jpg";
import { Button } from "../../../shared/components/Button";
import { Layout } from "../../../shared/components/Layout";
import { BrainTeaser } from "../../../shared/components/BrainTeaser";
import { GeminiService } from "../../../shared/services/gemini";
import { useToast } from "../../../shared/context/ToastContext";
import { cn } from "../../../shared/utils/cn";
import { config } from "../../../config";
import { useCardEffects } from "../../../shared/hooks/useCardEffects";

export const Home = () => {
  const [teaser, setTeaser] = useState(null);
  const [loadingTeaser, setLoadingTeaser] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchTeaser = async () => {
      const hasKey =
        localStorage.getItem("gemini_api_key") || config.geminiApiKey;
      if (!hasKey) {
        setLoadingTeaser(false);
        return;
      }

      try {
        // const gemini = new GeminiService(config.geminiApiKey);
        //const data = await gemini.getDailyTeaser();
        setTeaser(data);
      } catch (error) {
        // DEBUG: console.error("Home Teaser Error:", error);
        // Silence warning if key is just missing
        // if (!error.message.includes("missing")) {
        //   showToast("Could not load Daily Teaser.", "warning");
        // }
      } finally {
        setLoadingTeaser(false);
      }
    };

    fetchTeaser();
  }, [showToast]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/20 via-slate-50/20 to-white/20 dark:from-indigo-900/20 dark:via-slate-900/20 dark:to-slate-950/20 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-20">
          <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-[100px] animate-blob" />
          <div className="absolute -top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute -bottom-[40%] left-[20%] w-[70%] h-[70%] rounded-full bg-emerald-200/30 dark:bg-emerald-900/20 blur-[100px] animate-blob animation-delay-4000" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-3xl"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Secure Your{" "}
            <span className="text-primary-600 dark:text-primary-500">
              Next Offer
            </span>{" "}
            with {config.appName}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Practice with our intelligent AI interviewer. Upload your resume,
            get real-time feedback, and improve your confidence.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <Link to="/setup">
              <Button
                size="lg"
                className="rounded-full px-8 text-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40"
              >
                Start Interview Now
              </Button>
            </Link>
            <Link to="/system-design">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-lg border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-200"
              >
                WhiteBoard
              </Button>
            </Link>
            <Link to="/referral-engine">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-lg border-emerald-400 text-emerald-700 hover:bg-emerald-50"
              >
                Referral Engine
              </Button>
            </Link>
            <Link to="/survival-kit">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-lg border-amber-400 text-amber-700 hover:bg-amber-50"
              >
                Post-Interview Game
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* {teaser && (
          <div className="w-full max-w-5xl">
            <BrainTeaser teaser={teaser} loading={loadingTeaser} />
          </div>
        )} */}

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl px-4"
        >
          {HOME_FEATURES.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </motion.div>

        {/* Developer Section */}
        <DeveloperSection />
      </div>
    </Layout>
  );
};

const DeveloperSection = () => {
  const { handleMouseMove, handleMouseLeave, cardStyle, overlayStyle } =
    useCardEffects({
      tiltIntensity: 5,
      spotlightRadiusLight: 600,
      spotlightRadiusDark: 600,
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-7xl px-4 py-24"
    >
      <div
        className="relative group perspective-container"
        style={{ perspective: 1000 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

        <motion.div
          style={{
            ...cardStyle,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden transform-style-3d transition-shadow duration-300 hover:shadow-2xl"
        >
          {/* Enhanced Spotlight Overlay */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-[3rem] opacity-0 group-hover:opacity-100 transition duration-300 z-10"
            style={overlayStyle}
          />

          {/* Glossy Reflection Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 mix-blend-overlay" />

          <div
            className="flex flex-col md:flex-row items-center gap-12 relative z-30"
            style={{ transform: "translateZ(30px)" }}
          >
            <div className="relative shrink-0">
              <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden border-4 border-slate-50 dark:border-slate-700 shadow-xl rotate-3">
                <img
                  src={logo}
                  alt="Kapil Yadav"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white p-4 rounded-2xl shadow-lg -rotate-6">
                <Trophy size={24} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic uppercase underline decoration-primary-500 decoration-8 underline-offset-4">
                  Meet the Architect
                </h2>
                <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  Kapil Yadav
                </p>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-2xl">
                M.Tech graduate from DTU and a Senior Software Engineer.
                Passionate about building AI-powered tools that bridge the gap
                between candidates and their dream offers. Expert in Full-Stack
                Development, Generative AI, and high-performance web systems.
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <SocialLink
                  href={URLS.SOCIAL.GITHUB}
                  icon={<Github size={20} />}
                  label="GitHub"
                />
                <SocialLink
                  href={URLS.SOCIAL.LINKEDIN}
                  icon={<Linkedin size={20} />}
                  label="LinkedIn"
                />
                <SocialLink
                  href={URLS.SOCIAL.TWITTER}
                  icon={<Twitter size={20} />}
                  label="Twitter"
                />
                <SocialLink
                  href={URLS.SOCIAL.EMAIL}
                  icon={<Mail size={20} />}
                  label="Email"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

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

const FeatureCard = ({ icon, title, description }) => {
  const { handleMouseMove, handleMouseLeave, cardStyle, overlayStyle } =
    useCardEffects({
      spotlightRadiusLight: 260,
      spotlightRadiusDark: 300,
    });

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      style={{
        perspective: 1000,
        ...cardStyle,
      }}
      whileHover={{
        scale: 1.02,
        zIndex: 50,
        borderColor: "rgba(14, 165, 233, 0.6)", // Bright cyan border on hover
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer overflow-hidden group transform-style-3d transition-shadow duration-300 hover:shadow-2xl"
    >
      {/* Enhanced Spotlight Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 z-10"
        style={overlayStyle}
      />

      {/* Glossy Reflection Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 mix-blend-overlay" />

      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 dark:to-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

      <div className="relative z-30" style={{ transform: "translateZ(30px)" }}>
        <div className="bg-slate-50 dark:bg-slate-700 w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-100 dark:border-slate-600">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
