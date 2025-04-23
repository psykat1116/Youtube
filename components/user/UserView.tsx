import React from "react";
import UserSection from "./UserSection";
import UserVideoSection from "./UserVideoSection";
import { Separator } from "../ui/separator";

interface UserIdPageProps {
  userId: string;
}

const UserView = ({ userId }: UserIdPageProps) => {
  return (
    <div className="flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto mb-10 gap-y-6">
      <UserSection userId={userId} />
      <Separator />
      <UserVideoSection userId={userId} />
    </div>
  );
};

export default UserView;
