"use client";

import { Suspense } from "react";
import { useAuth } from "@clerk/nextjs";
import { ErrorBoundary } from "react-error-boundary";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import WatchBanner from "@/components/watch/WatchBanner";
import VideoPlayer, { VideoPlayerSkeleton } from "@/components/video/VideoPlayer";
import WatchTopRow, { WatchTopRowSkeleton } from "@/components/watch/WatchTopRow";

interface WatchSectionProps {
  videoId: string;
}

const WatchSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <WatchTopRowSkeleton />
    </>
  );
};

const WatchSection = ({ videoId }: WatchSectionProps) => {
  const { isSignedIn } = useAuth();
  const utils = trpc.useUtils();
  const [video] = trpc.videos.getOne.useSuspenseQuery({
    id: videoId,
  });

  const createView = trpc.views.create.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
    },
  });

  const handlePlay = () => {
    if (isSignedIn) {
      createView.mutate({
        videoId,
      });
    }
  };

  return (
    <Suspense fallback={<WatchSectionSkeleton />}>
      <ErrorBoundary
        fallback={<div className="text-center">Something went wrong</div>}
      >
        <div
          className={cn(
            "aspect-video bg-black rounded-lg overflow-hidden relative",
            video.muxStatus !== "ready" && "rounded-b-none"
          )}
        >
          <VideoPlayer
            autoPlay
            onPlay={handlePlay}
            playbackId={video.muxPlaybackId}
            posterUrl={video.thumbnailUrl}
          />
        </div>
        <WatchBanner status={video.muxStatus} />
        <WatchTopRow video={video} />
      </ErrorBoundary>
    </Suspense>
  );
};

export default WatchSection;
