import React, { useState, useRef, useCallback, useEffect } from 'react';
const imgScreenshot20250722At1833072 = "/images/search-icon.svg";

interface NavigationSearchProps {
  onSearch: (searchTerm: string) => void;
  onHoverOut?: () => void;
  resetSearchTrigger?: number;
  className?: string;
  currentDynamicWord?: string;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
}

// Modal types with keywords for search matching
const modalTypes = [
  {
    id: 0,
    title: "Tech Innovation Hub",
    theme: "technology",
    categories: ['Technology', 'Innovation', 'AI'],
    keywords: ['tech', 'technology', 'innovation', 'ai', 'artificial', 'intelligence', 'code', 'programming', 'digital', 'software', 'hardware', 'computer', 'data', 'algorithm', 'machine', 'learning', 'neural', 'network']
  },
  {
    id: 1,
    title: "Science Discovery Lab",
    theme: "science", 
    categories: ['Science', 'Research', 'Medicine'],
    keywords: ['science', 'research', 'medicine', 'medical', 'biology', 'chemistry', 'physics', 'lab', 'experiment', 'discovery', 'theory', 'study', 'analysis', 'scientific', 'clinical', 'health', 'healthcare', 'biotech']
  },
  {
    id: 2,
    title: "Design Studio Collective",
    theme: "design",
    categories: ['Design', 'Art', 'Creative'],
    keywords: ['design', 'art', 'creative', 'ui', 'ux', 'graphic', 'visual', 'aesthetic', 'brand', 'branding', 'layout', 'typography', 'color', 'interface', 'experience', 'usability', 'prototype', 'wireframe']
  },
  {
    id: 3,
    title: "Business Strategy Center", 
    theme: "business",
    categories: ['Business', 'Finance', 'Leadership'],
    keywords: ['business', 'finance', 'leadership', 'strategy', 'management', 'entrepreneurship', 'startup', 'company', 'corporate', 'market', 'marketing', 'sales', 'revenue', 'profit', 'investment', 'economy', 'commerce']
  },
  {
    id: 4,
    title: "Space Exploration Zone",
    theme: "space",
    categories: ['Space', 'Astronomy', 'Future'],
    keywords: ['space', 'astronomy', 'future', 'mars', 'planet', 'galaxy', 'universe', 'cosmos', 'rocket', 'satellite', 'nasa', 'astronaut', 'exploration', 'solar', 'lunar', 'stellar', 'orbit', 'mission']
  },
  {
    id: 5,
    title: "Nature Conservation Hub",
    theme: "nature",
    categories: ['Nature', 'Environment', 'Climate'],
    keywords: ['nature', 'environment', 'climate', 'ecology', 'conservation', 'sustainability', 'green', 'renewable', 'biodiversity', 'ecosystem', 'wildlife', 'forest', 'ocean', 'earth', 'pollution', 'carbon', 'emissions']
  },
  {
    id: 6,
    title: "Digital Art Gallery",
    theme: "art",
    categories: ['Art', 'Digital', 'NFT'],
    keywords: ['art', 'digital', 'nft', 'gallery', 'artist', 'painting', 'sculpture', 'creative', 'exhibition', 'collection', 'curator', 'aesthetic', 'contemporary', 'modern', 'traditional', 'craft', 'culture']
  },
  {
    id: 7,
    title: "Future Tech Laboratory",
    theme: "future",
    categories: ['Future', 'Quantum', 'Emerging'],
    keywords: ['future', 'quantum', 'emerging', 'innovation', 'breakthrough', 'next', 'generation', 'advanced', 'cutting', 'edge', 'revolutionary', 'disruptive', 'transformation', 'evolution', 'progress', 'development']
  },
  {
    id: 8,
    title: "Health & Wellness Center",
    theme: "health",
    categories: ['Health', 'Wellness', 'Biotech'],
    keywords: ['health', 'wellness', 'biotech', 'medical', 'healthcare', 'therapy', 'treatment', 'prevention', 'fitness', 'nutrition', 'mental', 'physical', 'wellbeing', 'lifestyle', 'medicine', 'pharmaceutical']
  },
  {
    id: 9,
    title: "Global Culture Network",
    theme: "culture",
    categories: ['Culture', 'Society', 'Global'],
    keywords: ['culture', 'society', 'global', 'community', 'social', 'human', 'anthropology', 'sociology', 'tradition', 'heritage', 'diversity', 'inclusion', 'identity', 'values', 'beliefs', 'customs']
  }
];

