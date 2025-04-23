import Link from "next/link";

import { useAuth } from "@clerk/nextjs";
import { VideoGetOneOutput } from "@/types";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import UserInfo from "@/components/user/UserInfo";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionButton from "@/components/watch/SubscriptionButton";

interface WatchOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: VideoGetOneOutput["id"];
}

const WatchOwner = ({ user, videoId }: WatchOwnerProps) => {
  const { userId, isLoaded } = useAuth();
  const { onClick, isPending } = useSubscription({
    userId: user.id,
    fromVideoId: videoId,
  });

  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 minw-0">
      <Link prefetch href={`/users/${user.id}`}>
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
          <Link prefetch href={`/studio/video/${videoId}`}>
            Edit
          </Link>
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
