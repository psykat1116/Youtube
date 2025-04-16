"use client";
import { Clapperboard, UserCircle } from "lucide-react";
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

const AuthButton = () => {
  // TODO: ADD Different auth state
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 shadow-none border-blue-500/20 rounded-full"
          >
            <UserCircle />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            {/** TODO: ADD USER PROFILE */}
            <UserButton.Link
              label="Studio"
              href="/studio"
              labelIcon={<Clapperboard className="size-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
    </>
  );
};

export default AuthButton;
