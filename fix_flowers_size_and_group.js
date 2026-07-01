const fs = require('fs');
let html = fs.readFileSync('flowers.html', 'utf8');

// 1. Group flowers for flowers-layout
const flowerGroups = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11],
    [12, 13, 14]
];

let flowerCards = '';
flowerGroups.forEach((group, index) => {
    let optionsHtml = '';
    group.forEach((fId, optIndex) => {
        optionsHtml += `
            <div class="color-option ${optIndex === 0 ? 'active' : ''}" data-image="assets/flowers/flower${fId}.png" data-flower="${fId}">
                <img src="assets/flowers/flower${fId}.png" style="width: 25px; height: 25px; object-fit: contain; pointer-events: none;">
            </div>`;
    });
    
    let firstFlower = group[0];
    
    flowerCards += `
        <div class="flowerCard">
            <img src="assets/flowers/flower${firstFlower}.png" class="flowerImage" style="max-height: 150px; object-fit: contain;">
            <div class="color-scroll-container">
                ${optionsHtml}
            </div>
            <div class="flowerSelector">
                <button class="minusBtn" data-flower="${firstFlower}">−</button>
                <span class="flowerQuantity" id="qtyFlower${firstFlower}">1</span>
                <button class="plusBtn" data-flower="${firstFlower}">+</button>
            </div>
            <button class="addToCartBtn shiny-cta" data-flower="${firstFlower}" data-image="assets/flowers/flower${firstFlower}.png"><span>Add To Cart </span></button>
        </div>
    `;
});

const flowersLayoutRegex = /<div class="flowers-layout">[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<div id="bouquetMainContainer")/g;
html = html.replace(flowersLayoutRegex, `<div class="flowers-layout">\n            <div class="flowersRowTop">${flowerCards}\n            </div>`);

// 2. Remove names from spawner grid
const spawnerItemsRegex = /<div class="spawner-item" onclick="spawnElement\('([^']*)', '([^']*)', '[^']*'\)">\s*<img src="([^"]*)" alt="[^"]*">\s*<span>[^<]*<\/span>\s*<\/div>/g;
html = html.replace(spawnerItemsRegex, `<div class="spawner-item" onclick="spawnElement('$1', '$2', '')">\n                        <img src="$3" alt="">\n                    </div>`);

// 3. Remove names from flowerCards if any left (we replaced the whole layout but just in case)
// We already generated flowerCards without names!

// 4. Resize factor
const sizeRegex = /const w = el\.naturalWidth \* 0\.5;\s*const h = el\.naturalHeight \* 0\.5;/g;
html = html.replace(sizeRegex, `const w = el.naturalWidth * 0.25;\n                const h = el.naturalHeight * 0.25;`);

// 5. Add CSS
if (!html.includes('.color-scroll-container')) {
    const cssToAdd = `
.color-scroll-container {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

.color-option {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    background: rgba(255, 182, 193, 0.15);
    transition: all 0.3s ease;
}

.color-option:hover {
    background: rgba(255, 182, 193, 0.3);
    border-color: #ffb6d9;
}

.color-option.active {
    background: #ffb6d9;
    border-color: hotpink;
}
`;
    html = html.replace('</style>', cssToAdd + '\n</style>');
}

// 6. Add JS for color selection
if (!html.includes('e.target.closest(".color-option")')) {
    const jsToAdd = `
// Color Option Switching for Flowers
document.addEventListener("click", e => {
    const option = e.target.closest(".color-option");
    if (!option) return;
    
    const card = option.closest(".flowerCard");
    if (!card) return;
    
    card.querySelectorAll(".color-option").forEach(opt => opt.classList.remove("active"));
    option.classList.add("active");
    
    const newImage = option.dataset.image;
    const fId = option.dataset.flower;
    
    const mainImg = card.querySelector(".flowerImage");
    if (mainImg) {
        mainImg.src = newImage;
    }
    
    // Update the Add To Cart button
    const btn = card.querySelector(".addToCartBtn");
    if (btn) {
        btn.dataset.flower = fId;
        btn.dataset.image = newImage;
    }
    
    // Update quantity selector ID and data-flower for buttons
    const minusBtn = card.querySelector(".minusBtn");
    const plusBtn = card.querySelector(".plusBtn");
    const qtySpan = card.querySelector(".flowerQuantity");
    
    if (minusBtn) minusBtn.dataset.flower = fId;
    if (plusBtn) plusBtn.dataset.flower = fId;
    if (qtySpan) qtySpan.id = "qtyFlower" + fId;
    
    // If the qty span value is not 1, maybe reset it? (Optional, let's keep current behavior)
});
`;
    // Find the last </script> tag before </body>
    const lastScriptIdx = html.lastIndexOf('</script>');
    if (lastScriptIdx !== -1) {
        html = html.substring(0, lastScriptIdx) + jsToAdd + '\n' + html.substring(lastScriptIdx);
    }
}

fs.writeFileSync('flowers.html', html);
console.log('Update complete');
