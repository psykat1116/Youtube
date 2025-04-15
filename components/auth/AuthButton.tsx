import React from "react";
import { Button } from "../ui/button";
import { UserCircle } from "lucide-react";

const AuthButton = () => {
  // TODO: ADD Different auth state
  return (
    <Button
      variant="outline"
      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 shadow-none border-blue-500/20 rounded-full"
    >
      <UserCircle />
      Sign In
    </Button>
  );
};

export default AuthButton;
