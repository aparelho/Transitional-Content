import React, { useEffect } from 'react';
import ParticleUniverse from './components/ParticleUniverse';
import NavigationSearch from './components/NavigationSearch';
import ModalManager from './components/ModalManager';
import LinearToggle from './components/LinearToggle';
import { useAppState } from './components/hooks/useAppState';
import { preloadImages } from './components/data/particleData';

export default function App() {
  const [state, actions] = useAppState();

  // Preload critical images on app start
  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <div className="w-screen h-screen bg-white overflow-hidden">
      <ParticleUniverse 
        searchTrigger={state.searchModalTrigger}
        closeModalTrigger={state.closeModalTrigger}
        onModalClose={actions.handleModalClose}
        onModalOpen={actions.handleModalOpen}
        onWordUpdate={actions.handleWordUpdate}
        shouldCloseModal={state.shouldCloseModal}
        aboutCameraActiveTrigger={state.aboutCameraActiveTrigger}
        isAboutModalOpen={state.isAboutModalOpen}
        onAboutModalReady={actions.handleAboutModalReady}
        onCanvasClick={actions.handleCanvasClick}
        isAnyModalOpen={actions.isAnyModalOpen}
        canvasClickTrigger={state.canvasClickTrigger}
        isLinearMode={state.isLinearMode}
        onAnimationStateChange={actions.handleAnimationStateChange}
      />
      
      <NavigationSearch 
        onSearch={actions.handleSearch}
        onHoverOut={actions.handleNavigationHoverOut}
        resetSearchTrigger={state.resetSearchTrigger}
        currentDynamicWord={state.currentDynamicWord}
        isModalOpen={actions.isAnyModalOpen}
        onCloseModal={actions.handleCloseModalFromNavigation}
      />

      <LinearToggle
        isLinearMode={state.isLinearMode}
        onToggle={actions.toggleLinearMode}
        isAnyModalOpen={actions.isAnyModalOpen}
        isAnimating={state.isAnimatingLinearMode}
      />

      <ModalManager
        isCareersModalOpen={state.isCareersModalOpen}
        isAboutModalOpen={state.isAboutModalOpen}
        aboutModalReady={state.aboutModalReady}
        onCareersModalClose={actions.handleCareersModalClose}
        onAboutModalClose={actions.handleAboutModalClose}
      />
    </div>
  );
}
