import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { config } from "../../config";

const firebaseConfig = {
  apiKey: config.firebaseApiKey,
  authDomain: config.firebaseAuthDomain,
  projectId: config.firebaseProjectId,
  storageBucket: config.firebaseStorageBucket,
  messagingSenderId: config.firebaseMessagingSenderId,
  appId: config.firebaseAppId,
};

const isConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId;

if (!isConfigured) {
  console.warn(
    "Missing Firebase configuration. Authentication and data storage will not work.",
  );
}

const app = isConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

const googleProvider = app ? new GoogleAuthProvider() : null;

export const createUser = async (email, password) => {
  if (!auth) throw new Error("Firebase is not configured.");
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email, password) => {
  if (!auth) throw new Error("Firebase is not configured.");
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) throw new Error("Firebase is not configured.");
  return signInWithPopup(auth, googleProvider);
};

export const signOut = async () => {
  if (!auth) throw new Error("Firebase is not configured.");
  return firebaseSignOut(auth);
};

export const onAuthChange = (callback) => {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
};

export const uploadRecording = async (userId, blob) => {
  if (!storage) throw new Error("Firebase is not configured.");
  const fileName = `recordings/${userId}/${Date.now()}.webm`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, blob);
  return fileName;
};

export const getRecordingUrl = async (path) => {
  if (!storage) return "";
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch {
    console.warn("Failed to get recording URL");
    return "";
  }
};

export const deleteRecording = async (path) => {
  if (!storage) return;
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch {
    console.warn("Failed to delete recording");
  }
};

export const saveInterview = async (interviewData) => {
  if (!db) throw new Error("Firebase is not configured.");
  const docRef = await addDoc(collection(db, "interviews"), {
    ...interviewData,
    created_at: new Date().toISOString(),
  });
  return { id: docRef.id, ...interviewData };
};

export const getInterviews = async (userId) => {
  if (!db) return [];
  try {
    const q = query(
      collection(db, "interviews"),
      where("user_id", "==", userId),
      orderBy("created_at", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch {
    console.warn("Failed to get interviews");
    return [];
  }
};

export const deleteInterview = async (interviewId, recordingPath) => {
  if (!db) throw new Error("Firebase is not configured.");
  await deleteDoc(doc(db, "interviews", interviewId));
  if (recordingPath) {
    await deleteRecording(recordingPath);
  }
  return true;
};
