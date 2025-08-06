"use client";
import { Button } from "@/components/ui/button";
import { RectangleGogglesIcon } from "lucide-react";

import { signIn } from "next-auth/react";

const SocialLogins = () => {
  return (
    <>
      <div className="flex items-center my-3">
        <div className="h-px flex-grow bg-border" />
        <span className="px-2 text-sm text-muted-foreground">OR</span>
        <div className="h-px flex-grow bg-border" />
      </div>

      <>
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex gap-2 items-center justify-center"
          >
            <RectangleGogglesIcon size={20} />
            Continue with Google
          </Button>
        </div>
      </>
    </>
  );
};

export default SocialLogins;
