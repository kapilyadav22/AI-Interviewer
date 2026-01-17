import { memo, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import {
  VideoOff,
  Maximize2,
  Minimize2,
} from "../../../../shared/components/Icons";
import { Card } from "../../../../shared/components/Card";
import { Button } from "../../../../shared/components/Button";

export const VideoSection = memo(function VideoSection({
  webcamRef,
  webcamEnabled,
  isScreenSharing,
  screenStream,
  isRecording,
  transcript,
  onRecordingStart,
  onWebcamError,
  timer,
}) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  return (
    <Card
      ref={containerRef}
      className="flex-1 bg-black relative overflow-hidden flex items-center justify-center min-h-[300px] border-0 shadow-2xl group/video"
    >
      {isScreenSharing && screenStream ? (
        // ... (Screen share block remains the same)
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={(video) => {
              if (video && screenStream) {
                video.srcObject = screenStream;
              }
            }}
            autoPlay
            className="max-w-full max-h-full w-full h-full object-contain"
          />
          {webcamEnabled && (
            <div className="absolute bottom-4 right-4 w-48 h-32 rounded-xl overflow-hidden border-2 border-primary-500 shadow-2xl z-20 transition-all duration-300 hover:scale-110 group">
              <Webcam
                ref={webcamRef}
                audio={false}
                className="w-full h-full object-cover"
                mirrored
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      ) : webcamEnabled ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <Webcam
            ref={webcamRef}
            audio={true}
            muted={true}
            className="w-full h-full object-cover"
            mirrored
            onUserMedia={() => {
              if (!isRecording) {
                onRecordingStart();
              }
            }}
            onUserMediaError={onWebcamError}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
        </div>
      ) : (
        <div className="text-slate-500 flex flex-col items-center p-8 text-center animate-pulse">
          <VideoOff className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-sm font-medium tracking-wide uppercase opacity-40">
            Camera is off
          </p>
        </div>
      )}

      <div className="absolute top-6 left-6 flex items-center gap-3 z-30">
        {isRecording && (
          <div className="bg-red-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] flex items-center shadow-lg uppercase border border-white/20">
            <div className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-ping" />
            Live Recording
          </div>
        )}
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-3 z-30 opacity-0 group-hover/video:opacity-100 transition-opacity">
        {timer}
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/40 backdrop-blur-md text-white/90 w-8 h-8 p-0 rounded-full border border-white/10 shadow-lg hover:bg-black/60 transition-all flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </Button>
      </div>

      <div className="absolute top-6 right-6 z-20 group-hover/video:hidden">
        {timer}
      </div>

      {transcript && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-black/60 backdrop-blur-xl text-white p-6 rounded-2xl border border-white/10 shadow-2xl z-40 transition-all">
          <p className="text-lg font-medium leading-relaxed text-center italic drop-shadow-sm">
            "{transcript}"
          </p>
        </div>
      )}
    </Card>
  );
});
