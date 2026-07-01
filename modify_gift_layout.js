const fs = require('fs');

let html = fs.readFileSync('gift.html', 'utf8');

// 1. Remove customPanel HTML
html = html.replace(/<div id="customPanel">[\s\S]*?<\/div>\s*<div id="giftScene">/, '<div id="giftScene">');

// 2. Modify assetPanel HTML
const assetPanelRegex = /<div id="assetPanel">([\s\S]*?)<\/div>\s*<\/div>\s*<div id="noteEditor">/;
const assetPanelMatch = html.match(assetPanelRegex);

if (assetPanelMatch) {
    const newAssetPanel = `
    <div id="assetPanel">
        <button id="addTextBtn" class="giftControlBtn" style="margin: 0 auto 15px auto; display: block;">
             Add Text
        </button>
        <div class="asset-columns" style="display: flex; gap: 15px; justify-content: space-around;">
            <div class="asset-column" style="display: flex; flex-direction: column; align-items: center; width: 50%;">
                <h2>Notes</h2>
                <img src="assets/final page/note1.png" class="noteTemplate">
                <img src="assets/final page/note2.png" class="noteTemplate">
                <img src="assets/final page/note3.png" class="noteTemplate">
                <img src="assets/final page/note4.png" class="noteTemplate">
                <img src="assets/final page/note5.png" class="noteTemplate">
                <img src="assets/final page/note6.png" class="noteTemplate">
            </div>
            <div class="asset-column" style="display: flex; flex-direction: column; align-items: center; width: 50%;">
                <h2>Stickers</h2>
                <img src="assets/final page/sticker1.png" class="stickerTemplate">
                <img src="assets/final page/sticker 2.png" class="stickerTemplate">
                <img src="assets/final page/sticker3.png" class="stickerTemplate">
                <img src="assets/final page/sticker_clip_purple.png" class="stickerTemplate" alt="Purple Binder Clip">
                <img src="assets/final page/sticker_pin_red.png" class="stickerTemplate" alt="Red Pushpin">
                <img src="assets/final page/sticker_clip_beige.png" class="stickerTemplate" alt="Beige Binder Clip">
                <img src="assets/final page/sticker_clip_pink.png" class="stickerTemplate" alt="Pink Binder Clip">
                <img src="assets/final page/sticker_clip_blue.png" class="stickerTemplate" alt="Blue Binder Clip">
                <img src="assets/final page/sticker_camera.png" class="stickerTemplate" alt="Camera">
            </div>
        </div>
    </div>
</div>
<div id="noteEditor">`;
    html = html.replace(assetPanelRegex, newAssetPanel);
}

// 3. Update CSS width for assetPanel
// Find `#customPanel, \n #assetPanel { \n width: 240px;` and change it to 340px;
html = html.replace(/width:\s*240px;/g, 'width: 320px;');

// 4. Remove flip event listener
html = html.replace(/\/\* Flip selected sideways \*\/[\s\S]*?\}\s*\);\s*/, '');

fs.writeFileSync('gift.html', html);
console.log('Success');
