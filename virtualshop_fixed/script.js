const bunny =
document.getElementById("bunny");

const duck =
document.getElementById("duck");

const bear =
document.getElementById("bear");

const colorPanel =
document.getElementById("colorPanel");

const quantityPopup =
document.getElementById("quantityPopup");

const quantityValue =
document.getElementById("quantityValue");

const toast =
document.getElementById("toast");

const cartCount =
document.getElementById("cartCount");

let cart =
JSON.parse(
localStorage.getItem("cart")
) || [];

let currentItem = "";

let currentImage = "";

let selectedQuantity = 1;

cartCount.innerText =
cart.length;

/* -------------------- */
/* BUNNY */
/* -------------------- */

bunny.addEventListener(
"click",
()=>{

colorPanel.style.display =
"block";

});

document
.querySelectorAll(".colorBtn")
.forEach(button=>{

button.addEventListener(
"click",
()=>{

currentItem =
"Bunny";

currentImage =
button.dataset.image;

bunny.src =
currentImage;

selectedQuantity = 1;

quantityValue.innerText =
1;

colorPanel.style.display =
"none";

quantityPopup.style.display =
"block";

});

});

/* -------------------- */
/* DUCK */
/* -------------------- */

duck.addEventListener(
"click",
()=>{

currentItem =
"Duck";

currentImage =
"duck.png";

selectedQuantity = 1;

quantityValue.innerText =
1;

quantityPopup.style.display =
"block";

});

/* -------------------- */
/* BEAR */
/* -------------------- */

bear.addEventListener(
"click",
()=>{

currentItem =
"Bear";

currentImage =
"bear.png";

selectedQuantity = 1;

quantityValue.innerText =
1;

quantityPopup.style.display =
"block";

});

/* -------------------- */
/* QUANTITY */
/* -------------------- */

document
.getElementById("plusBtn")
.addEventListener(
"click",
()=>{

selectedQuantity++;

quantityValue.innerText =
selectedQuantity;

});

document
.getElementById("minusBtn")
.addEventListener(
"click",
()=>{

if(selectedQuantity > 1){

selectedQuantity--;

quantityValue.innerText =
selectedQuantity;

}

});

/* -------------------- */
/* CUSTOMIZE */
/* -------------------- */

document
.getElementById("customizeBtn")
.addEventListener(
"click",
()=>{

if(!currentItem) return;

localStorage.setItem(

"currentPlushie",

JSON.stringify({

name:
currentItem,

image:
currentImage,

quantity:
selectedQuantity

})

);

window.location =
"customize.html";

});

/* -------------------- */
/* ADD TO CART */
/* -------------------- */

document
.getElementById("addToCartBtn")
.addEventListener(
"click",
()=>{

cart.push({

name:
currentItem,

image:
currentImage,

quantity:
selectedQuantity

});

localStorage.setItem(

"cart",

JSON.stringify(cart)

);

cartCount.innerText =
cart.length;

quantityPopup.style.display =
"none";

toast.innerText =
"✨ Added To Cart ✨";

toast.style.display =
"block";

setTimeout(()=>{

toast.style.display =
"none";

},2000);

});

/* -------------------- */
/* CHECKOUT */
/* -------------------- */

document
.getElementById("cartButton")
.addEventListener(
"click",
()=>{

window.location =
"checkout.html";

});