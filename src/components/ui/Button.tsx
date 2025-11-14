import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "premium-button font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-amber-600 hover:to-amber-700 focus:ring-blue-500 shadow-blue-500/50 hover:shadow-amber-600/60 dark:shadow-blue-500/30 dark:hover:shadow-amber-600/40",
    secondary:
      "bg-slate-200 dark:bg-gray-700 text-slate-900 dark:text-gray-100 hover:bg-slate-300 dark:hover:bg-gray-600 focus:ring-slate-500 hover:shadow-lg transition-colors duration-200",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-red-500/50 hover:shadow-red-600/60 dark:shadow-red-500/30 dark:hover:shadow-red-600/40",
    outline:
      "border-2 border-amber-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 hover:border-amber-700 dark:hover:border-blue-400 focus:ring-blue-500 bg-white dark:bg-gray-800 hover:shadow-lg transition-colors duration-200",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
