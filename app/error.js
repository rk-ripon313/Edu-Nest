"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

const GlobalError = ({ error, reset }) => {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold text-destructive mb-4">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mb-6">
        An unexpected error occurred. Please try again or go back home.
      </p>

      <div className="flex gap-3">
        <Button variant="default" onClick={() => reset()}>
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline">Go Home</Button>
        </Link>
      </div>
    </div>
  );
};
export default GlobalError;
