import { useState } from "react";
import { Folder, FolderOpen, FileCode } from "../../../../../shared/components/Icons";

export const FileTreeItem = ({
  item,
  depth = 0,
  onOpen,
  activePath,
  onMove,
  onContextMenu,
  selectedPath,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = item.type === "folder";
  const paddingLeft = `${depth * 12 + 12}px`;
  const isSelected = selectedPath === item.path;
  const isActive =
    activePath === (item.path.startsWith("/") ? item.path : "/" + item.path);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", item.path);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    if (!isFolder) return;
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "#333";
  };

  const handleDragLeave = (e) => {
    if (!isFolder) return;
    e.currentTarget.style.backgroundColor = "";
  };

  const handleDrop = (e) => {
    if (!isFolder) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.backgroundColor = "";

    const draggedPath = e.dataTransfer.getData("text/plain");
    if (!draggedPath) return;

    if (draggedPath === item.path) return;

    onMove(draggedPath, item.path);
  };

  return (
    <div>
      <div
        className={`flex items-center py-1 pr-2 cursor-pointer text-xs select-none transition-colors border-l-2 ${
          isSelected
            ? "bg-blue-500/10 text-blue-400 border-blue-500"
            : isActive
              ? "bg-[#252526] text-blue-400 border-blue-500"
              : "text-slate-400 hover:text-slate-200 hover:bg-[#252526] border-transparent"
        }`}
        style={{ paddingLeft }}
        onClick={() => {
          onSelect(item.path);
          if (isFolder) setIsOpen(!isOpen);
          else onOpen(item.path);
        }}
        onContextMenu={(e) => onContextMenu(e, item)}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mr-1.5 opacity-70">
          {isFolder ? (
            isOpen ? (
              <FolderOpen className="w-4 h-4 text-blue-400" />
            ) : (
              <Folder className="w-4 h-4 text-blue-400" />
            )
          ) : (
            <FileCode className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <span className="truncate">{item.name}</span>
      </div>

      {isFolder && isOpen && (
        <div>
          {Object.values(item.children)
            .sort((a, b) => {
              if (a.type === b.type) return a.name.localeCompare(b.name);
              return a.type === "folder" ? -1 : 1;
            })
            .map((child) => (
              <FileTreeItem
                key={child.path}
                item={child}
                depth={depth + 1}
                onOpen={onOpen}
                activePath={activePath}
                onMove={onMove}
                onContextMenu={onContextMenu}
                selectedPath={selectedPath}
                onSelect={onSelect}
              />
            ))}
        </div>
      )}
    </div>
  );
};
