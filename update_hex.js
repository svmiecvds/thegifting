const fs = require('fs');
const path = require('path');

const files = [
    'index.html',
    'plushies.html',
    'customize.html',
    'flowers.html',
    'treats.html',
    'checkout.html',
    'gift.html',
    'final.html',
    'result.html'
];

files.forEach(file => {
    let filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Replace the pink hex codes with #B71A3D
    html = html.replace(/#ff4fa2/gi, '#B71A3D');
    html = html.replace(/#c2185b/gi, '#B71A3D');
    
    fs.writeFileSync(filePath, html);
    console.log('Updated hex codes in', file);
});
