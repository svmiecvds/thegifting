const giftScene = document.getElementById("giftScene");

/* Load saved layout array */
const savedLayout = JSON.parse(localStorage.getItem("savedGiftLayout")) || [];

let hasAudioNote = false;
let activeAudio = null;
const audioPlaylist = [];
let currentPlaylistIndex = -1;
let isPlaylistPlaying = false;
let fallbackTimeoutId = null;

/* Reconstruct everything inside the stationary scene */
savedLayout.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.className = "giftEl";
    wrapper.style.position = "absolute";
    wrapper.style.left = item.left;
    wrapper.style.top = item.top;
    wrapper.style.width = item.width;
    wrapper.style.height = item.height;
    wrapper.style.zIndex = item.zIndex;
    
    // Set transform states
    const rotation = item.rotation || "0";
    const flip = item.flip || "1";
    wrapper.style.transform = `rotate(${rotation}deg) scaleX(${flip})`;

    if (item.type === "plushie") {
        // Base plushie image
        const img = document.createElement("img");
        img.src = item.src;
        img.style.position = "absolute";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "contain";
        img.style.left = "0";
        img.style.top = "0";
        img.draggable = false;
        wrapper.appendChild(img);

        // Reconstruct overlays (accessories)
        const giftItems = JSON.parse(localStorage.getItem("giftItems")) || [];
        // Extract filename from item.src
        const filename = item.src.split("/").pop();
        const matchedItem = giftItems.find(g => g.image.split("/").pop() === filename);
        if (matchedItem && matchedItem.accessories) {
            const plushieCanvasW = 280;
            const plushieCanvasL = 210;
            const plushieCanvasT = 210;
            
            matchedItem.accessories.forEach(acc => {
                const accessory = document.createElement("img");
                accessory.src = acc.image;
                accessory.style.position = "absolute";
                accessory.style.pointerEvents = "none";
                
                const rawLeft = parseFloat(acc.left);
                const rawTop  = parseFloat(acc.top);
                const rawWidth = parseFloat(acc.width);
                
                accessory.style.left  = (((rawLeft - plushieCanvasL) / plushieCanvasW) * 100) + "%";
                accessory.style.top   = (((rawTop  - plushieCanvasT) / plushieCanvasW) * 100) + "%";
                accessory.style.width = ((rawWidth / plushieCanvasW) * 100) + "%";
                accessory.style.transform = `rotate(${acc.rotation || 0}deg) scaleX(${acc.flip || 1})`;
                wrapper.appendChild(accessory);
            });
        }

        // Voice Note Playback
        const voiceNoteSrc = item.voiceNote || (matchedItem && matchedItem.voiceNote);
        const voiceNoteDuration = parseInt(item.voiceNoteDuration) || (matchedItem && parseInt(matchedItem.voiceNoteDuration)) || 0;
        if (voiceNoteSrc) {
            hasAudioNote = true;
            wrapper.dataset.voiceNote = voiceNoteSrc;
            wrapper.dataset.voiceNoteDuration = voiceNoteDuration;
            wrapper.classList.add("has-audio");
            
            audioPlaylist.push({
                wrapper: wrapper,
                img: img,
                src: voiceNoteSrc,
                duration: voiceNoteDuration
            });
        }
    } 
    else if (item.type === "note") {
        const paper = document.createElement("img");
        paper.src = item.src;
        paper.style.width = "100%";
        paper.draggable = false;
        wrapper.appendChild(paper);
        wrapper.className = "note giftEl";

        if (item.noteTextDetails) {
            const textDiv = document.createElement("div");
            textDiv.className = "noteText";
            textDiv.style.position = "absolute";
            textDiv.style.top = "12%";
            textDiv.style.left = "10%";
            textDiv.style.width = "75%";
            textDiv.style.height = "70%";
            textDiv.style.overflow = "hidden";
            textDiv.style.textAlign = "center";
            textDiv.style.wordWrap = "break-word";
            textDiv.style.fontSize = "18px";
            textDiv.style.userSelect = "none";
            
            textDiv.innerText = item.noteTextDetails.text;
            textDiv.style.fontFamily = item.noteTextDetails.fontFamily;
            textDiv.style.color = item.noteTextDetails.color;
            wrapper.appendChild(textDiv);
        }
    } 
    else if (item.type === "sticker") {
        const img = document.createElement("img");
        img.src = item.src;
        img.style.width = "100%";
        img.draggable = false;
        wrapper.appendChild(img);
    } 
    else if (item.type === "text") {
        wrapper.className = "giftEl giftText";
        wrapper.innerText = item.text;
        wrapper.style.fontFamily = item.fontFamily;
        wrapper.style.fontSize = item.fontSize;
        wrapper.style.color = item.color;
        wrapper.style.userSelect = "none";
    }

    giftScene.appendChild(wrapper);
});

