import { Link } from "react-router-dom";
import { Layout } from "./Layout";
import { Button } from "./Button";
import { Lock } from "./Icons";
import { useAuth } from "../context/AuthContext";

export function AuthRequired({
  title = "Access Restricted",
  message = "Please sign in to access this page.",
}) {
  const { signInWithGoogle } = useAuth();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="p-4 bg-slate-100 rounded-full">
          <Lock className="w-12 h-12 text-slate-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-600 max-w-md">{message}</p>
        </div>
        <div className="flex gap-4">
          <Link to="/">
            <Button variant="secondary">Go Home</Button>
          </Link>
          <Button onClick={signInWithGoogle}>Sign In</Button>
        </div>
      </div>
    </Layout>
  );
}
