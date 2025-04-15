"use client";
import { Button } from "../ui/button";
import { UserCircle } from "lucide-react";

import {
  UserButton,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

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
        <UserButton />
        {/** TODO: ADD Menu Items For Studio or User Profile */}
      </SignedIn>
    </>
  );
};

export default AuthButton;
