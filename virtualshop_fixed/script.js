// Cart state
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function getCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const customizedItems = JSON.parse(localStorage.getItem("customizedItems")) || [];
    const allItems = cartItems.map(item => {
        const custom = customizedItems.find(
            c => c.name === item.name && c.image === item.image
        );
        return custom ? custom : item;
    });
    customizedItems.forEach(c => {
        const inCart = allItems.find(item => item.name === c.name);
        if (!inCart) allItems.push(c);
    });
    return allItems.length;
}

// DOM Elements
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
const cartButton = document.getElementById("cartButton");

// Set initial cart count
cartCount.innerText = getCartCount();

// Track quantities for the 3 plushie cards locally
const plushieQuantities = {
    "1": 1, // Bunny
    "2": 1, // Duck
    "3": 1  // Bear
};

// Update quantities in DOM
function updateQtyDisplay(plushieId) {
    const qtySpan = document.getElementById(`qtyPlushie${plushieId}`);
    if (qtySpan) {
        qtySpan.innerText = plushieQuantities[plushieId];
    }
}

// Plus Buttons
document.querySelectorAll(".plusBtn").forEach(button => {
    button.addEventListener("click", () => {
        const plushieId = button.dataset.plushie;
        plushieQuantities[plushieId]++;
        updateQtyDisplay(plushieId);
    });
});

// Minus Buttons
document.querySelectorAll(".minusBtn").forEach(button => {
    button.addEventListener("click", () => {
        const plushieId = button.dataset.plushie;
        if (plushieQuantities[plushieId] > 1) {
            plushieQuantities[plushieId]--;
            updateQtyDisplay(plushieId);
        }
    });
});

// Color Option Selection for Bunny Card
document.querySelectorAll(".color-option").forEach(option => {
    option.addEventListener("click", () => {
        // Deactivate all other options
        document.querySelectorAll(".color-option").forEach(opt => opt.classList.remove("active"));
        // Activate clicked option
        option.classList.add("active");

        // Retrieve properties
        const colorName = option.dataset.name;
        const colorImage = option.dataset.image;

        // Update main card presentation
        const mainImage = document.getElementById("bunnyImage");
        const mainName = document.getElementById("bunnyName");
        if (mainImage) mainImage.src = colorImage;
        if (mainName) mainName.innerText = colorName;

        // Update button attributes
        const custBtn = document.getElementById("bunnyCustomizeBtn");
        const cartBtn = document.getElementById("bunnyAddToCartBtn");
        if (custBtn) {
            custBtn.dataset.name = colorName;
            custBtn.dataset.image = colorImage;
        }
        if (cartBtn) {
            cartBtn.dataset.name = colorName;
            cartBtn.dataset.image = colorImage;
        }
    });
});

// Add to Cart
document.querySelectorAll(".addToCartBtn").forEach(button => {
    button.addEventListener("click", () => {
        const plushieId = button.dataset.plushie;
        const plushieName = button.dataset.name;
        const plushieImage = button.dataset.image;
        const quantity = plushieQuantities[plushieId];

        // Push to cart
        cart.push({
            name: plushieName,
            image: plushieImage,
            quantity: quantity
        });

        // Save
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update count
        cartCount.innerText = getCartCount();

        // Reset display and internal count for this card
        plushieQuantities[plushieId] = 1;
        updateQtyDisplay(plushieId);

        // Toast
        toast.innerText = "✨ Added To Cart ✨";
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.display = "none";
        }, 2000);
    });
});

// Customize Plushie
document.querySelectorAll(".customizeBtn").forEach(button => {
    button.addEventListener("click", () => {
        const plushieId = button.dataset.plushie;
        const plushieName = button.dataset.name;
        const plushieImage = button.dataset.image;
        const quantity = plushieQuantities[plushieId];

        // Save selection details to currentPlushie
        localStorage.setItem("currentPlushie", JSON.stringify({
            name: plushieName,
            image: plushieImage,
            quantity: quantity
        }));

        // Redirect to customization page
        window.location = "customize.html";
    });
});

// Redirect to checkout
cartButton.addEventListener("click", () => {
    window.location = "checkout.html";
});