
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  reload,
} from "firebase/auth";

import { auth } from "../services/firebase";
import { getUserProfile } from "../services/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (!active) return;

        setLoading(true);

        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        // Keep the restored Firebase user even if profile
        // loading temporarily fails.
        setUser(firebaseUser);

        try {
          await reload(firebaseUser);

          if (!active) return;

          // Reload may refresh account information.
          setUser(auth.currentUser);

          const userProfile = await getUserProfile(
            firebaseUser.uid
          );

          if (!active) return;

          setProfile(userProfile);
        } catch (error) {
          console.error("AUTH PROFILE ERROR:", error);

          if (active) {
            setProfile(null);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, profile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
