import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  createUser,
  signIn as firebaseSignIn,
  signOut as firebaseSignOut,
  signInWithGoogle as firebaseSignInWithGoogle,
  onAuthChange,
} from "../services/firebase";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...firebaseUser,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    if (!auth) {
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password) => {
    const result = await createUser(email, password);
    return { data: result, error: null };
  };

  const signIn = async (email, password) => {
    const result = await firebaseSignIn(email, password);
    return { data: result, error: null };
  };

  const signInWithGoogle = async () => {
    const result = await firebaseSignInWithGoogle();
    return { data: result, error: null };
  };

  const signOut = async () => {
    await firebaseSignOut();
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session: user,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
