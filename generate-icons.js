// Icon generator script
// Run this in a browser console or save as an HTML file to generate icons

function generateIcons() {
    const sizes = [16, 48, 128];
    
    sizes.forEach(size => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
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
        
        // Add palette icon in center
        ctx.fillStyle = 'white';
        ctx.font = `bold ${size * 0.5}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎨', size / 2, size / 2);
        
        // Convert to blob and download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `icon${size}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    });
}

// Instructions for manual icon creation
console.log(`
=== ICON GENERATION INSTRUCTIONS ===

Option 1: Use the existing iconcreator.html file
1. Open iconcreator.html in your browser
2. Right-click each icon and save as:
   - icon16.png
   - icon48.png
   - icon128.png

Option 2: Use this script
1. Copy the generateIcons() function above
2. Open any webpage (like google.com)
3. Open DevTools (F12)
4. Paste the function in the console
5. Run: generateIcons()
6. The icons will download automatically

Option 3: Create simple colored squares
1. Use any image editor (Paint, GIMP, etc.)
2. Create 3 images with these sizes:
   - 16x16 pixels
   - 48x48 pixels
   - 128x128 pixels
3. Fill with any color (purple recommended)
4. Save as icon16.png, icon48.png, icon128.png
`);