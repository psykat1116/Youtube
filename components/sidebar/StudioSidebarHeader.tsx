import { useUser } from "@clerk/nextjs";
import React from "react";
import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { Skeleton } from "../ui/skeleton";

const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
    return (
      <SidebarHeader className="flex items-center justify-center pb-4">
        <Skeleton className="size-[112px] rounded-full" />
        <div className="flex flex-col items-center mt-2 gap-y-2">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
      </SidebarHeader>
    );
  }

  if (state === "collapsed") {
    <SidebarMenuItem>
      <SidebarMenuButton tooltip="Your profile" asChild>
        <Link href="/users/current">
          <UserAvatar
            imageUrl={user.imageUrl}
            name={user.fullName ?? "User"}
            size="xs"
          />
          <span className="text-sm">Your Profile</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>;
  }

  return (
    <SidebarHeader className="flex items-center justify-center pb-4">
      <Link href="/users/current">
        <UserAvatar
          imageUrl={user.imageUrl}
          name={user.fullName || "User"}
          className="size-[112px] hover:opacity-80 transition-opacity"
        />
      </Link>
      <div className="flex flex-col items-center mt-2 gap-y-2">
        <p className="text-sm font-medium">Your profile</p>
        <p className="text-xs text-muted-foreground">
          {user.fullName || "User"}
        </p>
      </div>
    </SidebarHeader>
  );
};

export default StudioSidebarHeader;
