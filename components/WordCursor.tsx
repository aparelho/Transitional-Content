import React from 'react';

interface WordCursorProps {
  words: string[];
  position: { x: number; y: number };
  highlightedWord?: string;
  hideOverNavigation?: boolean;
}

const WordCursor: React.FC<WordCursorProps> = ({ words, position, highlightedWord, hideOverNavigation = false }) => {
  if (words.length === 0 || hideOverNavigation) return null;

  const style = {
    position: 'fixed' as const,
    left: position.x + 15,
    top: position.y - 20,
    zIndex: 1001,
    pointerEvents: 'none' as const,
    transform: 'translate(0, -100%)',
  };

  return (
    <div style={style}>
      <div className="flex flex-row gap-1 items-start justify-start">
        {words.map((word, index) => {
          const isHighlighted = word === highlightedWord;
          
          // All word containers use consistent styling now with smooth transitions
          const containerClass = isHighlighted 
            ? "bg-[#a55e3b] box-border content-stretch flex flex-col gap-1 items-center justify-center p-[6px] relative rounded shrink-0 transition-all duration-200 ease-in-out transform hover:scale-105"
            : "backdrop-blur-[2px] backdrop-filter bg-[rgba(255,85,0,0.33)] box-border content-stretch flex flex-col gap-1 items-center justify-center p-[6px] relative rounded shrink-0 transition-all duration-200 ease-in-out";
          
          return (
            <div
              key={`${word}-${index}`}
              className={containerClass}
            >
              <div className="flex flex-col justify-end leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[8px] text-left text-nowrap tracking-[-0.21px]" style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}>
                <p className="adjustLetterSpacing block leading-[12px] whitespace-pre">
                  {word}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WordCursor;