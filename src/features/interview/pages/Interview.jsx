import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Split from "react-split";
import Webcam from "react-webcam";
import { Layout } from "../../../shared/components/Layout";
import { Button } from "../../../shared/components/Button";
import { Card } from "../../../shared/components/Card";
import { useTheme } from "../../../shared/context/ThemeContext";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  StopCircle,
  PlayCircle,
  Loader2,
  Monitor,
  MonitorOff,
  ScanEye,
  Sparkles,
} from "lucide-react";
import { GeminiService } from "../../../shared/services/gemini";
import { OpenAIService } from "../../../shared/services/openai";
import { GrokService } from "../../../shared/services/grok";
import { SpeechService } from "../../../shared/services/speech";
import { CodeEditor } from "../../coding/components/CodeEditor";
import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import { Timer } from "../../../shared/components/Timer";
import { cn } from "../../../shared/utils/cn";
import { useToast } from "../../../shared/context/ToastContext";

export const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    resume,
    jobDesc,
    duration = 30,
    difficulty = "Mid-Level",
    focusArea = "General",
    company = null,
  } = location.state || {};
  const { theme } = useTheme();

  const [aiService, setAiService] = useState(null);
  const [speech, setSpeech] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [screenStream, setScreenStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [analyzingScreen, setAnalyzingScreen] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript"); // 'transcript', 'code', or 'whiteboard'
  const [code, setCode] = useState(
    '// Write your solution here\n\nfunction solution() {\n  return "Hello World";\n}\n\nconsole.log(solution());'
  );
  const [gettingHint, setGettingHint] = useState(false);
  const { showToast } = useToast();

  // Speech Stats
  const [speechStats, setSpeechStats] = useState({
    totalWords: 0,
    speakingTime: 0, // in seconds
    fillerWords: 0,
  });
  const speechStartTime = useRef(null);

  // Custom recording state
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const webcamRef = useRef(null);
  const mediaBlobUrlRef = useRef(null); // Store URL in ref for immediate access
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const mimeTypeRef = useRef(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const provider = localStorage.getItem("ai_provider") || "gemini";
    const apiKey = localStorage.getItem(`${provider}_api_key`);

    if (!apiKey || !resume) {
      navigate("/setup");
      return;
    }

    let service;
    if (provider === "openai") {
      service = new OpenAIService(apiKey);
    } else if (provider === "grok") {
      service = new GrokService(apiKey);
    } else {
      service = new GeminiService(apiKey);
    }

    const speechSvc = new SpeechService();

    setAiService(service);
    setSpeech(speechSvc);

    // Initialize Chat
    const context = `
      You are a professional technical interviewer conducting a ${difficulty} level interview.
      ${
        company
          ? `You are currently representing ${company.title}. Follow these internal guidelines: ${company.systemInstruction}`
          : ""
      }
      Focus Area: ${focusArea}
      Candidate Resume: ${resume}
      ${jobDesc ? `Job Description: ${jobDesc}` : ""}
      
      Instructions:
      1. Start by introducing yourself${
        company ? ` as an interviewer from ${company.title}` : ""
      } and asking the first question.
      2. Keep your responses concise (under 3 sentences) to keep the conversation flowing.
      3. Ask one question at a time.
      4. Tailor your questions to the "${difficulty}" level and "${focusArea}" focus.
      5. If the focus is "System Design", ask about architecture, scalability, and trade-offs.
      6. If the focus is "Data Structures", ask algorithmic problems.
      7. If the focus is "Behavioral", ask STAR method questions.
    `;

    service
      .startChat(context)
      .then(async () => {
        try {
          const intro = await service.sendMessage("Start the interview.");
          addMessage("ai", intro);
          speechSvc.speak(intro, () => setIsAiSpeaking(false));
          setIsAiSpeaking(true);
        } catch (error) {
          // DEBUG: console.error("AI Error:", error);
          addMessage(
            "ai",
            `Error: ${error.message}. Please check your API key.`
          );
        }
      })
      .catch((error) => {
        // DEBUG: console.error("AI Init Error:", error);
        addMessage(
          "ai",
          "Failed to initialize interview. Please check your API key and try again."
        );
      });

    return () => {
      speechSvc.cancelSpeech();
      speechSvc.stopListening();
    };
  }, [difficulty, focusArea, jobDesc, navigate, resume]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-start recording handled via onUserMedia in Webcam component
  // to ensure recording starts exactly when stream is available.

  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const handleStartListening = () => {
    setIsListening(true);
    speechStartTime.current = Date.now();
    speech.startListening(
      (text) => {
        setTranscript(text);
      },
      (error) => {
        // DEBUG: console.error("Speech Error:", error);
        setIsListening(false);
      }
    );
  };

  const handleStopListening = async () => {
    setIsListening(false);
    speech.stopListening();

    if (transcript) {
      // Update stats
      const duration = (Date.now() - speechStartTime.current) / 1000;
      const words = transcript.trim().split(/\s+/).length;
      const fillers = (
        transcript.match(/\b(um|uh|like|you know|sort of|kind of)\b/gi) || []
      ).length;

      setSpeechStats((prev) => ({
        totalWords: prev.totalWords + words,
        speakingTime: prev.speakingTime + duration,
        fillerWords: prev.fillerWords + fillers,
      }));

      addMessage("user", transcript);
      setTranscript("");

      // Send to AI
      try {
        const response = await aiService.sendMessage(transcript);
        addMessage("ai", response);
        setIsAiSpeaking(true);
        speech.speak(response, () => setIsAiSpeaking(false));
      } catch (error) {
        // DEBUG: console.error("AI Error:", error);
        addMessage("ai", `Error: ${error.message}. Please try again.`);
      }
    }
  };

  const handleCodeSubmit = async (submittedCode, output) => {
    const message = `I have written some code:\n\n\`\`\`javascript\n${submittedCode}\n\`\`\`\n\nOutput:\n${output}`;
    addMessage("user", "Submitted code for review.");

    try {
      const response = await aiService.sendMessage(message);
      addMessage("ai", response);
      setIsAiSpeaking(true);
      speech.speak(response, () => setIsAiSpeaking(false));
    } catch (error) {
      // DEBUG: console.error("AI Error:", error);
      addMessage("ai", `Error: ${error.message}. Please try again.`);
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: true,
      });
      setScreenStream(stream);
      setIsScreenSharing(true);

      // Update screen video ref if recording is active
      if (isRecording) {
        const screenVideo = document.createElement("video");
        screenVideo.srcObject = stream;
        screenVideo.muted = true; // Mute to avoid echo

        // Wait for video to be ready before setting ref
        screenVideo.onloadedmetadata = () => {
          screenVideo.play().then(() => {
            screenVideoRef.current = screenVideo;
          });
        };
      }

      // Handle stream stop (e.g. user clicks "Stop sharing" in browser UI)
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      // DEBUG: console.error("Screen Share Error:", error);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);

      // Remove screen video from canvas if recording
      if (isRecording) {
        // Don't clear the video element immediately, just set ref to null
        // The drawCanvasFrame will handle the transition
        setTimeout(() => {
          screenVideoRef.current = null;
        }, 100);
      }
    }
  };

  const analyzeScreen = async () => {
    if (!screenStream) return;

    setAnalyzingScreen(true);

    // Capture frame
    const videoTrack = screenStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);

    try {
      const bitmap = await imageCapture.grabFrame();

      // Convert bitmap to base64
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      context.drawImage(bitmap, 0, 0);
      const base64Image = canvas.toDataURL("image/jpeg").split(",")[1];

      addMessage(
        "user",
        "I'm sharing my screen. Can you analyze what you see?"
      );

      const response = await aiService.sendMessage(
        "Analyze this screen capture. Describe what you see and ask a relevant follow-up question.",
        base64Image
      );

      addMessage("ai", response);
      setIsAiSpeaking(true);
      speech.speak(response, () => setIsAiSpeaking(false));
    } catch (error) {
      // DEBUG: console.error("Screen Analysis Error:", error);
      addMessage("ai", "Failed to analyze screen. Please try again.");
    } finally {
      setAnalyzingScreen(false);
    }
  };

  const drawCanvasFrame = (canvas, ctx, webcamVideo, screenVideo = null) => {
    // Debug logging
    const hasScreen = screenVideo && screenVideo.readyState >= 2;
    const hasWebcam = webcamVideo && webcamVideo.readyState >= 2;

    // Detailed logging when things go wrong
    if (!hasWebcam && webcamVideo) {
      // DEBUG: console.warn('Webcam video exists but not ready. ReadyState:', webcamVideo.readyState, 'srcObject:', !!webcamVideo.srcObject);
    }

    if (hasScreen) {
      // Screen share mode: Draw screen + webcam PiP
      ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);

      // Draw webcam PiP (bottom-right corner)
      const pipWidth = 192;
      const pipHeight = 144;
      const pipX = canvas.width - pipWidth - 16;
      const pipY = canvas.height - pipHeight - 16;

      // Debug: draw a semi-transparent red rectangle where PiP should be
      ctx.fillStyle = "rgba(255,0,0,0.3)";
      ctx.fillRect(pipX, pipY, pipWidth, pipHeight);

      // Draw white border
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(pipX - 2, pipY - 2, pipWidth + 4, pipHeight + 4);

      // Draw webcam video
      if (hasWebcam) {
        try {
          ctx.drawImage(webcamVideo, pipX, pipY, pipWidth, pipHeight);
        } catch (err) {
          // DEBUG: console.error('Error drawing webcam to PiP:', err);
        }
      } else {
        // DEBUG: console.warn('Screen mode but no webcam available for PiP');
      }
    } else if (hasWebcam) {
      // Webcam-only mode: Draw webcam to fill canvas
      ctx.drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);
    } else {
      // No video available - draw black screen
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startRecording = async (forceScreenStream = null) => {
    try {
      // Reset state
      recordedChunksRef.current = [];

      // Get webcam stream
      const webcamStream = webcamRef.current?.stream;
      if (!webcamStream) {
        // DEBUG: console.warn('Webcam stream not ready yet for recording');
        return;
      }

      let combinedStream;

      const activeScreenStream = forceScreenStream || screenStream;

      // Always create canvas for compositing
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      canvasRef.current = canvas;

      // Create webcam video element
      const webcamVideo = document.createElement("video");
      webcamVideo.srcObject = webcamStream;
      webcamVideo.muted = true;
      webcamVideo.autoplay = true;
      webcamVideo.playsInline = true;
      // Hide the element but keep it in DOM so it can play
      webcamVideo.style.position = "absolute";
      webcamVideo.style.left = "-9999px";
      document.body.appendChild(webcamVideo);
      // Force play
      webcamVideo.play().catch((err) => {}); // DEBUG: console.error('Webcam play error (forced):', err)
      // Ensure video has non-zero dimensions
      webcamVideo.width = 192;
      webcamVideo.height = 144;

      // Ensure video starts playing
      webcamVideo.onloadedmetadata = () => {
        webcamVideo.play().catch((err) => {}); // DEBUG: console.error('Webcam play error:', err)
        // DEBUG: console.log('Webcam video metadata ready - dimensions:', webcamVideo.videoWidth, webcamVideo.videoHeight);
      };

      webcamVideoRef.current = webcamVideo;

      // Create screen video element if available
      let screenVideo = null;
      if (activeScreenStream) {
        screenVideo = document.createElement("video");
        screenVideo.srcObject = activeScreenStream;
        screenVideo.muted = true;
        screenVideo.autoplay = true;
        screenVideo.playsInline = true;
        // Hide screen video element as well
        screenVideo.style.position = "absolute";
        screenVideo.style.left = "-9999px";
        document.body.appendChild(screenVideo);
        // Force play
        screenVideo.play().catch((err) => {}); // DEBUG: console.error('Screen play error (forced):', err)

        screenVideo.onloadedmetadata = () => {
          screenVideo.play().catch((err) => {}); // DEBUG: console.error('Screen play error:', err)
          // DEBUG: console.log('Screen video metadata ready - dimensions:', screenVideo.videoWidth, screenVideo.videoHeight);
        };

        screenVideoRef.current = screenVideo;
      }

      // Animation loop to draw frames (dynamically switches based on screen availability)
      let frameCount = 0;
      const drawFrame = () => {
        if (canvasRef.current) {
          frameCount++;

          drawCanvasFrame(
            canvas,
            ctx,
            webcamVideoRef.current,
            screenVideoRef.current
          );
          animationFrameRef.current = requestAnimationFrame(drawFrame);
        }
      };

      // Start drawing after both videos are playing
      const waitForPlaying = (video) =>
        new Promise((resolve) => {
          if (video.readyState >= 3) {
            // HAVE_FUTURE_DATA, likely already playing
            resolve();
          } else {
            video.onplaying = () => {
              resolve();
            };
          }
        });
      const webcamPlaying = waitForPlaying(webcamVideo);
      const screenPlaying = screenVideo
        ? waitForPlaying(screenVideo)
        : Promise.resolve();
      Promise.all([webcamPlaying, screenPlaying]).then(() => {
        drawFrame();
      });

      // Mix audio tracks
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
      const destination = audioContext.createMediaStreamDestination();

      // Add webcam audio if exists
      const webcamAudioTracks = webcamStream.getAudioTracks();
      if (webcamAudioTracks.length > 0) {
        const webcamSource = audioContext.createMediaStreamSource(
          new MediaStream([webcamAudioTracks[0]])
        );
        webcamSource.connect(destination);
      }

      // Add screen audio if exists (this captures AI voice if shared)
      if (activeScreenStream) {
        const screenAudioTracks = activeScreenStream.getAudioTracks();
        if (screenAudioTracks.length > 0) {
          const screenSource = audioContext.createMediaStreamSource(
            new MediaStream([screenAudioTracks[0]])
          );
          screenSource.connect(destination);
        }
      }

      // Capture canvas stream and add mixed audio
      combinedStream = canvas.captureStream(30);
      destination.stream.getAudioTracks().forEach((track) => {
        combinedStream.addTrack(track);
      });

      // MimeType Fallback Logic
      const mimeType = [
        "video/mp4",
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
      ].find((type) => MediaRecorder.isTypeSupported(type));

      if (mimeType) {
        mimeTypeRef.current = mimeType;
      } else {
        throw new Error(
          "No supported MediaRecorder format found on this browser."
        );
      }

      const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType }); // Use actual mimeType
        const url = URL.createObjectURL(blob);

        // DEBUG: console.log(`Recording finished. Format: ${mimeType}, Size: ${blob.size} bytes`);

        // Store in both state and ref

        // Store in both state and ref
        setMediaBlobUrl(url);
        mediaBlobUrlRef.current = url; // Store in ref for immediate access
      };

      mediaRecorder.onstart = () => {};

      mediaRecorder.start(100); // Collect data every 100ms
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      // DEBUG: console.error('Recording Error:', error);
      showToast("Failed to start recording: " + error.message, "error");
    }
  };

  const stopRecording = () => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        // Handle onstop to ensure blob is ready
        const originalOnStop = mediaRecorderRef.current.onstop;
        mediaRecorderRef.current.onstop = () => {
          if (originalOnStop) originalOnStop();
          resolve(mediaBlobUrlRef.current);
        };

        // Stop animation frame if running
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }

        // Clear canvas ref
        canvasRef.current = null;

        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } else {
        resolve(mediaBlobUrlRef.current);
      }
    });
  };

  const handleEndInterview = async () => {
    let finalUrl = mediaBlobUrlRef.current;

    // Stop recording if active and wait for it to finish
    if (isRecording) {
      finalUrl = await stopRecording();
    }

    // Small delay to ensure state updates reach the UI
    setTimeout(() => {
      // Stop screen sharing after recording is saved
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }

      // Navigate to feedback with the URL we got from stopRecording promise
      navigate("/feedback", {
        state: {
          messages,
          mediaBlobUrl: finalUrl,
          speechStats,
          mimeType: mimeTypeRef.current,
        },
      });
    }, 500);
  };

  const getHint = async () => {
    setGettingHint(true);
    try {
      const hint = await aiService.getShadowHint(messages, {
        difficulty,
        focusArea,
        resume,
      });
      addMessage("ai", `💡 HINT: ${hint}`);
      speech.speak(hint);
      showToast("Strategy hint received!", "success");
    } catch (error) {
      // DEBUG: console.error("Hint Error:", error);
      showToast(
        "Failed to get hint. Please check your API key and try again.",
        "error"
      );
    } finally {
      setGettingHint(false);
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] p-4">
        <Split
          className="flex h-full gap-4"
          direction="horizontal"
          sizes={[40, 60]}
          minSize={300}
          gutterSize={10}
        >
          {/* Left Column: Webcam & AI Assistant */}
          <div className="flex flex-col space-y-6">
            {/* Confidence Meter AI */}
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <ScanEye size={18} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-300">
                    Kapil AI
                  </h3>
                </div>
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 h-3 rounded-full transition-all duration-500",
                        speechStats.fillerWords > 5
                          ? "bg-red-400"
                          : speechStats.totalWords > 0
                          ? "bg-emerald-400"
                          : "bg-slate-200"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-tighter">
                  <span>Fluency</span>
                  <span
                    className={cn(
                      "font-black",
                      speechStats.fillerWords < 3
                        ? "text-emerald-500"
                        : "text-amber-500"
                    )}
                  >
                    {speechStats.fillerWords > 0
                      ? `${speechStats.fillerWords} fillers`
                      : "Perfect Clarity"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.max(
                        10,
                        100 - speechStats.fillerWords * 10
                      )}%`,
                    }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      speechStats.fillerWords > 5
                        ? "bg-red-500"
                        : "bg-emerald-500"
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100/50 dark:border-slate-700">
                  <div className="text-[8px] font-black text-slate-400 dark:text-slate-300 uppercase mb-1">
                    Pace (WPM)
                  </div>
                  <div className="text-xl font-black text-slate-700 dark:text-slate-200">
                    {Math.round(
                      speechStats.totalWords /
                        (speechStats.speakingTime / 60) || 0
                    )}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100/50 dark:border-slate-700">
                  <div className="text-[8px] font-black text-slate-400 dark:text-slate-300 uppercase mb-1">
                    Focus Score
                  </div>
                  <div className="text-xl font-black text-slate-700 dark:text-slate-200">
                    {Math.max(0, 100 - speechStats.fillerWords * 5)}%
                  </div>
                </div>
              </div>
            </div>

            <Card className="flex-1 bg-black relative overflow-hidden flex items-center justify-center min-h-0">
              {isScreenSharing && screenStream ? (
                <>
                  {/* Screen Share Video */}
                  <video
                    ref={(video) => {
                      if (video && screenStream) {
                        video.srcObject = screenStream;
                      }
                    }}
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                  {/* Webcam Picture-in-Picture Overlay */}
                  {webcamEnabled && (
                    <div className="absolute bottom-4 right-4 w-36 h-24 rounded-lg overflow-hidden border-2 border-white shadow-2xl">
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        className="w-full h-full object-cover"
                        mirrored
                      />
                    </div>
                  )}
                </>
              ) : webcamEnabled ? (
                <Webcam
                  ref={webcamRef}
                  audio={true}
                  muted={true} // Mute playback to avoid echo, but record stream audio
                  className="w-full h-full object-cover"
                  mirrored
                  onUserMedia={() => {
                    // Immediate start once camera is ready
                    if (!isRecording) {
                      startRecording();
                      showToast("Session Recording Started", "success");
                    }
                  }}
                  onUserMediaError={(err) => {
                    // DEBUG: console.error("Webcam Error:", err);
                    showToast(
                      "Camera access failed. Please check permissions.",
                      "error"
                    );
                  }}
                />
              ) : (
                <div className="text-slate-500 flex flex-col items-center">
                  <VideoOff className="w-12 h-12 mb-2" />
                  <p>Camera is off</p>
                </div>
              )}

              {/* Status Overlays */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {isRecording && (
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-2" />
                    REC
                  </div>
                )}
              </div>

              {/* Transcript Overlay */}
              {transcript && (
                <div className="absolute bottom-8 left-8 right-8 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm">
                  <p className="text-lg">{transcript}</p>
                </div>
              )}
            </Card>

            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setWebcamEnabled(!webcamEnabled)}
                >
                  {webcamEnabled ? (
                    <Video className="w-4 h-4" />
                  ) : (
                    <VideoOff className="w-4 h-4" />
                  )}
                </Button>

                {/* Screen Share Controls */}
                {!isScreenSharing ? (
                  <div className="flex flex-col items-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={startScreenShare}
                    >
                      <Monitor className="w-4 h-4 mr-2" />
                      Share Screen
                    </Button>
                    <span className="text-[7px] font-black uppercase tracking-tighter text-amber-500 bg-amber-50/50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full mt-1">
                      Enable "System Audio" to record AI
                    </span>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={stopScreenShare}
                    >
                      <MonitorOff className="w-4 h-4 mr-2" />
                      Stop Sharing
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={analyzeScreen}
                      disabled={
                        analyzingScreen ||
                        localStorage.getItem("ai_provider") !== "gemini"
                      }
                      title={
                        localStorage.getItem("ai_provider") !== "gemini"
                          ? "Only available with Gemini"
                          : "Analyze Screen"
                      }
                    >
                      {analyzingScreen ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ScanEye className="w-4 h-4 mr-2" />
                      )}
                      {analyzingScreen ? "Analyzing..." : "Analyze"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {!isListening ? (
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      size="lg"
                      className="rounded-full w-16 h-16 p-0 flex items-center justify-center shadow-lg shadow-primary-500/20"
                      onClick={handleStartListening}
                      disabled={isAiSpeaking}
                    >
                      <Mic className="w-6 h-6" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="danger"
                    size="lg"
                    className="rounded-full w-16 h-16 p-0 flex items-center justify-center animate-pulse"
                    onClick={handleStopListening}
                  >
                    <StopCircle className="w-6 h-6" />
                  </Button>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-amber-200 text-amber-600 hover:bg-amber-50"
                  onClick={getHint}
                  disabled={isAiSpeaking || messages.length < 2 || gettingHint}
                >
                  {gettingHint ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : (
                    <Sparkles size={14} className="mr-2" />
                  )}
                  {gettingHint ? "Getting Hint..." : "Get Hint"}
                </Button>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300">
                  Shadow Mode
                </span>
              </div>

              <Button variant="ghost" onClick={handleEndInterview}>
                End Session
              </Button>
            </div>
            <div className="mt-4 flex justify-center">
              <Timer
                durationMinutes={duration}
                onComplete={handleEndInterview}
              />
            </div>
          </div>

          {/* Right Column: Chat History & Code Editor */}
          <div className="flex flex-col h-full overflow-hidden">
            <Card className="flex flex-col h-full overflow-hidden">
              <div className="flex border-b border-slate-100 dark:border-slate-700">
                <button
                  className={cn(
                    "flex-1 py-3 text-sm font-medium transition-colors",
                    activeTab === "transcript"
                      ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20"
                      : "text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                  onClick={() => setActiveTab("transcript")}
                >
                  Transcript
                </button>
                <button
                  className={cn(
                    "flex-1 py-3 text-sm font-medium transition-colors border-l border-slate-100 dark:border-slate-700",
                    activeTab === "code"
                      ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20"
                      : "text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                  onClick={() => setActiveTab("code")}
                >
                  Code Editor
                </button>
                <button
                  className={cn(
                    "flex-1 py-3 text-sm font-medium transition-colors border-l border-slate-100 dark:border-slate-700",
                    activeTab === "whiteboard"
                      ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/20"
                      : "text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  )}
                  onClick={() => setActiveTab("whiteboard")}
                >
                  Whiteboard
                </button>
              </div>

              <div className="flex-1 overflow-hidden relative">
                {/* Transcript View */}
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col transition-opacity duration-200",
                    activeTab === "transcript"
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  )}
                >
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "p-3 rounded-lg text-sm max-w-[85%]",
                          msg.role === "user"
                            ? "bg-primary-50 text-primary-900 ml-auto"
                            : "bg-slate-100 text-slate-800 mr-auto"
                        )}
                      >
                        <p className="font-medium text-xs mb-1 opacity-70 uppercase">
                          {msg.role === "user" ? "You" : "Interviewer"}
                        </p>
                        {msg.text}
                      </div>
                    ))}
                    {isAiSpeaking && (
                      <div className="flex items-center space-x-2 text-slate-400 text-sm p-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI is speaking...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Code Editor View */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-200 bg-[#1e1e1e]",
                    activeTab === "code"
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  )}
                >
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    onSubmit={handleCodeSubmit}
                    theme={theme}
                  />
                </div>

                {/* Whiteboard View */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-200 bg-white",
                    activeTab === "whiteboard"
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  )}
                >
                  <Whiteboard />
                </div>
              </div>
            </Card>
          </div>
        </Split>
      </div>
    </Layout>
  );
};
