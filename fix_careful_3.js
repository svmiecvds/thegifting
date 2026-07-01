const fs = require('fs');

const rotateResizeHtml = `
            <div id="itemRotateBtn" style="display: none; position: absolute; z-index: 1000; cursor: pointer; background: white; border-radius: 50%; padding: 4px; border: 1px solid #ffb6d9; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4fa2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.67-1.36"/></svg>
            </div>
            <div id="itemResizeBtn" style="display: none; position: absolute; z-index: 1000; cursor: nwse-resize; background: white; border-radius: 50%; padding: 4px; border: 1px solid #ffb6d9; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4fa2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </div>
`;

const newJS = `function updateSelectionUI() {
    const deleteBtn = document.getElementById('itemDeleteBtn');
    const rotateBtn = document.getElementById('itemRotateBtn');
    const resizeBtn = document.getElementById('itemResizeBtn');
    
    if (!selectedItem) {
        if (deleteBtn) deleteBtn.style.display = 'none';
        if (rotateBtn) rotateBtn.style.display = 'none';
        if (resizeBtn) resizeBtn.style.display = 'none';
        return;
    }
    
    const l = parseFloat(selectedItem.style.left) || 0;
    const t = parseFloat(selectedItem.style.top)  || 0;
    const w = selectedItem.offsetWidth;
    const h = selectedItem.offsetHeight;
    
    const rotDeg = parseFloat(selectedItem.dataset.rotation) || 0;
    const rotRad = rotDeg * Math.PI / 180;
    
    const cx = l + w / 2;
    const cy = t + h / 2;
    
    function getRotatedPos(dx, dy) {
        const rx = cx + dx * Math.cos(rotRad) - dy * Math.sin(rotRad);
        const ry = cy + dx * Math.sin(rotRad) + dy * Math.cos(rotRad);
        return { x: rx, y: ry };
    }
    
    if (deleteBtn) {
        const pos = getRotatedPos(w/2, -h/2);
        deleteBtn.style.left = (pos.x - 12) + 'px';
        deleteBtn.style.top  = (pos.y - 12) + 'px';
        deleteBtn.style.display = 'flex';
    }
    
    if (rotateBtn) {
        const pos = getRotatedPos(-w/2, h/2);
        rotateBtn.style.left = (pos.x - 12) + 'px';
        rotateBtn.style.top  = (pos.y - 12) + 'px';
        rotateBtn.style.display = 'flex';
    }
    
    if (resizeBtn) {
        const pos = getRotatedPos(w/2, h/2);
        resizeBtn.style.left = (pos.x - 12) + 'px';
        resizeBtn.style.top  = (pos.y - 12) + 'px';
        resizeBtn.style.display = 'flex';
    }
}

function selectElement(el) {
    selectedItem = el;
    document.querySelectorAll(".draggableBouquetItem, .draggablePlushieItem, .draggableTreatsItem, .draggableAccessory").forEach(item => {
        item.classList.remove("selectedItem", "selectedAccessory");
        item.style.outline = "none";
    });
    
    if (el) {
        el.classList.add("selectedItem");
        if(el.classList.contains("draggableAccessory")) el.classList.add("selectedAccessory");
        el.style.outline = "2px dashed #ff4fa2";
        updateSelectionUI();
    } else {
        updateSelectionUI();
        customScene.style.cursor = '';
    }
}

// Fallback for selectAccessory inside customize.html
function selectAccessory(el) {
    selectElement(el);
}

let isResizing = false;
let isRotating = false;
let resizeStartX = 0, resizeStartY = 0;
let resizeStartW = 0, resizeStartH = 0;
let resizeStartLeft = 0, resizeStartTop = 0;
let rotateStartAngle = 0;
let rotateInitialElementAngle = 0;

document.addEventListener("mousedown", (e) => {
    if (e.target.closest('#itemDeleteBtn')) return;
    
    if (e.target.closest('#itemResizeBtn') && selectedItem) {
        e.stopPropagation(); e.preventDefault();
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        resizeStartW = selectedItem.offsetWidth;
        resizeStartH = selectedItem.offsetHeight;
        resizeStartLeft = parseFloat(selectedItem.style.left) || 0;
        resizeStartTop = parseFloat(selectedItem.style.top) || 0;
        return;
    }
    
    if (e.target.closest('#itemRotateBtn') && selectedItem) {
        e.stopPropagation(); e.preventDefault();
        isRotating = true;
        
        const rect = selectedItem.getBoundingClientRect();
        // Calculate center of actual element on screen
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        rotateStartAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        rotateInitialElementAngle = parseFloat(selectedItem.dataset.rotation) || 0;
        return;
    }

    const item = e.target.closest(".draggableBouquetItem, .draggablePlushieItem, .draggableTreatsItem, .draggableAccessory");
    if (item && customScene.contains(item)) {
        if (!selectedItem || selectedItem !== item) {
            selectElement(item);
        }

        selected = item;
        const rect = item.getBoundingClientRect();
        
        // Use center of item for dragging so rotation doesn't offset it weirdly?
        // Let's stick to standard dragOffsetX
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        
        if (typeof highestZ !== 'undefined') {
            item.style.zIndex = highestZ++;
        } else {
            // if highestZ is not defined, we can just use 100
            item.style.zIndex = parseInt(item.style.zIndex || "100") + 1;
        }
        e.preventDefault();
        customScene.style.cursor = 'grabbing';
    }
});

document.addEventListener("mousemove", (e) => {
    const sceneW = customScene.clientWidth;
    const sceneH = customScene.clientHeight;

    if (isResizing && selectedItem) {
        const dx = e.clientX - resizeStartX;
        
        let maxW = Math.min(sceneW - resizeStartLeft, sceneH - resizeStartTop);
        let newW = resizeStartW + dx;
        newW = Math.max(30, Math.min(newW, maxW));
        
        selectedItem.style.width = newW + "px";
        selectedItem.style.height = (newW * (resizeStartH / resizeStartW)) + "px";
        updateSelectionUI();
        return;
    }
    
    if (isRotating && selectedItem) {
        const rect = selectedItem.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        
        let angleDiff = currentAngle - rotateStartAngle;
        let newAngle = rotateInitialElementAngle + angleDiff;
        
        selectedItem.dataset.rotation = newAngle;
        let flipStr = selectedItem.dataset.flip === "-1" ? "scaleX(-1) " : "";
        selectedItem.style.transform = flipStr + "rotate(" + newAngle + "deg)";
        updateSelectionUI();
        return;
    }

    if (!selected) return;

    const rect = customScene.getBoundingClientRect();
    let left = e.clientX - rect.left - dragOffsetX;
    let top = e.clientY - rect.top - dragOffsetY;

    // Bounded within canvas bounds
    left = Math.max(0, Math.min(left, sceneW - selected.offsetWidth));
    top = Math.max(0, Math.min(top, sceneH - selected.offsetHeight));

    selected.style.left = left + "px";
    selected.style.top = top + "px";
    updateSelectionUI();
});

document.addEventListener("mouseup", () => {
    selected = null;
    isResizing = false;
    isRotating = false;
    if (selectedItem) {
        customScene.style.cursor = 'grab';
    } else {
        customScene.style.cursor = '';
    }
});

customScene.addEventListener("mousedown", (e) => {
    // Make sure we only deselect if clicking customScene directly or the mainPlushie or placeholder
    if (e.target === customScene || e.target.id === 'mainPlushie' || e.target.closest('.canvas-placeholder')) {
        selectElement(null);
    }
});

`;

