import React from "react";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 shadow-sm transition-colors duration-200">
      <div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
          Hotel Management System
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {user && (
          <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 transition-colors duration-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-slate-900 dark:text-gray-100">
                {user.name}
              </div>
              <div className="text-slate-500 dark:text-gray-400 text-xs">
                {user.email}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
