const customScene = document.getElementById("customScene");
const mainBox = document.getElementById("mainBox");

let selectedItem = null;
let selected = null;
let highestZ = 10;

// Rotation and flip state trackers
let dragOffsetX = 0;
let dragOffsetY = 0;

/* -------------------- */
/* LOAD CART STATE      */
/* -------------------- */

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function getCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const customizedItems = JSON.parse(localStorage.getItem("customizedItems")) || [];
    const allItems = cartItems.map(item => {
        const custom = customizedItems.find(
            c => c.name === item.name && c.image.split("/").pop() === item.image.split("/").pop()
        );
        return custom ? custom : item;
    });
    customizedItems.forEach(c => {
        const inCart = allItems.find(item => item.name === c.name);
        if (!inCart) allItems.push(c);
    });
    return allItems.length;
}

const cartCountSpan = document.getElementById("cartCount");
if (cartCountSpan) {
    cartCountSpan.innerText = getCartCount();
}

/* -------------------- */
/* SWITCH BOX TYPE      */
/* -------------------- */

let currentBoxName = "Heart Treat Box";
let currentBoxImage = "box_heart.png";

document.querySelectorAll(".box-option").forEach(option => {
    option.addEventListener("click", () => {
        // Toggle active options
        document.querySelectorAll(".box-option").forEach(opt => opt.classList.remove("active"));
        option.classList.add("active");

        // Update active box details
        currentBoxName = option.dataset.name;
        currentBoxImage = option.dataset.image;

        // Update scene backdrop
        if (mainBox) {
            mainBox.src = currentBoxImage;
            mainBox.alt = currentBoxName;
        }
    });
});

/* -------------------- */
/* DESSERT SPAWNING     */
/* -------------------- */

document.querySelectorAll(".dessertSpawner").forEach(spawner => {
    spawner.addEventListener("click", () => {
        const dessert = document.createElement("img");
        dessert.src = spawner.dataset.src;
        dessert.className = "draggableAccessory draggableTreat";
        dessert.style.position = "absolute";
        dessert.style.width = "70px";
        dessert.style.height = "70px";
        dessert.style.left = "315px"; // Centered inside the 700px scene
        dessert.style.top = "250px";
        dessert.style.zIndex = highestZ++;
        dessert.draggable = false;
        
        // Initial transform states
        dessert.dataset.rotation = "0";
        dessert.dataset.flip = "1";

        customScene.appendChild(dessert);

        // Auto select newly spawned dessert
        selectElement(dessert);
    });
});

/* -------------------- */
/* SELECTION SYSTEM     */
/* -------------------- */

function selectElement(el) {
    selectedItem = el;
    document.querySelectorAll(".draggableAccessory").forEach(item => {
        item.classList.remove("draggableTreatSelected");
        item.style.outline = "none";
    });
    el.classList.add("draggableTreatSelected");
    el.style.outline = "3px solid hotpink";
}

document.addEventListener("mousedown", (e) => {
    const treat = e.target.closest(".draggableAccessory");
    if (treat && customScene.contains(treat)) {
        selected = treat;
        selectElement(treat);

        // Compute offsets
        const rect = treat.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        
        treat.style.zIndex = highestZ++;
        e.preventDefault();
    }
});

/* -------------------- */
/* DRAGGING MOVEMENT    */
/* -------------------- */

document.addEventListener("mousemove", (e) => {
    if (!selected) return;

    const rect = customScene.getBoundingClientRect();
    let newLeft = e.clientX - rect.left - dragOffsetX;
    let newTop = e.clientY - rect.top - dragOffsetY;

    // Bounded dragging inside actual canvas size
    const sceneW = customScene.clientWidth;
    const sceneH = customScene.clientHeight;
    newLeft = Math.max(0, Math.min(newLeft, sceneW - selected.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, sceneH - selected.offsetHeight));

    selected.style.left = newLeft + "px";
    selected.style.top = newTop + "px";
});

document.addEventListener("mouseup", () => {
    selected = null;
});

// Deselect when clicking scene background
customScene.addEventListener("mousedown", (e) => {
    if (e.target === customScene || e.target === mainBox) {
        selectedItem = null;
        document.querySelectorAll(".draggableAccessory").forEach(item => {
            item.classList.remove("draggableTreatSelected");
            item.style.outline = "none";
        });
    }
});

