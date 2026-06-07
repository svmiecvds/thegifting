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

const qty = item.quantity || 1;

for (let q = 0; q < qty; q++) {

const wrapper =
document.createElement(
"div"
);

wrapper.className =
"draggable giftEl";

wrapper.style.position =
"absolute";

wrapper.style.left = (80 + q * 30) + "px";

wrapper.style.top = (80 + q * 30) + "px";

wrapper.style.width = "180px";

wrapper.style.height = "180px";

wrapper.style.zIndex =
highestZ++;

/* Plushie base image */
const plushie =
document.createElement(
"img"
);

plushie.src =
item.image;

plushie.style.position = "absolute";
plushie.style.width = "100%";
plushie.style.height = "100%";
plushie.style.objectFit = "contain";
plushie.style.left = "0";
plushie.style.top = "0";
plushie.style.transform = "none";

plushie.style.display =
"block";

plushie.draggable = false;

wrapper.appendChild(
plushie
);

/* Accessories overlaid at saved positions */
if(item.accessories && item.accessories.length > 0){

const plushieCanvasW = 280;
const plushieCanvasL = 210;
const plushieCanvasT = 210;

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

accessory.style.left  = (((rawLeft - plushieCanvasL) / plushieCanvasW) * 100) + "%";
accessory.style.top   = (((rawTop  - plushieCanvasT) / plushieCanvasW) * 100) + "%";
accessory.style.width = ((rawWidth / plushieCanvasW) * 100) + "%";
accessory.style.transform = `rotate(${acc.rotation || 0}deg) scaleX(${acc.flip || 1})`;

wrapper.appendChild(
accessory
);

});

}

if (item.voiceNote) {
    wrapper.dataset.voiceNote = item.voiceNote;
    wrapper.dataset.voiceNoteDuration = item.voiceNoteDuration || 0;
    wrapper.classList.add("has-audio");
}

makeDraggable(wrapper);

giftScene.appendChild(
wrapper
);

}

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

const isText = el.classList.contains("giftText");
if (isText) {
const currentFS = parseFloat(window.getComputedStyle(el).fontSize);
el.style.fontSize = (currentFS + 3) + "px";
} else {
const currentW = el.offsetWidth;
el.style.width = (currentW + 20) + "px";
el.style.height = (currentW + 20) + "px";
}

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

const isText = el.classList.contains("giftText");
if (isText) {
const currentFS = parseFloat(window.getComputedStyle(el).fontSize);
if (currentFS > 10) {
el.style.fontSize = (currentFS - 3) + "px";
}
} else {
const currentW = el.offsetWidth;
if(currentW > 40){
el.style.width = (currentW - 20) + "px";
el.style.height = (currentW - 20) + "px";
}
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

wrapper.appendChild(
paper
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

function rgbToHex(rgb) {
    if (!rgb) return "#ff4fa2";
    if (rgb.startsWith("#")) return rgb;
    const match = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
    if (match) {
        return "#" + 
            ("0" + parseInt(match[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(match[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(match[3], 10).toString(16)).slice(-2);
    }
    return "#ff4fa2";
}

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

const textColorPicker = document.getElementById("textColorPicker");
textColorPicker.value = el.style.color ? rgbToHex(el.style.color) : "#ff4fa2";

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
const textColor = document.getElementById("textColorPicker").value;

if(isNote){

const textDiv =
editingEl.querySelector(".noteText");

if(textDiv){

textDiv.innerText =
noteMessage.value;

textDiv.style.fontFamily =
font;

textDiv.style.color = textColor;

}

} else {

editingEl.innerText =
noteMessage.value;

editingEl.style.fontFamily =
font + ", cursive";

editingEl.style.color = textColor;

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

/* -------------------- */
/* ROTATE & FLIP        */
/* -------------------- */

/* Rotate selected */
document
.getElementById("giftRotate")
.addEventListener(
"click",
() => {
  const el = getSelectedEl();
  if(!el){
    alert("Select an item first!");
    return;
  }
  let currentRotation = parseInt(el.dataset.rotation) || 0;
  currentRotation = (currentRotation + 45) % 360;
  el.dataset.rotation = currentRotation;
  updateTransform(el);
}
);

/* Flip selected sideways */
document
.getElementById("giftFlip")
.addEventListener(
"click",
() => {
  const el = getSelectedEl();
  if(!el){
    alert("Select an item first!");
    return;
  }
  let currentFlip = parseInt(el.dataset.flip) || 1;
  currentFlip = currentFlip === 1 ? -1 : 1;
  el.dataset.flip = currentFlip;
  updateTransform(el);
}
);

function updateTransform(el) {
  let rotation = el.dataset.rotation || 0;
  let flip = el.dataset.flip || 1;
  el.style.transform = `rotate(${rotation}deg) scaleX(${flip})`;
}

/* -------------------- */
/* SERIALIZE & SAVE     */
/* -------------------- */

const saveGiftBtn = document.getElementById("saveGiftLayoutBtn");
if (saveGiftBtn) {
    saveGiftBtn.addEventListener("click", () => {
        const savedLayout = [];
        document.querySelectorAll("#giftScene .giftEl").forEach(el => {
            const isPlushie = el.classList.contains("draggable") && !el.classList.contains("note") && !el.classList.contains("giftText") && el.querySelector("img") && !el.querySelector("img").src.includes("sticker");
            const isNote = el.classList.contains("note");
            const isText = el.classList.contains("giftText");
            const isSticker = el.querySelector("img") && el.querySelector("img").src.includes("sticker") || el.tagName === "IMG";

            let type = "sticker";
            if (isPlushie) type = "plushie";
            else if (isNote) type = "note";
            else if (isText) type = "text";

            let src = "";
            let text = "";
            let noteTextDetails = null;

            if (type === "plushie") {
                src = el.querySelector("img").src;
            } else if (type === "note") {
                src = el.querySelector("img").src;
                const textDiv = el.querySelector(".noteText");
                if (textDiv) {
                    noteTextDetails = {
                        text: textDiv.innerText,
                        fontFamily: textDiv.style.fontFamily,
                        color: textDiv.style.color
                    };
                }
            } else if (type === "sticker") {
                src = el.tagName === "IMG" ? el.src : el.querySelector("img").src;
            } else if (type === "text") {
                text = el.innerText;
            }

            savedLayout.push({
                type: type,
                left: el.style.left,
                top: el.style.top,
                width: el.style.width,
                height: el.style.height,
                zIndex: el.style.zIndex,
                rotation: el.dataset.rotation || "0",
                flip: el.dataset.flip || "1",
                src: src,
                text: text,
                noteTextDetails: noteTextDetails,
                fontFamily: el.style.fontFamily || "",
                fontSize: el.style.fontSize || "",
                color: el.style.color || "",
                voiceNote: el.dataset.voiceNote || "",
                voiceNoteDuration: parseInt(el.dataset.voiceNoteDuration) || 0
            });
        });
        
        localStorage.setItem("savedGiftLayout", JSON.stringify(savedLayout));
        alert("🎉 Gift Layout Saved! Opening your wrapped card... 🎁");
        window.location = "final.html";
    });
}
