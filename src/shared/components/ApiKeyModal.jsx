import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Key, X, Check, AlertCircle, ExternalLink, Copy } from "lucide-react";
import { cn } from "../utils/cn";
import { config } from "../../config";

export const ApiKeyModal = ({ open, onClose }) => {
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("gemini_api_key") || config.geminiApiKey || ""
  );
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini_api_key", apiKey.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("gemini_api_key");
    setApiKey("");
  };

  const handleCopy = () => {
    if (apiKey.trim()) {
      navigator.clipboard.writeText(apiKey.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-primary-50 dark:from-emerald-950/30 dark:to-primary-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white rounded-xl shadow-sm">
              <Key size={22} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-lg">
                API Key Setup
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Configure your Gemini API key
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/80 rounded-xl text-slate-500 hover:text-slate-700 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Info Alert */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
            <AlertCircle
              size={20}
              className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            />
            <div className="text-sm text-blue-900 dark:text-blue-100 space-y-1">
              <p className="font-bold">
                Your key stays private in your browser
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Get your free API key from{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline font-semibold hover:text-blue-900"
                >
                  Google AI Studio
                  <ExternalLink size={12} />
                </a>
              </p>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                placeholder="AIza..."
                className="w-full px-4 py-3.5 pr-28 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 outline-none font-mono text-sm transition-all"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
                    title="Copy API key"
                  >
                    {copied ? (
                      <Check size={16} className="text-emerald-600" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim() || saved}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all",
                saved
                  ? "bg-emerald-500 text-white shadow-emerald-200"
                  : apiKey.trim()
                  ? "bg-gradient-to-r from-emerald-600 to-primary-600 hover:from-emerald-700 hover:to-primary-700 text-white shadow-emerald-200 dark:shadow-emerald-900/30 active:scale-95"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
              )}
            >
              {saved ? (
                <>
                  <Check size={18} /> Saved Successfully!
                </>
              ) : (
                "Save API Key"
              )}
            </button>

            {apiKey && !saved && (
              <button
                onClick={handleClear}
                className="px-5 py-3.5 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 border-2 border-red-200 hover:border-red-300 transition-all"
              >
                Clear
              </button>
            )}
          </div>

          <p className="text-xs text-center text-slate-500 pt-1">
            This key enables all AI-powered features in the app
          </p>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ApiKeyModal;
