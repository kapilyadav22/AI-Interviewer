import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Layout } from "../../../shared/components/Layout";
import { Card, CardHeader, CardBody } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";
import { GeminiService } from "../../../shared/services/gemini";
import { OpenAIService } from "../../../shared/services/openai";
import {
  saveInterview,
  uploadRecording,
} from "../../../shared/services/supabase";
import { useAuth } from "../../../shared/context/AuthContext";
import { Download, RefreshCw, Home, Save, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "../../../shared/context/ToastContext";

export const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { messages, mediaBlobUrl, mimeType } = location.state || {};
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const generateAnalysis = async () => {
      if (!messages || messages.length === 0) {
        setAnalysis({ feedback: "No interview data found." });
        setLoading(false);
        return;
      }

      const provider = localStorage.getItem("ai_provider") || "gemini";
      const apiKey = localStorage.getItem(`${provider}_api_key`);

      let service;
      if (provider === "openai") {
        service = new OpenAIService(apiKey);
      } else {
        service = new GeminiService(apiKey);
      }

      try {
        const result = await service.generateFeedback(messages);
        // Handle both string (legacy/error) and object responses
        if (typeof result === "string") {
          setAnalysis({ feedback: result });
        } else {
          setAnalysis(result);
        }
      } catch (error) {
        // DEBUG: console.error("Feedback Error:", error);
        setAnalysis({
          feedback: `Failed to generate feedback: ${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    generateAnalysis();
  }, [messages]);

  const handleSave = async () => {
    if (!user) {
      showToast("Please log in to save your interview.", "error");
      return;
    }

    setSaving(true);
    try {
      let recordingPath = null;

      // Upload recording if available
      if (mediaBlobUrl) {
        const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
        recordingPath = await uploadRecording(user.id, blob);
      }

      // Save interview data
      await saveInterview({
        user_id: user.id,
        feedback: analysis.feedback,
        ratings: analysis.ratings,
        topics: analysis.topics,
        transcript: messages,
        recording_path: recordingPath,
        duration: 0,
      });

      showToast("Interview saved successfully!", "success");
      navigate("/history");
    } catch (error) {
      // DEBUG: console.error("Save Error:", error);
      showToast("Failed to save interview: " + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Interview Analysis
          </h1>
          <div className="space-x-4">
            <Link to="/">
              <Button variant="secondary">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            {user && (
              <Button onClick={handleSave} disabled={saving || loading}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "Saving..." : "Save to History"}
              </Button>
            )}
            <Link to="/setup">
              <Button>
                <RefreshCw className="w-4 h-4 mr-2" />
                New Interview
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Ratings Card */}
            {analysis?.ratings && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Performance Score
                  </h2>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(analysis.ratings).map(([key, value]) => (
                      <div
                        key={key}
                        className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                      >
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {value}/10
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                          {key.replace("_", " ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Communication Coach
                </h2>
              </CardHeader>
              <CardBody>
                {location.state?.speechStats ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {Math.round(
                            location.state.speechStats.totalWords /
                              (location.state.speechStats.speakingTime / 60) ||
                              0
                          )}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          Words Per Minute
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {location.state.speechStats.fillerWords}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          Filler Words
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                      <strong>Tip:</strong>
                      {Math.round(
                        location.state.speechStats.totalWords /
                          (location.state.speechStats.speakingTime / 60) || 0
                      ) > 160
                        ? " You might be speaking a bit too fast. Try to slow down to ensure clarity."
                        : " Your pacing looks good! Aim for 130-150 WPM for optimal clarity."}
                      {location.state.speechStats.fillerWords > 5 &&
                        " Try to pause silently instead of using fillers like 'um' or 'like'."}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 dark:text-slate-400 text-center py-4">
                    No speech data available from this session.
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  AI Feedback
                </h2>
              </CardHeader>
              <CardBody className="prose prose-slate dark:prose-invert max-w-none">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    <p className="text-slate-500 dark:text-slate-400">
                      Analyzing your responses...
                    </p>
                  </div>
                ) : (
                  <ReactMarkdown>{analysis?.feedback || ""}</ReactMarkdown>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Session Recording
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {mediaBlobUrl ? (
                  <>
                    <video
                      src={mediaBlobUrl}
                      controls
                      className="w-full rounded-lg bg-black"
                    />
                    <a
                      href={mediaBlobUrl}
                      download={`interview-session.${
                        mimeType && mimeType.includes("mp4") ? "mp4" : "webm"
                      }`}
                      className="block"
                    >
                      <Button variant="secondary" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                    </a>
                  </>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                    No recording available
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Transcript Summary
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages?.map((msg, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-bold text-slate-700 dark:text-slate-300 uppercase text-xs block mb-1">
                        {msg.role}
                      </span>
                      <p className="text-slate-600 dark:text-slate-300">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};
