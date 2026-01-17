import { useState, useEffect } from "react";
import Split from "react-split";
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackPreview,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { AlertTriangle } from "../../../../../shared/components/Icons";
import { Button } from "../../../../../shared/components/Button";
import { normalizePath } from "../../../utils/fileUtils";
import { FileExplorerToolbar } from "./FileExplorerToolbar";
import { CustomFileExplorer } from "./CustomFileExplorer";
import { Modal } from "./Modal";

export const EditorLayout = ({
  getHorizontalSizes,
  showFileExplorer,
  showConsole,
  showPreview,
  showToast,
}) => {
  const { sandpack } = useSandpack();
  const { files, addFile, deleteFile } = sandpack;

  const [activeModal, setActiveModal] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [modalInput, setModalInput] = useState("");
  const [isAddingFile, setIsAddingFile] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [selectedPath, setSelectedPath] = useState(null);

  useEffect(() => {
    const keys = Object.keys(files);
    keys.forEach((key) => {
      const normalized = normalizePath(key);
      if (key !== normalized) {
        addFile(normalized, files[key].code);
        deleteFile(key);
      }
    });

    const srcFiles = keys.filter((k) => k.startsWith("/src/"));
    srcFiles.forEach((srcKey) => {
      const rootKey = srcKey.replace("/src/", "/");
      if (keys.includes(rootKey) && rootKey !== "/") {
        deleteFile(rootKey);
      }
    });
  }, [files, addFile, deleteFile]);

  const handleAddDependency = (pkgName) => {
    const packageJsonPath = "/package.json";
    let packageJson = { dependencies: {} };

    if (files[packageJsonPath]) {
      try {
        packageJson = JSON.parse(files[packageJsonPath].code);
      } catch (e) {
        console.error("Invalid package.json", e);
      }
    }

    packageJson.dependencies = {
      ...packageJson.dependencies,
      [pkgName]: "latest",
    };

    addFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  };

  const handleConfirmRename = () => {
    if (!modalItem || !modalInput) return;
    const oldPath = normalizePath(modalItem.path);
    const newName = modalInput;

    const lastSlash = oldPath.lastIndexOf("/");
    const parentPath = oldPath.substring(0, lastSlash);
    const newPath = normalizePath(`${parentPath}/${newName}`);

    const sourceFiles = Object.keys(files).filter(
      (f) =>
        normalizePath(f) === oldPath ||
        normalizePath(f).startsWith(oldPath + "/"),
    );

    const isFolder = sourceFiles.some((f) =>
      normalizePath(f).startsWith(oldPath + "/"),
    );

    if (isFolder || sourceFiles.length > 1) {
      sourceFiles.forEach((file) => {
        const normFile = normalizePath(file);
        const suffix = normFile.slice(oldPath.length);
        const dest = normalizePath(newPath + suffix);
        addFile(dest, files[file].code);
        deleteFile(file);
      });
    } else {
      addFile(newPath, files[oldPath]?.code || "");
      deleteFile(oldPath);
    }
    setActiveModal(null);
  };

  const handleConfirmDelete = () => {
    if (!modalItem) return;
    const path = normalizePath(modalItem.path);

    const sourceFiles = Object.keys(files).filter(
      (f) =>
        normalizePath(f) === path || normalizePath(f).startsWith(path + "/"),
    );

    sourceFiles.forEach((file) => deleteFile(file));
    setActiveModal(null);
  };

  return (
    <>
      <Split
        key={`${showFileExplorer}-${showConsole}-${showPreview}`} 
        className="flex h-full w-full"
        sizes={getHorizontalSizes()}
        minSize={0}
        gutterSize={8}
        snapOffset={30}
      >
        {showFileExplorer && (
          <div className="h-full flex flex-col min-w-0 border-r border-[#333]">
            <FileExplorerToolbar
              onAddDependency={() => {
                setModalInput("");
                setActiveModal("dependency");
              }}
              isAddingFile={isAddingFile}
              setIsAddingFile={setIsAddingFile}
              isAddingFolder={isAddingFolder}
              setIsAddingFolder={setIsAddingFolder}
              newItemName={newItemName}
              setNewItemName={setNewItemName}
            />
            <div className="flex-1 overflow-auto bg-[#1e1e1e] p-2">
              <CustomFileExplorer
                onActionRequest={(type, item) => {
                  setModalItem(item);
                  if (type === "rename") {
                    setModalInput(item.name);
                    setActiveModal("rename");
                  }
                  if (type === "delete") {
                    setActiveModal("delete");
                  }
                }}
                showToast={showToast}
                selectedPath={selectedPath}
                onSelect={setSelectedPath}
                onNewFile={() => setIsAddingFile(true)}
              />
            </div>
          </div>
        )}

        <div className="h-full min-w-0">
          <Split
            key={`console-${showConsole}`} 
            direction="vertical"
            sizes={showConsole ? [70, 30] : [100, 0]}
            minSize={showConsole ? 50 : 0}
            gutterSize={showConsole ? 8 : 0}
            className="h-full flex flex-col"
          >
            <SandpackCodeEditor
              style={{ height: "100%" }}
              showTabs
              closableTabs
              showInlineErrors
              showLineNumbers
            />
            <div
              className={`h-full ${showConsole ? "block" : "hidden"} min-h-0 border-t border-slate-700`}
            >
              <SandpackConsole style={{ height: "100%" }} />
            </div>
          </Split>
        </div>

        {showPreview && (
          <div className="h-full block min-w-0">
            <SandpackPreview
              style={{ height: "100%" }}
              showNavigator
              showRefreshButton
            />
          </div>
        )}
      </Split>

      <Modal
        open={activeModal === "rename"}
        title="Rename Item"
        onClose={() => setActiveModal(null)}
      >
        <input
          value={modalInput}
          onChange={(e) => setModalInput(e.target.value)}
          className="w-full bg-slate-100 dark:bg-[#333] border border-slate-300 dark:border-[#444] rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="New name..."
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleConfirmRename()}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setActiveModal(null)}
            className="text-slate-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmRename}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Rename
          </Button>
        </div>
      </Modal>

      <Modal
        open={activeModal === "delete"}
        title="Delete Item"
        onClose={() => setActiveModal(null)}
      >
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <AlertTriangle className="w-6 h-6" />
          <p className="text-slate-700 dark:text-slate-300">
            Are you sure you want to delete{" "}
            <span className="font-bold">{modalItem?.name}</span>?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setActiveModal(null)}
            className="text-slate-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </Modal>

      <Modal
        open={activeModal === "dependency"}
        title="Add NPM Dependency"
        onClose={() => setActiveModal(null)}
      >
        <p className="text-xs text-slate-500 mb-2">
          Enter package name (e.g. lodash, motion)
        </p>
        <input
          value={modalInput}
          onChange={(e) => setModalInput(e.target.value)}
          className="w-full bg-slate-100 dark:bg-[#333] border border-slate-300 dark:border-[#444] rounded px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder="Package name..."
          autoFocus
          onKeyDown={(e) =>
            e.key === "Enter" && handleAddDependency(modalInput)
          }
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => setActiveModal(null)}
            className="text-slate-500"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAddDependency(modalInput);
              setActiveModal(null);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Add Package
          </Button>
        </div>
      </Modal>
    </>
  );
};
