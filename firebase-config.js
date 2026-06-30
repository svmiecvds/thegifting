import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
// Storage import removed

const firebaseConfig = {
  apiKey: "AIzaSyDFuBm7nMqGIv_iGoD_NZLXl49Q1sV8f1w",
  authDomain: "the-gifting-co.firebaseapp.com",
  projectId: "the-gifting-co",
  storageBucket: "the-gifting-co.firebasestorage.app",
  messagingSenderId: "345516616271",
  appId: "1:345516616271:web:a79fcee3d1f931854c583a",
  measurementId: "G-LR0WNGJJE9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Storage initialization removed

export async function saveGift(components, audioDataUrl) {
    // We are no longer using Firebase Storage.
    // Instead, we will store the base64 dataURL directly in Firestore.
    // This works because the audio recording is small (15s max, well under the 1MB Firestore limit).
    let audioUrl = audioDataUrl || null;

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
