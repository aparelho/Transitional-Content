import { useRef, useCallback, useState, useEffect } from 'react';
import { Particle } from '../data/particleData';
import { 
  random, 
  project3D, 
  TUNNEL_RADIUS, 
  TUNNEL_LENGTH, 
  FORWARD_SPEED, 
  MIN_Z_DISTANCE,
  FOCAL_LENGTH
} from '../utils/particleUtils';
import { generateMockArticle } from '../data/particleData';

interface ParticleTarget {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export function useParticlePhysics(isMobile: boolean, isLinearMode: boolean = false) {
  const particlesRef = useRef<Particle[]>([]);
  const cameraRotationProgress = useRef<number>(0);
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const animationProgress = useRef<number>(0);
  const animationStartTime = useRef<number>(0);
  const particleTargets = useRef<ParticleTarget[]>([]);
  const particleOriginals = useRef<ParticleTarget[]>([]);
  const previousLinearMode = useRef<boolean>(isLinearMode);
  
  const ANIMATION_DURATION = 1500; // 1.5 seconds

  const initializeParticles = useCallback(() => {
    // Reduce particles on mobile for better performance
    const numParticles = isMobile ? 750 : 1505;
    particlesRef.current = [];
    
    for (let i = 0; i < numParticles; i++) {
      let x, y, z, baseVx, baseVy, baseVz;
      
      if (isLinearMode) {
        // Linear mode: arrange particles in a horizontal line at vertical center
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const lineLength = screenWidth * 2; // Make line longer than screen
        
        // Distribute particles along horizontal line
        x = random(-lineLength / 2, lineLength / 2);
        y = 0; // All particles at vertical center (relative to 3D world)
        z = random(200, 800); // Various depths for some variation
        
        baseVx = random(-0.2, 0.2); // Gentle horizontal movement
        baseVy = 0; // No vertical movement
        baseVz = 0; // No forward/backward movement in linear mode
      } else {
        // Normal tunnel distribution
        const angle = random(0, Math.PI * 2);
        const radius = random(50, TUNNEL_RADIUS);
        z = random(50, TUNNEL_LENGTH);
        
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;
        
        baseVx = random(-0.05, 0.05); // Even slower lateral movement
        baseVy = random(-0.05, 0.05); // Even slower lateral movement
        baseVz = -FORWARD_SPEED; // Move forward through tunnel
      }
      
      const projected = project3D(x, y, z, window.innerWidth, window.innerHeight, 0);
      
      particlesRef.current.push({
        x,
        y,
        z,
        vx: baseVx,
        vy: baseVy,
        vz: baseVz,
        baseVx: baseVx,
        baseVy: baseVy,
        baseVz: baseVz,
        size: random(2, 4),
        article: generateMockArticle(i),
        screenX: projected.x,
        screenY: projected.y,
        screenSize: projected.size
      });
    }
  }, [isMobile]);

