import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyDufbjI_Z5S2nxWX0Q9SHZzUsH6qhdBRwQ",
  authDomain: "hackatongrupo19.firebaseapp.com",
  projectId: "hackatongrupo19",
  storageBucket: "hackatongrupo19.firebasestorage.app",
  messagingSenderId: "1003269378934",
  appId: "1:1003269378934:web:d5c155bc1309621164a057"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

/**
 * Upload a file to Firebase Storage
 * @param {File} file the file to upload
 * @returns {Promise<string>} URL of the uploaded file
 */
export async function uploadFile(file) {
  try {
    const storageRef = ref(storage, `usuarios/${uuidv4()}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
}