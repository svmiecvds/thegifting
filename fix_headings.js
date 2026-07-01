const fs = require('fs');
const path = require('path');

const files = [
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
    
    // Replace the previous incorrect styling with the correct one
    html = html.replace(/display:\s*inline-block;\n\s*line-height:\s*1;/g, "line-height: 1.5;");
    
    fs.writeFileSync(filePath, html);
    console.log('Fixed font specs in', file);
});
