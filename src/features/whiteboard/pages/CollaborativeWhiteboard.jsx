import { useState, useRef, useEffect, useCallback } from "react";
import { Layout } from "../../../shared/components/Layout";
import { Card, CardBody } from "../../../shared/components/Card";
import { useToast } from "../../../shared/context/ToastContext";
import "tldraw/tldraw.css";

// Modular Components & Hooks
import { CollabHeader, CollabCanvas } from "../components/CollaborativeBoard";
import { useCollaborativeBoard } from "../hooks/useCollaborativeBoard";

export const CollaborativeWhiteboard = () => {
  const { showToast } = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Custom Hook for Collaboration Logic
  const { status, roomId, setEditor, copyLink } = useCollaborativeBoard({
    showToast,
  });

  // Fullscreen Logic
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <Layout hideFooter={isFullscreen}>
      <div
        ref={containerRef}
        className={`w-full ${isFullscreen ? "fixed inset-0 z-50 bg-background h-screen" : "w-full mx-auto px-1 md:px-2 py-2 overflow-hidden"}`}
      >
        <Card
          className={`flex flex-col border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ${isFullscreen ? "h-full rounded-none border-0" : "h-[calc(100vh-5rem)] rounded-xl"}`}
        >
          <CollabHeader
            status={status}
            roomId={roomId}
            copyLink={copyLink}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />

          <CardBody className="relative flex-1 p-0 overflow-hidden bg-white dark:bg-[#1a1a1a]">
            <CollabCanvas setEditor={setEditor} />
          </CardBody>
        </Card>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
                .tldraw-mobile-ready .tl-ui-layout {
                    --tl-margin: 8px;
                }
                @media (max-width: 768px) {
                    .tldraw-mobile-ready .tl-ui-layout {
                        --tl-margin: 4px;
                    }
                    .tldraw-mobile-ready [data-testid="main.menu"] {
                        display: none;
                    }
                }
            `,
        }}
      />
    </Layout>
  );
};
