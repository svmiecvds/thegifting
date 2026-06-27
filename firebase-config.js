import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Helper to convert base64 data URL to Blob
function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export async function saveGift(components, audioDataUrl) {
    let audioUrl = null;

    if (audioDataUrl) {
        // Generate a unique ID for the audio file
        const audioId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const audioBlob = dataURLtoBlob(audioDataUrl);
        const storageRef = ref(storage, `gifts/${audioId}/voice.webm`);
        
        // Upload audio
        await uploadBytes(storageRef, audioBlob);
        
        // Get public URL
        audioUrl = await getDownloadURL(storageRef);
    }

    // Clean components to ensure no huge dataURLs (like voiceNotes) are saved in Firestore layout
    const cleanComponents = components.map(comp => {
        const clean = { ...comp };
        delete clean.voiceNote;
        return clean;
    });

    const docRef = await addDoc(collection(db, "gifts"), {
        components: cleanComponents,
        audioUrl: audioUrl,
        createdAt: serverTimestamp()
    });

    return docRef.id;
}

export async function getGift(docId) {
    const docRef = doc(db, "gifts", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}
