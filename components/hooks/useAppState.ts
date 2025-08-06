import { useState, useCallback, useRef } from 'react';

interface AppState {
  // Modal states
  isModalOpen: boolean;
  isCareersModalOpen: boolean;
  isAboutModalOpen: boolean;
  aboutModalReady: boolean;
  shouldCloseModal: boolean;
  aboutCameraActiveTrigger: number;
  canvasClickTrigger: number;
  
  // Search states
  searchModalTrigger: string | null;
  closeModalTrigger: number;
  resetSearchTrigger: number;
  currentDynamicWord: string;
  
  // Linear mode state
  isLinearMode: boolean;
  isAnimatingLinearMode: boolean;
}

interface AppActions {
  // Modal actions
  handleModalOpen: () => void;
  handleCareersModalClose: () => void;
  handleAboutModalClose: () => void;
  handleCareersModalOpen: () => void;
  handleAboutModalReady: (ready: boolean) => void;
  handleCanvasClick: () => void;
  handleNavigationHoverOut: () => void;
  handleModalClose: () => void;
  handleCloseModalFromNavigation: () => void;
  
  // Search actions
  handleSearch: (searchTerm: string) => void;
  handleWordUpdate: (word: string) => void;
  
  // Linear mode actions
  toggleLinearMode: () => void;
  handleAnimationStateChange: (isAnimating: boolean) => void;
  
  // Computed values
  isAnyModalOpen: boolean;
}

