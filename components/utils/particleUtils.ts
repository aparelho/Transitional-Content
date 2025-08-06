// Utility functions for particle physics and calculations
export const random = (min: number, max?: number) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return Math.random() * (max - min) + min;
};

export const distance = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

export const distance3D = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
};

export const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};

// 3D projection constants
export const CAMERA_Z = 0;
export const MIN_Z_DISTANCE = 50; // Minimum distance from camera
export const FOCAL_LENGTH = 600;
export const TUNNEL_RADIUS = 300;
export const TUNNEL_LENGTH = 2000;
export const FORWARD_SPEED = 0.1; // Even slower movement

// Camera animation constants
export const CAMERA_ANIMATION_DURATION = 3000; // 3 seconds for smooth transition
export const TARGET_CAMERA_ANGLE = -Math.PI / 2; // 90 degrees rotation to the RIGHT (negative for right turn)
export const TARGET_CAMERA_DISTANCE = 1200; // Much bigger zoom out distance to see entire tunnel
export const TARGET_CAMERA_PAN_X = -400; // Pan to the left

// 3D to 2D projection function with camera rotation support
export const project3D = (
  x: number, 
  y: number, 
  z: number, 
  canvasWidth: number, 
  canvasHeight: number,
  cameraRotationProgress: number
) => {
  let transformedX = x;
  let transformedY = y;
  let transformedZ = z;
  
  // Apply camera rotation and zoom if active or if about modal is open
  if (cameraRotationProgress > 0) {
    const progress = Math.min(cameraRotationProgress, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
    
    // Rotate camera around Y-axis (looking at tunnel from the side) - RIGHT rotation
    const angle = TARGET_CAMERA_ANGLE * easeProgress;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    
    // Rotate coordinates
    transformedX = x * cosAngle - z * sinAngle;
    transformedZ = x * sinAngle + z * cosAngle;
    
    // Apply zoom out to see full tunnel
    const zoomOut = 1 + (TARGET_CAMERA_DISTANCE / FOCAL_LENGTH) * easeProgress;
    transformedX *= zoomOut;
    transformedY *= zoomOut;
    transformedZ *= zoomOut;
    
    // Apply pan to the left
    transformedX += TARGET_CAMERA_PAN_X * easeProgress;
    
    // When in full side view, center the tunnel better for entire length visibility
    if (progress === 1) {
      transformedZ += 1000; // Move tunnel center closer to camera for better framing of entire length
    }
  }
  
  const distance = transformedZ - CAMERA_Z;
  if (distance <= 0) return { x: 0, y: 0, size: 0 }; // Behind camera
  
  const scale = FOCAL_LENGTH / distance;
  const screenX = (transformedX * scale) + canvasWidth / 2;
  const screenY = (transformedY * scale) + canvasHeight / 2;
  const screenSize = scale * 3; // Base size of 3
  
  return { x: screenX, y: screenY, size: screenSize };
};