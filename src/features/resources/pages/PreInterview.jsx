import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Layout } from "../../../shared/components/Layout";
import { ApiKeyModal } from "../../../shared/components/ApiKeyModal";
import { AuthWarningModal } from "../../../shared/components/AuthWarningModal";
import { PreInterviewInput } from "../components/PreInterview/PreInterviewInput";
import { PreInterviewResults } from "../components/PreInterview/PreInterviewResults";
import { SoundcheckModal } from "../components/PreInterview/SoundcheckModal";
import { usePreInterview } from "../hooks/usePreInterview";

export const PreInterview = () => {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const {
    gameState,
    setGameState,
    formData,
    setFormData,
    briefing,
    parsingPdf,
    isListening,
    listeningTo,
    toggleDictation,
    handleGenerate,
    isGenerating,
    handlePdfUpload,
    showSoundcheck,
    setShowSoundcheck,
    isSoundchecking,
    soundcheckTime,
    soundcheckTranscript,
    soundcheckFeedback,
    runSoundcheck,
    saveToVault,
  } = usePreInterview(setShowAuthWarning);

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

      <div className="max-w-6xl mx-auto py-12 px-4">
        <AnimatePresence mode="wait">
          {gameState === "input" ? (
            <PreInterviewInput
              formData={formData}
              setFormData={setFormData}
              isListening={isListening}
              listeningTo={listeningTo}
              onToggleDictation={toggleDictation}
              onPdfUpload={handlePdfUpload}
              parsingPdf={parsingPdf}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          ) : (
            <PreInterviewResults
              briefing={briefing}
              onReset={() => setGameState("input")}
              onSaveToVault={saveToVault}
              onShowSoundcheck={() => setShowSoundcheck(true)}
            />
          )}
        </AnimatePresence>

        <SoundcheckModal
          open={showSoundcheck}
          onClose={() => setShowSoundcheck(false)}
          isSoundchecking={isSoundchecking}
          soundcheckTime={soundcheckTime}
          soundcheckTranscript={soundcheckTranscript}
          soundcheckFeedback={soundcheckFeedback}
          runSoundcheck={runSoundcheck}
        />
      </div>
    </Layout>
  );
};
