"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const {status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-4 border-primary border-opacity-50 mx-auto"></div>
        <p className="text-lg font-medium text-foreground/80">Loading...</p>
      </div>
    </div>
  );
}
