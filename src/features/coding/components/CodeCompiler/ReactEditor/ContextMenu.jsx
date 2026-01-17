import { useRef, useEffect } from "react";

export const ContextMenu = ({ x, y, options, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!options || options.length === 0) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] bg-[#252526] border border-[#454545] rounded-md shadow-xl py-1 min-w-[180px]"
      style={{ top: y, left: x }}
    >
      {options.map((opt, idx) => (
        <button
          key={idx}
          onClick={(e) => {
            e.stopPropagation();
            opt.action();
            onClose();
          }}
          className={`w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-[#094771] hover:text-white flex items-center gap-2 ${opt.disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
        >
          {opt.icon && <opt.icon className="w-3.5 h-3.5" />}
          {opt.label}
        </button>
      ))}
    </div>
  );
};