export default function NavigationSearch({ onSearch, onHoverOut, resetSearchTrigger = 0, className = "", currentDynamicWord = "explore", isModalOpen = false, onCloseModal }: NavigationSearchProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseLeave = useCallback((event: React.MouseEvent) => {
    // Only trigger hover out if the user is moving away from the navigation area
    // and not just moving within the component or towards where modals typically appear
    // Also skip if transitioning to prevent issues during position changes
    if (onHoverOut && containerRef.current && !isTransitioning) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      
      // Check if mouse is moving significantly away from the navigation component
      const distanceFromComponent = Math.min(
        Math.abs(mouseX - rect.left),
        Math.abs(mouseX - rect.right),
        Math.abs(mouseY - rect.top),
        Math.abs(mouseY - rect.bottom)
      );
      
      // Only trigger hover out if mouse is moving far away (not just to adjacent areas)
      if (distanceFromComponent > 50) {
        setTimeout(() => {
          if (onHoverOut) {
            onHoverOut();
          }
        }, 1000); // Longer delay to prevent accidental closing, especially for careers modal
      }
    }
  }, [onHoverOut, isTransitioning]);

  // Handle search submission
  const handleSearchSubmit = useCallback(() => {
    if (searchValue.trim().length > 0) {
      const searchTerm = searchValue.toLowerCase().trim();
      
      // Always trigger search for any non-empty term (careers handled in App.tsx)
      onSearch(searchTerm);
    }
  }, [searchValue, onSearch]);

  // Handle menu toggle
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Handle navigation menu items
  const handleNavClick = useCallback((item: string) => {
    const searchTerm = item.toLowerCase();
    setSearchValue(searchTerm);
    // Trigger search immediately when clicking menu items
    onSearch(searchTerm);
    setIsMenuOpen(false);
  }, [onSearch]);

  // Handle modal open/close transitions
  useEffect(() => {
    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    // Start transition state immediately when modal state changes
    setIsTransitioning(true);
    
    // End transition state after the CSS transition completes (500ms + buffer)
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
    
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [isModalOpen]);

  // Handle search reset trigger
  useEffect(() => {
    if (resetSearchTrigger > 0) {
      setSearchValue('');
    }
  }, [resetSearchTrigger]);

  // Handle typing - no predictive search, no auto-closing
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
    // No automatic actions - only respond to explicit Enter submission
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsSearchActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`fixed left-1/2 transform -translate-x-1/2 z-[1002] w-full max-w-md px-4 transition-all duration-500 ease-out ${
        isModalOpen 
          ? 'bottom-8 -translate-y-0' 
          : 'top-1/2 -translate-y-1/2'
      } ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {/* Search Bar Container - Increased by 10% */}
      <div
        className={`bg-[rgba(0,0,0,0.3)] h-[62.7px] relative rounded-[20.213px] w-full backdrop-blur-sm transition-transform duration-300 ease-out ${
          isSearchActive ? 'scale-105' : 'scale-100'
        }`}
        data-name="Container"
      >
        <div className="flex flex-row items-center relative size-full">
          <div className="box-border content-stretch flex flex-row h-[62.7px] items-center justify-between px-[20.566px] py-[10.283px] relative w-full">
            
            {/* Search Input - Increased by 10% with antialiasing */}
            <div className="basis-0 grow h-[26.319px] min-h-px min-w-px relative shrink-0">
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
                onFocus={() => {
                  setIsSearchFocused(true);
                  setIsSearchActive(true);
                }}
                onBlur={() => {
                  setIsSearchFocused(false);
                  setIsSearchActive(false);
                }}
                placeholder=""
                className="absolute inset-0 w-full h-full bg-transparent border-none outline-none font-['Suisse_Int\\'l:Regular',_sans-serif] text-[13.2px] leading-[1.056] text-[rgba(249,249,249,0.9)] tracking-[-0.264px] antialiased"
                style={{ font: "inherit" }}
              />
              {/* Custom placeholder with two spans - with antialiasing */}
              {!searchValue && (
                <div className="absolute inset-0 flex items-center pointer-events-none font-['Suisse_Int\\'l:Regular',_sans-serif] text-[13.2px] leading-[1.056] tracking-[-0.264px] antialiased">
                  <span className="text-[rgba(66,66,66,0.6)]">Quero ler sobre&nbsp;</span>
                  <span className="text-[rgba(249,249,249,0.6)]">{currentDynamicWord}</span>
                </div>
              )}
            </div>

            {/* Button - Close Modal when modal is open, otherwise Chevron/Search - Increased by 10% */}
            {isModalOpen ? (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onCloseModal) {
                    onCloseModal();
                  }
                }}
                className="shrink-0 size-[22.739px] rounded-[83.377px] transition-all duration-200 hover:scale-110 flex items-center justify-center"
                aria-label="Close modal"
              >
                <svg 
                  className="w-[13.2px] h-[13.2px] text-[rgba(249,249,249,0.8)]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            ) : (
              <button 
                onClick={() => {
                  if (searchValue.trim()) {
                    handleSearchSubmit();
                  } else {
                    toggleMenu();
                  }
                }}
                className="shrink-0 size-[22.739px] rounded-[83.377px] bg-no-repeat transition-all duration-200 hover:scale-110 flex items-center justify-center"
                style={{
                  backgroundImage: `url('${imgScreenshot20250722At1833072}')`,
                  backgroundSize: '2203.7% 622.22%',
                  backgroundPosition: '86.62% 36.88%'
                }}
                aria-label={searchValue.trim() ? "Search" : "Toggle navigation menu"}
              />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Menu - Increased by 10% with antialiasing */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-[220px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className="bg-[rgba(0,0,0,0.2)] mt-[13.2px] relative rounded-[23.654px] w-full backdrop-blur-sm"
          data-name="Menu container"
        >
          <div className="box-border content-stretch flex flex-col gap-[10.94px] items-start justify-start py-[17.6px] px-[19.8px] relative w-full">
            <div className="flex flex-col font-['Suisse_Int\\'l:Regular',_sans-serif] justify-center leading-[1.617] text-[13.2px] tracking-[-0.264px] w-full antialiased">
              
              {/* Organization Name */}
              <button 
                onClick={() => handleNavClick('Instituto Kunumi')}
                className="text-left mb-[4.4px] font-['Suisse_Int\\'l:Medium',_sans-serif] text-[rgba(48,48,48,0.5)] hover:text-[rgba(48,48,48,0.7)] transition-colors duration-200 antialiased"
              >
                Instituto Kunumi
              </button>
              
              {/* Navigation Items */}
              {['Sobre', 'Cases', 'Labs', 'Careers'].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item)}
                  className="text-left mb-[4.4px] text-[rgba(249,249,249,0.8)] hover:text-[rgba(249,249,249,1)] transition-colors duration-200 antialiased"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chevron Toggle Button (Bottom) - Hide when modal is open, Increased by 10% */}
      {!isModalOpen && (
        <div className={`flex justify-center transition-all duration-300 ease-out ${
          isSearchActive ? 'mt-[17.6px]' : 'mt-[13.2px]'
        }`}>
          <div className="h-[14.3px] w-[85.8px]">
            <button
              onClick={toggleMenu}
              className="w-full h-full"
            >
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 78 13"
              >
                <g id="Frame">
                  <rect
                    fill="black"
                    fillOpacity="0.2"
                    height="13"
                    rx="6.5"
                    width="78"
                  />
                  <path
                    d="M36 5L39 8L42 5"
                    id="Vector"
                    stroke="#616161"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 origin-center ${
                      isMenuOpen ? 'rotate-180' : ''
                    }`}
                    style={{ transformOrigin: '39px 6.5px' }}
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
