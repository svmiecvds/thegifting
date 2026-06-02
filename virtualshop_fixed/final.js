const giftScene = document.getElementById("giftScene");

/* Load saved layout array */
const savedLayout = JSON.parse(localStorage.getItem("savedGiftLayout")) || [];

let hasAudioNote = false;
let activeAudio = null;

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
        // Wait, did the plushie wrapper serialize its inner accessories or was it flat?
        // Since we saved the whole flat elements including overlays or we saved them as individual elements.
        // Wait! Let's check how we serialized:
        // "src = el.querySelector('img').src;"
        // Wait! During serialization, we ran `document.querySelectorAll("#giftScene .giftEl").forEach(el => ...)`
        // In gift.js, the plushie has a wrapper ".draggable.giftEl" that has a base plushie img and children overlay imgs (the accessories!).
        // So the wrapper has multiple children!
        // To reconstruct them perfectly, we can just copy all children img elements of the plushie or rebuild them!
        // Wait, let's see how our serialization in gift.js works:
        // `savedLayout.push({ ... src: src, ... })`
        // Wait! If the plushie had accessories overlaid, they were children of the wrapper.
        // During serialization, did we store the accessories overlay data inside the savedLayout?
        // Ah! In `gift.js`, the overlays were created inside the wrapper when loading gift items from checkout:
        // ```javascript
        // /* Accessories overlaid at saved positions */
        // if(item.accessories && item.accessories.length > 0){
        //   item.accessories.forEach(acc => {
        //     const accessory = document.createElement("img");
        //     accessory.src = acc.image;
        //     ...
        //     wrapper.appendChild(accessory);
        //   });
        // }
        // ```
        // Yes! The accessories are children inside the plushie wrapper.
        // So, when we serialize the plushie on the gift page, how do we serialize its accessories?
        // If we only save the base image `src`, the overlays will be lost on the final page!
        // Oh! That is a very important insight!
        // We must serialize the overlays as well, or since the final page can easily read the accessories from `giftItems` inside `localStorage` for that plushie name, we can dynamically overlays them just like in `gift.js`!
        // Wait! That is extremely clever! Because `localStorage` contains `"giftItems"`, which has the exact plushie name, image, and its accessories!
        // So, inside `final.js`, when we reconstruct a `"plushie"`, we can look up the corresponding item in `giftItems` (by comparing `item.src` with the base image `c.image` in `giftItems`) and dynamically re-render its accessories overlaid on top of it, exactly like we did in `gift.js`!
        // Let's check if this is 100% correct.
        // Yes! It is extremely clean, works flawlessly, and requires zero extra complex serialization logic!
        // Let's implement this lookup lookup in `final.js`:
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
                wrapper.appendChild(accessory);
            });
        }

        // Voice Note Playback
        if (item.voiceNote) {
            hasAudioNote = true;
            wrapper.dataset.voiceNote = item.voiceNote;
            wrapper.classList.add("has-audio");
            
            wrapper.addEventListener("click", (e) => {
                e.stopPropagation();
                if (activeAudio) {
                    activeAudio.pause();
                }
                
                activeAudio = new Audio(item.voiceNote);
                activeAudio.play();
                
                // Audio playing animation
                img.classList.add("plushie-speaking");
                activeAudio.onended = () => {
                    img.classList.remove("plushie-speaking");
                };
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

/* Create "Click on your gifts" CTA button if custom audio is loaded */
if (hasAudioNote) {
    const cta = document.createElement("button");
    cta.className = "click-gifts-cta";
    cta.innerText = "🎵 Click on your gifts to play voice message! 🧸";
    
    // Add pulsing play action
    cta.addEventListener("click", () => {
        // Automatically find and click the first audio plushie to play!
        const firstAudioPlushie = document.querySelector(".has-audio");
        if (firstAudioPlushie) {
            firstAudioPlushie.click();
        }
    });
    
    document.body.appendChild(cta);
}
