"use client";

import { trpc } from "@/trpc/client";
import VideoRowCard, { VideoRowCardSkeleton } from "../video/VideoRowCard";
import VideoGridCard, { VideoGridCardSkeleton } from "../video/VideoGridCard";
import InfiniteScroll from "../InfiniteScroll";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DEFAULT_LIMIT } from "@/constant";

interface SuggestionSectionProps {
  videoId: string;
  isManual?: boolean;
}

const SuggestionSectionSkeleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {[...Array(8)].map((_, i) => (
          <VideoRowCardSkeleton key={i} size="compact" />
        ))}
      </div>
      <div className="block md:hidden space-y-10">
        {[...Array(8)].map((_, i) => (
          <VideoGridCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
};

const SuggestionSection = ({ videoId, isManual }: SuggestionSectionProps) => {
  const [suggestions, query] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  return (
    <Suspense fallback={<SuggestionSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <div className="hidden md:block space-y-3">
          {suggestions.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} size="compact" />
            ))}
        </div>
        <div className="block md:hidden space-y-10">
          {suggestions.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
        <InfiniteScroll
          isManual={isManual}
          hasNextPage={query.hasNextPage}
          isFetchingNextPage={query.isFetchingNextPage}
          fetchNextPage={query.fetchNextPage}
        />
      </ErrorBoundary>
    </Suspense>
  );
};

export default SuggestionSection;
