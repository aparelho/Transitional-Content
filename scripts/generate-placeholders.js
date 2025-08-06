import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const outputDir = 'public/images';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create a simple placeholder image
function createPlaceholderImage(filename, width = 400, height = 600) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Create a gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#4a90e2');
  gradient.addColorStop(1, '#357abd');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add some text
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Book Cover', width / 2, height / 2);
  ctx.fillText('Placeholder', width / 2, height / 2 + 30);
  
  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, filename), buffer);
  console.log(`Generated: ${filename}`);
}

// Generate placeholder images
const imageNames = [
  'book1.png', 'book2.png', 'book3.png', 'book4.png', 'book5.png',
  'book6.png', 'book7.png', 'book8.png', 'book9.png', 'book10.png',
  'book11.png', 'book12.png', 'book13.png', 'book14.png', 'book15.png',
  'search-icon.png'
];

imageNames.forEach(name => {
  if (name === 'search-icon.png') {
    createPlaceholderImage(name, 24, 24);
  } else {
    createPlaceholderImage(name);
  }
});

console.log('All placeholder images generated!');
