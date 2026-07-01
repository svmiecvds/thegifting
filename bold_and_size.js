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
    
    // Change font-weight to bold
    html = html.replace(/font-weight:\s*normal;/g, "font-weight: bold;");
    
    // Increase font size in .storeHeader (from 48px to 54px)
    html = html.replace(/\.storeHeader\s*{([^}]+)}/g, (match, inner) => {
        return match.replace(/font-size:\s*48px;/, "font-size: 56px;");
    });
    
    // Increase font size in .checkoutTitle, .customizeTitle (from 42px to 48px)
    html = html.replace(/\.checkoutTitle,\s*\.customizeTitle\s*{([^}]+)}/g, (match, inner) => {
        return match.replace(/font-size:\s*42px;/, "font-size: 50px;");
    });
    
    html = html.replace(/\.checkoutTitle\s*{([^}]+)}/g, (match, inner) => {
        if (match.includes('.checkoutTitle, .customizeTitle')) return match;
        return match.replace(/font-size:\s*42px;/, "font-size: 50px;");
    });

    // Increase font size in .checkout-receipt h2 (from 32px to 38px)
    if (file === 'checkout.html') {
        html = html.replace(/\.checkout-receipt\s+h2\s*{([^}]+)}/g, (match, inner) => {
            return match.replace(/font-size:\s*32px;/, "font-size: 38px;");
        });
    }

    fs.writeFileSync(filePath, html);
    console.log('Updated font styles in', file);
});
