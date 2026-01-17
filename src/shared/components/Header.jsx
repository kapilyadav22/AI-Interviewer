import { useState, useCallback, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, Key } from "./Icons";
import Pomodoro from "./Pomodoro";
import ApiKeyModal from "./ApiKeyModal";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { config } from "../../config";

// Modular Components
import {
  NavDropdown,
  UserMenu,
  PomodoroButton,
  MobileMenu,
  practiceItems,
  resourceItems,
  usePomodoroTimer,
} from "./Header/index";

// Desktop Navigation Links
const DesktopNavLinks = memo(function DesktopNavLinks({ user }) {
  return (
    <div className="hidden lg:flex items-center gap-2">
      {user && (
        <Link
          to="/dashboard"
          className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Dashboard
        </Link>
      )}
      <Link
        to="/resume-optimizer"
        className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        Resume Optimizer
      </Link>

      <NavDropdown title="Practice" items={practiceItems} />
      <NavDropdown title="Resources" items={resourceItems} />

      {user && (
        <>
          <Link
            to="/history"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            History
          </Link>
          <Link
            to="/settings"
            className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Settings
          </Link>
        </>
      )}
    </div>
  );
});

// Theme Toggle Button
const ThemeToggle = memo(function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="hidden md:flex items-center justify-center p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
});

// API Key Button
const ApiKeyButton = memo(function ApiKeyButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="hidden md:flex items-center gap-2 uppercase text-xs px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 font-bold tracking-wider transition-colors"
      title="Set API Key"
    >
      <Key className="w-3 h-3" />
      API Key
    </button>
  );
});

// Header Logo
const HeaderLogo = memo(function HeaderLogo() {
  return (
    <Link to="/" className="flex items-center space-x-2 shrink-0">
      <div className="p-1 rounded-lg">
        <img src="/favicon.png" alt={config.appName} className="w-8 h-8" />
      </div>
      <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block">
        {config.appName}
      </span>
    </Link>
  );
});

export const Header = () => {
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Use custom hook for pomodoro logic
  const pomodoro = usePomodoroTimer();

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate("/auth");
  }, [signOut, navigate]);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  const openApiKeyModal = useCallback(() => setShowApiKeyModal(true), []);
  const openPomodoro = useCallback(() => setShowPomodoro(true), []);

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <HeaderLogo />
        <DesktopNavLinks user={user} />

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <ApiKeyButton onClick={openApiKeyModal} />
          <PomodoroButton
            timeLeft={pomodoro.timeLeft}
            timerRunning={pomodoro.timerRunning}
            pomodoroMode={pomodoro.pomodoroMode}
            onClick={openPomodoro}
          />

          <div className="flex items-center gap-3">
            <UserMenu user={user} onSignOut={handleSignOut} />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        user={user}
        practiceItems={practiceItems}
        resourceItems={resourceItems}
        theme={theme}
        toggleTheme={toggleTheme}
        timerRunning={pomodoro.timerRunning}
        timeLeft={pomodoro.timeLeft}
        onClose={closeMobileMenu}
        onOpenApiKey={openApiKeyModal}
        onOpenPomodoro={openPomodoro}
      />

      <Pomodoro
        open={showPomodoro}
        onClose={() => setShowPomodoro(false)}
        onStop={() => {
          setShowPomodoro(false);
          pomodoro.stop();
        }}
        timeLeft={pomodoro.timeLeft}
        running={pomodoro.timerRunning}
        mode={pomodoro.pomodoroMode}
        onToggle={pomodoro.toggle}
        onReset={pomodoro.reset}
        onSwitchMode={pomodoro.switchMode}
      />
      <ApiKeyModal
        open={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
      />
    </header>
  );
};
