export const PROMPTS = {
  // Interview Feedback Analysis
  INTERVIEW_FEEDBACK: (history) => `
    Critique this interview transcript as a hiring manager.
    
    TRANSCRIPT:
    ${history}
    
    OUTPUT JSON:
    {
      "feedback": "Detailed strength/weakness analysis",
      "ratings": { "technical": 0-10, "communication": 0-10, "problem_solving": 0-10 },
      "topics": ["Key topics discussed"]
    }
  `,

  // Resume Optimization
  RESUME_OPTIMIZATION: (resume, jobDesc) => `
    As an ATS expert, optimize this resume for the job description.
    
    RESUME: ${resume}
    JOB DESCRIPTION: ${jobDesc}
    
    OUTPUT JSON:
    {
      "score": 0-100,
      "strengths": [],
      "weaknesses": [],
      "suggestions": [{ "original": "", "improved": "", "reason": "" }]
    }
  `,

  // STAR Method Analysis
  STAR_ANALYSIS: (question, response) => `
    Analyze this response using the STAR method (Situation, Task, Action, Result).
    
    QUESTION: ${question}
    RESPONSE: ${response}
    
    OUTPUT JSON:
    {
      "star_breakdown": { "situation": "", "task": "", "action": "", "result": "" },
      "overall_feedback": "",
      "scores": { "structure": 0-10, "impact": 0-10, "clarity": 0-10 },
      "improved_version": "A stronger, rewritten version"
    }
  `,

  // Negotiation Simulator System Instruction
  NEGOTIATION_SYSTEM: (offer) => `
    Persona: "Alex", a professional Tech Recruiter.
    Context: Negotiation for ${offer.role} at ${offer.company}.
    Base: $${offer.base}, Equity: ${offer.equity}, Sign-on: $${offer.signon}.
    
    Guidelines:
    - Firm but friendly. Budget limited.
    - Max 10% base increase possible only with strong data/competing offers.
    - Flexible on equity/sign-on.
    - Be rigid if the candidate is entitled.
    - Responses < 3 sentences. Start by greeting and asking about the offer.
  `,

  // Negotiation Outcome Analysis
  NEGOTIATION_ANALYSIS: (history) => `
    Analyze this salary negotiation.
    
    HISTORY: ${JSON.stringify(history)}
    
    OUTPUT JSON:
    {
      "outcome": "Success/Partial Success/Deadlock",
      "final_terms": "Summary of agreed terms",
      "scores": { "tone": 0-10, "leverage": 0-10, "reasoning": 0-10 },
      "feedback": "Analysis of their performance",
      "tips": []
    }
  `,

  // Elevator Pitch Analysis
  PITCH_ANALYSIS: (text, role) => `
    Critique this "Tell me about yourself" pitch for a ${role} position.
    
    PITCH: ${text}
    
    OUTPUT JSON:
    {
      "scores": { "impact": 0-10, "conciseness": 0-10, "hook": 0-10 },
      "feedback": { "positives": [], "improvements": [] },
      "platinum_version": "A high-impact rewrite",
      "analysis": "Why the rewrite is better"
    }
  `,

  // Daily Brain Teasers
  DAILY_TEASER: (topic) => `
    Generate a unique ${topic} interview brain teaser (logic, technical snippet, or system design).
    
    OUTPUT JSON:
    {
      "question": "",
      "type": "Logic/Technical/System Design",
      "difficulty": "Easy/Medium/Hard",
      "answer": "Detailed answer",
      "explanation": "Logic behind it"
    }
  `,

  // Referral Outreach Templates
  REFERRAL_TEMPLATES: (data) => `
    Create 3 outreach templates for ${data.role} at ${data.company}.
    Target: ${data.targetType}. Context: ${data.context}.
    Highlights: ${data.resumeSummary}
    
    OUTPUT JSON:
    {
      "templates": [{ "id": 1-3, "title": "", "body": "" }]
    }
  `,

  // Interview Shadow Hints
  SHADOW_HINT: (history, context) => `
    As an "Interview Shadow", provide a Socratic hint for this stuck candidate.
    CONTEXT: ${JSON.stringify(context)}
    HISTORY: ${history}
    
    Rules: Subtle hint only, NO ANSWERS, < 15 words.
  `,

  // Architecture Analysis
  ARCHITECTURE_CRITIQUE: (focus) => `
    Critique this system design diagram focusing on ${focus}.
    Identify: SPOFs, bottlenecks, scalability improvements, and clarifying questions.
    Format: Concise bullet points.
  `,

  // Post-Interview Game Kit
  POST_INTERVIEW_KIT: (role, company, context) => `
    Strategy expert: Generate a post-interview kit for ${role} at ${company} (${context}).
    
    OUTPUT JSON:
    {
      "reverseQuestions": [{ "question": "", "why": "" }],
      "thankYouDraft": "Placeholder-ready email",
      "talkingPoints": ["3 unique value props"]
    }
  `,

  // Pre-Interview Briefing
  PRE_FLIGHT_BRIEFING: (resume, jobDesc) => `
    Coach: Generate a "Cheat Sheet" based on this resume and job description.
    
    RESUME: ${resume}
    JOB DESC: ${jobDesc}
    
    OUTPUT JSON:
    {
      "starStories": [{ "title": "", "context": "", "whyItFits": "" }],
      "techFocalPoints": [],
      "whyUsNugget": "Why this company?",
      "confidenceMantra": "1-sentence affirmation",
      "hiddenGem": "Standout skill to mention"
    }
  `,
};
