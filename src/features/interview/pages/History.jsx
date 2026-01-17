import { useEffect, useState, useCallback } from "react";
import { Layout } from "../../../shared/components/Layout";
import { useAuth } from "../../../shared/context/AuthContext";
import {
  getInterviews,
  getRecordingUrl,
  deleteInterview,
} from "../../../shared/services/firebase";
import {
  Calendar,
  Clock,
  PlayCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Trash,
} from "../../../shared/components/Icons";
import ReactMarkdown from "react-markdown";
import { AuthRequired } from "../../../shared/components/AuthRequired";
import { useToast } from "../../../shared/context/ToastContext";

export function History() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const loadHistory = useCallback(async () => {
    try {
      const data = await getInterviews(user.id);
      setInterviews(data);
    } catch {
      // DEBUG: console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadHistory();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, loadHistory]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id, recordingPath) => {
    if (!window.confirm("Are you sure you want to delete this interview?"))
      return;
    try {
      await deleteInterview(id, recordingPath);
      // Refresh list
      loadHistory();
    } catch {
      // DEBUG: console.error('Failed to delete interview:', err);
      showToast("Could not delete interview.", "error");
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <AuthRequired
        title="Interview History"
        message="Please sign in to view your past interviews and feedback."
      />
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Interview History
        </h1>

        {interviews.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              No interviews found yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between"
                  onClick={() => toggleExpand(interview.id)}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Calendar size={18} />
                      <span>
                        {new Date(interview.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Clock size={18} />
                      <span>
                        {new Date(interview.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  {expandedId === interview.id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(interview.id, interview.recording_path);
                    }}
                    className="ml-2 text-red-600 hover:text-red-800"
                    title="Delete interview"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                {expandedId === interview.id && (
                  <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-6">
                    {interview.recording_path && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                          <PlayCircle size={16} /> Recording
                        </h3>
                        <video
                          src={getRecordingUrl(interview.recording_path)}
                          controls
                          className="w-full rounded-lg bg-black max-h-96"
                        />
                      </div>
                    )}

                    {interview.feedback && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FileText size={16} /> AI Feedback
                        </h3>
                        <div className="prose prose-sm max-w-none bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                          <ReactMarkdown>{interview.feedback}</ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
