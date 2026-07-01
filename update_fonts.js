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

const fontLinks = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bentham&family=Miss+Fajardose&family=Monsieur+La+Doulaise&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Yeseva+One&display=swap" rel="stylesheet">
`;

files.forEach(file => {
    let filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Inject fonts if not already there
    if (!html.includes('family=Yeseva+One')) {
        html = html.replace('</head>', fontLinks + '</head>');
    }
    
    // Change font-heading variable
    html = html.replace(/--font-heading:\s*[^;]+;/g, "--font-heading: 'Yeseva One', serif;");
    
    // Change text and heading colors to navbar color (#B71A3D)
    html = html.replace(/--text-color:\s*#[a-fA-F0-9]+;/g, "--text-color: #B71A3D;");
    html = html.replace(/--heading-color:\s*#[a-fA-F0-9]+;/g, "--heading-color: #B71A3D;");
    html = html.replace(/--btn-text:\s*#[a-fA-F0-9]+;/g, "--btn-text: #B71A3D;");
    
    // Also, there are inline styles or other pink variables like --hero-gradient maybe?
    // User said "all other texts which are in pink right now". The variables handle most texts.
    // Let's also check for specific titles they mentioned and ensure they use the heading font if they weren't already.
    // The titles they mentioned usually have h1/h2 tags which are already styled with --font-heading or --heading-color.
    
    fs.writeFileSync(filePath, html);
    console.log('Updated', file);
});
