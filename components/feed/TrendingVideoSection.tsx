"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constant";
import InfiniteScroll from "@/components/InfiniteScroll";
import VideoGridCard, {
  VideoGridCardSkeleton,
} from "@/components/video/VideoGridCard";
import Error from "@/components/Error";

const TrendingVideoSectionSkeleton = () => {
  return (
    <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
      {[...Array(10)].map((_, index) => (
        <VideoGridCardSkeleton key={index} />
      ))}
    </div>
  );
};

const TrendingVideoSection = () => {
  const [videos, query] = trpc.videos.getTrending.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <Suspense fallback={<TrendingVideoSectionSkeleton />}>
      <ErrorBoundary fallback={<Error />}>
        {videos.pages.flatMap((page) => page.items).length === 0 && (
          <div className="flex flex-col h-[22rem] items-center justify-center text-center">
            <p className="uppercase text-xl font-semibold">No Videos</p>
            <p className="text-muted-foreground text-sm">
              No trending videos available at the moment. Check back later for
              the latest trends and viral content.
            </p>
          </div>
        )}
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
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

export default TrendingVideoSection;
