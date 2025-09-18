import { initializeApp } from "firebase/app";
import type { User } from "firebase/auth";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { defineNuxtPlugin, useRouter, navigateTo } from "#app";

const firebaseConfig = {
  apiKey: "AIzaSyAALsz0B4JMMHEodKgRC7UVIBFZegsN3KU",
  authDomain: "practice-92a2a.firebaseapp.com",
  projectId: "practice-92a2a",
  storageBucket: "practice-92a2a.firebasestorage.app",
  messagingSenderId: "681728893564",
  appId: "1:681728893564:web:82a7a786b83359ce139ff9",
  measurementId: "G-Y83919R5TF",
};

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  // Add custom parameters to the Google provider
  googleProvider.setCustomParameters({
    prompt: "select_account",
  });

  // Create composable state for user
  const user = useState("firebase-user", () => null);

  // Set up auth state listener
  auth.onAuthStateChanged((newUser) => {
    user.value = newUser;
    if (newUser) {
      // If we have a user, navigate to home page
      navigateTo("/");
    }
  });

  // Handle Google Sign In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        // Successful sign in - navigate to home
        navigateTo("/");
      }
      return { user: result.user, error: null };
    } catch (error: any) {
      // If popup is blocked, fall back to redirect
      if (error.code === "auth/popup-blocked") {
        try {
          await signInWithRedirect(auth, googleProvider);
          const result = await getRedirectResult(auth);
          if (result?.user) {
            // Successful sign in after redirect - navigate to home
            navigateTo("/");
            return { user: result.user, error: null };
          }
        } catch (redirectError: any) {
          return { user: null, error: redirectError.message };
        }
      }
      return { user: null, error: error.message };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await auth.signOut();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  return {
    provide: {
      auth: {
        user,
        signInWithGoogle,
        signOut,
      },
    },
  };
});
