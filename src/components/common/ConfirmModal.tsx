import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-full shrink-0 ${
              isDestructive ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>
          <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:outline-none min-h-[44px] cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] cursor-pointer shadow-sm ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500'
                : 'bg-[var(--color-primary)] hover:opacity-90 text-white focus-visible:ring-[var(--color-focus)]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
