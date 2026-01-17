import { useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, LogOut } from "../../../shared/components/Icons";

export function VideoChat({
  localStream,
  remoteStream,
  isMuted,
  toggleMute,
  isVideoOff,
  toggleVideo,
  onExit,
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="flex flex-col h-full gap-4 p-4 bg-slate-900 rounded-xl overflow-hidden">
      <div className="flex-1 relative bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-slate-400 flex flex-col items-center">
            <div className="animate-pulse w-16 h-16 bg-slate-700 rounded-full mb-4"></div>
            <p>Waiting for partner...</p>
          </div>
        )}

        <div className="absolute bottom-4 right-4 w-32 h-24 sm:w-48 sm:h-36 bg-black rounded-lg overflow-hidden border-2 border-slate-700 shadow-lg">
          {localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted 
              className="w-full h-full object-cover transform scale-x-[-1]" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-xs text-slate-400">
              Camera Off
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4 py-2">
        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-colors ${
            isMuted
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-slate-700 hover:bg-slate-600 text-white"
          }`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-colors ${
            isVideoOff
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-slate-700 hover:bg-slate-600 text-white"
          }`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>
        <button
          onClick={onExit}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
          title="Exit Room"
        >
          <LogOut size={24} />
        </button>
      </div>
    </div>
  );
}
