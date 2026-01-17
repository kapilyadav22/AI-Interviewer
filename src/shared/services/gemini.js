import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROMPTS } from "../constants/prompts";

const GEMINI_MODEL = "gemini-3-flash-preview";

export class GeminiService {
  constructor(apiKey) {
    const localKey = localStorage.getItem("gemini_api_key");
    const isValidKey = (key) =>
      key && key.length > 20 && key.startsWith("AIza");

    this.apiKey = isValidKey(localKey) ? localKey : apiKey;

    if (this.apiKey && isValidKey(this.apiKey)) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    } else {
      console.warn(
        "Gemini API Key is missing or malformed. AI features will be disabled.",
      );
      this.genAI = null;
    }
    this.model = null;
    this.chat = null;
  }

  _checkInit() {
    if (!this.genAI) {
      throw new Error(
        "Gemini API Key is missing. Please add it in Settings or .env.",
      );
    }
  }

  async _generateJson(prompt, model = null) {
    const targetModel =
      model ||
      this.model ||
      this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await targetModel.generateContent(prompt);
    const text = result.response.text();

    try {
      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse AI JSON response:", e);
      return null;
    }
  }

  async startChat(context) {
    this._checkInit();
    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: context,
    });

    this.chat = this.model.startChat({
      history: [],
    });
  }

  async sendMessage(message, image = null) {
    this._checkInit();
    if (!this.chat) throw new Error("Chat not initialized");

    try {
      let result;
      if (image) {
        result = await this.chat.sendMessage([
          message,
          {
            inlineData: {
              data: image,
              mimeType: "image/jpeg",
            },
          },
        ]);
      } else {
        result = await this.chat.sendMessage(message);
      }

      return result.response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to send message. Please try again.");
    }
  }

  async generateFeedback() {
    this._checkInit();
    if (!this.chat) throw new Error("No chat history to analyze");

    const rawHistory = await this.chat.getHistory();
    const formattedHistory = rawHistory
      .map((item) => `${item.role}: ${item.parts[0].text}`)
      .join("\n");

    const result = await this._generateJson(
      PROMPTS.INTERVIEW_FEEDBACK(formattedHistory),
    );
    return (
      result || {
        feedback: "Error parsing feedback",
        ratings: { technical: 0, communication: 0, problem_solving: 0 },
        topics: [],
      }
    );
  }

  async optimizeResume(resumeText, jobDescription) {
    this._checkInit();
    const result = await this._generateJson(
      PROMPTS.RESUME_OPTIMIZATION(resumeText, jobDescription),
    );
    if (!result) throw new Error("Failed to analyze resume.");
    return result;
  }

  async analyzeStarResponse(question, responseText) {
    this._checkInit();
    const result = await this._generateJson(
      PROMPTS.STAR_ANALYSIS(question, responseText),
    );
    if (!result) throw new Error("Failed to analyze response.");
    return result;
  }

  async startNegotiationChat(offerData) {
    this._checkInit();
    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: PROMPTS.NEGOTIATION_SYSTEM(offerData),
    });

    this.chat = this.model.startChat({
      history: [],
    });
  }

  async analyzeNegotiation(history) {
    this._checkInit();
    const result = await this._generateJson(
      PROMPTS.NEGOTIATION_ANALYSIS(history),
    );
    if (!result) throw new Error("Negotiation analysis failed.");
    return result;
  }

  async analyzePitch(text, role) {
    this._checkInit();
    const result = await this._generateJson(PROMPTS.PITCH_ANALYSIS(text, role));
    if (!result) throw new Error("Failed to analyze pitch.");
    return result;
  }

  async getDailyTeaser(topic = "Software Engineering") {
    this._checkInit();
    try {
      const result = await this._generateJson(PROMPTS.DAILY_TEASER(topic));
      if (!result) throw new Error("Teaser generation failed.");
      return result;
    } catch (e) {
      console.error("Daily Teaser Error:", e);
      throw new Error(
        e.message?.includes("API_KEY_INVALID")
          ? "Your Gemini API Key has expired or is invalid."
          : "Failed to fetch daily teaser.",
      );
    }
  }

  async generateReferralDrafts(data) {
    this._checkInit();
    const result = await this._generateJson(PROMPTS.REFERRAL_TEMPLATES(data));
    if (!result) throw new Error("Failed to generate referral drafts.");
    return result;
  }

  async getShadowHint(history, jobContext) {
    this._checkInit();
    const formattedHistory = history
      .map((item) => `${item.role}: ${item.text}`)
      .join("\n");

    try {
      const model = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const result = await model.generateContent(
        PROMPTS.SHADOW_HINT(formattedHistory, jobContext),
      );
      return result.response.text();
    } catch (e) {
      console.error("Shadow Hint Error:", e);
      return "Try thinking about the core trade-offs of this approach.";
    }
  }

  async analyzeArchitecture(image, focus) {
    this._checkInit();
    try {
      const model = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
      const result = await model.generateContent([
        PROMPTS.ARCHITECTURE_CRITIQUE(focus),
        {
          inlineData: {
            data: image,
            mimeType: "image/png",
          },
        },
      ]);
      return result.response.text();
    } catch (e) {
      console.error("Architecture Analysis Error:", e);
      throw new Error("Failed to analyze architecture.");
    }
  }

  async generatePostInterviewKit(role, company, context) {
    this._checkInit();
    const result = await this._generateJson(
      PROMPTS.POST_INTERVIEW_KIT(role, company, context),
    );
    if (!result) throw new Error("Could not generate Post-Interview Kit.");
    return result;
  }

  async generatePreFlightBriefing(resume, jobDesc) {
    this._checkInit();
    const result = await this._generateJson(
      PROMPTS.PRE_FLIGHT_BRIEFING(resume, jobDesc),
    );
    if (!result) throw new Error("Pre-Interview Briefing failed.");
    return result;
  }
}
