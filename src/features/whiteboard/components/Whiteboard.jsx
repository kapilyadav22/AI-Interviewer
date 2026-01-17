import { useState } from "react";
import { Tldraw, useEditor } from "tldraw";
import { useToast } from "../../../shared/context/ToastContext";
import { useGeminiAction } from "../../../shared/hooks/useGeminiAction";
import {
  Eraser,
  Loader2,
  BrainCircuit,
  Bookmark,
} from "../../../shared/components/Icons";
import "tldraw/tldraw.css";

import { ApiKeyModal } from "../../../shared/components/ApiKeyModal";
import { AuthWarningModal } from "../../../shared/components/AuthWarningModal";

function WhiteboardControls({
  onCritique,
  critique,
  setCritique,
  showCritique,
  setShowCritique,
}) {
  const editor = useEditor();
  const { showToast } = useToast();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const { execute, loading } = useGeminiAction(setShowAuthWarning);

  const handleCritique = async () => {
    if (!editor) return;

    const shapeIds = Array.from(editor.getCurrentPageShapeIds());
    if (shapeIds.length === 0) {
      onCritique("Please draw a system architecture first!");
      return;
    }

    setShowCritique(true);
    setCritique("");

    await execute(
      async (service) => {
        // Get the SVG of the current shapes
        const svg = await editor.getSvg(shapeIds, {
          padding: 32,
          background: true,
        });

        if (!svg) throw new Error("Could not generate SVG");

        // Convert SVG to Data URL via Canvas
        const svgString = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);

        return new Promise((resolve, reject) => {
          img.onload = async () => {
            canvas.width = img.width * 2;
            canvas.height = img.height * 2;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0);

            const base64Image = canvas.toDataURL("image/png").split(",")[1];
            URL.revokeObjectURL(url);

            try {
              const response = await service.analyzeArchitecture(
                base64Image,
                "System Design Scalability & Reliability",
              );
              onCritique(response);
              resolve(response);
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Failed to load image"));
          };
          img.src = url;
        });
      },
      {
        onError: () => {
          onCritique("Failed to analyze whiteboard.");
        },
      },
    );
  };

  return (
    <>
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
      <div className="absolute top-4 right-4 z-[200] flex gap-2 pointer-events-auto">
        <button
          onClick={() => {
            editor.selectAll();
            editor.deleteShapes(editor.getSelectedShapeIds());
          }}
          className="bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 flex items-center gap-2 transition-all"
          title="Clear Board"
        >
          <Eraser size={18} />
          <span className="hidden sm:inline">Clear</span>
        </button>
        <button
          onClick={handleCritique}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <BrainCircuit size={18} />
          )}
          <span>{loading ? "Analyzing..." : "Get AI Critique"}</span>
        </button>
      </div>

      {critique && !loading && (
        <div className="absolute top-20 right-4 z-[200] pointer-events-auto">
          <button
            onClick={() => {
              const vault = JSON.parse(
                localStorage.getItem("nextoffer_ai_vault") || "[]",
              );
              const newItem = {
                id: Date.now(),
                type: "Architecture",
                title: `Architecture Audit ${new Date().toLocaleTimeString()}`,
                content: critique,
                date: new Date().toISOString(),
              };
              localStorage.setItem(
                "nextoffer_ai_vault",
                JSON.stringify([newItem, ...vault]),
              );
              showToast("Architecture Audit saved to Vault!", "success");
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all"
          >
            <Bookmark size={18} />
            <span>Save Audit</span>
          </button>
        </div>
      )}

      {showCritique && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-slate-700 shadow-lg p-6 max-h-[40vh] overflow-y-auto z-[200] transition-transform duration-300 ease-in-out pointer-events-auto">
          <div className="max-w-4xl mx-auto relative">
            <button
              onClick={() => setShowCritique(false)}
              className="absolute top-0 right-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
              <BrainCircuit
                className="text-indigo-600 dark:text-indigo-400"
                size={20}
              />
              AI Architect Feedback
            </h3>
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 dark:prose-invert">
                <ReactMarkdown>{critique}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

import ReactMarkdown from "react-markdown";

export function Whiteboard() {
  const [critique, setCritique] = useState("");
  const [showCritique, setShowCritique] = useState(false);

  return (
    <div className="w-full h-full relative">
      <Tldraw persistenceKey="mockmate-whiteboard">
        <WhiteboardControls
          onCritique={(text) => {
            setCritique(text);
            setShowCritique(true);
          }}
          critique={critique}
          setCritique={setCritique}
          showCritique={showCritique}
          setShowCritique={setShowCritique}
        />
      </Tldraw>
    </div>
  );
}
