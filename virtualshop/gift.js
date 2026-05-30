const giftScene =
document.getElementById(
"giftScene"
);

const cart =
JSON.parse(
localStorage.getItem(
"cart"
)
) || [];

let selected = null;

let currentNote = null;

let highestZ = 1;

/* -------------------- */
/* LOAD PLUSHIES */
/* -------------------- */

cart.forEach(item=>{

for(
let i=0;
i<item.quantity;
i++
){

const plushie =
document.createElement(
"img"
);

plushie.src =
item.image;

plushie.className =
"draggable";

plushie.style.width =
"140px";

plushie.style.left =
(50 + i*35) + "px";

plushie.style.top =
(50 + i*35) + "px";

plushie.style.zIndex =
highestZ++;

giftScene.appendChild(
plushie
);

}

});

/* -------------------- */
/* DRAGGING */
/* -------------------- */

document.addEventListener(
"mousedown",
(e)=>{

if(
e.target.classList.contains(
"draggable"
)
){

selected =
e.target;

selected.style.zIndex =
highestZ++;

}

});

document.addEventListener(
"mousemove",
(e)=>{

if(!selected) return;

const sceneRect =
giftScene.getBoundingClientRect();

selected.style.left =

(
e.clientX
-
sceneRect.left
-
selected.offsetWidth/2
)

+ "px";

selected.style.top =

(
e.clientY
-
sceneRect.top
-
selected.offsetHeight/2
)

+ "px";

});

document.addEventListener(
"mouseup",
()=>{

selected = null;

});

/* -------------------- */
/* CREATE NOTES */
/* -------------------- */

document
.querySelectorAll(
".noteTemplate"
)
.forEach(note=>{

note.addEventListener(
"click",
()=>{

const wrapper =
document.createElement(
"div"
);

wrapper.className =
"note draggable";

wrapper.style.left =
"200px";

wrapper.style.top =
"150px";

wrapper.style.zIndex =
highestZ++;

const paper =
document.createElement(
"img"
);

paper.src =
note.src;

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

giftScene.appendChild(
wrapper
);

});

});

/* -------------------- */
/* CREATE STICKERS */
/* -------------------- */

document
.querySelectorAll(
".stickerTemplate"
)
.forEach(sticker=>{

sticker.addEventListener(
"click",
()=>{

const img =
document.createElement(
"img"
);

img.src =
sticker.src;

img.className =
"draggable";

img.style.width =
"100px";

img.style.left =
"250px";

img.style.top =
"250px";

img.style.zIndex =
highestZ++;

giftScene.appendChild(
img
);

});

});

/* -------------------- */
/* NOTE EDITOR */
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

document.addEventListener(
"dblclick",
(e)=>{

const note =
e.target.closest(
".note"
);

if(!note) return;

currentNote = note;

const textDiv =
note.querySelector(
".noteText"
);

noteMessage.value =
textDiv.innerText;

fontSelect.value =
textDiv.style.fontFamily ||
"Pacifico";

noteEditor.style.display =
"block";

});

/* -------------------- */
/* SAVE NOTE */
/* -------------------- */

document
.getElementById(
"saveNote"
)
.addEventListener(
"click",
()=>{

if(!currentNote) return;

const textDiv =
currentNote.querySelector(
".noteText"
);

textDiv.innerText =
noteMessage.value;

textDiv.style.fontFamily =
fontSelect.value;

noteEditor.style.display =
"none";

});

/* -------------------- */
/* ESC CLOSES EDITOR */
/* -------------------- */

document.addEventListener(
"keydown",
(e)=>{

if(
e.key === "Escape"
){

noteEditor.style.display =
"none";

}

});