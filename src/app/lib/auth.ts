import { FirebaseError } from "firebase/app";
import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword as FBSCreateUserWithEmailAndPassword,
  signInWithEmailAndPassword as FBSsignInWithEmailAndPassword,
  signOut as FBSSignOut,
  updateProfile,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch {
    throw new Error("Something went wrong");
  }
};

export const createUserWithEmailAndPassword = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const result = await FBSCreateUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(result.user, { displayName });
    return result.user;
  } catch {
    throw new Error("Something went wrong");
  }
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const result = await FBSsignInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (err) {
    const error = err as FirebaseError;
    if (error?.code === "auth/wrong-password") {
      throw new Error("Invalid password");
    } else if (error?.code === "auth/user-not-found") {
      throw new Error("User not found");
    }
    throw new Error("Something went wrong");
  }
};

export const signOut = async () => {
  await FBSSignOut(auth);
};
