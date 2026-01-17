import { Loader2 } from "../../../../shared/components/Icons";
import { GoogleIcon } from "./GoogleIcon";

export const SocialAuth = ({ onGoogleSignIn, loading, googleLoading }) => (
  <button
    onClick={onGoogleSignIn}
    disabled={googleLoading || loading}
    className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-3 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
  >
    {googleLoading ? (
      <Loader2 className="animate-spin" size={20} />
    ) : (
      <GoogleIcon />
    )}
    Continue with Google
  </button>
);
