const giftScene =
document.getElementById(
"giftScene"
);

/* Read from "giftItems" - the key set by checkout.js */
const giftItems =
JSON.parse(
localStorage.getItem(
"giftItems"
)
) || [];

let selected = null;
let currentNote = null;
let highestZ = 1;

/* Drag offset so item doesn't jump to cursor centre */
let dragOffsetX = 0;
let dragOffsetY = 0;

/* -------------------- */
/* HELPER: make element */
/* selectable & draggable */
/* -------------------- */

function makeDraggable(el){

el.addEventListener(
"mousedown",
(e) => {

e.stopPropagation();

/* Deselect previous */
document
.querySelectorAll(".gifSelected")
.forEach(x => x.classList.remove("gifSelected"));

el.classList.add("gifSelected");

selected = el;

selected.style.zIndex =
highestZ++;

const rect = el.getBoundingClientRect();
dragOffsetX = e.clientX - rect.left;
dragOffsetY = e.clientY - rect.top;

e.preventDefault();

}
);

}

/* -------------------- */
/* LOAD GIFT ITEMS      */
/* -------------------- */

giftItems.forEach(item => {

const wrapper =
document.createElement(
"div"
);

wrapper.className =
"draggable giftEl";

wrapper.style.position =
"absolute";

wrapper.style.left =
"80px";

wrapper.style.top =
"80px";

wrapper.style.zIndex =
highestZ++;

/* Plushie base image */
const plushie =
document.createElement(
"img"
);

plushie.src =
item.image;

plushie.style.width =
"180px";

plushie.style.display =
"block";

plushie.draggable = false;

wrapper.appendChild(
plushie
);

/* Accessories overlaid at saved positions */
if(item.accessories && item.accessories.length > 0){

const sceneWidth = 700;
const containerWidth = 180;
const scale = containerWidth / sceneWidth;

item.accessories.forEach(acc => {

const accessory =
document.createElement(
"img"
);

accessory.src =
acc.image;

accessory.style.position =
"absolute";

accessory.style.pointerEvents = "none";

const rawLeft = parseFloat(acc.left);
const rawTop  = parseFloat(acc.top);
const rawWidth = parseFloat(acc.width);

accessory.style.left  = (rawLeft  * scale) + "px";
accessory.style.top   = (rawTop   * scale) + "px";
accessory.style.width = (rawWidth * scale) + "px";

wrapper.appendChild(
accessory
);

});

}

makeDraggable(wrapper);

giftScene.appendChild(
wrapper
);

});

/* -------------------- */
/* GLOBAL DRAG MOVE     */
/* -------------------- */

document.addEventListener(
"mousemove",
(e) => {

if(!selected) return;

const sceneRect =
giftScene.getBoundingClientRect();

let newLeft =
e.clientX - sceneRect.left - dragOffsetX;

let newTop =
e.clientY - sceneRect.top - dragOffsetY;

selected.style.left = newLeft + "px";
selected.style.top  = newTop  + "px";

}
);

document.addEventListener(
"mouseup",
() => {

selected = null;

}
);

/* Click on scene background to deselect */
giftScene.addEventListener(
"mousedown",
(e) => {

if(e.target === giftScene){

document
.querySelectorAll(".gifSelected")
.forEach(x => x.classList.remove("gifSelected"));

}

}
);

/* -------------------- */
/* SIZE CONTROLS        */
/* -------------------- */

function getSelectedEl(){

return document.querySelector(".gifSelected");

}

/* Increase size */
document
.getElementById("giftIncreaseSize")
.addEventListener(
"click",
() => {

const el = getSelectedEl();

if(!el){

alert("Select an item first!");

return;

}

const currentW = el.offsetWidth;

el.style.width = (currentW + 20) + "px";

}
);

/* Decrease size */
document
.getElementById("giftDecreaseSize")
.addEventListener(
"click",
() => {

const el = getSelectedEl();

if(!el){

alert("Select an item first!");

return;

}

const currentW = el.offsetWidth;

if(currentW > 40){

el.style.width = (currentW - 20) + "px";

}

}
);

/* Delete selected */
document
.getElementById("giftDeleteItem")
.addEventListener(
"click",
() => {

const el = getSelectedEl();

if(el){

el.remove();

}

}
);

/* -------------------- */
/* CREATE NOTES         */
/* -------------------- */

