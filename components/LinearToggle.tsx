import React from 'react';

interface LinearToggleProps {
  isLinearMode: boolean;
  onToggle: () => void;
  isAnyModalOpen: boolean;
  isAnimating?: boolean;
}

export default function LinearToggle({ isLinearMode, onToggle, isAnyModalOpen, isAnimating = false }: LinearToggleProps) {
  return (
    <div 
      className={`fixed right-8 z-[1002] transition-all duration-500 ease-out ${
        isAnyModalOpen || isLinearMode
          ? 'bottom-8' 
          : 'top-1/2 -translate-y-1/2'
      }`}
    >
      <button
        onClick={onToggle}
        disabled={isAnimating}
        className={`
          px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 
          backdrop-blur-sm border border-opacity-20
          ${isAnimating 
            ? 'bg-[rgba(128,128,128,0.6)] text-gray-400 border-gray-400 cursor-not-allowed' 
            : isLinearMode 
              ? 'bg-[rgba(0,0,0,0.8)] text-white border-white hover:bg-[rgba(0,0,0,0.9)] hover:scale-105' 
              : 'bg-[rgba(255,255,255,0.8)] text-black border-black hover:bg-[rgba(255,255,255,0.9)] hover:scale-105'
          }
          transform
        `}
        aria-label={
          isAnimating 
            ? "Animating..." 
            : isLinearMode 
              ? "Exit linear mode" 
              : "Enter linear mode"
        }
      >
        {isAnimating 
          ? 'Animating...' 
          : isLinearMode 
            ? 'Exit Linear' 
            : 'Linear'
        }
      </button>
    </div>
  );
}