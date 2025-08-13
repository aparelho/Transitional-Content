import React, { useRef, useEffect, useCallback, useState } from 'react';
import ArticleModal from './ArticleModal';
import ColorPicker from './ColorPicker';
import WordCursor from './WordCursor';
import { useIsMobile } from './ui/use-mobile';
import { useParticlePhysics } from './hooks/useParticlePhysics';
import { useCameraAnimation } from './hooks/useCameraAnimation';
import { useParticleInteractions } from './hooks/useParticleInteractions';
import LinearStrip from './LinearStrip';
import { modalTypes, searchWords, thematicWords, type Article } from './data/particleData';
import { MIN_Z_DISTANCE, TUNNEL_LENGTH, map } from './utils/particleUtils';

interface ParticleUniverseProps {
  searchTrigger?: string | null;
  closeModalTrigger?: number;
  onModalClose?: () => void;
  onModalOpen?: () => void;
  onWordUpdate?: (word: string) => void;
  shouldCloseModal?: boolean;
  aboutCameraActiveTrigger?: number;
  isAboutModalOpen?: boolean;
  onAboutModalReady?: (ready: boolean) => void;
  onCanvasClick?: () => void;
  isAnyModalOpen?: boolean;
  canvasClickTrigger?: number;
  isLinearMode?: boolean;
  onAnimationStateChange?: (isAnimating: boolean) => void;
}

