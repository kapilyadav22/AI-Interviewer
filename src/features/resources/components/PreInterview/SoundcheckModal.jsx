import { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Webcam from "react-webcam";
import { Camera, Mic, RefreshCw } from "../../../../shared/components/Icons";
import { Button } from "../../../../shared/components/Button";
import { cn } from "../../../../shared/utils/cn";

const SoundcheckItem = ({ label, val }) => (
  <div className="space-y-1.5">
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
      {label}
    </p>
    <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
      {val}
    </p>
  </div>
);

export const SoundcheckModal = ({
  open,
  onClose,
  isSoundchecking,
  soundcheckTime,
  soundcheckTranscript,
  soundcheckFeedback,
  runSoundcheck,
}) => {
  const webcamRef = useRef(null);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            <div className="flex-1 bg-black aspect-video relative">
              <Webcam
                ref={webcamRef}
                className="w-full h-full object-cover"
                mirrored
              />
              <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isSoundchecking
                      ? "bg-red-500 animate-pulse"
                      : "bg-emerald-500",
                  )}
                />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                  {isSoundchecking ? "System Live" : "Camera Ready"}
                </span>
              </div>

              {isSoundchecking && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/10"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="60"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={376.8}
                        strokeDashoffset={376.8 * (1 - soundcheckTime / 10)}
                        className="text-primary-500 transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <span className="absolute text-4xl font-black text-white">
                      {soundcheckTime}s
                    </span>
                  </div>
                  <p className="mt-6 text-white font-black uppercase tracking-[0.2em] text-sm animate-pulse">
                    Speak naturally now...
                  </p>
                </div>
              )}

              <div className="absolute bottom-6 left-6 right-6 flex justify-center">
                {!isSoundchecking && (
                  <Button
                    size="lg"
                    onClick={runSoundcheck}
                    className="bg-primary-600 hover:bg-primary-700 font-black h-14 px-10 rounded-2xl shadow-xl group"
                  >
                    <Mic className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    {soundcheckFeedback
                      ? "Re-run 10s Soundcheck"
                      : "Start 10s Soundcheck"}
                  </Button>
                )}
              </div>
            </div>
            <div className="w-full md:w-80 p-10 space-y-8 bg-slate-50 dark:bg-slate-900 border-l border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                  INTRO <br /> SOUNDCHECK
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                  Verify your mic and camera setup before the call.
                </p>
              </div>

              {isSoundchecking ? (
                <div className="space-y-6">
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl border border-primary-100 dark:border-primary-800">
                    <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400 font-black uppercase text-[10px] tracking-widest mb-2">
                      <RefreshCw className="animate-spin" size={12} />{" "}
                      Listening...
                    </div>
                    <p className="text-xs text-primary-800 dark:text-primary-200 font-medium leading-relaxed">
                      {soundcheckTranscript ||
                        "Keep talking to test your volume level..."}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full overflow-hidden"
                      >
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.2,
                          }}
                          className="h-full w-1/3 bg-primary-400/30 rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : soundcheckFeedback ? (
                <div className="space-y-6">
                  <SoundcheckItem
                    label="Lighting"
                    val={soundcheckFeedback.lighting}
                  />
                  <SoundcheckItem
                    label="Framing"
                    val={soundcheckFeedback.framing}
                  />
                  <SoundcheckItem
                    label="Audio/Vibe"
                    val={soundcheckFeedback.impression}
                  />
                </div>
              ) : (
                <div className="p-6 bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    Ready when you are!
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full rounded-xl border-slate-200 text-slate-400"
                onClick={onClose}
              >
                Close Soundcheck
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
