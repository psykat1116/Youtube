import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";
import { ThumbsDown, ThumbsUp } from "lucide-react";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { VideoGetOneOutput } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface WatchReactionsProps {
  videoId: string;
  like: number;
  dislike: number;
  userReaction: VideoGetOneOutput["userReaction"];
}

const WatchReactions = ({
  videoId,
  like,
  dislike,
  userReaction,
}: WatchReactionsProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const likeMutation = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error(error.message);
      }
    },
  });

  const dislikeMutation = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      } else {
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        onClick={() => likeMutation.mutate({ videoId })}
        className="rounded-l-full rounded-r-none gap-2 pr-4"
        disabled={likeMutation.isPending || dislikeMutation.isPending}
      >
        <ThumbsUp
          className={cn("size-5", userReaction === "like" && "fill-black")}
        />
        {like}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
        onClick={() => dislikeMutation.mutate({ videoId })}
        disabled={likeMutation.isPending || dislikeMutation.isPending}
      >
        <ThumbsDown
          className={cn("size-5", userReaction === "dislike" && "fill-black")}
        />
        {dislike}
      </Button>
    </div>
  );
};

export default WatchReactions;
