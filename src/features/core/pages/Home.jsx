import { useState } from "react";
import { motion } from "motion/react";
import { HOME_FEATURES } from "../data/homeFeatures";
import { Layout } from "../../../shared/components/Layout";
import { useToast } from "../../../shared/context/ToastContext";
import { ApiKeyModal } from "../../../shared/components/ApiKeyModal";
import { AuthWarningModal } from "../../../shared/components/AuthWarningModal";

// Modular Components
import { HeroSection, FeatureCard, DeveloperSection } from "../components/Home";

export const Home = () => {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const { showToast } = useToast();

  return (
    <Layout>
      <AuthWarningModal
        open={showAuthWarning}
        onClose={() => setShowAuthWarning(false)}
        onConfigure={() => {
          setShowAuthWarning(false);
          setShowApiKeyModal(true);
        }}
      />
      <ApiKeyModal
        open={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-24 relative overflow-hidden pb-20 px-4">
        <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.05),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(79,70,229,0.05),transparent_40%)]" />

        <HeroSection />

        <div className="w-full max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Master Every Aspect
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              A comprehensive toolkit designed to prepare you for the most
              demanding technical and behavioral interviews.
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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
        </div>

        <DeveloperSection />
      </div>
    </Layout>
  );
};
