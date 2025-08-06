import React, { useState, useEffect } from 'react';

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundColorChange: (color: string) => void;
  onParticleColorChange: (color: string) => void;
  currentBackgroundColor: string;
  currentParticleColor: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  isOpen,
  onClose,
  onBackgroundColorChange,
  onParticleColorChange,
  currentBackgroundColor,
  currentParticleColor
}) => {
  const [backgroundColor, setBackgroundColor] = useState(currentBackgroundColor);
  const [particleColor, setParticleColor] = useState(currentParticleColor);

  // Sync with prop changes
  useEffect(() => {
    setBackgroundColor(currentBackgroundColor);
  }, [currentBackgroundColor]);

  useEffect(() => {
    setParticleColor(currentParticleColor);
  }, [currentParticleColor]);

  // Helper function to convert rgb/rgba to hex
  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith('#')) return rgb;
    
    const match = rgb.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]);
      const g = parseInt(match[1]);
      const b = parseInt(match[2]);
      return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    return '#000000';
  };

  // Helper function to convert hex to rgba
  const hexToRgba = (hex: string, alpha: number = 0.8): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const handleBackgroundChange = (color: string) => {
    setBackgroundColor(color);
    onBackgroundColorChange(color);
  };

  const handleParticleChange = (color: string) => {
    setParticleColor(color);
    onParticleColorChange(color);
  };

  const presetBackgrounds = [
    'rgb(20, 20, 25)', // Original dark
    'rgb(15, 15, 20)', // Darker
    'rgb(30, 20, 40)', // Purple tint
    'rgb(20, 30, 40)', // Blue tint
    'rgb(40, 30, 20)', // Brown tint
    'rgb(25, 35, 25)', // Green tint
  ];

  const presetParticles = [
    'rgba(255, 255, 255, 0.8)', // Original white
    'rgba(100, 200, 255, 0.8)', // Light blue
    'rgba(255, 150, 255, 0.8)', // Pink
    'rgba(150, 255, 150, 0.8)', // Light green
    'rgba(255, 200, 100, 0.8)', // Orange
    'rgba(200, 150, 255, 0.8)', // Purple
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/20 z-50"
      onClick={onClose}
    >
      <div 
        className="fixed bottom-16 left-4 bg-gray-700 border border-white/20 rounded-lg p-4 shadow-2xl w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Customize Colors</h3>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          {/* Background Color */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Background Color
            </label>
            <div className="flex gap-2 mb-2">
              {presetBackgrounds.map((color, index) => (
                <button
                  key={index}
                  className="w-8 h-8 rounded border-2 border-white/20 hover:border-white/40 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handleBackgroundChange(color)}
                />
              ))}
            </div>
            <input
              type="color"
              value={rgbToHex(backgroundColor)}
              onChange={(e) => {
                const hexColor = e.target.value;
                const rgbColor = hexToRgba(hexColor, 1).replace('rgba', 'rgb').replace(', 1)', ')');
                handleBackgroundChange(rgbColor);
              }}
              className="w-full h-8 rounded border border-white/20 bg-transparent"
            />
          </div>

          {/* Particle Color */}
          <div>
            <label className="text-white text-sm font-medium mb-2 block">
              Particle Color
            </label>
            <div className="flex gap-2 mb-2">
              {presetParticles.map((color, index) => (
                <button
                  key={index}
                  className="w-8 h-8 rounded border-2 border-white/20 hover:border-white/40 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => handleParticleChange(color)}
                />
              ))}
            </div>
            <input
              type="color"
              value={rgbToHex(particleColor)}
              onChange={(e) => handleParticleChange(hexToRgba(e.target.value, 0.8))}
              className="w-full h-8 rounded border border-white/20 bg-transparent"
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/20">
          <p className="text-white/60 text-xs text-center">
            Click presets or use color picker to customize
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;