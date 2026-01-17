import { useState, useCallback } from "react";
import { GeminiService } from "../services/gemini";
import { config } from "../../config";
import { useToast } from "../context/ToastContext";

export function useGeminiAction(setShowAuthWarning) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const execute = useCallback(
    async (actionFn, options = {}) => {
      const { onSuccess, onError, onWarning } = options;

      const hasKey =
        localStorage.getItem("gemini_api_key") || config.geminiApiKey;
      if (!hasKey) {
        setShowAuthWarning(true);
        return;
      }

      setLoading(true);
      try {
        const service = new GeminiService(hasKey);
        const result = await actionFn(service);
        if (onSuccess) onSuccess(result);
        return result;
      } catch (e) {
        const msg = e.message.toLowerCase();
        if (
          msg.includes("quota") ||
          msg.includes("limit") ||
          msg.includes("429")
        ) {
          const warningMsg = "API quota exceeded. Please try again later.";
          if (onWarning) onWarning(warningMsg);
          else showToast(warningMsg, "warning");
        } else {
          const errorMsg =
            "Action failed. Please check your connection and try again.";
          if (onError) onError(e);
          else showToast(errorMsg, "error");
        }
      } finally {
        setLoading(false);
      }
    },
    [setShowAuthWarning, showToast],
  );

  return { execute, loading };
}
