export class SpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.recognition = null;

    if ("webkitSpeechRecognition" in window) {
      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";
    }
    this.isListening = false;
  }

  speak(text, onEnd) {
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    const savedVoiceURI = localStorage.getItem("speech_voice_uri");
    const savedRate = localStorage.getItem("speech_rate");
    const savedPitch = localStorage.getItem("speech_pitch");

    if (savedVoiceURI) {
      const voices = this.synthesis.getVoices();
      const selectedVoice = voices.find((v) => v.voiceURI === savedVoiceURI);
      if (selectedVoice) utterance.voice = selectedVoice;
    }

    if (savedRate) utterance.rate = parseFloat(savedRate);
    if (savedPitch) utterance.pitch = parseFloat(savedPitch);

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    this.synthesis.speak(utterance);
  }

  cancelSpeech() {
    this.synthesis.cancel();
  }

  startListening(onResult, onError) {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser.");
      return;
    }

    if (this.isListening) {
      console.warn("Speech recognition already started.");
      return;
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this.isListening = false;
      onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      console.error("Speech Start Error:", err);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
