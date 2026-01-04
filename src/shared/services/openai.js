import OpenAI from 'openai';

export class OpenAIService {
  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });
    this.history = [];
  }

  async startChat(context) {
    this.history = [
      { role: "system", content: context }
    ];
  }

  async sendMessage(message) {
    this.history.push({ role: "user", content: message });

    try {
      const completion = await this.openai.chat.completions.create({
        messages: this.history,
        model: "gpt-4o-mini",
      });

      const response = completion.choices[0].message.content;
      this.history.push({ role: "assistant", content: response });
      return response;
    } catch (error) {
      console.error("OpenAI Error:", error);
      throw error;
    }
  }

  async generateFeedback(chatHistory) {
    const prompt = `
      Analyze the following interview session and provide constructive feedback.
      Highlight strengths, areas for improvement, and an overall score (0-10).
      
      Interview History:
      ${JSON.stringify(chatHistory)}
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error("OpenAI Feedback Error:", error);
      throw error;
    }
  }
}
