import { motion } from "motion/react";
import {
  ArrowLeft,
  Bookmark,
  Camera,
  Quote,
  Target,
  Sparkles,
  Award,
} from "../../../../shared/components/Icons";
import { Card } from "../../../../shared/components/Card";
import { Button } from "../../../../shared/components/Button";

export const PreInterviewResults = ({
  briefing,
  onReset,
  onSaveToVault,
  onShowSoundcheck,
}) => {
  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
            The Cheat Sheet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            Review this 60 seconds before your interview starts.
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 font-bold"
            onClick={onReset}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> New Briefing
          </Button>
          <Button
            className="rounded-xl bg-primary-600 font-black shadow-lg shadow-primary-100"
            onClick={onSaveToVault}
          >
            <Bookmark className="w-4 h-4 mr-2" /> Save to Vault
          </Button>
          <Button
            variant="secondary"
            className="rounded-xl font-black border-2 border-slate-900 dark:border-slate-500 dark:text-slate-200 dark:bg-slate-800"
            onClick={onShowSoundcheck}
          >
            <Camera className="w-4 h-4 mr-2" /> Intro Soundcheck
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <Card className="bg-slate-900 dark:bg-black text-white p-10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
              <Quote size={200} />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                Confidence Mantra
              </div>
              <p className="text-2xl font-black italic leading-tight">
                "{briefing.confidenceMantra}"
              </p>
            </div>
          </Card>

          <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-100 dark:border-primary-800 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-primary-800 dark:text-primary-300 font-black uppercase text-xs tracking-widest flex items-center gap-2">
              <Target size={18} /> The "Why Us" Nugget
            </h3>
            <p className="text-primary-900 dark:text-primary-100 font-medium text-lg leading-relaxed">
              {briefing.whyUsNugget}
            </p>
          </Card>

          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 p-8 rounded-[2.5rem] space-y-4">
            <h3 className="text-amber-800 dark:text-amber-300 font-black uppercase text-xs tracking-widest flex items-center gap-2">
              <Sparkles size={18} /> The Hidden Gem
            </h3>
            <p className="text-amber-900 dark:text-amber-100 font-bold leading-relaxed">
              {briefing.hiddenGem}
            </p>
            <p className="text-xs text-amber-700/60 dark:text-amber-400/60 font-medium">
              Bring this up casually to stand out from other candidates.
            </p>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
              Top 3 STAR Stories to Use
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {briefing.starStories.map((story, i) => (
              <Card
                key={i}
                className="p-8 rounded-[2rem] border-slate-100 dark:border-slate-700 dark:bg-slate-800 shadow-xl space-y-6 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">
                    Story #{i + 1}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {story.title}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium text-sm leading-relaxed italic">
                  "{story.context}"
                </p>
                <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                    Why it fits this job:
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">
                    {story.whyItFits}
                  </p>
                </div>
              </Card>
            ))}
            <Card className="p-8 rounded-[2rem] border-dashed border-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col justify-center gap-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase italic">
                Technical Focal Points
              </h3>
              <div className="flex flex-wrap gap-2">
                {briefing.techFocalPoints.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-lg text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
