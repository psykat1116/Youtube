"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import VideoPlayer from "../video/VideoPlayer";
import WatchBanner from "./WatchBanner";
import WatchTopRow from "./WatchTopRow";

interface WatchSectionProps {
  videoId: string;
}

const WatchSection = ({ videoId }: WatchSectionProps) => {
  const [video] = trpc.videos.getOne.useSuspenseQuery({
    id: videoId,
  });

  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
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
            onPlay={() => {}}
            playbackId={video.muxPlaybackId}
            posterUrl={video.thumbnailUrl}
          />
        </div>
        <WatchBanner status={video.muxStatus} />
        <WatchTopRow video={video}/>
      </ErrorBoundary>
    </Suspense>
  );
};

export default WatchSection;
