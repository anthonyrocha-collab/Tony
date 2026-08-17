import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div
      role="region"
      aria-label={title}
      className="p-8 sm:p-12 text-center rounded-[var(--radius-main)] bg-[var(--color-surface)] border border-dashed border-[var(--color-border)] max-w-lg mx-auto my-8 space-y-4"
    >
      <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-bg)] flex items-center justify-center text-[var(--color-text-secondary)] border border-[var(--color-border)]">
        {icon || <FolderOpen className="w-7 h-7" aria-hidden="true" />}
      </div>
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold font-title text-[var(--color-text-primary)]">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="pt-2">
          <button
            type="button"
            onClick={action.onClick}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold bg-[var(--color-primary)] text-white hover:opacity-90 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] shadow-sm"
          >
            {action.label}
          </button>
        </div>
      )}
    </div>
  );
};
