import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
  actions,
}) => {
  return (
    <div
      className={`premium-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm dark:shadow-gray-900/10 p-6 animate-fade-in transition-colors duration-200 ${className}`}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-gray-700">
          {title && (
            <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full mr-3"></span>
              {title}
            </h3>
          )}
          {actions && <div className="animate-fade-in">{actions}</div>}
        </div>
      )}
      <div className="animate-fade-in">{children}</div>
    </div>
  );
};
