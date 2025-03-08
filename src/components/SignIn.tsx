"use client";

import { auth } from "@/lib/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { useState } from "react";

export default function SignIn() {
  const [user, setUser] = useState<User | null>(null);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <div className="text-white">
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={handleSignOut} className="p-2 border rounded">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={signInWithGoogle} className="p-2 border rounded">
          Sign In with Google
        </button>
      )}
    </div>
  );
}
