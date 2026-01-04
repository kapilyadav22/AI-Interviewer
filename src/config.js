/**
 * Config utility to handle environment variables.
 * Supports both build-time (Vite) and runtime (Docker/Window) variables.
 */

// Helper to check for window.env safely
const getRuntimeEnv = (key) => {
  if (typeof window !== "undefined" && window.env && window.env[key]) {
    return window.env[key];
  }
  return null;
};

export const config = {
  appName: "NextOffer.AI",
  // Supabase
  supabaseUrl:
    getRuntimeEnv("VITE_SUPABASE_URL") || import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey:
    getRuntimeEnv("VITE_SUPABASE_ANON_KEY") ||
    import.meta.env.VITE_SUPABASE_ANON_KEY,

  // Gemini
  geminiApiKey:
    getRuntimeEnv("VITE_GEMINI_API_KEY") || import.meta.env.VITE_GEMINI_API_KEY,
};
