import { useState } from "react";
import { Layout } from "../../../shared/components/Layout";
import { Card, CardHeader, CardBody } from "../../../shared/components/Card";
import { useToast } from "../../../shared/context/ToastContext";
import { ApiKeyModal } from "../../../shared/components/ApiKeyModal";
import { AuthWarningModal } from "../../../shared/components/AuthWarningModal";

// Modular Components & Hooks
import { OptimizerInput, AnalysisResult } from "../components/ResumeOptimizer";
import { useResumeOptimizer } from "../hooks/useResumeOptimizer";

export const ResumeOptimizer = () => {
  const { showToast } = useToast();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  // Custom Hook Logic
  const {
    resumeText,
    setResumeText,
    jobDesc,
    setJobDesc,
    analysis,
    loading,
    isListening,
    listeningTo,
    toggleDictation,
    handleAnalyze,
    handlePdfUpload,
  } = useResumeOptimizer({ showToast, setShowAuthWarning });

  return (
    <Layout>
      <AuthWarningModal
        open={showAuthWarning}
        onClose={() => setShowAuthWarning(false)}
        onConfigure={() => {
          setShowAuthWarning(false);
          setShowApiKeyModal(true);
        }}
      />
      <ApiKeyModal
        open={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />

      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Resume Optimizer
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Upload your resume and a job description to get a score,
              strengths, weaknesses, and concrete bullet‑point suggestions.
            </p>
          </CardHeader>
          <CardBody className="space-y-6">
            <OptimizerInput
              resumeText={resumeText}
              setResumeText={setResumeText}
              jobDesc={jobDesc}
              setJobDesc={setJobDesc}
              loading={loading}
              isListening={isListening}
              listeningTo={listeningTo}
              toggleDictation={toggleDictation}
              handlePdfUpload={handlePdfUpload}
              handleAnalyze={handleAnalyze}
            />

            <AnalysisResult analysis={analysis} />
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};
