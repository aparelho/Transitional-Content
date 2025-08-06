import React from 'react';
import CareersModal from './CareersModal';
import AboutModal from './AboutModal';

interface ModalManagerProps {
  isCareersModalOpen: boolean;
  isAboutModalOpen: boolean;
  aboutModalReady: boolean;
  onCareersModalClose: () => void;
  onAboutModalClose: () => void;
}

const ModalManager: React.FC<ModalManagerProps> = ({
  isCareersModalOpen,
  isAboutModalOpen,
  aboutModalReady,
  onCareersModalClose,
  onAboutModalClose
}) => {
  return (
    <>
      {/* Careers Modal */}
      <CareersModal 
        isOpen={isCareersModalOpen}
        onClose={onCareersModalClose}
      />

      {/* About Modal - only show when camera animation is complete */}
      <AboutModal 
        isOpen={isAboutModalOpen && aboutModalReady}
        onClose={onAboutModalClose}
      />
    </>
  );
};

export default ModalManager;