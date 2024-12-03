import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword as FBSCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as FBSsignInWithEmailAndPassword,
  signOut as FBSSignOut,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const createUserWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const result = await FBSCreateUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error creating user with email and password:", error);
    throw error;
  }
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const result = await FBSsignInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with email and password:", error);
    throw error;
  }
};

export const signOut = async () => {
  await FBSSignOut(auth);
};
