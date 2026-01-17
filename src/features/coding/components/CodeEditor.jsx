import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Send, Terminal, Plus, X, FileCode, Loader2 } from "../../../shared/components/Icons";
import { Button } from "../../../shared/components/Button";
import { Maximize2, Minimize2 } from "../../../shared/components/Icons";
import * as Babel from "@babel/standalone";
import ReactDOM from "react-dom/client";
import {
  executeCode,
  LANGUAGES,
  DEFAULT_CODE,
} from "../../../shared/services/compiler";
import { cn } from "../../../shared/utils/cn";

const DEFAULT_FILES = {
  javascript: {
    "main.js": DEFAULT_CODE.javascript,
  },
  react: {
    "App.jsx":
      'function App() {\n  return (\n    <div style={{ padding: "20px", fontFamily: "Arial" }}>\n      <h1>Hello React!</h1>\n      <p>Edit this component to see changes.</p>\n    </div>\n  );\n}\n\nReactDOM.createRoot(document.getElementById("root")).render(<App />);',
    "Component.jsx":
      "function Component() {\n  return <div>New Component</div>;\n}",
  },
  python: { "main.py": DEFAULT_CODE.python },
  java: { "Main.java": DEFAULT_CODE.java },
  c: { "main.c": DEFAULT_CODE.c },
  cpp: { "main.cpp": DEFAULT_CODE.cpp },
};

