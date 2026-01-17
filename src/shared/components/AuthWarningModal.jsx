import { createPortal } from "react-dom";
import { Lock } from "./Icons";
import { Button } from "./Button";

export const AuthWarningModal = ({ open, onClose, onConfigure }) => {
  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Lock size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            API Key Required
          </h3>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          To use this AI-powered feature, you need to configure your Gemini API
          key.
        </p>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onClose();
              onConfigure();
            }}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-primary-600 text-white border-0"
          >
            Configure API Key
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
