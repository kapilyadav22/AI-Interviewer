import { Mail, Lock, Loader2 } from "../../../../shared/components/Icons";

export const AuthForm = ({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  loading,
  googleLoading,
  isLogin,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Email
      </label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all"
          placeholder="you@example.com"
        />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Password
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-all"
          placeholder="••••••••"
        />
      </div>
      {!isLogin && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Password must be at least 6 characters
        </p>
      )}
    </div>

    <button
      type="submit"
      disabled={loading || googleLoading}
      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading && <Loader2 className="animate-spin" size={18} />}
      {isLogin ? "Sign In" : "Create Account"}
    </button>
  </form>
);
