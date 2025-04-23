"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import UserPageInfo, { UserPageInfoSkeleton } from "@/components/user/UserPageInfo";
import UserPageBanner, { UserPageBannerSkeleton } from "@/components/user/UserPageBanner";

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
