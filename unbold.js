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
    
    // Unbold .storeHeader
    html = html.replace(/\.storeHeader\s*{([^}]+)}/g, (match, inner) => {
        if (!inner.includes('font-weight')) {
            return `.storeHeader {${inner}    font-weight: normal;\n}`;
        }
        return match.replace(/font-weight:\s*[^;]+;/, 'font-weight: normal;');
    });
    
    // Unbold .checkoutTitle and .customizeTitle
    html = html.replace(/\.checkoutTitle,\s*\.customizeTitle\s*{([^}]+)}/g, (match, inner) => {
        if (!inner.includes('font-weight')) {
            return `.checkoutTitle, .customizeTitle {${inner}    font-weight: normal;\n}`;
        }
        return match.replace(/font-weight:\s*[^;]+;/, 'font-weight: normal;');
    });

    // Unbold individual .checkoutTitle if any
    html = html.replace(/\.checkoutTitle\s*{([^}]+)}/g, (match, inner) => {
        if (match.includes('.checkoutTitle, .customizeTitle')) return match; // Skip the combined one
        if (!inner.includes('font-weight')) {
            return `.checkoutTitle {${inner}    font-weight: normal;\n}`;
        }
        return match.replace(/font-weight:\s*[^;]+;/, 'font-weight: normal;');
    });

    // Unbold .checkout-receipt h2
    if (file === 'checkout.html') {
        html = html.replace(/\.checkout-receipt\s+h2\s*{([^}]+)}/g, (match, inner) => {
            if (!inner.includes('font-weight')) {
                return `.checkout-receipt h2 {${inner}    font-weight: normal;\n}`;
            }
            return match.replace(/font-weight:\s*[^;]+;/, 'font-weight: normal;');
        });
    }

    fs.writeFileSync(filePath, html);
    console.log('Unbolded headings in', file);
});
