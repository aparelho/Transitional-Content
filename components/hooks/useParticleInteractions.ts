import { useRef, useCallback } from 'react';
import { distance, distance3D, FOCAL_LENGTH } from '../utils/particleUtils';
import { Particle, bookImages } from '../data/particleData';

interface PersistentImage {
  img: HTMLImageElement;
  fadeAlpha: number;
  lastSeen: number;
  isVisible: boolean;
}

export function useParticleInteractions() {
  const connectedParticleImages = useRef<Map<number, HTMLImageElement>>(new Map());
  const persistentImages = useRef<Map<number, PersistentImage>>(new Map());

  // Function to load and cache book cover images with persistence
  const getBookImage = useCallback((particleId: number): HTMLImageElement | null => {
    if (connectedParticleImages.current.has(particleId)) {
      return connectedParticleImages.current.get(particleId)!;
    }
    
    // Create new image if not cached
    const img = new Image();
    const imageIndex = particleId % bookImages.length;
    img.src = bookImages[imageIndex];
    img.onload = () => {
      // Image loaded, will be drawn on next frame
    };
    
    connectedParticleImages.current.set(particleId, img);
    return img;
  }, []);

  // Function to manage persistent images with smooth fade
  const updatePersistentImages = useCallback((connectedParticleIds: Set<number>, currentTime: number) => {
    const FADE_DURATION = 800; // 800ms fade duration
    const PERSISTENCE_TIME = 2000; // Keep images visible for 2 seconds after disconnection
    
    // Update existing persistent images
    persistentImages.current.forEach((imageData, particleId) => {
      const isCurrentlyConnected = connectedParticleIds.has(particleId);
      
      if (isCurrentlyConnected) {
        // Particle is connected - fade in and update last seen time
        imageData.lastSeen = currentTime;
        imageData.isVisible = true;
        imageData.fadeAlpha = Math.min(1, imageData.fadeAlpha + (16 / FADE_DURATION)); // Assume ~60fps
      } else {
        // Particle is not connected - check if we should fade out
        const timeSinceLastSeen = currentTime - imageData.lastSeen;
        
        if (timeSinceLastSeen > PERSISTENCE_TIME) {
          // Start fading out
          imageData.isVisible = false;
          imageData.fadeAlpha = Math.max(0, imageData.fadeAlpha - (16 / FADE_DURATION));
        }
      }
    });
    
    // Add new images for newly connected particles (every 4th particle)
    let connectionIndex = 0;
    connectedParticleIds.forEach(particleId => {
      if (connectionIndex % 4 === 0 && !persistentImages.current.has(particleId)) {
        const img = getBookImage(particleId);
        if (img) {
          persistentImages.current.set(particleId, {
            img,
            fadeAlpha: 0,
            lastSeen: currentTime,
            isVisible: true
          });
        }
      }
      connectionIndex++;
    });
    
    // Clean up fully faded images
    const toDelete: number[] = [];
    persistentImages.current.forEach((imageData, particleId) => {
      if (imageData.fadeAlpha <= 0 && !imageData.isVisible) {
        toDelete.push(particleId);
      }
    });
    
    toDelete.forEach(particleId => {
      persistentImages.current.delete(particleId);
    });
  }, [getBookImage]);

  const getConnectedParticles = useCallback((
    particles: Particle[],
    mouseX: number,
    mouseY: number,
    canvasWidth: number,
    canvasHeight: number,
    maxConnectionDistance: number,
    maxConnections: number,
    MIN_Z_DISTANCE: number
  ) => {
    // Normal particle connection calculation
    const mouseZ = 400; // Fixed z-depth for mouse interaction
    const mouseWorldX = (mouseX - canvasWidth / 2) * (mouseZ / FOCAL_LENGTH);
    const mouseWorldY = (mouseY - canvasHeight / 2) * (mouseZ / FOCAL_LENGTH);
    
    const particlesWithDistance = particles
      .filter(particle => particle.z > MIN_Z_DISTANCE && particle.screenSize > 0.1) // Only visible particles
      .map(particle => ({
        particle,
        distance: distance(mouseX, mouseY, particle.screenX, particle.screenY), // 2D screen distance
        distance3D: distance3D(mouseWorldX, mouseWorldY, mouseZ, particle.x, particle.y, particle.z) // 3D world distance
      }));
    
    // Filter by max distance and sort by 2D screen distance for better interaction
    return particlesWithDistance
      .filter(item => item.distance <= maxConnectionDistance)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxConnections);
  }, []);

  return {
    updatePersistentImages,
    getConnectedParticles,
    persistentImages,
    connectedParticleImages
  };
}