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
  position, 
  modalType, 
  onClose, 
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

  // Position modal - horizontally centered on viewport
  const modalStyle = {
    position: 'fixed' as const,
    left: '50%',
    bottom: '20px',
    transform: 'translateX(-50%)',
    width: isMobile ? 'calc(100vw - 32px)' : '528px',
    maxWidth: isMobile ? 'none' : '528px',
    maxHeight: isMobile ? 'calc(100vh - 52px)' : 'calc(100vh - 60px)',
    zIndex: 40, // Behind navigation search (z-50)
  };

  const getCardStyle = (index: number) => {
    const delay = index * 120; // Stagger animation by 120ms per card for better cascade effect
    const baseTransform = animationState === 'visible' ? 'translateY(0px)' : 'translateY(60px)';
    const opacity = animationState === 'visible' ? 1 : 0;
    
    return {
      transform: baseTransform,
      opacity: opacity,
      transition: `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`,
    };
  };

  return (
    <div style={modalStyle}>
      <div className="flex flex-col h-full">
        {/* Scrollable Article Cards Container */}
        <div 
          className="flex-1 modal-scroll-container pb-6 pr-2 pt-6 overflow-y-auto max-h-full"
          style={{
            backgroundImage: 'url(https://cdn.builder.io/api/v1/image/assets%2F14ad39154b8c4b0297a92d920ee7af25%2F26ad63415d3b4689b94818ad50378172)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            margin: '0 auto auto',
          }}
        >
          <div className="flex flex-col gap-[13px]">
            {/* All Article Cards */}
            {articles.map((article, index) => {
              const cardIndex = index;
              const opacity = index === 0 ? 1 : index === 1 ? 0.8 : index < 4 ? 0.6 : 0.4;
              
              return (
                <div
                  key={article.id}
                  className="bg-[rgba(0,0,0,0.3)] rounded-[26.027px] shadow-[0px_0px_19.52px_0px_rgba(0,0,0,0.18)] w-full relative overflow-hidden"
                  style={{
                    ...getCardStyle(cardIndex),
                    opacity: animationState === 'visible' ? opacity : 0,
                    backdropFilter: 'blur(32.533px)',
                    WebkitBackdropFilter: 'blur(32.533px)',
                  }}
                >
                  {index === 0 ? (
                    // Featured article with image (no text overlays)
                    <div className="relative h-[352px]">
                      {article.image && (
                        <img 
                          src={article.image}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover rounded-[26.027px]"
                        />
                      )}
                    </div>
                  ) : (
                    // Regular text cards - simplified structure without unnecessary wrapper divs
                    <>
                      {/* Title section */}
                      <div 
                        className="font-['Plain:Regular',_sans-serif] leading-[29.28px] text-white text-[26.027px] text-left pt-[26px] px-[30.906px] pb-4"
                        style={{
                          backdropFilter: index === 1 ? 'blur(60px)' : undefined,
                          backgroundColor: index === 1 ? 'rgba(255, 255, 255, 1)' : undefined,
                        }}
                      >
                        {article.title}
                      </div>
                      
                      {/* Tags section */}
                      <div className="px-[30.906px] pb-5">
                        <p className="font-['Plain:Regular',_sans-serif] text-white text-[17.92px] text-left leading-[20.16px]">
                          {article.category} • {modalType.theme}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Collection Summary Card */}
            <div
              className="bg-[rgba(0,0,0,0.3)] rounded-[26.027px] shadow-[0px_0px_19.52px_0px_rgba(0,0,0,0.18)] w-full relative h-[161px] overflow-hidden"
              style={{
                ...getCardStyle(articles.length),
                opacity: animationState === 'visible' ? 0.3 : 0,
                backdropFilter: 'blur(32.533px)',
                WebkitBackdropFilter: 'blur(32.533px)',
              }}
            >
              <div className="absolute h-[68px] left-0 top-[26px] w-[488px] overflow-hidden">
                <div className="absolute font-['Plain:Regular',_sans-serif] leading-[29.28px] left-[30.906px] not-italic text-white text-[26.027px] text-left top-0">
                  <p className="block mb-0 leading-[29.28px]">Complete Collection</p>
                  <p className="block leading-[29.28px]">{articles.length} total articles</p>
                </div>
              </div>
              <div className="absolute h-[46.82px] left-2.5 top-[102px] w-[336px] overflow-hidden">
                <div className="absolute font-['Plain:Regular',_sans-serif] leading-[0] left-[21.279px] not-italic text-white text-[17.92px] text-left top-0">
                  <p className="block leading-[20.16px] whitespace-pre">
                    {modalType.categories.join(', ')} • {modalType.theme}
                  </p>
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
