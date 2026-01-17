import { memo } from "react";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { EditorLayout } from "./EditorLayout";

export const ReactWorkspace = memo(function ReactWorkspace({
  dependencies,
  getHorizontalSizes,
  showFileExplorer,
  showConsole,
  showPreview,
  showToast,
}) {
  return (
    <div className="h-full w-full overflow-hidden not-prose sandpack-custom-theme">
      <style>{`
        .sandpack-custom-theme .sp-wrapper {
          height: 100%;
        }
        .sandpack-custom-theme .sp-layout {
          height: 100%;
          border: none;
        }
        .gutter {
          background-color: #262626;
          background-repeat: no-repeat;
          background-position: 50%;
        }
        .gutter.gutter-horizontal {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZiMwF+yNzqtTcDAAAAAElFTkSuQmCC");
          cursor: col-resize;
        }
        .gutter.gutter-vertical {
          background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
          cursor: row-resize;
        }
      `}</style>
      <SandpackProvider
        template="react"
        theme="dark"
        options={{
          classes: { "sp-layout": "h-full" },
          externalResources: ["https://cdn.tailwindcss.com"],
          main: "/src/index.js",
        }}
        customSetup={{ dependencies }}
        files={{
          "/src/App.js": `import React from "react";\nimport { Layout } from "./Layout";\n\nexport default function App() {\n  return (\n    <Layout>\n      <h1 className="text-2xl font-bold text-blue-500">Hello, NextOffer!</h1>\n      <p className="mt-4 text-gray-300">Start building your component here.</p>\n      <p className="text-sm text-gray-500">Drag files to different folders!</p>\n      <button onClick={() => console.log("Hello from Console!")} className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Test Console</button>\n    </Layout>\n  );\n}`,
          "/src/Layout.js": `import React from "react";\n\nexport const Layout = ({ children }) => {\n  return (\n    <div className="p-8 font-sans bg-gray-900 min-h-screen text-white">\n      <header className="mb-8 border-b border-gray-700 pb-4">\n        <strong>React Sandbox</strong>\n      </header>\n      <main>{children}</main>\n    </div>\n  );\n}`,
          "/src/index.js": `import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\n\nconst root = ReactDOM.createRoot(document.getElementById("root"));\nroot.render(<App />);`,
        }}
        style={{ height: "100%" }}
      >
        <EditorLayout
          getHorizontalSizes={getHorizontalSizes}
          showFileExplorer={showFileExplorer}
          showConsole={showConsole}
          showPreview={showPreview}
          showToast={showToast}
        />
      </SandpackProvider>
    </div>
  );
});
