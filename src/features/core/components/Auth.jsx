import { useAuthForm } from "../hooks/useAuthForm";
import { AlertCircle } from "../../../shared/components/Icons";
import { Layout } from "../../../shared/components/Layout";
import { AuthHeader } from "./AuthComponents/AuthHeader";
import { AuthForm } from "./AuthComponents/AuthForm";
import { SocialAuth } from "./AuthComponents/SocialAuth";

export function Auth() {
  const {
    isLogin,
    email,
    password,
    error,
    loading,
    googleLoading,
    success,
    setEmail,
    setPassword,
    handleSubmit,
    handleGoogleSignIn,
    handleToggleMode,
  } = useAuthForm();

  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg max-w-md w-full space-y-6">
          <AuthHeader isLogin={isLogin} />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {success}
            </div>
          )}

          <SocialAuth
            onGoogleSignIn={handleGoogleSignIn}
            loading={loading}
            googleLoading={googleLoading}
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">
                or continue with email
              </span>
            </div>
          </div>

          <AuthForm
            isLogin={isLogin}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onSubmit={handleSubmit}
            loading={loading}
            googleLoading={googleLoading}
          />

          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={handleToggleMode}
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