document
.querySelectorAll(
".noteTemplate"
)
.forEach(note => {

note.addEventListener(
"click",
() => {

const wrapper =
document.createElement(
"div"
);

wrapper.className =
"note draggable giftEl";

wrapper.style.position =
"absolute";

wrapper.style.left =
"200px";

wrapper.style.top =
"150px";

wrapper.style.width =
"220px";

wrapper.style.zIndex =
highestZ++;

const paper =
document.createElement(
"img"
);

paper.src =
note.src;

paper.style.width =
"100%";

paper.draggable = false;

const text =
document.createElement(
"div"
);

text.className =
"noteText";

text.innerText =
"Double click to edit";

wrapper.appendChild(
paper
);

wrapper.appendChild(
text
);

makeDraggable(wrapper);

giftScene.appendChild(
wrapper
);

});

});

/* -------------------- */
/* CREATE STICKERS      */
/* -------------------- */

document
.querySelectorAll(
".stickerTemplate"
)
.forEach(sticker => {

sticker.addEventListener(
"click",
() => {

const img =
document.createElement(
"img"
);

img.src =
sticker.src;

img.className =
"draggable giftEl";

img.style.position =
"absolute";

img.style.width =
"100px";

img.style.left =
"250px";

img.style.top =
"250px";

img.style.zIndex =
highestZ++;

img.draggable = false;

makeDraggable(img);

giftScene.appendChild(
img
);

});

});

/* -------------------- */
/* ADD TEXT             */
/* -------------------- */

document
.getElementById("addTextBtn")
.addEventListener(
"click",
() => {

const textEl =
document.createElement(
"div"
);

textEl.className =
"draggable giftEl giftText";

textEl.style.position =
"absolute";

textEl.style.left =
"150px";

textEl.style.top =
"200px";

textEl.style.zIndex =
highestZ++;

textEl.style.fontFamily =
"Pacifico, cursive";

textEl.style.fontSize =
"22px";

textEl.style.color =
"#ff4fa2";

textEl.style.cursor =
"move";

textEl.style.userSelect =
"none";

textEl.style.padding =
"6px 12px";

textEl.style.background =
"rgba(255,255,255,0.6)";

textEl.style.borderRadius =
"10px";

textEl.innerText =
"✨ Your Text Here ✨";

makeDraggable(textEl);

giftScene.appendChild(
textEl
);

/* Auto-open editor for new text */
currentNote = null;
openTextEditor(textEl);

});

/* -------------------- */
/* NOTE / TEXT EDITOR   */
/* -------------------- */

const noteEditor =
document.getElementById(
"noteEditor"
);

const noteMessage =
document.getElementById(
"noteMessage"
);

const fontSelect =
document.getElementById(
"fontSelect"
);

let editingEl = null;

function openTextEditor(el){

editingEl = el;

const isNote = el.classList.contains("note");

if(isNote){

const textDiv =
el.querySelector(".noteText");

noteMessage.value =
textDiv ? textDiv.innerText : "";

} else {

noteMessage.value =
el.innerText;

}

fontSelect.value =
el.style.fontFamily
? el.style.fontFamily.split(",")[0].trim().replace(/['"]/g, "")
: "Pacifico";

noteEditor.style.display =
"block";

}

/* Double-click to edit notes and text elements */
document.addEventListener(
"dblclick",
(e) => {

const note = e.target.closest(".note");

if(note){

openTextEditor(note);

return;

}

const textEl = e.target.closest(".giftText");

if(textEl){

openTextEditor(textEl);

}

}
);

/* -------------------- */
/* SAVE EDITOR          */
/* -------------------- */

document
.getElementById(
"saveNote"
)
.addEventListener(
"click",
() => {

if(!editingEl) return;

const isNote = editingEl.classList.contains("note");

const font = fontSelect.value;

if(isNote){

const textDiv =
editingEl.querySelector(".noteText");

if(textDiv){

textDiv.innerText =
noteMessage.value;

textDiv.style.fontFamily =
font;

}

} else {

editingEl.innerText =
noteMessage.value;

editingEl.style.fontFamily =
font + ", cursive";

}

noteEditor.style.display =
"none";

}
);

/* ESC closes editor */
document.addEventListener(
"keydown",
(e) => {

if(
e.key === "Escape"
){

noteEditor.style.display =
"none";

}

}
);
