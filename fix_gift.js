const fs = require('fs');
let html = fs.readFileSync('gift.html', 'utf8');

// The JS logic to inject:
const newJs = `
function updateSelectionUI() {
    const deleteBtn = document.getElementById('itemDeleteBtn');
    const rotateBtn = document.getElementById('itemRotateBtn');
    const resizeBtn = document.getElementById('itemResizeBtn');
    
    if (!selected) {
        if (deleteBtn) deleteBtn.style.display = 'none';
        if (rotateBtn) rotateBtn.style.display = 'none';
        if (resizeBtn) resizeBtn.style.display = 'none';
        return;
    }
    
    const l = parseFloat(selected.style.left) || 0;
    const t = parseFloat(selected.style.top)  || 0;
    const w = selected.offsetWidth;
    const h = selected.offsetHeight;
    
    if (deleteBtn) {
        deleteBtn.style.left = (l + w - 12) + 'px';
        deleteBtn.style.top  = (t - 12) + 'px';
        deleteBtn.style.display = 'flex';
    }
    
    if (rotateBtn) {
        rotateBtn.style.left = (l - 12) + 'px';
        rotateBtn.style.top  = (t + h - 12) + 'px';
        rotateBtn.style.display = 'flex';
    }
    
    if (resizeBtn) {
        resizeBtn.style.left = (l + w - 12) + 'px';
        resizeBtn.style.top  = (t + h - 12) + 'px';
        resizeBtn.style.display = 'flex';
    }
}

function selectElement(el) {
    selected = el;
    document.querySelectorAll(".gifSelected").forEach(item => {
        item.classList.remove("gifSelected");
        item.style.outline = "none";
    });
    
    if (el) {
        el.classList.add("gifSelected");
        el.style.outline = "2px dashed #ff4fa2";
        updateSelectionUI();
    } else {
        updateSelectionUI();
        giftScene.style.cursor = '';
    }
}

let isResizing = false;
let isRotating = false;
let resizeStartX = 0, resizeStartY = 0;
let resizeStartW = 0, resizeStartH = 0;
let resizeStartLeft = 0, resizeStartTop = 0;
let rotateStartAngle = 0;
let rotateInitialElementAngle = 0;

function makeDraggable(el){
    el.addEventListener("mousedown", (e) => {
        if (e.target.closest('#itemDeleteBtn') || e.target.closest('#itemRotateBtn') || e.target.closest('#itemResizeBtn')) return;
        
        e.stopPropagation();
        if (selected !== el) {
            selectElement(el);
        }
        
        el.style.zIndex = highestZ++;
        const rect = el.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        e.preventDefault();
        giftScene.style.cursor = 'grabbing';
    });
}

document.addEventListener("mousedown", (e) => {
    if (e.target.closest('#itemDeleteBtn')) {
        if (selected) {
            selected.remove();
            selectElement(null);
        }
        return;
    }
    
    if (e.target.closest('#itemResizeBtn') && selected) {
        e.stopPropagation(); e.preventDefault();
        isResizing = true;
        resizeStartX = e.clientX;
        resizeStartY = e.clientY;
        resizeStartW = selected.offsetWidth;
        resizeStartH = selected.offsetHeight;
        resizeStartLeft = parseFloat(selected.style.left) || 0;
        resizeStartTop = parseFloat(selected.style.top) || 0;
        return;
    }
    
    if (e.target.closest('#itemRotateBtn') && selected) {
        e.stopPropagation(); e.preventDefault();
        isRotating = true;
        
        const rect = selected.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        rotateStartAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        rotateInitialElementAngle = parseFloat(selected.dataset.rotation) || 0;
        return;
    }
});

/* -------------------- */
/* GLOBAL DRAG MOVE     */
/* -------------------- */

document.addEventListener("mousemove", (e) => {
    const sceneW = giftScene.clientWidth;
    const sceneH = giftScene.clientHeight;

    if (isResizing && selected) {
        const dx = e.clientX - resizeStartX;
        const isText = selected.classList.contains("giftText");
        
        if (isText) {
            let currentFS = parseFloat(window.getComputedStyle(selected).fontSize) || 16;
            // Use vertical drag distance to roughly adjust font size
            const dy = e.clientY - resizeStartY;
            selected.style.fontSize = Math.max(10, currentFS + dy/10) + "px";
            resizeStartY = e.clientY; // reset to track small movements
        } else {
            let maxW = Math.min(sceneW - resizeStartLeft, sceneH - resizeStartTop);
            let newW = resizeStartW + dx;
            newW = Math.max(30, Math.min(newW, maxW));
            
            selected.style.width = newW + "px";
            selected.style.height = (newW * (resizeStartH / resizeStartW)) + "px";
        }
        updateSelectionUI();
        return;
    }
    
    if (isRotating && selected) {
        const rect = selected.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
        
        let angleDiff = currentAngle - rotateStartAngle;
        let newAngle = rotateInitialElementAngle + angleDiff;
        
        selected.dataset.rotation = newAngle;
        let flipStr = selected.dataset.flip === "-1" ? "scaleX(-1) " : "";
        selected.style.transform = flipStr + "rotate(" + newAngle + "deg)";
        updateSelectionUI();
        return;
    }

    if (!selected || isResizing || isRotating) return;

    const sceneRect = giftScene.getBoundingClientRect();
    let newLeft = e.clientX - sceneRect.left - dragOffsetX;
    let newTop = e.clientY - sceneRect.top - dragOffsetY;

    selected.style.left = newLeft + "px";
    selected.style.top  = newTop  + "px";
    updateSelectionUI();
});

document.addEventListener("mouseup", () => {
    isResizing = false;
    isRotating = false;
    if (selected) {
        giftScene.style.cursor = 'grab';
    } else {
        giftScene.style.cursor = '';
    }
});

/* Click on scene background to deselect */
giftScene.addEventListener("mousedown", (e) => {
    if (e.target === giftScene || e.target.closest('.canvas-placeholder')) {
        selectElement(null);
    }
});
`;

let startMarker = "function makeDraggable(el){";
let endMarker = "/* Click on scene background to deselect */";

let startIndex = html.indexOf(startMarker);
let endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    // Find the end of the event listener for the background click
    let restOfHtml = html.substring(endIndex);
    let closeIndex = restOfHtml.indexOf(");") + 2;
    endIndex += closeIndex;
    
    html = html.substring(0, startIndex) + newJs + html.substring(endIndex);
    fs.writeFileSync('gift.html', html);
    console.log("Success");
} else {
    console.log("Could not find markers!");
}
