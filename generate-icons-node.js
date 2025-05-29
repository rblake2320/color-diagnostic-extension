// Generate Extension Icons Script
// This creates the required icon files for your Chrome extension

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

function generateIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f50057');
    
    // Draw rounded rectangle
    const radius = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add palette icon
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎨', size / 2, size / 2);
    
    return canvas.toBuffer('image/png');
}

// Generate all three sizes
const sizes = [16, 48, 128];
const extensionDir = __dirname;

sizes.forEach(size => {
    const buffer = generateIcon(size);
    const filename = path.join(extensionDir, `icon${size}.png`);
    fs.writeFileSync(filename, buffer);
    console.log(`✓ Created ${filename}`);
});

console.log('\n✅ All icons generated successfully!');
