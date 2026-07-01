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
    
    // Update .navLink { color: ... }
    html = html.replace(/\.navLink\s*{([^}]+)}/g, (match, inner) => {
        return match.replace(/color:\s*[^;]+;/, "color: white;");
    });
    
    // Update .navLink:hover { color: ... }
    html = html.replace(/\.navLink:hover\s*{([^}]+)}/g, (match, inner) => {
        return match.replace(/color:\s*[^;]+;/, "color: white;");
    });
    
    // Update .navLink.active { color: ... }
    html = html.replace(/\.navLink\.active\s*{([^}]+)}/g, (match, inner) => {
        return match.replace(/color:\s*[^;]+;/, "color: white;");
    });

    fs.writeFileSync(filePath, html);
    console.log('Updated navLink colors in', file);
});
