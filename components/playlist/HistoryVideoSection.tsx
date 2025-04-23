"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constant";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoRowCard, { VideoRowCardSkeleton } from "@/components/video/VideoRowCard";
import VideoGridCard, { VideoGridCardSkeleton } from "@/components/video/VideoGridCard";

const HistoryVideoSectionSkeleton = () => {
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

const HistoryVideoSection = () => {
  const [videos, query] = trpc.playlists.getHistory.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <Suspense fallback={<HistoryVideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <div className="md:flex flex-col gap-4 hidden">
          {videos.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} size="compact" />
            ))}
        </div>
        <div className="flex flex-col gap-4 gap-y-10 md:hidden">
          {videos.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
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

export default HistoryVideoSection;
