import { memo } from "react";
import Editor from "@monaco-editor/react";
import Split from "react-split";

export const CompilerWorkspace = memo(function CompilerWorkspace({
  language,
  code,
  setCode,
  input,
  setInput,
  output,
  error,
}) {
  return (
    <div className="h-full w-full">
      <Split
        className="flex h-full flex-col md:flex-row"
        sizes={[65, 35]}
        minSize={300}
        gutterSize={8}
        gutterAlign="center"
        direction="horizontal"
        cursor="col-resize"
      >
        <div className="h-full flex flex-col bg-white dark:bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={language === "c" || language === "cpp" ? "cpp" : language}
            value={code}
            onChange={setCode}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 15 }}
          />
        </div>
        <div className="h-full flex flex-col bg-[#1e1e1e]">
          <Split
            direction="vertical"
            sizes={[30, 70]}
            minSize={100}
            gutterSize={8}
            className="h-full flex flex-col"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#1e1e1e] text-slate-300 p-4 resize-none focus:outline-none"
              placeholder="Standard Input..."
            />
            <div className="flex-1 p-4 bg-black/20 text-slate-300 font-mono whitespace-pre-wrap">
              {output || error || "Waiting..."}
            </div>
          </Split>
        </div>
      </Split>
    </div>
  );
});
