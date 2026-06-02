const products =
document.getElementById(
"products"
);

const orderList =
document.getElementById(
"orderList"
);

const receipt =
document.getElementById(
"receipt"
);

const giftButton =
document.getElementById(
"giftButton"
);

/* -------------------- */
/* LOAD CURRENT ITEMS   */
/* -------------------- */

/* Load regular cart items */
let cartItems =
JSON.parse(
localStorage.getItem(
"cart"
)
) || [];

/* Load any customized plushie saved from customize page */
let customizedItems =
JSON.parse(
localStorage.getItem(
"customizedItems"
)
) || [];

/* Merge: customized versions replace matching regular items */
let allItems = cartItems.map(item => {
  const custom = customizedItems.find(
    c => c.name === item.name && c.image.split("/").pop() === item.image.split("/").pop()
  );
  return custom ? custom : item;
});

/* Add any customized items not already in cart */
customizedItems.forEach(c => {
  const inCart = allItems.find(
    item => item.name === c.name
  );
  if (!inCart) allItems.push(c);
});

/* -------------------- */
/* RENDER CART          */
/* -------------------- */

function renderCart(){

products.innerHTML = "";

orderList.innerHTML = "";

if(allItems.length === 0){

products.innerHTML =

"<h2>Your cart is empty 🧸</h2>";

orderList.innerHTML =

"<p>No items added yet.</p>";

giftButton.style.display =
"none";

return;

}

giftButton.style.display =
"inline-block";

allItems.forEach((item, index) => {

/* SHOW PLUSHIES */

for(

let i = 0;

i < (item.quantity || 1);

i++

){

const plushieContainer =
document.createElement(
"div"
);

plushieContainer.className =
"plushieContainer";

/* Plushie base image */

const plushie =
document.createElement(
"img"
);

plushie.src =
item.image;

plushie.className =
"checkoutProduct";

plushie.style.position = "absolute";
plushie.style.width = "100%";
plushie.style.height = "100%";
plushie.style.objectFit = "contain";
plushie.style.left = "0";
plushie.style.top = "0";
plushie.style.transform = "none";

plushieContainer.appendChild(
plushie
);

/* Accessories overlaid at saved positions */

if(item.accessories && item.accessories.length > 0){

const plushieCanvasW = 280;
const plushieCanvasL = 210;
const plushieCanvasT = 210;

item.accessories.forEach(
acc => {

const accessory =
document.createElement(
"img"
);

accessory.src =
acc.image;

accessory.className =
"checkoutAccessory";

const rawLeft = parseFloat(acc.left);
const rawTop  = parseFloat(acc.top);
const rawWidth = parseFloat(acc.width);

accessory.style.left  = (((rawLeft - plushieCanvasL) / plushieCanvasW) * 100) + "%";
accessory.style.top   = (((rawTop  - plushieCanvasT) / plushieCanvasW) * 100) + "%";
accessory.style.width = ((rawWidth / plushieCanvasW) * 100) + "%";
accessory.style.transform = `rotate(${acc.rotation || 0}deg) scaleX(${acc.flip || 1})`;

plushieContainer.appendChild(
accessory
);

});

}

products.appendChild(
plushieContainer
);

}

/* ORDER ROW */

const row =
document.createElement(
"div"
);

row.className =
"orderRow";

row.innerHTML =

`
<span>

${item.name}
x
${item.quantity || 1}

</span>

<button
class="removeBtn"
data-index="${index}"
>

❌

</button>
`;

orderList.appendChild(
row
);

});

/* REMOVE BUTTONS */

document
.querySelectorAll(
".removeBtn"
)
.forEach(button => {

button.addEventListener(
"click",
() => {

const index =

parseInt(
button.dataset.index
);

allItems.splice(
index,
1
);

/* Keep cart and customizedItems in sync */
localStorage.setItem(
"cart",
JSON.stringify(
allItems.filter(i => !i.accessories)
)
);

localStorage.setItem(
"customizedItems",
JSON.stringify(
allItems.filter(i => i.accessories)
)
);

renderCart();

});
});

}

/* -------------------- */
/* INITIAL LOAD         */
/* -------------------- */

renderCart();

/* -------------------- */
/* AUTOMATIC RECEIPT    */
/* -------------------- */

setTimeout(() => {

receipt.classList.add(
"showReceipt"
);

}, 500);

/* -------------------- */
/* GIFT BUTTON          */
/* -------------------- */

giftButton.addEventListener(
"click",
() => {

localStorage.setItem(

"giftItems",

JSON.stringify(
allItems
)

);

window.location =
"gift.html";

});