const ParticleUniverse: React.FC<ParticleUniverseProps> = ({ 
  searchTrigger = null,
  // closeModalTrigger = 0,
  onModalClose,
  onModalOpen,
  onWordUpdate,
  shouldCloseModal = false,
  aboutCameraActiveTrigger = 0,
  isAboutModalOpen = false,
  onAboutModalReady,
  onCanvasClick,
  isAnyModalOpen = false,
  canvasClickTrigger = 0,
  isLinearMode = false,
  onAnimationStateChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  
  // Particle physics and rendering
  const { 
    particlesRef, 
    cameraRotationProgress, 
    initializeParticles, 
    updateParticles,
    isAnimating
  } = useParticlePhysics(isMobile, isLinearMode);
  
  // Camera animation
  const { 
    isCameraRotating, 
    spiderDisabled, 
    startCameraRotation, 
    updateCameraAnimation,
    setAboutModalReady: _setCameraAboutModalReady,
    resetCameraState
  } = useCameraAnimation();
  
  // Particle interactions
  const { 
    updatePersistentImages, 
    getConnectedParticles, 
    persistentImages 
  } = useParticleInteractions();

  // UI State
  const [showModal, setShowModal] = useState(false);
  const [modalArticles, setModalArticles] = useState<Article[]>([]);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [modalType, setModalType] = useState(0);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('rgb(255, 255, 255)');
  const [particleColor, setParticleColor] = useState('rgba(0, 0, 0, 0.8)');
  const [showParticles, setShowParticles] = useState(true);
  const [showAurora, setShowAurora] = useState(false);
  
  // Linear mode transition phases
  type LinearPhase = 'idle' | 'fading' | 'gather' | 'reveal' | 'strip';
  const [linearPhase, setLinearPhase] = useState<LinearPhase>('idle');
  const fadeStartRef = useRef<number>(0);
  const gatherStartRef = useRef<number>(0);
  const revealStartRef = useRef<number>(0);
  const keptIdsRef = useRef<Set<number>>(new Set());
  const [stripArticles, setStripArticles] = useState<Article[]>([]);
  const [revealFrom, setRevealFrom] = useState<{ x: number; y: number; size: number }[]>([]);
  
  // Word and interaction state
  const [cursorWords, setCursorWords] = useState<string[]>([]);
  const [highlightedWord, setHighlightedWord] = useState<string>('');
  const [wordRotationIndex, setWordRotationIndex] = useState(0);
  
  // Refs for interaction management
  const lastWordUpdateTime = useRef<number>(0);
  const previousClosestId = useRef<number | null>(null);
  const wordCycleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMouseMoving = useRef<boolean>(false);
  const mouseStopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchWordIndex = useRef<number>(0);
  const lastSearchWordUpdate = useRef<number>(0);
  const auroraTimeRef = useRef<number>(0);

  // Function to check if mouse is over navigation area
  const isMouseOverNavigation = useCallback((mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number) => {
    if (isAnyModalOpen || isLinearMode) {
      // When modal is open or linear mode is active, navigation is at bottom
      const navArea = {
        x: canvasWidth / 2 - 200, // Approximate navigation width
        y: canvasHeight - 150, // Bottom area
        width: 400,
        height: 150
      };
      return mouseX >= navArea.x && mouseX <= navArea.x + navArea.width && 
             mouseY >= navArea.y && mouseY <= navArea.y + navArea.height;
    } else {
      // When no modal and not in linear mode, navigation is centered
      const navArea = {
        x: canvasWidth / 2 - 200,
        y: canvasHeight / 2 - 75,
        width: 400,
        height: 150
      };
      return mouseX >= navArea.x && mouseX <= navArea.x + navArea.width && 
             mouseY >= navArea.y && mouseY <= navArea.y + navArea.height;
    }
  }, [isAnyModalOpen, isLinearMode]);

  // Generate preview words from connected particles and modal type
  const generatePreviewWords = useCallback((connectedParticles: any[], currentModalType: any, rotationIndex: number = 0) => {
    // Safety check to ensure currentModalType exists
    if (!currentModalType || !currentModalType.categories || !currentModalType.theme) {
      return ['explore', 'discover'];
    }
    
    const allAvailableWords = [];
    
    // Add modal type keywords
    const modalKeywords = currentModalType.categories
      .filter((cat: string) => cat && typeof cat === 'string')
      .map((cat: string) => cat.toLowerCase());
    allAvailableWords.push(...modalKeywords);
    
    // Add words from connected particle categories
    const particleCategories = connectedParticles
      .map(item => item.particle && item.particle.article && item.particle.article.category ? item.particle.article.category.toLowerCase() : '')
      .filter((cat: string) => cat && cat.length > 0)
      .filter((cat, index, arr) => arr.indexOf(cat) === index); // Remove duplicates
    
    allAvailableWords.push(...particleCategories);
    
    const themeWords = thematicWords[currentModalType.theme] || ['explore', 'discover', 'learn', 'inspire', 'create'];
    allAvailableWords.push(...themeWords);
    
    // Remove duplicates and filter out empty strings
    const uniqueWords = [...new Set(allAvailableWords.filter(word => word && word.length > 0))];
    
    // Use rotation index to cycle through different word combinations
    const shuffledWords = [...uniqueWords];
    for (let i = 0; i < rotationIndex % uniqueWords.length; i++) {
      shuffledWords.push(shuffledWords.shift()!);
    }
    
    // Select 2-5 words with variation based on rotation
    const numWords = 2 + (rotationIndex % 4); // 2-5 words
    const finalWords = shuffledWords.slice(0, Math.min(numWords, shuffledWords.length));
    
    // Fallback if no words generated
    if (finalWords.length === 0) {
      return ['explore', 'discover'];
    }
    
    return finalWords;
  }, []);

  // Search functionality to open modals based on keywords
  const openModalFromSearch = useCallback((searchTerm: string) => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    
    // Find matching modal type based on search term
    const matchingModalType = modalTypes.find(modal => 
      modal.categories.some(category => 
        category.toLowerCase().includes(searchTermLower) || searchTermLower.includes(category.toLowerCase())
      ) ||
      modal.theme.includes(searchTermLower) ||
      modal.title.toLowerCase().includes(searchTermLower)
    );
    
    if (matchingModalType) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Use center of screen as modal position for search-triggered modals
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Get articles related to the search term
      const relevantArticles = particlesRef.current
        .filter(particle => 
          particle.article.category.toLowerCase().includes(searchTermLower) ||
          particle.article.title.toLowerCase().includes(searchTermLower) ||
          matchingModalType.categories.some(cat => 
            particle.article.category.toLowerCase().includes(cat.toLowerCase())
          )
        )
        .slice(0, 15) // Limit to 15 articles
        .map(particle => particle.article);
      
      // If no specific articles found, use random articles
      const articles = relevantArticles.length > 0 
        ? relevantArticles 
        : particlesRef.current.slice(0, 15).map(particle => particle.article);
      
      // Always open new modal (don't close existing ones when searching)
      setModalArticles(articles);
      setModalPosition({ x: centerX, y: centerY });
      setModalType(matchingModalType.id);
      setIsModalClosing(false); // Ensure not closing
      setShowModal(true);
      if (onModalOpen) {
        onModalOpen();
      }
    }
  }, [onModalOpen]);

  // Modal functions
  // const closeModal = useCallback(() => {
  //   setIsModalClosing(true);
  //   setTimeout(() => {
  //     setShowModal(false);
  //     setIsModalClosing(false);
  //     onModalClose?.();
  //   }, 300);
  // }, [onModalClose]);

  const showModalForCurrentPosition = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;
    
    if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height && !isMouseOverNavigation(mouseX, mouseY, width, height)) {
      // Get connected particles
      const maxConnectionDistance = isMobile ? 300 : 400;
      const maxConnections = 7; // Fixed to 7 spider legs for all devices
      
      const connectedParticles = getConnectedParticles(
        particlesRef.current,
        mouseX,
        mouseY,
        width,
        height,
        maxConnectionDistance,
        maxConnections,
        MIN_Z_DISTANCE
      );
        
      const articlesToShow = connectedParticles.map(item => item.particle.article);
      
      // Determine modal type based on position
      const regionX = Math.floor((mouseX / width) * 5);
      const regionY = Math.floor((mouseY / height) * 2);
      const newModalType = (regionY * 5 + regionX) % 10;
      
      if (articlesToShow.length > 0) {
        // Always open new modal directly (no need to close first)
        setModalArticles(articlesToShow);
        setModalPosition({ x: mouseX, y: mouseY });
        setModalType(newModalType);
        setIsModalClosing(false); // Ensure not closing
        setShowModal(true);
        if (onModalOpen) {
          onModalOpen();
        }
      }
    }
  }, [isMobile, onModalOpen, getConnectedParticles, isMouseOverNavigation]);

  // Main rendering function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const now = Date.now();

    // Clear canvas with solid background color
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Update camera animation
    updateCameraAnimation(cameraRotationProgress, isAboutModalOpen, onAboutModalReady);

    // Update particles
    updateParticles(width, height);

    // Draw particles with linear transition phases
    if (linearPhase !== 'strip') {
      const centerX = width / 2;
      const centerY = height / 2;
      const kept = keptIdsRef.current;
      const nowMs = now;
      const FADE_DURATION = 200; // ms - reduced to 0.2s for faster fade
      const GATHER_DURATION = 600; // ms

      for (let particle of particlesRef.current) {
        if (!(particle.z > MIN_Z_DISTANCE && particle.screenSize > 0.1 &&
              particle.screenX > -50 && particle.screenX < width + 50 &&
              particle.screenY > -50 && particle.screenY < height + 50)) {
          continue;
        }
        if (!showParticles) continue;

        // Base opacity from depth
        const depthOpacity = 1 - (particle.z / TUNNEL_LENGTH);
        let alphaMultiplier = 0.8 * depthOpacity;
        let drawX = particle.screenX;
        let drawY = particle.screenY;

        if (linearPhase === 'fading') {
          const t = Math.min(1, (nowMs - fadeStartRef.current) / FADE_DURATION);
          const isKept = kept.has(particle.article.id);
          if (!isKept) {
            alphaMultiplier *= (1 - t);
            if (alphaMultiplier <= 0.01) continue; // fully faded
          }
          // Advance to gather when fade completes
          if (t >= 1 && gatherStartRef.current === 0) {
            gatherStartRef.current = nowMs;
            setLinearPhase('gather');
          }
        } else if (linearPhase === 'gather') {
          // Only draw kept particles; fade others out completely
          if (!kept.has(particle.article.id)) continue;
          const t = Math.min(1, (nowMs - gatherStartRef.current) / GATHER_DURATION);
          // Ease-out cubic
          const easeT = 1 - Math.pow(1 - t, 3);
          drawX = particle.screenX + (centerX - particle.screenX) * easeT;
          drawY = particle.screenY + (centerY - particle.screenY) * easeT;
          if (t >= 1) {
            // Switch to reveal after gather completes
            setLinearPhase('reveal');
          }
        }

        const baseColor = particleColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (baseColor) {
          ctx.fillStyle = `rgba(${baseColor[1]}, ${baseColor[2]}, ${baseColor[3]}, ${alphaMultiplier})`;
        } else {
          ctx.fillStyle = `rgba(0, 0, 0, ${alphaMultiplier})`;
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, particle.screenSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Only update search words and cursor interactions when NOT in linear mode
    if (linearPhase === 'idle') {
      // Update search word on mouse movement (faster cycling)
      if (now - lastSearchWordUpdate.current > 300 && onWordUpdate) { // Update every 300ms on mouse move
        searchWordIndex.current = (searchWordIndex.current + 1) % searchWords.length;
        onWordUpdate(searchWords[searchWordIndex.current]);
        lastSearchWordUpdate.current = now;
      }

      // Get connected particles and update cursor words
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const maxConnectionDistance = isMobile ? 300 : 400;
      const maxConnections = 7;

      let nearbyParticles: Array<{ particle: any; distance: number; distance3D: number }> = [];
      const isOverNavigation = isMouseOverNavigation(mouseX, mouseY, width, height);
      
      if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height && !isOverNavigation) {
        nearbyParticles = getConnectedParticles(
          particlesRef.current,
          mouseX,
          mouseY,
          width,
          height,
          maxConnectionDistance,
          maxConnections,
          MIN_Z_DISTANCE
        );

        // Draw connections (spider) only in idle phase
        if (!spiderDisabled && !isOverNavigation) {
          for (let i = 0; i < nearbyParticles.length; i++) {
            const { particle, distance: dist } = nearbyParticles[i];
            
            // Normal state
            const depthFade = 1 - (particle.z / TUNNEL_LENGTH);
            const alpha = map(dist, 0, maxConnectionDistance, 0.8, 0.05) * depthFade;
            const lineWidth = Math.max(0.5, particle.screenSize / 6);
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            
            ctx.lineWidth = lineWidth;
            
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(particle.screenX, particle.screenY);
            ctx.stroke();
          }
        }

        // Mouse indicator (only show when not over navigation)
        if (!isOverNavigation) {
          ctx.fillStyle = `rgba(0, 0, 0, 0.8)`;
          ctx.beginPath();
          ctx.arc(mouseX, mouseY, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Update cursor words based on connections
        if (nearbyParticles.length > 0) {
          // Determine modal type based on position
          const regionX = Math.floor((mouseX / width) * 5);
          const regionY = Math.floor((mouseY / height) * 2);
          const currentModalTypeIndex = (regionY * 5 + regionX) % 10;
          const currentModalType = modalTypes[currentModalTypeIndex];
          
          // Check if we should update words (only when mouse is moving and longer intervals)
          const shouldUpdateWords = isMouseMoving.current && now - lastWordUpdateTime.current > 1000; // Update every 1 second and only when moving
          
          // Also update if closest particle changes (but only when mouse is moving)
          const currentClosestId = nearbyParticles[0]?.particle?.article?.id;
          const closestParticleChanged = isMouseMoving.current && currentClosestId !== previousClosestId.current;
          
          if (shouldUpdateWords || closestParticleChanged) {
            previousClosestId.current = currentClosestId;
            lastWordUpdateTime.current = now;
            
            // Increment rotation index for word variety
            setWordRotationIndex(prev => prev + 1);
          }
          
          // Start continuous word cycling when connected to particles (but only when moving)
          if (!wordCycleInterval.current && isMouseMoving.current) {
            wordCycleInterval.current = setInterval(() => {
              if (isMouseMoving.current) {
                setWordRotationIndex(prev => prev + 1);
              }
            }, 1500); // Cycle words every 1.5 seconds when connected and moving
          }
          
          // Safety check to ensure currentModalType exists
          if (currentModalType) {
            const words = generatePreviewWords(nearbyParticles, currentModalType, wordRotationIndex);
            setCursorWords(words);
            
            // Set highlighted word (changes based on closest particle)
            if (nearbyParticles[0] && nearbyParticles[0].particle && nearbyParticles[0].particle.article) {
              const closestCategory = nearbyParticles[0].particle.article.category.toLowerCase();
              const matchingWord = words.find(word => 
                closestCategory.includes(word) || word.includes(closestCategory)
              );
              setHighlightedWord(matchingWord || words[Math.floor(Math.random() * words.length)]);
            } else {
              setHighlightedWord(words[Math.floor(Math.random() * words.length)] || '');
            }
          } else {
            setCursorWords(['explore', 'discover']);
            setHighlightedWord('explore');
          }
        } else {
          setCursorWords([]);
          setHighlightedWord('');
          
          // Clear word cycling interval when not connected
          if (wordCycleInterval.current) {
            clearInterval(wordCycleInterval.current);
            wordCycleInterval.current = null;
          }
        }
      }

      // Only update persistent images system and draw them in idle mode
      const connectedParticleIds = new Set(nearbyParticles.map(item => item.particle.article.id));
      updatePersistentImages(connectedParticleIds, now);
      
      // Always draw persistent images for natural fade behavior
      persistentImages.current.forEach((imageData, particleId) => {
        if (imageData.fadeAlpha > 0) {
          // Find the particle to get its current screen position
          const particle = particlesRef.current.find(p => p.article.id === particleId);
          if (particle && particle.z > MIN_Z_DISTANCE && particle.screenSize > 0.1 && 
              particle.screenX > -150 && particle.screenX < width + 150 &&
              particle.screenY > -150 && particle.screenY < height + 150) {
            
            const bookImg = imageData.img;
            if (bookImg.complete && bookImg.naturalWidth > 0) {
              // Calculate image size
              const maxSize = 100;
              const aspectRatio = bookImg.naturalWidth / bookImg.naturalHeight;
              let imgWidth, imgHeight;
              
              if (aspectRatio > 1) {
                imgWidth = Math.min(maxSize, bookImg.naturalWidth);
                imgHeight = imgWidth / aspectRatio;
              } else {
                imgHeight = Math.min(maxSize, bookImg.naturalHeight);
                imgWidth = imgHeight * aspectRatio;
              }
              
              // Position image near the particle
              const imgX = particle.screenX - imgWidth / 2;
              const imgY = particle.screenY - imgHeight / 2;
              
              // Save context for border radius and alpha
              ctx.save();
              
              // Create rounded rectangle path
              const radius = 5;
              ctx.beginPath();
              ctx.moveTo(imgX + radius, imgY);
              ctx.lineTo(imgX + imgWidth - radius, imgY);
              ctx.quadraticCurveTo(imgX + imgWidth, imgY, imgX + imgWidth, imgY + radius);
              ctx.lineTo(imgX + imgWidth, imgY + imgHeight - radius);
              ctx.quadraticCurveTo(imgX + imgWidth, imgY + imgHeight, imgX + imgWidth - radius, imgY + imgHeight);
              ctx.lineTo(imgX + radius, imgY + imgHeight);
              ctx.quadraticCurveTo(imgX, imgY + imgHeight, imgX, imgY + imgHeight - radius);
              ctx.lineTo(imgX, imgY + radius);
              ctx.quadraticCurveTo(imgX, imgY, imgX + radius, imgY);
              ctx.closePath();
              
              // Clip to rounded rectangle
              ctx.clip();
              
              // Apply smooth fade alpha with depth
              const depthFade = 1 - (particle.z / TUNNEL_LENGTH);
              ctx.globalAlpha = imageData.fadeAlpha * 0.9 * depthFade;
              
              ctx.drawImage(bookImg, imgX, imgY, imgWidth, imgHeight);
              
              // Restore context
              ctx.restore();
            }
          }
        }
      });
    }

    // Draw Aurora Borealis effect at the bottom of the screen
    if (showAurora) {
      auroraTimeRef.current += 0.008; // Slow animation speed
      
      const auroraHeight = height * 0.5; // Aurora takes up bottom 50% of screen
      const auroraStartY = height - auroraHeight;
      
      // Create multiple layers of aurora for depth - more vibrant colors
      const layers = [
        { speed: 1, intensity: 0.6, offset: 0, colors: ['#00ff88', '#0088ff', '#8800ff'] },
        { speed: 1.5, intensity: 0.4, offset: Math.PI / 3, colors: ['#44ff44', '#4488ff', '#aa44ff'] },
        { speed: 0.7, intensity: 0.8, offset: Math.PI / 2, colors: ['#88ffaa', '#88aaff', '#cc88ff'] }
      ];
      
      layers.forEach((layer) => {
        // Create gradient for each layer
        const gradient = ctx.createLinearGradient(0, auroraStartY, 0, height);
        
        // Sample multiple points along the gradient for smooth color transitions
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const waveTime = auroraTimeRef.current * layer.speed + layer.offset;
          
          // Create wave motion for color intensity
          const wave1 = Math.sin(waveTime + t * Math.PI * 3) * 0.5 + 0.5;
          const wave2 = Math.sin(waveTime * 0.7 + t * Math.PI * 2) * 0.5 + 0.5;
          const wave3 = Math.sin(waveTime * 1.3 + t * Math.PI * 4) * 0.5 + 0.5;
          
          // Blend colors based on wave patterns - more vivid
          const r = Math.floor(
            (parseInt(layer.colors[0].substr(1, 2), 16) * wave1 +
            parseInt(layer.colors[1].substr(1, 2), 16) * wave2 +
            parseInt(layer.colors[2].substr(1, 2), 16) * wave3) / 2
          );
          
          const g = Math.floor(
            (parseInt(layer.colors[0].substr(3, 2), 16) * wave1 +
            parseInt(layer.colors[1].substr(3, 2), 16) * wave2 +
            parseInt(layer.colors[2].substr(3, 2), 16) * wave3) / 2
          );
          
          const b = Math.floor(
            (parseInt(layer.colors[0].substr(5, 2), 16) * wave1 +
            parseInt(layer.colors[1].substr(3, 2), 16) * wave2 +
            parseInt(layer.colors[2].substr(5, 2), 16) * wave3) / 2
          );
          
          // Apply intensity and create gradient stops
          const alpha = layer.intensity * (0.3 + 0.7 * Math.sin(t * Math.PI));
          gradient.addColorStop(t, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        }
        
        // Draw the aurora layer
        ctx.fillStyle = gradient;
        ctx.fillRect(0, auroraStartY, width, auroraHeight);
      });
    }

    // Continue animation loop
    animationRef.current = requestAnimationFrame(draw);
  }, [
    backgroundColor, 
    particleColor, 
    showParticles, 
    showAurora, 
    linearPhase, 
    keptIdsRef, 
    fadeStartRef, 
    gatherStartRef, 
    isMobile, 
    onWordUpdate, 
    spiderDisabled, 
    getConnectedParticles, 
    updatePersistentImages, 
    persistentImages, 
    updateCameraAnimation, 
    cameraRotationProgress, 
    isAboutModalOpen, 
    onAboutModalReady,
    updateParticles
  ]);

  // Event handlers
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = event.clientX - rect.left;
    mouseRef.current.y = event.clientY - rect.top;
    
    // Track mouse movement for word updates
    isMouseMoving.current = true;
    
    // Clear previous mouse stop timeout
    if (mouseStopTimeout.current) {
      clearTimeout(mouseStopTimeout.current);
    }
    
    // Set timeout to detect when mouse stops moving
    mouseStopTimeout.current = setTimeout(() => {
      isMouseMoving.current = false;
      // Clear word cycling when mouse stops
      if (wordCycleInterval.current) {
        clearInterval(wordCycleInterval.current);
        wordCycleInterval.current = null;
      }
    }, 200); // Mouse considered stopped after 200ms of no movement
  }, []);

  const handleClick = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Don't handle clicks if mouse is over navigation area
    if (isMouseOverNavigation(clickX, clickY, canvas.width, canvas.height)) {
      return;
    }

    // Check if any modal is open - if so, trigger canvas click handler
    if (isAnyModalOpen && onCanvasClick) {
      onCanvasClick();
    } else {
      // No modal open, show modal for current position
      showModalForCurrentPosition();
    }
  }, [isAnyModalOpen, onCanvasClick, showModalForCurrentPosition, isMouseOverNavigation]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeParticles();
  }, [initializeParticles]);

  // Effects
  useEffect(() => {
    if (searchTrigger) {
      openModalFromSearch(searchTrigger);
    }
  }, [searchTrigger, openModalFromSearch]);

  useEffect(() => {
    if (canvasClickTrigger > 0) {
      showModalForCurrentPosition();
    }
  }, [canvasClickTrigger, showModalForCurrentPosition]);

  // Fixed effect: Only trigger camera rotation for about modal
  useEffect(() => {
    if (aboutCameraActiveTrigger > 0 && isAboutModalOpen) {
      startCameraRotation(true, onAboutModalReady);
    }
  }, [aboutCameraActiveTrigger, isAboutModalOpen, startCameraRotation, onAboutModalReady]);

  // Fixed effect: Better management of camera state
  useEffect(() => {
    if (isAboutModalOpen && !isCameraRotating && cameraRotationProgress.current === 0) {
      // About modal is open but camera hasn't started rotating yet
      cameraRotationProgress.current = 1; // Full rotation
    } else if (!isAboutModalOpen && cameraRotationProgress.current === 1 && !isCameraRotating) {
      // About modal closed, rotate back to normal
      startCameraRotation(false);
    } else if (!isAboutModalOpen && !isCameraRotating && cameraRotationProgress.current > 0) {
      // Ensure camera is fully reset when about modal is closed
      cameraRotationProgress.current = 0;
      resetCameraState();
    }
  }, [isAboutModalOpen, isCameraRotating, startCameraRotation, resetCameraState]);

  const handleCloseModal = useCallback(() => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setModalArticles([]);
      setIsModalClosing(false);
      if (onModalClose) {
        onModalClose();
      }
    }, 150);
  }, [onModalClose]);

  useEffect(() => {
    if (shouldCloseModal && showModal) {
      handleCloseModal();
    }
  }, [shouldCloseModal, showModal, handleCloseModal]);

  // Note: Removed the effect that reinitializes particles when linear mode changes
  // The animation is now handled within useParticlePhysics hook
  // Chrome flicker mitigation on linear toggle: flush a frame before heavy updates
  useEffect(() => {
    if (isLinearMode) {
      // Prepare kept subset (~25%) and begin fading phase
      const allParticles = particlesRef.current;
      const kept = new Set<number>();
      for (let i = 0; i < allParticles.length; i++) {
        if (i % 4 === 0) kept.add(allParticles[i].article.id);
      }
      keptIdsRef.current = kept;
      // Build strip article list in the same order
      const articles: Article[] = allParticles
        .filter((_, idx) => idx % 4 === 0)
        .map(p => p.article);
      setStripArticles(articles);
      // Capture reveal origins (approx from gathered center visuals)
      const origins = allParticles
        .filter((_, idx) => idx % 4 === 0)
        .map(p => ({ x: p.screenX, y: p.screenY, size: Math.max(50, Math.min(100, p.screenSize * 30)) }));
      setRevealFrom(origins);
      fadeStartRef.current = Date.now();
      gatherStartRef.current = 0;
      setLinearPhase('fading');
      // Hide the initial compositor glitch
      const canvas = canvasRef.current;
      if (canvas) {
        const prev = canvas.style.opacity;
        canvas.style.opacity = '0.995';
        requestAnimationFrame(() => { canvas.style.opacity = prev || '1'; });
      }
    } else {
      // Reset to idle
      setLinearPhase('idle');
      keptIdsRef.current = new Set();
      setStripArticles([]);
      fadeStartRef.current = 0;
      gatherStartRef.current = 0;
      revealStartRef.current = 0;
    }
  }, [isLinearMode]);

  // Auto-advance from reveal to strip after reveal animation completes
  useEffect(() => {
    if (linearPhase === 'reveal') {
      revealStartRef.current = Date.now();
      const tm = setTimeout(() => setLinearPhase('strip'), 900);
      return () => clearTimeout(tm);
    }
  }, [linearPhase]);

  // Notify parent component of animation state changes
  useEffect(() => {
    if (onAnimationStateChange) {
      onAnimationStateChange(isAnimating);
    }
  }, [isAnimating, onAnimationStateChange]);

  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize particles
    initializeParticles();

    return () => {
      if (wordCycleInterval.current) {
        clearInterval(wordCycleInterval.current);
      }
      if (mouseStopTimeout.current) {
        clearTimeout(mouseStopTimeout.current);
      }
    };
  }, [initializeParticles]);

  // Start animation loop
  useEffect(() => {
    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
    };
  }, [handleMouseMove, handleResize, handleClick]);

  return (
    <>
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          zIndex: 1,
          cursor: 'none',
          willChange: 'transform, opacity',
          transform: 'translateZ(0)'
        }}
      />
      
      {/* Control Buttons */}
      <div className="fixed bottom-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setShowColorPicker(true)}
          className="bg-gray-700/80 hover:bg-gray-600/80 text-white p-2 rounded-full shadow-lg transition-colors"
          title="Customize Colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3V1m0 20v-2m5-9h12m-12 4h8m-8-8h12" />
          </svg>
        </button>
        
        <button
          onClick={() => setShowParticles(!showParticles)}
          className="bg-gray-700/80 hover:bg-gray-600/80 text-white p-2 rounded-full shadow-lg transition-colors"
          title={showParticles ? "Hide Particles" : "Show Particles"}
        >
          {showParticles ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L14.12 14.12m-4.242-4.242L5.636 5.636m8.484 8.484l4.242 4.242M9.878 9.878L14.12 14.12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => setShowAurora(!showAurora)}
          className="bg-gray-700/80 hover:bg-gray-600/80 text-white p-2 rounded-full shadow-lg transition-colors"
          title={showAurora ? "Hide Aurora" : "Show Aurora"}
        >
          {showAurora ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>
      </div>

      {showModal && (
        <ArticleModal
          articles={modalArticles}
          position={modalPosition}
          modalType={modalTypes[modalType]}
          onClose={handleCloseModal}
          isClosing={isModalClosing}
        />
      )}
      
      <ColorPicker
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onBackgroundColorChange={setBackgroundColor}
        onParticleColorChange={setParticleColor}
        currentBackgroundColor={backgroundColor}
        currentParticleColor={particleColor}
      />

      {/* Custom Word Cursor */}
      <WordCursor
        words={cursorWords}
        position={mouseRef.current}
        highlightedWord={highlightedWord}
        hideOverNavigation={isMouseOverNavigation(mouseRef.current.x, mouseRef.current.y, window.innerWidth, window.innerHeight)}
      />

      {/* Linear strip overlay once particles have gathered */}
      <LinearStrip
        articles={stripArticles}
        visible={linearPhase === 'reveal' || linearPhase === 'strip'}
        phase={linearPhase === 'reveal' ? 'reveal' : 'strip'}
        revealFrom={revealFrom}
      />
    </>
  );
};

export default ParticleUniverse;