const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcon() {
    const size = 512;
    const purple = '#4f46e5'; // Indigo-600 matching the app theme
    
    // SVG definition
    // A purple squircle with a white 'L' and text below
    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="512" height="512" fill="white" />
        
        <!-- Purple Squircle -->
        <rect x="128" y="80" width="256" height="256" rx="60" fill="${purple}" />
        
        <!-- Letter L (Cursive style approximation using paths) -->
        <text x="256" y="260" font-family="cursive, 'Brush Script MT', 'Apple Chancery'" font-size="160" fill="white" text-anchor="middle">L</text>
        
        <!-- Text Below -->
        <text x="256" y="400" font-family="cursive, 'Brush Script MT', 'Apple Chancery'" font-size="48" fill="${purple}" text-anchor="middle">Lexile</text>
        <text x="256" y="460" font-family="cursive, 'Brush Script MT', 'Apple Chancery'" font-size="48" fill="${purple}" text-anchor="middle">Spelling Master</text>
    </svg>
    `;

    const buffer = Buffer.from(svg);
    const outputPath = path.join(__dirname, '../public/logo512.png');

    // Ensure public directory exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    try {
        await sharp(buffer)
            .png()
            .toFile(outputPath);
        console.log('Icon generated successfully at public/logo512.png');
    } catch (err) {
        console.error('Error generating icon:', err);
    }
}

generateIcon();
