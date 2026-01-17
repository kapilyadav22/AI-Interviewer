import { motion } from "motion/react";
import {
  Zap,
  FileText,
  Mic,
  MicOff,
  Upload,
  Loader2,
  Briefcase,
  RefreshCw,
  ChevronRight,
} from "../../../../shared/components/Icons";
import { Card } from "../../../../shared/components/Card";
import { Button } from "../../../../shared/components/Button";
import { cn } from "../../../../shared/utils/cn";

export const PreInterviewInput = ({
  formData,
  setFormData,
  isListening,
  listeningTo,
  onToggleDictation,
  onPdfUpload,
  parsingPdf,
  isGenerating,
  onGenerate,
}) => {
  return (
    <motion.div
      key="input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-primary-100 dark:bg-primary-900/30 rounded-3xl mb-6 text-primary-600 dark:text-primary-400 shadow-xl shadow-primary-50 dark:shadow-none">
          <Zap size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase">
          Pre-Interview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
          The 60-second prep. Get a high-impact cheat sheet for your interview
          based on your resume and the job description.
        </p>
      </div>

      <Card className="p-8 md:p-12 rounded-[2.5rem] border-slate-200 dark:border-slate-700 shadow-2xl space-y-8 dark:bg-slate-800">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <FileText size={14} /> Your Resume Text
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onToggleDictation("resume")}
                className={cn(
                  "text-indigo-600 font-black h-8",
                  isListening && listeningTo === "resume"
                    ? "bg-red-50 text-red-600 animate-pulse"
                    : "",
                )}
              >
                {isListening && listeningTo === "resume" ? (
                  <MicOff className="w-3 h-3 mr-2" />
                ) : (
                  <Mic className="w-3 h-3 mr-2" />
                )}
                {isListening && listeningTo === "resume" ? "STOP" : "DICTATE"}
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={onPdfUpload}
                  disabled={parsingPdf}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={parsingPdf}
                  className="text-primary-600 font-black h-8"
                >
                  {parsingPdf ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                  ) : (
                    <Upload className="w-3 h-3 mr-2" />
                  )}
                  {parsingPdf ? "PARSING..." : "UPLOAD PDF"}
                </Button>
              </div>
            </div>
          </div>
          <textarea
            placeholder="Paste your resume here..."
            className="w-full h-48 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/20 focus:border-primary-500 outline-none font-medium transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
            value={formData.resume}
            onChange={(e) =>
              setFormData({ ...formData, resume: e.target.value })
            }
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Briefcase size={14} /> Job Description (Optional)
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onToggleDictation("jobDesc")}
              className={cn(
                "text-indigo-600 font-black h-8",
                isListening && listeningTo === "jobDesc"
                  ? "bg-red-50 text-red-600 animate-pulse"
                  : "",
              )}
            >
              {isListening && listeningTo === "jobDesc" ? (
                <MicOff className="w-3 h-3 mr-2" />
              ) : (
                <Mic className="w-3 h-3 mr-2" />
              )}
              {isListening && listeningTo === "jobDesc" ? "STOP" : "DICTATE"}
            </Button>
          </div>
          <textarea
            placeholder="Paste the job description for a tailored briefing..."
            className="w-full h-32 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-transparent focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/20 focus:border-primary-500 outline-none font-medium transition-all resize-none text-slate-900 dark:text-white placeholder:text-slate-400"
            value={formData.jobDesc}
            onChange={(e) =>
              setFormData({ ...formData, jobDesc: e.target.value })
            }
          />
        </div>
        <Button
          onClick={onGenerate}
          disabled={isGenerating || !formData.resume}
          className="w-full h-16 rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-xl font-black shadow-xl flex items-center justify-center gap-4"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={24} className="animate-spin" /> GENERATING
              BRIEFING...
            </>
          ) : (
            <>
              START PRE-INTERVIEW <ChevronRight size={24} />
            </>
          )}
        </Button>
      </Card>
    </motion.div>
  );
};
