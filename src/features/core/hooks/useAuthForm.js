import { useState } from "react";
import { useAuth } from "../../../shared/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function useAuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate("/");
      } else {
        await signUp(email, password);
        setSuccess("Account created successfully! You can now sign in.");
        setIsLogin(true);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      const errorCode = err.code || "";
      let errorMessage = err.message;

      if (errorCode === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please sign in instead.";
      } else if (errorCode === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (errorCode === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (errorCode === "auth/user-not-found") {
        errorMessage = "No account found with this email. Please sign up.";
      } else if (errorCode === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (errorCode === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please check and try again.";
      } else if (errorCode === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (err) {
      const errorCode = err.code || "";
      let errorMessage = err.message;

      if (errorCode === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in popup was closed. Please try again.";
      } else if (errorCode === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups for this site.";
      } else if (errorCode === "auth/cancelled-popup-request") {
        errorMessage = "Sign-in was cancelled.";
      }

      setError(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  return {
    isLogin,
    email,
    password,
    error,
    loading,
    googleLoading,
    success,
    setEmail,
    setPassword,
    handleSubmit,
    handleGoogleSignIn,
    handleToggleMode,
  };
}
