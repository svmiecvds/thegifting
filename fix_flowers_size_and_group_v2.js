const fs = require('fs');
let html = fs.readFileSync('flowers.html', 'utf8');

// 1. Group flowers for flowers-layout
const flowerGroups = [
    [1, 4, 5, 6, 10, 14], // Lilies
    [2, 11],             // Roses
    [3, 7, 8, 9, 12, 13] // Tulips
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

// 2. Fix spawnElement function
const spawnElementRegex = /function spawnElement\(src, type, name\) \{[\s\S]*?(?=function updateSelectionUI\(\) \{)/g;
const fixedSpawnElement = `function spawnElement(src, type, name) {
        // Hide placeholder
        if (placeholderMsg) {
            placeholderMsg.style.opacity = "0";
            setTimeout(() => {
                if (placeholderMsg) placeholderMsg.style.display = "none";
            }, 300);
        }

        const el = document.createElement("img");
        
        // Base dimensions: bouquet wrap holder should be larger by default
        let defaultDim = 120;
        if (type === 'holder') {
            // Remove any existing holder so only one can be selected at a time
            const existingHolders = document.querySelectorAll("#customScene .draggableBouquetItem[data-type='holder']");
            existingHolders.forEach(h => h.remove());
            
            defaultDim = 200;
        } else if (type === 'bow') {
            defaultDim = 90;
        }

        el.onload = function() {
            if (type === 'flower' || type === 'leaf') {
                const ratio = el.naturalHeight / (el.naturalWidth || 1);
                const w = 100;
                const h = 100 * ratio;
                el.style.width = w + "px";
                el.style.height = h + "px";
                el.style.left = (300 - w / 2) + "px";
                el.style.top = (300 - h / 2) + "px";
            }
        };

        el.src = src;
        el.className = "draggableAccessory draggableBouquetItem";
        el.style.position = "absolute";
        
        if (type !== 'flower' && type !== 'leaf') {
            el.style.width = defaultDim + "px";
            el.style.height = defaultDim + "px";
            
            // Center the element
            el.style.left = (300 - defaultDim / 2) + "px";
            el.style.top = (300 - defaultDim / 2) + "px";
        }
        
        el.style.zIndex = highestZ++;
        el.draggable = false;
        
        // Track state
        el.dataset.rotation = "0";
        el.dataset.flip = "1";
        el.dataset.type = type;
        el.dataset.name = name;

        customScene.appendChild(el);
        selectElement(el);
    }

    /* -------------------- */
    /* SELECTION LOGIC      */
    /* -------------------- */
    `;

html = html.replace(spawnElementRegex, fixedSpawnElement);

fs.writeFileSync('flowers.html', html);
console.log('Update v2 complete');
