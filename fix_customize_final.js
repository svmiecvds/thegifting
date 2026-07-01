const fs = require('fs');

let html = fs.readFileSync('customize.html', 'utf8');
// Normalize line endings to \n
html = html.replace(/\r\n/g, '\n');

const rotateResizeHtml = `
            <div id="itemRotateBtn" style="display: none; position: absolute; z-index: 1000; cursor: pointer; background: white; border-radius: 50%; padding: 4px; border: 1px solid #ffb6d9; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4fa2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.67-1.36"/></svg>
            </div>
            <div id="itemResizeBtn" style="display: none; position: absolute; z-index: 1000; cursor: nwse-resize; background: white; border-radius: 50%; padding: 4px; border: 1px solid #ffb6d9; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff4fa2" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </div>
`;

// Inject buttons
if (!html.includes('id="itemRotateBtn"')) {
    html = html.replace('<div id="itemDeleteBtn"', rotateResizeHtml + '<div id="itemDeleteBtn"');
}

// Replace updateSelectionUI
const oldUpdateUIStart = html.indexOf('function updateSelectionUI() {');
if (oldUpdateUIStart !== -1) {
    const oldUpdateUIEndStr = "deleteBtn.style.display = 'block';\n}";
    const oldUpdateUIEnd = html.indexOf(oldUpdateUIEndStr, oldUpdateUIStart);
    
    if (oldUpdateUIEnd !== -1) {
        const fullEnd = oldUpdateUIEnd + oldUpdateUIEndStr.length;
        const newUpdateUI = `
function getRotatedPos(cx, cy, rx, ry, angle) {
    const rad = angle * Math.PI / 180;
    const dx = rx - cx;
    const dy = ry - cy;
    return {
        x: cx + dx * Math.cos(rad) - dy * Math.sin(rad),
        y: cy + dx * Math.sin(rad) + dy * Math.cos(rad)
    };
}

function updateSelectionUI() {
    const deleteBtn = document.getElementById('itemDeleteBtn');
    const resizeBtn = document.getElementById('itemResizeBtn');
    const rotateBtn = document.getElementById('itemRotateBtn');
    
    if (!selectedItem) {
        deleteBtn.style.display = 'none';
        if (resizeBtn) resizeBtn.style.display = 'none';
        if (rotateBtn) rotateBtn.style.display = 'none';
        return;
    }
    
    const rect = selectedItem.getBoundingClientRect();
    const parentRect = customScene.getBoundingClientRect();
    
    const scaleX = parseFloat(selectedItem.dataset.flip) || 1;
    const rotDeg = parseFloat(selectedItem.dataset.rotation) || 0;
    
    const cx = rect.left - parentRect.left + rect.width / 2;
    const cy = rect.top - parentRect.top + rect.height / 2;
    const rw = selectedItem.offsetWidth;
    const rh = selectedItem.offsetHeight;

    const topRx = cx + (rw/2) * scaleX;
    const topRy = cy - (rh/2);
    const deletePos = getRotatedPos(cx, cy, topRx, topRy, rotDeg);
    deleteBtn.style.left = (deletePos.x - 12) + 'px';
    deleteBtn.style.top  = (deletePos.y - 12) + 'px';
    deleteBtn.style.display = 'block';
    
    if (resizeBtn) {
        const brX = cx + (rw/2) * scaleX;
        const brY = cy + (rh/2);
        const resizePos = getRotatedPos(cx, cy, brX, brY, rotDeg);
        resizeBtn.style.left = (resizePos.x - 12) + 'px';
        resizeBtn.style.top = (resizePos.y - 12) + 'px';
        resizeBtn.style.display = 'block';
    }
    
    if (rotateBtn) {
        const blX = cx - (rw/2) * scaleX;
        const blY = cy + (rh/2);
        const rotatePos = getRotatedPos(cx, cy, blX, blY, rotDeg);
        rotateBtn.style.left = (rotatePos.x - 12) + 'px';
        rotateBtn.style.top = (rotatePos.y - 12) + 'px';
        rotateBtn.style.display = 'block';
    }
}`;
        html = html.substring(0, oldUpdateUIStart) + newUpdateUI + html.substring(fullEnd);
    } else {
        console.error("Could not find end of updateSelectionUI");
    }
} else {
    console.error("Could not find start of updateSelectionUI");
}

// Replace drag logic
const dragStart = html.indexOf('let dragOffsetX = 0;');
const dragEndStr = 'document.getElementById("itemDeleteBtn").addEventListener("click", (e) => {';
const dragEnd = html.indexOf(dragEndStr);

if (dragStart !== -1 && dragEnd !== -1) {
    const newDragLogic = `let dragOffsetX = 0;
let dragOffsetY = 0;
let highestZ = 100;
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
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        rotateStartAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        rotateInitialElementAngle = parseFloat(selectedItem.dataset.rotation) || 0;
        return;
    }

    const item = e.target.closest(".draggableAccessory");
    if (item && customScene.contains(item)) {
        if (!selectedItem || selectedItem !== item) {
            selectAccessory(item);
        }

        selected = item;
        const rect = item.getBoundingClientRect();
        
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        
        if (typeof highestZ !== 'undefined') {
            item.style.zIndex = highestZ++;
        }
        e.preventDefault();
        customScene.style.cursor = 'grabbing';
    } else {
        // Deselect if clicking outside of the customScene or customization panels
        if (!e.target.closest('#customScene') && !e.target.closest('#customPanel')) {
            selectAccessory(null);
        }
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
    if (e.target === customScene || e.target.id === 'mainPlushie' || e.target.closest('.canvas-placeholder')) {
        selectAccessory(null);
    }
});

`;
    html = html.substring(0, dragStart) + newDragLogic + html.substring(dragEnd);
} else {
    console.error("Could not find drag logic boundaries");
}

fs.writeFileSync('customize.html', html);
console.log("Successfully fixed customize.html!");
