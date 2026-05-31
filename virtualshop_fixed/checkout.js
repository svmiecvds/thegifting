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

const generateBill =
document.getElementById(
"generateBill"
);

const giftButton =
document.getElementById(
"giftButton"
);

giftButton.style.display =
"none";

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
    c => c.name === item.name && c.image === item.image
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

generateBill.style.display =
"none";

giftButton.style.display =
"none";

return;

}

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
"product";

plushieContainer.appendChild(
plushie
);

/* Accessories overlaid at saved positions */

if(item.accessories && item.accessories.length > 0){

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

/* acc positions are saved as pixel values relative to the
   customScene (700px wide). Scale them to the 250px container. */
const sceneWidth = 700;
const containerWidth = 250;
const scale = containerWidth / sceneWidth;

const rawLeft = parseFloat(acc.left);
const rawTop  = parseFloat(acc.top);
const rawWidth = parseFloat(acc.width);

accessory.style.left  = (rawLeft  * scale) + "px";
accessory.style.top   = (rawTop   * scale) + "px";
accessory.style.width = (rawWidth * scale) + "px";

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
/* GENERATE BILL        */
/* -------------------- */

generateBill.addEventListener(
"click",
() => {

receipt.classList.add(
"showReceipt"
);

generateBill.style.display =
"none";

giftButton.style.display =
"inline-block";

});

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
