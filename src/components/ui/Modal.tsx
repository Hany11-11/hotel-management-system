import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="fixed inset-0 transition-all duration-300 bg-slate-900 bg-opacity-50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className="relative premium-card text-left shadow-premium-lg transform transition-all duration-300 scale-100 animate-fade-in max-w-6xl w-full bg-white dark:bg-gray-800 rounded-lg flex flex-col z-10"
        style={{ maxHeight: "90vh" }}
      >
        {/* Fixed Header */}
        <div className="bg-white dark:bg-gray-800 px-6 pt-6 pb-4 sm:px-6 sm:pt-6 sm:pb-4 flex-shrink-0 rounded-t-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-gray-100">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 focus:outline-none p-1 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 sm:px-6">
          {children}
        </div>

        {/* Fixed Footer */}
        {footer && (
          <div className="bg-gradient-to-r from-slate-50 to-stone-50 dark:from-gray-800 dark:to-gray-800 px-6 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200 dark:border-gray-700 flex-shrink-0 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
