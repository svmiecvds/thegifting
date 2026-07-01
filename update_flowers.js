const fs = require('fs');
let html = fs.readFileSync('flowers.html', 'utf8');

let flowerCards = '';
let spawnerItems = '';
for(let i=1; i<=14; i++) {
    flowerCards += `
                <div class="flowerCard">
                    <img src="assets/flowers/flower${i}.png" alt="Flower ${i}" class="flowerImage">
                    <div class="flowerName">Flower ${i}</div>
                    <div class="flowerSelector">
                        <button class="minusBtn" data-flower="${i}">−</button>
                        <span class="flowerQuantity" id="qtyFlower${i}">1</span>
                        <button class="plusBtn" data-flower="${i}">+</button>
                    </div>
                    <button class="addToCartBtn shiny-cta" data-flower="${i}" data-name="Flower ${i}" data-image="assets/flowers/flower${i}.png"><span>Add To Cart </span></button>
                </div>`;
                
    spawnerItems += `
                        <div class="spawner-item" onclick="spawnElement('assets/flowers/flower${i}.png', 'flower', 'Flower ${i}')">
                            <img src="assets/flowers/flower${i}.png" alt="Flower ${i}">
                            <span>Flower ${i}</span>
                        </div>`;
}

const flowersLayoutRegex = /<div class="flowers-layout">[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/div>\s*<div id="bouquetMainContainer")/g;
html = html.replace(flowersLayoutRegex, `<div class="flowers-layout">\n            <div class="flowersRowTop">${flowerCards}\n            </div>`);

const spawnerRegex = /<h2>Spawn Flowers<\/h2>\s*<div class="spawner-grid">[\s\S]*?(?=<\/div>\s*<\/div>\s*<div class="side-panel"[^>]*>\s*<h2>Spawn Leaves)/g;
html = html.replace(spawnerRegex, `<h2>Spawn Flowers</h2>\n                    <div class="spawner-grid">${spawnerItems}\n                    `);

fs.writeFileSync('flowers.html', html);
console.log('flowers.html updated');