/* -------------------- */
/* CONTROLS HANDLING    */
/* -------------------- */

// Resize Increase
document.getElementById("increaseSize").addEventListener("click", () => {
    if (!selectedItem) {
        alert("Select a dessert inside the box first!");
        return;
    }
    const currW = selectedItem.offsetWidth;
    selectedItem.style.width = (currW + 15) + "px";
    selectedItem.style.height = (currW + 15) + "px";
});

// Resize Decrease
document.getElementById("decreaseSize").addEventListener("click", () => {
    if (!selectedItem) {
        alert("Select a dessert inside the box first!");
        return;
    }
    const currW = selectedItem.offsetWidth;
    if (currW > 30) {
        selectedItem.style.width = (currW - 15) + "px";
        selectedItem.style.height = (currW - 15) + "px";
    }
});

// Delete Selected
document.getElementById("deleteItem").addEventListener("click", () => {
    if (selectedItem) {
        selectedItem.remove();
        selectedItem = null;
    }
});

// Rotate Selected
const rotateBtn = document.getElementById("rotateTreatBtn");
if (rotateBtn) {
    rotateBtn.addEventListener("click", () => {
        if (!selectedItem) {
            alert("Select a dessert inside the box first!");
            return;
        }
        let rot = parseInt(selectedItem.dataset.rotation) || 0;
        rot = (rot + 45) % 360;
        selectedItem.dataset.rotation = rot;
        updateTreatTransform(selectedItem);
    });
}

// Flip Selected
const flipBtn = document.getElementById("flipTreatBtn");
if (flipBtn) {
    flipBtn.addEventListener("click", () => {
        if (!selectedItem) {
            alert("Select a dessert inside the box first!");
            return;
        }
        let flip = parseInt(selectedItem.dataset.flip) || 1;
        flip = flip === 1 ? -1 : 1;
        selectedItem.dataset.flip = flip;
        updateTreatTransform(selectedItem);
    });
}

function updateTreatTransform(el) {
    const rot = el.dataset.rotation || 0;
    const flip = el.dataset.flip || 1;
    el.style.transform = `rotate(${rot}deg) scaleX(${flip})`;
}

/* -------------------- */
/* SERIALIZE & SAVE     */
/* -------------------- */

document.getElementById("saveCustomization").addEventListener("click", () => {
    const accessories = [];
    
    document.querySelectorAll("#customScene .draggableTreat").forEach(item => {
        const realLeft = parseFloat(item.style.left) || 0;
        const realTop = parseFloat(item.style.top) || 0;
        
        // Translate real coordinates to virtual 700x700 coordinates
        const sceneW = customScene.clientWidth;
        const sceneH = customScene.clientHeight;
        const virtualLeft = realLeft - (sceneW / 2) + 350;
        const virtualTop = realTop - (sceneH / 2) + 350;

        accessories.push({
            image: item.src.split("/").pop(), // Store just the filename
            left: virtualLeft + "px",
            top: virtualTop + "px",
            width: item.style.width,
            rotation: item.dataset.rotation || "0",
            flip: item.dataset.flip || "1"
        });
    });

    const customizedBox = {
        name: currentBoxName,
        image: currentBoxImage,
        quantity: 1,
        accessories: accessories
    };

    // Load existing customized items and filter old box type
    let customizedItems = JSON.parse(localStorage.getItem("customizedItems")) || [];
    customizedItems = customizedItems.filter(item => item.name !== currentBoxName);
    customizedItems.push(customizedBox);
    localStorage.setItem("customizedItems", JSON.stringify(customizedItems));

    // Ensure the box is added to the general shopping cart list
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const inCart = cart.find(item => item.name === currentBoxName);
    if (!inCart) {
        cart.push({
            name: currentBoxName,
            image: currentBoxImage,
            quantity: 1
        });
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Alert and Redirect
    alert("🎉 Treat Box Customization Saved to Cart!");
    window.location = "checkout.html";
});

/* Redirect to checkout cart */
const cartButton = document.getElementById("cartButton");
if (cartButton) {
    cartButton.addEventListener("click", () => {
        window.location = "checkout.html";
    });
}
