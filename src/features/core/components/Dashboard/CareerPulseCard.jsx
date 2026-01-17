import { memo } from "react";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Tooltip,
} from "recharts";
import { Card } from "../../../../shared/components/Card";
import { BrainCircuit, Zap } from "../../../../shared/components/Icons";

export const CareerPulseCard = memo(function CareerPulseCard({
  holisticData,
  readinessScore = 82,
}) {
  return (
    <Card className="lg:col-span-2 p-10 rounded-[2.5rem] bg-slate-900 text-white border-transparent shadow-2xl overflow-hidden relative group">
      <div className="absolute -right-20 -top-20 text-white/5 rotate-12 group-hover:scale-110 transition-transform duration-700">
        <BrainCircuit size={400} />
      </div>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Zap size={14} className="fill-current" /> AI Career Pulse
          </div>
          <h2 className="text-4xl font-black leading-tight">
            Your Holistic <br /> Interview Readiness
          </h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            We've aggregated your performance across technical challenges, soft
            skills practice, and mock interviews to map your professional
            profile.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-slate-400 uppercase tracking-widest text-[10px]">
                Readiness Score
              </span>
              <span className="text-primary-400">{readinessScore}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${readinessScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary-600 to-indigo-500"
              />
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={holisticData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
              />
              <Radar
                name="Skills"
                dataKey="A"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
});