// Playlist control functions
function playTrack(index) {
    if (fallbackTimeoutId) {
        clearTimeout(fallbackTimeoutId);
        fallbackTimeoutId = null;
    }
    if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
    }

    // Clear speaking class from all playlist items
    audioPlaylist.forEach(track => {
        track.img.classList.remove("plushie-speaking");
    });

    if (index < 0 || index >= audioPlaylist.length) {
        isPlaylistPlaying = false;
        currentPlaylistIndex = -1;
        updateCTA();
        return;
    }

    currentPlaylistIndex = index;
    isPlaylistPlaying = true;
    updateCTA();

    const track = audioPlaylist[index];
    track.img.classList.add("plushie-speaking");

    activeAudio = new Audio(track.src);
    activeAudio.play().catch(err => {
        console.error("Playback failed", err);
        // Automatically skip to the next track if playing fails
        if (fallbackTimeoutId) {
            clearTimeout(fallbackTimeoutId);
            fallbackTimeoutId = null;
        }
        setTimeout(playNext, 1000);
    });

    let endedFired = false;
    const handleEnded = () => {
        if (endedFired) return;
        endedFired = true;
        if (fallbackTimeoutId) {
            clearTimeout(fallbackTimeoutId);
            fallbackTimeoutId = null;
        }
        track.img.classList.remove("plushie-speaking");
        playNext();
    };

    activeAudio.onended = handleEnded;

    if (track.duration && track.duration > 0) {
        // Fallback in case browser does not fire 'ended' event (common WebM metadata issue)
        fallbackTimeoutId = setTimeout(handleEnded, track.duration + 200); // 200ms buffer
    }
}

function playNext() {
    playTrack(currentPlaylistIndex + 1);
}

function stopPlaylist() {
    if (fallbackTimeoutId) {
        clearTimeout(fallbackTimeoutId);
        fallbackTimeoutId = null;
    }
    if (activeAudio) {
        activeAudio.pause();
        activeAudio = null;
    }
    audioPlaylist.forEach(track => {
        track.img.classList.remove("plushie-speaking");
    });
    isPlaylistPlaying = false;
    currentPlaylistIndex = -1;
    updateCTA();
}

function updateCTA() {
    const cta = document.querySelector(".click-gifts-cta");
    if (!cta) return;

    if (isPlaylistPlaying) {
        const displayIndex = currentPlaylistIndex + 1;
        const total = audioPlaylist.length;
        if (total > 1) {
            cta.innerText = `⏸️ Pause sequence (Playing ${displayIndex} of ${total}) 🧸`;
        } else {
            cta.innerText = `⏸️ Pause voice message 🧸`;
        }
    } else {
        if (currentPlaylistIndex !== -1 && currentPlaylistIndex < audioPlaylist.length) {
            cta.innerText = `▶️ Resume voice messages 🧸`;
        } else {
            if (audioPlaylist.length > 1) {
                cta.innerText = `🎵 Play all voice messages in sequence! 🧸`;
            } else {
                cta.innerText = `🎵 Play voice message! 🧸`;
            }
        }
    }
}

// Wire up click event listeners for playlist items
audioPlaylist.forEach((track, index) => {
    track.wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isPlaylistPlaying && currentPlaylistIndex === index) {
            stopPlaylist();
        } else {
            playTrack(index);
        }
    });
});

/* Create "Click on your gifts" CTA button if custom audio is loaded */
if (hasAudioNote) {
    const cta = document.createElement("button");
    cta.className = "click-gifts-cta";
    document.body.appendChild(cta);
    
    // Add pulsing play action
    cta.addEventListener("click", () => {
        if (isPlaylistPlaying) {
            stopPlaylist();
        } else {
            const resumeIndex = currentPlaylistIndex !== -1 ? currentPlaylistIndex : 0;
            playTrack(resumeIndex);
        }
    });
    
    updateCTA();
}
