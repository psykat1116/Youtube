import { VideoGetOneOutput } from "@/types";
import Link from "next/link";
import React from "react";
import UserAvatar from "../UserAvatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import SubscriptionButton from "./SubscriptionButton";
import UserInfo from "../user/UserInfo";
import { useSubscription } from "@/hooks/useSubscription";

interface WatchOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: VideoGetOneOutput["id"];
}

const WatchOwner = ({ user, videoId }: WatchOwnerProps) => {
  const { userId, isLoaded } = useAuth();
  const { onClick, isPending } = useSubscription({
    userId: user.id,
    fromVideoId: videoId,
    isSubscribed: user.isSubscribed,
  });

  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 minw-0">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo size="lg" name={user.name} />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>
      {userId === user.clerkId ? (
        <Button asChild variant="secondary" className="rounded-full">
          <Link href={`/studio/video/${videoId}`}>Edit</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={onClick}
          disabled={isPending || !isLoaded}
          isSubscribed={user.isSubscribed}
          className="flex-none"
        />
      )}
    </div>
  );
};

export default WatchOwner;