// Fix flowers.html and treats.html
['flowers.html', 'treats.html'].forEach(file => {
    let html = fs.readFileSync(file, 'utf8');
    const replacePattern = /function updateSelectionUI\(\) \{[\s\S]*?(?=document\.getElementById\(['"]itemDeleteBtn['"]\)\.addEventListener\(['"]click['"])/;
    html = html.replace(replacePattern, newJS + '\n\n    ');
    fs.writeFileSync(file, html);
    console.log("Updated " + file);
});

// Fix customize.html (since it was checked out to original state)
let custom = fs.readFileSync('customize.html', 'utf8');
if (!custom.includes('id="itemRotateBtn"')) {
    custom = custom.replace('<div id="itemDeleteBtn"', rotateResizeHtml + '<div id="itemDeleteBtn"');
}

// In customize.html, we only want to replace from "let dragOffsetX = 0;" down to "document.getElementById("itemDeleteBtn").addEventListener"
// But wait, updateSelectionUI is defined higher up in customize.html!
// Let's replace the whole updateSelectionUI function
custom = custom.replace(/function updateSelectionUI\(\) \{[\s\S]*?deleteBtn\.style\.display = 'block';\s*\}/, "/* updateSelectionUI moved down */");
custom = custom.replace(/function selectAccessory\(element\) \{[\s\S]*?customScene\.style\.cursor = '';\s*\}/, "/* selectAccessory moved down */");

// Now replace from "let dragOffsetX = 0;" to "document.getElementById("itemDeleteBtn").addEventListener"
const custRegex = /let dragOffsetX = 0;[\s\S]*?(?=document\.getElementById\(['"]itemDeleteBtn['"]\)\.addEventListener\(['"]click['"])/;
custom = custom.replace(custRegex, newJS + '\n\n');
fs.writeFileSync('customize.html', custom);
console.log("Updated customize.html");

