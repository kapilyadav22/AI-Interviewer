import { createPortal } from "react-dom";
import { X } from "../../../../../shared/components/Icons";

export const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-[#252526] w-full max-w-md rounded-xl shadow-2xl border border-slate-200 dark:border-[#333] p-0 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#333]">
          <h3 className="font-semibold text-slate-900 dark:text-gray-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
