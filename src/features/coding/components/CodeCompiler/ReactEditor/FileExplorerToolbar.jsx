import { useSandpack } from "@codesandbox/sandpack-react";
import { FilePlus, FolderPlus, Package, RotateCcw } from "../../../../../shared/components/Icons";
import { Button } from "../../../../../shared/components/Button";
import { normalizePath } from "../../../utils/fileUtils";

export const FileExplorerToolbar = ({
  onAddDependency,
  isAddingFile,
  setIsAddingFile,
  isAddingFolder,
  setIsAddingFolder,
  newItemName,
  setNewItemName,
}) => {
  const { sandpack } = useSandpack();
  const { addFile, resetAllFiles } = sandpack;

  const handleAddFile = () => {
    if (!newItemName.trim()) {
      setIsAddingFile(false);
      return;
    }
    // Add file with default content
    addFile(normalizePath(newItemName), "// New file");
    setNewItemName("");
    setIsAddingFile(false);
  };

  const handleAddFolder = () => {
    if (!newItemName.trim()) {
      setIsAddingFolder(false);
      return;
    }
    // Add folder by creating a placeholder file inside it
    const folderPath = newItemName.endsWith("/")
      ? newItemName
      : `${newItemName}/`;
    addFile(
      normalizePath(`${folderPath}README.md`),
      `# ${newItemName}\nFolder created.`,
    );
    setNewItemName("");
    setIsAddingFolder(false);
  };

  return (
    <div className="flex flex-col bg-[#1e1e1e] border-b border-[#333]">
      <div className="flex items-center gap-1 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingFile(true)}
          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-100 hover:bg-[#333]"
          title="New File"
        >
          <FilePlus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAddingFolder(true)}
          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-100 hover:bg-[#333]"
          title="New Folder"
        >
          <FolderPlus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddDependency}
          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-100 hover:bg-[#333]"
          title="Add Dependency"
        >
          <Package className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => resetAllFiles()}
          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-100 hover:bg-[#333]"
          title="Reset Files"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {(isAddingFile || isAddingFolder) && (
        <div className="px-2 pb-2">
          <input
            autoFocus
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                isAddingFile ? handleAddFile() : handleAddFolder();
              } else if (e.key === "Escape") {
                setIsAddingFile(false);
                setIsAddingFolder(false);
                setNewItemName("");
              }
            }}
            onBlur={() => {
              setIsAddingFile(false);
              setIsAddingFolder(false);
              setNewItemName("");
            }}
            placeholder={isAddingFile ? "filename.js" : "folder_name"}
            className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
};