  // Easing function for smooth animations
  const easeInOutCubic = useCallback((t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  // Calculate target positions for particles based on mode
  const calculateTargetPositions = useCallback((targetLinearMode: boolean): ParticleTarget[] => {
    return particlesRef.current.map((particle, i) => {
      if (targetLinearMode) {
        // Linear mode: arrange particles in a horizontal line
        const screenWidth = window.innerWidth;
        const lineLength = screenWidth * 2;
        
        return {
          x: random(-lineLength / 2, lineLength / 2),
          y: 0,
          z: random(200, 800),
          vx: random(-0.2, 0.2),
          vy: 0,
          vz: 0
        };
      } else {
        // Tunnel mode: create new tunnel positions
        const angle = random(0, Math.PI * 2);
        const radius = random(50, TUNNEL_RADIUS);
        const z = random(50, TUNNEL_LENGTH);
        
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: z,
          vx: random(-0.05, 0.05),
          vy: random(-0.05, 0.05),
          vz: -FORWARD_SPEED
        };
      }
    });
  }, []);

  // Start animation when mode changes
  const startModeTransition = useCallback((targetLinearMode: boolean) => {
    if (isAnimating) return; // Don't start new animation if one is already running
    
    // Store original positions
    particleOriginals.current = particlesRef.current.map(particle => ({
      x: particle.x,
      y: particle.y,
      z: particle.z,
      vx: particle.vx,
      vy: particle.vy,
      vz: particle.vz
    }));
    
    // Calculate target positions
    particleTargets.current = calculateTargetPositions(targetLinearMode);
    
    // Start animation
    setIsAnimating(true);
    animationProgress.current = 0;
    animationStartTime.current = Date.now();
  }, [isAnimating, calculateTargetPositions]);

  // Check if linear mode changed and start transition
  useEffect(() => {
    if (previousLinearMode.current !== isLinearMode && particlesRef.current.length > 0) {
      startModeTransition(isLinearMode);
    }
    previousLinearMode.current = isLinearMode;
  }, [isLinearMode, startModeTransition]);

  const updateParticles = useCallback((canvasWidth: number, canvasHeight: number) => {
    const now = Date.now();
    
    // Handle animation if in progress
    if (isAnimating) {
      const elapsed = now - animationStartTime.current;
      const rawProgress = elapsed / ANIMATION_DURATION;
      
      if (rawProgress >= 1) {
        // Animation complete
        animationProgress.current = 1;
        setIsAnimating(false);
        
        // Set final positions and velocities
        for (let i = 0; i < particlesRef.current.length; i++) {
          const particle = particlesRef.current[i];
          const target = particleTargets.current[i];
          
          particle.x = target.x;
          particle.y = target.y;
          particle.z = target.z;
          particle.vx = target.vx;
          particle.vy = target.vy;
          particle.vz = target.vz;
          particle.baseVx = target.vx;
          particle.baseVy = target.vy;
          particle.baseVz = target.vz;
        }
      } else {
        // Interpolate positions during animation
        animationProgress.current = easeInOutCubic(rawProgress);
        
        for (let i = 0; i < particlesRef.current.length; i++) {
          const particle = particlesRef.current[i];
          const original = particleOriginals.current[i];
          const target = particleTargets.current[i];
          const progress = animationProgress.current;
          
          // Interpolate position
          particle.x = original.x + (target.x - original.x) * progress;
          particle.y = original.y + (target.y - original.y) * progress;
          particle.z = original.z + (target.z - original.z) * progress;
          
          // Interpolate velocity (for smooth transition of movement)
          particle.vx = original.vx + (target.vx - original.vx) * progress;
          particle.vy = original.vy + (target.vy - original.vy) * progress;
          particle.vz = original.vz + (target.vz - original.vz) * progress;
          particle.baseVx = particle.vx;
          particle.baseVy = particle.vy;
          particle.baseVz = particle.vz;
        }
      }
    } else {
      // Normal particle physics when not animating
      for (let particle of particlesRef.current) {
        if (isLinearMode) {
          // Linear mode: simple horizontal movement
          particle.x += particle.baseVx;
          // Keep y at center
          particle.y = 0;
          // No z movement
          
          // Wrap particles around when they go too far off screen
          const lineLength = canvasWidth * 2;
          if (particle.x > lineLength / 2) {
            particle.x = -lineLength / 2;
          } else if (particle.x < -lineLength / 2) {
            particle.x = lineLength / 2;
          }
        } else {
          // Normal tunnel mode
          const rotationSpeed = 0.0001; // Even slower rotation
          
          // Normal particle movement
          particle.x += particle.baseVx;
          particle.y += particle.baseVy;
          particle.z += particle.baseVz;
          
          // Apply global rotation around the tunnel axis (z-axis)
          const radius = Math.sqrt(particle.x * particle.x + particle.y * particle.y);
          if (radius > 0) {
            const angle = Math.atan2(particle.y, particle.x);
            const newAngle = angle + rotationSpeed;
            particle.x = Math.cos(newAngle) * radius;
            particle.y = Math.sin(newAngle) * radius;
          }
          
          // Loop particles when they reach the minimum distance from camera
          if (particle.z <= MIN_Z_DISTANCE) {
            particle.z = TUNNEL_LENGTH;
            // Regenerate position in tunnel
            const newAngle = random(0, Math.PI * 2);
            const newRadius = random(50, TUNNEL_RADIUS);
            particle.x = Math.cos(newAngle) * newRadius;
            particle.y = Math.sin(newAngle) * newRadius;
          }
        }
      }
    }
    
    // Always project to 2D screen coordinates
    for (let particle of particlesRef.current) {
      const projected = project3D(particle.x, particle.y, particle.z, canvasWidth, canvasHeight, cameraRotationProgress.current);
      particle.screenX = projected.x;
      particle.screenY = projected.y;
      particle.screenSize = projected.size;
    }
  }, [isLinearMode, isAnimating, easeInOutCubic]);

  return {
    particlesRef,
    cameraRotationProgress,
    initializeParticles,
    updateParticles,
    isAnimating
  };
}