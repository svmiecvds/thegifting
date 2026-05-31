const customScene =
document.getElementById(
"customScene"
);

const mainPlushie =
document.getElementById(
"mainPlushie"
);

let selectedItem = null;
let selected = null;

/* -------------------- */
/* LOAD PLUSHIE         */
/* -------------------- */

const currentPlushie =
JSON.parse(
localStorage.getItem(
"currentPlushie"
)
);

if(currentPlushie){

mainPlushie.src =
currentPlushie.image;

}

/* -------------------- */
/* ADD ACCESSORIES      */
/* -------------------- */

document
.querySelectorAll(
".accessoryTemplate"
)
.forEach(item => {

item.addEventListener(
"click",
() => {

const accessory =
document.createElement(
"img"
);

accessory.src =
item.src;

accessory.className =
"draggableAccessory";

accessory.style.position =
"absolute";

accessory.style.width =
"70px";

accessory.style.left =
"320px";

accessory.style.top =
"250px";

customScene.appendChild(
accessory
);

});

});

/* -------------------- */
/* SELECT ACCESSORY     */
/* -------------------- */

document.addEventListener(
"mousedown",
(e) => {

if(
e.target.classList.contains(
"draggableAccessory"
)
){

selected =
e.target;

selectedItem =
e.target;

document
.querySelectorAll(
".draggableAccessory"
)
.forEach(item => {

item.style.outline =
"none";

});

selectedItem.style.outline =
"3px solid hotpink";

}

});

/* -------------------- */
/* DRAGGING             */
/* -------------------- */

document.addEventListener(
"mousemove",
(e) => {

if(!selected) return;

const rect =
customScene.getBoundingClientRect();

selected.style.left =

(
e.clientX
-
rect.left
-
selected.offsetWidth/2
)

+ "px";

selected.style.top =

(
e.clientY
-
rect.top
-
selected.offsetHeight/2
)

+ "px";

});

document.addEventListener(
"mouseup",
() => {

selected = null;

});

/* -------------------- */
/* INCREASE SIZE        */
/* -------------------- */

document
.getElementById(
"increaseSize"
)
.addEventListener(
"click",
() => {

if(!selectedItem){

alert(
"Select an accessory first!"
);

return;
}

const currentWidth =

selectedItem.offsetWidth;

selectedItem.style.width =

(currentWidth + 15) + "px";

});

/* -------------------- */
/* DECREASE SIZE        */
/* -------------------- */

document
.getElementById(
"decreaseSize"
)
.addEventListener(
"click",
() => {

if(!selectedItem){

alert(
"Select an accessory first!"
);

return;
}

const currentWidth =

selectedItem.offsetWidth;

if(currentWidth > 30){

selectedItem.style.width =

(currentWidth - 15) + "px";

}

});

/* -------------------- */
/* DELETE               */
/* -------------------- */

document
.getElementById(
"deleteItem"
)
.addEventListener(
"click",
() => {

if(
selectedItem
){

selectedItem.remove();

selectedItem =
null;

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

document
.querySelectorAll(
".draggableAccessory"
)
.forEach(item => {

accessories.push({

image:
item.src,

left:
item.style.left,

top:
item.style.top,

width:
item.style.width

});

});

/* Build the customized plushie object */

const customizedPlushie = {

name:
currentPlushie.name,

image:
currentPlushie.image,

quantity:
currentPlushie.quantity || 1,

accessories:
accessories

};

/* Load existing customized items and replace/add this plushie */

let customizedItems =
JSON.parse(
localStorage.getItem(
"customizedItems"
)
) || [];

/* Remove old customization for same plushie name */

customizedItems =
customizedItems.filter(
item => item.name !== customizedPlushie.name
);

/* Add updated customization */

customizedItems.push(
customizedPlushie
);

/* Save */

localStorage.setItem(

"customizedItems",

JSON.stringify(
customizedItems
)

);

alert(
"Customization Saved!"
);

window.location =
"checkout.html";

});
