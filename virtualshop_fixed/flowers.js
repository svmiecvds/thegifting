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

// Track select quantities for 5 flowers locally
const flowerQuantities = {
    "1": 1,
    "2": 1,
    "3": 1,
    "4": 1,
    "5": 1
};

// Update quantities in DOM
function updateQtyDisplay(flowerId) {
    const qtySpan = document.getElementById(`qtyFlower${flowerId}`);
    if (qtySpan) {
        qtySpan.innerText = flowerQuantities[flowerId];
    }
}

// Plus Buttons
document.querySelectorAll(".plusBtn").forEach(button => {
    button.addEventListener("click", () => {
        const flowerId = button.dataset.flower;
        flowerQuantities[flowerId]++;
        updateQtyDisplay(flowerId);
    });
});

// Minus Buttons
document.querySelectorAll(".minusBtn").forEach(button => {
    button.addEventListener("click", () => {
        const flowerId = button.dataset.flower;
        if (flowerQuantities[flowerId] > 1) {
            flowerQuantities[flowerId]--;
            updateQtyDisplay(flowerId);
        }
    });
});

// Add to Cart
document.querySelectorAll(".addToCartBtn").forEach(button => {
    button.addEventListener("click", () => {
        const flowerId = button.dataset.flower;
        const flowerName = button.dataset.name;
        const flowerImage = button.dataset.image;
        const quantity = flowerQuantities[flowerId];

        // Push to cart
        cart.push({
            name: flowerName,
            image: flowerImage,
            quantity: quantity
        });

        // Save
        localStorage.setItem("cart", JSON.stringify(cart));

        // Update count
        cartCount.innerText = getCartCount();

        // Reset display and internal count for this card
        flowerQuantities[flowerId] = 1;
        updateQtyDisplay(flowerId);

        // Toast
        toast.innerText = "✨ Added To Cart ✨";
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.display = "none";
        }, 2000);
    });
});

// Redirect to checkout
cartButton.addEventListener("click", () => {
    window.location = "checkout.html";
});
