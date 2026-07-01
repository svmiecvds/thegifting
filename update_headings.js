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
    
    // Replace font-size: 48px in .storeHeader
    html = html.replace(/font-size:\s*48px;/g, "font-size: 130px;\n    transform: scaleX(1.15);\n    display: inline-block;\n    line-height: 1;");
    
    // Replace font-size: 42px in .checkoutTitle, .customizeTitle
    html = html.replace(/font-size:\s*42px;/g, "font-size: 130px;\n    transform: scaleX(1.15);\n    display: inline-block;\n    line-height: 1;");
    
    // Replace font-size: 32px in checkout.html (specifically for .checkout-receipt h2 if it has it)
    if (file === 'checkout.html') {
        html = html.replace(/\.checkout-receipt h2\s*{[^}]+font-size:\s*32px;[^}]+}/, match => {
            return match.replace(/font-size:\s*32px;/, "font-size: 130px;\n            transform: scaleX(1.15);\n            display: inline-block;\n            line-height: 1;");
        });
    }

    fs.writeFileSync(filePath, html);
    console.log('Updated font specs in', file);
});
