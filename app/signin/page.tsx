"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-secondary to-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-background/50 backdrop-blur-sm p-8 shadow-lg border border-accent/20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-foreground/80">
            Sign in to access your email dashboard
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-accent/30 bg-primary px-4 py-3 text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background disabled:opacity-70"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              className="h-6 w-6"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            <span>{isLoading ? "Signing in..." : "Sign in with Google"}</span>
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-foreground/80">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="font-medium text-accent hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-accent hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
