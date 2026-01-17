import { LogIn, UserPlus } from "../../../../shared/components/Icons";
import { config } from "../../../../config";

export const AuthHeader = ({ isLogin }) => (
  <div className="text-center">
    <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
      {isLogin ? (
        <LogIn className="w-8 h-8 text-primary-600 dark:text-primary-400" />
      ) : (
        <UserPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
      )}
    </div>
    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
      {isLogin ? "Welcome Back" : "Create Account"}
    </h2>
    <p className="mt-2 text-slate-600 dark:text-slate-400">
      {isLogin
        ? `Sign in to continue to ${config.appName}`
        : "Start your interview journey today"}
    </p>
  </div>
);
