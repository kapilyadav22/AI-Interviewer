import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = "gemini-3-flash-preview";

export class GeminiService {
  constructor(apiKey) {
    // Priority: localStorage -> passed apiKey (from env)
    const localKey = localStorage.getItem("gemini_api_key");
    const isValidKey = (key) =>
      key && key.length > 20 && key.startsWith("AIza");

    this.apiKey = isValidKey(localKey) ? localKey : apiKey;

    if (this.apiKey && isValidKey(this.apiKey)) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    } else {
      console.warn(
        "Gemini API Key is missing or malformed. AI features will be disabled."
      );
      this.genAI = null;
    }
    this.model = null;
    this.chat = null;
  }

  _checkInit() {
    if (!this.genAI) {
      throw new Error(
        "Gemini API Key is missing. Please add it in Settings or .env."
      );
    }
  }

  async startChat(context) {
    this._checkInit();
    // FIX 1: Initialize model with systemInstruction (Stronger adherence to persona)
    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: context,
    });

    this.chat = this.model.startChat({
      history: [], // Start with a clean slate, context is now in systemInstruction
    });
  }

  async sendMessage(message, image = null) {
    this._checkInit();
    if (!this.chat) throw new Error("Chat not initialized");

    try {
      let result;
      if (image) {
        // If image is provided, we send it as inline data
        // Note: sendMessage can take an array of parts
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

      const response = await result.response;
      return response.text();
    } catch (error) {
      // FIX 3: Basic Error Handling
      console.error("Gemini API Error:", error);
      throw new Error("Failed to send message. Please try again.");
    }
  }

  async generateFeedback() {
    this._checkInit();
    if (!this.chat) throw new Error("No chat history to analyze");

    // FIX 2: internalize the history retrieval
    // We get the full history from the current session
    const rawHistory = await this.chat.getHistory();

    // Format history for the prompt (convert objects to readable string)
    const formattedHistory = rawHistory
      .map((item) => `${item.role}: ${item.parts[0].text}`)
      .join("\n");

    const prompt = `
      You are a hiring manager grading an interview. 
      Analyze the following interview transcript.
      
      TRANSCRIPT:
      ${formattedHistory}
      
      OUTPUT FORMAT:
      Return a valid JSON object with the following structure:
      {
        "feedback": "Detailed textual feedback covering strengths and weaknesses...",
        "ratings": {
          "technical": <0-10>,
          "communication": <0-10>,
          "problem_solving": <0-10>
        },
        "topics": ["Topic 1", "Topic 2", "Topic 3"]
      }
      
      Ensure the JSON is valid and strictly follows this format. Do not include markdown formatting like \`\`\`json.
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      // Clean up potential markdown code blocks if the model ignores instructions
      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse JSON feedback:", e);
      // Fallback for non-JSON response
      return {
        feedback: text,
        ratings: { technical: 0, communication: 0, problem_solving: 0 },
        topics: [],
      };
    }
  }

  async optimizeResume(resumeText, jobDescription) {
    this._checkInit();
    // Initialize model if not already done (using a generic system instruction for this task)
    if (!this.model) {
      this.model = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
    }

    const prompt = `
      You are an expert ATS (Applicant Tracking System) and Resume Coach.
      Analyze the following resume against the provided job description.

      RESUME:
      ${resumeText}

      JOB DESCRIPTION:
      ${jobDescription || "General Software Engineering Role"}

      OUTPUT FORMAT:
      Return a valid JSON object with the following structure:
      {
        "score": <0-100>,
        "strengths": ["Strength 1", "Strength 2"],
        "weaknesses": ["Weakness 1", "Weakness 2"],
        "suggestions": [
          {
            "original": "Original bullet point or section",
            "improved": "Rewritten version with better action verbs and metrics",
            "reason": "Why this change improves the resume"
          }
        ]
      }

      Ensure the JSON is valid and strictly follows this format. Do not include markdown formatting.
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse Resume Optimization JSON:", e);
      throw new Error("Failed to analyze resume. Please try again.");
    }
  }

  async analyzeStarResponse(question, responseText) {
    this._checkInit();
    if (!this.model) {
      this.model = this.genAI.getGenerativeModel({ model: GEMINI_MODEL });
    }

    const prompt = `
      You are an expert Interview Coach specializing in the STAR (Situation, Task, Action, Result) method.
      Analyze the following behavioral interview response.

      QUESTION:
      ${question}

      USER RESPONSE:
      ${responseText}

      OUTPUT FORMAT:
      Return a valid JSON object with the following structure:
      {
        "star_breakdown": {
          "situation": "Analysis of the Situation part...",
          "task": "Analysis of the Task part...",
          "action": "Analysis of the Action part...",
          "result": "Analysis of the Result part..."
        },
        "overall_feedback": "General feedback on delivery and clarity...",
        "scores": {
          "structure": <0-10>,
          "impact": <0-10>,
          "clarity": <0-10>
        },
        "improved_version": "A rewritten, stronger version of this response using the STAR method."
      }

      Strictly follow the JSON format. Do not include markdown.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("STAR Analysis Error:", e);
      throw new Error("Failed to analyze response.");
    }
  }

  async startNegotiationChat(offerData) {
    this._checkInit();
    const context = `
      You are a professional Tech Recruiter / Hiring Manager named "Alex" from a respectable company.
      The candidate has just received an offer and is calling to discuss/negotiate the terms.

      OFFER DETAILS:
      Company: ${offerData.company}
      Role: ${offerData.role}
      Base Salary: $${offerData.base}
      Equity: ${offerData.equity}
      Sign-on Bonus: $${offerData.signon}

      YOUR PERSONALITY:
      - Professional, firm, but friendly. 
      - You have a limited budget but you really want to hire this candidate.
      - You can go up by max 10% on base salary if the candidate provides strong data or other offers.
      - You can be more flexible on equity or sign-on bonuses.
      - If the candidate is aggressive or entitled, you become more rigid.

      INSTRUCTIONS:
      1. Start the conversation by greeting them and asking how they feel about the offer.
      2. Respond realistically to their requests.
      3. Push back initially, asking for their reasoning or if they have competing offers.
      4. Keep responses under 3 sentences.
    `;

    this.model = this.genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: context,
    });

    this.chat = this.model.startChat({
      history: [],
    });
  }

  async analyzeNegotiation(history) {
    this._checkInit();
    const prompt = `
      Analyze the following salary negotiation conversation.
      
      CONVERSATION HISTORY:
      ${JSON.stringify(history)}

      OUTPUT FORMAT (JSON):
      {
        "outcome": "Success / Partial Success / Deadlock",
        "final_terms": "Summary of the final agreed terms (if any)",
        "scores": {
          "tone": <0-10>,
          "leverage_usage": <0-10>,
          "data_backed_reasoning": <0-10>
        },
        "feedback": "Detailed feedback on what they did well and what they could improve.",
        "negotiation_tips": ["Tip 1", "Tip 2"]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Negotiation Analysis Error:", e);
      throw new Error(
        "Negotiation analysis failed. Please check your API key."
      );
    }
  }

  async analyzePitch(text, role) {
    this._checkInit();
    const prompt = `
      Analyze the following "Tell me about yourself" elevator pitch for a ${role} position.

      PITCH:
      ${text}

      OUTPUT FORMAT (JSON):
      {
        "scores": {
          "impact": <0-10>,
          "conciseness": <0-10>,
          "hook": <0-10>
        },
        "feedback": {
          "positives": ["Point 1", "Point 2"],
          "improvements": ["Point 1", "Point 2"]
        },
        "platinum_version": "A rewritten, professional, and high-impact version of this pitch.",
        "analysis": "A brief overall analysis of why the rewrite works better."
      }
    `;

    try {
      const modelInstance = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
      });
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const cleanText = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Pitch Analysis Error:", e);
      throw new Error(
        "Failed to analyze your pitch. Please check your API key."
      );
    }
  }

  async getDailyTeaser(topic = "Software Engineering") {
    this._checkInit();
    const prompt = `
      Generative a high-quality "Daily Brain Teaser" for a ${topic}.
      It can be a logic puzzle, a tricky ${topic} snippet, or a system design mini-challenge.

      OUTPUT FORMAT (JSON):
      {
        "question": "The question or puzzle text",
        "type": "Logic / Technical / System Design",
        "difficulty": "Easy / Medium / Hard",
        "answer": "The detailed correct answer",
        "explanation": "Why this is the answer"
      }

      Make it clever and interview-relevant.
    `;

    try {
      const modelInstance = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
      });
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const cleanText = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Daily Teaser Error:", e);
      throw new Error(
        e.message?.includes("API_KEY_INVALID")
          ? "Your Gemini API Key has expired or is invalid."
          : "Failed to fetch daily teaser."
      );
    }
  }

  async generateReferralDrafts(data) {
    this._checkInit();
    const prompt = `
      Create 3 professional outreach templates for a job application.
      JOB TITLE: ${data.role}
      COMPANY: ${data.company}
      TARGET: ${data.targetType} (e.g. Recruiter, Hiring Manager, or Alumni)
      CONTEXT: ${data.context || "Cold Outreach"}

      RESUME SUMMARY/HIGHLIGHTS:
      ${data.resumeSummary}

      OUTPUT FORMAT (JSON):
      {
        "templates": [
          {
            "id": 1,
            "title": "Short & Direct (LinkedIn)",
            "body": "The template body..."
          },
          {
            "id": 2,
            "title": "Value-Driven (Email)",
            "body": "The template body..."
          },
          {
            "id": 3,
            "title": "Casual Connection",
            "body": "The template body..."
          }
        ]
      }

      Keep them authentic, concise, and focused on how the candidate's skills benefit the company.
    `;

    try {
      const modelInstance = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
      });
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const cleanText = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Referral Error:", e);
      throw new Error(
        "Failed to generate referral drafts. Please check your API key."
      );
    }
  }

  async getShadowHint(history, jobContext) {
    this._checkInit();
    const formattedHistory = history
      .map((item) => `${item.role}: ${item.text}`)
      .join("\n");

    const prompt = `
      You are an "Interview Shadows" assistant. The candidate is stuck during a mock interview.
      
      INTERVIEW CONTEXT:
      ${JSON.stringify(jobContext)}

      CONVERSATION SO FAR:
      ${formattedHistory}

      TASK:
      Provide a subtle, Socratic hint. Do NOT give the answer. 
      Help them think in the right direction (e.g. "Think about the space complexity here" or "How would you handle a sudden spike in traffic?").
      Keep it under 15 words.
    `;

    try {
      const modelInstance = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
      });
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (e) {
      console.error("Shadow Hint Error:", e);
      return "Try thinking about the core trade-offs of this approach.";
    }
  }

  async analyzeArchitecture(image, focus) {
    this._checkInit();
    const prompt = `
      Analyze this system design diagram. 
      FOCUS: ${focus || "General Scalability & Reliability"}

      Identify:
      1. Single Points of Failure (SPOF)
      2. Potential Bottlenecks
      3. Suggested improvements for high availability
      4. Clarifying questions for the architect

      Provide your critique in concise bullet points with short explanations.
    `;

    try {
      const modelInstance = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
      });
      const result = await modelInstance.generateContent([
        prompt,
        {
          inlineData: {
            data: image,
            mimeType: "image/png",
          },
        },
      ]);
      const response = await result.response;
      return response.text();
    } catch (e) {
      console.error("Architecture Analysis Error:", e);
      throw new Error(
        "Failed to analyze architecture. Please check your API key and connection."
      );
    }
  }

  async generateSurvivalKit(role, company, context) {
    this._checkInit();
    const prompt = `
      You are an interview strategy expert. Generate a "Survival Kit" for a candidate.

      ROLE: ${role}
      COMPANY: ${company}
      INTERVIEW CONTEXT: ${context || "General"}

      Provide the response in raw JSON format:
      {
        "reverseQuestions": [
          { "question": "...", "why": "..." },
          { "question": "...", "why": "..." },
          { "question": "...", "why": "..." }
        ],
        "thankYouDraft": "...",
        "talkingPoints": ["...", "...", "..."]
      }

      The reverseQuestions should be high-impact, non-generic (e.g. asking about tech debt, team culture, or specific company news).
      The thankYouDraft should be professional, placeholder-ready [INTERVIEWER NAME], and mention the role.
      The talkingPoints should be 3 unique value propositions for this role.
    `;

    try {
      const modelInstance = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
      });
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const cleanText = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Survival Kit Error:", e);
      throw new Error(
        "Could not generate Survival Kit. Your API key might be exhausted or invalid."
      );
    }
  }

  async generatePreFlightBriefing(resume, jobDesc) {
    this._checkInit();
    const prompt = `
      You are a high-stakes interview coach. Generate a "Pre-Flight Briefing" (Cheat Sheet) for a candidate.

      RESUME: ${resume}
      JOB DESCRIPTION: ${jobDesc || "General preparation"}

      Provide the response in raw JSON format:
      {
        "starStories": [
          { "title": "...", "context": "...", "whyItFits": "..." },
          { "title": "...", "context": "...", "whyItFits": "..." },
          { "title": "...", "context": "...", "whyItFits": "..." }
        ],
        "techFocalPoints": ["...", "...", "..."],
        "whyUsNugget": "...",
        "confidenceMantra": "...",
        "hiddenGem": "..."
      }

      The starStories should be specific accomplishments from the resume that best map to the job requirements.
      The hiddenGem should be a unique fact or skill from their resume that they should "casually" bring up to stand out.
      The confidenceMantra should be a short, powerful 1-sentence affirmation personalized to their career level.
    `;

    try {
      const modelInstance = this.genAI.getGenerativeModel({
        model: GEMINI_MODEL,
      });
      const result = await modelInstance.generateContent(prompt);
      const response = await result.response;
      const cleanText = response
        .text()
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      return JSON.parse(cleanText);
    } catch (e) {
      console.error("Pre-Interview Error:", e);
      throw new Error(
        "Pre-Interview Briefing failed. Please verify your Gemini API key."
      );
    }
  }
}
