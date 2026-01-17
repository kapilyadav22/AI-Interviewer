import { useState, useRef, useCallback } from "react";

export function useInterviewMedia({
  aiService,
  addMessage,
  setIsAiSpeaking,
  speech,
  showToast,
}) {
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [screenStream, setScreenStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [analyzingScreen, setAnalyzingScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const webcamRef = useRef(null);
  const mediaBlobUrlRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const mimeTypeRef = useRef(null);

  const drawCanvasFrame = useCallback(
    (canvas, ctx, webcamVideo, screenVideo = null) => {
      const hasScreen = screenVideo && screenVideo.readyState >= 2;
      const hasWebcam = webcamVideo && webcamVideo.readyState >= 2;

      if (hasScreen) {
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        const pipWidth = 192;
        const pipHeight = 144;
        const pipX = canvas.width - pipWidth - 16;
        const pipY = canvas.height - pipHeight - 16;

        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(pipX, pipY, pipWidth, pipHeight);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(pipX - 2, pipY - 2, pipWidth + 4, pipHeight + 4);

        if (hasWebcam) {
          try {
            ctx.drawImage(webcamVideo, pipX, pipY, pipWidth, pipHeight);
          } catch {
          }
        }
      } else if (hasWebcam) {
        ctx.drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    },
    [],
  );

  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: true,
      });
      setScreenStream(stream);
      setIsScreenSharing(true);

      if (isRecording) {
        const screenVideo = document.createElement("video");
        screenVideo.srcObject = stream;
        screenVideo.muted = true;
        screenVideo.onloadedmetadata = () => {
          screenVideo.play().then(() => {
            screenVideoRef.current = screenVideo;
          });
        };
      }

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch {
    }
  }, [isRecording]);

  const stopScreenShare = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      if (isRecording) {
        setTimeout(() => {
          screenVideoRef.current = null;
        }, 100);
      }
    }
  }, [screenStream, isRecording]);

  const analyzeScreen = useCallback(async () => {
    if (!screenStream || !aiService) return;

    setAnalyzingScreen(true);
    const videoTrack = screenStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);

    try {
      const bitmap = await imageCapture.grabFrame();
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      context.drawImage(bitmap, 0, 0);
      const base64Image = canvas.toDataURL("image/jpeg").split(",")[1];

      addMessage(
        "user",
        "I'm sharing my screen. Can you analyze what you see?",
      );

      const response = await aiService.sendMessage(
        "Analyze this screen capture. Describe what you see and ask a relevant follow-up question.",
        base64Image,
      );

      addMessage("ai", response);
      setIsAiSpeaking(true);
      speech.speak(response, () => setIsAiSpeaking(false));
    } catch {
      addMessage("ai", "Failed to analyze screen. Please try again.");
    } finally {
      setAnalyzingScreen(false);
    }
  }, [screenStream, aiService, addMessage, setIsAiSpeaking, speech]);

  const startRecording = useCallback(
    async (forceScreenStream = null) => {
      try {
        recordedChunksRef.current = [];
        const webcamStream = webcamRef.current?.stream;
        if (!webcamStream) return;

        const activeScreenStream = forceScreenStream || screenStream;

        const canvas = document.createElement("canvas");
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext("2d");
        canvasRef.current = canvas;

        const webcamVideo = document.createElement("video");
        webcamVideo.srcObject = webcamStream;
        webcamVideo.muted = true;
        webcamVideo.autoplay = true;
        webcamVideo.playsInline = true;
        webcamVideo.style.position = "absolute";
        webcamVideo.style.left = "-9999px";
        document.body.appendChild(webcamVideo);

        const playPromise = webcamVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }

        webcamVideo.onloadedmetadata = () => {
          webcamVideo.play().catch(() => {});
        };
        webcamVideoRef.current = webcamVideo;

        let screenVideo = null;
        if (activeScreenStream) {
          screenVideo = document.createElement("video");
          screenVideo.srcObject = activeScreenStream;
          screenVideo.muted = true;
          screenVideo.autoplay = true;
          screenVideo.playsInline = true;
          screenVideo.style.position = "absolute";
          screenVideo.style.left = "-9999px";
          document.body.appendChild(screenVideo);

          const screenPlayPromise = screenVideo.play();
          if (screenPlayPromise !== undefined) {
            screenPlayPromise.catch(() => {});
          }

          screenVideo.onloadedmetadata = () => {
            screenVideo.play().catch(() => {});
          };
          screenVideoRef.current = screenVideo;
        }

        const drawFrame = () => {
          if (canvasRef.current) {
            drawCanvasFrame(
              canvas,
              ctx,
              webcamVideoRef.current,
              screenVideoRef.current,
            );
            animationFrameRef.current = requestAnimationFrame(drawFrame);
          }
        };

        const waitForPlaying = (video) =>
          new Promise((resolve) => {
            if (video.readyState >= 3) {
              resolve();
            } else {
              video.onplaying = () => resolve();
            }
          });

        const webcamPlaying = waitForPlaying(webcamVideo);
        const screenPlaying = screenVideo
          ? waitForPlaying(screenVideo)
          : Promise.resolve();

        Promise.all([webcamPlaying, screenPlaying]).then(() => {
          drawFrame();
        });

        const audioContext = new (
          window.AudioContext || window.webkitAudioContext
        )();
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }
        const destination = audioContext.createMediaStreamDestination();

        const webcamAudioTracks = webcamStream.getAudioTracks();
        if (webcamAudioTracks.length > 0) {
          const webcamSource = audioContext.createMediaStreamSource(
            new MediaStream([webcamAudioTracks[0]]),
          );
          webcamSource.connect(destination);
        }

        if (activeScreenStream) {
          const screenAudioTracks = activeScreenStream.getAudioTracks();
          if (screenAudioTracks.length > 0) {
            const screenSource = audioContext.createMediaStreamSource(
              new MediaStream([screenAudioTracks[0]]),
            );
            screenSource.connect(destination);
          }
        }

        const combinedStream = canvas.captureStream(30);
        destination.stream.getAudioTracks().forEach((track) => {
          combinedStream.addTrack(track);
        });

        const mimeType = [
          "video/mp4",
          "video/webm;codecs=vp9",
          "video/webm;codecs=vp8",
          "video/webm",
        ].find((type) => MediaRecorder.isTypeSupported(type));

        if (mimeType) {
          mimeTypeRef.current = mimeType;
        } else {
          throw new Error("No supported MediaRecorder format found.");
        }

        const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          mediaBlobUrlRef.current = url;
        };

        mediaRecorder.start(100);
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      } catch (error) {
        showToast("Failed to start recording: " + error.message, "error");
      }
    },
    [screenStream, drawCanvasFrame, showToast],
  );

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        const originalOnStop = mediaRecorderRef.current.onstop;
        mediaRecorderRef.current.onstop = () => {
          if (originalOnStop) originalOnStop();
          resolve(mediaBlobUrlRef.current);
        };

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        canvasRef.current = null;
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } else {
        resolve(mediaBlobUrlRef.current);
      }
    });
  }, [isRecording]);

  return {
    webcamEnabled,
    setWebcamEnabled,
    webcamRef,
    screenStream,
    isScreenSharing,
    startScreenShare,
    stopScreenShare,
    analyzeScreen,
    analyzingScreen,
    isRecording,
    startRecording,
    stopRecording,
    mediaBlobUrlRef,
    mimeTypeRef,
  };
}
