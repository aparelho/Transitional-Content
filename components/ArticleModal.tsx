import React, { useEffect, useState } from 'react';
import { useIsMobile } from './ui/use-mobile';

interface Article {
  id: number;
  title: string;
  image: string;
  category: string;
}

interface ModalType {
  id: number;
  title: string;
  theme: string;
  categories: string[];
  color: string;
}

interface ArticleModalProps {
  articles: Article[];
  position: { x: number; y: number };
  modalType: ModalType;
  onClose: () => void;
  isClosing: boolean;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ 
  articles, 
  position: _position, 
  modalType, 
  onClose: _onClose, 
  isClosing 
}) => {
  const [animationState, setAnimationState] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isClosing) {
      setAnimationState('exiting');
    } else {
      // Start entering animation
      const timer = setTimeout(() => setAnimationState('visible'), 50);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  if (articles.length === 0) return null;

  // Position modal - horizontally centered on viewport without transforms (helps Chrome backdrop-filter)
  const modalStyle = {
    position: 'fixed' as const,
    left: 0,
    right: 0,
    bottom: '0px',
    margin: '0 auto',
    width: isMobile ? 'calc(100vw - 32px)' : '528px',
    maxWidth: isMobile ? 'none' : '528px',
    maxHeight: isMobile ? 'calc(100vh - 32px)' : 'calc(100vh - 40px)',
    zIndex: 40 as const, // Behind navigation search (z-50)
  };

  // per-card animation now handled inline for stricter control

  return (
    <div style={modalStyle}>
      <div className="flex flex-col h-full">


        {/* Scrollable Article Cards Container */}
        <div className="flex-1 modal-scroll-container pb-6 pr-2 pt-6">
          <div className="flex flex-col gap-[13px]">
            {/* All Article Cards */}
            {articles.map((article, index) => {
              const cardIndex = index; // No offset needed since we removed the header
              const opacity = index === 0 ? 1 : index === 1 ? 0.8 : index < 4 ? 0.6 : 0.4; // Gradual fade effect
              
              return (
                <div
                  key={article.id}
                  className="bg-[rgba(0,0,0,0.3)] bg-clip-padding rounded-[26px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.18)] w-full relative overflow-hidden"
                  style={{
                    isolation: 'isolate' as const,
                    transform: animationState === 'visible' ? 'translateY(0)' : 'translateY(40px)',
                    transition: `transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${cardIndex * 120}ms`,
                  }}
                >
                  {/* Dedicated blur layer to avoid transform/backdrop quirks in Chrome */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      WebkitBackdropFilter: 'blur(12px)',
                      backdropFilter: 'blur(12px)',
                      opacity: 1,
                    }}
                  />
                  <div
                    style={{
                      opacity: animationState === 'visible' ? opacity : 0,
                      transition: `opacity 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${cardIndex * 120}ms`,
                    }}
                  >
                    {index === 0 ? (
                      // Featured article with image (no text overlays)
                      <div className="relative h-[352px]">
                        {article.image && (
                          <img 
                            src={article.image}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover rounded-[26px]"
                          />
                        )}
                      </div>
                    ) : (
                      // Regular text cards with auto-height
                      <div className="relative min-h-[161px] pb-6">
                        {/* Title section with auto-height */}
                        <div className="pt-[26px] px-[31px] pb-4">
                          <div className="font-['Plain:Regular',_sans-serif] leading-[29px] text-white text-[26px] text-left">
                            <p className="block leading-[29px] whitespace-normal">
                              {article.title}
                            </p>
                          </div>
                        </div>
                        
                        {/* Tags section with 16px spacing from title */}
                        <div className="px-[31px]">
                          <div className="font-['Plain:Regular',_sans-serif] text-white text-[18px] text-left">
                            <p className="block leading-[20px]">
                              {article.category} • {modalType.theme}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Collection Summary Card */}
            <div
              className="bg-[rgba(0,0,0,0.3)] bg-clip-padding rounded-[26px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.18)] w-full relative h-[161px] overflow-hidden"
              style={{
                isolation: 'isolate' as const,
                transform: animationState === 'visible' ? 'translateY(0)' : 'translateY(40px)',
                transition: `transform 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${articles.length * 120}ms`,
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  WebkitBackdropFilter: 'blur(12px)',
                  backdropFilter: 'blur(12px)',
                  opacity: 1,
                }}
              />
              <div
                style={{
                  opacity: animationState === 'visible' ? 0.3 : 0,
                  transition: `opacity 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${articles.length * 120}ms`,
                }}
              >
                <div className="absolute h-[68px] left-0 top-[26px] w-[488px] overflow-hidden">
                  <div className="absolute font-['Plain:Regular',_sans-serif] leading-[29px] left-[31px] not-italic text-white text-[26px] text-left top-0">
                    <p className="block mb-0 leading-[29px]">Complete Collection</p>
                    <p className="block leading-[29px]">{articles.length} total articles</p>
                  </div>
                </div>
                <div className="absolute h-[47px] left-[10px] top-[102px] w-[336px] overflow-hidden">
                  <div className="absolute font-['Plain:Regular',_sans-serif] leading-[0] left-[21px] not-italic text-white text-[18px] text-left top-0">
                    <p className="block leading-[20px] whitespace-pre">
                      {modalType.categories.join(', ')} • {modalType.theme}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