export function useAppState(): [AppState, AppActions] {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCareersModalOpen, setIsCareersModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [aboutModalReady, setAboutModalReady] = useState(false);
  const [shouldCloseModal, setShouldCloseModal] = useState(false);
  const [aboutCameraActiveTrigger, setAboutCameraActiveTrigger] = useState(0);
  const [canvasClickTrigger, setCanvasClickTrigger] = useState(0);

  // Search state
  const [searchModalTrigger, setSearchModalTrigger] = useState<string | null>(null);
  const [closeModalTrigger, setCloseModalTrigger] = useState(0);
  const [resetSearchTrigger, setResetSearchTrigger] = useState(0);
  const [currentDynamicWord, setCurrentDynamicWord] = useState('explore');
  const lastSearchTime = useRef<number>(0);
  
  // Linear mode state
  const [isLinearMode, setIsLinearMode] = useState(false);
  const [isAnimatingLinearMode, setIsAnimatingLinearMode] = useState(false);

  const isAnyModalOpen = isModalOpen || isCareersModalOpen || isAboutModalOpen;

  // Handle reset search trigger
  const onResetSearchTrigger = useCallback(() => {
    setResetSearchTrigger(prev => prev + 1);
  }, []);

  // Handle modal open - only move search bar if no modal was previously open
  const handleModalOpen = useCallback(() => {
    const wasAnyModalOpen = isCareersModalOpen || isAboutModalOpen || isModalOpen;
    
    if (!wasAnyModalOpen) {
      // Only animate search bar if no modal was open before
      setTimeout(() => {
        setIsModalOpen(true);
      }, 500);
    } else {
      // Modal was already open, keep search at bottom immediately
      setIsModalOpen(true);
    }
  }, [isCareersModalOpen, isAboutModalOpen, isModalOpen]);

  // Handle careers modal close
  const handleCareersModalClose = useCallback(() => {
    setIsCareersModalOpen(false);
    setIsModalOpen(false); // Reset modal state to return search to center
    onResetSearchTrigger();
  }, [onResetSearchTrigger]);

  // Handle about modal close - properly reset about modal states
  const handleAboutModalClose = useCallback(() => {
    setIsAboutModalOpen(false);
    setAboutModalReady(false);
    setIsModalOpen(false); // Reset modal state to return search to center
    // Reset the camera trigger to prevent it from being reused
    setAboutCameraActiveTrigger(0);
    onResetSearchTrigger();
  }, [onResetSearchTrigger]);

  // Handle careers modal open - only move search bar if no modal was previously open
  const handleCareersModalOpen = useCallback(() => {
    const wasAnyModalOpen = isCareersModalOpen || isAboutModalOpen || isModalOpen;
    
    if (!wasAnyModalOpen) {
      // Only animate search bar if no modal was open before
      setTimeout(() => {
        setIsModalOpen(true);
      }, 500);
    } else {
      // Modal was already open, keep search at bottom immediately
      setIsModalOpen(true);
    }
  }, [isCareersModalOpen, isAboutModalOpen, isModalOpen]);

  // Handle about modal open - only move search bar if no modal was previously open
  const handleAboutModalReady = useCallback((ready: boolean) => {
    setAboutModalReady(ready);
    if (ready) {
      const wasAnyModalOpen = isCareersModalOpen || isAboutModalOpen || isModalOpen;
      
      if (!wasAnyModalOpen) {
        // Only animate search bar if no modal was open before
        setTimeout(() => {
          setIsModalOpen(true);
        }, 100);
      } else {
        // Modal was already open, keep search at bottom immediately
        setIsModalOpen(true);
      }
    }
  }, [isCareersModalOpen, isAboutModalOpen, isModalOpen]);

  // Handle canvas click when modal is open - keep search at bottom during transitions
  const handleCanvasClick = useCallback(() => {
    const isAnyModalCurrentlyOpen = isCareersModalOpen || isAboutModalOpen || isModalOpen;
    
    if (isAnyModalCurrentlyOpen) {
      // Close current modal without centering search console
      if (isCareersModalOpen) {
        setIsCareersModalOpen(false);
      }
      if (isAboutModalOpen) {
        setIsAboutModalOpen(false);
        setAboutModalReady(false);
        // Reset camera trigger when closing about modal from canvas click
        setAboutCameraActiveTrigger(0);
      }
      if (isModalOpen) {
        setShouldCloseModal(true);
      }
      
      // Wait for closing animation to complete (400ms), then trigger canvas click
      // Don't reset search position - keep it at bottom during transition
      setTimeout(() => {
        setCanvasClickTrigger(prev => prev + 1);
      }, 400);
    } else {
      // No modal is open, trigger canvas click immediately
      setCanvasClickTrigger(prev => prev + 1);
    }
  }, [isCareersModalOpen, isAboutModalOpen, isModalOpen]);

  // Handle navigation hover out - close modals when hovering away (with delay to prevent immediate closing)
  const handleNavigationHoverOut = useCallback(() => {
    // Don't close modal immediately after opening - wait at least 2 seconds
    const timeSinceLastSearch = Date.now() - lastSearchTime.current;
    if (timeSinceLastSearch < 2000) {
      return; // Skip closing if modal was just opened
    }
    
    if (isCareersModalOpen) {
      handleCareersModalClose();
    } else if (isAboutModalOpen) {
      handleAboutModalClose();
    } else if (isModalOpen) {
      setShouldCloseModal(true);
    }
  }, [isCareersModalOpen, isAboutModalOpen, isModalOpen, handleCareersModalClose, handleAboutModalClose]);

  // Handle modal close to reset search
  const handleModalClose = useCallback(() => {
    onResetSearchTrigger();
    setIsModalOpen(false);
    setShouldCloseModal(false); // Reset the close trigger
  }, [onResetSearchTrigger]);

  // Handle close modal from navigation
  const handleCloseModalFromNavigation = useCallback(() => {
    if (isCareersModalOpen) {
      handleCareersModalClose();
    } else if (isAboutModalOpen) {
      handleAboutModalClose();
    } else {
      setShouldCloseModal(true);
    }
  }, [isCareersModalOpen, isAboutModalOpen, handleCareersModalClose, handleAboutModalClose]);

  // Handle search to trigger modal opening
  const handleSearch = useCallback((searchTerm: string) => {
    lastSearchTime.current = Date.now();
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const isAnyModalCurrentlyOpen = isCareersModalOpen || isAboutModalOpen || isModalOpen;
    
    // Function to open careers modal
    const openCareersModal = () => {
      setIsCareersModalOpen(true);
      handleCareersModalOpen();
    };
    
    // Function to open about modal
    const openAboutModal = () => {
      setIsAboutModalOpen(true);
      setAboutModalReady(false);
      setAboutCameraActiveTrigger(prev => prev + 1);
    };
    
    // Function to open regular modal
    const openRegularModal = () => {
      setSearchModalTrigger(searchTerm);
      // Reset trigger after a short delay to allow multiple searches
      setTimeout(() => setSearchModalTrigger(null), 100);
    };
    
    // Check what type of search this is
    const isCareersSearch = lowerSearchTerm.includes('career') || lowerSearchTerm.includes('job') || lowerSearchTerm === 'careers';
    const isAboutSearch = lowerSearchTerm === 'about' || lowerSearchTerm.includes('about') || lowerSearchTerm === 'sobre' || lowerSearchTerm.includes('sobre');
    
    // If any modal is currently open, close it first with animation delay
    if (isAnyModalCurrentlyOpen) {
      // Close current modal without centering search console
      if (isCareersModalOpen) {
        setIsCareersModalOpen(false);
      }
      if (isAboutModalOpen) {
        setIsAboutModalOpen(false);
        setAboutModalReady(false);
        // Reset camera trigger when switching from about modal
        setAboutCameraActiveTrigger(0);
      }
      if (isModalOpen) {
        setShouldCloseModal(true);
      }
      
      // Wait for closing animation to complete (400ms), then open new modal
      setTimeout(() => {
        if (isCareersSearch) {
          openCareersModal();
        } else if (isAboutSearch) {
          openAboutModal();
        } else {
          openRegularModal();
        }
      }, 400);
    } else {
      // No modal is open, open new modal immediately
      if (isCareersSearch) {
        openCareersModal();
      } else if (isAboutSearch) {
        openAboutModal();
      } else {
        openRegularModal();
      }
    }
  }, [isCareersModalOpen, isAboutModalOpen, isModalOpen, handleCareersModalOpen]);

  // Handle word updates from ParticleUniverse
  const handleWordUpdate = useCallback((word: string) => {
    setCurrentDynamicWord(word);
  }, []);

  // Handle linear mode toggle
  const toggleLinearMode = useCallback(() => {
    if (!isAnimatingLinearMode) { // Only allow toggle if not currently animating
      setIsLinearMode(prev => !prev);
    }
  }, [isAnimatingLinearMode]);

  // Handle animation state changes
  const handleAnimationStateChange = useCallback((isAnimating: boolean) => {
    setIsAnimatingLinearMode(isAnimating);
  }, []);

  const appState: AppState = {
    // Modal states
    isModalOpen,
    isCareersModalOpen,
    isAboutModalOpen,
    aboutModalReady,
    shouldCloseModal,
    aboutCameraActiveTrigger,
    canvasClickTrigger,
    
    // Search states
    searchModalTrigger,
    closeModalTrigger,
    resetSearchTrigger,
    currentDynamicWord,
    
    // Linear mode state
    isLinearMode,
    isAnimatingLinearMode
  };

  const appActions: AppActions = {
    // Modal actions
    handleModalOpen,
    handleCareersModalClose,
    handleAboutModalClose,
    handleCareersModalOpen,
    handleAboutModalReady,
    handleCanvasClick,
    handleNavigationHoverOut,
    handleModalClose,
    handleCloseModalFromNavigation,
    
    // Search actions
    handleSearch,
    handleWordUpdate,
    
    // Linear mode actions
    toggleLinearMode,
    handleAnimationStateChange,
    
    // Computed values
    isAnyModalOpen
  };

  return [appState, appActions];
}