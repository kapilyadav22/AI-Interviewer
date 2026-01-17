import { memo } from "react";
import {
  FileText,
  Briefcase,
  Mic,
  MicOff,
  Upload,
  Loader2,
  Save,
} from "../../../../shared/components/Icons";
import { Button } from "../../../../shared/components/Button";
import { cn } from "../../../../shared/utils/cn";

export const OptimizerInput = memo(function OptimizerInput({
  resumeText,
  setResumeText,
  jobDesc,
  setJobDesc,
  loading,
  isListening,
  listeningTo,
  toggleDictation,
  handlePdfUpload,
  handleAnalyze,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-primary-500" />
          <h3 className="font-medium text-slate-900 dark:text-white uppercase tracking-wider text-xs font-black">
            Resume
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => toggleDictation("resume")}
            className={cn(
              "transition-all duration-300 rounded-xl font-bold border-indigo-200 text-indigo-600",
              isListening && listeningTo === "resume"
                ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                : "",
            )}
          >
            {isListening && listeningTo === "resume" ? (
              <MicOff className="w-4 h-4 mr-2" />
            ) : (
              <Mic className="w-4 h-4 mr-2" />
            )}
            {isListening && listeningTo === "resume" ? "STOP" : "DICTATE"}
          </Button>
          <input
            id="pdfUpload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handlePdfUpload}
            disabled={loading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("pdfUpload").click()}
            disabled={loading}
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            UPLOAD PDF
          </Button>
        </div>
      </div>
      <textarea
        className="w-full h-40 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium"
        placeholder="Paste your resume text here or upload a PDF..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-primary-500" />
          <h3 className="font-medium text-slate-900 dark:text-white uppercase tracking-wider text-xs font-black">
            Job Description (optional)
          </h3>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => toggleDictation("jobDesc")}
          className={cn(
            "transition-all duration-300 rounded-xl font-bold border-indigo-200 text-indigo-600",
            isListening && listeningTo === "jobDesc"
              ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
              : "",
          )}
        >
          {isListening && listeningTo === "jobDesc" ? (
            <MicOff className="w-4 h-4 mr-2" />
          ) : (
            <Mic className="w-4 h-4 mr-2" />
          )}
          {isListening && listeningTo === "jobDesc" ? "STOP" : "DICTATE"}
        </Button>
      </div>
      <textarea
        className="w-full h-24 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
        placeholder="Paste the job description you are targeting..."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <Button onClick={handleAnalyze} disabled={loading} className="w-full">
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Save className="w-4 h-2 mr-2" />
        )}
        {loading ? "Analyzing..." : "Optimize Resume"}
      </Button>
    </div>
  );
});