export const CodeEditor = ({ onChange, onSubmit, theme = "dark" }) => {
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [files, setFiles] = useState(DEFAULT_FILES.javascript);
  const [activeFile, setActiveFile] = useState("main.js");
  const [showNewFileDialog, setShowNewFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const previewRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const currentRoot = rootRef.current;
    return () => {
      if (currentRoot) {
        currentRoot.unmount();
      }
    };
  }, []);

  useEffect(() => {
    const filesForLang = DEFAULT_FILES[language];
    setFiles(filesForLang);
    setActiveFile(Object.keys(filesForLang)[0]);
    setOutput("");
    setIsError(false);
  }, [language]);

  const handleCodeChange = (value) => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: value || "",
    }));
    onChange?.(value);
  };

  const openNewFileDialog = () => {
    setNewFileName("");
    setShowNewFileDialog(true);
  };

  const createNewFile = () => {
    if (newFileName && !files[newFileName]) {
      setFiles((prev) => ({
        ...prev,
        [newFileName]: `// ${newFileName}\n\n`,
      }));
      setActiveFile(newFileName);
      setShowNewFileDialog(false);
      setNewFileName("");
    } else if (newFileName && files[newFileName]) {
      alert("File already exists!");
    }
  };

  const deleteFile = (fileName) => {
    if (Object.keys(files).length === 1) {
      alert("Cannot delete the last file");
      return;
    }
    const newFiles = { ...files };
    delete newFiles[fileName];
    setFiles(newFiles);
    if (activeFile === fileName) {
      setActiveFile(Object.keys(newFiles)[0]);
    }
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setIsError(false);

    try {
      if (language === "react") {
        runReactCode();
      } else if (language === "javascript") {
        runJavaScript();
      } else {
        await runPistonCode();
      }
    } catch (error) {
      setOutput(error.toString());
      setIsError(true);
    } finally {
      if (language !== "react" && language !== "javascript") {
        setLoading(false);
      }
    }
  };

  const runPistonCode = async () => {
    try {
      const sourceCode = files[activeFile];
      const result = await executeCode(LANGUAGES[language], sourceCode);
      if (result.run.stderr) {
        setOutput(result.run.stderr);
        setIsError(true);
      } else {
        setOutput(result.run.stdout);
        setIsError(false);
      }
    } catch (error) {
      setOutput(error.message || "Execution failed");
      setIsError(true);
    }
  };

  const runJavaScript = () => {
    try {
      const logs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      const result = new Function(files[activeFile])();

      console.log = originalLog;

      let finalOutput = logs.join("\n");
      if (result !== undefined) {
        finalOutput += (finalOutput ? "\n" : "") + "Return: " + String(result);
      }

      setOutput(finalOutput || "Code executed successfully (no output)");
      setIsError(false);
    } catch (error) {
      setOutput(error.toString());
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const runReactCode = () => {
    try {
      const allCode = Object.entries(files)
        .map(([name, content]) => {
          const transformed = Babel.transform(content, {
            presets: ["react"],
            filename: name,
          }).code;
          return transformed;
        })
        .join("\n\n");

      if (rootRef.current) {
        rootRef.current.unmount();
      }
      if (previewRef.current) {
        previewRef.current.innerHTML = '<div id="root"></div>';
      }

      const executeCode = new Function(
        "React",
        "ReactDOM",
        "document",
        allCode,
      );

      executeCode(React, ReactDOM, {
        getElementById: () => previewRef.current.querySelector("#root"),
      });

      setOutput("React app rendered successfully");
      setIsError(false);
    } catch (error) {
      setOutput(error.toString());
      setIsError(true);
      if (previewRef.current) {
        previewRef.current.innerHTML = "";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    const allFilesCode = Object.entries(files)
      .map(([name, content]) => `// ${name}\n${content}`)
      .join("\n\n---\n\n");
    onSubmit(allFilesCode, output);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-xl overflow-hidden border shadow-2xl transition-colors duration-200",
        theme === "dark"
          ? "bg-[#1e1e1e] border-slate-700"
          : "bg-white border-slate-200",
        isFullScreen
          ? "fixed inset-0 z-50 rounded-none top-16 overflow-auto"
          : "relative",
      )}
    >
      {showNewFileDialog && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={cn(
              "p-6 rounded-lg shadow-xl border w-96",
              theme === "dark"
                ? "bg-[#2d2d2d] border-slate-600"
                : "bg-white border-slate-200",
            )}
          >
            <h3
              className={cn(
                "text-lg font-semibold mb-4",
                theme === "dark" ? "text-white" : "text-slate-900",
              )}
            >
              Create New File
            </h3>
            <input
              type="text"
              className={cn(
                "w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500",
                theme === "dark"
                  ? "bg-[#1e1e1e] text-white border-slate-600"
                  : "bg-slate-50 text-slate-900 border-slate-300",
              )}
              placeholder={
                language === "react" ? "MyComponent.jsx" : "utils.js"
              }
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") createNewFile();
                if (e.key === "Escape") setShowNewFileDialog(false);
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
                onClick={() => setShowNewFileDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={createNewFile}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 border-b relative",
          theme === "dark"
            ? "bg-[#2d2d2d] border-[#3e3e3e]"
            : "bg-slate-100 border-slate-200",
        )}
      >
        <div className="flex items-center space-x-3">
          <Terminal
            className={cn(
              "w-4 h-4",
              theme === "dark" ? "text-slate-300" : "text-slate-500",
            )}
          />
          <select
            className={cn(
              "text-sm px-2 py-1 rounded border focus:outline-none focus:border-blue-500",
              theme === "dark"
                ? "bg-[#3e3e3e] text-slate-300 border-slate-600"
                : "bg-white text-slate-700 border-slate-300",
            )}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="react">React (JSX)</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-green-600 hover:bg-green-700 text-white border-none"
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
            ) : (
              <Play className="w-3 h-3 mr-1.5" />
            )}
            {loading ? "Running..." : "Run"}
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white border-none mr-2"
            onClick={handleSubmit}
          >
            <Send className="w-3 h-3 mr-1.5" />
            Submit
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "flex items-center justify-between border-b",
          theme === "dark"
            ? "bg-[#252526] border-[#3e3e3e]"
            : "bg-slate-50 border-slate-200",
        )}
      >
        <div className="flex items-center overflow-x-auto flex-1">
          {Object.keys(files).map((fileName) => (
            <div
              key={fileName}
              className={`flex items-center px-3 py-2 text-sm cursor-pointer border-r ${
                theme === "dark" ? "border-[#3e3e3e]" : "border-slate-200"
              } ${
                activeFile === fileName
                  ? theme === "dark"
                    ? "bg-[#1e1e1e] text-white"
                    : "bg-white text-blue-600 font-medium"
                  : theme === "dark"
                    ? "text-slate-400 hover:bg-[#2d2d2d]"
                    : "text-slate-500 hover:bg-slate-100"
              }`}
              onClick={() => setActiveFile(fileName)}
            >
              <FileCode className="w-3 h-3 mr-2" />
              <span>{fileName}</span>
              {Object.keys(files).length > 1 && (
                <button
                  className="ml-2 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(fileName);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          <button
            className={cn(
              "px-3 py-2",
              theme === "dark"
                ? "text-slate-400 hover:text-white hover:bg-[#2d2d2d]"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200",
            )}
            onClick={openNewFileDialog}
            title="Add new file"
            type="button"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className={cn(
            "flex items-center px-3 py-2 transition-colors border-l",
            theme === "dark"
              ? "text-slate-400 hover:text-white hover:bg-[#2d2d2d] border-[#3e3e3e]"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-200 border-slate-200",
          )}
          title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          language={
            language === "react"
              ? "javascript"
              : language === "c" || language === "cpp"
                ? "cpp"
                : language
          }
          theme={theme === "dark" ? "vs-dark" : "light"}
          value={files[activeFile]}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      <div
        className={cn(
          "h-48 border-t flex flex-col",
          theme === "dark"
            ? "bg-[#1e1e1e] border-[#3e3e3e]"
            : "bg-slate-50 border-slate-200",
        )}
      >
        <div
          className={cn(
            "px-4 py-1 text-xs uppercase font-bold tracking-wider",
            theme === "dark"
              ? "bg-[#252526] text-slate-400"
              : "bg-slate-100 text-slate-500",
          )}
        >
          {language === "react" ? "Preview" : "Console"}
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {language === "react" ? (
            <div
              ref={previewRef}
              className="w-full h-full bg-white rounded text-slate-900 border border-slate-200"
            />
          ) : output ? (
            <pre
              className={`font-mono text-sm ${
                isError
                  ? "text-red-400"
                  : theme === "dark"
                    ? "text-slate-300"
                    : "text-slate-800"
              }`}
            >
              {output}
            </pre>
          ) : (
            <span className="text-slate-600 italic">
              Run code to see output...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
