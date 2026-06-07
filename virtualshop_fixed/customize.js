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
accessories,

voiceNote:
voiceNoteDataUrl,

voiceNoteDuration:
voiceNoteDuration

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

/* -------------------- */
/* VOICE RECORDER API   */
/* -------------------- */

let mediaRecorder = null;
let audioChunks = [];
let voiceNoteDataUrl = null;
let voiceNoteDuration = 0;
let recordingStartTime = 0;
let recordingTimer = null;
let recordDuration = 0;

const recordBtn = document.getElementById("recordBtn");
const recordStatus = document.getElementById("recordStatus");
const playbackContainer = document.getElementById("recordPlaybackContainer");
const playVoiceBtn = document.getElementById("playVoiceBtn");
const deleteVoiceBtn = document.getElementById("deleteVoiceBtn");

if (recordBtn) {
    recordBtn.addEventListener("click", () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            stopRecording();
        } else {
            startRecording();
        }
    });
}

function startRecording() {
    audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                voiceNoteDuration = Date.now() - recordingStartTime;
                const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
                const reader = new FileReader();
                reader.onloadend = () => {
                    voiceNoteDataUrl = reader.result;
                    recordStatus.innerText = "🎙️ Voice note recorded!";
                    recordStatus.classList.remove("recording-active");
                    playbackContainer.style.display = "flex";
                };
                reader.readAsDataURL(audioBlob);

                // Stop all tracks on the stream to release the mic
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            recordingStartTime = Date.now();
            recordBtn.innerText = "⏹️ Stop Recording";
            recordBtn.style.background = "#ffd6d6";
            recordBtn.style.boxShadow = "0 0 10px #ffd6d6";
            recordStatus.innerText = "Recording... (15s limit)";
            recordStatus.classList.add("recording-active");
            playbackContainer.style.display = "none";
            
            recordDuration = 0;
            clearInterval(recordingTimer);
            recordingTimer = setInterval(() => {
                recordDuration++;
                if (recordDuration >= 15) {
                    stopRecording();
                } else {
                    recordStatus.innerText = `Recording... (${15 - recordDuration}s remaining)`;
                }
            }, 1000);
        })
        .catch(err => {
            console.error("Microphone access denied or not supported:", err);
            alert("Unable to access microphone. Please ensure microphone permissions are granted.");
            recordStatus.innerText = "Microphone access error";
        });
}

function stopRecording() {
    clearInterval(recordingTimer);
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
    recordBtn.innerText = "🎤 Record (15s limit)";
    recordBtn.style.background = "#ffb6d9";
    recordBtn.style.boxShadow = "0 0 10px pink";
}

// Playback
let testAudio = null;
if (playVoiceBtn) {
    playVoiceBtn.addEventListener("click", () => {
        if (voiceNoteDataUrl) {
            if (testAudio) {
                testAudio.pause();
            }
            testAudio = new Audio(voiceNoteDataUrl);
            testAudio.play();
            recordStatus.innerText = "🔊 Playing voice note...";
            testAudio.onended = () => {
                recordStatus.innerText = "🎙️ Voice note recorded!";
            };
        }
    });
}

// Delete
if (deleteVoiceBtn) {
    deleteVoiceBtn.addEventListener("click", () => {
        voiceNoteDataUrl = null;
        voiceNoteDuration = 0;
        if (testAudio) {
            testAudio.pause();
            testAudio = null;
        }
        recordStatus.innerText = "Ready to record";
        playbackContainer.style.display = "none";
    });
}
