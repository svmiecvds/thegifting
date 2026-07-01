
const customScene =
document.getElementById(
"customScene"
);

const mainPlushie =
document.getElementById(
"mainPlushie"
);

const placeholderMsg = document.getElementById("placeholderMsg");

let selectedItem = null;
let selected = null;

/* -------------------- */
/* LOAD PLUSHIE         */
/* -------------------- */

// Helper to extract relative assets path
function getRelativePath(absoluteUrl) {
    if (!absoluteUrl) return "";
    let normalized = absoluteUrl.replace(/\\/g, "/");
    const match = normalized.match(/assets\//i);
    if (match) {
        return normalized.substring(match.index);
    }
    return normalized;
}

// Helper to create an accessory image
function createAccessory(src, leftPx, topPx, widthPx) {
    if (placeholderMsg) {
        placeholderMsg.style.opacity = "0";
        setTimeout(() => {
            if (placeholderMsg) placeholderMsg.style.display = "none";
        }, 300);
    }

    const accessory = document.createElement("img");
    accessory.src = src;
    accessory.className = "draggableAccessory";
    accessory.draggable = false;
    accessory.style.position = "absolute";
    accessory.style.width = widthPx + "px";
    accessory.style.left = leftPx + "px";
    accessory.style.top = topPx + "px";

    customScene.appendChild(accessory);
    
    // Auto-select the newly created accessory
    selectAccessory(accessory);
    return accessory;
}

/* updateSelectionUI moved down */

/* selectAccessory moved down */
}

const currentPlushie = JSON.parse(sessionStorage.getItem("currentPlushie"));
if (!currentPlushie) {
    window.location.href = "index.html";
}

if(currentPlushie){
    mainPlushie.src = currentPlushie.image; const dbg = document.createElement(\'div\'); dbg.style.position = \'absolute\'; dbg.style.zIndex = \'9999\'; dbg.style.background = \'black\'; dbg.style.color = \'white\'; dbg.textContent = \'SRC: \' + mainPlushie.src; document.getElementById(\'customScene\').appendChild(dbg);
    // Starts fresh with a blank canvas for this customization session
}

/* -------------------- */
/* ADD ACCESSORIES      */
/* -------------------- */

document.querySelectorAll(".accessoryTemplate").forEach(item => {
    item.addEventListener("click", () => {
        const rect = customScene.getBoundingClientRect();
        const plushieRect = mainPlushie.getBoundingClientRect();
        
        const plushieW = mainPlushie.offsetWidth || 280;
        const plushieH = mainPlushie.offsetHeight || 280;
        
        // Make it a tad bit smaller (40% of plushie size)
        const width = plushieW * 0.40;
        
        // Center it on the plushie
        const left = (plushieRect.left - rect.left) + (plushieW - width) / 2;
        const top = (plushieRect.top - rect.top) + (plushieH - width) / 2;
        
        createAccessory(item.src, left, top, width);
    });

    // Support drag start from the sidebar templates
    item.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", item.src);
    });
});

// Setup drag and drop events on customScene
customScene.addEventListener("dragover", (e) => {
    e.preventDefault();
});

customScene.addEventListener("drop", (e) => {
    e.preventDefault();
    const src = e.dataTransfer.getData("text/plain");
    if (src) {
        const rect = customScene.getBoundingClientRect();
        
        // Calculate dropped coordinates relative to customScene
        const dropX = e.clientX - rect.left;
        const dropY = e.clientY - rect.top;
        
        // Default sticker size (e.g. 40% of the plushie size, fallback to 112)
        const defaultWidth = (mainPlushie.offsetWidth ? mainPlushie.offsetWidth * 0.40 : 112);
        
        // Center the accessory at drop coordinates
        const left = dropX - defaultWidth / 2;
        const top = dropY - defaultWidth / 2;
        
        createAccessory(src, left, top, defaultWidth);
    }
});

/* -------------------- */
/* SELECT & DRAG PLACED */
/* -------------------- */

function updateSelectionUI() {
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

let dragOffsetX = 0; let dragOffsetY = 0; let highestZ = 100; let isResizing = false;
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



document.getElementById("itemDeleteBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    if (selectedItem) {
        selectedItem.remove();
        selectAccessory(null);
        if (document.querySelectorAll(".draggableAccessory").length === 0) {
            if (placeholderMsg) {
                placeholderMsg.style.display = "flex";
                setTimeout(() => {
                    if (placeholderMsg) placeholderMsg.style.opacity = "1";
                }, 50);
            }
        }
    }
});



/* -------------------- */
/* SAVE                 */
/* -------------------- */

document
.getElementById(
"saveCustomization"
)
.addEventListener(
"click",
() => {

const accessories = [];
const rect = customScene.getBoundingClientRect();
const plushieRect = mainPlushie.getBoundingClientRect();
const plushieW = plushieRect.width || 280;
const plushieH = plushieRect.height || 280;

document
.querySelectorAll(
".draggableAccessory"
)
.forEach(item => {
    const itemRect = item.getBoundingClientRect();
    
    // Calculate coordinates relative to plushieRect
    const relLeft = (itemRect.left - plushieRect.left) / plushieW;
    const relTop = (itemRect.top - plushieRect.top) / plushieH;
    const relWidth = itemRect.width / plushieW;
    
    // Virtualize coordinates to a 700x700 canvas with plushie centered at (210, 210) and size 280x280
    const rawLeft = 210 + relLeft * 280;
    const rawTop = 210 + relTop * 280;
    const rawWidth = relWidth * 280;

    accessories.push({
        image: getRelativePath(item.src),
        left: rawLeft + "px",
        top: rawTop + "px",
        width: rawWidth + "px"
    });
});

/* Build the customized plushie object with unique ID */
const customizedPlushie = {
    customId: "plushie_" + Date.now(),
    name: currentPlushie.name.startsWith("Customized ") ? currentPlushie.name : "Customized " + currentPlushie.name,
    image: currentPlushie.image,
    quantity: currentPlushie.quantity || 1,
    accessories: accessories
};

/* Load existing cart items and append this new customized item */
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
cart.push(customizedPlushie);

/* Save to cart */
sessionStorage.setItem("cart", JSON.stringify(cart));

alert("Customization Saved & Added to Cart!");
window.location.href = "checkout.html";
});



