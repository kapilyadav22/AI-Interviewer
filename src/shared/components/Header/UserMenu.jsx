import { memo } from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "../Icons";

export const UserMenu = memo(function UserMenu({ user, onSignOut }) {
  if (!user) {
    return (
      <Link
        to="/auth"
        className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-700 pl-3">
      <div className="hidden xl:block text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
        {user.displayName || user.email}
      </div>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600"
        />
      )}
      <button
        onClick={onSignOut}
        className="bg-slate-50 dark:bg-slate-800 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
        title="Sign Out"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
});
