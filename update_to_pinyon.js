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
    'result.html',
    'index.html' // Just in case, though it already has it
];

const pinyonLink = '<link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap" rel="stylesheet">';

files.forEach(file => {
    let filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Ensure Pinyon Script is linked in head
    if (!html.includes('family=Pinyon+Script')) {
        html = html.replace('</head>', `    ${pinyonLink}\n</head>`);
    }
    
    // Replace --font-heading
    html = html.replace(/--font-heading:\s*'Pacifico',\s*cursive;/g, "--font-heading: 'Pinyon Script', cursive;");
    
    // Replace any hardcoded Pacifico font-family
    html = html.replace(/font-family:\s*'Pacifico',\s*cursive;/g, "font-family: 'Pinyon Script', cursive;");
    html = html.replace(/font-family:\s*Pacifico;/g, "font-family: 'Pinyon Script', cursive;");

    fs.writeFileSync(filePath, html);
    console.log('Updated font to Pinyon Script in', file);
});
