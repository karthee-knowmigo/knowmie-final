import { create } from "zustand";
import {
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  getRedirectResult,
  User,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase-config";

interface AuthStore {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  handleRedirectResult: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  signInWithGoogle: async () => {
    if (auth) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Error signing in with Google:", error);
        set({ loading: false });
      }
    }
  },
  handleRedirectResult: async () => {
    if (auth) {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          set({ user: result.user, loading: false });
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
        set({ loading: false });
      }
    }
  },
  logout: async () => {
    if (auth) {
      try {
        await signOut(auth);

        set({ user: null, loading: false });
      } catch (error) {
        console.error("Error signing out:", error);
        set({ loading: false });
      }
    }
  },
  setUser: (user) => set({ user, loading: false }),
}));

// Initialize auth state listener and handle redirect result
if (auth) {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
  });
}

// Handle redirect result on initial load
useAuthStore.getState().handleRedirectResult();
