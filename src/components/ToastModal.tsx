import React from 'react';
import './ToastModal.css';

export interface ToastModalProps {
  isVisible: boolean;
  type?: 'info' | 'warning' | 'error' | 'confirm';
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  showCancel?: boolean;
}

const ToastModal: React.FC<ToastModalProps> = ({
  isVisible,
  type = 'info',
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  onClose,
  showCancel = false,
}) => {
  if (!isVisible) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'warning':
        return '#ff9500';
      case 'error':
        return '#ff3b30';
      case 'confirm':
        return '#007aff';
      default:
        return '#34c759';
    }
  };

  return (
    <div className="toast-modal-backdrop" onClick={handleBackdropClick}>
      <div className="toast-modal-container">
        <div className="toast-modal-content">
          <div className="toast-modal-header">
            <h3 className="toast-modal-title" style={{ color: getTypeColor() }}>
              {title}
            </h3>
          </div>
          
          {message && (
            <div className="toast-modal-body">
              <p className="toast-modal-message">{message}</p>
            </div>
          )}
          
          <div className="toast-modal-footer">
            {showCancel && (
              <button 
                className="toast-modal-button toast-modal-button-cancel"
                onClick={handleCancel}
              >
                {cancelText}
              </button>
            )}
            <button 
              className="toast-modal-button toast-modal-button-confirm"
              onClick={handleConfirm}
              style={{ backgroundColor: getTypeColor() }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastModal;