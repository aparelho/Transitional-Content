import React, { useEffect, useState } from 'react';
import CarrersContainer from './CarrersContainer';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Give more time for animation to properly start
      setTimeout(() => setIsAnimating(true), 100);
    } else {
      setIsAnimating(false);
      // Hide component after animation completes
      setTimeout(() => setIsVisible(false), 500);
    }
  }, [isOpen]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-40 transition-all duration-300 ease-out ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Modal Container */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-end transition-all duration-500 ease-out ${
          isAnimating 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-5'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Centered Modal Content */}
        <div 
          className="modal-scroll-container"
          style={{
            width: 'calc(100vw - 100px)',
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto'
          }}
        >

          {/* About Content (using CareersContainer for now) */}
          <div className="relative w-full">
            <CarrersContainer />
          </div>
        </div>
      </div>
    </div>
  );
}