import { useState, useRef, useCallback } from 'react';
import { CAMERA_ANIMATION_DURATION } from '../utils/particleUtils';

export function useCameraAnimation() {
  const [isCameraRotating, setIsCameraRotating] = useState(false);
  const [spiderDisabled, setSpiderDisabled] = useState(false);
  const [aboutModalReady, setAboutModalReady] = useState(false);
  const cameraAnimationStartTime = useRef<number>(0);

  const startCameraRotation = useCallback((isAboutModalOpen: boolean, onAboutModalReady?: (ready: boolean) => void) => {
    if (isAboutModalOpen) {
      // First disable spider, then start camera animation
      setSpiderDisabled(true);
      setAboutModalReady(false);
      
      // Start camera animation after brief delay
      setTimeout(() => {
        setIsCameraRotating(true);
        cameraAnimationStartTime.current = Date.now();
      }, 100);
    } else {
      // If about modal is closed, start rotating back and re-enable spider
      setIsCameraRotating(true);
      cameraAnimationStartTime.current = Date.now();
      // Re-enable spider when closing
      setSpiderDisabled(false);
      setAboutModalReady(false);
    }
  }, []);

  const updateCameraAnimation = useCallback((
    cameraRotationProgress: React.MutableRefObject<number>,
    isAboutModalOpen: boolean,
    onAboutModalReady?: (ready: boolean) => void
  ) => {
    if (!isCameraRotating) return;

    const now = Date.now();
    const animationTime = now - cameraAnimationStartTime.current;
    const normalizedTime = Math.min(animationTime / CAMERA_ANIMATION_DURATION, 1);
    
    if (isAboutModalOpen) {
      // Rotate to side view (0 -> 1)
      cameraRotationProgress.current = normalizedTime;
      
      // Stop animation when complete and stay in side view
      if (normalizedTime >= 1) {
        cameraRotationProgress.current = 1;
        setIsCameraRotating(false);
        setAboutModalReady(true); // Modal can now appear
        // Notify parent that modal is ready to show
        if (onAboutModalReady) {
          onAboutModalReady(true);
        }
      }
    } else {
      // Rotate back to normal view (1 -> 0)
      cameraRotationProgress.current = 1 - normalizedTime;
      
      // Stop animation when complete and return to normal view
      if (normalizedTime >= 1) {
        cameraRotationProgress.current = 0;
        setIsCameraRotating(false);
        setSpiderDisabled(false); // Re-enable spider when back to normal
      }
    }
  }, [isCameraRotating]);

  // Add a function to reset camera state completely
  const resetCameraState = useCallback(() => {
    setIsCameraRotating(false);
    setSpiderDisabled(false);
    setAboutModalReady(false);
  }, []);

  return {
    isCameraRotating,
    spiderDisabled,
    aboutModalReady,
    startCameraRotation,
    updateCameraAnimation,
    setAboutModalReady,
    resetCameraState
  };
}