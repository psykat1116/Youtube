"use client";
import { trpc } from "@/trpc/client";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import UserPageBanner, { UserPageBannerSkeleton } from "./UserPageBanner";
import UserPageInfo, { UserPageInfoSkeleton } from "./UserPageInfo";

interface UserSectionProps {
  userId: string;
}

const UserSectionSkeleton = () => {
  return (
    <div className="flex flex-col">
      <UserPageBannerSkeleton />
      <UserPageInfoSkeleton />
    </div>
  );
};

const UserSection = ({ userId }: UserSectionProps) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });

  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary fallback={<div>Error...</div>}>
        <div className="flex flex-col">
          <UserPageBanner user={user} />
          <UserPageInfo user={user} />
        </div>
      </ErrorBoundary>
    </Suspense>
  );
};

export default UserSection;
