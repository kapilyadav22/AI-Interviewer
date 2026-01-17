import { memo } from "react";
import { Tldraw } from "tldraw";

export const CollabCanvas = memo(function CollabCanvas({ setEditor }) {
  return (
    <div className="absolute inset-0 z-0 tldraw-mobile-ready">
      <Tldraw
        persistenceKey="collab-whiteboard-v2"
        onMount={(editor) => setEditor(editor)}
        inferDarkMode={true}
        autoFocus={true}
      />
    </div>
  );
});
