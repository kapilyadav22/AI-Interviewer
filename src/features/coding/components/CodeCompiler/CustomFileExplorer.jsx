import { useState, useRef, useCallback } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import {
  Copy,
  Scissors,
  ClipboardPaste,
  Pencil,
  Link as LinkIcon,
  Download,
  Trash2,
} from "../../../../shared/components/Icons";
import { normalizePath, buildTree } from "../../utils/fileUtils";
import { FileTreeItem } from "./FileTreeItem";
import { ContextMenu } from "./ContextMenu";

export const CustomFileExplorer = ({
  onActionRequest,
  showToast,
  selectedPath,
  onSelect,
  onNewFile,
}) => {
  const { sandpack } = useSandpack();
  const { files, openFile, activeFile, addFile, deleteFile } = sandpack;
  const root = buildTree(files);
  const containerRef = useRef(null);

  const [contextMenu, setContextMenu] = useState(null);
  const [clipboard, setClipboard] = useState(null);

  const getUniquePath = useCallback(
    (targetPath) => {
      const normalizedTarget = normalizePath(targetPath);
      const keys = Object.keys(files);

      const exists = (p) =>
        keys.some((f) => normalizePath(f) === normalizePath(p));

      if (!exists(normalizedTarget)) return normalizedTarget;

      const lastSlash = normalizedTarget.lastIndexOf("/");
      const dir = normalizedTarget.substring(0, lastSlash);
      const name = normalizedTarget.substring(lastSlash + 1);

      const lastDot = name.lastIndexOf(".");
      let base, ext;
      if (lastDot !== -1 && lastDot > 0) {
        base = name.substring(0, lastDot);
        ext = name.substring(lastDot);
      } else {
        base = name;
        ext = "";
      }

      let counter = 1;
      let newPath = normalizedTarget;
      while (exists(newPath)) {
        const suffix = counter === 1 ? " (copy)" : ` (copy ${counter})`;
        newPath = normalizePath(`${dir}/${base}${suffix}${ext}`);
        counter++;
      }
      return newPath;
    },
    [files],
  );

  const handleMove = useCallback(
    (sourcePath, targetFolder, deleteSource = true) => {
      const src = normalizePath(sourcePath);
      const targetDir = normalizePath(targetFolder);

      const filename = src.split("/").pop();
      let newPath = normalizePath(`${targetDir}/${filename}`);

      // If we're copying (not moving) to the same directory or a child, we need a unique name
      if (!deleteSource || src === newPath) {
        newPath = getUniquePath(newPath);
      }

      // Prevent moving a folder into itself
      if (newPath.startsWith(src + "/")) {
        showToast("Cannot move a folder into itself", "error");
        return;
      }

      // Check if source is a folder
      const sourceFiles = Object.keys(files).filter(
        (f) =>
          normalizePath(f) === src || normalizePath(f).startsWith(src + "/"),
      );

      const isFolder = sourceFiles.some((f) =>
        normalizePath(f).startsWith(src + "/"),
      );

      if (isFolder || sourceFiles.length > 1) {
        sourceFiles.forEach((oldPath) => {
          const normOld = normalizePath(oldPath);
          const relativePart = normOld.substring(src.length);
          const destPath = newPath + relativePart;

          if (files[oldPath]) {
            addFile(normalizePath(destPath), files[oldPath].code);
            if (deleteSource) deleteFile(oldPath);
          }
        });
      } else {
        const content = files[sourcePath]?.code || files[src]?.code || "";
        addFile(normalizePath(newPath), content);
        if (deleteSource) {
          deleteFile(sourcePath);
          if (normalizePath(sourcePath) !== src) deleteFile(src);
        }
      }
    },
    [files, addFile, deleteFile, getUniquePath, showToast],
  );

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const executeAction = (action, item) => {
    const path = item.path;
    const isFolder = item.type === "folder";

    switch (action) {
      case "copy":
        setClipboard({ type: "copy", path });
        showToast("Copied to clipboard", "success");
        break;
      case "cut":
        setClipboard({ type: "cut", path });
        showToast("Cut to clipboard", "success");
        break;
      case "paste": {
        if (!clipboard) return;
        const shouldDelete = clipboard.type === "cut";
        handleMove(clipboard.path, path, shouldDelete);
        if (shouldDelete) setClipboard(null);
        showToast("Pasted successfully", "success");
        break;
      }
      case "rename":
        onActionRequest("rename", item);
        break;
      case "delete":
        onActionRequest("delete", item);
        break;
      case "download": {
        if (isFolder) {
          showToast("Folder download not supported yet", "info");
          return;
        }
        const blob = new Blob([files[path].code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.name;
        a.click();
        URL.revokeObjectURL(url);
        showToast(`Downloaded ${item.name}`, "success");
        break;
      }
      case "copyPath":
        navigator.clipboard.writeText(path);
        showToast("Path copied", "success");
        break;
      case "copyRelativePath":
        navigator.clipboard.writeText(
          path.startsWith("/") ? path.slice(1) : path,
        );
        showToast("Relative path copied", "success");
        break;
    }
  };

  const getMenuOptions = () => {
    if (!contextMenu) return [];
    const { item } = contextMenu;
    const isFolder = item.type === "folder";

    return [
      { label: "Copy", icon: Copy, action: () => executeAction("copy", item) },
      {
        label: "Cut",
        icon: Scissors,
        action: () => executeAction("cut", item),
      },
      {
        label: "Paste",
        icon: ClipboardPaste,
        action: () => executeAction("paste", item),
        disabled: !isFolder || !clipboard,
      },
      {
        label: "Rename",
        icon: Pencil,
        action: () => executeAction("rename", item),
      },
      {
        label: "Copy Path",
        icon: LinkIcon,
        action: () => executeAction("copyPath", item),
      },
      {
        label: "Copy Relative Path",
        icon: LinkIcon,
        action: () => executeAction("copyRelativePath", item),
      },
      {
        label: "Download",
        icon: Download,
        action: () => executeAction("download", item),
        disabled: isFolder,
      },
      {
        label: "Delete Permanently",
        icon: Trash2,
        action: () => executeAction("delete", item),
      },
    ];
  };

  const handleKeyDown = (e) => {
    // Check for focus in explorer
    if (document.activeElement !== containerRef.current) return;

    if (e.ctrlKey || e.metaKey) {
      if (e.key === "c") {
        e.preventDefault();
        if (selectedPath) {
          executeAction("copy", { path: selectedPath });
        }
      } else if (e.key === "v") {
        e.preventDefault();
        if (clipboard && selectedPath) {
          const isFolder = Object.keys(files).some((f) =>
            (f.startsWith("/") ? f.slice(1) : f).startsWith(
              (selectedPath.startsWith("/")
                ? selectedPath.slice(1)
                : selectedPath) + "/",
            ),
          );
          // If a file is selected, find its parent directory
          let pasteTarget = selectedPath;
          if (!isFolder) {
            const lastSlash = selectedPath.lastIndexOf("/");
            pasteTarget =
              lastSlash === 0 ? "/" : selectedPath.substring(0, lastSlash);
          }
          executeAction("paste", {
            path: normalizePath(pasteTarget),
            type: "folder",
          });
        }
      } else if (e.key === "n") {
        e.preventDefault();
        onNewFile();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="h-full select-none text-sm outline-none"
      onClick={(e) => {
        e.stopPropagation();
        setContextMenu(null);
        containerRef.current.focus();
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {Object.values(root.children)
        .sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === "folder" ? -1 : 1;
        })
        .map((item) => (
          <FileTreeItem
            key={item.path}
            item={item}
            onOpen={(path) => openFile(normalizePath(path))}
            activePath={normalizePath(activeFile)}
            onMove={handleMove}
            onContextMenu={handleContextMenu}
            selectedPath={normalizePath(selectedPath)}
            onSelect={(path) => onSelect(normalizePath(path))}
          />
        ))}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={getMenuOptions()}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
