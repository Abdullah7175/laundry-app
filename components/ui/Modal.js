import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer,
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  const modalRef = useRef(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset'; // Restore body scroll
    };
  }, [isOpen, onClose]);

  // Handle outside click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Use createPortal for better stacking
  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true" 
      onClick={handleOverlayClick}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        
        {/* Modal positioning trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* Modal */}
        <div 
          ref={modalRef}
          className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* Modal header */}
          {(title || showCloseButton) && (
            <div className="px-4 py-3 sm:px-6 border-b border-gray-200 flex justify-between items-center">
              {title && <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">{title}</h3>}
              {showCloseButton && (
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Modal body */}
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {children}
          </div>
          
          {/* Modal footer */}
          {footer && (
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse bg-gray-50 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Use portal to attach to body
  return typeof window !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default Modal;
