import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { UserGetOneOutput } from "@/types";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionButton from "@/components/watch/SubscriptionButton";
import { useMemo } from "react";

interface UserPageInfoProps {
  user: UserGetOneOutput;
}

export const UserPageInfoSkeleton = () => {
  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <Skeleton className="h-[60px] w-[60px] rounded-full" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
        </div>
        <Skeleton className="h-10 w-full mt-3 rounded-full" />
      </div>
      <div className="hidden md:flex items-start gap-4">
        <Skeleton className="h-[160px] w-[160px] rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48 mt-4" />
          <Skeleton className="h-10 w-32 mt-3 rounded-full" />
        </div>
      </div>
    </div>
  );
};

const UserPageInfo = ({ user }: UserPageInfoProps) => {
  const clerk = useClerk();
  const { userId, isLoaded } = useAuth();
  const username = useMemo(() => {
    return user.name.toLowerCase().replace(/\s/g, "");
  }, [user.name]);
  const videoCount = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(user.videoCount);
  }, [user.videoCount]);
  const subscriberCount = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
    }).format(user.subscriberCount);
  }, [user.subscriberCount]);

  const { isPending, onClick } = useSubscription({
    userId: user.id,
  });

  return (
    <div className="py-6">
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user.imageUrl}
            name={user.name}
            className="h-[50px] w-[50px]"
            onClick={() => {
              if (user.clerkId === userId) {
                clerk.openUserProfile();
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>@{username}</span>
              <span>•</span>
              <span>{subscriberCount} subscribers</span>
              <span>•</span>
              <span>{videoCount} videos</span>
            </div>
          </div>
        </div>
        {userId === user.clerkId ? (
          <Button
            variant="secondary"
            className="w-full mt-3 rounded-full"
            asChild
          >
            <Link prefetch href="/studio">
              Go to Studio
            </Link>
          </Button>
        ) : (
          <SubscriptionButton
            disabled={isPending || !isLoaded}
            onClick={onClick}
            isSubscribed={user.isSubscribed}
            className="w-full mt-3"
          />
        )}
      </div>
      <div className="md:flex items-start gap-4 hidden">
        <UserAvatar
          size="xl"
          imageUrl={user.imageUrl}
          name={user.name}
          className={cn(
            userId === user.clerkId &&
              "cursor-pointer hover:opacity-80 transition-opacity duration-300"
          )}
          onClick={() => {
            if (user.clerkId === userId) {
              clerk.openUserProfile();
            }
          }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>@{username}</span>
            <span>•</span>
            <span>{subscriberCount} subscribers</span>
            <span>•</span>
            <span>{videoCount} videos</span>
          </div>
          {userId === user.clerkId ? (
            <Button variant="secondary" className="mt-3 rounded-full" asChild>
              <Link prefetch href="/studio">
                Go to Studio
              </Link>
            </Button>
          ) : (
            <SubscriptionButton
              disabled={isPending || !isLoaded}
              onClick={onClick}
              isSubscribed={user.isSubscribed}
              className="mt-3"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPageInfo;
