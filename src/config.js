const getRuntimeEnv = (key) => {
  if (typeof window !== "undefined" && window.env && window.env[key]) {
    return window.env[key];
  }
  return null;
};

export const config = {
  appName: "NextOffer",

  firebaseApiKey:
    getRuntimeEnv("VITE_FIREBASE_API_KEY") ||
    import.meta.env.VITE_FIREBASE_API_KEY,
  firebaseAuthDomain:
    getRuntimeEnv("VITE_FIREBASE_AUTH_DOMAIN") ||
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId:
    getRuntimeEnv("VITE_FIREBASE_PROJECT_ID") ||
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
  firebaseStorageBucket:
    getRuntimeEnv("VITE_FIREBASE_STORAGE_BUCKET") ||
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId:
    getRuntimeEnv("VITE_FIREBASE_MESSAGING_SENDER_ID") ||
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId:
    getRuntimeEnv("VITE_FIREBASE_APP_ID") ||
    import.meta.env.VITE_FIREBASE_APP_ID,

  geminiApiKey:
    getRuntimeEnv("VITE_GEMINI_API_KEY") || import.meta.env.VITE_GEMINI_API_KEY,
};
