const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const replacements = [
    // Very light backgrounds
    { from: /#fff5fb/ig, to: '#fef2f4' },
    { from: /#ffeaf5/ig, to: '#fef2f4' },
    
    // Light backgrounds
    { from: /#ffe4f1/ig, to: '#fce0e5' },
    { from: /#ffd6ef/ig, to: '#fce0e5' },
    
    // Medium light (borders, gradients)
    { from: /#ffc2e0/ig, to: '#fac5cf' },
    { from: /#ffb3d9/ig, to: '#fac5cf' },
    { from: /#ffb6d9/ig, to: '#fac5cf' },
    
    // Vibrant/Active (buttons, hovers)
    { from: /#ff69b4/ig, to: '#B71A3D' },  
    { from: /#ff80c0/ig, to: '#df244e' },
    { from: /#ff4fa2/ig, to: '#df244e' },
    { from: /#ff9ccb/ig, to: '#df244e' },
    
    // rgba equivalent of #ffe4f1
    { from: /rgba\(255,\s*228,\s*241,\s*0\.85\)/ig, to: 'rgba(252, 224, 229, 0.85)' },
    { from: /rgba\(255,\s*105,\s*180,\s*0\.2\)/ig, to: 'rgba(183, 26, 61, 0.2)' }, // hotpink 0.2
    { from: /rgba\(255,\s*182,\s*193,\s*0\.4\)/ig, to: 'rgba(250, 197, 207, 0.4)' }, // pink 0.4
    { from: /rgba\(255,\s*182,\s*193,\s*0\.6\)/ig, to: 'rgba(250, 197, 207, 0.6)' }, // pink 0.6
    { from: /rgba\(255,\s*105,\s*180,\s*0\.8\)/ig, to: 'rgba(183, 26, 61, 0.8)' }, // hotpink 0.8

    // String color names (hotpink is safe globally as a word)
    { from: /\bhotpink\b/ig, to: '#B71A3D' },
    
    // 'pink' as a CSS value
    { from: /:\s*pink\s*;/g, to: ': #fac5cf;' },
    { from: /:\s*pink\s*!important/g, to: ': #fac5cf !important' },
    { from: /,\s*pink\s*\)/g, to: ', #fac5cf)' },
    { from: /\s+pink\s*,/g, to: ' #fac5cf,' }
];

files.forEach(file => {
    let filePath = path.join(__dirname, file);
    let html = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(rep => {
        html = html.replace(rep.from, rep.to);
    });

    fs.writeFileSync(filePath, html);
    console.log('Updated pinks to #B71A3D shades in', file);
});
