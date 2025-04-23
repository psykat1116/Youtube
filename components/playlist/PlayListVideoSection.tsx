"use client";

import { toast } from "sonner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constant";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoRowCard, {
  VideoRowCardSkeleton,
} from "@/components/video/VideoRowCard";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/video/VideoGridCard";

interface PlaylistVideoSectionProps {
  playlistId: string;
}

const PlaylistVideoSectionSkeleton = () => {
  return (
    <>
      <div className="md:flex hidden flex-col gap-4 gap-y-10">
        {[...Array(10)].map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact" />
        ))}
      </div>
      <div className="flex md:hidden flex-col gap-4 ">
        {[...Array(10)].map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};

const PlaylistVideoSection = ({ playlistId }: PlaylistVideoSectionProps) => {
  const utils = trpc.useUtils();
  const [videos, query] = trpc.playlists.getVideo.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
      playlistId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const remove = trpc.playlists.removeVideo.useMutation({
    onSuccess: (data) => {
      toast.success(`Video Remove From ${data.name || "Playlist"}`);
      utils.playlists.getMany.invalidate();
      utils.playlists.getForVideo.invalidate({ videoId: data.videoId });
      utils.playlists.getVideo.invalidate({ playlistId: data.playlistId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Suspense fallback={<PlaylistVideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        {videos.pages.flatMap((page) => page.items).length === 0 && (
          <div className="flex flex-col items-center justify-center h-[20rem]">
            <p className="text-center text-xl font-semibold uppercase">
              No videos
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Add videos to this playlist to see them here.
            </p>
          </div>
        )}
        <div className="md:flex flex-col gap-4 hidden">
          {videos.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard
                onRemove={() =>
                  remove.mutate({
                    videoId: video.id,
                    playlistId,
                  })
                }
                key={video.id}
                data={video}
                size="compact"
              />
            ))}
        </div>
        <div className="flex flex-col gap-4 gap-y-10 md:hidden">
          {videos.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard
                onRemove={() =>
                  remove.mutate({
                    videoId: video.id,
                    playlistId,
                  })
                }
                key={video.id}
                data={video}
              />
            ))}
        </div>
        <InfiniteScroll
          hasNextPage={query.hasNextPage}
          fetchNextPage={query.fetchNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export default PlaylistVideoSection;
